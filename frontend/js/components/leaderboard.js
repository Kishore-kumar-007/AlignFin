/**
 * AlignFin Leaderboard & Product Cards Component
 */

function renderFBSI(fbsi) {
  document.getElementById('fbsi-score').textContent = fbsi.fbsi_score;
  const tierEl = document.getElementById('fbsi-tier');
  tierEl.textContent = `${fbsi.capacity_tier} CAPACITY`;

  if (fbsi.capacity_tier === 'HIGH') {
    tierEl.className = 'px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-500/40';
  } else if (fbsi.capacity_tier === 'MODERATE') {
    tierEl.className = 'px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-950/60 text-amber-400 border border-amber-500/40';
  } else {
    tierEl.className = 'px-2.5 py-1 text-xs font-semibold rounded-full bg-rose-950/60 text-rose-400 border border-rose-500/40';
  }

  document.getElementById('stat-surplus').textContent = formatINR(fbsi.monthly_surplus);
  document.getElementById('stat-surplus-ratio').textContent = `${fbsi.surplus_ratio}% of income`;

  document.getElementById('stat-runway').textContent = `${fbsi.emergency_runway_months} Months`;
  const runwayBar = document.getElementById('bar-runway');
  if (runwayBar) {
    const pct = Math.min(100, (fbsi.emergency_runway_months / 6.0) * 100);
    runwayBar.style.width = `${pct}%`;
    runwayBar.className = fbsi.emergency_runway_months < 3 ? 'h-2 rounded-full bg-rose-500' : 'h-2 rounded-full bg-emerald-500';
  }

  document.getElementById('stat-dti').textContent = `${fbsi.dti_ratio}%`;

  const mismatchBanner = document.getElementById('risk-mismatch-banner');
  if (mismatchBanner) {
    if (fbsi.risk_mismatch_warning) {
      mismatchBanner.classList.remove('hidden');
    } else {
      mismatchBanner.classList.add('hidden');
    }
  }
}

function renderLeaderboard(evaluations) {
  const container = document.getElementById('products-leaderboard');
  if (!container) return;
  container.innerHTML = '';

  if (!evaluations || evaluations.length === 0) {
    container.innerHTML = `<div class="p-8 text-center text-gray-500">No products found for selected category.</div>`;
    return;
  }

  evaluations.forEach((item, index) => {
    const card = createProductCard(item, index + 1);
    container.appendChild(card);
  });
}

function createProductCard(item, rank) {
  const div = document.createElement('div');
  div.className = 'glass-panel rounded-xl p-5 border border-gray-800 hover:border-gray-700 transition-all hover:shadow-lg relative';

  const isLoan = item.category === 'LOAN';
  const isInv = item.category === 'INVESTMENT';
  const isSav = item.category === 'SAVINGS';

  let scoreColorClass = 'text-emerald-400 border-emerald-500/40 bg-emerald-950/20';
  if (item.suitability_score < 50) {
    scoreColorClass = 'text-rose-400 border-rose-500/40 bg-rose-950/20';
  } else if (item.suitability_score < 75) {
    scoreColorClass = 'text-amber-400 border-amber-500/40 bg-amber-950/20';
  }

  // Key metric labels
  let primaryRateLabel = '';
  let secondaryMetricLabel = '';
  let secondaryMetricValue = '';

  if (isLoan) {
    primaryRateLabel = `${item.metrics?.headline_rate || 8.5}% Advertised APR`;
    secondaryMetricLabel = 'Total Cost of Borrowing';
    secondaryMetricValue = formatINR(item.metrics?.tcob || 76072);
  } else if (isInv) {
    primaryRateLabel = `${item.metrics?.expected_cagr || 12}% Expected CAGR`;
    secondaryMetricLabel = 'Volatility / Risk';
    secondaryMetricValue = `${item.metrics?.volatility_pct || 14}% Volatility`;
  } else {
    primaryRateLabel = `${item.metrics?.effective_yield || 6.8}% Realized Yield`;
    secondaryMetricLabel = 'Lock-in Commitment';
    secondaryMetricValue = `${item.metrics?.product_lock_in_months || 0} Months`;
  }

  // Badges
  let alertBadges = '';
  if (item.headline_trap_detected) {
    alertBadges += `
      <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30">
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
        Headline Rate Trap (-24 pts)
      </span>`;
  }
  if (item.risk_mismatch_detected) {
    alertBadges += `
      <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-orange-500/10 text-orange-400 border border-orange-500/30">
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        Risk Mismatch Penalty (-32 pts)
      </span>`;
  }
  if (item.penalties?.some(p => p.code === 'PREMATURE_WITHDRAWAL_DRAG')) {
    alertBadges += `
      <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        Premature Breakage Drag
      </span>`;
  }

  div.innerHTML = `
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <!-- Left: Rank, Name, Institution, Badges -->
      <div class="flex items-start gap-3.5">
        <div class="w-8 h-8 rounded-lg bg-gray-800 text-gray-400 flex items-center justify-center font-bold text-sm border border-gray-700">
          #${rank}
        </div>
        <div>
          <div class="flex items-center gap-2 flex-wrap">
            <h3 class="font-semibold text-base text-gray-100">${item.product_name}</h3>
            <span class="text-xs px-2 py-0.5 rounded bg-gray-800 text-gray-400 font-medium">${item.institution}</span>
          </div>
          <div class="flex items-center gap-2 mt-2 flex-wrap">
            ${alertBadges}
            <span class="text-xs text-gray-400">${item.pros?.[0] || ''}</span>
          </div>
        </div>
      </div>

      <!-- Right: Financial metrics & Score -->
      <div class="flex items-center gap-4 justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-gray-800">
        <div class="text-right">
          <div class="text-xs text-gray-400">${secondaryMetricLabel}</div>
          <div class="text-sm font-semibold text-gray-200">${secondaryMetricValue}</div>
          <div class="text-xs text-blue-400 font-medium mt-0.5">${primaryRateLabel}</div>
        </div>

        <div class="flex flex-col items-center">
          <div class="w-14 h-14 rounded-full border-2 ${scoreColorClass} flex flex-col items-center justify-center">
            <span class="text-base font-bold leading-tight">${item.suitability_score}</span>
            <span class="text-[9px] uppercase tracking-wider font-semibold opacity-80">Score</span>
          </div>
        </div>

        <div class="flex flex-col gap-1.5 min-w-[100px]">
          <button class="audit-btn px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 transition-colors flex items-center justify-center gap-1" data-id="${item.product_id}">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
            Audit Evidence
          </button>
          <button class="explain-btn px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 transition-colors" data-id="${item.product_id}">
            Explain Why
          </button>
          <button class="compare-btn px-3 py-1.5 text-xs font-semibold rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700 transition-colors" data-id="${item.product_id}">
            Compare
          </button>
        </div>
      </div>
    </div>
  `;

  // Attach button events
  div.querySelector('.audit-btn')?.addEventListener('click', () => {
    if (item.product_id === 'loan_trap_a') {
      openDocumentModal('DOC_LOAN_TRAP_A');
    } else if (item.product_id === 'loan_flexi_b') {
      openDocumentModal('DOC_LOAN_FLEXI_B');
    } else if (item.product_id.includes('sbi') || item.product_id.includes('loan')) {
      openDocumentModal('DOC_LOAN_UNDISCLOSED');
    } else {
      openDocumentModal('DOC_INSURANCE_STAR');
    }
  });

  div.querySelector('.explain-btn')?.addEventListener('click', () => {
    openExplainModal(item);
  });

  div.querySelector('.compare-btn')?.addEventListener('click', () => {
    toggleCompareSelection(item.product_id);
  });

  return div;
}

function renderLeaderboardFallback() {
  const sampleEvaluations = [
    {
      product_id: 'loan_flexi_b',
      product_name: 'FlexiClear Transparent Loan (Loan B)',
      institution: 'ClearFin Capital',
      category: 'LOAN',
      suitability_score: 84.0,
      rank: 1,
      suitability_tier: 'HIGHLY_SUITABLE',
      headline_trap_detected: false,
      risk_mismatch_detected: false,
      pros: ['Zero Prepayment Penalty', 'Flat ₹2,000 Processing Fee', 'Saves ₹52,690 in TCOB over 3 years'],
      cons: ['Headline rate is 9.2% (higher than 8.5% advertised loans)'],
      metrics: {
        headline_rate: 9.2,
        tcob: 76072,
        upfront_fee: 2000,
        prepayment_penalty_amount: 0
      },
      dimensions: [
        { name: 'Affordability & Debt Stress', raw_score: 90, weight: 0.25, weighted_score: 22.5, description: 'EMI ₹15,946 comfortably within Arjun surplus (₹40,000)' },
        { name: 'Horizon & Term Alignment', raw_score: 95, weight: 0.25, weighted_score: 23.8, description: '36-month commitment matches Arjun 3-year planned payoff' },
        { name: 'Cost Efficiency (TCOB)', raw_score: 88, weight: 0.25, weighted_score: 22.0, description: 'Zero prepayment penalty eliminates exit drag' },
        { name: 'Product Constraints & Freedom', raw_score: 92, weight: 0.15, weighted_score: 13.8, description: 'Full freedom for part-payment from Day 1' },
        { name: 'Risk & Solvency Cushion', raw_score: 80, weight: 0.10, weighted_score: 8.0, description: 'Buffer remains safe (>3.0m runway)' }
      ],
      penalties: [],
      reasoning_trace: 'Score = Affordability(22.5) + Horizon(23.8) + Cost(22.0) + Freedom(13.8) + Solvency(8.0) - Penalties(0.0) = 84.0',
      narrative: 'Loan B achieves the highest suitability score because its terms perfectly align with Arjun\'s plan to prepay in 3 years. Zero foreclosure fees and modest processing charges save ₹52,690 over Loan A.'
    },
    {
      product_id: 'loan_trap_a',
      product_name: 'Apex Easy Personal Loan (Loan A)',
      institution: 'Apex Bank',
      category: 'LOAN',
      suitability_score: 24.0,
      rank: 2,
      suitability_tier: 'NOT_RECOMMENDED',
      headline_trap_detected: true,
      risk_mismatch_detected: false,
      pros: ['Lowest advertised headline rate of 8.5% APR'],
      cons: ['Heavy 4.5% prepayment penalty on outstanding principal', '₹8,000 upfront processing fee', '7-year forced amortization tenure'],
      metrics: {
        headline_rate: 8.5,
        tcob: 128762,
        upfront_fee: 8000,
        prepayment_penalty_amount: 14651
      },
      dimensions: [
        { name: 'Affordability & Debt Stress', raw_score: 75, weight: 0.25, weighted_score: 18.8, description: 'Lower initial EMI, but longer interest duration' },
        { name: 'Horizon & Term Alignment', raw_score: 20, weight: 0.25, weighted_score: 5.0, description: '84-month tenure severely mismatched with Arjun 36-month horizon' },
        { name: 'Cost Efficiency (TCOB)', raw_score: 15, weight: 0.25, weighted_score: 3.8, description: '₹8,000 fee + ₹14,651 exit penalty inflates borrowing cost to ₹1,28,762' },
        { name: 'Product Constraints & Freedom', raw_score: 30, weight: 0.15, weighted_score: 4.5, description: 'Part-prepayment locked for 24 months' },
        { name: 'Risk & Solvency Cushion', raw_score: 70, weight: 0.10, weighted_score: 7.0, description: 'Moderate solvency buffer' }
      ],
      penalties: [
        { code: 'HEADLINE_RATE_TRAP', title: 'Severe Prepayment Trap Penalty', penalty_points: 24.0, severity: 'CRITICAL', reason: 'Prepaying after 36 months triggers ₹14,651 exit penalty, negating all interest savings.' }
      ],
      reasoning_trace: 'Score = Affordability(18.8) + Horizon(5.0) + Cost(3.8) + Freedom(4.5) + Solvency(7.0) - HeadlineTrap(24.0) = 24.0',
      narrative: 'Loan A is a classic Headline Rate Trap. Despite advertising 8.5%, its 4.5% foreclosure fee and ₹8,000 processing cost make it ₹52,690 more expensive than Loan B over a 3-year repayment timeline.'
    }
  ];

  renderLeaderboard(sampleEvaluations);
}
