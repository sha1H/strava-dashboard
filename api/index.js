const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.static('public'));

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

// ─── Token store ─────────────────────────────────────────────────────────────
let tokenStore = { accessToken: null, refreshToken: null, expiresAt: 0, athleteId: null };

// ─── Plan d'entraînement (15 semaines, début auto-calculé) ───────────────────
// Semaine 1 = semaine du lundi 30 juin 2025 (ajuste si besoin)
const PLAN_START = new Date('2025-06-30');
const RACE_DATE  = new Date('2026-10-11');

const PLAN = [
  { week: 1,  phase: 'reprise',      targetKm: 10, runs: 4, notes: 'Très facile, écoute ton corps' },
  { week: 2,  phase: 'reprise',      targetKm: 15, runs: 4, notes: 'Allure conversationnelle' },
  { week: 3,  phase: 'reprise',      targetKm: 20, runs: 4, notes: 'Introduis 1 sortie tempo courte' },
  { week: 4,  phase: 'reprise',      targetKm: 28, runs: 4, notes: 'Première sortie longue 10km' },
  { week: 5,  phase: 'developpement',targetKm: 30, runs: 4, notes: 'Premier fractionné 4×1000m' },
  { week: 6,  phase: 'developpement',targetKm: 34, runs: 4, notes: '5×1000m à 4:00/km' },
  { week: 7,  phase: 'developpement',targetKm: 38, runs: 4, notes: 'Tempo 25min à 4:10/km' },
  { week: 8,  phase: 'recuperation', targetKm: 28, runs: 3, notes: 'Semaine de récupération' },
  { week: 9,  phase: 'developpement',targetKm: 40, runs: 4, notes: '6×1000m à 3:58/km' },
  { week: 10, phase: 'developpement',targetKm: 45, runs: 4, notes: 'Tempo 30min à 4:05/km' },
  { week: 11, phase: 'developpement',targetKm: 50, runs: 4, notes: '3×2000m à 4:00/km' },
  { week: 12, phase: 'recuperation', targetKm: 35, runs: 3, notes: 'Semaine de récupération' },
  { week: 13, phase: 'affutage',     targetKm: 35, runs: 4, notes: 'Maintien intensité, volume -30%' },
  { week: 14, phase: 'affutage',     targetKm: 25, runs: 4, notes: 'Dernière séance fractionné J-10' },
  { week: 15, phase: 'affutage',     targetKm: 15, runs: 3, notes: 'Repos actif, jogging léger uniquement' },
];

// ─── Utilitaires date ────────────────────────────────────────────────────────
function getMonday(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function getWeekNumber(date) {
  const monday = getMonday(date);
  const start = getMonday(PLAN_START);
  const diff = (monday - start) / (7 * 24 * 3600 * 1000);
  return Math.round(diff) + 1;
}

function getDaysUntilRace() {
  return Math.ceil((RACE_DATE - Date.now()) / (24 * 3600 * 1000));
}

// ─── ROUTE : Auth Strava ─────────────────────────────────────────────────────
app.get('/auth/strava', (req, res) => {
  const params = new URLSearchParams({
    client_id:     process.env.STRAVA_CLIENT_ID,
    redirect_uri:  process.env.STRAVA_REDIRECT_URI,
    response_type: 'code',
    scope:         'read,activity:read_all',
    approval_prompt: 'auto'
  });
  res.redirect(`https://www.strava.com/oauth/authorize?${params}`);
});

// ─── ROUTE : Callback OAuth ──────────────────────────────────────────────────
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
    tokenStore = { accessToken: access_token, refreshToken: refresh_token, expiresAt: expires_at, athleteId: athlete.id };
    res.redirect('/?connected=true');
  } catch (err) {
    console.error('OAuth error:', err.response?.data || err.message);
    res.redirect('/?error=oauth_failed');
  }
});

// ─── Rafraîchit le token si besoin ───────────────────────────────────────────
async function getValidToken() {
  if (!tokenStore.accessToken) throw new Error('not_authenticated');
  if (Date.now() / 1000 < tokenStore.expiresAt - 60) return tokenStore.accessToken;
  const r = await axios.post('https://www.strava.com/oauth/token', {
    client_id:     process.env.STRAVA_CLIENT_ID,
    client_secret: process.env.STRAVA_CLIENT_SECRET,
    refresh_token: tokenStore.refreshToken,
    grant_type:    'refresh_token'
  });
  tokenStore.accessToken  = r.data.access_token;
  tokenStore.refreshToken = r.data.refresh_token;
  tokenStore.expiresAt    = r.data.expires_at;
  return tokenStore.accessToken;
}

// ─── ROUTE : Statut ──────────────────────────────────────────────────────────
app.get('/api/status', (req, res) => {
  res.json({ connected: !!tokenStore.accessToken, daysUntilRace: getDaysUntilRace() });
});

// ─── ROUTE : Profil athlète ───────────────────────────────────────────────────
app.get('/api/athlete', async (req, res) => {
  const key = `athlete_${tokenStore.athleteId}`;
  const hit = cache.get(key);
  if (hit) return res.json(hit);
  try {
    const token = await getValidToken();
    const r = await axios.get('https://www.strava.com/api/v3/athlete', {
      headers: { Authorization: `Bearer ${token}` }
    });
    cache.set(key, r.data, 3600);
    res.json(r.data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ─── ROUTE : Activités + plan comparé ────────────────────────────────────────
app.get('/api/activities', async (req, res) => {
  const key = `acts_${tokenStore.athleteId}`;
  const hit = cache.get(key);
  if (hit) return res.json({ ...hit, fromCache: true });

  try {
    const token = await getValidToken();
    const after = Math.floor((PLAN_START.getTime()) / 1000);

    const r = await axios.get('https://www.strava.com/api/v3/athlete/activities', {
      headers: { Authorization: `Bearer ${token}` },
      params:  { after, per_page: 200 }
    });

    const runs = r.data.filter(a => ['Run', 'VirtualRun'].includes(a.type));

    // Groupe par semaine
    const weeksMap = {};
    runs.forEach(run => {
      const monday = getMonday(new Date(run.start_date));
      const key    = monday.toISOString().split('T')[0];
      if (!weeksMap[key]) {
        weeksMap[key] = {
          date:          key,
          weekNum:       getWeekNumber(monday),
          runs:          [],
          totalDistance: 0,
          totalTime:     0,
          totalElevation:0,
          heartrateList: [],
          paceList:      []
        };
      }
      const w = weeksMap[key];
      w.runs.push({ id: run.id, name: run.name, date: run.start_date, distance: run.distance, movingTime: run.moving_time, elevation: run.total_elevation_gain, avgHr: run.average_heartrate, avgSpeed: run.average_speed });
      w.totalDistance  += run.distance;
      w.totalTime      += run.moving_time;
      w.totalElevation += run.total_elevation_gain;
      if (run.average_heartrate) w.heartrateList.push(run.average_heartrate);
      if (run.average_speed > 0) w.paceList.push(1000 / run.average_speed);
    });

    // Calcule moyennes + compare au plan
    const weeks = Object.values(weeksMap).map(w => {
      const plan = PLAN.find(p => p.week === w.weekNum) || null;
      const avgHr   = w.heartrateList.length ? Math.round(w.heartrateList.reduce((a,b)=>a+b,0)/w.heartrateList.length) : null;
      const avgPace = w.paceList.length ? w.paceList.reduce((a,b)=>a+b,0)/w.paceList.length : null;
      const kmDone  = parseFloat((w.totalDistance/1000).toFixed(2));
      return {
        date:          w.date,
        weekNum:       w.weekNum,
        runs:          w.runs,
        runCount:      w.runs.length,
        kmDone,
        totalTime:     w.totalTime,
        totalElevation:Math.round(w.totalElevation),
        avgHeartrate:  avgHr,
        avgPace,
        plan: plan ? { targetKm: plan.targetKm, targetRuns: plan.runs, phase: plan.phase, notes: plan.notes } : null,
        vsTarget: plan ? parseFloat((kmDone - plan.targetKm).toFixed(2)) : null
      };
    }).sort((a,b) => new Date(b.date) - new Date(a.date));

    // Semaine en cours
    const currentWeekKey = getMonday(new Date()).toISOString().split('T')[0];
    const currentWeek = weeks.find(w => w.date === currentWeekKey) || null;
    const currentPlanWeek = getWeekNumber(new Date());

    const result = { weeks, currentWeek, currentPlanWeek, plan: PLAN, daysUntilRace: getDaysUntilRace() };
    cache.set(key, result, 300);
    res.json(result);
  } catch (e) {
    console.error('Activities error:', e.response?.data || e.message);
    res.status(500).json({ error: e.message });
  }
});

// ─── ROUTE : Invalide le cache manuellement ───────────────────────────────────
app.post('/api/refresh', (req, res) => {
  cache.data = {};
  res.json({ ok: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`\n  Strava Dashboard → http://localhost:${PORT}\n`));
