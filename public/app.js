/* app.js — Frontend Dashboard Strava */

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

// ── Cache local (évite des aller-retours inutiles) ───────────────────────────
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

// ── DOM refs ─────────────────────────────────────────────────────────────────
const $ = id => document.getElementById(id);

// ── État de l'app ────────────────────────────────────────────────────────────
let chartInstance = null;

// ── Initialisation ────────────────────────────────────────────────────────────
(async function init() {
  // Gestion des paramètres URL
  const params = new URLSearchParams(location.search);
  if (params.get('error')) {
    $('login-error').classList.remove('hidden');
    showScreen('login');
    return;
  }

  // Vérification du statut de connexion
  const status = await fetch('/api/status').then(r => r.json()).catch(() => ({ connected: false }));

  if (!status.connected) {
    showScreen('login');
    return;
  }

  // Nettoie l'URL
  if (params.get('connected')) history.replaceState({}, '', '/');

  $('days-count').textContent = status.daysUntilRace;
  showScreen('dashboard');

  // Chargement du profil athlète
  fetch('/api/athlete')
    .then(r => r.json())
    .then(a => { $('athlete-name').textContent = `${a.firstname} ${a.lastname}`; })
    .catch(() => {});

  // Chargement des données (cache local en priorité)
  const cached = localCache.get();
  if (cached) {
    renderAll(cached);
    $('cache-hint').textContent = 'données en cache · actualise pour rafraîchir';
  } else {
    loadActivities();
  }

  // Bouton refresh
  $('btn-refresh').addEventListener('click', () => {
    localCache.clear();
    loadActivities(true);
  });
})();

// ── Chargement des activités ─────────────────────────────────────────────────
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
    // Pas encore de sortie cette semaine
    ['cur-km','cur-runs','cur-pace','cur-hr','cur-time','cur-elev'].forEach(id => {
      $(id).textContent = '0';
    });
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
  // Prend les 12 dernières semaines avec données ou plan
  const chartWeeks = [...weeks].reverse().slice(-12);
  const labels = chartWeeks.map(w => `S${w.weekNum}`);
  const realKm  = chartWeeks.map(w => w.kmDone);
  const planKm  = chartWeeks.map(w => w.plan?.targetKm ?? null);

  const ctx = $('chart-progress').getContext('2d');
  if (chartInstance) chartInstance.destroy();

  Chart.defaults.font.family = 'JetBrains Mono, monospace';
  Chart.defaults.color = '#555555';

  chartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Réel (km)',
          data: realKm,
          backgroundColor: '#fc4c02',
          borderRadius: 4,
          borderSkipped: false,
          order: 1
        },
        {
          label: 'Plan (km)',
          data: planKm,
          type: 'line',
          borderColor: '#2e2e2e',
          backgroundColor: 'transparent',
          borderWidth: 1.5,
          pointRadius: 3,
          pointBackgroundColor: '#2e2e2e',
          tension: 0.3,
          order: 0
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#1a1a1a',
          borderColor: '#2e2e2e',
          borderWidth: 1,
          titleColor: '#888',
          bodyColor: '#f0f0f0',
          padding: 10,
          callbacks: {
            label: ctx => ` ${ctx.dataset.label}: ${ctx.parsed.y} km`
          }
        }
      },
      scales: {
        x: {
          grid: { color: '#111', drawBorder: false },
          ticks: { font: { size: 10 } }
        },
        y: {
          grid: { color: '#1a1a1a', drawBorder: false },
          ticks: { font: { size: 10 }, callback: v => v + ' km' },
          beginAtZero: true
        }
      }
    }
  });
}

// ── Tableau historique ────────────────────────────────────────────────────────
function renderHistory(weeks) {
  const tbody = $('history-body');
  tbody.innerHTML = '';

  weeks.slice(0, 15).forEach(w => {
    const ecartVal  = w.vsTarget;
    const ecartCls  = ecartVal == null ? 'ecart-neu' : ecartVal >= 0 ? 'ecart-pos' : 'ecart-neg';
    const ecartTxt  = ecartVal == null ? '—' : `${ecartVal >= 0 ? '+' : ''}${ecartVal}`;
    const phaseCls  = w.plan ? `badge badge-${w.plan.phase}` : 'badge';
    const phaseTxt  = w.plan ? fmt.phase(w.plan.phase) : '—';

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

  // Récupère les 10 dernières sorties toutes semaines confondues
  const allRuns = weeks.flatMap(w => w.runs)
    .sort((a,b) => new Date(b.date) - new Date(a.date))
    .slice(0, 10);

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

// ── Switcher d'écran ──────────────────────────────────────────────────────────
function showScreen(name) {
  $('screen-login').classList.toggle('hidden', name !== 'login');
  $('screen-dashboard').classList.toggle('hidden', name !== 'dashboard');
}
