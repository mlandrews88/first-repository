/* ── Tab 6: Settings ────────────────────────────────────────── */

const tab6HTML = `
  <div class="sg-body">

    <!-- API Key section -->
    <div class="sg-section">
      <div class="sg-section-title">Anthropic API Key</div>
      <div class="sg-card">
        <div class="sg-field-label">API Key</div>
        <div class="sg-key-row">
          <input
            id="sg-api-key"
            class="sg-input"
            type="password"
            placeholder="sk-ant-…"
            autocomplete="off"
            autocorrect="off"
            spellcheck="false"
          />
          <button class="sg-toggle-key" id="sg-toggle-key-btn" onclick="sgToggleKeyVisibility()" title="Show/hide">
            <svg id="sg-eye-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          </button>
        </div>
        <div class="sg-field-hint">
          Used by the Team Picker and Trade Advisor. Your key is stored only on this device.
          <a class="sg-link" href="https://console.anthropic.com/settings/keys" target="_blank" rel="noopener">Get a key ↗</a>
        </div>
        <div class="sg-key-status" id="sg-key-status"></div>
      </div>
    </div>

    <!-- Season / Round settings -->
    <div class="sg-section">
      <div class="sg-section-title">Season Settings</div>
      <div class="sg-card">
        <div class="sg-row">
          <div>
            <div class="sg-field-label">Current Round</div>
            <div class="sg-field-hint">Used by Team Picker and Score Tracker</div>
          </div>
          <div class="sg-round-ctrl">
            <button class="sg-round-btn" onclick="sgChangeRound(-1)">&#8722;</button>
            <span class="sg-round-num" id="sg-round-num">1</span>
            <button class="sg-round-btn" onclick="sgChangeRound(1)">&#43;</button>
          </div>
        </div>
        <div class="sg-divider"></div>
        <div class="sg-row">
          <div>
            <div class="sg-field-label">Season Year</div>
            <div class="sg-field-hint">Used in Claude prompts</div>
          </div>
          <select id="sg-season-year" class="sg-select">
            <option value="2025">2025</option>
            <option value="2026">2026</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Scoring prefs -->
    <div class="sg-section">
      <div class="sg-section-title">Scoring Preferences</div>
      <div class="sg-card">
        <div class="sg-row">
          <div>
            <div class="sg-field-label">Try</div>
          </div>
          <input id="sg-pts-try" class="sg-pts-input" type="number" min="0" max="20" value="4"/>
        </div>
        <div class="sg-divider"></div>
        <div class="sg-row">
          <div>
            <div class="sg-field-label">Goal / Conversion</div>
          </div>
          <input id="sg-pts-goal" class="sg-pts-input" type="number" min="0" max="10" value="2"/>
        </div>
        <div class="sg-divider"></div>
        <div class="sg-row">
          <div>
            <div class="sg-field-label">Field Goal</div>
          </div>
          <input id="sg-pts-fg" class="sg-pts-input" type="number" min="0" max="5" value="1"/>
        </div>
        <div class="sg-divider"></div>
        <div class="sg-row">
          <div>
            <div class="sg-field-label">Sin Bin</div>
          </div>
          <input id="sg-pts-sinbin" class="sg-pts-input" type="number" min="-10" max="0" value="-1"/>
        </div>
      </div>
    </div>

    <!-- Data management -->
    <div class="sg-section">
      <div class="sg-section-title">Data</div>
      <div class="sg-card">
        <div class="sg-stat-row">
          <div class="sg-stat-label">Squad players</div>
          <div class="sg-stat-val" id="sg-squad-count">—</div>
        </div>
        <div class="sg-divider"></div>
        <div class="sg-stat-row">
          <div class="sg-stat-label">Rounds with scores</div>
          <div class="sg-stat-val" id="sg-rounds-count">—</div>
        </div>
        <div class="sg-divider"></div>
        <div class="sg-stat-row">
          <div class="sg-stat-label">Trades made</div>
          <div class="sg-stat-val" id="sg-trades-count">—</div>
        </div>
        <div class="sg-divider"></div>
        <button class="sg-danger-btn" onclick="sgClearScores()">Clear All Scores</button>
        <button class="sg-danger-btn" style="margin-top:8px" onclick="sgClearTrades()">Clear Trade History</button>
      </div>
    </div>

    <!-- Save button -->
    <div class="sg-save-wrap">
      <button class="sg-save-btn" onclick="sgSave()">Save Settings</button>
    </div>

    <!-- App info -->
    <div class="sg-info">
      <div class="sg-info-line">Fantasy NRL Assistant</div>
      <div class="sg-info-line" style="color:var(--text-muted)">Powered by Claude claude-sonnet-4-5</div>
      <div class="sg-info-line" style="color:var(--text-muted)">All data stored locally on your device</div>
    </div>

  </div>
`;

/* ── CSS ─────────────────────────────────────────────────────── */
(function injectTab6CSS() {
  if (document.getElementById('tab6-style')) return;
  const s = document.createElement('style');
  s.id = 'tab6-style';
  s.textContent = `
    #tab-standings {
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow: hidden;
    }
    .sg-body {
      flex: 1;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      padding: 14px 12px calc(env(safe-area-inset-bottom, 0px) + 14px);
    }
    .sg-section {
      margin-bottom: 18px;
    }
    .sg-section-title {
      font-size: 11px;
      font-weight: 800;
      color: var(--text-muted);
      letter-spacing: 1px;
      text-transform: uppercase;
      margin-bottom: 6px;
      padding-left: 4px;
    }
    .sg-card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 14px;
    }
    .sg-field-label {
      font-size: 14px;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 4px;
    }
    .sg-field-hint {
      font-size: 12px;
      color: var(--text-muted);
      line-height: 1.5;
      margin-bottom: 8px;
    }
    .sg-link {
      color: var(--accent);
      text-decoration: none;
      margin-left: 4px;
    }
    .sg-key-row {
      display: flex;
      gap: 8px;
      margin-bottom: 6px;
    }
    .sg-input {
      flex: 1;
      padding: 10px 12px;
      border-radius: 10px;
      border: 1.5px solid var(--border);
      background: var(--bg-input);
      color: var(--text-primary);
      font-size: 14px;
      font-family: monospace;
    }
    .sg-input:focus {
      outline: none;
      border-color: var(--accent-border);
    }
    .sg-toggle-key {
      width: 40px;
      border-radius: 10px;
      border: 1.5px solid var(--border);
      background: var(--bg-input);
      color: var(--text-muted);
      cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }
    .sg-toggle-key svg { width: 18px; height: 18px; }
    .sg-toggle-key:active { background: var(--bg-card); }
    .sg-key-status {
      font-size: 12px;
      font-weight: 600;
      margin-top: 4px;
      min-height: 16px;
    }
    .sg-key-status.valid   { color: var(--accent); }
    .sg-key-status.invalid { color: var(--danger); }
    .sg-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 4px 0;
    }
    .sg-round-ctrl {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-shrink: 0;
    }
    .sg-round-btn {
      width: 30px; height: 30px;
      border-radius: 50%;
      border: 1px solid var(--border);
      background: var(--bg-input);
      color: var(--text-primary);
      font-size: 16px;
      cursor: pointer;
      display: flex; align-items: center; justify-content: center;
    }
    .sg-round-btn:active { background: var(--accent-glow); }
    .sg-round-num {
      font-size: 18px;
      font-weight: 800;
      min-width: 28px;
      text-align: center;
    }
    .sg-select {
      padding: 8px 10px;
      border-radius: 10px;
      border: 1.5px solid var(--border);
      background: var(--bg-input);
      color: var(--text-primary);
      font-size: 14px;
    }
    .sg-pts-input {
      width: 56px;
      padding: 8px;
      border-radius: 9px;
      border: 1.5px solid var(--border);
      background: var(--bg-input);
      color: var(--text-primary);
      font-size: 15px;
      font-weight: 700;
      text-align: center;
      -moz-appearance: textfield;
    }
    .sg-pts-input::-webkit-inner-spin-button,
    .sg-pts-input::-webkit-outer-spin-button { -webkit-appearance: none; }
    .sg-pts-input:focus {
      outline: none;
      border-color: var(--accent-border);
    }
    .sg-divider {
      height: 1px;
      background: var(--border);
      margin: 10px 0;
    }
    .sg-stat-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 2px 0;
    }
    .sg-stat-label {
      font-size: 13px;
      color: var(--text-secondary);
    }
    .sg-stat-val {
      font-size: 14px;
      font-weight: 800;
      color: var(--accent);
    }
    .sg-danger-btn {
      width: 100%;
      padding: 11px;
      border-radius: 10px;
      border: 1px solid rgba(239,68,68,.35);
      background: var(--danger-glow);
      color: var(--danger);
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
    }
    .sg-danger-btn:active { background: rgba(239,68,68,.22); }
    .sg-save-wrap {
      padding: 4px 0 10px;
    }
    .sg-save-btn {
      width: 100%;
      padding: 15px;
      border-radius: 13px;
      border: none;
      background: var(--accent);
      color: #000;
      font-size: 16px;
      font-weight: 800;
      cursor: pointer;
      letter-spacing: 0.2px;
    }
    .sg-save-btn:active { background: var(--accent-dark); }
    .sg-info {
      text-align: center;
      padding: 10px 0 6px;
    }
    .sg-info-line {
      font-size: 11px;
      color: var(--text-secondary);
      line-height: 1.7;
    }
  `;
  document.head.appendChild(s);
})();

/* ── Init ───────────────────────────────────────────────────── */
function initSettings() {
  document.getElementById('tab-standings').innerHTML = tab6HTML;
  sgLoad();
  sgUpdateStats();
}

/* ── Load saved settings into form ─────────────────────────── */
function sgLoad() {
  const s = JSON.parse(localStorage.getItem('fnrl_settings') || '{}');

  const keyEl = document.getElementById('sg-api-key');
  if (keyEl && s.apiKey) {
    keyEl.value = s.apiKey;
    sgUpdateKeyStatus(s.apiKey);
  }

  const round = parseInt(localStorage.getItem('fnrl_current_round') || '1', 10);
  const roundEl = document.getElementById('sg-round-num');
  if (roundEl) roundEl.textContent = round;

  const yearEl = document.getElementById('sg-season-year');
  if (yearEl && s.seasonYear) yearEl.value = s.seasonYear;

  const tryEl = document.getElementById('sg-pts-try');
  if (tryEl) tryEl.value = s.ptsTry   !== undefined ? s.ptsTry   : 4;
  const goalEl = document.getElementById('sg-pts-goal');
  if (goalEl) goalEl.value = s.ptsGoal !== undefined ? s.ptsGoal  : 2;
  const fgEl = document.getElementById('sg-pts-fg');
  if (fgEl) fgEl.value = s.ptsFG   !== undefined ? s.ptsFG    : 1;
  const sbEl = document.getElementById('sg-pts-sinbin');
  if (sbEl) sbEl.value = s.ptsSinBin !== undefined ? s.ptsSinBin : -1;
}

/* ── Update data stats ──────────────────────────────────────── */
function sgUpdateStats() {
  const squad  = JSON.parse(localStorage.getItem('fantasy_nrl_squad_v1') || '[]');
  const scores = JSON.parse(localStorage.getItem('fnrl_scores') || '{}');
  const trades = JSON.parse(localStorage.getItem('fnrl_trades_log') || '[]');

  const scEl = document.getElementById('sg-squad-count');
  const rcEl = document.getElementById('sg-rounds-count');
  const tcEl = document.getElementById('sg-trades-count');

  if (scEl) scEl.textContent = squad.length;
  if (rcEl) rcEl.textContent = Object.keys(scores).length;
  if (tcEl) tcEl.textContent = trades.length;
}

/* ── Round control ──────────────────────────────────────────── */
function sgChangeRound(delta) {
  const el = document.getElementById('sg-round-num');
  const cur = parseInt(el.textContent, 10) || 1;
  el.textContent = Math.max(1, cur + delta);
}

/* ── Key visibility toggle ──────────────────────────────────── */
function sgToggleKeyVisibility() {
  const inp = document.getElementById('sg-api-key');
  if (!inp) return;
  inp.type = inp.type === 'password' ? 'text' : 'password';
}

/* ── Key status indicator ───────────────────────────────────── */
function sgUpdateKeyStatus(key) {
  const el = document.getElementById('sg-key-status');
  if (!el) return;
  if (!key) { el.textContent = ''; el.className = 'sg-key-status'; return; }
  if (key.startsWith('sk-ant-') && key.length > 20) {
    el.textContent = '✓ Key looks valid';
    el.className = 'sg-key-status valid';
  } else {
    el.textContent = '⚠ Key format looks unexpected (should start with sk-ant-)';
    el.className = 'sg-key-status invalid';
  }
}

/* ── Save ───────────────────────────────────────────────────── */
function sgSave() {
  const apiKey     = (document.getElementById('sg-api-key')?.value     || '').trim();
  const seasonYear = document.getElementById('sg-season-year')?.value   || '2025';
  const ptsTry     = parseInt(document.getElementById('sg-pts-try')?.value,    10) || 4;
  const ptsGoal    = parseInt(document.getElementById('sg-pts-goal')?.value,   10) || 2;
  const ptsFG      = parseInt(document.getElementById('sg-pts-fg')?.value,     10) || 1;
  const ptsSinBin  = parseInt(document.getElementById('sg-pts-sinbin')?.value, 10) || -1;
  const round      = parseInt(document.getElementById('sg-round-num')?.textContent, 10) || 1;

  const settings = { apiKey, seasonYear, ptsTry, ptsGoal, ptsFG, ptsSinBin };
  localStorage.setItem('fnrl_settings',       JSON.stringify(settings));
  localStorage.setItem('fnrl_current_round',  String(round));

  sgUpdateKeyStatus(apiKey);
  showToast('Settings saved!');
}

/* ── Data clear helpers ─────────────────────────────────────── */
function sgClearScores() {
  if (!confirm('Clear all score history? This cannot be undone.')) return;
  localStorage.removeItem('fnrl_scores');
  sgUpdateStats();
  showToast('Score history cleared');
}

function sgClearTrades() {
  if (!confirm('Clear all trade history?')) return;
  localStorage.removeItem('fnrl_trades_log');
  localStorage.removeItem('fnrl_trade_advice');
  sgUpdateStats();
  showToast('Trade history cleared');
}
