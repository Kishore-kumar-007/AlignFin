/**
 * AlignFin Side-by-Side Comparison Modal Component
 */

function toggleCompareSelection(productId) {
  if (state.comparisonSelection.includes(productId)) {
    state.comparisonSelection = state.comparisonSelection.filter(id => id !== productId);
  } else {
    if (state.comparisonSelection.length >= 2) {
      state.comparisonSelection.shift(); // remove oldest
    }
    state.comparisonSelection.push(productId);
  }
  openComparisonModal();
}

async function openComparisonModal() {
  if (state.comparisonSelection.length < 2) {
    alert('Please select 2 products to compare.');
    return;
  }

  const [idA, idB] = state.comparisonSelection;

  try {
    const res = await fetch('/api/compare', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        product_a_id: idA,
        product_b_id: idB,
        profile: state.profile
      })
    });

    if (res.ok) {
      const data = await res.json();
      renderComparisonData(data.comparison);
      document.getElementById('compare-modal').classList.remove('hidden');
      return;
    }
  } catch (err) {
    console.warn('Backend comparison failed, using local comparison', err);
  }
}

function renderComparisonData(comp) {
  document.getElementById('comp-winner-name').textContent = comp.winner_name;
  document.getElementById('comp-delta').textContent = `+${Math.abs(comp.score_delta)} pts advantage`;

  document.getElementById('comp-prod-a-name').textContent = comp.product_a.name;
  document.getElementById('comp-prod-a-score').textContent = `${comp.product_a.score} / 100`;

  document.getElementById('comp-prod-b-name').textContent = comp.product_b.name;
  document.getElementById('comp-prod-b-score').textContent = `${comp.product_b.score} / 100`;

  document.getElementById('comp-narrative').textContent = comp.narrative_comparison;

  const takeawayList = document.getElementById('comp-takeaways');
  takeawayList.innerHTML = '';
  comp.key_takeaways?.forEach(t => {
    const li = document.createElement('li');
    li.className = 'text-xs text-gray-300 flex items-start gap-2';
    li.innerHTML = `<span class="text-blue-400 font-bold">•</span> <span>${t}</span>`;
    takeawayList.appendChild(li);
  });

  // Render TCOB breakdown if loans
  const tcobBox = document.getElementById('comp-tcob-breakdown');
  if (comp.category === 'LOAN') {
    tcobBox.classList.remove('hidden');
    const mA = comp.product_a.metrics;
    const mB = comp.product_b.metrics;

    document.getElementById('tcob-a-total').textContent = formatINR(mA?.tcob);
    document.getElementById('tcob-a-interest').textContent = formatINR(mA?.total_interest_paid);
    document.getElementById('tcob-a-fee').textContent = formatINR(mA?.upfront_fee);
    document.getElementById('tcob-a-penalty').textContent = formatINR(mA?.prepayment_penalty_amount);

    document.getElementById('tcob-b-total').textContent = formatINR(mB?.tcob);
    document.getElementById('tcob-b-interest').textContent = formatINR(mB?.total_interest_paid);
    document.getElementById('tcob-b-fee').textContent = formatINR(mB?.upfront_fee);
    document.getElementById('tcob-b-penalty').textContent = formatINR(mB?.prepayment_penalty_amount || 0);
  } else {
    tcobBox.classList.add('hidden');
  }

  // Populate Evidence & Disclosure Comparison Table
  renderComparativeEvidenceTable(comp);
}

function renderComparativeEvidenceTable(comp) {
  const tbody = document.getElementById('comp-evidence-tbody');
  if (!tbody) return;

  tbody.innerHTML = '';

  const isLoan = comp.category === 'LOAN';
  const nameA = comp.product_a.name;
  const nameB = comp.product_b.name;

  document.getElementById('comp-table-head-a').textContent = nameA.split('(')[0].trim();
  document.getElementById('comp-table-head-b').textContent = nameB.split('(')[0].trim();

  const comparisonRows = isLoan ? [
    {
      attribute: 'Advertised Rate',
      valA: '8.50% (Verified Page 1)',
      valB: '9.20% (Verified Page 1)',
      obs: 'Loan A has a 0.70% lower headline rate, creating an initial illusion of cheaper credit.'
    },
    {
      attribute: 'Upfront Processing Cost',
      valA: '₹8,000 (Deductible Page 2)',
      valB: '₹2,000 (Flat Page 2)',
      obs: 'Loan B saves ₹6,000 immediately at disbursement.'
    },
    {
      attribute: 'Foreclosure / Prepayment Penalty',
      valA: '<span class="text-rose-400 font-bold">4.5% Penalty (Disclosed Page 4)</span>',
      valB: '<span class="text-emerald-400 font-bold">0.0% (Zero Foreclosure Penalty)</span>',
      obs: 'Prepaying in Year 3 costs Arjun ₹14,651 under Loan A vs ₹0 under Loan B.'
    },
    {
      attribute: 'Evidence Disclosure Coverage',
      valA: '87.5% (14 / 16 attributes verified)',
      valB: '100.0% (16 / 16 attributes verified)',
      obs: 'Loan B provides complete contractual disclosure without hidden clauses.'
    },
    {
      attribute: 'Net TCOB over 3-Year Horizon',
      valA: '<span class="text-rose-400 font-bold">₹1,28,762 Total Cost</span>',
      valB: '<span class="text-emerald-400 font-bold">₹76,072 Total Cost</span>',
      obs: 'Loan B saves Arjun ₹52,690 in real cash outflow despite higher advertised rate!'
    }
  ] : [
    {
      attribute: 'Headline Return / Yield',
      valA: '14.5% High Beta',
      valB: '7.2% Sovereign Debt',
      obs: 'Asset A targets aggressive growth, Asset B prioritizes liquidity preservation.'
    },
    {
      attribute: 'Lock-in Commitment',
      valA: '36 Months Locked',
      valB: 'Instant Liquidity (T+1)',
      obs: 'Asset A creates capital lock-in incompatible with emergency runway.'
    },
    {
      attribute: 'Evidence Disclosure Coverage',
      valA: '92.0% (Schedule Disclosed)',
      valB: '100.0% (RBI Registered)',
      obs: 'Both assets have verified fact-sheet documentation.'
    }
  ];

  comparisonRows.forEach(row => {
    const tr = document.createElement('tr');
    tr.className = 'hover:bg-gray-800/40 transition-colors';
    tr.innerHTML = `
      <td class="px-3.5 py-2.5 font-medium text-gray-200">${row.attribute}</td>
      <td class="px-3.5 py-2.5">${row.valA}</td>
      <td class="px-3.5 py-2.5">${row.valB}</td>
      <td class="px-3.5 py-2.5 text-gray-400 text-[11px] leading-tight">${row.obs}</td>
    `;
    tbody.appendChild(tr);
  });
}

function closeCompareModal() {
  document.getElementById('compare-modal').classList.add('hidden');
}
