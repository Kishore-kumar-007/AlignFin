import React from 'react';
import MarkdownRenderer from './MarkdownRenderer';
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
    <div className="fixed inset-0 z-50 bg-gray-50/80 backdrop-blur-md flex justify-end">
      <div className="bg-white border-l border-gray-200 w-full max-w-xl h-full overflow-y-auto p-6 space-y-6 shadow-2xl flex flex-col justify-between">
        
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-gray-200">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200">
                <Calculator className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900 tracking-tight">
                  Transparent Scoring Breakdown
                </h3>
                <p className="text-sm text-gray-600 font-mono">
                  {prod.name} ({prod.headline_label})
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Final Score Overview */}
          <div className="bg-gray-50/80 p-4 rounded-xl border border-gray-200 flex items-center justify-between">
            <div>
              <span className="text-sm uppercase font-bold text-gray-600 block">Overall Suitability</span>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black font-mono text-indigo-600">{score.toFixed(0)} / 100</span>
                <span className="text-sm px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 font-bold">
                  {result.fit_tier}
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-sm uppercase font-bold text-gray-600 block">Derived Risk Capacity</span>
              <span className="text-sm font-mono font-bold text-gray-800 uppercase">
                {result.risk_capacity}
              </span>
            </div>
          </div>

          {/* AI / Natural Language Explanation Narrative */}
          {result.ai_narrative && (
            <div className="bg-emerald-950/30 border border-indigo-200 p-4 rounded-xl space-y-2">
              <div className="flex items-center gap-1.5 text-indigo-600 text-sm font-bold uppercase tracking-wider">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Deterministic Reasoning Trace</span>
              </div>
              <div className="text-sm">
                <MarkdownRenderer content={result.ai_narrative} />
              </div>
            </div>
          )}

          {/* 5-Dimension Mathematical Breakdown */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-gray-600 flex items-center justify-between">
              <span>Weighted Dimension Metrics</span>
              <span className="font-mono text-sm text-gray-500">Weight × Raw = Score</span>
            </h4>

            <div className="space-y-2.5">
              {breakdown.map((dim, idx) => (
                <div key={idx} className="bg-gray-50/60 p-3 rounded-xl border border-gray-200/80 space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-gray-800">{dim.label}</span>
                    <span className="font-mono font-bold text-indigo-600">
                      +{(dim.weighted_score).toFixed(1)} <span className="text-sm text-gray-500 font-normal">({(dim.weight * 100).toFixed(0)}% wt)</span>
                    </span>
                  </div>
                  
                  {/* Visual Bar */}
                  <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-indigo-600 text-white rounded-full" 
                      style={{ width: `${dim.raw_score}%` }}
                    />
                  </div>

                  <p className="text-sm text-gray-600 leading-tight">
                    {dim.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Penalties Deductions */}
          {penalties.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold uppercase tracking-wider text-red-600 flex items-center gap-1.5">
                <Flame className="h-3.5 w-3.5" />
                <span>Penalties & Constraint Deductions</span>
              </h4>

              <div className="space-y-2">
                {penalties.map((pen, idx) => (
                  <div key={idx} className="bg-rose-950/30 p-3 rounded-xl border border-red-200 flex items-start justify-between gap-3">
                    <div className="space-y-0.5">
                      <span className="text-sm font-bold text-red-700 block">{pen.title}</span>
                      <p className="text-sm text-rose-200/80">{pen.reason}</p>
                    </div>
                    <span className="text-sm font-mono font-extrabold text-red-600 shrink-0">
                      -{pen.penalty_points} pts
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-sm font-bold text-gray-700 transition"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
}
