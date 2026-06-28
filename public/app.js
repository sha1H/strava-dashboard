/* app.js — Frontend Dashboard Strava */

// ── Plan détaillé 15 semaines ────────────────────────────────────────────────
const PLAN_DETAIL = [
  {
    week: 1, phase: 'reprise', targetKm: 10, runs: 4,
    notes: 'Première semaine de reprise. Priorité absolue : écouter ton corps. Aucune douleur ne doit être ignorée.',
    seances: [
      { type: 'endurance', titre: 'Sortie facile', distance: '3 km', allure: '5:30–6:00/km', fc: 'Zone 2 (<145 bpm)', description: 'Footing très facile, tu dois pouvoir tenir une conversation sans effort. Si tu ressens la moindre gêne, marche.' },
      { type: 'endurance', titre: 'Sortie facile', distance: '3 km', allure: '5:30–6:00/km', fc: 'Zone 2 (<145 bpm)', description: 'Même consigne que la première sortie. Pense à bien t\'échauffer 5 min en marchant.' },
      { type: 'recuperation', titre: 'Récupération active', distance: '2 km', allure: 'Libre', fc: 'Zone 1 (<135 bpm)', description: 'Très courte sortie ou marche rapide. Objectif : activer la circulation, pas courir vite.' },
      { type: 'endurance', titre: 'Sortie longue', distance: '4 km', allure: '5:30/km', fc: 'Zone 2', description: 'Ta sortie la plus longue de la semaine. Garde une allure confortable du début à la fin.' },
    ]
  },
  {
    week: 2, phase: 'reprise', targetKm: 15, runs: 4,
    notes: 'On augmente le volume très progressivement. Toujours à allure conversationnelle.',
    seances: [
      { type: 'endurance', titre: 'Sortie facile', distance: '4 km', allure: '5:20–5:40/km', fc: 'Zone 2', description: 'Légère augmentation du volume. Tu dois rester à l\'aise tout au long.' },
      { type: 'endurance', titre: 'Sortie facile', distance: '4 km', allure: '5:20–5:40/km', fc: 'Zone 2', description: 'Pense à t\'hydrater avant et après.' },
      { type: 'recuperation', titre: 'Récupération active', distance: '3 km', allure: 'Libre', fc: 'Zone 1', description: 'Sortie courte à allure libre. Profites-en pour travailler ta foulée (cadence, relâchement des épaules).' },
      { type: 'endurance', titre: 'Sortie longue', distance: '5 km', allure: '5:20/km', fc: 'Zone 2', description: 'Première vraie sortie longue du plan. Pars lentement, ne cherche pas à finir vite.' },
    ]
  },
  {
    week: 3, phase: 'reprise', targetKm: 20, runs: 4,
    notes: 'Introduction d\'une courte séance tempo. Reste à l\'écoute des signaux de ton corps.',
    seances: [
      { type: 'endurance', titre: 'Sortie facile', distance: '5 km', allure: '5:20/km', fc: 'Zone 2', description: 'Footing confortable. Volume qui monte progressivement.' },
      { type: 'tempo', titre: 'Tempo court', distance: '5 km', allure: '4:30/km (15 min)', fc: 'Zone 3 (150–165 bpm)', description: 'Échauffement 10 min facile → 15 min à allure tempo (4:30/km) → retour au calme 10 min. C\'est la première séance avec de l\'intensité.' },
      { type: 'recuperation', titre: 'Récupération active', distance: '3 km', allure: 'Libre', fc: 'Zone 1', description: 'Sortie légère le lendemain du tempo. Laisse ton corps récupérer.' },
      { type: 'endurance', titre: 'Sortie longue', distance: '7 km', allure: '5:20/km', fc: 'Zone 2', description: 'La sortie longue s\'allonge. Garde l\'allure facile, même si tu te sens bien.' },
    ]
  },
  {
    week: 4, phase: 'reprise', targetKm: 28, runs: 4,
    notes: 'Fin de la phase de reprise. Tu commences à retrouver ta forme.',
    seances: [
      { type: 'endurance', titre: 'Sortie facile', distance: '6 km', allure: '5:10/km', fc: 'Zone 2', description: 'Volume en augmentation. Allure toujours confortable.' },
      { type: 'tempo', titre: 'Tempo moyen', distance: '7 km', allure: '4:20/km (20 min)', fc: 'Zone 3', description: 'Échauffement 10 min → 20 min tempo à 4:20/km → retour calme 10 min. Tu dois pouvoir parler par courtes phrases.' },
      { type: 'recuperation', titre: 'Récupération active', distance: '5 km', allure: 'Libre', fc: 'Zone 1', description: 'Sortie facile, focus sur la respiration et le relâchement.' },
      { type: 'endurance', titre: 'Sortie longue', distance: '10 km', allure: '5:10/km', fc: 'Zone 2', description: 'Premier 10 km du plan ! Pas d\'objectif de temps, juste finir confortablement.' },
    ]
  },
  {
    week: 5, phase: 'developpement', targetKm: 30, runs: 4,
    notes: 'Entrée dans la phase de développement. Premier fractionné au programme !',
    seances: [
      { type: 'endurance', titre: 'Sortie facile', distance: '8 km', allure: '5:00/km', fc: 'Zone 2', description: 'Footing de base. Pense à bien t\'hydrater.' },
      { type: 'fractionne', titre: 'Fractionné 4×1000m', distance: '7 km total', allure: '3:55–4:00/km', fc: 'Zone 4 (165–175 bpm)', description: 'Échauffement 15 min → 4×1000m à 3:55–4:00/km avec 90 sec récup jogging → retour calme 10 min. C\'est la séance clé du sub 40.' },
      { type: 'recuperation', titre: 'Récupération active', distance: '5 km', allure: 'Libre', fc: 'Zone 1', description: 'Sortie très facile après le fractionné. Indispensable pour récupérer.' },
      { type: 'endurance', titre: 'Sortie longue', distance: '10 km', allure: '5:00/km', fc: 'Zone 2', description: 'Sortie longue en endurance fondamentale.' },
    ]
  },
  {
    week: 6, phase: 'developpement', targetKm: 34, runs: 4,
    notes: 'On augmente le volume du fractionné. La vitesse spécifique se développe.',
    seances: [
      { type: 'endurance', titre: 'Sortie facile', distance: '8 km', allure: '5:00/km', fc: 'Zone 2', description: 'Footing de base classique.' },
      { type: 'fractionne', titre: 'Fractionné 5×1000m', distance: '8 km total', allure: '4:00/km', fc: 'Zone 4', description: 'Échauffement 15 min → 5×1000m à 4:00/km avec 90 sec récup → retour calme 10 min. Une répétition de plus.' },
      { type: 'recuperation', titre: 'Récupération active', distance: '6 km', allure: 'Libre', fc: 'Zone 1', description: 'Footing récupération. Si tu as des courbatures, reste à la marche.' },
      { type: 'endurance', titre: 'Sortie longue', distance: '12 km', allure: '5:00/km', fc: 'Zone 2', description: 'Volume en progression. Pars avec de l\'eau.' },
    ]
  },
  {
    week: 7, phase: 'developpement', targetKm: 38, runs: 4,
    notes: 'Semaine de travail tempo. On développe l\'allure marathon et au-delà.',
    seances: [
      { type: 'endurance', titre: 'Sortie facile', distance: '10 km', allure: '5:00/km', fc: 'Zone 2', description: 'Footing long en endurance fondamentale.' },
      { type: 'tempo', titre: 'Tempo 25 min', distance: '9 km total', allure: '4:10/km pendant 25 min', fc: 'Zone 3–4', description: 'Échauffement 15 min → 25 min à 4:10/km → retour calme 10 min. Le tempo développe ta capacité à soutenir une allure élevée longtemps.' },
      { type: 'recuperation', titre: 'Récupération active', distance: '7 km', allure: 'Libre', fc: 'Zone 1', description: 'Sortie facile de récupération.' },
      { type: 'endurance', titre: 'Sortie longue', distance: '12 km', allure: '5:00/km', fc: 'Zone 2', description: 'Maintien du volume long.' },
    ]
  },
  {
    week: 8, phase: 'recuperation', targetKm: 28, runs: 3,
    notes: 'Semaine de récupération obligatoire. Le corps s\'adapte pendant le repos, pas pendant l\'effort.',
    seances: [
      { type: 'endurance', titre: 'Sortie facile', distance: '8 km', allure: '5:10/km', fc: 'Zone 2', description: 'Footing tranquille. Profite de la semaine légère.' },
      { type: 'recuperation', titre: 'Récupération active', distance: '8 km', allure: 'Libre', fc: 'Zone 1–2', description: 'Sortie relaxante. Tu peux intégrer quelques accélérations courtes si tu te sens bien.' },
      { type: 'endurance', titre: 'Sortie longue réduite', distance: '12 km', allure: '5:10/km', fc: 'Zone 2', description: 'Sortie longue mais à allure très confortable. Pas de pression.' },
    ]
  },
  {
    week: 9, phase: 'developpement', targetKm: 40, runs: 4,
    notes: 'Reprise du travail intense. Volume qui atteint un nouveau palier.',
    seances: [
      { type: 'endurance', titre: 'Sortie facile', distance: '10 km', allure: '4:55/km', fc: 'Zone 2', description: 'L\'allure d\'endurance s\'améliore naturellement.' },
      { type: 'fractionne', titre: 'Fractionné 6×1000m', distance: '9 km total', allure: '3:58/km', fc: 'Zone 4–5', description: 'Échauffement 15 min → 6×1000m à 3:58/km avec 90 sec récup → retour calme 10 min. L\'allure se rapproche de l\'objectif course.' },
      { type: 'recuperation', titre: 'Récupération active', distance: '8 km', allure: 'Libre', fc: 'Zone 1', description: 'Récupération indispensable après une séance intense.' },
      { type: 'endurance', titre: 'Sortie longue', distance: '13 km', allure: '4:55/km', fc: 'Zone 2', description: 'Volume maximum approche. Prépare ta nutrition si besoin après 60 min.' },
    ]
  },
  {
    week: 10, phase: 'developpement', targetKm: 45, runs: 4,
    notes: 'Semaine chargée. Tempo long pour construire l\'endurance à allure spécifique.',
    seances: [
      { type: 'endurance', titre: 'Sortie facile', distance: '12 km', allure: '4:55/km', fc: 'Zone 2', description: 'Footing long de base.' },
      { type: 'tempo', titre: 'Tempo 30 min', distance: '11 km total', allure: '4:05/km pendant 30 min', fc: 'Zone 3–4', description: 'Échauffement 15 min → 30 min à 4:05/km → retour calme 10 min. Cette séance simule la deuxième moitié de ton 10km de course.' },
      { type: 'recuperation', titre: 'Récupération active', distance: '8 km', allure: 'Libre', fc: 'Zone 1', description: 'Très facile. Si tu as des douleurs, repose-toi complètement.' },
      { type: 'endurance', titre: 'Sortie longue', distance: '14 km', allure: '4:55/km', fc: 'Zone 2', description: 'Ta sortie longue la plus longue du plan. Gère bien ton allure.' },
    ]
  },
  {
    week: 11, phase: 'developpement', targetKm: 50, runs: 4,
    notes: 'Pic de charge. Semaine la plus dure du plan. Après ça, le plus dur est fait.',
    seances: [
      { type: 'endurance', titre: 'Sortie facile', distance: '13 km', allure: '4:50/km', fc: 'Zone 2', description: 'Footing de base à volume élevé.' },
      { type: 'fractionne', titre: '3×2000m', distance: '10 km total', allure: '4:00/km', fc: 'Zone 4', description: 'Échauffement 15 min → 3×2000m à 4:00/km avec 2 min récup → retour calme 10 min. Les répétitions longues développent ta puissance aérobie.' },
      { type: 'recuperation', titre: 'Récupération active', distance: '10 km', allure: 'Libre', fc: 'Zone 1', description: 'Sortie récupération. Dors bien cette semaine.' },
      { type: 'endurance', titre: 'Sortie longue', distance: '15 km', allure: '4:50/km', fc: 'Zone 2', description: 'Sortie longue maximale du plan !' },
    ]
  },
  {
    week: 12, phase: 'recuperation', targetKm: 35, runs: 3,
    notes: 'Deuxième semaine de récupération. Obligatoire pour arriver frais à l\'affûtage.',
    seances: [
      { type: 'endurance', titre: 'Sortie facile', distance: '10 km', allure: '5:00/km', fc: 'Zone 2', description: 'Footing tranquille. Le volume descend volontairement.' },
      { type: 'tempo', titre: 'Tempo court', distance: '12 km', allure: '4:10/km (20 min)', fc: 'Zone 3', description: 'Maintien de l\'intensité mais durée réduite. Échauffement 15 min → 20 min tempo → retour calme.' },
      { type: 'endurance', titre: 'Sortie longue réduite', distance: '13 km', allure: '5:00/km', fc: 'Zone 2', description: 'Sortie longue à allure confortable.' },
    ]
  },
  {
    week: 13, phase: 'affutage', targetKm: 35, runs: 4,
    notes: 'Phase d\'affûtage. Le volume baisse, l\'intensité se maintient. Tu gardes le tranchant.',
    seances: [
      { type: 'endurance', titre: 'Sortie facile', distance: '8 km', allure: '5:00/km', fc: 'Zone 2', description: 'Volume réduit mais qualité maintenue.' },
      { type: 'fractionne', titre: 'Fractionné 5×1000m', distance: '8 km total', allure: '3:55/km', fc: 'Zone 4', description: 'Échauffement 15 min → 5×1000m à 3:55/km → retour calme. Allure légèrement plus rapide que l\'objectif course.' },
      { type: 'recuperation', titre: 'Récupération active', distance: '7 km', allure: 'Libre', fc: 'Zone 1', description: 'Footing très facile.' },
      { type: 'endurance', titre: 'Sortie longue réduite', distance: '12 km', allure: '5:00/km', fc: 'Zone 2', description: 'Dernière vraie sortie longue.' },
    ]
  },
  {
    week: 14, phase: 'affutage', targetKm: 25, runs: 4,
    notes: 'J-10 environ. Dernière séance intense. Après ça, on préserve les jambes.',
    seances: [
      { type: 'endurance', titre: 'Sortie facile', distance: '6 km', allure: '5:00/km', fc: 'Zone 2', description: 'Footing léger.' },
      { type: 'fractionne', titre: 'Dernier fractionné 4×1000m', distance: '7 km total', allure: '3:55/km', fc: 'Zone 4', description: 'Échauffement 15 min → 4×1000m à 3:55/km → retour calme. Dernière séance intense. Tu dois te sentir fort et rapide.' },
      { type: 'recuperation', titre: 'Récupération active', distance: '5 km', allure: 'Libre', fc: 'Zone 1', description: 'Sortie légère. Repose-toi bien les jours suivants.' },
      { type: 'endurance', titre: 'Sortie courte', distance: '7 km', allure: '5:00/km', fc: 'Zone 2', description: 'Dernière sortie un peu longue.' },
    ]
  },
  {
    week: 15, phase: 'affutage', targetKm: 15, runs: 3,
    notes: 'Semaine de course. Repos actif uniquement. Prépare ton équipement et ta logistique.',
    seances: [
      { type: 'recuperation', titre: 'Jogging léger', distance: '5 km', allure: '5:30/km', fc: 'Zone 1', description: 'Lundi ou mardi uniquement. Très léger, juste pour garder les jambes actives.' },
      { type: 'recuperation', titre: 'Jogging d\'activation', distance: '4 km + strides', allure: '5:30/km + 4×100m', fc: 'Zone 1–2', description: 'J-3 ou J-4. Footing facile avec 4 accélérations progressives de 100m pour réveiller les jambes. Pas de fatigue.' },
      { type: 'course', titre: '🏁 10km — Sub 40 !', distance: '10 km', allure: '3:59/km', fc: 'Zone 4–5', description: 'Plan de course : km 1–2 à 4:05/km (ne pars pas trop vite !), km 3–7 à 4:00/km, km 8–10 : tout donner. Tu es prêt.' },
    ]
  },
];

// ── Couleurs par type de séance ───────────────────────────────────────────────
const SEANCE_COLORS = {
  endurance:   { bg: 'rgba(59,130,246,0.1)',  border: '#3b82f6', label: 'Endurance' },
  fractionne:  { bg: 'rgba(252,76,2,0.1)',    border: '#fc4c02', label: 'Fractionné' },
  tempo:       { bg: 'rgba(168,85,247,0.1)',  border: '#a855f7', label: 'Tempo' },
  recuperation:{ bg: 'rgba(34,197,94,0.1)',   border: '#22c55e', label: 'Récupération' },
  course:      { bg: 'rgba(251,191,36,0.1)',  border: '#fbbf24', label: 'Course' },
};

// ── Utilitaires formatage ────────────────────────────────────────────────────
const fmt = {
  km:    v => v != null ? v.toFixed(1) : '—',
  pace:  v => {
    if (!v) return '—';
    const total = Math.round(v);
    return `${Math.floor(total/60)}:${String(total%60).padStart(2,'0')}`;
  },
  time:  v => {
    if (!v) return '—';
    const h = Math.floor(v/3600), m = Math.floor((v%3600)/60);
    return h > 0 ? `${h}h${String(m).padStart(2,'0')}` : `${m}min`;
  },
  date:  v => {
    const d = new Date(v);
    return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
  },
  phase: v => ({ reprise:'Reprise', developpement:'Dév.', recuperation:'Récup.', affutage:'Affûtage' }[v] || v),
};

// ── Cache local ───────────────────────────────────────────────────────────────
const localCache = {
  KEY: 'strava_dash_v1',
  set(data) { try { localStorage.setItem(this.KEY, JSON.stringify({ data, ts: Date.now() })); } catch(e) {} },
  get(maxAgeMs = 5 * 60 * 1000) {
    try {
      const raw = localStorage.getItem(this.KEY);
      if (!raw) return null;
      const { data, ts } = JSON.parse(raw);
      return Date.now() - ts < maxAgeMs ? data : null;
    } catch(e) { return null; }
  },
  clear() { try { localStorage.removeItem(this.KEY); } catch(e) {} }
};

const $ = id => document.getElementById(id);
let chartInstance = null;

// ── Init ──────────────────────────────────────────────────────────────────────
(async function init() {
  const params = new URLSearchParams(location.search);
  if (params.get('error')) {
    $('login-error').classList.remove('hidden');
    showScreen('login');
    return;
  }

  const status = await fetch('/api/status').then(r => r.json()).catch(() => ({ connected: false }));
  if (!status.connected) { showScreen('login'); return; }
  if (params.get('connected')) history.replaceState({}, '', '/');

  $('days-count').textContent = status.daysUntilRace;
  showScreen('dashboard');

  fetch('/api/athlete')
    .then(r => r.json())
    .then(a => { $('athlete-name').textContent = `${a.firstname} ${a.lastname}`; })
    .catch(() => {});

  const cached = localCache.get();
  if (cached) {
    renderAll(cached);
    $('cache-hint').textContent = 'données en cache · actualise pour rafraîchir';
  } else {
    loadActivities();
  }

  $('btn-refresh').addEventListener('click', () => {
    localCache.clear();
    loadActivities(true);
  });

  // Rendu du programme (statique, pas besoin d'API)
  renderProgramme();
})();

// ── Chargement activités ──────────────────────────────────────────────────────
async function loadActivities(force = false) {
  const btn = $('btn-refresh');
  btn.classList.add('spinning');
  $('cache-hint').textContent = 'chargement…';
  try {
    if (force) await fetch('/api/refresh', { method: 'POST' });
    const data = await fetch('/api/activities').then(r => r.json());
    if (data.error) throw new Error(data.error);
    localCache.set(data);
    renderAll(data);
    $('cache-hint').textContent = data.fromCache
      ? 'cache serveur · actualise dans 5 min'
      : `mis à jour à ${new Date().toLocaleTimeString('fr-FR', { hour:'2-digit', minute:'2-digit' })}`;
  } catch(e) {
    $('cache-hint').textContent = 'erreur de chargement · ' + e.message;
  } finally {
    btn.classList.remove('spinning');
  }
}

// ── Rendu principal ───────────────────────────────────────────────────────────
function renderAll(data) {
  const { weeks, currentWeek, currentPlanWeek, plan, daysUntilRace } = data;
  $('days-count').textContent = daysUntilRace;
  renderCurrentWeek(currentWeek, currentPlanWeek, plan);
  renderChart(weeks, plan);
  renderHistory(weeks);
  renderRecentRuns(weeks);
}

// ── Semaine en cours ──────────────────────────────────────────────────────────
function renderCurrentWeek(week, planWeekNum, plan) {
  const planWeek = plan.find(p => p.week === planWeekNum);
  $('current-week-label').textContent = `S${planWeekNum || '—'}`;
  if (planWeek) {
    $('plan-note').textContent = `S${planWeekNum} · ${fmt.phase(planWeek.phase)} — ${planWeek.notes}`;
    $('cur-km-target').textContent = `${planWeek.targetKm} km prévus`;
    $('cur-runs-target').textContent = `${planWeek.runs} prévues`;
  }
  if (!week) {
    ['cur-km','cur-runs','cur-pace','cur-hr','cur-time','cur-elev'].forEach(id => $(id).textContent = '0');
    setProgress('prog-km', 0);
    setProgress('prog-runs', 0);
    return;
  }
  $('cur-km').textContent    = fmt.km(week.kmDone);
  $('cur-runs').textContent  = week.runCount;
  $('cur-pace').textContent  = fmt.pace(week.avgPace);
  $('cur-hr').textContent    = week.avgHeartrate || '—';
  $('cur-time').textContent  = fmt.time(week.totalTime);
  $('cur-elev').textContent  = week.totalElevation ? `+${week.totalElevation}` : '—';
  if (planWeek) {
    const kmPct   = Math.min((week.kmDone / planWeek.targetKm) * 100, 100);
    const runsPct = Math.min((week.runCount / planWeek.runs) * 100, 100);
    setProgress('prog-km',   kmPct,   kmPct >= 100);
    setProgress('prog-runs', runsPct, runsPct >= 100);
  }
}

function setProgress(id, pct, over = false) {
  const el = $(id);
  el.style.width = pct + '%';
  el.classList.toggle('over', over);
}

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
    data: {
      labels,
      datasets: [
        { label: 'Réel (km)', data: realKm, backgroundColor: '#fc4c02', borderRadius: 4, borderSkipped: false, order: 1 },
        { label: 'Plan (km)', data: planKm, type: 'line', borderColor: '#2e2e2e', backgroundColor: 'transparent', borderWidth: 1.5, pointRadius: 3, pointBackgroundColor: '#2e2e2e', tension: 0.3, order: 0 }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: { backgroundColor: '#1a1a1a', borderColor: '#2e2e2e', borderWidth: 1, titleColor: '#888', bodyColor: '#f0f0f0', padding: 10, callbacks: { label: ctx => ` ${ctx.dataset.label}: ${ctx.parsed.y} km` } }
      },
      scales: {
        x: { grid: { color: '#111', drawBorder: false }, ticks: { font: { size: 10 } } },
        y: { grid: { color: '#1a1a1a', drawBorder: false }, ticks: { font: { size: 10 }, callback: v => v + ' km' }, beginAtZero: true }
      }
    }
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
  container.innerHTML = '';
  const allRuns = weeks.flatMap(w => w.runs).sort((a,b) => new Date(b.date) - new Date(a.date)).slice(0, 10);
  allRuns.forEach(run => {
    const div = document.createElement('div');
    div.className = 'run-row';
    div.innerHTML = `
      <div class="run-date">${fmt.date(run.date)}</div>
      <div class="run-name">${run.name}</div>
      <div class="run-stat">${fmt.km(run.distance/1000)} <span>km</span></div>
      <div class="run-stat">${fmt.time(run.movingTime)} <span>durée</span></div>
      <div class="run-stat">${fmt.pace(run.movingTime && run.distance ? (run.movingTime/run.distance)*1000 : null)} <span>/km</span></div>
      <div class="run-stat">${run.avgHr ? run.avgHr + ' bpm' : '—'} <span>FC moy.</span></div>
    `;
    container.appendChild(div);
  });
}

// ── Programme interactif ──────────────────────────────────────────────────────
function renderProgramme() {
  const container = $('programme-list');
  if (!container) return;

  // Semaine courante pour mise en avant
  const currentWeekNum = getCurrentPlanWeek();

  PLAN_DETAIL.forEach(week => {
    const isCurrent = week.week === currentWeekNum;
    const phaseLabel = { reprise:'Reprise', developpement:'Développement', recuperation:'Récupération', affutage:'Affûtage' }[week.phase] || week.phase;
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
        <div class="prog-seances" id="seances-${week.week}">
          ${week.seances.map((s, i) => renderSeanceCard(s, i, week.week)).join('')}
        </div>
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
  const PLAN_START = new Date('2026-06-30');
  const monday = d => { const x = new Date(d); const day = x.getDay(); x.setDate(x.getDate() - day + (day===0?-6:1)); x.setHours(0,0,0,0); return x; };
  return Math.round((monday(new Date()) - monday(PLAN_START)) / (7*24*3600*1000)) + 1;
}

// ── Switcher d'écran ──────────────────────────────────────────────────────────
function showScreen(name) {
  $('screen-login').classList.toggle('hidden', name !== 'login');
  $('screen-dashboard').classList.toggle('hidden', name !== 'dashboard');
}
