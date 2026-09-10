import React from 'react';
import { 
  X, 
  HelpCircle, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Percent, 
  Sparkles, 
  Calculator,
  Flame,
  Info
} from 'lucide-react';

export default function ExplainabilityDrawer({ result, profile, onClose }) {
  if (!result) return null;

  const prod = result.product;
  const score = result.suitability_score;
  const breakdown = result.score_breakdown || [];
  const penalties = result.penalties || [];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex justify-end">
      <div className="bg-slate-900 border-l border-slate-700 w-full max-w-xl h-full overflow-y-auto p-6 space-y-6 shadow-2xl flex flex-col justify-between">
        
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <Calculator className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">
                  Transparent Scoring Breakdown
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  {prod.name} ({prod.headline_label})
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 transition"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Final Score Overview */}
          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Overall Suitability</span>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black font-mono text-emerald-400">{score.toFixed(0)} / 100</span>
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                  {result.fit_tier}
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Derived Risk Capacity</span>
              <span className="text-xs font-mono font-bold text-slate-200 uppercase">
                {result.risk_capacity}
              </span>
            </div>
          </div>

          {/* AI / Natural Language Explanation Narrative */}
          {result.ai_narrative && (
            <div className="bg-emerald-950/30 border border-emerald-500/30 p-4 rounded-xl space-y-2">
              <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Deterministic Reasoning Trace</span>
              </div>
              <div className="text-xs text-slate-200 leading-relaxed space-y-1.5 font-medium">
                {result.ai_narrative.split('\n').map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>
          )}

          {/* 5-Dimension Mathematical Breakdown */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Weighted Dimension Metrics</span>
              <span className="font-mono text-[11px] text-slate-500">Weight × Raw = Score</span>
            </h4>

            <div className="space-y-2.5">
              {breakdown.map((dim, idx) => (
                <div key={idx} className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200">{dim.label}</span>
                    <span className="font-mono font-bold text-emerald-400">
                      +{(dim.weighted_score).toFixed(1)} <span className="text-[10px] text-slate-500 font-normal">({(dim.weight * 100).toFixed(0)}% wt)</span>
                    </span>
                  </div>
                  
                  {/* Visual Bar */}
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-500 rounded-full" 
                      style={{ width: `${dim.raw_score}%` }}
                    />
                  </div>

                  <p className="text-[11px] text-slate-400 leading-tight">
                    {dim.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Penalties Deductions */}
          {penalties.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                <Flame className="h-3.5 w-3.5" />
                <span>Penalties & Constraint Deductions</span>
              </h4>

              <div className="space-y-2">
                {penalties.map((pen, idx) => (
                  <div key={idx} className="bg-rose-950/30 p-3 rounded-xl border border-rose-500/30 flex items-start justify-between gap-3">
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-rose-300 block">{pen.title}</span>
                      <p className="text-[11px] text-rose-200/80">{pen.reason}</p>
                    </div>
                    <span className="text-xs font-mono font-extrabold text-rose-400 shrink-0">
                      -{pen.penalty_points} pts
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 transition"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
}
