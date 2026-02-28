/* ── Tab 4: Trade Advisor ───────────────────────────────────── */

const tab4HTML = `
  <div class="ta-header">
    <div class="ta-title-row">
      <div>
        <div class="ta-title">Trade Advisor</div>
        <div class="ta-subtitle">Claude analyses your squad for upgrade opportunities</div>
      </div>
      <div class="ta-trades-left" id="ta-trades-badge">
        <span id="ta-trades-num">2</span>
        <div class="ta-trades-lbl">trades left</div>
      </div>
    </div>
  </div>

  <div class="ta-body" id="ta-body">
    <!-- No API key warning -->
    <div class="ta-no-key" id="ta-no-key" style="display:none">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="width:40px;height:40px;color:var(--text-muted);opacity:.5">
        <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0 3 3L22 7l-3-3m-3.5 3.5L19 4"/>
      </svg>
      <p>Add your Anthropic API key in <strong>Settings</strong> to get AI trade advice.</p>
    </div>

    <!-- No squad warning -->
    <div class="ta-no-key" id="ta-no-squad" style="display:none">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="width:40px;height:40px;color:var(--text-muted);opacity:.5">
        <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
      </svg>
      <p>Add players to your Squad first, then come back for trade advice.</p>
    </div>

    <!-- Loading -->
    <div class="ta-loading" id="ta-loading" style="display:none">
      <div class="ta-spinner"></div>
      <div class="ta-loading-msg" id="ta-loading-msg">Analysing your squad…</div>
      <div class="ta-progress-bar"><div class="ta-progress-fill" id="ta-progress-fill" style="width:5%"></div></div>
    </div>

    <!-- Advice area -->
    <div id="ta-advice-area"></div>

    <!-- Action button -->
    <div class="ta-action-wrap" id="ta-action-wrap">
      <button class="ta-analyse-btn" id="ta-analyse-btn" onclick="taRunAnalysis()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:18px;height:18px">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35M11 8v6M8 11h6"/>
        </svg>
        Analyse My Squad
      </button>
      <div class="ta-round-label">Round <span id="ta-round-display">1</span> &middot; <span id="ta-last-advice"></span></div>
    </div>
  </div>

  <!-- Trade confirmation modal -->
  <div class="modal-overlay" id="ta-trade-overlay" onclick="taCloseTradeModal(event)">
    <div class="modal" id="ta-trade-modal">
      <div class="modal-handle"></div>
      <div class="modal-head">
        <h2 class="modal-title">Confirm Trade</h2>
        <button class="btn-close" onclick="taCloseTradeModal()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width:20px;height:20px"><path d="M18 6 6 18M6 6l12 12"/></svg>
        </button>
      </div>
      <div style="padding:0 20px 24px">
        <div id="ta-trade-confirm-body"></div>
        <button class="ta-confirm-trade-btn" onclick="taConfirmTrade()">Confirm Trade</button>
      </div>
    </div>
  </div>
`;

/* ── CSS ─────────────────────────────────────────────────────── */
(function injectTab4CSS() {
  if (document.getElementById('tab4-style')) return;
  const s = document.createElement('style');
  s.id = 'tab4-style';
  s.textContent = `
    #tab-stats {
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow: hidden;
    }
    .ta-header {
      flex-shrink: 0;
      background: var(--bg-secondary);
      border-bottom: 1px solid var(--border);
      padding: 14px 16px;
    }
    .ta-title-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .ta-title {
      font-size: 17px;
      font-weight: 800;
      color: var(--text-primary);
    }
    .ta-subtitle {
      font-size: 12px;
      color: var(--text-muted);
      margin-top: 2px;
    }
    .ta-trades-left {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 6px 12px;
      text-align: center;
      flex-shrink: 0;
    }
    #ta-trades-num {
      font-size: 22px;
      font-weight: 900;
      color: var(--accent);
      display: block;
      line-height: 1;
    }
    .ta-trades-lbl {
      font-size: 10px;
      color: var(--text-muted);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .ta-body {
      flex: 1;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      padding: 12px;
    }
    .ta-no-key {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      padding: 60px 24px;
      text-align: center;
      color: var(--text-muted);
      font-size: 14px;
      line-height: 1.6;
    }
    .ta-loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 14px;
      padding: 48px 24px;
    }
    .ta-spinner {
      width: 40px; height: 40px;
      border: 3px solid var(--border);
      border-top-color: var(--accent);
      border-radius: 50%;
      animation: ta-spin 0.8s linear infinite;
    }
    @keyframes ta-spin { to { transform: rotate(360deg); } }
    .ta-loading-msg {
      font-size: 14px;
      color: var(--text-secondary);
      text-align: center;
    }
    .ta-progress-bar {
      width: 100%;
      max-width: 260px;
      height: 4px;
      background: var(--border);
      border-radius: 2px;
      overflow: hidden;
    }
    .ta-progress-fill {
      height: 100%;
      background: var(--accent);
      border-radius: 2px;
      transition: width 0.4s ease;
    }
    .ta-trade-card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 14px;
      margin-bottom: 10px;
    }
    .ta-trade-card.priority { border-color: var(--accent-border); background: var(--accent-glow); }
    .ta-trade-badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 10px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      padding: 3px 8px;
      border-radius: 20px;
      margin-bottom: 10px;
    }
    .ta-badge-priority { background: rgba(34,197,94,.18); color: var(--accent); }
    .ta-badge-consider { background: rgba(245,158,11,.15); color: #f59e0b; }
    .ta-badge-hold     { background: var(--bg-input); color: var(--text-muted); }
    .ta-trade-players {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
    }
    .ta-trade-player {
      flex: 1;
      background: var(--bg-secondary);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 8px 10px;
    }
    .ta-trade-player.out { border-color: rgba(239,68,68,.3); }
    .ta-trade-player.in  { border-color: var(--accent-border); }
    .ta-trade-label {
      font-size: 9px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      margin-bottom: 3px;
    }
    .ta-trade-label.out { color: var(--danger); }
    .ta-trade-label.in  { color: var(--accent); }
    .ta-trade-name {
      font-size: 13px;
      font-weight: 700;
      color: var(--text-primary);
    }
    .ta-trade-pos {
      font-size: 11px;
      color: var(--text-muted);
      margin-top: 1px;
    }
    .ta-arrow {
      font-size: 18px;
      color: var(--text-muted);
      flex-shrink: 0;
    }
    .ta-trade-reason {
      font-size: 12px;
      color: var(--text-secondary);
      line-height: 1.5;
      margin-bottom: 10px;
    }
    .ta-do-trade-btn {
      width: 100%;
      padding: 10px;
      border-radius: 9px;
      border: 1px solid var(--accent-border);
      background: var(--accent-glow);
      color: var(--accent);
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
    }
    .ta-do-trade-btn:active { background: rgba(34,197,94,.25); }
    .ta-action-wrap {
      padding: 8px 0 4px;
      text-align: center;
    }
    .ta-analyse-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 13px 28px;
      border-radius: 12px;
      border: none;
      background: var(--accent);
      color: #000;
      font-size: 15px;
      font-weight: 800;
      cursor: pointer;
      margin-bottom: 8px;
    }
    .ta-analyse-btn:disabled { opacity: 0.5; pointer-events: none; }
    .ta-round-label {
      font-size: 12px;
      color: var(--text-muted);
    }
    .ta-section-title {
      font-size: 11px;
      font-weight: 800;
      color: var(--text-muted);
      letter-spacing: 1px;
      text-transform: uppercase;
      margin: 14px 0 8px;
    }
    .ta-confirm-trade-btn {
      width: 100%;
      margin-top: 16px;
      padding: 14px;
      border-radius: 12px;
      border: none;
      background: var(--accent);
      color: #000;
      font-size: 15px;
      font-weight: 800;
      cursor: pointer;
    }
    .ta-confirm-player-row {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px;
      border-radius: 10px;
      border: 1px solid var(--border);
      background: var(--bg-input);
      margin-bottom: 8px;
    }
    .ta-confirm-avatar {
      width: 36px; height: 36px;
      border-radius: 50%;
      background: var(--bg-card);
      border: 1.5px solid var(--border);
      display: flex; align-items: center; justify-content: center;
      font-size: 11px; font-weight: 800;
      color: var(--text-secondary);
    }
  `;
  document.head.appendChild(s);
})();

/* ── State ──────────────────────────────────────────────────── */
const TA_KEY = 'fnrl_trade_advice';
const TA_TRADES_KEY = 'fnrl_trades_log';
let taPendingTrade = null;

/* ── Init ───────────────────────────────────────────────────── */
function initTradeAdvisor() {
  document.getElementById('tab-stats').innerHTML = tab4HTML;

  const round = parseInt(localStorage.getItem('fnrl_current_round') || '1', 10);
  document.getElementById('ta-round-display').textContent = round;

  const squad = taGetSquad();
  const settings = JSON.parse(localStorage.getItem('fnrl_settings') || '{}');
  const apiKey = settings.apiKey || '';

  document.getElementById('ta-no-key').style.display   = !apiKey ? 'flex' : 'none';
  document.getElementById('ta-no-squad').style.display = apiKey && squad.length === 0 ? 'flex' : 'none';
  document.getElementById('ta-action-wrap').style.display = apiKey && squad.length > 0 ? 'block' : 'none';

  taUpdateTradesBadge();
  taLoadSavedAdvice();
}

/* ── Trades-left badge ──────────────────────────────────────── */
function taUpdateTradesBadge() {
  const trades = JSON.parse(localStorage.getItem(TA_TRADES_KEY) || '[]');
  const round  = parseInt(localStorage.getItem('fnrl_current_round') || '1', 10);
  const usedThisRound = trades.filter(t => t.round === round).length;
  const left = Math.max(0, 2 - usedThisRound);
  document.getElementById('ta-trades-num').textContent = left;
}

/* ── Load previously saved advice ──────────────────────────── */
function taLoadSavedAdvice() {
  const saved = localStorage.getItem(TA_KEY);
  if (!saved) return;
  try {
    const data = JSON.parse(saved);
    taRenderAdvice(data.advice);
    const ts = new Date(data.savedAt);
    const el = document.getElementById('ta-last-advice');
    if (el) el.textContent = 'Last: ' + ts.toLocaleDateString('en-AU', { day: 'numeric', month: 'short' });
  } catch {}
}

/* ── Run AI analysis ─────────────────────────────────────────── */
async function taRunAnalysis() {
  const settings = JSON.parse(localStorage.getItem('fnrl_settings') || '{}');
  const apiKey = settings.apiKey || '';
  if (!apiKey) { showToast('Add your API key in Settings first'); return; }

  const squad = taGetSquad();
  if (squad.length === 0) { showToast('Add players to your squad first'); return; }

  const round = parseInt(localStorage.getItem('fnrl_current_round') || '1', 10);

  document.getElementById('ta-loading').style.display    = 'flex';
  document.getElementById('ta-advice-area').innerHTML    = '';
  document.getElementById('ta-action-wrap').style.display = 'none';
  document.getElementById('ta-analyse-btn').disabled     = true;

  taSetProgress('Building squad profile…', 10);

  try {
    const squadSummary = squad.map(p =>
      `${p.name} (${p.nrlTeam}, ${(p.positions || []).join('/')})`
    ).join(', ');

    const trades = JSON.parse(localStorage.getItem(TA_TRADES_KEY) || '[]');
    const usedThisRound = trades.filter(t => t.round === round).length;
    const tradesLeft = Math.max(0, 2 - usedThisRound);

    const prompt =
      `You are a Fantasy NRL trade advisor. A user has ${tradesLeft} trade(s) left for Round ${round}.\n\n` +
      `Their current squad: ${squadSummary}\n\n` +
      `Search for the latest NRL news, team announcements, and injury reports for Round ${round} 2025.\n\n` +
      `Identify 3 trade recommendations. For each recommendation provide:\n` +
      `- priority: "trade_now", "consider", or "hold"\n` +
      `- trade_out: player name from the squad to trade out (exact name from squad list)\n` +
      `- trade_out_reason: why they should be dropped (injury, form, bye, omission)\n` +
      `- trade_in: suggested replacement player name (from the broader NRL player pool)\n` +
      `- trade_in_team: the NRL team the incoming player is from\n` +
      `- trade_in_positions: array of positions (e.g. ["Half Back"])\n` +
      `- reason: concise explanation of the trade (1-2 sentences)\n` +
      `- efp_gain: estimated EFP gain this round (number)\n\n` +
      `Respond with ONLY a valid JSON array, no markdown:\n` +
      `[{"priority":"trade_now","trade_out":"PlayerA","trade_out_reason":"Injured","trade_in":"PlayerB","trade_in_team":"Broncos","trade_in_positions":["Half Back"],"reason":"PlayerB is the named starter with great form","efp_gain":12}]`;

    taSetProgress('Searching NRL news…', 30);
    const text = await callClaudeWithWebSearch(prompt, apiKey);

    taSetProgress('Parsing recommendations…', 85);
    const match = text.match(/\[[\s\S]*\]/);
    if (!match) throw new Error('No advice returned from Claude');
    const advice = JSON.parse(match[0]);

    localStorage.setItem(TA_KEY, JSON.stringify({ advice, savedAt: new Date().toISOString() }));

    taSetProgress('Done!', 100);
    await new Promise(r => setTimeout(r, 400));

    document.getElementById('ta-loading').style.display = 'none';
    taRenderAdvice(advice);

    const el = document.getElementById('ta-last-advice');
    if (el) el.textContent = 'Just now';

  } catch (err) {
    document.getElementById('ta-loading').style.display = 'none';
    showToast('Analysis failed: ' + (err.message || 'Unknown error'));
  } finally {
    document.getElementById('ta-action-wrap').style.display = 'block';
    document.getElementById('ta-analyse-btn').disabled = false;
    taUpdateTradesBadge();
  }
}

function taSetProgress(msg, pct) {
  const m = document.getElementById('ta-loading-msg');
  const f = document.getElementById('ta-progress-fill');
  if (m) m.textContent = msg;
  if (f) f.style.width = pct + '%';
}

/* ── Render advice cards ────────────────────────────────────── */
function taRenderAdvice(advice) {
  if (!advice || advice.length === 0) {
    document.getElementById('ta-advice-area').innerHTML =
      '<div class="ta-no-key"><p>No trade recommendations at this time. Your squad looks solid!</p></div>';
    return;
  }

  let html = '<div class="ta-section-title">Trade Recommendations</div>';
  advice.forEach((rec, idx) => {
    const badgeClass = rec.priority === 'trade_now' ? 'ta-badge-priority'
                     : rec.priority === 'consider'  ? 'ta-badge-consider'
                     : 'ta-badge-hold';
    const badgeLabel = rec.priority === 'trade_now' ? '⚡ Trade Now'
                     : rec.priority === 'consider'  ? '⚠️ Consider'
                     : '✓ Hold';
    const isPriority = rec.priority === 'trade_now';
    const efpText = rec.efp_gain > 0 ? `+${rec.efp_gain} EFP` : '';

    html += `
      <div class="ta-trade-card ${isPriority ? 'priority' : ''}">
        <div>
          <span class="ta-trade-badge ${badgeClass}">${badgeLabel}</span>
          ${efpText ? `<span class="ta-trade-badge ta-badge-hold" style="margin-left:4px">${escTA(efpText)}</span>` : ''}
        </div>
        <div class="ta-trade-players">
          <div class="ta-trade-player out">
            <div class="ta-trade-label out">Trade Out</div>
            <div class="ta-trade-name">${escTA(rec.trade_out || '—')}</div>
            <div class="ta-trade-pos">${escTA(rec.trade_out_reason || '')}</div>
          </div>
          <div class="ta-arrow">&#8594;</div>
          <div class="ta-trade-player in">
            <div class="ta-trade-label in">Trade In</div>
            <div class="ta-trade-name">${escTA(rec.trade_in || '—')}</div>
            <div class="ta-trade-pos">${escTA((rec.trade_in_positions || []).join(', '))} &middot; ${escTA(rec.trade_in_team || '')}</div>
          </div>
        </div>
        <div class="ta-trade-reason">${escTA(rec.reason || '')}</div>
        ${isPriority ? `<button class="ta-do-trade-btn" onclick="taOpenTradeModal(${idx})">Make This Trade</button>` : ''}
      </div>`;
  });

  document.getElementById('ta-advice-area').innerHTML = html;
  window._taCurrentAdvice = advice;
}

/* ── Trade modal ─────────────────────────────────────────────── */
function taOpenTradeModal(idx) {
  const round  = parseInt(localStorage.getItem('fnrl_current_round') || '1', 10);
  const trades = JSON.parse(localStorage.getItem(TA_TRADES_KEY) || '[]');
  const usedThisRound = trades.filter(t => t.round === round).length;

  if (usedThisRound >= 2) {
    showToast('No trades left this round (max 2)');
    return;
  }

  const rec = (window._taCurrentAdvice || [])[idx];
  if (!rec) return;
  taPendingTrade = { rec, round };

  const body = document.getElementById('ta-trade-confirm-body');
  body.innerHTML = `
    <p style="font-size:13px;color:var(--text-muted);margin-bottom:14px">
      This will remove <strong style="color:var(--danger)">${escTA(rec.trade_out)}</strong> from your squad
      and add <strong style="color:var(--accent)">${escTA(rec.trade_in)}</strong>. This uses 1 trade for Round ${round}.
    </p>
    <div class="ta-confirm-player-row">
      <div class="ta-confirm-avatar" style="border-color:rgba(239,68,68,.4);color:var(--danger)">${taInitials(rec.trade_out)}</div>
      <div><div style="font-size:13px;font-weight:700">${escTA(rec.trade_out)}</div><div style="font-size:11px;color:var(--danger)">Leaving squad</div></div>
    </div>
    <div style="text-align:center;font-size:18px;color:var(--text-muted);margin:4px 0">&#8595;</div>
    <div class="ta-confirm-player-row">
      <div class="ta-confirm-avatar" style="border-color:var(--accent-border);color:var(--accent)">${taInitials(rec.trade_in)}</div>
      <div><div style="font-size:13px;font-weight:700">${escTA(rec.trade_in)}</div><div style="font-size:11px;color:var(--accent)">Joining squad</div></div>
    </div>`;

  document.getElementById('ta-trade-overlay').classList.add('open');
}

function taCloseTradeModal(e) {
  if (e && e.target !== document.getElementById('ta-trade-overlay') && e.type !== 'click') return;
  if (e && e.target !== document.getElementById('ta-trade-overlay')) return;
  document.getElementById('ta-trade-overlay').classList.remove('open');
  taPendingTrade = null;
}

function taConfirmTrade() {
  if (!taPendingTrade) return;
  const { rec, round } = taPendingTrade;

  /* Remove old player from squad */
  let squad = taGetSquad();
  const outIdx = squad.findIndex(p =>
    p.name.toLowerCase() === (rec.trade_out || '').toLowerCase()
  );
  if (outIdx !== -1) squad.splice(outIdx, 1);

  /* Add new player */
  const newPlayer = {
    id: 'ta_' + Date.now(),
    name: rec.trade_in,
    nrlTeam: rec.trade_in_team || '',
    positions: rec.trade_in_positions || [],
    addedAt: new Date().toISOString(),
  };
  squad.push(newPlayer);
  localStorage.setItem('fantasy_nrl_squad_v1', JSON.stringify(squad));

  /* Log the trade */
  const trades = JSON.parse(localStorage.getItem(TA_TRADES_KEY) || '[]');
  trades.push({ round, out: rec.trade_out, in: rec.trade_in, at: new Date().toISOString() });
  localStorage.setItem(TA_TRADES_KEY, JSON.stringify(trades));

  document.getElementById('ta-trade-overlay').classList.remove('open');
  taPendingTrade = null;

  taUpdateTradesBadge();
  showToast(`Traded ${rec.trade_out} ➜ ${rec.trade_in}!`);
}

/* ── Helpers ─────────────────────────────────────────────────── */
function taGetSquad() {
  try { return JSON.parse(localStorage.getItem('fantasy_nrl_squad_v1') || '[]'); }
  catch { return []; }
}

function taInitials(name) {
  if (!name) return '?';
  return name.trim().split(/\s+/).map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

function escTA(str) {
  const d = document.createElement('div');
  d.textContent = str || '';
  return d.innerHTML;
}
