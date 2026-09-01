/* ============================================================
   VERIDEX FINANCE SYSTEM - General Ledger Engine (mock/static, real behavior)
   A genuinely working, persisted (localStorage) mini ledger: Chart of
   Accounts you can add to, fiscal periods you can open/close, opening
   balances you can set, and Journal Entries that actually post and
   move account balances - not decoration. Loads after config-engine.js
   (uses ACCOUNT_MASTER as COA seed data and getCurrentUser/getTenantConfig).
   ============================================================ */

const GL_ACCOUNTS_KEY = 'v_gl_accounts';
const GL_PERIODS_KEY = 'v_gl_periods';
const GL_OPENING_KEY = 'v_gl_opening_balances';
const GL_JE_KEY = 'v_gl_journal_entries';
const GL_APPROVAL_THRESHOLD = 10000; // JEs at/above this total require approval before posting

function glLoad(key, fallback) {
  try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; } catch (e) { return fallback; }
}
function glSave(key, val) { localStorage.setItem(key, JSON.stringify(val)); return val; }

/* ---------- Chart of Accounts ---------- */
function getGLAccounts() {
  let accts = glLoad(GL_ACCOUNTS_KEY, null);
  if (!accts) {
    accts = (typeof ACCOUNT_MASTER !== 'undefined' ? ACCOUNT_MASTER : []).map(a => ({
      id: 'ACC-' + a.code,
      code: a.code,
      name: a.name,
      group: a.group,
      dimensions: a.dimensions || [],
      status: 'active',
      createdAt: new Date().toISOString(),
      createdBy: 'System (seed)',
    }));
    glSave(GL_ACCOUNTS_KEY, accts);
  }
  if (accts && !accts.some(a => a.code === '2200')) {
    accts.push({
      id: 'ACC-2200',
      code: '2200',
      name: 'Premium Payable',
      group: 'liability',
      dimensions: ['cost-center'],
      status: 'active',
      createdAt: new Date().toISOString(),
      createdBy: 'System (patch)',
    });
    glSave(GL_ACCOUNTS_KEY, accts);
  }
  if (accts && !accts.some(a => a.code === '2300')) {
    accts.push({
      id: 'ACC-2300',
      code: '2300',
      name: 'Premium Taxes Payable',
      group: 'liability',
      dimensions: ['state'],
      status: 'active',
      createdAt: new Date().toISOString(),
      createdBy: 'System (patch)',
    });
    glSave(GL_ACCOUNTS_KEY, accts);
  }
  if (accts && !accts.some(a => a.code === '6101')) {
    accts.push({
      id: 'ACC-6101',
      code: '6101',
      name: 'Commission Expense — MGA Override',
      group: 'expense',
      dimensions: ['mga', 'broker', 'cost-center', 'lob'],
      status: 'active',
      createdAt: new Date().toISOString(),
      createdBy: 'System (patch)',
    });
    glSave(GL_ACCOUNTS_KEY, accts);
  }
  return accts;
}

function addGLAccount(input) {
  const accts = getGLAccounts();
  if (accts.some(a => a.code === input.code)) {
    throw new Error('Account code ' + input.code + ' already exists');
  }
  const acct = {
    id: 'ACC-' + input.code,
    code: input.code,
    name: input.name,
    group: input.group,
    dimensions: input.dimensions || [],
    status: 'active',
    createdAt: new Date().toISOString(),
    createdBy: (typeof getCurrentUser === 'function' ? getCurrentUser().name : 'User'),
  };
  accts.unshift(acct);
  glSave(GL_ACCOUNTS_KEY, accts);
  return acct;
}

function setGLAccountStatus(code, status) {
  const accts = getGLAccounts();
  const a = accts.find(a => a.code === code);
  if (a) { a.status = status; glSave(GL_ACCOUNTS_KEY, accts); }
  return a;
}

function findGLAccountByCode(code) {
  return getGLAccounts().find(a => a.code === code) || null;
}

/* ---------- Fiscal Periods ---------- */
const GL_MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function getFiscalPeriods() {
  let periods = glLoad(GL_PERIODS_KEY, null);
  if (!periods) {
    const cfg = typeof getTenantConfig === 'function' ? getTenantConfig() : { fiscalYearStart: 'January', fiscalPeriods: 12 };
    const startIdx = Math.max(0, GL_MONTHS.indexOf(cfg.fiscalYearStart));
    const count = cfg.fiscalPeriods || 12;
    const year = new Date().getFullYear();
    periods = [];
    for (let i = 0; i < count; i++) {
      const idx = (startIdx + i) % 12;
      periods.push({
        label: GL_MONTHS[idx].slice(0, 3) + ' ' + year,
        monthIndex: idx,
        year,
        status: i < 2 ? 'closed' : (i === 2 ? 'open' : 'future'),
      });
    }
    glSave(GL_PERIODS_KEY, periods);
  }
  return periods;
}

function setPeriodStatus(label, status) {
  const periods = getFiscalPeriods();
  const p = periods.find(p => p.label === label);
  if (p) p.status = status;
  glSave(GL_PERIODS_KEY, periods);
  return periods;
}

function getPeriodForDate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr + 'T00:00:00');
  if (isNaN(d.getTime())) return null;
  const label = GL_MONTHS[d.getMonth()].slice(0, 3) + ' ' + d.getFullYear();
  const periods = getFiscalPeriods();
  let p = periods.find(x => x.label === label);
  if (!p) {
    // Dynamically create the missing period as 'open' for seamless simulator testing
    p = {
      label: label,
      monthIndex: d.getMonth(),
      year: d.getFullYear(),
      status: 'open'
    };
    periods.push(p);
    // Sort periods chronologically
    periods.sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      return a.monthIndex - b.monthIndex;
    });
    glSave(GL_PERIODS_KEY, periods);
  }
  return p;
}

/* ---------- Opening Balances ---------- */
function getOpeningBalances() {
  return glLoad(GL_OPENING_KEY, {});
}

function setOpeningBalance(accountCode, debit, credit) {
  const all = getOpeningBalances();
  all[accountCode] = { debit: parseFloat(debit) || 0, credit: parseFloat(credit) || 0, setAt: new Date().toISOString() };
  glSave(GL_OPENING_KEY, all);
  return all[accountCode];
}

/* ---------- Journal Entries ---------- */
function getJournalEntries() {
  let all = glLoad(GL_JE_KEY, null);
  if (!all) {
    const active = (typeof getActiveEntity === 'function') ? getActiveEntity() : null;
    if (active && active.id === 'ENT-MINE' && active.businessType === 'mga') {
      all = [];
    } else {
      all = [
        { id: 'JE-SEED-1', number: 'JE-2026-0048', status: 'posted', createdAt: '2026-05-21T09:00:00.000Z', postedAt: '2026-05-21T09:05:00.000Z', createdBy: 'System (seed)', description: 'Premium receipt, ACCL MGA May batch', lines: [{ acct: '1100', debit: 482500, credit: 0, desc: 'Premium receivable', dims: {} }, { acct: '4100', debit: 0, credit: 482500, desc: 'Net written premium', dims: {} }] },
        { id: 'JE-SEED-2', number: 'JE-2026-0047', status: 'pending_approval', createdAt: '2026-05-20T09:00:00.000Z', submittedAt: '2026-05-20T09:05:00.000Z', createdBy: 'System (seed)', description: 'Claims payment, Motor LOB batch #12', lines: [{ acct: '5200', debit: 124200, credit: 0, desc: 'Claims expense', dims: {} }, { acct: '1001', debit: 0, credit: 124200, desc: 'Cash disbursement', dims: {} }] },
        { id: 'JE-SEED-3', number: 'JE-2026-0046', status: 'posted', createdAt: '2026-05-19T09:00:00.000Z', postedAt: '2026-05-19T09:05:00.000Z', createdBy: 'System (seed)', description: 'Reinsurance cession, May QS treaty', lines: [{ acct: '1400', debit: 96400, credit: 0, desc: 'Reinsurance recoverable', dims: {} }, { acct: '5200', debit: 0, credit: 96400, desc: 'Claims expense offset', dims: {} }] },
      ];
    }
    glSave(GL_JE_KEY, all);
  }
  
  // Retroactively migrate isolated Carrier settlement JEs into the main table
  try {
    const rawCarrier = localStorage.getItem('carrier_v_gl_journal_entries');
    if (rawCarrier) {
      const carrierJEs = JSON.parse(rawCarrier);
      let changed = false;
      carrierJEs.forEach(je => {
        if (!all.some(x => x.id === je.id)) {
          all.push(je);
          changed = true;
        }
      });
      if (changed) {
        all.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        glSave(GL_JE_KEY, all);
      }
    }
  } catch (e) {}

  const active = (typeof getActiveEntity === 'function') ? getActiveEntity() : null;
  if (active && active.id === 'ENT-MINE' && active.businessType === 'mga') {
    return all.filter(je => !je.id.startsWith('JE-SEED-'));
  }
  return all;
}

function jeTotalDebit(je) { return je.lines.reduce((s, l) => s + (parseFloat(l.debit) || 0), 0); }
function jeTotalCredit(je) { return je.lines.reduce((s, l) => s + (parseFloat(l.credit) || 0), 0); }

function findJEAndDbKey(id) {
  // Try carrier database first
  try {
    const rawCarrier = localStorage.getItem('carrier_v_gl_journal_entries');
    if (rawCarrier) {
      const all = JSON.parse(rawCarrier);
      const idx = all.findIndex(j => j.id === id);
      if (idx !== -1) {
        return { list: all, index: idx, dbKey: 'carrier_v_gl_journal_entries' };
      }
    }
  } catch(e) {}

  // Try mga database
  try {
    const rawMga = localStorage.getItem('mga_v_gl_journal_entries');
    if (rawMga) {
      const all = JSON.parse(rawMga);
      const idx = all.findIndex(j => j.id === id);
      if (idx !== -1) {
        return { list: all, index: idx, dbKey: 'mga_v_gl_journal_entries' };
      }
    }
  } catch(e) {}

  // Fallback to active dynamic key
  try {
    const all = getJournalEntries();
    const idx = all.findIndex(j => j.id === id);
    if (idx !== -1) {
      return { list: all, index: idx, dbKey: GL_JE_KEY };
    }
  } catch(e) {}

  return null;
}

function createJournalEntry(je, status = 'draft') {
  const active = (typeof getActiveEntity === 'function') ? getActiveEntity() : null;
  const activeId = active ? active.id : 'ENT-MINE';
  const targetEntityId = je.entityId || activeId;
  
  // Resolve the exact database key to bypass or align with the user prefix
  let dbKey = 'v_gl_journal_entries'; // default dynamic key
  if (targetEntityId === 'ENT-CAR-01') {
    dbKey = 'carrier_v_gl_journal_entries';
  } else if (targetEntityId === 'ENT-MINE') {
    dbKey = 'mga_v_gl_journal_entries';
  }

  // Load existing entries from that exact dbKey
  let all = [];
  try {
    const raw = localStorage.getItem(dbKey);
    if (raw) all = JSON.parse(raw);
  } catch (e) {
    all = [];
  }

  const nextNum = 'JE-' + new Date().getFullYear() + '-' + String(all.length + 1).padStart(4, '0');
  
  const entry = Object.assign({
    id: 'JE-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
    number: nextNum,
    status: status,
    entityId: targetEntityId,
    createdAt: new Date().toISOString(),
    createdBy: (typeof getCurrentUser === 'function' ? getCurrentUser().name : 'User'),
  }, je);
  
  all.unshift(entry);
  localStorage.setItem(dbKey, JSON.stringify(all));
  
  // If we wrote to carrier_v_gl_journal_entries or mga_v_gl_journal_entries,
  // we should also copy it to the default dynamically resolved 'v_gl_journal_entries'
  // so that the current screen sees it immediately if it matches the current active entity.
  try {
    const prefix = typeof getUserPrefix === 'function' ? getUserPrefix() : '';
    const currentDbKey = prefix ? (prefix + 'v_gl_journal_entries') : 'v_gl_journal_entries';
    if (currentDbKey !== dbKey) {
      if (targetEntityId === activeId) {
        let currentAll = [];
        const currentRaw = localStorage.getItem(currentDbKey);
        if (currentRaw) currentAll = JSON.parse(currentRaw);
        currentAll.unshift(entry);
        localStorage.setItem(currentDbKey, JSON.stringify(currentAll));
      }
    }
  } catch (e) {}

  return entry;
}

function submitJournalEntry(id) {
  const match = findJEAndDbKey(id);
  if (!match) return null;
  
  const je = match.list[match.index];
  const amount = Math.max(jeTotalDebit(je), jeTotalCredit(je));
  je.submittedAt = new Date().toISOString();
  if (amount >= GL_APPROVAL_THRESHOLD) {
    je.status = 'pending_approval';
  } else {
    je.status = 'posted';
    je.postedAt = new Date().toISOString();
  }
  
  localStorage.setItem(match.dbKey, JSON.stringify(match.list));
  
  // Also sync with the current active prefix if it matches
  try {
    const prefix = typeof getUserPrefix === 'function' ? getUserPrefix() : '';
    const currentDbKey = prefix ? (prefix + 'v_gl_journal_entries') : 'v_gl_journal_entries';
    if (currentDbKey !== match.dbKey) {
      const active = (typeof getActiveEntity === 'function') ? getActiveEntity() : null;
      if (active && je.entityId === active.id) {
        let currentAll = [];
        const currentRaw = localStorage.getItem(currentDbKey);
        if (currentRaw) currentAll = JSON.parse(currentRaw);
        const idx = currentAll.findIndex(j => j.id === id);
        if (idx !== -1) {
          currentAll[idx] = je;
        } else {
          currentAll.unshift(je);
        }
        localStorage.setItem(currentDbKey, JSON.stringify(currentAll));
      }
    }
  } catch (e) {}

  return je;
}

function approveJournalEntry(id, approver) {
  const match = findJEAndDbKey(id);
  if (!match) return null;
  
  const je = match.list[match.index];
  je.status = 'posted';
  je.postedAt = new Date().toISOString();
  je.approvedBy = approver || (typeof getCurrentUser === 'function' ? getCurrentUser().name : 'User');
  
  localStorage.setItem(match.dbKey, JSON.stringify(match.list));
  
  // Sync current screen if matches
  try {
    const prefix = typeof getUserPrefix === 'function' ? getUserPrefix() : '';
    const currentDbKey = prefix ? (prefix + 'v_gl_journal_entries') : 'v_gl_journal_entries';
    if (currentDbKey !== match.dbKey) {
      const active = (typeof getActiveEntity === 'function') ? getActiveEntity() : null;
      if (active && je.entityId === active.id) {
        let currentAll = [];
        const currentRaw = localStorage.getItem(currentDbKey);
        if (currentRaw) currentAll = JSON.parse(currentRaw);
        const idx = currentAll.findIndex(j => j.id === id);
        if (idx !== -1) {
          currentAll[idx] = je;
          localStorage.setItem(currentDbKey, JSON.stringify(currentAll));
        }
      }
    }
  } catch (e) {}

  return je;
}

function rejectJournalEntry(id, reason) {
  const match = findJEAndDbKey(id);
  if (!match) return null;
  
  const je = match.list[match.index];
  je.status = 'rejected';
  je.rejectReason = reason || 'No reason given';
  je.rejectedAt = new Date().toISOString();
  
  localStorage.setItem(match.dbKey, JSON.stringify(match.list));
  
  try {
    const prefix = typeof getUserPrefix === 'function' ? getUserPrefix() : '';
    const currentDbKey = prefix ? (prefix + 'v_gl_journal_entries') : 'v_gl_journal_entries';
    if (currentDbKey !== match.dbKey) {
      const active = (typeof getActiveEntity === 'function') ? getActiveEntity() : null;
      if (active && je.entityId === active.id) {
        let currentAll = [];
        const currentRaw = localStorage.getItem(currentDbKey);
        if (currentRaw) currentAll = JSON.parse(currentRaw);
        const idx = currentAll.findIndex(j => j.id === id);
        if (idx !== -1) {
          currentAll[idx] = je;
          localStorage.setItem(currentDbKey, JSON.stringify(currentAll));
        }
      }
    }
  } catch (e) {}

  return je;
}

/* Opening balance + every posted JE line for that account = the account's current balance.
   This is what makes "closing balance" real: it is opening + everything posted since, not a
   separately-maintained number. */
function getJournalEntriesForActiveEntity() {
  const all = getJournalEntries();
  const active = (typeof getActiveEntity === 'function') ? getActiveEntity() : null;
  if (!active) return all;
  return all.filter(je => {
    if (je.entityId) {
      if (active.id === je.entityId) return true;
      if (active.businessType === 'carrier' && je.entityId === 'ENT-CAR-01') return true;
      if (active.businessType === 'mga' && je.entityId === 'ENT-MINE') return true;
      if ((active.businessType === 'agency' || active.businessType === 'broker') && (je.entityId === 'ENT-AGY-01' || je.entityId === 'ENT-BRK-01')) return true;
      return false;
    }
    // Default fallback for legacy un-tagged entries
    if (active.businessType === 'carrier') return true;
    return active.id === 'ENT-MINE';
  });
}

function getAccountBalance(accountCode) {
  const opening = getOpeningBalances()[accountCode] || { debit: 0, credit: 0 };
  let debit = opening.debit || 0, credit = opening.credit || 0;
  getJournalEntriesForActiveEntity().filter(j => j.status === 'posted').forEach(je => {
    je.lines.filter(l => l.acct === accountCode).forEach(l => {
      debit += parseFloat(l.debit) || 0;
      credit += parseFloat(l.credit) || 0;
    });
  });
  return { debit, credit, net: debit - credit };
}

/* The full, clickable story behind an account balance: opening balance, every posted
   JE line against it in order, a running balance, and the closing balance - exactly
   what "view opening and closing balances" means for a real account. */
function getAccountLedger(accountCode) {
  const opening = getOpeningBalances()[accountCode] || { debit: 0, credit: 0 };
  const openingNet = (opening.debit || 0) - (opening.credit || 0);
  const rows = [];
  getJournalEntriesForActiveEntity()
    .filter(j => j.status === 'posted')
    .sort((a, b) => new Date(a.date || a.createdAt) - new Date(b.date || b.createdAt))
    .forEach(je => {
      je.lines.filter(l => l.acct === accountCode).forEach(l => {
        rows.push({
          jeId: je.id, jeNumber: je.number, date: je.date || je.createdAt.slice(0, 10),
          description: l.desc || je.description, debit: parseFloat(l.debit) || 0, credit: parseFloat(l.credit) || 0,
          dims: l.dims || {},
        });
      });
    });
  let running = openingNet;
  rows.forEach(r => { running += r.debit - r.credit; r.runningBalance = running; });
  return { openingBalance: opening, openingNet, rows, closingNet: running, closing: { debit: Math.max(running, 0), credit: Math.max(-running, 0) } };
}

function getPendingApprovalEntries() {
  return getJournalEntriesForActiveEntity().filter(j => j.status === 'pending_approval');
}

function createCarrierJournalEntryDirect(je, status = 'draft') {
  // 1. Save to the main shared table (v_gl_journal_entries)
  let all = [];
  try {
    const raw = localStorage.getItem('v_gl_journal_entries');
    if (raw) all = JSON.parse(raw);
  } catch (e) {
    all = [];
  }
  
  const nextNum = 'JE-' + new Date().getFullYear() + '-' + String(all.length + 1).padStart(4, '0');
  
  const entry = Object.assign({
    id: 'JE-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
    number: nextNum,
    status: status,
    entityId: 'ENT-CAR-01',
    createdAt: new Date().toISOString(),
    createdBy: 'System (Settlement Bridge)',
  }, je);
  
  if (status === 'posted') {
    entry.postedAt = new Date().toISOString();
  }
  
  all.unshift(entry);
  localStorage.setItem('v_gl_journal_entries', JSON.stringify(all));
  
  // 2. Keep the isolated carrier key for compatibility
  let carrierJEs = [];
  try {
    const raw = localStorage.getItem('carrier_v_gl_journal_entries');
    if (raw) carrierJEs = JSON.parse(raw);
  } catch (e) {
    carrierJEs = [];
  }
  carrierJEs.unshift(entry);
  localStorage.setItem('carrier_v_gl_journal_entries', JSON.stringify(carrierJEs));
  
  return entry;
}
