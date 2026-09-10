/**
 * AlignFin Deep-Dive Explainability Modal Component
 */

function openExplainModal(item) {
  state.selectedProductForModal = item;
  document.getElementById('modal-product-title').textContent = item.product_name;
  document.getElementById('modal-score-badge').textContent = `${item.suitability_score} / 100`;

  // Render reasoning trace
  document.getElementById('modal-trace-text').textContent = item.reasoning_trace;
  document.getElementById('modal-narrative-text').textContent = item.narrative;

  // Render Dimensions
  const dimContainer = document.getElementById('modal-dimensions-list');
  dimContainer.innerHTML = '';
  item.dimensions?.forEach(d => {
    const row = document.createElement('div');
    row.className = 'p-3 rounded-lg bg-gray-900/60 border border-gray-800';
    row.innerHTML = `
      <div class="flex items-center justify-between text-xs mb-1.5">
        <span class="font-medium text-gray-300">${d.name} (Weight: ${(d.weight * 100).toFixed(0)}%)</span>
        <span class="font-bold text-blue-400">${d.raw_score} / 100 → +${d.weighted_score.toFixed(1)} pts</span>
      </div>
      <div class="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden mb-1.5">
        <div class="bg-blue-500 h-1.5 rounded-full" style="width: ${d.raw_score}%"></div>
      </div>
      <div class="text-[11px] text-gray-400">${d.description}</div>
    `;
    dimContainer.appendChild(row);
  });

  // Render Penalties
  const penaltyContainer = document.getElementById('modal-penalties-list');
  penaltyContainer.innerHTML = '';
  if (item.penalties && item.penalties.length > 0) {
    item.penalties.forEach(p => {
      const pRow = document.createElement('div');
      pRow.className = 'p-3 rounded-lg bg-rose-950/30 border border-rose-500/30 text-xs';
      pRow.innerHTML = `
        <div class="flex items-center justify-between font-semibold text-rose-400 mb-1">
          <span>⚠️ ${p.title}</span>
          <span class="bg-rose-900/50 px-2 py-0.5 rounded text-rose-200">-${p.penalty_points} Points</span>
        </div>
        <p class="text-gray-300 text-[11px] leading-relaxed">${p.reason}</p>
      `;
      penaltyContainer.appendChild(pRow);
    });
  } else {
    penaltyContainer.innerHTML = `<div class="text-xs text-emerald-400 bg-emerald-950/20 p-3 rounded-lg border border-emerald-500/20">✅ No suitability penalties applied. Excellent balance sheet alignment!</div>`;
  }

  // Show Modal
  document.getElementById('explain-modal').classList.remove('hidden');
}

function closeModal() {
  document.getElementById('explain-modal').classList.add('hidden');
}
