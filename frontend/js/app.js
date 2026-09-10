/**
 * AlignFin Main Application Orchestrator
 * Coordinates state, scenario switching, API calls, and event wiring.
 */

// Global Application State
const state = {
  activeScenario: 'SCENARIO_1',
  profile: {
    income: 85000,
    expenses: 40000,
    existing_debt_emi: 5000,
    current_savings: 120000,
    risk_tolerance: 'MODERATE',
    target_horizon_months: 36,
    loan_amount_needed: 500000,
    investment_amount: 100000,
    savings_amount: 150000
  },
  categoryFilter: 'LOAN',
  fbsi: null,
  products: [],
  evaluations: [],
  comparisonSelection: ['loan_trap_a', 'loan_flexi_b'],
  selectedProductForModal: null,
  activeDocumentId: 'DOC_LOAN_TRAP_A',
  selectedAttributeKey: 'prepayment_penalty'
};

// Application Bootstrapper
document.addEventListener('DOMContentLoaded', () => {
  initEventListeners();
  loadScenario('SCENARIO_1');
});

function initEventListeners() {
  // Scenario Switcher Buttons
  document.querySelectorAll('.scenario-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const scenarioId = e.currentTarget.dataset.scenario;
      loadScenario(scenarioId);
    });
  });

  // Slider Inputs for Household Balance Sheet
  const sliders = [
    { id: 'input-income', prop: 'income', display: 'val-income', fmt: formatINR },
    { id: 'input-expenses', prop: 'expenses', display: 'val-expenses', fmt: formatINR },
    { id: 'input-debt-emi', prop: 'existing_debt_emi', display: 'val-debt-emi', fmt: formatINR },
    { id: 'input-savings', prop: 'current_savings', display: 'val-savings', fmt: formatINR },
    { id: 'input-horizon', prop: 'target_horizon_months', display: 'val-horizon', fmt: (v) => `${v} Months (${(v/12).toFixed(1)}y)` }
  ];

  sliders.forEach(s => {
    const el = document.getElementById(s.id);
    if (!el) return;
    el.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      state.profile[s.prop] = val;
      document.getElementById(s.display).textContent = s.fmt(val);
      state.activeScenario = 'CUSTOM';
      highlightActiveScenarioButton('CUSTOM');
      triggerEvaluation();
    });
  });

  // Risk Tolerance Selector
  const riskSelect = document.getElementById('select-risk');
  if (riskSelect) {
    riskSelect.addEventListener('change', (e) => {
      state.profile.risk_tolerance = e.target.value;
      state.activeScenario = 'CUSTOM';
      highlightActiveScenarioButton('CUSTOM');
      triggerEvaluation();
    });
  }

  // Category Filter Tabs
  document.querySelectorAll('.category-tab').forEach(tab => {
    tab.addEventListener('click', (e) => {
      document.querySelectorAll('.category-tab').forEach(t => {
        t.classList.remove('bg-blue-600', 'text-white');
        t.classList.add('bg-gray-800', 'text-gray-300');
      });
      e.currentTarget.classList.add('bg-blue-600', 'text-white');
      e.currentTarget.classList.remove('bg-gray-800', 'text-gray-300');
      state.categoryFilter = e.currentTarget.dataset.category;
      triggerEvaluation();
    });
  });

  // Explain Modal Handlers
  document.getElementById('modal-close-btn')?.addEventListener('click', closeModal);
  document.getElementById('modal-backdrop')?.addEventListener('click', closeModal);

  // Comparison Modal Handlers
  document.getElementById('compare-modal-close-btn')?.addEventListener('click', closeCompareModal);
  document.getElementById('compare-modal-backdrop')?.addEventListener('click', closeCompareModal);
  document.getElementById('open-comparison-btn')?.addEventListener('click', openComparisonModal);

  // Document Auditor Modal Handlers
  const openDocBtn = document.getElementById('open-doc-auditor-btn');
  const sidebarDocBtn = document.getElementById('sidebar-doc-auditor-btn');
  const closeDocBtn = document.getElementById('document-modal-close-btn');
  const docBackdrop = document.getElementById('document-modal-backdrop');

  openDocBtn?.addEventListener('click', () => openDocumentModal());
  sidebarDocBtn?.addEventListener('click', () => openDocumentModal());
  closeDocBtn?.addEventListener('click', closeDocumentModal);
  docBackdrop?.addEventListener('click', closeDocumentModal);

  // Demo Document Preset Buttons
  document.querySelectorAll('.doc-preset-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const docId = e.currentTarget.dataset.docId;
      loadDocument(docId);
    });
  });

  // File Upload Drag & Drop Handlers
  const dropzone = document.getElementById('doc-dropzone');
  const fileInput = document.getElementById('doc-file-input');

  dropzone?.addEventListener('click', () => fileInput?.click());

  dropzone?.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.classList.add('dragover');
  });

  dropzone?.addEventListener('dragleave', () => {
    dropzone.classList.remove('dragover');
  });

  dropzone?.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.classList.remove('dragover');
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleCustomFileUpload(e.dataTransfer.files[0]);
    }
  });

  fileInput?.addEventListener('change', (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleCustomFileUpload(e.target.files[0]);
    }
  });
}

function loadScenario(scenarioId) {
  const sc = SCENARIO_PRESETS[scenarioId];
  if (!sc) return;

  state.activeScenario = scenarioId;
  state.profile = { ...sc.profile };
  state.categoryFilter = sc.categoryFilter;
  state.comparisonSelection = [...sc.comparison];
  if (sc.docId) state.activeDocumentId = sc.docId;

  // Update slider UI values
  document.getElementById('input-income').value = state.profile.income;
  document.getElementById('val-income').textContent = formatINR(state.profile.income);

  document.getElementById('input-expenses').value = state.profile.expenses;
  document.getElementById('val-expenses').textContent = formatINR(state.profile.expenses);

  document.getElementById('input-debt-emi').value = state.profile.existing_debt_emi;
  document.getElementById('val-debt-emi').textContent = formatINR(state.profile.existing_debt_emi);

  document.getElementById('input-savings').value = state.profile.current_savings;
  document.getElementById('val-savings').textContent = formatINR(state.profile.current_savings);

  document.getElementById('input-horizon').value = state.profile.target_horizon_months;
  document.getElementById('val-horizon').textContent = `${state.profile.target_horizon_months} Months (${(state.profile.target_horizon_months/12).toFixed(1)}y)`;

  const riskSelect = document.getElementById('select-risk');
  if (riskSelect) riskSelect.value = state.profile.risk_tolerance;

  // Update Scenario Banner description
  const bannerDesc = document.getElementById('scenario-description');
  if (bannerDesc) bannerDesc.textContent = sc.description;
  const bannerTitle = document.getElementById('scenario-title');
  if (bannerTitle) bannerTitle.textContent = sc.name;

  // Highlight active button
  highlightActiveScenarioButton(scenarioId);

  // Trigger evaluation
  triggerEvaluation();
}

function highlightActiveScenarioButton(scenarioId) {
  document.querySelectorAll('.scenario-btn').forEach(btn => {
    if (btn.dataset.scenario === scenarioId) {
      btn.className = 'scenario-btn text-left p-2 rounded-lg border border-blue-500 bg-blue-950/40 text-blue-400 text-xs transition-all';
    } else {
      btn.className = 'scenario-btn text-left p-2 rounded-lg border border-gray-800 bg-gray-900 text-gray-400 text-xs transition-all hover:border-gray-700';
    }
  });
}

async function triggerEvaluation() {
  const fbsi = calculateClientFBSI(state.profile);
  state.fbsi = fbsi;
  renderFBSI(fbsi);

  // Attempt backend API fetch
  try {
    const res = await fetch('/api/evaluate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        profile: state.profile,
        category: state.categoryFilter === 'ALL' ? null : state.categoryFilter
      })
    });

    if (res.ok) {
      const data = await res.json();
      state.evaluations = data.results;
      renderLeaderboard(data.results);
      return;
    }
  } catch (err) {
    console.warn('Backend API offline, utilizing client-side evaluation fallback', err);
  }

  // Fallback client-side evaluation if backend is not responding
  renderLeaderboardFallback();
}
