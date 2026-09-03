/* ============================================================
   VERIDEX FINANCE SYSTEM - Application Logic (shared utilities)
   ============================================================ */

// Firebase Realtime Database Sync Engine
(function() {
  const firebaseConfig = {
    apiKey: "AIzaSyCR1-S8ufe7udeB3Hkpt1ZBrA2H_HHw4Ys",
    authDomain: "finance-and-accounting-de957.firebaseapp.com",
    databaseURL: "https://finance-and-accounting-de957-default-rtdb.firebaseio.com",
    projectId: "finance-and-accounting-de957",
    storageBucket: "finance-and-accounting-de957.firebasestorage.app",
    messagingSenderId: "269560982904",
    appId: "1:269560982904:web:3679527e15a8644dc36c8d",
    measurementId: "G-N85QB7YSWF"
  };

  const SYNC_KEYS = [
    'credentials',
    'v_tenant_config',
    'v_gl_journal_entries',
    'sl_users_db',
    'sl_bulk_uploads',
    'v_home_checklist',
    'v_remembered_user',
    'v_remember_until',
    'v_period_close_step',
    'sl_excel_mapping_templates',
    'v_gl_periods',
    'pas_policies',
    'pas_invoices',
    'pas_bank_txns',
    'v_pas_injected_events',
    'v_io_mgas',
    'v_io_policies',
    'v_io_invoices',
    'v_io_banklines',
    'v_insurance_simulation_state',
    'v_sim_parties',
    'v_master_vendors',
    'v_master_customers',
    'v_master_brokers',
    'v_master_carriers',
    'v_master_employees'
  ];

  let dbRef = null;
  const keysSyncing = {};
  const memStore = {};

  // Store original Storage methods
  const originalGetItem = Storage.prototype.getItem;
  const originalSetItem = Storage.prototype.setItem;
  const originalRemoveItem = Storage.prototype.removeItem;
  const originalClear = Storage.prototype.clear;

  function getUserPrefix() {
    try {
      const userStr = sessionStorage.getItem('v_current_user') || originalGetItem.call(localStorage, 'v_remembered_user');
      if (userStr) {
        const user = JSON.parse(userStr);
        if (user && user.email) {
          const prefix = user.email.split('@')[0].toLowerCase();
          if (['carrier', 'mga', 'broker', 'insured'].includes(prefix)) {
            return prefix + '_';
          }
        }
      }
      const email = sessionStorage.getItem('login_email');
      if (email) {
        const prefix = email.split('@')[0].toLowerCase();
        if (['carrier', 'mga', 'broker', 'insured'].includes(prefix)) {
          return prefix + '_';
        }
      }
    } catch (e) {}
    return '';
  }

  function isGlobalKey(key) {
    return ['credentials', 'sl_users_db'].includes(key);
  }

  function getDynamicKey(key) {
    if (isGlobalKey(key)) return key;
    const prefix = getUserPrefix();
    return prefix ? (prefix + key) : key;
  }

  // 1. BLOCKING SYNCHRONOUS PULL FROM FIREBASE RTD REST API
  let remoteData = null;
  try {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', firebaseConfig.databaseURL + '/veridex_prototype.json', false);
    xhr.send();
    if (xhr.status === 200) {
      remoteData = JSON.parse(xhr.responseText);
    }
  } catch (e) {
    console.error('Firebase synchronous REST pull failed:', e);
  }

  if (remoteData && Object.keys(remoteData).length > 0) {
    Object.keys(remoteData).forEach(dynamicKey => {
      const baseKey = SYNC_KEYS.find(k => dynamicKey === k || dynamicKey.endsWith('_' + k));
      if (baseKey) {
        const remoteValStr = typeof remoteData[dynamicKey] === 'object' ? JSON.stringify(remoteData[dynamicKey]) : String(remoteData[dynamicKey]);
        memStore[dynamicKey] = remoteValStr;
      }
    });
  }

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = src;
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  async function initFirebase() {
    if (typeof firebase === 'undefined') {
      try {
        await loadScript('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
        await loadScript('https://www.gstatic.com/firebasejs/9.22.0/firebase-database-compat.js');
      } catch (e) {
        console.error('Failed to load Firebase scripts:', e);
        return;
      }
    }

    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    dbRef = firebase.database().ref('veridex_prototype');

    // 1. Seed global keys
    if (!remoteData || remoteData['credentials'] === undefined) {
      const defaultCreds = [
        { "email": "carrier@gmail.com", "password": "admin@123" },
        { "email": "mga@gmail.com", "password": "admin@123" },
        { "email": "broker@gmail.com", "password": "admin@123" },
        { "email": "insured@gmail.com", "password": "admin@123" }
      ];
      memStore['credentials'] = JSON.stringify(defaultCreds);
      pushToFirebase('credentials', memStore['credentials']);
    }
    if (!remoteData || remoteData['sl_users_db'] === undefined) {
      const defaultUsersDb = {
        "modules": [
          {"id":"dashboard","label":"Dashboard"},
          {"id":"chart-of-accounts","label":"Chart of Accounts"},
          {"id":"journal-entry","label":"Journal Entry","extraActions":["post"]},
          {"id":"financial-statements","label":"Financial Statements"},
          {"id":"bank-reconciliation","label":"Bank Reconciliation"},
          {"id":"accounts-payable","label":"Bank & AP/AR Hub"},
          {"id":"premium-claims","label":"Premium & Claims"},
          {"id":"subledger","label":"Subledger Processing"},
          {"id":"reinsurance","label":"Reinsurance"},
          {"id":"statutory-reports","label":"Statutory Reports","extraActions":["file"]},
          {"id":"mga-operations","label":"MGA Operations"},
          {"id":"compliance-filings","label":"Compliance & Filings","extraActions":["file"]},
          {"id":"period-locking","label":"Period Locking","extraActions":["lock","override"]},
          {"id":"audit-trail","label":"Audit Trail"},
          {"id":"user-management","label":"User Management"}
        ],
        "stdActions": ["view","create","edit","approve","export"],
        "roles": [
          { "id": "admin", "label": "Administrator", "color": "#0d1b4b", "description": "Full system access.", "permissions": { "dashboard": ["view","export"], "chart-of-accounts": ["view","create","edit","approve","export"], "journal-entry": ["view","create","edit","approve","export","post"], "financial-statements": ["view","export"], "bank-reconciliation": ["view","create","edit","approve","export"], "accounts-payable": ["view","create","edit","approve","export"], "premium-claims": ["view","create","edit","approve","export"], "subledger": ["view","create","edit","approve","export"], "reinsurance": ["view","create","edit","approve","export"], "statutory-reports": ["view","create","edit","approve","export","file"], "mga-operations": ["view","create","edit","approve","export"], "compliance-filings": ["view","create","edit","approve","export","file"], "period-locking": ["view","approve","export","lock","override"], "audit-trail": ["view","export"], "user-management": ["view","create","edit","approve","export"] } },
          { "id": "cfo", "label": "CFO", "color": "#1a237e", "description": "Strategic oversight.", "permissions": { "dashboard": ["view","export"], "chart-of-accounts": ["view","export"], "journal-entry": ["view","approve","export"], "financial-statements": ["view","export"], "bank-reconciliation": ["view","export"], "accounts-payable": ["view","approve","export"], "premium-claims": ["view","export"], "subledger": ["view","export"], "reinsurance": ["view","approve","export"], "statutory-reports": ["view","approve","export","file"], "mga-operations": ["view","approve","export"], "compliance-filings": ["view","approve","export","file"], "period-locking": ["view","approve","lock","override"], "audit-trail": ["view","export"], "user-management": ["view","export"] } },
          { "id": "controller", "label": "Controller", "color": "#1565c0", "description": "Accounting control.", "permissions": { "dashboard": ["view","export"], "chart-of-accounts": ["view","create","edit","approve","export"], "journal-entry": ["view","create","edit","approve","export","post"], "financial-statements": ["view","export"], "bank-reconciliation": ["view","create","edit","approve","export"], "accounts-payable": ["view","create","edit","approve","export"], "premium-claims": ["view","create","edit","export"], "subledger": ["view","create","edit","approve","export"], "reinsurance": ["view","create","edit","export"], "statutory-reports": ["view","create","edit","approve","export","file"], "mga-operations": ["view","create","edit","approve","export"], "compliance-filings": ["view","create","edit","approve","export","file"], "period-locking": ["view","approve","lock"], "audit-trail": ["view","export"], "user-management": ["view"] } },
          { "id": "accountant", "label": "Accountant", "color": "#2e7d32", "description": "Create and edit transactions.", "permissions": { "dashboard": ["view"], "chart-of-accounts": ["view"], "journal-entry": ["view","create","edit","export"], "financial-statements": ["view"], "bank-reconciliation": ["view","create","edit"], "accounts-payable": ["view","create","edit","export"], "premium-claims": ["view"], "subledger": ["view","create","edit"], "reinsurance": ["view"], "statutory-reports": ["view"], "mga-operations": ["view","create","edit"], "compliance-filings": ["view"], "period-locking": ["view"], "audit-trail": ["view"], "user-management": [] } },
          { "id": "auditor", "label": "Auditor", "color": "#e65100", "description": "Read-only across all modules.", "permissions": { "dashboard": ["view","export"], "chart-of-accounts": ["view","export"], "journal-entry": ["view","export"], "financial-statements": ["view","export"], "bank-reconciliation": ["view","export"], "accounts-payable": ["view","export"], "premium-claims": ["view","export"], "subledger": ["view","export"], "reinsurance": ["view","export"], "statutory-reports": ["view","export"], "mga-operations": ["view","export"], "compliance-filings": ["view","export"], "period-locking": ["view"], "audit-trail": ["view","export"], "user-management": ["view"] } },
          { "id": "carrier-controller", "label": "Carrier Controller / Actuary", "color": "#1565c0", "description": "Specialist access.", "permissions": { "dashboard": ["view"], "chart-of-accounts": [], "journal-entry": [], "financial-statements": ["view"], "bank-reconciliation": [], "accounts-payable": [], "premium-claims": ["view","create","edit","approve","export"], "subledger": ["view","export"], "reinsurance": ["view","create","edit","export"], "statutory-reports": ["view","export"], "mga-operations": ["view"], "compliance-filings": [], "period-locking": [], "audit-trail": ["view"], "user-management": [] } },
          { "id": "mga-ops", "label": "MGA Operations Manager", "color": "#c9791f", "description": "Specialist access.", "permissions": { "dashboard": ["view"], "chart-of-accounts": [], "journal-entry": [], "financial-statements": ["view"], "bank-reconciliation": [], "accounts-payable": [], "premium-claims": ["view","create","edit","approve","export"], "subledger": ["view","export"], "reinsurance": ["view"], "statutory-reports": ["view","export"], "mga-operations": ["view","create","edit","approve","export"], "compliance-filings": [], "period-locking": [], "audit-trail": ["view"], "user-management": [] } },
          { "id": "agency-principal", "label": "Agency Principal", "color": "#0f6e63", "description": "Access to place premiums.", "permissions": { "dashboard": ["view"], "chart-of-accounts": [], "journal-entry": [], "financial-statements": ["view"], "bank-reconciliation": [], "accounts-payable": [], "premium-claims": ["view","create","edit","approve","export"], "subledger": ["view","export"], "reinsurance": [], "statutory-reports": ["view","export"], "mga-operations": [], "compliance-filings": [], "period-locking": [], "audit-trail": ["view"], "user-management": [] } }
        ],
        "users": [
          { "id": "USR-001", "name": "Jordan Blake", "email": "insured@gmail.com", "initials": "JB", "avatarColor": "#0f6e63", "role": "admin", "department": "IT", "title": "System Administrator", "status": "active", "mfa": true, "lastLogin": "21/05/2026 09:14", "joinedDate": "01/01/2024", "customPermissions": {} },
          { "id": "USR-002", "name": "Lena Novak", "email": "carrier@gmail.com", "initials": "LN", "avatarColor": "#1565c0", "role": "carrier-controller", "department": "Finance", "title": "Carrier Controller", "status": "active", "mfa": true, "lastLogin": "21/05/2026 08:30", "joinedDate": "15/03/2022", "customPermissions": {} },
          { "id": "USR-003", "name": "Diego Alvarez", "email": "mga@gmail.com", "initials": "DA", "avatarColor": "#c9791f", "role": "mga-ops", "department": "Finance", "title": "MGA Operations Manager", "status": "active", "mfa": true, "lastLogin": "20/05/2026 17:42", "joinedDate": "01/06/2022", "customPermissions": {} },
          { "id": "USR-004", "name": "Priya Menon", "email": "broker@gmail.com", "initials": "PM", "avatarColor": "#0f6e63", "role": "agency-principal", "department": "Finance", "title": "Agency Principal", "status": "active", "mfa": true, "lastLogin": "21/05/2026 08:55", "joinedDate": "12/08/2023", "customPermissions": {} }
        ],
        "pendingInvites": []
      };
      memStore['sl_users_db'] = JSON.stringify(defaultUsersDb);
      pushToFirebase('sl_users_db', memStore['sl_users_db']);
    }

    // 2. Seed user-prefixed keys for carrier, mga, broker, insured
    const profiles = ['carrier', 'mga', 'broker', 'insured'];
    profiles.forEach(prof => {
      const prefix = prof + '_';
      const configKey = prefix + 'v_tenant_config';
      if (!remoteData || remoteData[configKey] === undefined) {
        let bType = 'mga';
        let bLabel = 'MGA / Program Manager';
        let coaT = 'mga-template';
        if (prof === 'carrier') { bType = 'carrier'; bLabel = 'Insurance Carrier'; coaT = 'naic-statutory'; }
        else if (prof === 'broker') { bType = 'agency'; bLabel = 'Insurance Agency'; coaT = 'mga-template'; }
        else if (prof === 'insured') { bType = 'insured'; bLabel = 'Insured / Policyholder Org'; coaT = 'us-gaap-standard'; }
        
        const myName = prof === 'carrier' ? 'Lena Novak' : (prof === 'mga' ? 'Diego Alvarez' : (prof === 'broker' ? 'Priya Menon' : 'Jordan Blake'));
        const myRole = prof === 'carrier' ? 'carrier-controller' : (prof === 'mga' ? 'mga-ops' : (prof === 'broker' ? 'agency-principal' : 'admin'));
        
        const defConfig = {
          tenantId: 'TEN-1001',
          onboarded: false,
          setupStage: 'welcome',
          ownerName: myName,
          ownerRoleTitle: myRole === 'admin' ? 'Administrator' : (myRole === 'carrier-controller' ? 'Carrier Controller' : (myRole === 'mga-ops' ? 'MGA Operations Manager' : 'Agency Principal')),
          ownerRoleId: myRole === 'admin' ? 'admin' : 'other',
          companyName: 'My Business',
          businessLabel: bLabel,
          businessType: bType,
          secondaryEntities: [
            { id: 'ENT-MINE',   name: 'My Business',             businessType: bType },
            { id: 'ENT-MGA-01', name: 'NTA', businessType: 'mga' },
            { id: 'ENT-AGY-01', name: 'HIT', businessType: 'agency' },
            { id: 'ENT-CAR-01', name: 'SOUTHLAKE', businessType: 'carrier' },
            { id: 'ENT-INS-01', name: 'Ayushi', businessType: 'insured' }
          ].filter(e => e.id === 'ENT-MINE' || e.businessType !== bType),
          entityConfigs: {
            'ENT-MINE': {
              coaTemplate: coaT,
              enabledDimensions: { department: true, location: true },
              enabledModules: {
                'gl': true,
                'ar': true,
                'ap': true,
                'billing': true,
                'bank': true,
                'tax': true,
                'reporting': true,
                'workflow': true,
                'customization': true,
                'admin-config': true,
                'documents': true,
                'identity': true,
                'insurance': bType !== 'insured'
              },
              onboarded: false
            },
            'ENT-AGY-01': { onboarded: false },
            'ENT-CAR-01': { onboarded: false },
            'ENT-INS-01': { onboarded: false }
          },
          activeEntityId: 'ENT-MINE',
          coaTemplate: coaT,
          enabledModules: {
            'gl': true,
            'ar': true,
            'ap': true,
            'billing': true,
            'bank': true,
            'tax': true,
            'reporting': true,
            'workflow': true,
            'customization': true,
            'admin-config': true,
            'documents': true,
            'identity': true,
            'insurance': bType !== 'insured'
          },
          enabledDimensions: {
            department: true,
            location: true
          },
          fiscalYearStart: 'January',
          fiscalPeriods: 12,
          multiCurrency: false,
          functionalCurrency: 'USD',
          configStatus: 'Published',
          configVersion: 7,
          readinessScore: 92
        };
        memStore[configKey] = JSON.stringify(defConfig);
        pushToFirebase(configKey, memStore[configKey]);
      }
      
      const emptyVals = {
        'v_gl_journal_entries': '[]',
        'sl_bulk_uploads': '[]',
        'v_home_checklist': '{}',
        'v_gl_periods': '[]',
        'sl_excel_mapping_templates': '{}',
        'v_period_close_step': '{}',
        'pas_policies': '[]',
        'pas_invoices': '[]',
        'pas_bank_txns': '[]',
        'v_io_mgas': '[]',
        'v_io_policies': '[]',
        'v_io_invoices': '[]',
        'v_io_banklines': '[]',
        'v_insurance_simulation_state': 'null',
        'v_sim_parties': '[]',
        'v_master_vendors': '[]',
        'v_master_customers': '[]',
        'v_master_brokers': '[]',
        'v_master_carriers': '[]',
        'v_master_employees': '[]'
      };
      Object.keys(emptyVals).forEach(baseKey => {
        const fullKey = prefix + baseKey;
        if (!remoteData || remoteData[fullKey] === undefined) {
          memStore[fullKey] = emptyVals[baseKey];
          pushToFirebase(fullKey, memStore[fullKey]);
        }
      });
    });

    // Proactively clean physical local storage keys so we never use the local database on disk
    SYNC_KEYS.forEach(key => {
      originalRemoveItem.call(localStorage, key);
    });

    dbRef.on('child_changed', handleRemoteUpdate);
    dbRef.on('child_added', handleRemoteUpdate);
  }

  function handleRemoteUpdate(snapshot) {
    const dynamicKey = snapshot.key;
    if (keysSyncing[dynamicKey]) return;
    const baseKey = SYNC_KEYS.find(k => dynamicKey === k || dynamicKey.endsWith('_' + k));
    if (!baseKey) return;

    const val = snapshot.val();
    const remoteValStr = typeof val === 'object' ? JSON.stringify(val) : String(val);
    const localValStr = memStore[dynamicKey] !== undefined ? memStore[dynamicKey] : null;

    if (localValStr !== remoteValStr) {
      keysSyncing[dynamicKey] = true;
      memStore[dynamicKey] = remoteValStr;
      delete keysSyncing[dynamicKey];

      const currentPrefix = getUserPrefix();
      const isMyKey = isGlobalKey(baseKey) || (currentPrefix && dynamicKey.startsWith(currentPrefix)) || (!currentPrefix && !dynamicKey.includes('_'));
      
      if (isMyKey) {
        window.dispatchEvent(new StorageEvent('storage', {
          key: baseKey,
          oldValue: localValStr,
          newValue: remoteValStr,
          url: window.location.href,
          storageArea: localStorage
        }));

        const criticalKeys = ['v_tenant_config', 'v_gl_journal_entries', 'sl_users_db', 'sl_bulk_uploads', 'v_gl_periods'];
        if (criticalKeys.includes(baseKey)) {
          if (window.firebaseReloadTimeout) clearTimeout(window.firebaseReloadTimeout);
          if (document.hidden) {
            window.firebaseReloadTimeout = setTimeout(() => {
              window.location.reload();
            }, 1000);
          } else {
            // Dynamically refresh the UI without forcing a full page reload if the tab is focused
            if (typeof renderRecentJE === 'function') renderRecentJE();
            if (typeof renderAll === 'function') renderAll();
          }
        }
      }
    }
  }

  function pushToFirebase(key, value) {
    if (!dbRef) return;
    let parsedVal = value;
    try {
      parsedVal = JSON.parse(value);
    } catch (e) {
      // Keep as string
    }

    keysSyncing[key] = true;
    dbRef.child(key).set(parsedVal)
      .catch(e => console.error(`Firebase push failed for ${key}:`, e))
      .finally(() => { delete keysSyncing[key]; });
  }

  function removeFromFirebase(key) {
    if (!dbRef) return;
    keysSyncing[key] = true;
    dbRef.child(key).remove()
      .catch(e => console.error(`Firebase remove failed for ${key}:`, e))
      .finally(() => { delete keysSyncing[key]; });
  }

  // Intercept Storage.prototype.getItem
  Storage.prototype.getItem = function(key) {
    if (this === localStorage) {
      const baseKey = SYNC_KEYS.find(k => key === k || key.endsWith('_' + k));
      if (baseKey) {
        const dynKey = (key === baseKey) ? getDynamicKey(key) : key;
        return memStore[dynKey] !== undefined ? memStore[dynKey] : null;
      }
    }
    return originalGetItem.apply(this, arguments);
  };

  // Intercept Storage.prototype.setItem
  Storage.prototype.setItem = function(key, value) {
    if (this === localStorage) {
      const baseKey = SYNC_KEYS.find(k => key === k || key.endsWith('_' + k));
      if (baseKey) {
        const dynKey = (key === baseKey) ? getDynamicKey(key) : key;
        const valStr = String(value);
        memStore[dynKey] = valStr;
        if (!keysSyncing[dynKey]) {
          pushToFirebase(dynKey, valStr);
        }
        return;
      }
    }
    originalSetItem.apply(this, arguments);
  };

  // Intercept Storage.prototype.removeItem
  Storage.prototype.removeItem = function(key) {
    if (this === localStorage) {
      const baseKey = SYNC_KEYS.find(k => key === k || key.endsWith('_' + k));
      if (baseKey) {
        const dynKey = (key === baseKey) ? getDynamicKey(key) : key;
        delete memStore[dynKey];
        if (!keysSyncing[dynKey]) {
          removeFromFirebase(dynKey);
        }
        return;
      }
    }
    originalRemoveItem.apply(this, arguments);
  };

  // Intercept Storage.prototype.clear
  Storage.prototype.clear = function() {
    if (this === localStorage) {
      const prefix = getUserPrefix();
      SYNC_KEYS.forEach(key => {
        if (!isGlobalKey(key)) {
          const dynKey = prefix ? (prefix + key) : key;
          delete memStore[dynKey];
          if (!keysSyncing[dynKey]) {
            removeFromFirebase(dynKey);
          }
        }
      });
    }
    originalClear.apply(this, arguments);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFirebase);
  } else {
    initFirebase();
  }
})();

/* ---------- KPI Accordions ---------- */
function toggleAccordion(bodyId, toggleBtn) {
  const body = document.getElementById(bodyId);
  if (!body) return;
  const isOpen = body.classList.contains('open');
  body.classList.toggle('open');
  if (toggleBtn) toggleBtn.textContent = isOpen ? '+' : '−';
}

/* ---------- Tab Switching ---------- */
function switchTab(tabGroupId, tabId) {
  const group = document.getElementById(tabGroupId) || document;
  group.querySelectorAll('.page-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  const tab = group.querySelector(`[data-tab="${tabId}"]`);
  const panel = document.querySelector(`[data-panel="${tabId}"]`);
  if (tab) tab.classList.add('active');
  if (panel) panel.classList.add('active');
}

/* ---------- Tree toggle (Entity Hierarchy, COA tree) ---------- */
function toggleTree(nodeEl, event) {
  if (event && event.target.closest('a,button,input,select')) return;
  nodeEl.classList.toggle('open');
}

/* ---------- OTP Input Handling ---------- */
function initOtpInputs() {
  const inputs = document.querySelectorAll('.otp-digit');
  inputs.forEach((input, idx) => {
    input.addEventListener('keydown', e => {
      if (e.key === 'Backspace' && !input.value && idx > 0) inputs[idx - 1].focus();
    });
    input.addEventListener('input', () => {
      input.value = input.value.replace(/\D/g, '').slice(0, 1);
      if (input.value && idx < inputs.length - 1) inputs[idx + 1].focus();
    });
    input.addEventListener('paste', e => {
      e.preventDefault();
      const paste = (e.clipboardData || window.clipboardData).getData('text').replace(/\D/g, '');
      paste.split('').forEach((ch, i) => { if (inputs[idx + i]) inputs[idx + i].value = ch; });
      const nextEmpty = [...inputs].findIndex((inp, i) => i >= idx && !inp.value);
      if (nextEmpty !== -1) inputs[nextEmpty].focus();
    });
  });
}

/* ---------- Toast Notifications ---------- */
function showToast(message, type = 'default', duration = 3000) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = `toast ${type !== 'default' ? 'toast-' + type : ''}`;
  const icons = { success: '✓', error: '✕', warning: '⚠', info: 'ℹ', default: '●' };
  toast.innerHTML = `<span>${icons[type] || icons.default}</span><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'slideIn 0.3s ease reverse';
    setTimeout(() => toast.remove(), 280);
  }, duration);
}

/* ---------- Table Row Selection ---------- */
function initTableSelection(tableId) {
  const table = document.getElementById(tableId);
  if (!table) return;
  const headerCheck = table.querySelector('thead .table-check');
  const rowChecks = table.querySelectorAll('tbody .table-check');
  if (headerCheck) {
    headerCheck.addEventListener('change', () => {
      rowChecks.forEach(c => { c.checked = headerCheck.checked; });
    });
  }
  rowChecks.forEach(c => {
    c.addEventListener('change', () => {
      if (headerCheck) headerCheck.indeterminate = [...rowChecks].some(r => r.checked) && [...rowChecks].some(r => !r.checked);
    });
  });
}

/* ---------- Simple Search Filter ---------- */
function initTableFilter(inputId, tableId) {
  const input = document.getElementById(inputId);
  const table = document.getElementById(tableId);
  if (!input || !table) return;
  input.addEventListener('input', () => {
    const term = input.value.toLowerCase();
    table.querySelectorAll('tbody tr').forEach(row => {
      row.style.display = row.textContent.toLowerCase().includes(term) ? '' : 'none';
    });
  });
}

/* ---------- Form Validation ---------- */
function validateRequired(formId) {
  const form = document.getElementById(formId);
  if (!form) return true;
  let valid = true;
  form.querySelectorAll('[required]').forEach(field => {
    if (!field.value.trim()) {
      field.style.borderColor = 'var(--coral)';
      valid = false;
      field.addEventListener('input', () => { field.style.borderColor = ''; }, { once: true });
    }
  });
  return valid;
}

/* ---------- Upload Zone Interactions ---------- */
function initUploadZone(zoneId, inputId) {
  const zone = document.getElementById(zoneId);
  const input = document.getElementById(inputId);
  if (!zone) return;
  zone.addEventListener('dragover', e => {
    e.preventDefault();
    zone.classList.add('drag');
  });
  zone.addEventListener('dragleave', () => zone.classList.remove('drag'));
  zone.addEventListener('drop', e => {
    e.preventDefault();
    zone.classList.remove('drag');
    const files = e.dataTransfer.files;
    if (files.length) handleUpload(files[0], zone);
  });
  zone.addEventListener('click', () => { if (input) input.click(); });
  if (input) {
    input.addEventListener('change', () => {
      if (input.files.length) handleUpload(input.files[0], zone);
    });
  }
}

function handleUpload(file, zone) {
  zone.innerHTML = `
    <div style="color:var(--v-teal);font-size:13px;font-weight:600;">
      📎 ${file.name}
      <div style="font-size:11px;color:var(--gray-500);margin-top:4px;font-weight:400;">${(file.size / 1024).toFixed(1)} KB</div>
    </div>`;
  showToast(`File "${file.name}" ready for upload`, 'success');
}

/* ---------- Import result handoff (Excel Onboarding -> results page) ----------
   Closes the "upload, then see it show up here" loop: excel-onboarding.html stashes
   what it just imported via config-engine.js's stashImportResult(); the relevant feature
   page calls this once on load to show a real preview of that import. */
function renderImportResultBanner(uploadTypeId) {
  if (typeof consumeImportResult !== 'function') return null;
  const result = consumeImportResult(uploadTypeId);
  if (!result) return null;
  const mount = document.querySelector('.main-content');
  if (!mount) return result;
  const p = result.payload;
  const tableHtml = `
    <table class="data-table" style="margin-top:10px;">
      <thead><tr>${p.columns.map(c => `<th>${c}</th>`).join('')}</tr></thead>
      <tbody>${p.rows.map(r => `<tr>${r.map(v => `<td>${v == null ? '' : v}</td>`).join('')}</tr>`).join('')}</tbody>
    </table>`;
  const banner = document.createElement('div');
  banner.className = 'v-lock-note';
  banner.style.marginBottom = '16px';
  banner.style.borderLeft = '3px solid var(--green)';
  banner.innerHTML = `<div><strong>${p.rowCount} rows imported</strong> via Excel Onboarding (${p.uploadTypeLabel}) just now. Preview of the mapped columns below, matching what you'll see reflected in the tables on this page.</div>${tableHtml}`;
  const header = mount.querySelector('.page-header');
  if (header) header.insertAdjacentElement('afterend', banner);
  else mount.insertAdjacentElement('afterbegin', banner);
  return result;
}

/* ---------- Number Formatting ---------- */
function fmtCurrency(val, symbol = '$') {
  return symbol + Number(val || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function fmtNumber(val) { return Number(val || 0).toLocaleString('en-US'); }
function fmtLakhCrore(val) { return Number(val || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
function today() { return new Date().toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' }); }

/* ---------- Authentication & Logout ---------- */
function handleLogout() {
  sessionStorage.clear();
  localStorage.removeItem('v_current_user');
  localStorage.removeItem('v_remembered_user');
  localStorage.removeItem('v_remember_until');
  if (typeof VeriDexComponents !== 'undefined' && VeriDexComponents.showToast) {
    VeriDexComponents.showToast('You have been signed out.', 'info');
  }
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 100);
}

/* ---------- Init on DOMContentLoaded ---------- */
document.addEventListener('DOMContentLoaded', () => {
  initOtpInputs();
  document.querySelectorAll('[data-table-init]').forEach(t => initTableSelection(t.id));
  document.querySelectorAll('[data-filter-input]').forEach(i => {
    const targetTable = i.getAttribute('data-filter-input');
    if (targetTable) initTableFilter(i.id, targetTable);
  });
  document.querySelectorAll('[data-upload-zone]').forEach(z => {
    initUploadZone(z.id, z.getAttribute('data-upload-zone'));
  });
});
