const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.static('public'));

// ─── Persistance tokens (pour Vercel) ────────────────────────────────────────
const TOKEN_FILE = path.join('/tmp', 'strava_tokens.json');
function saveTokens(t) { try { fs.writeFileSync(TOKEN_FILE, JSON.stringify(t)); } catch(e) {} }
function loadTokens() {
  try { if (fs.existsSync(TOKEN_FILE)) return JSON.parse(fs.readFileSync(TOKEN_FILE)); } catch(e) {}
  return { accessToken: null, refreshToken: null, expiresAt: 0, athleteId: null };
}

// ─── Cache en mémoire ────────────────────────────────────────────────────────
const cache = {
  data: {},
  set(key, value, ttlSeconds = 300) {
    this.data[key] = { value, expiresAt: Date.now() + ttlSeconds * 1000 };
  },
  get(key) {
    const entry = this.data[key];
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) { delete this.data[key]; return null; }
    return entry.value;
  }
};

// ─── Dates du plan ────────────────────────────────────────────────────────────
// Plan démarre le lundi 29 juin 2026 (semaine en cours)
const PLAN_START = new Date('2026-06-29');
const RACE_DATE  = new Date('2026-10-11');

// Date de début de récupération des activités Strava (6 mois en arrière)
const FETCH_FROM = new Date('2026-01-01');

const PLAN = [
  { week: 1,  phase: 'reprise',       targetKm: 14, runs: 4, notes: 'Reconstruction — endurance fondamentale pure' },
  { week: 2,  phase: 'reprise',       targetKm: 13, runs: 4, notes: 'Volume progressif — allure conversationnelle' },
  { week: 3,  phase: 'reprise',       targetKm: 18, runs: 4, notes: '⭐ Test VMA 6 min en milieu de semaine' },
  { week: 4,  phase: 'reprise',       targetKm: 21, runs: 4, notes: 'Fartlek léger — réactivation neuromusculaire' },
  { week: 5,  phase: 'reprise',       targetKm: 22, runs: 4, notes: 'Premier fractionné VMA 8×30/30' },
  { week: 6,  phase: 'developpement', targetKm: 25, runs: 4, notes: 'VMA 10×30/30 — volume en hausse' },
  { week: 7,  phase: 'developpement', targetKm: 28, runs: 4, notes: 'Seuil 2×12 min — endurance de vitesse' },
  { week: 8,  phase: 'recuperation',  targetKm: 18, runs: 3, notes: '⬇️ Semaine récupération obligatoire' },
  { week: 9,  phase: 'developpement', targetKm: 32, runs: 4, notes: 'VMA 10×200m — vitesse spécifique' },
  { week: 10, phase: 'developpement', targetKm: 36, runs: 4, notes: 'Seuil + AS10 — première fois à 4:00/km' },
  { week: 11, phase: 'developpement', targetKm: 32, runs: 4, notes: 'VMA 8×400m — pic d\'intensité' },
  { week: 12, phase: 'recuperation',  targetKm: 19, runs: 3, notes: '⬇️ Deuxième semaine de récupération' },
  { week: 13, phase: 'specifique',    targetKm: 29, runs: 4, notes: 'AS10 5×2000m — séance clé spécifique' },
  { week: 14, phase: 'affutage',      targetKm: 20, runs: 4, notes: 'Affûtage — volume -45%, intensité maintenue' },
  { week: 15, phase: 'affutage',      targetKm: 10, runs: 3, notes: '🏁 Semaine de course — repos actif' },
];

// ─── Utilitaires date ────────────────────────────────────────────────────────
function getMonday(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff); d.setHours(0, 0, 0, 0);
  return d;
}

function getWeekNumber(date) {
  const monday = getMonday(date);
  const start  = getMonday(PLAN_START);
  return Math.round((monday - start) / (7 * 24 * 3600 * 1000)) + 1;
}

function getDaysUntilRace() {
  return Math.ceil((RACE_DATE - Date.now()) / (24 * 3600 * 1000));
}

// ─── Auth Strava ──────────────────────────────────────────────────────────────
app.get('/auth/strava', (req, res) => {
  const params = new URLSearchParams({
    client_id:       process.env.STRAVA_CLIENT_ID,
    redirect_uri:    process.env.STRAVA_REDIRECT_URI,
    response_type:   'code',
    scope:           'read,activity:read_all',
    approval_prompt: 'auto'
  });
  res.redirect(`https://www.strava.com/oauth/authorize?${params}`);
});

app.get('/callback', async (req, res) => {
  const { code, error } = req.query;
  if (error || !code) return res.redirect('/?error=access_denied');
  try {
    const r = await axios.post('https://www.strava.com/oauth/token', {
      client_id:     process.env.STRAVA_CLIENT_ID,
      client_secret: process.env.STRAVA_CLIENT_SECRET,
      code,
      grant_type: 'authorization_code'
    });
    const { access_token, refresh_token, expires_at, athlete } = r.data;
    saveTokens({ accessToken: access_token, refreshToken: refresh_token, expiresAt: expires_at, athleteId: athlete.id });
    res.redirect('/?connected=true');
  } catch(err) {
    console.error('OAuth error:', err.response?.data || err.message);
    res.redirect('/?error=oauth_failed');
  }
});

async function getValidToken() {
  const t = loadTokens();
  if (!t.accessToken) throw new Error('not_authenticated');
  if (Date.now() / 1000 < t.expiresAt - 60) return t.accessToken;
  const r = await axios.post('https://www.strava.com/oauth/token', {
    client_id:     process.env.STRAVA_CLIENT_ID,
    client_secret: process.env.STRAVA_CLIENT_SECRET,
    refresh_token: t.refreshToken,
    grant_type:    'refresh_token'
  });
  saveTokens({ ...loadTokens(), accessToken: r.data.access_token, refreshToken: r.data.refresh_token, expiresAt: r.data.expires_at });
  return r.data.access_token;
}

// ─── API Routes ───────────────────────────────────────────────────────────────
app.get('/api/status', (req, res) => {
  const t = loadTokens();
  res.json({ connected: !!t.accessToken, daysUntilRace: getDaysUntilRace() });
});

app.get('/api/athlete', async (req, res) => {
  const t = loadTokens();
  const key = `athlete_${t.athleteId}`;
  const hit = cache.get(key);
  if (hit) return res.json(hit);
  try {
    const token = await getValidToken();
    const r = await axios.get('https://www.strava.com/api/v3/athlete', { headers: { Authorization: `Bearer ${token}` } });
    cache.set(key, r.data, 3600);
    res.json(r.data);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/activities', async (req, res) => {
  const t = loadTokens();
  const key = `acts_${t.athleteId}`;
  const hit = cache.get(key);
  if (hit) return res.json({ ...hit, fromCache: true });

  try {
    const token = await getValidToken();

    // Récupère depuis FETCH_FROM avec pagination pour avoir toutes les activités
    let allRuns = [];
    let page = 1;
    while (true) {
      const r = await axios.get('https://www.strava.com/api/v3/athlete/activities', {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          after:    Math.floor(FETCH_FROM.getTime() / 1000),
          per_page: 200,
          page
        }
      });
      const batch = r.data.filter(a => ['Run', 'VirtualRun'].includes(a.type));
      allRuns = allRuns.concat(batch);
      if (r.data.length < 200) break; // plus de pages
      page++;
      if (page > 5) break; // sécurité max 1000 activités
    }

    const weeksMap = {};
    allRuns.forEach(run => {
      const monday = getMonday(new Date(run.start_date));
      const k = monday.toISOString().split('T')[0];
      if (!weeksMap[k]) weeksMap[k] = {
        date: k, weekNum: getWeekNumber(monday), runs: [],
        totalDistance: 0, totalTime: 0, totalElevation: 0,
        heartrateList: [], paceList: []
      };
      const w = weeksMap[k];
      w.runs.push({
        id: run.id, name: run.name, date: run.start_date,
        distance: run.distance, movingTime: run.moving_time,
        elevation: run.total_elevation_gain, avgHr: run.average_heartrate,
        avgSpeed: run.average_speed
      });
      w.totalDistance  += run.distance;
      w.totalTime      += run.moving_time;
      w.totalElevation += run.total_elevation_gain;
      if (run.average_heartrate) w.heartrateList.push(run.average_heartrate);
      if (run.average_speed > 0) w.paceList.push(1000 / run.average_speed);
    });

    const weeks = Object.values(weeksMap).map(w => {
      const plan    = PLAN.find(p => p.week === w.weekNum) || null;
      const avgHr   = w.heartrateList.length ? Math.round(w.heartrateList.reduce((a,b)=>a+b,0)/w.heartrateList.length) : null;
      const avgPace = w.paceList.length ? w.paceList.reduce((a,b)=>a+b,0)/w.paceList.length : null;
      const kmDone  = parseFloat((w.totalDistance/1000).toFixed(2));
      return {
        date: w.date, weekNum: w.weekNum, runs: w.runs,
        runCount: w.runs.length, kmDone,
        totalTime: w.totalTime, totalElevation: Math.round(w.totalElevation),
        avgHeartrate: avgHr, avgPace,
        plan: plan ? { targetKm: plan.targetKm, targetRuns: plan.runs, phase: plan.phase, notes: plan.notes } : null,
        vsTarget: plan ? parseFloat((kmDone - plan.targetKm).toFixed(2)) : null
      };
    }).sort((a,b) => new Date(b.date) - new Date(a.date));

    const currentWeekKey  = getMonday(new Date()).toISOString().split('T')[0];
    const currentWeek     = weeks.find(w => w.date === currentWeekKey) || null;
    const currentPlanWeek = getWeekNumber(new Date());

    const result = { weeks, currentWeek, currentPlanWeek, plan: PLAN, daysUntilRace: getDaysUntilRace() };
    cache.set(key, result, 300);
    res.json(result);
  } catch(e) {
    console.error('Activities error:', e.response?.data || e.message);
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/refresh', (req, res) => {
  cache.data = {};
  res.json({ ok: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`\n  Strava Dashboard → http://localhost:${PORT}\n`));
