/* ── Tab 3: Score Tracker ───────────────────────────────────── */

const tab3HTML = `
  <div class="st-header">
    <div class="st-round-nav">
      <button class="st-round-btn" onclick="stChangeRound(-1)">&#8249;</button>
      <div class="st-round-label">Round <span id="st-round-num">1</span></div>
      <button class="st-round-btn" onclick="stChangeRound(1)">&#8250;</button>
    </div>
    <div class="st-summary" id="st-summary">
      <div class="st-sum-cell">
        <div class="st-sum-val" id="st-round-total">—</div>
        <div class="st-sum-lbl">This Round</div>
      </div>
      <div class="st-sum-divider"></div>
      <div class="st-sum-cell">
        <div class="st-sum-val" id="st-season-total">—</div>
        <div class="st-sum-lbl">Season Total</div>
      </div>
      <div class="st-sum-divider"></div>
      <div class="st-sum-cell">
        <div class="st-sum-val" id="st-avg">—</div>
        <div class="st-sum-lbl">Avg / Round</div>
      </div>
    </div>
  </div>

  <div class="st-body" id="st-body">
    <div class="st-empty" id="st-no-squad">
      <div class="st-empty-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
        </svg>
      </div>
      <p>No players in your squad yet.<br>Add players in the Squad tab first.</p>
    </div>
    <div id="st-player-list"></div>
  </div>

  <div class="st-footer">
    <button class="st-save-btn" onclick="stSave()">Save Round <span id="st-save-round">1</span> Scores</button>
  </div>
`;

/* ── CSS injected once ──────────────────────────────────────── */
(function injectTab3CSS() {
  if (document.getElementById('tab3-style')) return;
  const s = document.createElement('style');
  s.id = 'tab3-style';
  s.textContent = `
    #tab-fixtures {
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow: hidden;
    }
    .st-header {
      flex-shrink: 0;
      background: var(--bg-secondary);
      border-bottom: 1px solid var(--border);
      padding: 14px 16px 12px;
    }
    .st-round-nav {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 20px;
      margin-bottom: 12px;
    }
    .st-round-btn {
      width: 36px; height: 36px;
      border-radius: 50%;
      border: 1px solid var(--border);
      background: var(--bg-card);
      color: var(--text-primary);
      font-size: 22px;
      line-height: 1;
      cursor: pointer;
      display: flex; align-items: center; justify-content: center;
    }
    .st-round-btn:active { background: var(--accent-glow); }
    .st-round-label {
      font-size: 17px;
      font-weight: 700;
      min-width: 90px;
      text-align: center;
    }
    .st-summary {
      display: flex;
      align-items: center;
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 12px;
      overflow: hidden;
    }
    .st-sum-cell {
      flex: 1;
      padding: 10px 4px;
      text-align: center;
    }
    .st-sum-val {
      font-size: 20px;
      font-weight: 800;
      color: var(--accent);
      line-height: 1;
    }
    .st-sum-lbl {
      font-size: 10px;
      color: var(--text-muted);
      font-weight: 600;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      margin-top: 3px;
    }
    .st-sum-divider {
      width: 1px; height: 36px;
      background: var(--border);
      flex-shrink: 0;
    }
    .st-body {
      flex: 1;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      padding: 10px 12px;
    }
    .st-empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 10px;
      padding: 60px 24px;
      text-align: center;
      color: var(--text-muted);
      font-size: 14px;
      line-height: 1.6;
    }
    .st-empty-icon svg {
      width: 48px; height: 48px;
      color: var(--text-muted);
      opacity: 0.35;
    }
    .st-player-card {
      display: flex;
      align-items: center;
      gap: 12px;
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 10px 12px;
      margin-bottom: 8px;
    }
    .st-avatar {
      width: 38px; height: 38px;
      border-radius: 50%;
      background: var(--bg-input);
      border: 1.5px solid var(--border);
      display: flex; align-items: center; justify-content: center;
      font-size: 12px; font-weight: 800;
      color: var(--text-secondary);
      flex-shrink: 0;
    }
    .st-player-info { flex: 1; min-width: 0; }
    .st-player-name {
      font-size: 14px;
      font-weight: 700;
      color: var(--text-primary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .st-player-meta {
      font-size: 11px;
      color: var(--text-muted);
      margin-top: 1px;
    }
    .st-score-area {
      display: flex;
      align-items: center;
      gap: 6px;
      flex-shrink: 0;
    }
    .st-score-btn {
      width: 30px; height: 30px;
      border-radius: 50%;
      border: 1px solid var(--border);
      background: var(--bg-input);
      color: var(--text-primary);
      font-size: 18px;
      line-height: 1;
      cursor: pointer;
      display: flex; align-items: center; justify-content: center;
    }
    .st-score-btn:active { background: var(--accent-glow); border-color: var(--accent-border); }
    .st-score-input {
      width: 52px;
      height: 36px;
      border-radius: 8px;
      border: 1.5px solid var(--border);
      background: var(--bg-input);
      color: var(--text-primary);
      font-size: 16px;
      font-weight: 800;
      text-align: center;
      -moz-appearance: textfield;
    }
    .st-score-input::-webkit-inner-spin-button,
    .st-score-input::-webkit-outer-spin-button { -webkit-appearance: none; }
    .st-score-input:focus {
      outline: none;
      border-color: var(--accent-border);
      background: var(--bg-card);
    }
    .st-score-input.has-score { color: var(--accent); border-color: var(--accent-border); }
    .st-best-badge {
      font-size: 10px;
      font-weight: 800;
      color: #f59e0b;
      letter-spacing: 0.5px;
      display: none;
    }
    .st-footer {
      flex-shrink: 0;
      padding: 10px 12px calc(env(safe-area-inset-bottom, 0px) + 10px);
      background: var(--bg-secondary);
      border-top: 1px solid var(--border);
    }
    .st-save-btn {
      width: 100%;
      padding: 14px;
      border-radius: 12px;
      border: none;
      background: var(--accent);
      color: #000;
      font-size: 15px;
      font-weight: 800;
      cursor: pointer;
      letter-spacing: 0.2px;
    }
    .st-save-btn:active { background: var(--accent-dark); }
  `;
  document.head.appendChild(s);
})();

/* ── State ──────────────────────────────────────────────────── */
let stRound = 1;
const ST_KEY = 'fnrl_scores'; // { [round]: { [playerId]: score } }

/* ── Init ───────────────────────────────────────────────────── */
function initScoreTracker() {
  document.getElementById('tab-fixtures').innerHTML = tab3HTML;

  const saved = localStorage.getItem('fnrl_current_round');
  stRound = saved ? parseInt(saved, 10) : 1;

  stRender();
}

/* ── Round nav ──────────────────────────────────────────────── */
function stChangeRound(delta) {
  stRound = Math.max(1, stRound + delta);
  stRender();
}

/* ── Main render ─────────────────────────────────────────────── */
function stRender() {
  document.getElementById('st-round-num').textContent = stRound;
  document.getElementById('st-save-round').textContent = stRound;

  const squad = getSquad();
  const allScores = JSON.parse(localStorage.getItem(ST_KEY) || '{}');
  const roundScores = allScores[stRound] || {};

  if (squad.length === 0) {
    document.getElementById('st-no-squad').style.display = 'flex';
    document.getElementById('st-player-list').innerHTML = '';
    updateSummary(allScores, {});
    return;
  }

  document.getElementById('st-no-squad').style.display = 'none';

  /* Best scorer this round */
  let bestId = null, bestScore = -1;
  squad.forEach(p => {
    const sc = roundScores[p.id];
    if (sc !== undefined && sc > bestScore) { bestScore = sc; bestId = p.id; }
  });

  let html = '';
  squad.forEach(p => {
    const sc = roundScores[p.id];
    const hasScore = sc !== undefined && sc !== '';
    const displayVal = hasScore ? sc : '';
    const isBest = hasScore && p.id === bestId && squad.length > 1;
    const pos = (p.positions || []).join(', ');
    html += `
      <div class="st-player-card">
        <div class="st-avatar">${stInitials(p.name)}</div>
        <div class="st-player-info">
          <div class="st-player-name">${escST(p.name)}</div>
          <div class="st-player-meta">${escST(p.nrlTeam)} &middot; ${escST(pos)}
            ${isBest ? '<span class="st-best-badge" style="display:inline">&#9733; TOP</span>' : ''}
          </div>
        </div>
        <div class="st-score-area">
          <button class="st-score-btn" onclick="stAdj('${p.id}',-1)">&#8722;</button>
          <input
            class="st-score-input${hasScore ? ' has-score' : ''}"
            id="st-inp-${p.id}"
            type="number"
            inputmode="numeric"
            placeholder="—"
            value="${displayVal}"
            onchange="stInputChange('${p.id}', this)"
            oninput="stInputChange('${p.id}', this)"
          />
          <button class="st-score-btn" onclick="stAdj('${p.id}',1)">&#43;</button>
        </div>
      </div>`;
  });

  document.getElementById('st-player-list').innerHTML = html;
  updateSummary(allScores, roundScores);
}

/* ── Input handlers ─────────────────────────────────────────── */
function stAdj(playerId, delta) {
  const inp = document.getElementById('st-inp-' + playerId);
  const cur = inp.value === '' ? 0 : parseInt(inp.value, 10);
  const next = Math.max(0, cur + delta);
  inp.value = next;
  stInputChange(playerId, inp);
}

function stInputChange(playerId, inp) {
  inp.classList.toggle('has-score', inp.value !== '');
  updateLiveRoundTotal();
}

function updateLiveRoundTotal() {
  const squad = getSquad();
  let total = 0;
  squad.forEach(p => {
    const inp = document.getElementById('st-inp-' + p.id);
    if (inp && inp.value !== '') total += parseInt(inp.value, 10) || 0;
  });
  document.getElementById('st-round-total').textContent = total;
}

/* ── Summary bar ────────────────────────────────────────────── */
function updateSummary(allScores, roundScores) {
  /* Season total across all rounds */
  let seasonTotal = 0;
  let roundsWithData = 0;
  Object.values(allScores).forEach(rnd => {
    const vals = Object.values(rnd).filter(v => v !== '' && v !== undefined);
    if (vals.length > 0) {
      seasonTotal += vals.reduce((a, b) => a + (parseInt(b, 10) || 0), 0);
      roundsWithData++;
    }
  });

  /* This-round live total from inputs (may differ from saved) */
  const squad = getSquad();
  let roundTotal = 0;
  squad.forEach(p => {
    const inp = document.getElementById('st-inp-' + p.id);
    const sc = inp ? inp.value : roundScores[p.id];
    if (sc !== undefined && sc !== '') roundTotal += parseInt(sc, 10) || 0;
  });

  const avg = roundsWithData > 0 ? Math.round(seasonTotal / roundsWithData) : '—';

  document.getElementById('st-round-total').textContent = roundTotal || '—';
  document.getElementById('st-season-total').textContent = seasonTotal || '—';
  document.getElementById('st-avg').textContent = avg;
}

/* ── Save ───────────────────────────────────────────────────── */
function stSave() {
  const squad = getSquad();
  const allScores = JSON.parse(localStorage.getItem(ST_KEY) || '{}');
  const roundScores = {};

  squad.forEach(p => {
    const inp = document.getElementById('st-inp-' + p.id);
    if (inp && inp.value !== '') {
      roundScores[p.id] = parseInt(inp.value, 10) || 0;
    }
  });

  allScores[stRound] = roundScores;
  localStorage.setItem(ST_KEY, JSON.stringify(allScores));

  stRender(); // re-render to show best badge etc.
  showToast('Round ' + stRound + ' scores saved!');
}

/* ── Helpers ────────────────────────────────────────────────── */
function getSquad() {
  try { return JSON.parse(localStorage.getItem('fantasy_nrl_squad_v1') || '[]'); }
  catch { return []; }
}

function stInitials(name) {
  if (!name) return '?';
  return name.trim().split(/\s+/).map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

function escST(str) {
  const d = document.createElement('div');
  d.textContent = str || '';
  return d.innerHTML;
}
