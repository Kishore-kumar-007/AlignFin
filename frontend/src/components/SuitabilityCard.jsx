import React from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  AlertOctagon, 
  ArrowUpRight, 
  ChevronRight, 
  Scale, 
  Info, 
  Lock, 
  Clock, 
  Percent, 
  ShieldCheck 
} from 'lucide-react';

export default function SuitabilityCard({ 
  result, 
  isSelectedForCompare, 
  onToggleCompare, 
  onOpenExplain 
}) {
  const prod = result.product;
  const score = result.suitability_score;
  const isTopFit = result.rank === 1;

  const getScoreColor = (s) => {
    if (s >= 80) return { text: 'text-indigo-600', border: 'border-indigo-600', bg: 'bg-indigo-50', glow: 'glow-emerald' };
    if (s >= 65) return { text: 'text-teal-400', border: 'border-teal-500', bg: 'bg-teal-500/10', glow: '' };
    if (s >= 50) return { text: 'text-yellow-700', border: 'border-amber-500', bg: 'bg-yellow-50', glow: 'glow-amber' };
    return { text: 'text-red-600', border: 'border-red-600', bg: 'bg-red-50', glow: 'glow-rose' };
  };

  const getTierBadge = (tier) => {
    switch (tier) {
      case 'Excellent Match':
        return <span className="px-2 py-0.5 rounded-full text-sm font-extrabold uppercase bg-indigo-100 text-indigo-700 border border-indigo-200">✓ EXCELLENT FIT</span>;
      case 'Good Fit':
        return <span className="px-2 py-0.5 rounded-full text-sm font-extrabold uppercase bg-teal-500/20 text-teal-300 border border-teal-500/40">✓ GOOD FIT</span>;
      case 'Moderate Fit':
        return <span className="px-2 py-0.5 rounded-full text-sm font-extrabold uppercase bg-yellow-50 text-yellow-800 border border-amber-500/40">MODERATE FIT</span>;
      case 'Caution / Conflict':
      case 'Unsuitable':
      default:
        return <span className="px-2 py-0.5 rounded-full text-sm font-extrabold uppercase bg-red-50 text-red-700 border border-red-200">⚠ CAUTION / CONFLICT</span>;
    }
  };

  const scoreTheme = getScoreColor(score);

  return (
    <div className={`bg-white border border-gray-200 rounded-xl shadow-sm rounded-2xl p-5 border transition-all duration-200 relative overflow-hidden ${
      isTopFit ? 'border-indigo-600/60 ring-1 ring-emerald-500/40 shadow-xl' : 'border-gray-200 hover:border-gray-200'
    } ${isSelectedForCompare ? 'ring-2 ring-emerald-400' : ''}`}>
      
      {/* Top Banner Tag if Top Fit or Trapped */}
      {prod.badge && (
        <div className={`absolute top-0 right-0 px-3 py-0.5 text-[9px] uppercase tracking-wider font-extrabold rounded-bl-xl border-l border-b ${
          prod.badge.includes('Trap') || prod.badge.includes('Warning') || prod.badge.includes('High Cost')
            ? 'bg-rose-950/90 text-red-700 border-rose-800/80'
            : 'bg-emerald-950/90 text-indigo-700 border-emerald-800/80'
        }`}>
          {prod.badge}
        </div>
      )}


      {/* Not Recommended Banner */}
      {!result.is_recommended && (
        <div className="bg-red-50 border border-red-200 text-red-800 p-3 mb-3 rounded-lg flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5 text-red-600" />
          <div>
            <h4 className="font-bold text-sm uppercase">Not Recommended</h4>
            <p className="text-sm mt-1">This product significantly conflicts with your stated financial goal or risk capacity. Consider products with terms more aligned to your situation.</p>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">

        {/* Left Info */}
        <div className="space-y-1.5 flex-1 pr-4">

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-mono font-bold text-gray-600">#{result.rank}</span>
            <span className="text-sm font-semibold text-gray-600">{prod.provider}</span>
            <span className="text-sm text-gray-500">| Source: {prod.source || 'Provider product document'}</span>
            <span className="text-xs text-gray-400">({prod.last_updated || 'Not specified'})</span>
            {getTierBadge(result.fit_tier)}
          </div>


          <h3 className="text-base font-bold text-gray-900 tracking-tight flex items-center gap-2">
            {prod.name}
          </h3>

          {/* Headline vs Secondary Details */}
          <div className="flex flex-wrap items-center gap-4 pt-1 pb-2">
            <div>
              <span className="text-sm uppercase font-bold text-gray-600 block">Advertised Headline</span>
              <span className="text-sm font-extrabold text-gray-900">{prod.headline_label}</span>
            </div>

            {prod.category === 'loan' && (
              <>
                <div>
                  <span className="text-sm uppercase font-bold text-gray-600 block">Upfront Fee</span>
                  <span className={`text-sm font-bold ${result.secondary_cost_impact.upfront_fee > 3000 ? 'text-red-600' : 'text-gray-700'}`}>
                    ₹{result.secondary_cost_impact.upfront_fee?.toLocaleString('en-IN')}
                  </span>
                </div>
                <div>
                  <span className="text-sm uppercase font-bold text-gray-600 block">Prepayment Fee</span>
                  <span className={`text-sm font-bold ${prod.prepayment_penalty_pct > 0 ? 'text-red-600' : 'text-indigo-600'}`}>
                    {prod.prepayment_penalty_pct}%
                  </span>
                </div>
              </>
            )}

            {prod.category === 'investment' && (
              <>
                <div>
                  <span className="text-sm uppercase font-bold text-gray-600 block">Annual Expense</span>
                  <span className="text-sm font-bold text-gray-700">{prod.expense_ratio_pct}% p.a.</span>
                </div>
                <div>
                  <span className="text-sm uppercase font-bold text-gray-600 block">Lock-In</span>
                  <span className={`text-sm font-bold ${prod.lock_in_months > 0 ? 'text-yellow-700' : 'text-indigo-600'}`}>
                    {prod.lock_in_months} Mo
                  </span>
                </div>
              </>
            )}

            {prod.category === 'savings' && (
              <>
                <div>
                  <span className="text-sm uppercase font-bold text-gray-600 block">Liquidity</span>
                  <span className="text-sm font-bold text-indigo-600 uppercase">{prod.liquidity_rating}</span>
                </div>
                <div>
                  <span className="text-sm uppercase font-bold text-gray-600 block">Penalty for withdrawing early</span>
                  <span className={`text-sm font-bold ${prod.prepayment_penalty_pct > 0 ? 'text-yellow-700' : 'text-indigo-600'}`}>
                    {prod.prepayment_penalty_pct}%
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right: Suitability Score Gauge */}
        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 shrink-0">
          <div className="text-right">
            <span className="text-sm uppercase tracking-wider font-extrabold text-gray-600 block">
              Suitability Score
            </span>
            <div className="flex items-baseline justify-end gap-1">
              <span className={`text-3xl font-black font-mono tracking-tight ${scoreTheme.text}`}>
                {score.toFixed(0)}
              </span>
              <span className="text-sm text-gray-600 font-bold">/100</span>
            </div>
          </div>
          
          <div className={`w-28 h-2 rounded-full bg-gray-100 overflow-hidden`}>
            <div 
              className={`h-full rounded-full ${
                score >= 80 ? 'bg-indigo-600 text-white' : score >= 60 ? 'bg-teal-500' : score >= 45 ? 'bg-yellow-600 text-white' : 'bg-red-600 text-white'
              }`}
              style={{ width: `${score}%` }}
            />
          </div>
        </div>
      </div>


      {/* Structured Pros & Constraints Chips */}
      <div className="pt-3 pb-3 space-y-1.5 border-t border-gray-200/60 my-2">
        <h4 className="text-sm font-bold text-gray-900 mb-2">Why this may fit you</h4>
        {result.pros.map((pro, i) => (

          <div key={i} className="flex items-start gap-2 text-sm text-gray-700">
            <CheckCircle2 className="h-3.5 w-3.5 text-indigo-600 shrink-0 mt-0.5" />
            <span className="leading-tight">{pro}</span>
          </div>
        ))}
        {result.penalties.map((pen, i) => (
          <div key={i} className="flex items-start gap-2 text-sm text-red-700/90 font-medium">
            <AlertTriangle className="h-3.5 w-3.5 text-red-600 shrink-0 mt-0.5" />
            <span className="leading-tight">{pen.reason} (-{pen.penalty_points} pts)</span>
          </div>
        ))}
      </div>


      {/* Scenarios & Explanations */}
      {result.scenarios && Object.keys(result.scenarios).length > 0 && (
        <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <h4 className="text-sm font-bold text-gray-900 mb-2">Illustrative Scenarios</h4>
          <p className="text-xs text-gray-500 mb-3">Illustrative scenario based on the assumptions shown. Not guaranteed.</p>
          
          <div className="grid grid-cols-3 gap-2 mb-3">
            {Object.entries(result.scenarios).map(([key, val]) => (
              <div key={key} className="bg-white p-2 border border-gray-200 rounded text-center">
                <div className="text-xs text-gray-500 font-semibold">{key}</div>
                <div className="text-sm font-bold text-gray-900">{val}</div>
              </div>
            ))}
          </div>
          
          <div className="flex flex-col gap-1 mt-2">
            {result.inflation_adjusted_base && (
              <div className="text-xs font-semibold text-gray-700 flex justify-between">
                <span>Estimated purchasing power (inflation-adjusted):</span>
                <span className="text-indigo-600">{result.inflation_adjusted_base}</span>
              </div>
            )}
            {result.tax_outcome && (
              <div className="text-xs font-semibold text-gray-700 flex justify-between mt-1">
                <span>Tax impact:</span>
                <span className="text-gray-900">{result.tax_outcome}</span>
              </div>
            )}
            
            {result.assumptions && result.assumptions.length > 0 && (
              <details className="mt-3">
                <summary className="text-xs font-bold text-indigo-600 cursor-pointer">View Assumptions</summary>
                <ul className="list-disc pl-4 mt-2 text-xs text-gray-600 space-y-1">
                  {result.assumptions.map((a, i) => <li key={i}>{a}</li>)}
                </ul>
              </details>
            )}
          </div>
        </div>
      )}

      {/* Action Footer */}

      <div className="flex items-center justify-between pt-2 border-t border-gray-200/60">
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={isSelectedForCompare}
            onChange={() => onToggleCompare(prod.id)}
            className="rounded bg-gray-100 border-gray-200 text-emerald-500 focus:ring-emerald-400 accent-emerald-500 cursor-pointer h-4 w-4"
          />
          <span>Select to Compare</span>
        </label>

        <button
          onClick={() => onOpenExplain(result)}
          className="flex items-center gap-1 text-sm font-bold text-indigo-600 hover:text-indigo-700 hover:underline transition"
        >
          <span>Why this score?</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
