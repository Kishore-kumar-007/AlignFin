/**
 * AlignFin Document Evidence & Suitability Auditor Component
 */

function openDocumentModal(docId = null) {
  const targetDocId = docId || state.activeDocumentId || 'DOC_LOAN_TRAP_A';
  loadDocument(targetDocId);
  document.getElementById('document-modal').classList.remove('hidden');
}

function closeDocumentModal() {
  document.getElementById('document-modal').classList.add('hidden');
}

function loadDocument(docId) {
  const doc = DOCUMENTS_DATABASE[docId];
  if (!doc) return;

  state.activeDocumentId = docId;

  // Highlight active preset button
  document.querySelectorAll('.doc-preset-btn').forEach(btn => {
    if (btn.dataset.docId === docId) {
      btn.classList.add('ring-2', 'ring-blue-500', 'ring-offset-1', 'ring-offset-gray-900');
    } else {
      btn.classList.remove('ring-2', 'ring-blue-500', 'ring-offset-1', 'ring-offset-gray-900');
    }
  });

  // Update file info display
  const fileInfo = document.getElementById('selected-file-info');
  if (fileInfo) {
    fileInfo.classList.remove('hidden');
    fileInfo.innerHTML = `
      <div class="flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
        <span class="font-bold text-white">${doc.fileName}</span>
        <span class="text-gray-400">(${doc.fileSize} • ${doc.pagesCount} pages)</span>
      </div>
    `;
  }

  // Update Suitability Verdict card
  document.getElementById('doc-contract-name').textContent = doc.title;
  const tierEl = document.getElementById('doc-suitability-tier');
  tierEl.textContent = doc.suitabilityVerdict.tier;
  tierEl.className = `px-2 py-0.5 text-[10px] font-bold rounded border ${doc.suitabilityVerdict.colorClass}`;

  document.getElementById('doc-verdict-narrative').textContent = doc.suitabilityVerdict.narrative;
  document.getElementById('doc-stat-rate').textContent = doc.suitabilityVerdict.headline;
  document.getElementById('doc-stat-penalty').textContent = doc.suitabilityVerdict.penalty;
  document.getElementById('doc-stat-fee').textContent = doc.suitabilityVerdict.fee;

  // Calculate Evidence Coverage
  const totalAttrs = doc.attributes.length;
  const verifiedAttrs = doc.attributes.filter(a => a.status === 'FOUND').length;
  const coveragePct = Number(((verifiedAttrs / totalAttrs) * 100).toFixed(1));

  document.getElementById('coverage-percentage').textContent = `${coveragePct}%`;
  document.getElementById('coverage-ratio').textContent = `${verifiedAttrs} of ${totalAttrs} attributes verified`;

  const bar = document.getElementById('coverage-bar');
  bar.style.width = `${coveragePct}%`;
  const tag = document.getElementById('coverage-status-tag');

  if (coveragePct >= 90) {
    bar.className = 'h-2.5 rounded-full bg-emerald-500 transition-all duration-500';
    tag.textContent = 'HIGH COMPLETENESS';
    tag.className = 'px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30';
  } else if (coveragePct >= 75) {
    bar.className = 'h-2.5 rounded-full bg-blue-500 transition-all duration-500';
    tag.textContent = 'ADEQUATE DISCLOSURE';
    tag.className = 'px-2 py-0.5 text-[10px] font-bold rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30';
  } else {
    bar.className = 'h-2.5 rounded-full bg-amber-500 transition-all duration-500';
    tag.textContent = 'DISCLOSURE GAPS DETECTED';
    tag.className = 'px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30';
  }

  // Render Extracted Information Table
  renderExtractedAttributesTable(doc);

  // Render Provider Verification Checklist
  renderVerificationChecklist(doc);

  // Set default inspected attribute
  const defaultAttr = doc.attributes.find(a => a.key === 'prepayment_penalty') || doc.attributes[0];
  inspectAttribute(defaultAttr);
}

function renderExtractedAttributesTable(doc) {
  const tbody = document.getElementById('extracted-attributes-tbody');
  if (!tbody) return;
  tbody.innerHTML = '';

  doc.attributes.forEach((attr) => {
    const tr = document.createElement('tr');
    tr.className = 'hover:bg-gray-900/80 cursor-pointer transition-colors attribute-row';
    tr.dataset.key = attr.key;

    let badgeClass = 'badge-found';
    let badgeLabel = 'FOUND';

    if (attr.status === 'NOT_FOUND') {
      badgeClass = 'badge-not-found';
      badgeLabel = 'NOT FOUND';
    } else if (attr.status === 'AMBIGUOUS') {
      badgeClass = 'badge-ambiguous';
      badgeLabel = 'AMBIGUOUS';
    }

    tr.innerHTML = `
      <td class="px-3.5 py-3 font-semibold text-gray-200">
        <div>${attr.name}</div>
        <div class="text-[10px] text-gray-500 font-normal">${attr.category}</div>
      </td>
      <td class="px-3.5 py-3 font-mono ${attr.status === 'NOT_FOUND' ? 'text-amber-400 italic' : 'text-gray-100'}">
        ${attr.value}
      </td>
      <td class="px-3.5 py-3">
        <span class="px-2 py-0.5 text-[10px] font-bold rounded ${badgeClass}">
          ${badgeLabel}
        </span>
      </td>
      <td class="px-3.5 py-3 text-[11px] text-gray-400">
        ${attr.location}
      </td>
      <td class="px-3.5 py-3 text-right">
        <button class="inspect-btn px-2.5 py-1 text-[10px] font-bold rounded bg-gray-800 hover:bg-blue-600 text-gray-300 hover:text-white transition-colors">
          Inspect Citation
        </button>
      </td>
    `;

    tr.addEventListener('click', () => {
      document.querySelectorAll('.attribute-row').forEach(r => r.classList.remove('bg-blue-950/40', 'border-l-2', 'border-blue-500'));
      tr.classList.add('bg-blue-950/40', 'border-l-2', 'border-blue-500');
      inspectAttribute(attr);
    });

    tbody.appendChild(tr);
  });
}

function inspectAttribute(attr) {
  if (!attr) return;
  state.selectedAttributeKey = attr.key;

  document.getElementById('inspect-attribute-title').textContent = attr.name;

  const badgeEl = document.getElementById('inspect-status-badge');
  badgeEl.textContent = attr.status;

  if (attr.status === 'FOUND') {
    badgeEl.className = 'px-2 py-0.5 text-[10px] font-bold rounded badge-found';
  } else if (attr.status === 'NOT_FOUND') {
    badgeEl.className = 'px-2 py-0.5 text-[10px] font-bold rounded badge-not-found';
  } else {
    badgeEl.className = 'px-2 py-0.5 text-[10px] font-bold rounded badge-ambiguous';
  }

  document.getElementById('inspect-value').textContent = attr.value;
  document.getElementById('inspect-location').textContent = attr.location;
  document.getElementById('inspect-quote').textContent = `"${attr.quote}"`;
  document.getElementById('inspect-note').textContent = attr.note;
}

function renderVerificationChecklist(doc) {
  const container = document.getElementById('verification-checklist-container');
  const label = document.getElementById('missing-count-label');
  if (!container) return;

  const missingList = doc.attributes.filter(a => a.status === 'NOT_FOUND' || a.status === 'AMBIGUOUS');
  label.textContent = `${missingList.length} Attributes Require Direct Clarification`;

  container.innerHTML = '';

  if (missingList.length === 0) {
    container.innerHTML = `
      <div class="p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
        <svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
        <span>All 16 mandatory contractual attributes are verified with page & section citations in this document. Zero disclosure omissions detected.</span>
      </div>
    `;
    return;
  }

  missingList.forEach(item => {
    const box = document.createElement('div');
    box.className = 'p-3 rounded-lg bg-gray-950/80 border border-amber-500/40 text-xs flex items-start gap-3';
    box.innerHTML = `
      <input type="checkbox" class="mt-0.5 rounded bg-gray-900 border-gray-700 text-amber-500 focus:ring-0">
      <div class="flex-1">
        <div class="font-bold text-amber-300 flex items-center gap-2">
          <span>Clarify ${item.name} with provider</span>
          <span class="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase">Not Disclosed</span>
        </div>
        <p class="text-gray-300 text-[11px] mt-1 leading-relaxed">
          ${item.note}
        </p>
      </div>
    `;
    container.appendChild(box);
  });
}

function handleCustomFileUpload(file) {
  if (!file) return;

  const fileInfo = document.getElementById('selected-file-info');
  fileInfo.classList.remove('hidden');
  fileInfo.innerHTML = `
    <div class="flex items-center gap-2">
      <span class="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
      <span class="font-bold text-white">${file.name}</span>
      <span class="text-gray-400">(${(file.size / (1024 * 1024)).toFixed(2)} MB)</span>
      <span class="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono">Parsed</span>
    </div>
  `;

  // Dynamically map audit profile based on filename
  const isInsurance = file.name.toLowerCase().includes('insurance') || file.name.toLowerCase().includes('health') || file.name.toLowerCase().includes('policy');
  const isFlexi = file.name.toLowerCase().includes('flexi') || file.name.toLowerCase().includes('transparent');

  if (isInsurance) {
    loadDocument('DOC_INSURANCE_STAR');
  } else if (isFlexi) {
    loadDocument('DOC_LOAN_FLEXI_B');
  } else {
    loadDocument('DOC_LOAN_TRAP_A');
  }
}
