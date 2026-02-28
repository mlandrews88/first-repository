/* ── Tab 5: Form Centre ─────────────────────────────────────── */

const tab5HTML = `
  <div class="fc-header">
    <div class="fc-title-row">
      <div class="fc-title">Form Centre</div>
      <div style="display:flex;gap:6px">
        <button class="fc-filter-btn ${''}" id="fc-filter-all" onclick="fcSetFilter('all', this)">All</button>
        <button class="fc-filter-btn" id="fc-filter-hot"  onclick="fcSetFilter('hot', this)">🔥 Hot</button>
        <button class="fc-filter-btn" id="fc-filter-cold" onclick="fcSetFilter('cold', this)">❄️ Cold</button>
      </div>
    </div>
    <div class="fc-search-wrap">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="fc-search-icon">
        <circle cx="11" cy="11" r="7"/><path d="m21 21-4.35-4.35"/>
      </svg>
      <input
        id="fc-search"
        class="fc-search-input"
        type="search"
        placeholder="Search players…"
        oninput="fcRender()"
      />
    </div>
  </div>

  <div class="fc-body" id="fc-body">
    <div class="fc-no-squad" id="fc-no-squad" style="display:none">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="width:48px;height:48px;color:var(--text-muted);opacity:.35">
        <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
      </svg>
      <p>Add players to your Squad to see their form here.</p>
    </div>
    <div class="fc-no-data" id="fc-no-data" style="display:none">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="width:48px;height:48px;color:var(--text-muted);opacity:.35">
        <circle cx="11" cy="11" r="7"/><path d="m21 21-4.35-4.35"/>
      </svg>
      <p>No players match your search.</p>
    </div>
    <div id="fc-player-list"></div>
  </div>

  <div class="fc-footer">
    <div class="fc-footer-note" id="fc-footer-note">
      Scores pulled from Auto-Team Picker scans. Run the picker to refresh.
    </div>
  </div>
`;

/* ── CSS ─────────────────────────────────────────────────────── */
(function injectTab5CSS() {
  if (document.getElementById('tab5-style')) return;
  const s = document.createElement('style');
  s.id = 'tab5-style';
  s.textContent = `
    #tab-trades {
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow: hidden;
    }
    .fc-header {
      flex-shrink: 0;
      background: var(--bg-secondary);
      border-bottom: 1px solid var(--border);
      padding: 12px 14px;
    }
    .fc-title-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 10px;
    }
    .fc-title {
      font-size: 17px;
      font-weight: 800;
    }
    .fc-filter-btn {
      padding: 5px 11px;
      border-radius: 20px;
      border: 1px solid var(--border);
      background: var(--bg-card);
      color: var(--text-secondary);
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
    }
    .fc-filter-btn.active {
      background: var(--accent-glow);
      border-color: var(--accent-border);
      color: var(--accent);
    }
    .fc-search-wrap {
      position: relative;
    }
    .fc-search-icon {
      position: absolute;
      left: 10px;
      top: 50%;
      transform: translateY(-50%);
      width: 16px; height: 16px;
      color: var(--text-muted);
      pointer-events: none;
    }
    .fc-search-input {
      width: 100%;
      padding: 9px 12px 9px 34px;
      border-radius: 10px;
      border: 1px solid var(--border);
      background: var(--bg-input);
      color: var(--text-primary);
      font-size: 14px;
    }
    .fc-search-input:focus {
      outline: none;
      border-color: var(--accent-border);
    }
    .fc-body {
      flex: 1;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      padding: 10px 12px;
    }
    .fc-no-squad, .fc-no-data {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      padding: 60px 24px;
      text-align: center;
      color: var(--text-muted);
      font-size: 14px;
      line-height: 1.6;
    }
    .fc-player-card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 12px 14px;
      margin-bottom: 8px;
    }
    .fc-player-card.form-hot  { border-color: rgba(34,197,94,.35); }
    .fc-player-card.form-cold { border-color: rgba(239,68,68,.3); }
    .fc-card-top {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 10px;
    }
    .fc-avatar {
      width: 40px; height: 40px;
      border-radius: 50%;
      background: var(--bg-input);
      border: 1.5px solid var(--border);
      display: flex; align-items: center; justify-content: center;
      font-size: 12px; font-weight: 800;
      color: var(--text-secondary);
      flex-shrink: 0;
    }
    .fc-avatar.hot  { border-color: var(--accent-border); color: var(--accent); }
    .fc-avatar.cold { border-color: rgba(239,68,68,.4); color: var(--danger); }
    .fc-player-info { flex: 1; min-width: 0; }
    .fc-player-name {
      font-size: 15px;
      font-weight: 700;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .fc-player-meta {
      font-size: 11px;
      color: var(--text-muted);
      margin-top: 2px;
    }
    .fc-rating-wrap {
      text-align: right;
      flex-shrink: 0;
    }
    .fc-rating-num {
      font-size: 24px;
      font-weight: 900;
      line-height: 1;
    }
    .fc-rating-num.hot  { color: var(--accent); }
    .fc-rating-num.cold { color: var(--danger); }
    .fc-rating-num.mid  { color: var(--text-secondary); }
    .fc-rating-lbl {
      font-size: 10px;
      color: var(--text-muted);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .fc-scores-row {
      display: flex;
      gap: 5px;
      align-items: flex-end;
      margin-bottom: 8px;
    }
    .fc-score-bar-wrap {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 3px;
    }
    .fc-score-val {
      font-size: 10px;
      font-weight: 700;
      color: var(--text-secondary);
    }
    .fc-bar-outer {
      width: 100%;
      height: 36px;
      background: var(--bg-input);
      border-radius: 4px;
      overflow: hidden;
      display: flex;
      align-items: flex-end;
    }
    .fc-bar-inner {
      width: 100%;
      background: var(--accent);
      border-radius: 4px;
      transition: height 0.3s ease;
    }
    .fc-bar-inner.cold { background: var(--danger); opacity: 0.7; }
    .fc-round-lbl {
      font-size: 9px;
      color: var(--text-muted);
      font-weight: 600;
    }
    .fc-stats-row {
      display: flex;
      gap: 6px;
    }
    .fc-stat-chip {
      flex: 1;
      background: var(--bg-secondary);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 6px 4px;
      text-align: center;
    }
    .fc-stat-val {
      font-size: 14px;
      font-weight: 800;
      color: var(--text-primary);
    }
    .fc-stat-lbl {
      font-size: 9px;
      color: var(--text-muted);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.4px;
    }
    .fc-trend-chip {
      display: inline-flex;
      align-items: center;
      gap: 3px;
      font-size: 11px;
      font-weight: 700;
      padding: 2px 7px;
      border-radius: 12px;
    }
    .fc-trend-up   { background: var(--accent-glow); color: var(--accent); }
    .fc-trend-down { background: var(--danger-glow); color: var(--danger); }
    .fc-trend-flat { background: var(--bg-input); color: var(--text-muted); }
    .fc-no-scores-note {
      font-size: 12px;
      color: var(--text-muted);
      font-style: italic;
      padding: 4px 0;
    }
    .fc-footer {
      flex-shrink: 0;
      padding: 8px 14px calc(env(safe-area-inset-bottom, 0px) + 8px);
      background: var(--bg-secondary);
      border-top: 1px solid var(--border);
    }
    .fc-footer-note {
      font-size: 11px;
      color: var(--text-muted);
      text-align: center;
    }
  `;
  document.head.appendChild(s);
})();

/* ── State ──────────────────────────────────────────────────── */
let fcFilter = 'all';

/* ── Init ───────────────────────────────────────────────────── */
function initFormCentre() {
  document.getElementById('tab-trades').innerHTML = tab5HTML;
  // Set first filter button active
  document.getElementById('fc-filter-all').classList.add('active');
  fcFilter = 'all';
  fcRender();
}

/* ── Filter ─────────────────────────────────────────────────── */
function fcSetFilter(f, btn) {
  fcFilter = f;
  document.querySelectorAll('.fc-filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  fcRender();
}

/* ── Main render ─────────────────────────────────────────────── */
function fcRender() {
  const squad = fcGetSquad();
  const scores = JSON.parse(localStorage.getItem('fnrl_scores') || '{}');
  const q = (document.getElementById('fc-search')?.value || '').toLowerCase().trim();

  if (squad.length === 0) {
    document.getElementById('fc-no-squad').style.display = 'flex';
    document.getElementById('fc-no-data').style.display  = 'none';
    document.getElementById('fc-player-list').innerHTML  = '';
    return;
  }
  document.getElementById('fc-no-squad').style.display = 'none';

  /* Build player form data */
  const players = squad.map(p => {
    /* Gather all round scores for this player */
    const roundNums = Object.keys(scores).map(Number).sort((a, b) => a - b);
    const lastFive  = roundNums.slice(-5);
    const playerScores = lastFive.map(r => {
      const v = scores[r]?.[p.id];
      return v !== undefined ? parseInt(v, 10) || 0 : null;
    });

    const known = playerScores.filter(v => v !== null);
    const avg   = known.length ? Math.round(known.reduce((a, b) => a + b, 0) / known.length) : null;
    const best  = known.length ? Math.max(...known) : null;
    const worst = known.length ? Math.min(...known) : null;

    /* Also check EFP/formRating from auto-pick scan stored in squad */
    const efp         = p.expectedFantasyPoints || null;
    const formRating  = p.formRating || null;
    const trend       = p.trend || '→';
    const named       = p.named || '';
    const availability = p.availabilityStatus || '';

    /* Compute form class */
    let formClass = 'mid';
    if (known.length >= 2) {
      const recent = known.slice(-2);
      const older  = known.slice(0, -2);
      const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
      const olderAvg  = older.length ? older.reduce((a, b) => a + b, 0) / older.length : recentAvg;
      if (recentAvg >= olderAvg * 1.15) formClass = 'hot';
      else if (recentAvg <= olderAvg * 0.85) formClass = 'cold';
    } else if (formRating !== null) {
      if (formRating >= 7) formClass = 'hot';
      else if (formRating <= 4) formClass = 'cold';
    }

    return { ...p, playerScores, lastFive, avg, best, worst, efp, formRating, trend, named, availability, formClass };
  });

  /* Apply filter */
  let filtered = players.filter(p => {
    if (fcFilter === 'hot')  return p.formClass === 'hot';
    if (fcFilter === 'cold') return p.formClass === 'cold';
    return true;
  });

  /* Apply search */
  if (q) {
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(q) || (p.nrlTeam || '').toLowerCase().includes(q)
    );
  }

  if (filtered.length === 0) {
    document.getElementById('fc-no-data').style.display  = 'flex';
    document.getElementById('fc-player-list').innerHTML  = '';
    return;
  }
  document.getElementById('fc-no-data').style.display = 'none';

  /* Sort: hot first, then by avg desc */
  filtered.sort((a, b) => {
    const order = { hot: 0, mid: 1, cold: 2 };
    if (order[a.formClass] !== order[b.formClass]) return order[a.formClass] - order[b.formClass];
    return (b.avg || b.efp || 0) - (a.avg || a.efp || 0);
  });

  const maxScore = filtered.reduce((m, p) => {
    const pk = p.playerScores.filter(v => v !== null);
    return pk.length ? Math.max(m, ...pk) : m;
  }, 1);

  let html = '';
  filtered.forEach(p => {
    const initials = fcInitials(p.name);
    const hasScores = p.playerScores.some(v => v !== null);
    const trendChip = p.trend === '↑' ? `<span class="fc-trend-chip fc-trend-up">↑ Rising</span>`
                    : p.trend === '↓' ? `<span class="fc-trend-chip fc-trend-down">↓ Falling</span>`
                    : `<span class="fc-trend-chip fc-trend-flat">→ Stable</span>`;

    const statusIcon = p.availability === 'injured'   ? ' 🚑'
                     : p.availability === 'suspended' ? ' 🟥'
                     : p.named === 'starting'         ? ' ✅'
                     : p.named === 'bench'            ? ' ⚠️'
                     : '';

    const ratingNum = p.avg !== null ? p.avg
                    : p.efp !== null ? Math.round(p.efp)
                    : p.formRating !== null ? (p.formRating * 3) // scale 1-10 to ~30
                    : null;

    html += `
      <div class="fc-player-card form-${p.formClass}">
        <div class="fc-card-top">
          <div class="fc-avatar ${p.formClass}">${fcEsc(initials)}</div>
          <div class="fc-player-info">
            <div class="fc-player-name">${fcEsc(p.name)}${statusIcon}</div>
            <div class="fc-player-meta">${fcEsc(p.nrlTeam)} &middot; ${fcEsc((p.positions || []).join('/'))}
              &nbsp;${trendChip}
            </div>
          </div>
          <div class="fc-rating-wrap">
            <div class="fc-rating-num ${p.formClass}">${ratingNum !== null ? ratingNum : '—'}</div>
            <div class="fc-rating-lbl">${p.avg !== null ? 'avg pts' : p.efp !== null ? 'EFP' : 'form'}</div>
          </div>
        </div>

        ${hasScores ? `
        <div class="fc-scores-row">
          ${p.playerScores.map((sc, i) => {
            const rnd = p.lastFive[i];
            const barPct = sc !== null ? Math.round((sc / maxScore) * 100) : 0;
            const isCold = p.formClass === 'cold';
            return `
              <div class="fc-score-bar-wrap">
                <div class="fc-score-val">${sc !== null ? sc : '—'}</div>
                <div class="fc-bar-outer">
                  <div class="fc-bar-inner ${isCold ? 'cold' : ''}" style="height:${barPct}%"></div>
                </div>
                <div class="fc-round-lbl">R${rnd}</div>
              </div>`;
          }).join('')}
        </div>
        <div class="fc-stats-row">
          <div class="fc-stat-chip">
            <div class="fc-stat-val">${p.avg !== null ? p.avg : '—'}</div>
            <div class="fc-stat-lbl">Avg</div>
          </div>
          <div class="fc-stat-chip">
            <div class="fc-stat-val">${p.best !== null ? p.best : '—'}</div>
            <div class="fc-stat-lbl">Best</div>
          </div>
          <div class="fc-stat-chip">
            <div class="fc-stat-val">${p.worst !== null ? p.worst : '—'}</div>
            <div class="fc-stat-lbl">Worst</div>
          </div>
          <div class="fc-stat-chip">
            <div class="fc-stat-val">${p.efp !== null ? Math.round(p.efp) : '—'}</div>
            <div class="fc-stat-lbl">EFP</div>
          </div>
        </div>` : `
        <div class="fc-no-scores-note">No scores yet — enter them in Score Tracker.</div>`}
      </div>`;
  });

  document.getElementById('fc-player-list').innerHTML = html;
}

/* ── Helpers ─────────────────────────────────────────────────── */
function fcGetSquad() {
  try { return JSON.parse(localStorage.getItem('fantasy_nrl_squad_v1') || '[]'); }
  catch { return []; }
}

function fcInitials(name) {
  if (!name) return '?';
  return name.trim().split(/\s+/).map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

function fcEsc(str) {
  const d = document.createElement('div');
  d.textContent = str || '';
  return d.innerHTML;
}
