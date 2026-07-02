/* app.js — Training Dashboard v3 : analyse profonde par séance + plan adaptatif */

// ── Plan adaptatif (stocké et modifiable) ────────────────────────────────────
const adaptivePlan = {
  KEY: 'strava_adaptive_plan_v1',
  
  // Récupère le plan avec toutes les surcharges appliquées
  get() {
    try {
      const saved = JSON.parse(localStorage.getItem(this.KEY) || '{}');
      return PLAN_DETAIL.map(week => {
        const overrides = saved[week.week] || {};
        return {
          ...week,
          ...overrides,
          seances: week.seances.map((s, i) => ({
            ...s,
            ...(overrides.seances?.[i] || {})
          }))
        };
      });
    } catch(e) { return PLAN_DETAIL; }
  },

  // Applique un ajustement sur une semaine et ses séances
  applyAdjustment(weekNum, adjustment) {
    try {
      const saved = JSON.parse(localStorage.getItem(this.KEY) || '{}');
      if (!saved[weekNum]) saved[weekNum] = {};
      
      if (adjustment.noteCoach) saved[weekNum].noteCoach = adjustment.noteCoach;
      if (adjustment.targetKm !== undefined) saved[weekNum].targetKm = adjustment.targetKm;
      if (adjustment.runs !== undefined) saved[weekNum].runs = adjustment.runs;
      
      if (adjustment.seances) {
        if (!saved[weekNum].seances) saved[weekNum].seances = {};
        Object.entries(adjustment.seances).forEach(([idx, patch]) => {
          saved[weekNum].seances[idx] = { ...(saved[weekNum].seances[idx] || {}), ...patch };
        });
      }
      
      localStorage.setItem(this.KEY, JSON.stringify(saved));
      return true;
    } catch(e) { return false; }
  },

  // Réinitialise une semaine au plan original
  resetWeek(weekNum) {
    try {
      const saved = JSON.parse(localStorage.getItem(this.KEY) || '{}');
      delete saved[weekNum];
      localStorage.setItem(this.KEY, JSON.stringify(saved));
      return true;
    } catch(e) { return false; }
  },

  // Vérifie si une semaine a été modifiée
  isModified(weekNum) {
    try {
      const saved = JSON.parse(localStorage.getItem(this.KEY) || '{}');
      return !!saved[weekNum];
    } catch(e) { return false; }
  }
};

// ── Coches manuelles (renforcement, vélo) ────────────────────────────────────
const manualChecks = {
  KEY: 'strava_dash_checks',
  getAll() { try { return JSON.parse(localStorage.getItem(this.KEY) || '{}'); } catch(e) { return {}; } },
  isChecked(weekNum, idx) { return !!this.getAll()[`${weekNum}-${idx}`]; },
  toggle(weekNum, idx) {
    const all = this.getAll();
    const key = `${weekNum}-${idx}`;
    all[key] = !all[key];
    try { localStorage.setItem(this.KEY, JSON.stringify(all)); } catch(e) {}
    return all[key];
  }
};

// ── Cache local ───────────────────────────────────────────────────────────────
const localCache = {
  KEY: 'strava_dash_v3',
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

// ── Plan détaillé 15 semaines (source de vérité) ──────────────────────────────
const PLAN_DETAIL = [
  {
    week: 1, phase: 'reprise', targetKm: 14, runs: 4,
    notes: 'Reconstruction — endurance fondamentale pure',
    seances: [
      { type: 'endurance', titre: 'Footing EF', distance: '25 min', allure: '5:50–6:10/km', fc: '65–72% FCM', description: 'Footing en endurance fondamentale pure. Conversation aisée tout au long.' },
      { type: 'renforcement', titre: 'Renforcement A', distance: '20 min', allure: 'Hors course', fc: '—', description: '3×15 squats, 3×10 fentes, 3×30s planche, 2×15 mollets.' },
      { type: 'endurance', titre: 'Footing EF', distance: '25 min', allure: '5:50–6:10/km', fc: '65–72% FCM', description: 'Même consigne. Focus cadence ~170-175 pas/min.' },
      { type: 'endurance', titre: 'Sortie longue EF', distance: '35–40 min', allure: '6:00–6:20/km', fc: '<140 bpm', description: 'Sortie longue. Objectif : temps sur pied, pas les km.' },
    ]
  },
  {
    week: 2, phase: 'reprise', targetKm: 13, runs: 4,
    notes: 'Volume progressif — allure conversationnelle',
    seances: [
      { type: 'endurance', titre: 'Footing EF', distance: '30 min', allure: '5:45–6:05/km', fc: '65–72% FCM', description: 'Légère progression du volume. Note tes sensations.' },
      { type: 'renforcement', titre: 'Renforcement B', distance: '20 min', allure: 'Hors course', fc: '—', description: '3×12 soulevé poids corps, 3×10 pont fessier, 3×30s gainage latéral.' },
      { type: 'velo', titre: 'Vélo récupération', distance: '30–45 min', allure: 'Très facile', fc: '<130 bpm', description: 'Cardio sans impact. Très léger.' },
      { type: 'endurance', titre: 'Sortie longue EF', distance: '45 min', allure: '5:50–6:10/km', fc: '<140 bpm', description: 'Allure conversationnelle du début à la fin.' },
    ]
  },
  {
    week: 3, phase: 'reprise', targetKm: 18, runs: 4,
    notes: '⭐ Semaine clé — Test VMA 6 min',
    seances: [
      { type: 'endurance', titre: 'Footing EF', distance: '35 min', allure: '5:40–6:00/km', fc: '65–72% FCM', description: 'Footing facile avant le test VMA.' },
      { type: 'test', titre: '🔬 Test VMA 6 min', distance: '3–4 km total', allure: 'Effort maximal 6 min', fc: 'Max', description: 'Échauffe 15 min → 6 min effort max → mesure distance. VMA = distance(m)÷100.' },
      { type: 'renforcement', titre: 'Renforcement A', distance: '20 min', allure: 'Hors course', fc: '—', description: 'Circuit A léger post-test.' },
      { type: 'endurance', titre: 'Sortie longue EF', distance: '50 min', allure: '5:50–6:10/km', fc: '<140 bpm', description: 'Récupération longue après le test.' },
    ]
  },
  {
    week: 4, phase: 'reprise', targetKm: 21, runs: 4,
    notes: 'Fartlek léger — réactivation neuromusculaire',
    seances: [
      { type: 'endurance', titre: 'Footing EF + fartlek', distance: '35 min', allure: 'EF + 6×30s vif', fc: '65-75%+pics', description: '20 min EF → 6×30s accélérations vives → 5 min calme.' },
      { type: 'renforcement', titre: 'Renforcement B', distance: '25 min', allure: 'Hors course', fc: '—', description: 'Circuit B enrichi + pistol squat assisté.' },
      { type: 'endurance', titre: 'Footing EF', distance: '35 min', allure: '5:40–5:55/km', fc: '65–72% FCM', description: 'Footing tranquille.' },
      { type: 'endurance', titre: 'Sortie longue EF', distance: '55 min', allure: '5:45–6:05/km', fc: '<140 bpm', description: 'Fin optionnelle à 5:20-5:30/km si bonnes sensations.' },
    ]
  },
  {
    week: 5, phase: 'reprise', targetKm: 22, runs: 4,
    notes: 'Premier fractionné VMA 8×30/30',
    seances: [
      { type: 'endurance', titre: 'Footing EF', distance: '40 min', allure: '5:35–5:50/km', fc: '65–72% FCM', description: 'Base solide avant le fractionné.' },
      { type: 'fractionne', titre: 'VMA 8×30/30', distance: '5 km total', allure: '95-100% VMA', fc: 'Zone 4-5', description: 'Échauffe 15 min → 8×30s à VMA, 30s récup trottinée → calme 10 min.' },
      { type: 'renforcement', titre: 'Renforcement A', distance: '25 min', allure: 'Hors course', fc: '—', description: 'Circuit A post-fractionné.' },
      { type: 'endurance', titre: 'Sortie longue EF', distance: '60 min', allure: '5:40–6:00/km', fc: '<140 bpm', description: 'Première heure de course du plan.' },
    ]
  },
  {
    week: 6, phase: 'developpement', targetKm: 25, runs: 4,
    notes: 'VMA 10×30/30 — volume en hausse',
    seances: [
      { type: 'endurance', titre: 'Footing EF', distance: '40 min', allure: '5:30–5:45/km', fc: '65–72% FCM', description: 'Allure EF qui s\'améliore naturellement.' },
      { type: 'fractionne', titre: 'VMA 10×30/30', distance: '6 km total', allure: '95-100% VMA', fc: 'Zone 4-5', description: 'Échauffe 15 min → 10×30/30 → calme 10 min. +2 répétitions vs S5.' },
      { type: 'renforcement', titre: 'Renforcement B', distance: '25 min', allure: 'Hors course', fc: '—', description: 'Circuit B + pompes nordiques si possible.' },
      { type: 'endurance', titre: 'Sortie longue EF', distance: '65 min', allure: '5:35–5:55/km', fc: '<140 bpm', description: 'Volume qui progresse.' },
    ]
  },
  {
    week: 7, phase: 'developpement', targetKm: 28, runs: 4,
    notes: 'Seuil 2×12 min — endurance de vitesse',
    seances: [
      { type: 'endurance', titre: 'Footing EF', distance: '40 min', allure: '5:25–5:40/km', fc: '65–72% FCM', description: 'Échauffement soigné avant la séance seuil.' },
      { type: 'tempo', titre: 'Seuil 2×12 min', distance: '8 km total', allure: '4:40–4:50/km', fc: 'Zone 3-4 (155-165 bpm)', description: 'Échauffe 15 min → 2×12 min seuil avec 3 min récup → calme 10 min.' },
      { type: 'renforcement', titre: 'Renforcement A', distance: '25 min', allure: 'Hors course', fc: '—', description: 'Circuit A progressif.' },
      { type: 'endurance', titre: 'Sortie longue EF', distance: '70 min', allure: '5:35–5:50/km', fc: '<140 bpm', description: 'Sortie longue progressive.' },
    ]
  },
  {
    week: 8, phase: 'recuperation', targetKm: 18, runs: 3,
    notes: '⬇️ Récupération obligatoire',
    seances: [
      { type: 'endurance', titre: 'Footing EF léger', distance: '35 min', allure: '5:45–6:00/km', fc: '<135 bpm', description: 'Volume réduit volontairement. Profite du repos.' },
      { type: 'velo', titre: 'Vélo récupération', distance: '45 min', allure: 'Très facile', fc: '<125 bpm', description: 'Maintien cardio sans impact.' },
      { type: 'endurance', titre: 'Sortie longue réduite', distance: '50 min', allure: '5:45–6:05/km', fc: '<135 bpm', description: 'Allure très confortable, pas de pression.' },
    ]
  },
  {
    week: 9, phase: 'developpement', targetKm: 32, runs: 4,
    notes: 'VMA 10×200m — vitesse spécifique',
    seances: [
      { type: 'endurance', titre: 'Footing EF', distance: '45 min', allure: '5:20–5:35/km', fc: '65–72% FCM', description: 'Allure EF bien améliorée.' },
      { type: 'fractionne', titre: 'VMA 10×200m', distance: '7 km total', allure: '95-100% VMA', fc: 'Zone 4-5', description: 'Échauffe 15 min + PPG → 10×200m VMA, 1min15 récup → calme 10 min. Sur piste si possible.' },
      { type: 'renforcement', titre: 'Renforcement B', distance: '30 min', allure: 'Hors course', fc: '—', description: 'Circuit B avec poids léger optionnel.' },
      { type: 'endurance', titre: 'Sortie longue EF', distance: '75 min', allure: '5:30–5:50/km', fc: '<140 bpm', description: 'Pense à t\'hydrater et gels si besoin après 60 min.' },
    ]
  },
  {
    week: 10, phase: 'developpement', targetKm: 36, runs: 4,
    notes: 'Seuil + AS10 — première fois à 4:00/km',
    seances: [
      { type: 'endurance', titre: 'Footing EF', distance: '45 min', allure: '5:15–5:30/km', fc: '65–72% FCM', description: 'Ton EF se rapproche de l\'allure marathon.' },
      { type: 'tempo', titre: 'Seuil + AS10', distance: '10 km total', allure: '10min seuil + 10min AS10 (4:00) + 10min seuil', fc: 'Zone 3-4', description: 'Échauffe 15 min → 10min seuil → 2min récup → 10min à 4:00/km → 2min récup → 10min seuil → calme.' },
      { type: 'renforcement', titre: 'Renforcement A', distance: '30 min', allure: 'Hors course', fc: '—', description: 'Circuit A avec sauts : box jump, sauts jambes tendues.' },
      { type: 'endurance', titre: 'Sortie longue EF', distance: '80 min', allure: '5:30–5:45/km', fc: '<140 bpm', description: 'Sortie longue maximale. Pars lentement.' },
    ]
  },
  {
    week: 11, phase: 'developpement', targetKm: 32, runs: 4,
    notes: 'VMA 8×400m — pic d\'intensité',
    seances: [
      { type: 'endurance', titre: 'Footing EF', distance: '50 min', allure: '5:10–5:25/km', fc: '65–72% FCM', description: 'Volume long en base.' },
      { type: 'fractionne', titre: 'VMA 8×400m', distance: '8 km total', allure: '95% VMA', fc: 'Zone 4-5', description: 'Échauffe 15 min → 8×400m à 95% VMA, 1min30 récup → calme 10 min.' },
      { type: 'renforcement', titre: 'Renforcement B', distance: '30 min', allure: 'Hors course', fc: '—', description: 'Circuit B complet avec sauts.' },
      { type: 'endurance', titre: 'Sortie longue EF', distance: '80 min', allure: '5:25–5:40/km', fc: '<140 bpm', description: 'Maintien du long.' },
    ]
  },
  {
    week: 12, phase: 'recuperation', targetKm: 19, runs: 3,
    notes: '⬇️ Deuxième semaine de récupération',
    seances: [
      { type: 'endurance', titre: 'Footing EF léger', distance: '35 min', allure: '5:30–5:45/km', fc: '<135 bpm', description: 'Volume réduit. Repos bien mérité.' },
      { type: 'fractionne', titre: 'VMA court 8×30/30', distance: '5 km total', allure: '95% VMA', fc: 'Zone 4', description: 'Maintien vitesse, volume réduit.' },
      { type: 'endurance', titre: 'Sortie longue réduite', distance: '50 min', allure: '5:30–5:45/km', fc: '<135 bpm', description: 'Allure très confortable.' },
    ]
  },
  {
    week: 13, phase: 'specifique', targetKm: 29, runs: 4,
    notes: 'AS10 5×2000m — séance clé spécifique',
    seances: [
      { type: 'endurance', titre: 'Footing EF', distance: '40 min', allure: '5:10–5:25/km', fc: '65–72% FCM', description: 'EF confortable. Tu commences à sentir la forme.' },
      { type: 'fractionne', titre: 'AS10 5×2000m', distance: '11 km total', allure: '4:00/km', fc: 'Zone 4', description: 'Échauffe 15 min → 5×2000m à 4:00/km, 2 min récup → calme 10 min. Séance la plus spécifique.' },
      { type: 'renforcement', titre: 'Renforcement léger', distance: '20 min', allure: 'Hors course', fc: '—', description: 'Entretien léger uniquement.' },
      { type: 'endurance', titre: 'Sortie longue EF', distance: '65 min', allure: '5:20–5:35/km', fc: '<140 bpm', description: 'Fin à AS10 si bonnes sensations.' },
    ]
  },
  {
    week: 14, phase: 'affutage', targetKm: 20, runs: 4,
    notes: 'Affûtage — volume -45%, intensité maintenue',
    seances: [
      { type: 'endurance', titre: 'Footing EF', distance: '30 min', allure: '5:10–5:25/km', fc: '65–72% FCM', description: 'Léger. Fatigue passagère normale pendant l\'affûtage.' },
      { type: 'fractionne', titre: 'AS10 6×1000m', distance: '7 km total', allure: '4:00/km', fc: 'Zone 4', description: 'Échauffe 15 min → 6×1000m à 4:00/km, 90s récup → calme 10 min.' },
      { type: 'endurance', titre: 'Footing EF court', distance: '25 min', allure: '5:20–5:40/km', fc: '<135 bpm', description: 'Très court, très facile.' },
      { type: 'endurance', titre: 'Strides', distance: '30 min', allure: 'EF + 4×100m', fc: '<135 bpm', description: '20 min EF → 4 accélérations de 100m → retour 5 min.' },
    ]
  },
  {
    week: 15, phase: 'affutage', targetKm: 10, runs: 3,
    notes: '🏁 Semaine de course — repos actif uniquement',
    seances: [
      { type: 'recuperation', titre: 'Jogging très léger', distance: '20 min', allure: '6:00–6:30/km', fc: '<125 bpm', description: 'Lundi ou mardi uniquement. Quasi marche rapide.' },
      { type: 'recuperation', titre: 'Activation J-3 ou J-4', distance: '15 min + strides', allure: '6:00/km + 4×80m', fc: '<130 bpm', description: '10 min facile → 4 accélérations 80m → marche 5 min.' },
      { type: 'course', titre: '🏁 10km — Sub 40 !', distance: '10 km', allure: '3:58–4:00/km', fc: 'Zone 4-5', description: 'Km1 à 4:05. Km2-7 à 4:00. Km8-9 accélère. Km10 tout donner. Tu as fait 37:50, ce niveau est en toi.' },
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
  km:      v => v != null ? v.toFixed(1) : '—',
  pace:    v => { if (!v) return '—'; const t = Math.round(v); return `${Math.floor(t/60)}:${String(t%60).padStart(2,'0')}`; },
  time:    v => { if (!v) return '—'; const h = Math.floor(v/3600), m = Math.floor((v%3600)/60); return h > 0 ? `${h}h${String(m).padStart(2,'0')}` : `${m}min`; },
  date:    v => new Date(v).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }),
  phase:   v => ({ reprise:'Reprise', developpement:'Développement', recuperation:'Récupération', affutage:'Affûtage', specifique:'Spécifique' }[v] || v),
  delta:   (real, target) => { if (!target) return '—'; const d = ((real-target)/target*100).toFixed(0); return (d>0?'+':'')+d+'%'; },
};

function parseTargetPace(allure) {
  const m = allure.match(/(\d+):(\d+)\s*(?:[–\-]\s*(\d+):(\d+))?\/km/);
  if (!m) return null;
  const p1 = parseInt(m[1])*60+parseInt(m[2]);
  const p2 = m[3] ? parseInt(m[3])*60+parseInt(m[4]) : p1;
  return { min: Math.min(p1,p2), max: Math.max(p1,p2), mid: (Math.min(p1,p2)+Math.max(p1,p2))/2 };
}

function calcKmFromSeance(seance) {
  if (['renforcement','velo'].includes(seance.type)) return 0;
  const dist = seance.distance.toLowerCase();
  const kmMatch = dist.match(/^(\d+(?:[.,]\d+)?)\s*km/);
  if (kmMatch) return parseFloat(kmMatch[1].replace(',','.'));
  const kmRangeMatch = dist.match(/(\d+(?:[.,]\d+)?)\s*[–\-]\s*(\d+(?:[.,]\d+)?)\s*km/);
  if (kmRangeMatch) return (parseFloat(kmRangeMatch[1])+parseFloat(kmRangeMatch[2]))/2;
  const minMatch = dist.match(/(\d+)(?:\s*[–\-]\s*(\d+))?\s*min/);
  if (minMatch) {
    const minutes = minMatch[2]?(parseInt(minMatch[1])+parseInt(minMatch[2]))/2:parseInt(minMatch[1]);
    const pace = parseTargetPace(seance.allure);
    if (pace) return parseFloat(((minutes*60)/pace.mid).toFixed(2));
    const def = {endurance:360,recuperation:390,tempo:285,fractionne:300,test:330,course:239}[seance.type]||360;
    return parseFloat(((minutes*60)/def).toFixed(2));
  }
  return 0;
}

function computePlanKm(plan) {
  return plan.map(w => ({...w, targetKm: parseFloat(w.seances.reduce((s,x)=>s+calcKmFromSeance(x),0).toFixed(1))}));
}

// ── ANALYSE PROFONDE PAR SÉANCE (niveau coach FFA) ────────────────────────────
function analyzeRunDeep(run, seance, seanceIndex, weekNum) {
  if (!run || !seance) return null;
  
  const realKm      = run.distance / 1000;
  const realPaceSec = run.movingTime && run.distance ? (run.movingTime / run.distance) * 1000 : null;
  const realHr      = run.avgHr;
  const targetPace  = parseTargetPace(seance.allure);
  const targetKm    = calcKmFromSeance(seance);
  
  const observations = [];  // { level: 'good'|'warn'|'bad'|'info', text }
  const adjustments  = [];  // ajustements suggérés sur séances futures

  // ── 1. ANALYSE DU VOLUME ──────────────────────────────────────────────────
  if (targetKm > 0) {
    const kmDiff = realKm - targetKm;
    const kmPct  = (kmDiff / targetKm) * 100;
    if (Math.abs(kmPct) <= 10) {
      observations.push({ level:'good', text:`Volume parfait : ${realKm.toFixed(1)} km réalisés pour ${targetKm} km prévus (écart ${fmt.delta(realKm, targetKm)}).` });
    } else if (kmPct < -25) {
      observations.push({ level:'bad', text:`Volume très insuffisant : ${realKm.toFixed(1)} km seulement sur ${targetKm} km prévus (écart ${fmt.delta(realKm, targetKm)}). Séance écourtée de plus d'un quart.` });
      adjustments.push({ type:'volume', direction:'down', text:`Réduire le volume cible de la semaine suivante de 15% pour éviter d'accumuler de la fatigue sur une base incomplète.` });
    } else if (kmPct < -10) {
      observations.push({ level:'warn', text:`Volume légèrement court : ${realKm.toFixed(1)} km sur ${targetKm} km prévus (écart ${fmt.delta(realKm, targetKm)}). Acceptable mais à surveiller.` });
    } else if (kmPct > 25) {
      observations.push({ level:'warn', text:`Volume dépassé de ${fmt.delta(realKm, targetKm)} (${realKm.toFixed(1)} km pour ${targetKm} km prévus). Attention au risque de surcharge.` });
      adjustments.push({ type:'volume', direction:'check', text:`Vérifier la récupération sur les 48h suivantes. Si signes de fatigue, alléger la prochaine séance.` });
    }
  }

  // ── 2. ANALYSE DE L'ALLURE ────────────────────────────────────────────────
  if (realPaceSec) {
    if (targetPace) {
      const tolerance = 15;
      const diffSec   = realPaceSec - targetPace.mid;
      if (Math.abs(diffSec) <= tolerance) {
        observations.push({ level:'good', text:`Allure dans la cible : ${fmt.pace(realPaceSec)}/km pour une cible ${seance.allure} (écart ${diffSec > 0 ? '+' : ''}${Math.round(diffSec)}s/km). Parfait.` });
      } else if (realPaceSec > targetPace.max + tolerance) {
        const overSec = Math.round(realPaceSec - targetPace.max);
        observations.push({ level:'warn', text:`Allure plus lente que prévu : ${fmt.pace(realPaceSec)}/km pour une cible de ${seance.allure} (+${overSec}s/km). Possible fatigue ou mauvaise journée.` });
        if (seance.type === 'fractionne' || seance.type === 'tempo') {
          adjustments.push({ type:'allure', direction:'down', text:`Revoir l'allure cible de la prochaine séance ${seance.type === 'fractionne' ? 'fractionnée' : 'tempo'} à ${fmt.pace(targetPace.mid + 10)}/km pour coller à ton niveau réel.` });
        }
      } else if (realPaceSec < targetPace.min - tolerance) {
        const underSec = Math.round(targetPace.min - realPaceSec);
        observations.push({ level:'good', text:`Allure au-dessus de la cible : ${fmt.pace(realPaceSec)}/km (${underSec}s/km plus vite que prévu). Excellente forme — continue.` });
        if (seance.type === 'fractionne' || seance.type === 'tempo') {
          adjustments.push({ type:'allure', direction:'up', text:`Potentiel de progression détecté. Légère hausse de l'allure cible suggérée sur la prochaine séance de même type.` });
        }
      }
    } else {
      // Allure non parseable (VMA%, EF+strides, etc.) → analyse contextuelle selon type
      observations.push({ level:'info', text:`Allure moyenne : ${fmt.pace(realPaceSec)}/km. (Séance de type "${seance.type}" — évaluation sur FC et volume car allure cible non fixe.)` });
      if (seance.type === 'endurance' && realPaceSec < 300) {
        observations.push({ level:'warn', text:`${fmt.pace(realPaceSec)}/km semble trop rapide pour une séance d'endurance fondamentale. L'EF doit rester conversationnelle — essaie de rester au-dessus de 5:30/km.` });
      }
      if (seance.type === 'fractionne') {
        observations.push({ level:'info', text:`Séance fractionnée à ${fmt.pace(realPaceSec)}/km de moyenne (récupérations incluses). Vérifie que tes répétitions étaient nettement plus rapides que cette moyenne.` });
      }
      if (seance.type === 'recuperation' && realPaceSec < 330) {
        observations.push({ level:'warn', text:`${fmt.pace(realPaceSec)}/km, c'est un peu vif pour une séance de récupération. La récupération doit être ultra-facile pour remplir son rôle.` });
      }
    }
  }

  // ── 3. ANALYSE CARDIAQUE ──────────────────────────────────────────────────
  if (realHr) {
    const expectedZone = {
      endurance:    { min: 130, max: 152, label: 'Zone 2 (130-152 bpm)' },
      fractionne:   { min: 160, max: 180, label: 'Zone 4-5 (160-180 bpm)' },
      tempo:        { min: 152, max: 168, label: 'Zone 3-4 (152-168 bpm)' },
      recuperation: { min: 110, max: 135, label: 'Zone 1 (110-135 bpm)' },
      test:         { min: 170, max: 195, label: 'Zone 5 (>170 bpm)' },
      course:       { min: 165, max: 185, label: 'Zone 4-5 (165-185 bpm)' },
    }[seance.type];

    if (expectedZone) {
      if (realHr > expectedZone.max + 5) {
        observations.push({ level:'warn', text:`FC moyenne élevée pour ce type de séance : ${realHr} bpm (attendu : ${expectedZone.label}). Peut indiquer fatigue, chaleur ou manque de récupération.` });
        if (realHr > expectedZone.max + 15) {
          adjustments.push({ type:'fc', direction:'down', text:`FC significativement au-dessus de la zone. Envisager de décaler la prochaine séance intense et d'insérer une séance de récupération active.` });
        }
      } else if (realHr < expectedZone.min - 5 && seance.type !== 'recuperation') {
        observations.push({ level:'info', text:`FC moyenne basse pour ce type de séance : ${realHr} bpm (attendu : ${expectedZone.label}). Bonne économie de course ou allure trop faible.` });
      } else {
        observations.push({ level:'good', text:`FC moyenne dans la zone cible : ${realHr} bpm (cible : ${expectedZone.label}).` });
      }
    } else {
      observations.push({ level:'info', text:`FC moyenne enregistrée : ${realHr} bpm.` });
    }

    // Dérive cardiaque (si la séance dure + de 30 min, la FC monte en fin)
    if (run.movingTime > 1800 && seance.type === 'endurance') {
      if (realHr > 155) {
        observations.push({ level:'warn', text:`FC élevée sur cette sortie longue (${realHr} bpm). Vérifie que tu n'es pas parti trop vite en début de sortie — la dérive cardiaque est une signature classique d'une allure de départ trop haute.` });
      }
    }
  }

  // ── 4. ANALYSE DU DÉNIVELÉ ───────────────────────────────────────────────
  if (run.elevation > 50) {
    const elevPerKm = realKm > 0 ? Math.round(run.elevation / realKm) : 0;
    if (elevPerKm > 20) {
      observations.push({ level:'info', text:`Dénivelé notable : +${Math.round(run.elevation)}m sur ${realKm.toFixed(1)} km (${elevPerKm}m/km). L'allure objectif était calculée pour du plat — un écart d'allure sur terrain vallonné est normal et acceptable.` });
    }
  }

  // ── 5. ANALYSE CONTEXTUELLE PAR TYPE DE SÉANCE ───────────────────────────
  if (seance.type === 'fractionne') {
    if (realPaceSec && targetPace && realPaceSec > targetPace.max + 10) {
      observations.push({ level:'warn', text:`Les répétitions semblent avoir été réalisées trop lentement pour développer la filière VMA. Sur le fractionné, il vaut mieux faire moins de répétitions à la bonne allure que toutes les répétitions trop lentement.` });
    }
    if (realPaceSec && targetPace && realPaceSec < targetPace.min - 20) {
      observations.push({ level:'warn', text:`Attention : si les répétitions ont été réalisées à ${fmt.pace(realPaceSec)}/km en moyenne, il est possible que les temps de récupération aient été trop courts, ou que la séance ait dépassé tes capacités actuelles.` });
    }
  }

  if (seance.type === 'tempo') {
    if (realPaceSec && targetPace) {
      const ecart = Math.abs(realPaceSec - targetPace.mid);
      if (ecart < 8) {
        observations.push({ level:'good', text:`Tempo très régulier — excellent travail de contrôle de l'allure. C'est exactement ce qu'on cherche sur une séance seuil.` });
      }
    }
  }

  if (seance.type === 'endurance' && realPaceSec && targetPace) {
    if (realPaceSec < targetPace.min - 20) {
      observations.push({ level:'warn', text:`Attention : courir trop vite en endurance fondamentale est contre-productif. L'EF doit rester dans la zone 2 pour développer le moteur aérobie. Mieux vaut ralentir même si ça paraît trop facile.` });
    }
  }

  // ── 6. VERDICT GLOBAL ────────────────────────────────────────────────────
  const goods = observations.filter(o => o.level === 'good').length;
  const bads  = observations.filter(o => o.level === 'bad').length;
  const warns = observations.filter(o => o.level === 'warn').length;

  let verdict, verdictLevel;
  if (bads === 0 && warns === 0) {
    verdictLevel = 'good';
    verdict = 'Séance réussie — dans les clous du plan.';
  } else if (bads >= 1 || warns >= 2) {
    verdictLevel = 'bad';
    verdict = 'Séance difficile — des ajustements sont proposés.';
  } else {
    verdictLevel = 'warn';
    verdict = 'Séance globalement correcte — quelques points à surveiller.';
  }

  return { observations, adjustments, verdict, verdictLevel, weekNum, seanceIndex };
}

// ── Génère la proposition d'ajustement pour le plan ──────────────────────────
function buildPlanProposal(analysis, weekNum) {
  if (!analysis || analysis.adjustments.length === 0) return null;
  
  const currentPlan = adaptivePlan.get();
  const currentWeek = currentPlan.find(w => w.week === weekNum);
  const nextWeekNum = weekNum + 1;
  const nextWeek    = currentPlan.find(w => w.week === nextWeekNum);
  
  if (!nextWeek) return null;

  const proposals = [];

  analysis.adjustments.forEach(adj => {
    if (adj.type === 'volume' && adj.direction === 'down') {
      const newKm = Math.round(nextWeek.targetKm * 0.85);
      proposals.push({
        weekNum: nextWeekNum,
        label: `Réduire le volume S${nextWeekNum}`,
        detail: `${nextWeek.targetKm} km → ${newKm} km (−15%)`,
        reason: adj.text,
        patch: { targetKm: newKm, noteCoach: `Ajusté automatiquement suite à la séance "${currentWeek?.seances[analysis.seanceIndex]?.titre}" de S${weekNum} (volume insuffisant).` }
      });
    }
    if (adj.type === 'allure' && adj.direction === 'down') {
      const targetSec = parseTargetPace(nextWeek.seances.find(s => s.type === 'fractionne' || s.type === 'tempo')?.allure || '');
      if (targetSec) {
        const newMin = Math.round(targetSec.min + 10);
        const newMax = Math.round(targetSec.max + 10);
        const newAllure = `${Math.floor(newMin/60)}:${String(newMin%60).padStart(2,'0')}–${Math.floor(newMax/60)}:${String(newMax%60).padStart(2,'0')}/km`;
        const seanceIdx = nextWeek.seances.findIndex(s => s.type === 'fractionne' || s.type === 'tempo');
        if (seanceIdx >= 0) {
          proposals.push({
            weekNum: nextWeekNum,
            label: `Ajuster l'allure cible S${nextWeekNum}`,
            detail: `${nextWeek.seances[seanceIdx].allure} → ${newAllure}`,
            reason: adj.text,
            patch: { seances: { [seanceIdx]: { allure: newAllure, noteCoach: `Allure ajustée suite à la séance de S${weekNum}.` } } }
          });
        }
      }
    }
    if (adj.type === 'allure' && adj.direction === 'up') {
      const targetSec = parseTargetPace(nextWeek.seances.find(s => s.type === 'fractionne' || s.type === 'tempo')?.allure || '');
      if (targetSec) {
        const newMin = Math.round(Math.max(targetSec.min - 8, 225));
        const newMax = Math.round(Math.max(targetSec.max - 8, 235));
        const newAllure = `${Math.floor(newMin/60)}:${String(newMin%60).padStart(2,'0')}–${Math.floor(newMax/60)}:${String(newMax%60).padStart(2,'0')}/km`;
        const seanceIdx = nextWeek.seances.findIndex(s => s.type === 'fractionne' || s.type === 'tempo');
        if (seanceIdx >= 0) {
          proposals.push({
            weekNum: nextWeekNum,
            label: `Progression de l'allure S${nextWeekNum}`,
            detail: `${nextWeek.seances[seanceIdx].allure} → ${newAllure}`,
            reason: adj.text,
            patch: { seances: { [seanceIdx]: { allure: newAllure } } }
          });
        }
      }
    }
    if (adj.type === 'fc' && adj.direction === 'down') {
      proposals.push({
        weekNum: nextWeekNum,
        label: `Insérer une récupération active S${nextWeekNum}`,
        detail: `Convertir une séance EF en récupération légère (<130 bpm)`,
        reason: adj.text,
        patch: { noteCoach: `⚠️ FC élevée détectée en S${weekNum}. Semaine allégée recommandée.` }
      });
    }
  });

  return proposals.length > 0 ? proposals : null;
}

// ── Global state ──────────────────────────────────────────────────────────────
const $ = id => document.getElementById(id);
let chartInstance = null;
let currentPeriod = 'hebdo';
let globalData = null;
let pendingProposals = [];

// ── Toast ─────────────────────────────────────────────────────────────────────
function showToast(msg) {
  const t = $('toast');
  t.textContent = msg;
  t.classList.remove('hidden');
  setTimeout(() => t.classList.add('hidden'), 3000);
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
  if (cached) renderAll(cached);
  else loadActivities();
  renderProgramme();
})();

function refreshData() { localCache.clear(); loadActivities(true); }

async function loadActivities(force = false) {
  const btn = $('btn-refresh');
  btn.classList.add('spinning');
  try {
    if (force) await fetch('/api/refresh', { method: 'POST' });
    const data = await fetch('/api/activities').then(r => r.json());
    if (data.error) throw new Error(data.error);
    localCache.set(data);
    renderAll(data);
    showToast(data.fromCache ? 'Cache · actualise dans 5 min' : 'Données actualisées ✓');
  } catch(e) { showToast('Erreur : ' + e.message); }
  finally { btn.classList.remove('spinning'); }
}

// ── Rendu global ──────────────────────────────────────────────────────────────
function renderAll(data) {
  const planWithKm = computePlanKm(adaptivePlan.get());
  data.plan = data.plan.map(p => {
    const computed = planWithKm.find(x => x.week === p.week);
    return computed ? { ...p, targetKm: computed.targetKm } : p;
  });
  globalData = data;
  $('days-count').textContent = data.daysUntilRace;
  $('sidebar-week').textContent = data.currentPlanWeek > 0 ? data.currentPlanWeek : '—';
  renderHero(data);
  renderStats(data);
  renderChart(data.weeks, data.plan);
  renderSeancesMatching(data);
  renderHistory(data.weeks);
  renderRecentRuns(data.weeks);
}

function renderHero(data) {
  const planWeek = adaptivePlan.get().find(p => p.week === data.currentPlanWeek);
  $('hero-week-badge').textContent = `S${data.currentPlanWeek > 0 ? data.currentPlanWeek : '—'}`;
  if (planWeek) {
    $('hero-week-phase').textContent = fmt.phase(planWeek.phase);
    $('hero-week-note').textContent  = planWeek.noteCoach || planWeek.notes;
  }
}

function setPeriod(period) {
  currentPeriod = period;
  $('btn-hebdo').classList.toggle('active', period === 'hebdo');
  $('btn-mensuel').classList.toggle('active', period === 'mensuel');
  if (globalData) renderStats(globalData);
}

function getMonthStats(weeks) {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd   = new Date(now.getFullYear(), now.getMonth()+1, 0);
  const mw = weeks.filter(w => { const d = new Date(w.date); return d >= monthStart && d <= monthEnd; });
  if (!mw.length) return null;
  const kmDone = parseFloat(mw.reduce((s,w)=>s+w.kmDone,0).toFixed(1));
  const runCount = mw.reduce((s,w)=>s+w.runCount,0);
  const totalTime = mw.reduce((s,w)=>s+w.totalTime,0);
  const totalElevation = mw.reduce((s,w)=>s+w.totalElevation,0);
  const hrList  = mw.filter(w=>w.avgHeartrate).map(w=>w.avgHeartrate);
  const pl      = mw.filter(w=>w.avgPace).map(w=>w.avgPace);
  const planNums = mw.map(w=>w.weekNum).filter(n=>n>0);
  const targetKm = planNums.reduce((s,n)=>{ const pw=PLAN_DETAIL.find(p=>p.week===n); return s+(pw?pw.seances.reduce((ss,x)=>ss+calcKmFromSeance(x),0):0); },0);
  return { kmDone, runCount, totalTime, totalElevation,
    avgHeartrate: hrList.length ? Math.round(hrList.reduce((a,b)=>a+b,0)/hrList.length) : null,
    avgPace: pl.length ? pl.reduce((a,b)=>a+b,0)/pl.length : null,
    targetKm: parseFloat(targetKm.toFixed(1)), targetRuns: planNums.length*4 };
}

function renderStats(data) {
  const { weeks, currentWeek, currentPlanWeek, plan } = data;
  if (currentPeriod === 'mensuel') {
    const month = getMonthStats(weeks);
    $('period-hint').textContent = new Date().toLocaleDateString('fr-FR', { month:'long', year:'numeric' });
    if (!month) { ['cur-km','cur-runs','cur-pace','cur-hr','cur-time','cur-elev'].forEach(id=>$(id).textContent='—'); setProgress('prog-km',0); setProgress('prog-runs',0); return; }
    $('cur-km').textContent = fmt.km(month.kmDone); $('cur-runs').textContent = month.runCount;
    $('cur-pace').textContent = fmt.pace(month.avgPace); $('cur-hr').textContent = month.avgHeartrate||'—';
    $('cur-time').textContent = fmt.time(month.totalTime); $('cur-elev').textContent = month.totalElevation?`+${month.totalElevation}`:'—';
    $('cur-km-target').textContent = `${month.targetKm} km prévus`; $('cur-runs-target').textContent = `${month.targetRuns} prévues`;
    if (month.targetKm>0) { setProgress('prog-km',Math.min((month.kmDone/month.targetKm)*100,100),month.kmDone>=month.targetKm); setProgress('prog-runs',Math.min((month.runCount/month.targetRuns)*100,100),month.runCount>=month.targetRuns); }
    return;
  }
  const planWeek = plan.find(p=>p.week===currentPlanWeek);
  $('period-hint').textContent = `Semaine ${currentPlanWeek>0?currentPlanWeek:'—'}`;
  if (planWeek) { $('cur-km-target').textContent=`${planWeek.targetKm} km prévus`; $('cur-runs-target').textContent=`${planWeek.runs} prévues`; }
  if (!currentWeek) { ['cur-km','cur-runs','cur-pace','cur-hr','cur-time','cur-elev'].forEach(id=>$(id).textContent='0'); setProgress('prog-km',0); setProgress('prog-runs',0); return; }
  $('cur-km').textContent=fmt.km(currentWeek.kmDone); $('cur-runs').textContent=currentWeek.runCount;
  $('cur-pace').textContent=fmt.pace(currentWeek.avgPace); $('cur-hr').textContent=currentWeek.avgHeartrate||'—';
  $('cur-time').textContent=fmt.time(currentWeek.totalTime); $('cur-elev').textContent=currentWeek.totalElevation?`+${currentWeek.totalElevation}`:'—';
  if (planWeek && planWeek.targetKm>0) {
    setProgress('prog-km',Math.min((currentWeek.kmDone/planWeek.targetKm)*100,100),(currentWeek.kmDone/planWeek.targetKm)>=1);
    setProgress('prog-runs',Math.min((currentWeek.runCount/planWeek.runs)*100,100),(currentWeek.runCount/planWeek.runs)>=1);
  }
}

function setProgress(id, pct, over=false) { const el=$(id); el.style.width=pct+'%'; el.classList.toggle('over',over); }

function renderChart(weeks, plan) {
  const cw = [...weeks].reverse().slice(-12);
  const labels = cw.map(w=>`S${w.weekNum}`);
  const ctx = $('chart-progress').getContext('2d');
  if (chartInstance) chartInstance.destroy();
  Chart.defaults.font.family = 'JetBrains Mono, monospace';
  Chart.defaults.color = '#555555';
  chartInstance = new Chart(ctx, {
    type:'bar',
    data:{ labels, datasets:[
      { label:'Réel', data:cw.map(w=>w.kmDone), backgroundColor:'#fc4c02', borderRadius:4, borderSkipped:false, order:1 },
      { label:'Plan', data:cw.map(w=>w.plan?.targetKm??null), type:'line', borderColor:'#2e2e2e', backgroundColor:'transparent', borderWidth:1.5, pointRadius:3, pointBackgroundColor:'#2e2e2e', tension:0.3, order:0 }
    ]},
    options:{ responsive:true, maintainAspectRatio:false, interaction:{mode:'index',intersect:false},
      plugins:{ legend:{display:false}, tooltip:{ backgroundColor:'#1a1a1a', borderColor:'#2e2e2e', borderWidth:1, titleColor:'#888', bodyColor:'#f0f0f0', padding:10 } },
      scales:{ x:{ grid:{color:'#111'}, ticks:{font:{size:10}} }, y:{ grid:{color:'#1a1a1a'}, ticks:{font:{size:10},callback:v=>v+' km'}, beginAtZero:true } }
    }
  });
}

// ── Matching : 1ère sortie → séance 1, 2ème → séance 2, etc. ─────────────────
function matchSeancesToRuns(weekNum, runs) {
  const plan = adaptivePlan.get().find(w => w.week === weekNum);
  if (!plan) return [];
  const sorted = [...runs].sort((a,b) => new Date(a.date)-new Date(b.date));
  let ri = 0;
  return plan.seances.map((seance, idx) => {
    const trackable = !['renforcement'].includes(seance.type);
    let matchedRun = null;
    if (trackable && ri < sorted.length) { matchedRun = sorted[ri]; ri++; }
    return { seance, index: idx, matchedRun, trackable };
  });
}

function compareSeanceToRun(seance, run) {
  if (!run) return null;
  const realKm = run.distance/1000;
  const realPaceSec = run.movingTime && run.distance ? (run.movingTime/run.distance)*1000 : null;
  const targetKm = calcKmFromSeance(seance);
  const targetPace = parseTargetPace(seance.allure);
  const kmDiff = targetKm>0 ? ((realKm-targetKm)/targetKm)*100 : null;
  const kmStatus = kmDiff===null?'neutral':Math.abs(kmDiff)<=15?'ok':(kmDiff<-15?'miss':'warn');
  let paceStatus = 'neutral';
  if (targetPace && realPaceSec) paceStatus = (realPaceSec>=targetPace.min-15&&realPaceSec<=targetPace.max+15)?'ok':'warn';
  return { realKm, realPaceSec, kmStatus, paceStatus, targetKm };
}

// ── Rendu séances de la semaine avec analyse par séance ──────────────────────
function renderSeancesMatching(data) {
  const container = $('seances-matching-list');
  if (!container) return;
  container.innerHTML = '';
  const weekNum = data.currentPlanWeek;
  $('seances-week-label').textContent = `S${weekNum > 0 ? weekNum : '—'}`;
  const plan = adaptivePlan.get().find(w => w.week === weekNum);
  if (!plan) { container.innerHTML = '<div style="padding:20px;color:var(--text-3);font-size:12px;">Plan non disponible.</div>'; return; }
  const weekRuns = data.currentWeek?.runs || [];
  const matches = matchSeancesToRuns(weekNum, weekRuns);
  pendingProposals = [];

  matches.forEach((m, i) => {
    const c = SEANCE_COLORS[m.seance.type] || SEANCE_COLORS.endurance;
    const checked = !m.trackable && manualChecks.isChecked(weekNum, i);
    
    // Analyse profonde si la séance est réalisée
    let analysis = null;
    let proposals = null;
    if (m.matchedRun) {
      analysis  = analyzeRunDeep(m.matchedRun, m.seance, i, weekNum);
      proposals = buildPlanProposal(analysis, weekNum);
      if (proposals) pendingProposals.push(...proposals);
    }

    const div = document.createElement('div');
    div.className = 'seance-match-item';
    div.style.flexDirection = 'column';
    div.style.gap = '0';

    // ── Ligne principale séance ──
    let statusHtml, quickInfoHtml;
    if (!m.trackable) {
      statusHtml = checked ? `<span class="seance-status status-done">Fait</span>` : `<span class="seance-status status-notrack">Hors Strava</span>`;
      quickInfoHtml = `<label class="manual-check-wrap"><input type="checkbox" class="manual-check" ${checked?'checked':''} onchange="onManualCheck(${weekNum},${i})"><span>${checked?'Marqué comme fait':'Marquer comme fait'}</span></label>`;
    } else if (m.matchedRun) {
      const cmp = compareSeanceToRun(m.seance, m.matchedRun);
      const verdictIcon = analysis ? { good:'✓', warn:'!', bad:'✕' }[analysis.verdictLevel] : '';
      const verdictColor = analysis ? { good:'var(--green)', warn:'var(--yellow)', bad:'var(--red)' }[analysis.verdictLevel] : '';
      statusHtml = `<span class="seance-status status-done">Réalisé</span>`;
      quickInfoHtml = `
        <div style="display:flex;align-items:center;gap:12px;font-family:var(--mono);font-size:11px;color:var(--text-2)">
          <span style="color:${verdictColor};font-weight:500">${verdictIcon} ${analysis?.verdict||''}</span>
          <span>${cmp?.realKm?.toFixed(1)??'—'} km</span>
          <span>${fmt.pace(cmp?.realPaceSec)}/km</span>
          ${m.matchedRun.avgHr ? `<span>${m.matchedRun.avgHr} bpm</span>` : ''}
        </div>`;
    } else {
      statusHtml = `<span class="seance-status status-todo">À faire</span>`;
      quickInfoHtml = `<span style="font-size:11px;color:var(--text-3)">Pas encore réalisée cette semaine</span>`;
    }

    div.innerHTML = `
      <div style="display:flex;align-items:flex-start;gap:14px;padding:14px 20px;">
        <div class="seance-match-num">${i+1}</div>
        <div class="seance-type-dot" style="background:${c.border};margin-top:4px"></div>
        <div style="flex:1;min-width:0;">
          <div class="seance-match-title">${m.seance.titre} ${statusHtml}</div>
          <div class="seance-match-target">${m.seance.distance} · ${m.seance.allure}</div>
          ${m.seance.noteCoach ? `<div style="font-size:11px;color:var(--accent);margin-top:4px">📌 ${m.seance.noteCoach}</div>` : ''}
        </div>
        <div>${quickInfoHtml}</div>
      </div>
      ${analysis ? renderSeanceAnalysisInline(analysis, i) : ''}
      ${proposals && proposals.length > 0 ? renderProposalBanner(proposals, i) : ''}
    `;
    container.appendChild(div);
  });
}

// ── Bloc analyse inline (collapsible) ────────────────────────────────────────
function renderSeanceAnalysisInline(analysis, seanceIdx) {
  const icons = { good:'✓', warn:'!', bad:'✕', info:'i' };
  const colors = { good:'var(--green)', warn:'var(--yellow)', bad:'var(--red)', info:'var(--text-3)' };
  
  const rows = analysis.observations.map(o => `
    <div class="analysis-obs-row" style="border-left-color:${colors[o.level]}">
      <span class="obs-icon" style="color:${colors[o.level]}">${icons[o.level]}</span>
      <span class="obs-text">${o.text}</span>
    </div>
  `).join('');

  return `
    <div class="seance-analysis-block" id="analysis-block-${seanceIdx}">
      <button class="analysis-toggle" onclick="toggleAnalysis(${seanceIdx})">
        <span>Analyse détaillée</span>
        <svg id="analysis-chevron-${seanceIdx}" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
      </button>
      <div class="analysis-obs-list" id="analysis-obs-${seanceIdx}" style="display:none">
        ${rows}
      </div>
    </div>
  `;
}

function toggleAnalysis(idx) {
  const list     = document.getElementById(`analysis-obs-${idx}`);
  const chevron  = document.getElementById(`analysis-chevron-${idx}`);
  const isOpen   = list.style.display !== 'none';
  list.style.display    = isOpen ? 'none' : 'block';
  chevron.style.transform = isOpen ? '' : 'rotate(180deg)';
}

// ── Bannière de proposition d'ajustement ──────────────────────────────────────
function renderProposalBanner(proposals, seanceIdx) {
  const items = proposals.map((p, pi) => `
    <div class="proposal-item">
      <div class="proposal-label">${p.label}</div>
      <div class="proposal-detail">${p.detail}</div>
      <div class="proposal-reason">${p.reason}</div>
      <div class="proposal-actions">
        <button class="proposal-btn proposal-accept" onclick="acceptProposal(${seanceIdx},${pi})">Accepter</button>
        <button class="proposal-btn proposal-refuse" onclick="refuseProposal(${seanceIdx},${pi})">Ignorer</button>
      </div>
    </div>
  `).join('');

  return `
    <div class="proposal-banner" id="proposal-banner-${seanceIdx}">
      <div class="proposal-header">
        <span class="proposal-icon">⚡</span>
        <span class="proposal-title">Ajustement du plan suggéré</span>
      </div>
      ${items}
    </div>
  `;
}

function acceptProposal(seanceIdx, proposalIdx) {
  const p = pendingProposals.find((_, i) => i === proposalIdx);
  if (!p) return;
  adaptivePlan.applyAdjustment(p.weekNum, p.patch);
  document.getElementById(`proposal-banner-${seanceIdx}`)?.remove();
  showToast(`✓ Ajustement appliqué sur S${p.weekNum}`);

  // Re-render la page Plan (sidebar) avec le plan mis à jour
  renderProgramme();

  // Met aussi à jour globalData.plan pour que l'accueil reflète les nouveaux km
  if (globalData) {
    const updatedPlan = computePlanKm(adaptivePlan.get());
    globalData.plan = globalData.plan.map(pp => {
      const updated = updatedPlan.find(x => x.week === pp.week);
      return updated ? { ...pp, targetKm: updated.targetKm, notes: updated.notes, noteCoach: updated.noteCoach } : pp;
    });
    // Met à jour les stats de la semaine en cours si c'est la semaine ajustée
    if (p.weekNum === globalData.currentPlanWeek) {
      renderStats(globalData);
      renderHero(globalData);
    }
  }
}

function refuseProposal(seanceIdx, proposalIdx) {
  document.getElementById(`proposal-banner-${seanceIdx}`)?.remove();
  showToast('Ajustement ignoré');
}

function onManualCheck(weekNum, idx) {
  const checked = manualChecks.toggle(weekNum, idx);
  showToast(checked ? 'Séance marquée comme faite ✓' : 'Séance décochée');
  if (globalData) renderSeancesMatching(globalData);
}

// ── Historique ────────────────────────────────────────────────────────────────
function renderHistory(weeks) {
  const tbody = $('history-body');
  tbody.innerHTML = '';
  weeks.slice(0,15).forEach(w => {
    const ecartVal = w.vsTarget;
    const ecartCls = ecartVal==null?'ecart-neu':ecartVal>=0?'ecart-pos':'ecart-neg';
    const ecartTxt = ecartVal==null?'—':`${ecartVal>=0?'+':''}${ecartVal}`;
    const phaseCls = w.plan?`badge badge-${w.plan.phase}`:'badge';
    const phaseTxt = w.plan?fmt.phase(w.plan.phase):'—';
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="td-week">${w.weekNum>0?`S${w.weekNum}`:'—'} <span style="color:var(--text-3);font-size:10px">${fmt.date(w.date)}</span></td>
      <td><span class="${phaseCls}">${phaseTxt}</span></td>
      <td>${w.runCount}</td>
      <td class="td-km">${fmt.km(w.kmDone)}</td>
      <td style="font-family:var(--mono);font-size:12px;color:var(--text-3)">${w.plan?.targetKm??'—'}</td>
      <td class="td-ecart ${ecartCls}">${ecartTxt}</td>
      <td class="td-pace">${fmt.pace(w.avgPace)}</td>
      <td class="td-hr">${w.avgHeartrate??'—'}</td>
      <td class="td-elev">${w.totalElevation?`+${w.totalElevation}m`:'—'}</td>
    `;
    tbody.appendChild(tr);
  });
}

// ── Sorties ───────────────────────────────────────────────────────────────────
function renderRecentRuns(weeks) {
  const container = $('runs-list');
  if (!container) return;
  container.innerHTML = '';
  const runs = weeks.flatMap(w=>w.runs).sort((a,b)=>new Date(b.date)-new Date(a.date)).slice(0,20);
  runs.forEach(run => {
    const div = document.createElement('div');
    div.className = 'run-card';
    div.innerHTML = `
      <div class="run-date">${fmt.date(run.date)}</div>
      <div class="run-name">${run.name}</div>
      <div class="run-stat">${fmt.km(run.distance/1000)} <span>km</span></div>
      <div class="run-stat">${fmt.time(run.movingTime)} <span>durée</span></div>
      <div class="run-stat">${fmt.pace(run.movingTime&&run.distance?(run.movingTime/run.distance)*1000:null)} <span>/km</span></div>
      <div class="run-stat">${run.avgHr?run.avgHr+' bpm':'—'} <span>FC moy.</span></div>
    `;
    container.appendChild(div);
  });
}

// ── Programme (plan adaptatif) ────────────────────────────────────────────────
function renderProgramme() {
  const container = $('programme-list');
  if (!container) return;
  container.innerHTML = '';
  const currentWeekNum = getCurrentPlanWeek();
  const plan = adaptivePlan.get();

  plan.forEach(week => {
    const isCurrent  = week.week === currentWeekNum;
    const isModified = adaptivePlan.isModified(week.week);
    const phaseLabel = fmt.phase(week.phase);
    const weekEl = document.createElement('div');
    weekEl.className = `prog-week${isCurrent?' prog-week-current':''}`;
    weekEl.innerHTML = `
      <button class="prog-week-header" onclick="toggleWeek(${week.week})">
        <div class="prog-week-left">
          <span class="prog-week-num">S${week.week}</span>
          <span class="badge badge-${week.phase}">${phaseLabel}</span>
          ${isCurrent?'<span class="badge-current">En cours</span>':''}
          ${isModified?'<span class="badge-modified">Ajusté</span>':''}
        </div>
        <div class="prog-week-right">
          <span class="prog-week-km">${week.targetKm} km</span>
          <span class="prog-week-runs">${week.runs} sorties</span>
          ${isModified?`<button class="btn-reset-week" onclick="event.stopPropagation();resetWeek(${week.week})">↩ Réinitialiser</button>`:''}
          <svg class="prog-chevron" id="chevron-${week.week}" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
        </div>
      </button>
      <div class="prog-week-body" id="week-body-${week.week}" style="display:${isCurrent?'block':'none'}">
        ${week.noteCoach?`<div class="prog-week-note coach-note">📌 Coach : ${week.noteCoach}</div>`:''}
        <div class="prog-week-note">${week.notes}</div>
        <div class="prog-seances">${week.seances.map((s,i)=>renderSeanceCard(s,i,week.week)).join('')}</div>
      </div>
    `;
    container.appendChild(weekEl);
  });
}

function resetWeek(weekNum) {
  adaptivePlan.resetWeek(weekNum);
  showToast(`S${weekNum} réinitialisé au plan original`);
  renderProgramme();
}

function renderSeanceCard(seance, index, weekNum) {
  const c = SEANCE_COLORS[seance.type] || SEANCE_COLORS.endurance;
  const isModified = !!seance.noteCoach;
  return `
    <div class="seance-card${isModified?' seance-modified':''}" style="border-left-color:${c.border};background:${c.bg}">
      <button class="seance-header" onclick="toggleSeance(${weekNum},${index})">
        <div class="seance-header-left">
          <span class="seance-badge" style="color:${c.border};background:${c.bg}">${c.label}</span>
          <span class="seance-titre">${seance.titre}</span>
          ${isModified?'<span style="font-size:9px;color:var(--accent)">✎ modifié</span>':''}
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
        ${seance.noteCoach?`<div style="font-size:11px;color:var(--accent);margin-bottom:8px">📌 ${seance.noteCoach}</div>`:''}
        <p class="seance-desc">${seance.description}</p>
      </div>
    </div>
  `;
}

function toggleWeek(n) {
  const body=document.getElementById(`week-body-${n}`);
  const chev=document.getElementById(`chevron-${n}`);
  const open=body.style.display!=='none';
  body.style.display=open?'none':'block';
  chev.style.transform=open?'':'rotate(180deg)';
}

function toggleSeance(w,i) {
  const det=document.getElementById(`seance-detail-${w}-${i}`);
  const chev=document.getElementById(`seance-chevron-${w}-${i}`);
  const open=det.style.display!=='none';
  det.style.display=open?'none':'block';
  chev.style.transform=open?'':'rotate(180deg)';
}

function getCurrentPlanWeek() {
  const START = new Date('2026-06-29');
  const mon = d => { const x=new Date(d); const day=x.getDay(); x.setDate(x.getDate()-day+(day===0?-6:1)); x.setHours(0,0,0,0); return x; };
  return Math.round((mon(new Date())-mon(START))/(7*24*3600*1000))+1;
}

function showScreen(name) {
  $('screen-login').classList.toggle('hidden', name!=='login');
  $('screen-app').classList.toggle('hidden', name!=='app');
}
