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
    if (s >= 80) return { text: 'text-emerald-400', border: 'border-emerald-500', bg: 'bg-emerald-500/10', glow: 'glow-emerald' };
    if (s >= 65) return { text: 'text-teal-400', border: 'border-teal-500', bg: 'bg-teal-500/10', glow: '' };
    if (s >= 50) return { text: 'text-amber-400', border: 'border-amber-500', bg: 'bg-amber-500/10', glow: 'glow-amber' };
    return { text: 'text-rose-400', border: 'border-rose-500', bg: 'bg-rose-500/10', glow: 'glow-rose' };
  };

  const getTierBadge = (tier) => {
    switch (tier) {
      case 'Excellent Match':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">✓ EXCELLENT FIT</span>;
      case 'Good Fit':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-teal-500/20 text-teal-300 border border-teal-500/40">✓ GOOD FIT</span>;
      case 'Moderate Fit':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40">MODERATE FIT</span>;
      case 'Caution / Conflict':
      case 'Unsuitable':
      default:
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-rose-500/20 text-rose-300 border border-rose-500/40">⚠ CAUTION / CONFLICT</span>;
    }
  };

  const scoreTheme = getScoreColor(score);

  return (
    <div className={`glass-card rounded-2xl p-5 border transition-all duration-200 relative overflow-hidden ${
      isTopFit ? 'border-emerald-500/60 ring-1 ring-emerald-500/40 shadow-xl' : 'border-slate-800 hover:border-slate-700'
    } ${isSelectedForCompare ? 'ring-2 ring-emerald-400' : ''}`}>
      
      {/* Top Banner Tag if Top Fit or Trapped */}
      {prod.badge && (
        <div className={`absolute top-0 right-0 px-3 py-0.5 text-[9px] uppercase tracking-wider font-extrabold rounded-bl-xl border-l border-b ${
          prod.badge.includes('Trap') || prod.badge.includes('Warning') || prod.badge.includes('High Cost')
            ? 'bg-rose-950/90 text-rose-300 border-rose-800/80'
            : 'bg-emerald-950/90 text-emerald-300 border-emerald-800/80'
        }`}>
          {prod.badge}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        {/* Left Info */}
        <div className="space-y-1.5 flex-1 pr-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono font-bold text-slate-400">#{result.rank}</span>
            <span className="text-xs font-semibold text-slate-400">{prod.provider}</span>
            {getTierBadge(result.fit_tier)}
          </div>

          <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            {prod.name}
          </h3>

          {/* Headline vs Secondary Details */}
          <div className="flex flex-wrap items-center gap-4 pt-1 pb-2">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Advertised Headline</span>
              <span className="text-sm font-extrabold text-slate-100">{prod.headline_label}</span>
            </div>

            {prod.category === 'loan' && (
              <>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Upfront Fee</span>
                  <span className={`text-xs font-bold ${result.secondary_cost_impact.upfront_fee > 3000 ? 'text-rose-400' : 'text-slate-300'}`}>
                    ₹{result.secondary_cost_impact.upfront_fee?.toLocaleString('en-IN')}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Prepayment Fee</span>
                  <span className={`text-xs font-bold ${prod.prepayment_penalty_pct > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {prod.prepayment_penalty_pct}%
                  </span>
                </div>
              </>
            )}

            {prod.category === 'investment' && (
              <>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Annual Expense</span>
                  <span className="text-xs font-bold text-slate-300">{prod.expense_ratio_pct}% p.a.</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Lock-In</span>
                  <span className={`text-xs font-bold ${prod.lock_in_months > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {prod.lock_in_months} Mo
                  </span>
                </div>
              </>
            )}

            {prod.category === 'savings' && (
              <>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Liquidity</span>
                  <span className="text-xs font-bold text-emerald-400 uppercase">{prod.liquidity_rating}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Penalty for withdrawing early</span>
                  <span className={`text-xs font-bold ${prod.prepayment_penalty_pct > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
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
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 block">
              Suitability Score
            </span>
            <div className="flex items-baseline justify-end gap-1">
              <span className={`text-3xl font-black font-mono tracking-tight ${scoreTheme.text}`}>
                {score.toFixed(0)}
              </span>
              <span className="text-xs text-slate-400 font-bold">/100</span>
            </div>
          </div>
          
          <div className={`w-28 h-2 rounded-full bg-slate-800 overflow-hidden`}>
            <div 
              className={`h-full rounded-full ${
                score >= 80 ? 'bg-emerald-500' : score >= 60 ? 'bg-teal-500' : score >= 45 ? 'bg-amber-500' : 'bg-rose-500'
              }`}
              style={{ width: `${score}%` }}
            />
          </div>
        </div>
      </div>

      {/* Structured Pros & Constraints Chips */}
      <div className="pt-2 pb-3 space-y-1.5 border-t border-slate-800/60 my-2">
        {result.pros.map((pro, i) => (
          <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
            <span className="leading-tight">{pro}</span>
          </div>
        ))}
        {result.penalties.map((pen, i) => (
          <div key={i} className="flex items-start gap-2 text-xs text-rose-300/90 font-medium">
            <AlertTriangle className="h-3.5 w-3.5 text-rose-400 shrink-0 mt-0.5" />
            <span className="leading-tight">{pen.reason} (-{pen.penalty_points} pts)</span>
          </div>
        ))}
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-800/60">
        <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={isSelectedForCompare}
            onChange={() => onToggleCompare(prod.id)}
            className="rounded bg-slate-800 border-slate-700 text-emerald-500 focus:ring-emerald-400 accent-emerald-500 cursor-pointer h-4 w-4"
          />
          <span>Select to Compare</span>
        </label>

        <button
          onClick={() => onOpenExplain(result)}
          className="flex items-center gap-1 text-xs font-bold text-emerald-400 hover:text-emerald-300 hover:underline transition"
        >
          <span>Why this score?</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
