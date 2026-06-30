/* app.js — Training Dashboard avec navigation + matching séances */

// ── Plan détaillé 15 semaines ────────────────────────────────────────────────
const PLAN_DETAIL = [
  {
    week: 1, phase: 'reprise', targetKm: 14, runs: 4,
    notes: 'Première semaine de reprise. Priorité absolue : écouter ton corps.',
    seances: [
      { type: 'endurance', titre: 'Footing EF', distance: '25 min', allure: '5:50–6:10/km', fc: '65–72% FCM', description: 'Footing en endurance fondamentale pure. Tu dois pouvoir tenir une conversation complète sans effort.' },
      { type: 'renforcement', titre: 'Renforcement musculaire A', distance: '20 min', allure: 'Hors course', fc: '—', description: 'Circuit : 3×15 squats, 3×10 fentes alternées, 3×30 sec planche, 3×20 montées de genoux, 2×15 mollets.' },
      { type: 'endurance', titre: 'Footing EF', distance: '25 min', allure: '5:50–6:10/km', fc: '65–72% FCM', description: 'Même consigne. Focus sur la foulée : attaque talon-milieu, cadence ~170-175 pas/min.' },
      { type: 'endurance', titre: 'Sortie longue EF', distance: '35–40 min', allure: '6:00–6:20/km', fc: '<140 bpm', description: 'Ta sortie longue de la semaine. L\'objectif est le temps sur pied, pas les kilomètres.' },
    ]
  },
  {
    week: 2, phase: 'reprise', targetKm: 13, runs: 4,
    notes: 'On augmente le volume très progressivement.',
    seances: [
      { type: 'endurance', titre: 'Footing EF', distance: '30 min', allure: '5:45–6:05/km', fc: '65–72% FCM', description: 'Légère progression du volume. Note tes sensations après la sortie.' },
      { type: 'renforcement', titre: 'Renforcement musculaire B', distance: '20 min', allure: 'Hors course', fc: '—', description: 'Circuit B : 3×12 soulevé de terre poids de corps, 3×10 pont fessier, 3×30 sec gainage latéral, 3×15 écart jambes élastique.' },
      { type: 'velo', titre: 'Vélo récupération (optionnel)', distance: '30–45 min', allure: 'Très facile', fc: '<130 bpm', description: 'Alternative à un footing. Le vélo maintient le cardio sans impacter les tendons.' },
      { type: 'endurance', titre: 'Sortie longue EF', distance: '45 min', allure: '5:50–6:10/km', fc: '<140 bpm', description: 'Sortie longue qui progresse. Reste à allure conversationnelle.' },
    ]
  },
  {
    week: 3, phase: 'reprise', targetKm: 18, runs: 4,
    notes: '⭐ SEMAINE CLÉ : Test VMA en milieu de semaine. Il va calibrer toutes tes allures de fractionné.',
    seances: [
      { type: 'endurance', titre: 'Footing EF', distance: '35 min', allure: '5:40–6:00/km', fc: '65–72% FCM', description: 'Footing facile. Prépare-toi mentalement au test VMA dans 2 jours.' },
      { type: 'test', titre: '🔬 Test VMA 6 minutes', distance: '3–4 km total', allure: 'Effort maximal 6 min', fc: 'Max', description: 'Échauffement 15 min + 3 accélérations de 80m → cours 6 min en effort maximal → mesure la distance. VMA = distance (m) ÷ 100.' },
      { type: 'renforcement', titre: 'Renforcement musculaire A', distance: '20 min', allure: 'Hors course', fc: '—', description: 'Circuit A. Le lendemain du test : pas d\'impact, mais travail continu.' },
      { type: 'endurance', titre: 'Sortie longue EF', distance: '50 min', allure: '5:50–6:10/km', fc: '<140 bpm', description: 'Sortie longue classique. Après le test, reste très tranquille.' },
    ]
  },
  {
    week: 4, phase: 'reprise', targetKm: 21, runs: 4,
    notes: 'Première séance de qualité légère avec accélérations courtes.',
    seances: [
      { type: 'endurance', titre: 'Footing EF + fartlek', distance: '35 min', allure: 'EF + 6×30 sec vif', fc: '65-75% + pics', description: 'Footing EF 20 min → 6 accélérations de 30 sec à allure vive avec 1 min récup → retour calme 5 min.' },
      { type: 'renforcement', titre: 'Renforcement musculaire B', distance: '25 min', allure: 'Hors course', fc: '—', description: 'Circuit B enrichi : 2×10 pistol squat assisté, 3×12 Romanian deadlift unilatéral.' },
      { type: 'endurance', titre: 'Footing EF', distance: '35 min', allure: '5:40–5:55/km', fc: '65–72% FCM', description: 'Footing tranquille. L\'allure commence à s\'améliorer naturellement.' },
      { type: 'endurance', titre: 'Sortie longue EF', distance: '55 min', allure: '5:45–6:05/km', fc: '<140 bpm', description: 'Sortie longue en progression. Les 15 dernières minutes peuvent être légèrement soutenues.' },
    ]
  },
  {
    week: 5, phase: 'reprise', targetKm: 22, runs: 4,
    notes: 'Fin de la phase de reconstruction. Premier vrai fractionné court.',
    seances: [
      { type: 'endurance', titre: 'Footing EF', distance: '40 min', allure: '5:35–5:50/km', fc: '65–72% FCM', description: 'Ton allure d\'endurance s\'est déjà améliorée par rapport à S1.' },
      { type: 'fractionne', titre: 'VMA court 8×30/30', distance: '5 km total', allure: '95-100% VMA', fc: 'Zone 4-5', description: 'Échauffement 15 min + PPG → 8×30 sec à 95-100% VMA avec 30 sec récup → retour calme 10 min.' },
      { type: 'renforcement', titre: 'Renforcement musculaire A', distance: '25 min', allure: 'Hors course', fc: '—', description: 'Circuit A. Après un fractionné, le renforcement le lendemain est parfait.' },
      { type: 'endurance', titre: 'Sortie longue EF', distance: '60 min', allure: '5:40–6:00/km', fc: '<140 bpm', description: 'Première vraie sortie longue d\'une heure.' },
    ]
  },
  {
    week: 6, phase: 'developpement', targetKm: 25, runs: 4,
    notes: 'Entrée dans le développement. Alternance VMA et seuil chaque semaine.',
    seances: [
      { type: 'endurance', titre: 'Footing EF', distance: '40 min', allure: '5:30–5:45/km', fc: '65–72% FCM', description: 'Footing de base. Ton allure d\'endurance s\'améliore semaine après semaine.' },
      { type: 'fractionne', titre: 'VMA court 10×30/30', distance: '6 km total', allure: '95-100% VMA', fc: 'Zone 4-5', description: 'Échauffement 15 min → 10×30 sec à 95-100% VMA avec 30 sec récup → retour calme 10 min.' },
      { type: 'renforcement', titre: 'Renforcement musculaire B', distance: '25 min', allure: 'Hors course', fc: '—', description: 'Circuit B. Ajoute des pompes nordiques si possible.' },
      { type: 'endurance', titre: 'Sortie longue EF', distance: '65 min', allure: '5:35–5:55/km', fc: '<140 bpm', description: 'Sortie longue qui continue de progresser.' },
    ]
  },
  {
    week: 7, phase: 'developpement', targetKm: 28, runs: 4,
    notes: 'Semaine seuil. Le seuil développe ta capacité à tenir l\'allure 10km longtemps.',
    seances: [
      { type: 'endurance', titre: 'Footing EF', distance: '40 min', allure: '5:25–5:40/km', fc: '65–72% FCM', description: 'Footing classique. Échauffement soigné avant la séance seuil.' },
      { type: 'tempo', titre: 'Seuil 2×12 min', distance: '8 km total', allure: '83-88% VMA (~4:40-4:50/km)', fc: 'Zone 3-4', description: 'Échauffement 15 min → 2×12 min à allure seuil avec 3 min récup → retour calme 10 min.' },
      { type: 'renforcement', titre: 'Renforcement musculaire A', distance: '25 min', allure: 'Hors course', fc: '—', description: 'Circuit A. Augmente progressivement la difficulté.' },
      { type: 'endurance', titre: 'Sortie longue EF', distance: '70 min', allure: '5:35–5:50/km', fc: '<140 bpm', description: 'Sortie longue en progression.' },
    ]
  },
  {
    week: 8, phase: 'recuperation', targetKm: 18, runs: 3,
    notes: '⬇️ Semaine de récupération obligatoire. Le corps s\'adapte pendant le repos.',
    seances: [
      { type: 'endurance', titre: 'Footing EF léger', distance: '35 min', allure: '5:45–6:00/km', fc: '<135 bpm', description: 'Plus lent et plus court. Profite de cette semaine pour bien dormir.' },
      { type: 'velo', titre: 'Vélo récupération active', distance: '45 min', allure: 'Très facile', fc: '<125 bpm', description: 'Séance vélo légère pour maintenir l\'activité sans fatiguer.' },
      { type: 'endurance', titre: 'Sortie longue réduite', distance: '50 min', allure: '5:45–6:05/km', fc: '<135 bpm', description: 'Sortie longue réduite et confortable.' },
    ]
  },
  {
    week: 9, phase: 'developpement', targetKm: 32, runs: 4,
    notes: 'Retour en force. Introduction des 200m à VMA.',
    seances: [
      { type: 'endurance', titre: 'Footing EF', distance: '45 min', allure: '5:20–5:35/km', fc: '65–72% FCM', description: 'Ton allure EF a bien progressé.' },
      { type: 'fractionne', titre: 'VMA 10×200m', distance: '7 km total', allure: '95-100% VMA', fc: 'Zone 4-5', description: 'Échauffement 15 min + PPG → 10×200m à 95-100% VMA avec 1 min 15 récup → retour calme 10 min.' },
      { type: 'renforcement', titre: 'Renforcement musculaire B', distance: '30 min', allure: 'Hors course', fc: '—', description: 'Circuit B progressif avec poids léger optionnel.' },
      { type: 'endurance', titre: 'Sortie longue EF', distance: '75 min', allure: '5:30–5:50/km', fc: '<140 bpm', description: 'Nouvelle durée record du plan.' },
    ]
  },
  {
    week: 10, phase: 'developpement', targetKm: 36, runs: 4,
    notes: 'Introduction de l\'allure spécifique 10km (4:00/km).',
    seances: [
      { type: 'endurance', titre: 'Footing EF', distance: '45 min', allure: '5:15–5:30/km', fc: '65–72% FCM', description: 'Ton allure EF se rapproche de l\'allure marathon.' },
      { type: 'tempo', titre: 'Seuil + AS10 : 3×10 min', distance: '10 km total', allure: '10min seuil + 10min AS10 + 10min seuil', fc: 'Zone 3-4', description: 'Échauffement 15 min → 10min seuil → 2min récup → 10min AS10 (4:00/km) → 2min récup → 10min seuil → calme 10 min.' },
      { type: 'renforcement', titre: 'Renforcement musculaire A', distance: '30 min', allure: 'Hors course', fc: '—', description: 'Circuit A avancé avec sauts : box jump, sauts jambes tendues.' },
      { type: 'endurance', titre: 'Sortie longue EF', distance: '80 min', allure: '5:30–5:45/km', fc: '<140 bpm', description: 'Sortie longue maximale.' },
    ]
  },
  {
    week: 11, phase: 'developpement', targetKm: 32, runs: 4,
    notes: 'Pic de volume et d\'intensité. Fractionné monte à 400m.',
    seances: [
      { type: 'endurance', titre: 'Footing EF', distance: '50 min', allure: '5:10–5:25/km', fc: '65–72% FCM', description: 'Footing long de base.' },
      { type: 'fractionne', titre: 'VMA 8×400m', distance: '8 km total', allure: '95% VMA', fc: 'Zone 4-5', description: 'Échauffement 15 min → 8×400m à 95% VMA avec 1min30 récup → retour calme 10 min.' },
      { type: 'renforcement', titre: 'Renforcement musculaire B', distance: '30 min', allure: 'Hors course', fc: '—', description: 'Circuit B complet avec sauts.' },
      { type: 'endurance', titre: 'Sortie longue EF', distance: '80 min', allure: '5:25–5:40/km', fc: '<140 bpm', description: 'Maintien de la sortie longue maximale.' },
    ]
  },
  {
    week: 12, phase: 'recuperation', targetKm: 19, runs: 3,
    notes: '⬇️ Deuxième semaine de récupération. Indispensable avant la phase spécifique.',
    seances: [
      { type: 'endurance', titre: 'Footing EF léger', distance: '35 min', allure: '5:30–5:45/km', fc: '<135 bpm', description: 'Footing léger. Profite pour prendre soin de toi.' },
      { type: 'fractionne', titre: 'VMA court 8×30/30', distance: '5 km total', allure: '95% VMA', fc: 'Zone 4', description: 'Maintien de la vitesse mais volume réduit.' },
      { type: 'endurance', titre: 'Sortie longue réduite', distance: '50 min', allure: '5:30–5:45/km', fc: '<135 bpm', description: 'Sortie longue allégée.' },
    ]
  },
  {
    week: 13, phase: 'specifique', targetKm: 29, runs: 4,
    notes: '⭐ Phase spécifique. Les séances clés se font à 4:00/km (AS10).',
    seances: [
      { type: 'endurance', titre: 'Footing EF', distance: '40 min', allure: '5:10–5:25/km', fc: '65–72% FCM', description: 'Footing de base. Ton EF devrait être confortable.' },
      { type: 'fractionne', titre: 'AS10 : 5×2000m', distance: '11 km total', allure: '4:00/km', fc: 'Zone 4', description: 'Échauffement 15 min → 5×2000m à 4:00/km avec 2 min récup → retour calme 10 min. Séance la plus spécifique.' },
      { type: 'renforcement', titre: 'Renforcement léger', distance: '20 min', allure: 'Hors course', fc: '—', description: 'Circuit léger d\'entretien.' },
      { type: 'endurance', titre: 'Sortie longue EF', distance: '65 min', allure: '5:20–5:35/km', fc: '<140 bpm', description: 'Sortie longue qui diminue. Fin à AS10 si bonnes sensations.' },
    ]
  },
  {
    week: 14, phase: 'affutage', targetKm: 20, runs: 4,
    notes: '⬇️ Affûtage. Volume -45%. Intensité maintenue sur distances courtes.',
    seances: [
      { type: 'endurance', titre: 'Footing EF', distance: '30 min', allure: '5:10–5:25/km', fc: '65–72% FCM', description: 'Footing léger. Fatigue passagère normale pendant l\'affûtage.' },
      { type: 'fractionne', titre: 'AS10 court : 6×1000m', distance: '7 km total', allure: '4:00/km', fc: 'Zone 4', description: 'Échauffement 15 min → 6×1000m à 4:00/km avec 90 sec récup → retour calme 10 min.' },
      { type: 'endurance', titre: 'Footing EF court', distance: '25 min', allure: '5:20–5:40/km', fc: '<135 bpm', description: 'Très court, très facile.' },
      { type: 'endurance', titre: 'Sortie courte avec strides', distance: '30 min', allure: 'EF + 4×100m', fc: '<135 bpm', description: 'Footing 20 min → 4 accélérations de 100m → retour 5 min.' },
    ]
  },
  {
    week: 15, phase: 'affutage', targetKm: 10, runs: 3,
    notes: '🏁 Semaine de course. Repos actif uniquement.',
    seances: [
      { type: 'recuperation', titre: 'Jogging très léger', distance: '20 min', allure: '6:00–6:30/km', fc: '<125 bpm', description: 'Lundi ou mardi. Ultra léger, quasi de la marche rapide.' },
      { type: 'recuperation', titre: 'Activation J-3 ou J-4', distance: '15 min + strides', allure: '6:00/km + 4×80m', fc: '<130 bpm', description: 'Footing 10 min → 4 accélérations de 80m → marche 5 min.' },
      { type: 'course', titre: '🏁 10km — Objectif sub 40 !', distance: '10 km', allure: '3:58–4:00/km', fc: 'Zone 4-5', description: 'Km 1 à 4:05/km. Km 2-7 à 4:00/km. Km 8-9 accélère. Km 10 tout donner. Tu as fait 37:50 il y a 3 ans, ce niveau est en toi.' },
    ]
  },
];

const SEANCE_COLORS = {
  endurance:    { bg: 'rgba(59,130,246,0.1)',   border: '#3b82f6', label: 'Endurance' },
  fractionne:   { bg: 'rgba(252,76,2,0.1)',     border: '#fc4c02', label: 'Fractionné' },
  tempo:        { bg: 'rgba(168,85,247,0.1)',   border: '#a855f7', label: 'Tempo / Seuil' },
  recuperation: { bg: 'rgba(34,197,94,0.1)',    border: '#22c55e', label: 'Récupération' },
  renforcement: { bg: 'rgba(99,102,241,0.1)',   border: '#6366f1', label: 'Renforcement' },
  velo:         { bg: 'rgba(20,184,166,0.1)',   border: '#14b8a6', label: 'Vélo' },
  test:         { bg: 'rgba(251,191,36,0.1)',   border: '#fbbf24', label: 'Test VMA' },
  course:       { bg: 'rgba(251,191,36,0.15)',  border: '#fbbf24', label: '🏁 Course' },
};

// ── Utilitaires formatage ────────────────────────────────────────────────────
const fmt = {
  km:    v => v != null ? v.toFixed(1) : '—',
  pace:  v => { if (!v) return '—'; const t = Math.round(v); return `${Math.floor(t/60)}:${String(t%60).padStart(2,'0')}`; },
  time:  v => { if (!v) return '—'; const h = Math.floor(v/3600), m = Math.floor((v%3600)/60); return h > 0 ? `${h}h${String(m).padStart(2,'0')}` : `${m}min`; },
  date:  v => new Date(v).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }),
  dateLong: v => new Date(v).toLocaleDateString('fr-FR', { weekday: 'short', day: '2-digit', month: 'short' }),
  phase: v => ({ reprise:'Reprise', developpement:'Développement', recuperation:'Récupération', affutage:'Affûtage', specifique:'Spécifique' }[v] || v),
};

// ── Parse allure cible d'une séance → secondes/km min et max ─────────────────
function parseTargetPace(allure) {
  const m = allure.match(/(\d+):(\d+)\s*(?:[–\-]\s*(\d+):(\d+))?\/km/);
  if (!m) return null;
  const p1 = parseInt(m[1]) * 60 + parseInt(m[2]);
  const p2 = m[3] ? parseInt(m[3]) * 60 + parseInt(m[4]) : p1;
  return { min: Math.min(p1, p2), max: Math.max(p1, p2) };
}

// ── Calcul km réels par séance (temps + allure) ───────────────────────────────
function calcKmFromSeance(seance) {
  if (['renforcement', 'velo'].includes(seance.type)) return 0;
  const dist = seance.distance.toLowerCase();
  const kmMatch = dist.match(/^(\d+(?:[.,]\d+)?)\s*km/);
  if (kmMatch) return parseFloat(kmMatch[1].replace(',', '.'));
  const kmRangeMatch = dist.match(/(\d+(?:[.,]\d+)?)\s*[–\-]\s*(\d+(?:[.,]\d+)?)\s*km/);
  if (kmRangeMatch) return (parseFloat(kmRangeMatch[1]) + parseFloat(kmRangeMatch[2])) / 2;
  const minMatch = dist.match(/(\d+)(?:\s*[–\-]\s*(\d+))?\s*min/);
  if (minMatch) {
    const minutes = minMatch[2] ? (parseInt(minMatch[1]) + parseInt(minMatch[2])) / 2 : parseInt(minMatch[1]);
    const pace = parseTargetPace(seance.allure);
    if (pace) return parseFloat(((minutes * 60) / ((pace.min + pace.max) / 2)).toFixed(2));
    const def = { endurance:360, recuperation:390, tempo:285, fractionne:300, test:330, course:239 }[seance.type] || 360;
    return parseFloat(((minutes * 60) / def).toFixed(2));
  }
  return 0;
}

function computePlanKm(plan) {
  return plan.map(week => ({ ...week, targetKm: parseFloat(week.seances.reduce((s, x) => s + calcKmFromSeance(x), 0).toFixed(1)) }));
}

// ── Cache local ───────────────────────────────────────────────────────────────
const localCache = {
  KEY: 'strava_dash_v2',
  set(data) { try { localStorage.setItem(this.KEY, JSON.stringify({ data, ts: Date.now() })); } catch(e) {} },
  get(maxAgeMs = 5 * 60 * 1000) {
    try { const raw = localStorage.getItem(this.KEY); if (!raw) return null;
      const { data, ts } = JSON.parse(raw);
      return Date.now() - ts < maxAgeMs ? data : null;
    } catch(e) { return null; }
  },
  clear() { try { localStorage.removeItem(this.KEY); } catch(e) {} }
};

const $ = id => document.getElementById(id);
let chartInstance = null;
let currentPeriod = 'hebdo';
let globalData = null;

// ── Toast ─────────────────────────────────────────────────────────────────────
function showToast(msg) {
  const t = $('toast');
  t.textContent = msg;
  t.classList.remove('hidden');
  setTimeout(() => t.classList.add('hidden'), 2500);
}

// ── Navigation ────────────────────────────────────────────────────────────────
function goPage(page) {
  document.querySelectorAll('.page').forEach(p => { p.classList.remove('active'); p.classList.add('hidden'); });
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  $(`page-${page}`).classList.remove('hidden');
  $(`page-${page}`).classList.add('active');
  document.querySelector(`.nav-item[data-page="${page}"]`).classList.add('active');
}

// ── Init ──────────────────────────────────────────────────────────────────────
(async function init() {
  const params = new URLSearchParams(location.search);
  if (params.get('error')) { $('login-error').classList.remove('hidden'); showScreen('login'); return; }

  const status = await fetch('/api/status').then(r => r.json()).catch(() => ({ connected: false }));
  if (!status.connected) { showScreen('login'); return; }
  if (params.get('connected')) history.replaceState({}, '', '/');

  $('days-count').textContent = status.daysUntilRace;
  showScreen('app');

  fetch('/api/athlete').then(r => r.json()).then(a => {
    if (a && a.firstname) {
      $('athlete-name').textContent = `${a.firstname} ${a.lastname || ''}`.trim();
      $('athlete-avatar').textContent = `${a.firstname[0]}${a.lastname ? a.lastname[0] : ''}`.toUpperCase();
    }
  }).catch(() => {});

  const cached = localCache.get();
  if (cached) { renderAll(cached); }
  else { loadActivities(); }

  renderProgramme();
})();

function refreshData() {
  localCache.clear();
  loadActivities(true);
}

// ── Chargement activités ──────────────────────────────────────────────────────
async function loadActivities(force = false) {
  const btn = $('btn-refresh');
  btn.classList.add('spinning');
  try {
    if (force) await fetch('/api/refresh', { method: 'POST' });
    const data = await fetch('/api/activities').then(r => r.json());
    if (data.error) throw new Error(data.error);
    localCache.set(data);
    renderAll(data);
    showToast(data.fromCache ? 'Cache serveur · actualise dans 5 min' : 'Données actualisées');
  } catch(e) {
    showToast('Erreur : ' + e.message);
  } finally {
    btn.classList.remove('spinning');
  }
}

// ── Rendu global ──────────────────────────────────────────────────────────────
function renderAll(data) {
  const planWithKm = computePlanKm(PLAN_DETAIL);
  data.plan = data.plan.map(p => {
    const computed = planWithKm.find(x => x.week === p.week);
    return computed ? { ...p, targetKm: computed.targetKm } : p;
  });
  globalData = data;
  const { weeks, daysUntilRace, currentPlanWeek } = data;
  $('days-count').textContent = daysUntilRace;
  $('sidebar-week').textContent = currentPlanWeek > 0 ? currentPlanWeek : '—';

  renderHero(data);
  renderStats(data);
  renderChart(weeks, data.plan);
  renderSeancesMatching(data);
  renderHistory(weeks);
  renderRecentRuns(weeks);
}

// ── Hero section ──────────────────────────────────────────────────────────────
function renderHero(data) {
  const planWeek = data.plan.find(p => p.week === data.currentPlanWeek);
  $('hero-week-badge').textContent = `S${data.currentPlanWeek > 0 ? data.currentPlanWeek : '—'}`;
  if (planWeek) {
    $('hero-week-phase').textContent = fmt.phase(planWeek.phase);
    $('hero-week-note').textContent = planWeek.notes;
  }
}

// ── Toggle période ────────────────────────────────────────────────────────────
function setPeriod(period) {
  currentPeriod = period;
  $('btn-hebdo').classList.toggle('active', period === 'hebdo');
  $('btn-mensuel').classList.toggle('active', period === 'mensuel');
  if (globalData) renderStats(globalData);
}

function getMonthStats(weeks) {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd   = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const monthWeeks = weeks.filter(w => { const d = new Date(w.date); return d >= monthStart && d <= monthEnd; });
  if (!monthWeeks.length) return null;
  const kmDone = parseFloat(monthWeeks.reduce((s, w) => s + w.kmDone, 0).toFixed(1));
  const runCount = monthWeeks.reduce((s, w) => s + w.runCount, 0);
  const totalTime = monthWeeks.reduce((s, w) => s + w.totalTime, 0);
  const totalElevation = monthWeeks.reduce((s, w) => s + w.totalElevation, 0);
  const hrList = monthWeeks.filter(w => w.avgHeartrate).map(w => w.avgHeartrate);
  const avgHeartrate = hrList.length ? Math.round(hrList.reduce((a,b)=>a+b,0)/hrList.length) : null;
  const paceList = monthWeeks.filter(w => w.avgPace).map(w => w.avgPace);
  const avgPace = paceList.length ? paceList.reduce((a,b)=>a+b,0)/paceList.length : null;
  const planWeekNums = monthWeeks.map(w => w.weekNum).filter(n => n > 0);
  const targetKm = planWeekNums.reduce((s, n) => { const pw = PLAN_DETAIL.find(p => p.week === n); return s + (pw ? pw.seances.reduce((ss,x) => ss + calcKmFromSeance(x), 0) : 0); }, 0);
  return { kmDone, runCount, totalTime, totalElevation, avgHeartrate, avgPace, targetKm: parseFloat(targetKm.toFixed(1)), targetRuns: planWeekNums.length * 4 };
}

// ── Rendu stats ───────────────────────────────────────────────────────────────
function renderStats(data) {
  const { weeks, currentWeek, currentPlanWeek, plan } = data;

  if (currentPeriod === 'mensuel') {
    const month = getMonthStats(weeks);
    const now = new Date();
    $('period-hint').textContent = now.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
    if (!month) {
      ['cur-km','cur-runs','cur-pace','cur-hr','cur-time','cur-elev'].forEach(id => $(id).textContent = '—');
      setProgress('prog-km', 0); setProgress('prog-runs', 0);
      return;
    }
    $('cur-km').textContent = fmt.km(month.kmDone);
    $('cur-runs').textContent = month.runCount;
    $('cur-pace').textContent = fmt.pace(month.avgPace);
    $('cur-hr').textContent = month.avgHeartrate || '—';
    $('cur-time').textContent = fmt.time(month.totalTime);
    $('cur-elev').textContent = month.totalElevation ? `+${month.totalElevation}` : '—';
    $('cur-km-target').textContent = `${month.targetKm} km prévus`;
    $('cur-runs-target').textContent = `${month.targetRuns} prévues`;
    if (month.targetKm > 0) {
      setProgress('prog-km', Math.min((month.kmDone/month.targetKm)*100,100), month.kmDone >= month.targetKm);
      setProgress('prog-runs', Math.min((month.runCount/month.targetRuns)*100,100), month.runCount >= month.targetRuns);
    }
    return;
  }

  const planWeek = plan.find(p => p.week === currentPlanWeek);
  $('period-hint').textContent = `Semaine ${currentPlanWeek > 0 ? currentPlanWeek : '—'}`;
  if (planWeek) {
    $('cur-km-target').textContent = `${planWeek.targetKm} km prévus`;
    $('cur-runs-target').textContent = `${planWeek.runs} prévues`;
  }
  if (!currentWeek) {
    ['cur-km','cur-runs','cur-pace','cur-hr','cur-time','cur-elev'].forEach(id => $(id).textContent = '0');
    setProgress('prog-km', 0); setProgress('prog-runs', 0);
    return;
  }
  $('cur-km').textContent = fmt.km(currentWeek.kmDone);
  $('cur-runs').textContent = currentWeek.runCount;
  $('cur-pace').textContent = fmt.pace(currentWeek.avgPace);
  $('cur-hr').textContent = currentWeek.avgHeartrate || '—';
  $('cur-time').textContent = fmt.time(currentWeek.totalTime);
  $('cur-elev').textContent = currentWeek.totalElevation ? `+${currentWeek.totalElevation}` : '—';
  if (planWeek && planWeek.targetKm > 0) {
    const kmPct = Math.min((currentWeek.kmDone/planWeek.targetKm)*100,100);
    const runsPct = Math.min((currentWeek.runCount/planWeek.runs)*100,100);
    setProgress('prog-km', kmPct, kmPct >= 100);
    setProgress('prog-runs', runsPct, runsPct >= 100);
  }
}

function setProgress(id, pct, over=false) { const el=$(id); el.style.width=pct+'%'; el.classList.toggle('over',over); }

// ── Graphique ─────────────────────────────────────────────────────────────────
function renderChart(weeks, plan) {
  const chartWeeks = [...weeks].reverse().slice(-12);
  const labels = chartWeeks.map(w => `S${w.weekNum}`);
  const realKm = chartWeeks.map(w => w.kmDone);
  const planKm = chartWeeks.map(w => w.plan?.targetKm ?? null);
  const ctx = $('chart-progress').getContext('2d');
  if (chartInstance) chartInstance.destroy();
  Chart.defaults.font.family = 'JetBrains Mono, monospace';
  Chart.defaults.color = '#555555';
  chartInstance = new Chart(ctx, {
    type: 'bar',
    data: { labels, datasets: [
      { label:'Réel (km)', data:realKm, backgroundColor:'#fc4c02', borderRadius:4, borderSkipped:false, order:1 },
      { label:'Plan (km)', data:planKm, type:'line', borderColor:'#2e2e2e', backgroundColor:'transparent', borderWidth:1.5, pointRadius:3, pointBackgroundColor:'#2e2e2e', tension:0.3, order:0 }
    ]},
    options: { responsive:true, maintainAspectRatio:false, interaction:{mode:'index',intersect:false},
      plugins:{ legend:{display:false}, tooltip:{ backgroundColor:'#1a1a1a', borderColor:'#2e2e2e', borderWidth:1, titleColor:'#888', bodyColor:'#f0f0f0', padding:10, callbacks:{ label: ctx => ` ${ctx.dataset.label}: ${ctx.parsed.y} km` } } },
      scales:{ x:{ grid:{color:'#111',drawBorder:false}, ticks:{font:{size:10}} }, y:{ grid:{color:'#1a1a1a',drawBorder:false}, ticks:{font:{size:10},callback:v=>v+' km'}, beginAtZero:true } }
    }
  });
}

// ── MATCHING : associe les sorties Strava aux séances du plan ────────────────
function matchSeancesToRuns(weekNum, runs) {
  const planWeek = PLAN_DETAIL.find(w => w.week === weekNum);
  if (!planWeek) return [];

  // Trie les runs par date croissante
  const sortedRuns = [...runs].sort((a,b) => new Date(a.date) - new Date(b.date));
  let runIndex = 0;

  return planWeek.seances.map((seance, idx) => {
    const isTrackable = !['renforcement'].includes(seance.type); // tout sauf renfo peut matcher avec Strava
    let matchedRun = null;

    if (isTrackable && runIndex < sortedRuns.length) {
      matchedRun = sortedRuns[runIndex];
      runIndex++;
    }

    return { seance, index: idx, matchedRun, isTrackable };
  });
}

// ── Comparaison réel vs cible pour une séance ─────────────────────────────────
function compareSeanceToRun(seance, run) {
  if (!run) return null;
  const targetKm = calcKmFromSeance(seance);
  const realKm = run.distance / 1000;
  const realPaceSec = run.movingTime && run.distance ? (run.movingTime / run.distance) * 1000 : null;
  const targetPace = parseTargetPace(seance.allure);

  const kmDiff = targetKm > 0 ? ((realKm - targetKm) / targetKm) * 100 : null;
  let kmStatus = 'neutral';
  if (kmDiff !== null) kmStatus = Math.abs(kmDiff) <= 15 ? 'ok' : (kmDiff < -15 ? 'miss' : 'warn');

  let paceStatus = 'neutral';
  if (targetPace && realPaceSec) {
    const tolerance = 20; // 20 sec/km de tolérance
    paceStatus = (realPaceSec >= targetPace.min - tolerance && realPaceSec <= targetPace.max + tolerance) ? 'ok' : 'warn';
  }

  return { realKm, realPaceSec, kmStatus, paceStatus, targetKm };
}

// ── Rendu : séances de la semaine avec matching (page Home) ──────────────────
function renderSeancesMatching(data) {
  const container = $('seances-matching-list');
  if (!container) return;
  container.innerHTML = '';

  const weekNum = data.currentPlanWeek;
  $('seances-week-label').textContent = `S${weekNum > 0 ? weekNum : '—'}`;

  const planWeek = PLAN_DETAIL.find(w => w.week === weekNum);
  if (!planWeek) { container.innerHTML = '<div style="padding:20px;color:var(--text-3);font-size:12px;">Plan non disponible pour cette semaine</div>'; return; }

  const weekRuns = data.currentWeek?.runs || [];
  const matches = matchSeancesToRuns(weekNum, weekRuns);

  matches.forEach((m, i) => {
    const c = SEANCE_COLORS[m.seance.type] || SEANCE_COLORS.endurance;
    const div = document.createElement('div');
    div.className = 'seance-match-item';

    let statusHtml, rightHtml;

    if (!m.isTrackable) {
      statusHtml = `<span class="seance-status status-notrack">Hors Strava</span>`;
      rightHtml = `<div class="seance-real-sub">À cocher manuellement</div>`;
    } else if (m.matchedRun) {
      const cmp = compareSeanceToRun(m.seance, m.matchedRun);
      statusHtml = `<span class="seance-status status-done">Réalisé</span>`;
      rightHtml = `
        <div class="seance-real-val">${m.matchedRun.name}</div>
        <div class="seance-real-sub">${fmt.date(m.matchedRun.date)}</div>
        <div class="seance-compare">
          <div class="cmp-item">
            <span class="cmp-label">Distance</span>
            <span class="cmp-val cmp-${cmp.kmStatus}">${cmp.realKm.toFixed(1)} km</span>
          </div>
          <div class="cmp-item">
            <span class="cmp-label">Allure</span>
            <span class="cmp-val cmp-${cmp.paceStatus}">${fmt.pace(cmp.realPaceSec)}/km</span>
          </div>
          ${m.matchedRun.avgHr ? `<div class="cmp-item"><span class="cmp-label">FC</span><span class="cmp-val cmp-neutral">${m.matchedRun.avgHr} bpm</span></div>` : ''}
        </div>
      `;
    } else {
      statusHtml = `<span class="seance-status status-todo">À faire</span>`;
      rightHtml = `<div class="seance-real-sub">Pas encore réalisée</div>`;
    }

    div.innerHTML = `
      <div class="seance-match-num">${i+1}</div>
      <div class="seance-type-dot" style="background:${c.border}"></div>
      <div class="seance-match-left">
        <div class="seance-match-title">${m.seance.titre} ${statusHtml}</div>
        <div class="seance-match-target">${m.seance.distance} · ${m.seance.allure}</div>
      </div>
      <div class="seance-match-right">${rightHtml}</div>
    `;
    container.appendChild(div);
  });
}

// ── Tableau historique ────────────────────────────────────────────────────────
function renderHistory(weeks) {
  const tbody = $('history-body');
  tbody.innerHTML = '';
  weeks.slice(0, 15).forEach(w => {
    const ecartVal = w.vsTarget;
    const ecartCls = ecartVal == null ? 'ecart-neu' : ecartVal >= 0 ? 'ecart-pos' : 'ecart-neg';
    const ecartTxt = ecartVal == null ? '—' : `${ecartVal >= 0 ? '+' : ''}${ecartVal}`;
    const phaseCls = w.plan ? `badge badge-${w.plan.phase}` : 'badge';
    const phaseTxt = w.plan ? fmt.phase(w.plan.phase) : '—';
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="td-week">${w.weekNum > 0 ? `S${w.weekNum}` : '—'} <span style="color:var(--text-3);font-size:10px">${fmt.date(w.date)}</span></td>
      <td><span class="${phaseCls}">${phaseTxt}</span></td>
      <td>${w.runCount}</td>
      <td class="td-km">${fmt.km(w.kmDone)}</td>
      <td style="font-family:var(--mono);font-size:12px;color:var(--text-3)">${w.plan?.targetKm ?? '—'}</td>
      <td class="td-ecart ${ecartCls}">${ecartTxt}</td>
      <td class="td-pace">${fmt.pace(w.avgPace)}</td>
      <td class="td-hr">${w.avgHeartrate ?? '—'}</td>
      <td class="td-elev">${w.totalElevation ? `+${w.totalElevation}m` : '—'}</td>
    `;
    tbody.appendChild(tr);
  });
}

// ── Dernières sorties ─────────────────────────────────────────────────────────
function renderRecentRuns(weeks) {
  const container = $('runs-list');
  if (!container) return;
  container.innerHTML = '';
  const allRuns = weeks.flatMap(w => w.runs).sort((a,b) => new Date(b.date) - new Date(a.date)).slice(0, 20);
  allRuns.forEach(run => {
    const div = document.createElement('div');
    div.className = 'run-card';
    div.innerHTML = `
      <div class="run-date">${fmt.date(run.date)}</div>
      <div class="run-name">${run.name}</div>
      <div class="run-stat">${fmt.km(run.distance/1000)} <span>km</span></div>
      <div class="run-stat">${fmt.time(run.movingTime)} <span>durée</span></div>
      <div class="run-stat">${fmt.pace(run.movingTime && run.distance ? (run.movingTime/run.distance)*1000 : null)} <span>/km</span></div>
      <div class="run-stat">${run.avgHr ? run.avgHr+' bpm' : '—'} <span>FC moy.</span></div>
    `;
    container.appendChild(div);
  });
}

// ── Programme interactif (page Plan) ──────────────────────────────────────────
function renderProgramme() {
  const container = $('programme-list');
  if (!container) return;
  const currentWeekNum = getCurrentPlanWeek();

  PLAN_DETAIL.forEach(week => {
    const isCurrent = week.week === currentWeekNum;
    const phaseLabel = fmt.phase(week.phase);
    const phaseCls = `badge badge-${week.phase}`;

    const weekEl = document.createElement('div');
    weekEl.className = `prog-week${isCurrent ? ' prog-week-current' : ''}`;
    weekEl.innerHTML = `
      <button class="prog-week-header" onclick="toggleWeek(${week.week})">
        <div class="prog-week-left">
          <span class="prog-week-num">S${week.week}</span>
          <span class="${phaseCls}">${phaseLabel}</span>
          ${isCurrent ? '<span class="badge-current">En cours</span>' : ''}
        </div>
        <div class="prog-week-right">
          <span class="prog-week-km">${week.targetKm} km</span>
          <span class="prog-week-runs">${week.runs} sorties</span>
          <svg class="prog-chevron" id="chevron-${week.week}" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
        </div>
      </button>
      <div class="prog-week-body" id="week-body-${week.week}" style="display:${isCurrent ? 'block' : 'none'}">
        <div class="prog-week-note">${week.notes}</div>
        <div class="prog-seances">${week.seances.map((s,i) => renderSeanceCard(s,i,week.week)).join('')}</div>
      </div>
    `;
    container.appendChild(weekEl);
  });
}

function renderSeanceCard(seance, index, weekNum) {
  const c = SEANCE_COLORS[seance.type] || SEANCE_COLORS.endurance;
  return `
    <div class="seance-card" style="border-left-color:${c.border}; background:${c.bg}">
      <button class="seance-header" onclick="toggleSeance(${weekNum}, ${index})">
        <div class="seance-header-left">
          <span class="seance-badge" style="color:${c.border};background:${c.bg}">${c.label}</span>
          <span class="seance-titre">${seance.titre}</span>
        </div>
        <div class="seance-header-right">
          <span class="seance-dist">${seance.distance}</span>
          <svg class="seance-chevron" id="seance-chevron-${weekNum}-${index}" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
        </div>
      </button>
      <div class="seance-detail" id="seance-detail-${weekNum}-${index}" style="display:none">
        <div class="seance-stats-row">
          <div class="seance-stat"><span class="seance-stat-label">Allure</span><span class="seance-stat-val">${seance.allure}</span></div>
          <div class="seance-stat"><span class="seance-stat-label">FC cible</span><span class="seance-stat-val">${seance.fc}</span></div>
        </div>
        <p class="seance-desc">${seance.description}</p>
      </div>
    </div>
  `;
}

function toggleWeek(weekNum) {
  const body = document.getElementById(`week-body-${weekNum}`);
  const chevron = document.getElementById(`chevron-${weekNum}`);
  const isOpen = body.style.display !== 'none';
  body.style.display = isOpen ? 'none' : 'block';
  chevron.style.transform = isOpen ? '' : 'rotate(180deg)';
}

function toggleSeance(weekNum, index) {
  const detail = document.getElementById(`seance-detail-${weekNum}-${index}`);
  const chevron = document.getElementById(`seance-chevron-${weekNum}-${index}`);
  const isOpen = detail.style.display !== 'none';
  detail.style.display = isOpen ? 'none' : 'block';
  chevron.style.transform = isOpen ? '' : 'rotate(180deg)';
}

function getCurrentPlanWeek() {
  const PLAN_START = new Date('2026-06-29');
  const monday = d => { const x = new Date(d); const day = x.getDay(); x.setDate(x.getDate() - day + (day===0?-6:1)); x.setHours(0,0,0,0); return x; };
  return Math.round((monday(new Date()) - monday(PLAN_START)) / (7*24*3600*1000)) + 1;
}

// ── Switcher écran ────────────────────────────────────────────────────────────
function showScreen(name) {
  $('screen-login').classList.toggle('hidden', name !== 'login');
  $('screen-app').classList.toggle('hidden', name !== 'app');
}
