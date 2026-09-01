/* ============================================================
   VERIDEX FINANCE SYSTEM - Shared GL detail modals
   Two reusable, self-injecting modals: an account's full ledger
   (opening balance -> every posted JE line -> closing balance),
   and a single journal entry's full detail (lines, dimensions,
   status). Include this script on any page that wants a real
   "click a balance / click a JE and see the story" drill-through
   instead of a static number. Requires js/gl-engine.js and
   js/app.js (showToast) already loaded.
   ============================================================ */

function ensureGlUiModals() {
  if (document.getElementById('gl-ledger-modal')) return;
  const div = document.createElement('div');
  div.innerHTML = `
    <div class="sl-modal-overlay" id="gl-ledger-modal" onclick="if(event.target===this) closeAccountLedgerModal()">
      <div class="sl-modal" style="max-width:820px;width:92vw;">
        <div class="sl-modal-header">
          <h3 class="sl-modal-title" id="gl-ledger-modal-title">Account Ledger</h3>
          <button type="button" class="btn btn-ghost btn-sm" onclick="closeAccountLedgerModal()" aria-label="Close">&#10005;</button>
        </div>
        <div class="sl-modal-body" id="gl-ledger-modal-body"></div>
        <div class="sl-modal-footer">
          <button type="button" class="btn btn-outline" onclick="closeAccountLedgerModal()">Close</button>
        </div>
      </div>
    </div>
    <div class="sl-modal-overlay" id="gl-je-modal" onclick="if(event.target===this) closeJournalEntryModal()">
      <div class="sl-modal" style="max-width:760px;width:92vw;">
        <div class="sl-modal-header">
          <h3 class="sl-modal-title" id="gl-je-modal-title">Journal Entry</h3>
          <button type="button" class="btn btn-ghost btn-sm" onclick="closeJournalEntryModal()" aria-label="Close">&#10005;</button>
        </div>
        <div class="sl-modal-body" id="gl-je-modal-body"></div>
        <div class="sl-modal-footer" id="gl-je-modal-footer"></div>
      </div>
    </div>`;
  document.body.appendChild(div);
}

/* ---------- Account Ledger modal: opening balance -> every posted line -> closing ---------- */
function openAccountLedgerModal(accountCode) {
  ensureGlUiModals();
  const acct = findGLAccountByCode(accountCode);
  const ledger = getAccountLedger(accountCode);
  document.getElementById('gl-ledger-modal-title').textContent = accountCode + ' - ' + (acct ? acct.name : 'Account Ledger');
  const rowsHtml = ledger.rows.map(r => `
    <tr>
      <td class="cell-link" style="cursor:pointer;" onclick="openJournalEntryModal('${r.jeId}')">${r.jeNumber}</td>
      <td>${r.date}</td>
      <td>${r.description}</td>
      <td class="r">${r.debit ? fmtCurrency(r.debit) : ' - '}</td>
      <td class="r">${r.credit ? fmtCurrency(r.credit) : ' - '}</td>
      <td class="r">${fmtCurrency(r.runningBalance)}</td>
    </tr>`).join('');
  document.getElementById('gl-ledger-modal-body').innerHTML = `
    <div class="v-lock-note" style="margin-bottom:12px;">
      <strong>Opening balance:</strong> Dr ${fmtCurrency(ledger.openingBalance.debit || 0)} / Cr ${fmtCurrency(ledger.openingBalance.credit || 0)}
      (net ${fmtCurrency(ledger.openingNet)}), set on Chart of Accounts.
    </div>
    <div style="overflow-x:auto;">
    <table class="data-table">
      <thead><tr><th>JE #</th><th>Date</th><th>Description</th><th class="r">Debit</th><th class="r">Credit</th><th class="r">Running Balance</th></tr></thead>
      <tbody>${rowsHtml || '<tr><td colspan="6" style="text-align:center;color:var(--gray-400);padding:16px;">No posted activity yet, this account is still at its opening balance.</td></tr>'}</tbody>
      <tfoot><tr class="total-row" style="font-weight:700;"><td colspan="5" style="text-align:right;">Closing balance</td><td class="r">${fmtCurrency(ledger.closingNet)}</td></tr></tfoot>
    </table>
    </div>
    <div style="font-size:11px;color:var(--gray-400);margin-top:10px;">Click any JE number to see its full detail. This is the same math used everywhere else this account's balance shows up (Chart of Accounts, Trial Balance, Balance Sheet).</div>`;
  document.getElementById('gl-ledger-modal').classList.add('open');
}
function closeAccountLedgerModal() {
  const m = document.getElementById('gl-ledger-modal');
  if (m) m.classList.remove('open');
}

/* ---------- Journal Entry detail modal ---------- */
const GL_JE_STATUS_BADGE = { posted: 'badge-green', pending_approval: 'badge-orange', rejected: 'badge-red', draft: 'badge-gray' };
const GL_JE_STATUS_LABEL = { posted: 'Posted', pending_approval: 'Pending Approval', rejected: 'Rejected', draft: 'Draft' };

function openJournalEntryModal(jeId) {
  ensureGlUiModals();
  const je = getJournalEntries().find(j => j.id === jeId);
  if (!je) { showToast('Journal entry not found', 'error'); return; }
  document.getElementById('gl-je-modal-title').textContent = je.number;
  const dimBits = l => Object.keys(l.dims || {}).filter(k => l.dims[k]).map(k => `<span class="v-tree-badge">${k}: ${l.dims[k]}</span>`).join(' ');
  const linesHtml = je.lines.map(l => `
    <tr>
      <td>${l.acct}${(typeof findGLAccountByCode === 'function' && findGLAccountByCode(l.acct)) ? ' - ' + findGLAccountByCode(l.acct).name : ''}</td>
      <td>${l.desc || ''} ${dimBits(l)}</td>
      <td class="r">${l.debit ? fmtCurrency(l.debit) : ' - '}</td>
      <td class="r">${l.credit ? fmtCurrency(l.credit) : ' - '}</td>
    </tr>`).join('');
  document.getElementById('gl-je-modal-body').innerHTML = `
    <div class="v-config-row head" style="grid-template-columns:1fr 1fr 1fr;">
      <div>Date: <strong>${je.date || (je.createdAt || '').slice(0, 10)}</strong></div>
      <div>Status: <span class="badge ${GL_JE_STATUS_BADGE[je.status] || 'badge-gray'}">${GL_JE_STATUS_LABEL[je.status] || je.status}</span></div>
      <div>Created by: <strong>${je.createdBy || ' - '}</strong></div>
    </div>
    <p style="margin:10px 0;font-size:12.5px;color:var(--gray-700);">${je.description || ''}</p>
    <div style="overflow-x:auto;">
    <table class="data-table">
      <thead><tr><th>Account</th><th>Description / Dimensions</th><th class="r">Debit</th><th class="r">Credit</th></tr></thead>
      <tbody>${linesHtml}</tbody>
      <tfoot><tr class="total-row"><td colspan="2" style="text-align:right;font-weight:700;">Totals</td><td class="r"><strong>${fmtCurrency(jeTotalDebit(je))}</strong></td><td class="r"><strong>${fmtCurrency(jeTotalCredit(je))}</strong></td></tr></tfoot>
    </table>
    </div>
    ${je.rejectReason ? `<div class="v-lock-note" style="margin-top:10px;border-left:3px solid var(--red);">Rejected: ${je.rejectReason}</div>` : ''}`;

  const footer = document.getElementById('gl-je-modal-footer');
  if (je.status === 'pending_approval') {
    footer.innerHTML = `<button type="button" class="btn btn-primary" onclick="approveJournalEntry('${je.id}');closeJournalEntryModal();showToast('${je.number} approved and posted','success');if(typeof renderRecentJE==='function')renderRecentJE();if(typeof renderAll==='function')renderAll();">Approve &amp; Post</button>
      <button type="button" class="btn btn-outline" onclick="closeJournalEntryModal()">Close</button>`;
  } else if (je.status === 'draft') {
    footer.innerHTML = `<button type="button" class="btn btn-primary" onclick="approveJournalEntry('${je.id}');closeJournalEntryModal();showToast('${je.number} posted to ledger','success');if(typeof renderRecentJE==='function')renderRecentJE();if(typeof renderAll==='function')renderAll();">Post to Ledger</button>
      <button type="button" class="btn btn-outline" onclick="closeJournalEntryModal()">Close</button>`;
  } else {
    footer.innerHTML = `<button type="button" class="btn btn-outline" onclick="closeJournalEntryModal()">Close</button>`;
  }
  document.getElementById('gl-je-modal').classList.add('open');
}
function closeJournalEntryModal() {
  const m = document.getElementById('gl-je-modal');
  if (m) m.classList.remove('open');
}
