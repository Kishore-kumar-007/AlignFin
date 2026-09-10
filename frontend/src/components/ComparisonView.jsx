import React from 'react';
import { 
  X, 
  Scale, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  ArrowRight, 
  Zap, 
  ShieldCheck, 
  FileText 
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  CartesianGrid 
} from 'recharts';

export default function ComparisonView({ matrix, onClose, onOpenExplain }) {
  if (!matrix || !matrix.results || matrix.results.length === 0) return null;

  const results = matrix.results;
  const category = results[0]?.product.category;

  // Build chart dataset by merging cash_flow_simulation points across products
  const maxMonths = matrix.user_profile.target_horizon_months;
  const monthsSet = new Set();
  results.forEach(r => {
    r.cash_flow_simulation.forEach(pt => monthsSet.add(pt.month));
  });
  const sortedMonths = Array.from(monthsSet).sort((a, b) => a - b);

  const chartData = sortedMonths.map(m => {
    const row = { month: `Mo ${m}`, rawMonth: m };
    results.forEach((r, idx) => {
      const pt = r.cash_flow_simulation.find(p => p.month === m);
      if (pt) {
        row[r.product.name] = pt.cumulative_cost_or_value;
      }
    });
    return row;
  });

  const chartColors = ['#10b981', '#f43f5e', '#38bdf8', '#f59e0b'];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <Scale className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Head-to-Head Decision Matrix & Trade-Offs
              </h2>
              <p className="text-xs text-slate-400">
                Evaluating {results.length} products over your {matrix.user_profile.target_horizon_months}-month horizon
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* AI Decision Intelligence Verdict Banner */}
        <div className="bg-gradient-to-r from-emerald-950/50 via-slate-900 to-slate-900 border border-emerald-500/40 rounded-xl p-4.5 space-y-2">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-emerald-400" />
            <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-400">
              Decision Intelligence Verdict
            </span>
          </div>
          <div className="text-xs text-slate-200 leading-relaxed whitespace-pre-line font-medium">
            {matrix.verdict}
          </div>
        </div>

        {/* Key Trade-Offs Callout */}
        {matrix.key_tradeoffs && matrix.key_tradeoffs.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Key Trade-Offs Identified:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {matrix.key_tradeoffs.map((t, idx) => (
                <div key={idx} className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 flex items-start gap-2">
                  <ArrowRight className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{t}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dynamic Recharts Chart: Cost or Wealth Growth Simulation */}
        <div className="bg-slate-950/90 p-4.5 rounded-xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-400" />
              <span>
                {category === 'loan' 
                  ? 'Total Outflow / Cost of Borrowing over Timeline (₹)' 
                  : 'Projected Net Wealth Accumulation over Timeline (₹)'}
              </span>
            </h4>
            <span className="text-[11px] text-slate-400 font-mono">
              Horizon: {matrix.user_profile.target_horizon_months} Months
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                  formatter={(val) => [`₹${Number(val).toLocaleString('en-IN')}`, '']}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                {results.map((r, i) => (
                  <Line 
                    key={r.product.id}
                    type="monotone"
                    dataKey={r.product.name}
                    stroke={chartColors[i % chartColors.length]}
                    strokeWidth={2.5}
                    dot={{ r: 3 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Side-by-Side Comparison Spec Table */}
        <div className="overflow-x-auto border border-slate-800 rounded-xl">
          <table className="w-full text-xs text-left text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase font-bold text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-3">Attribute / Metric</th>
                {results.map((r) => (
                  <th key={r.product.id} className="p-3 text-white font-extrabold">
                    {r.product.name} ({r.product.headline_label})
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-slate-900/60">
              <tr>
                <td className="p-3 font-semibold text-slate-400">Suitability Score</td>
                {results.map((r) => (
                  <td key={r.product.id} className="p-3 font-mono font-extrabold text-sm">
                    <span className={r.suitability_score >= 80 ? 'text-emerald-400' : r.suitability_score >= 60 ? 'text-teal-400' : 'text-rose-400'}>
                      {r.suitability_score.toFixed(0)} / 100
                    </span>
                    <span className="text-[10px] text-slate-400 block font-normal">{r.fit_tier}</span>
                  </td>
                ))}
              </tr>

              {category === 'loan' && (
                <>
                  <tr>
                    <td className="p-3 font-semibold text-slate-400">Monthly EMI</td>
                    {results.map((r) => (
                      <td key={r.product.id} className="p-3 font-mono text-slate-200">
                        ₹{r.secondary_cost_impact.monthly_emi?.toLocaleString('en-IN')}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-400">Upfront Processing Fee</td>
                    {results.map((r) => (
                      <td key={r.product.id} className={`p-3 font-mono font-bold ${r.secondary_cost_impact.upfront_fee > 3000 ? 'text-rose-400' : 'text-slate-200'}`}>
                        ₹{r.secondary_cost_impact.upfront_fee?.toLocaleString('en-IN')}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-400">Prepayment Foreclosure Fee</td>
                    {results.map((r) => (
                      <td key={r.product.id} className={`p-3 font-bold ${r.product.prepayment_penalty_pct > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {r.product.prepayment_penalty_pct}% {r.secondary_cost_impact.prepayment_penalty_incurred > 0 && `(₹${r.secondary_cost_impact.prepayment_penalty_incurred?.toLocaleString('en-IN')})`}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-400">Total Net Cost @ Month {matrix.user_profile.target_horizon_months}</td>
                    {results.map((r) => (
                      <td key={r.product.id} className="p-3 font-mono font-extrabold text-sm text-amber-300">
                        ₹{r.secondary_cost_impact.total_cost_over_horizon?.toLocaleString('en-IN')}
                      </td>
                    ))}
                  </tr>
                </>
              )}

              {category === 'investment' && (
                <>
                  <tr>
                    <td className="p-3 font-semibold text-slate-400">Risk Level & Volatility</td>
                    {results.map((r) => (
                      <td key={r.product.id} className={`p-3 font-bold uppercase ${r.product.risk_level === 'high' ? 'text-rose-400' : r.product.risk_level === 'moderate' ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {r.product.risk_level}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-400">Annual Expense Ratio Drag</td>
                    {results.map((r) => (
                      <td key={r.product.id} className="p-3 font-mono text-slate-200">
                        {r.product.expense_ratio_pct}% p.a.
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-400">Lock-In Period</td>
                    {results.map((r) => (
                      <td key={r.product.id} className={`p-3 font-bold ${r.product.lock_in_months > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {r.product.lock_in_months} Months
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-400">Projected Maturity Value</td>
                    {results.map((r) => (
                      <td key={r.product.id} className="p-3 font-mono font-extrabold text-sm text-emerald-400">
                        ₹{r.secondary_cost_impact.final_liquidated_value?.toLocaleString('en-IN')}
                      </td>
                    ))}
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 transition"
          >
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  );
}
