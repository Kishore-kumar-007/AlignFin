import React from 'react';
import MarkdownRenderer from './MarkdownRenderer';
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
    <div className="fixed inset-0 z-50 bg-gray-50/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-gray-200 rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200">
              <Scale className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 tracking-tight">
                Head-to-Head Decision Matrix & Trade-Offs
              </h2>
              <p className="text-sm text-gray-600">
                Evaluating {results.length} products over your {matrix.user_profile.target_horizon_months}-month horizon
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* AI Decision Intelligence Verdict Banner */}
        <div className="bg-blue-600 from-emerald-950/50 via-slate-900 to-slate-900 border border-indigo-200 rounded-xl p-4.5 space-y-2">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-indigo-600" />
            <span className="text-sm uppercase font-extrabold tracking-wider text-indigo-600">
              Decision Intelligence Verdict
            </span>
          </div>
          <div className="text-sm">
            <MarkdownRenderer content={matrix.verdict} />
          </div>
        </div>

        {/* Key Trade-Offs Callout */}
        {matrix.key_tradeoffs && matrix.key_tradeoffs.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-bold uppercase tracking-wider text-gray-600">Key Trade-Offs Identified:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {matrix.key_tradeoffs.map((t, idx) => (
                <div key={idx} className="bg-gray-50/80 p-3 rounded-xl border border-gray-200 text-sm text-gray-700 flex items-start gap-2">
                  <ArrowRight className="h-3.5 w-3.5 text-indigo-600 shrink-0 mt-0.5" />
                  <span>{t}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dynamic Recharts Chart: Cost or Wealth Growth Simulation */}
        <div className="bg-gray-50/90 p-4.5 rounded-xl border border-gray-200 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold uppercase tracking-wider text-gray-700 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-indigo-600" />
              <span>
                {category === 'loan' 
                  ? 'Total Outflow / Cost of Borrowing over Timeline (₹)' 
                  : 'Projected Net Wealth Accumulation over Timeline (₹)'}
              </span>
            </h4>
            <span className="text-sm text-gray-600 font-mono">
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
        <div className="overflow-x-auto border border-gray-200 rounded-xl">
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="bg-gray-50 text-gray-600 uppercase font-bold text-sm border-b border-gray-200">
              <tr>
                <th className="p-3">Attribute / Metric</th>
                {results.map((r) => (
                  <th key={r.product.id} className="p-3 text-gray-900 font-extrabold">
                    {r.product.name} ({r.product.headline_label})
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-white">
              <tr>
                <td className="p-3 font-semibold text-gray-600">Suitability Score</td>
                {results.map((r) => (
                  <td key={r.product.id} className="p-3 font-mono font-extrabold text-sm">
                    <span className={r.suitability_score >= 80 ? 'text-indigo-600' : r.suitability_score >= 60 ? 'text-teal-400' : 'text-red-600'}>
                      {r.suitability_score.toFixed(0)} / 100
                    </span>
                    <span className="text-sm text-gray-600 block font-normal">{r.fit_tier}</span>
                  </td>
                ))}
              </tr>

              {category === 'loan' && (
                <>
                  <tr>
                    <td className="p-3 font-semibold text-gray-600">Monthly EMI</td>
                    {results.map((r) => (
                      <td key={r.product.id} className="p-3 font-mono text-gray-800">
                        ₹{r.secondary_cost_impact.monthly_emi?.toLocaleString('en-IN')}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-gray-600">Upfront Processing Fee</td>
                    {results.map((r) => (
                      <td key={r.product.id} className={`p-3 font-mono font-bold ${r.secondary_cost_impact.upfront_fee > 3000 ? 'text-red-600' : 'text-gray-800'}`}>
                        ₹{r.secondary_cost_impact.upfront_fee?.toLocaleString('en-IN')}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-gray-600">Prepayment Foreclosure Fee</td>
                    {results.map((r) => (
                      <td key={r.product.id} className={`p-3 font-bold ${r.product.prepayment_penalty_pct > 0 ? 'text-red-600' : 'text-indigo-600'}`}>
                        {r.product.prepayment_penalty_pct}% {r.secondary_cost_impact.prepayment_penalty_incurred > 0 && `(₹${r.secondary_cost_impact.prepayment_penalty_incurred?.toLocaleString('en-IN')})`}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-gray-600">Total Net Cost @ Month {matrix.user_profile.target_horizon_months}</td>
                    {results.map((r) => (
                      <td key={r.product.id} className="p-3 font-mono font-extrabold text-sm text-yellow-800">
                        ₹{r.secondary_cost_impact.total_cost_over_horizon?.toLocaleString('en-IN')}
                      </td>
                    ))}
                  </tr>
                </>
              )}

              {category === 'investment' && (
                <>
                  <tr>
                    <td className="p-3 font-semibold text-gray-600">Risk Level & Volatility</td>
                    {results.map((r) => (
                      <td key={r.product.id} className={`p-3 font-bold uppercase ${r.product.risk_level === 'high' ? 'text-red-600' : r.product.risk_level === 'moderate' ? 'text-yellow-700' : 'text-indigo-600'}`}>
                        {r.product.risk_level}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-gray-600">Annual Expense Ratio Drag</td>
                    {results.map((r) => (
                      <td key={r.product.id} className="p-3 font-mono text-gray-800">
                        {r.product.expense_ratio_pct}% p.a.
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-gray-600">Lock-In Period</td>
                    {results.map((r) => (
                      <td key={r.product.id} className={`p-3 font-bold ${r.product.lock_in_months > 0 ? 'text-yellow-700' : 'text-indigo-600'}`}>
                        {r.product.lock_in_months} Months
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-gray-600">Projected Maturity Value</td>
                    {results.map((r) => (
                      <td key={r.product.id} className="p-3 font-mono font-extrabold text-sm text-indigo-600">
                        ₹{r.secondary_cost_impact.final_liquidated_value?.toLocaleString('en-IN')}
                      </td>
                    ))}
                  </tr>
                </>
              )}

              {category === 'savings' && (
                <>
                  <tr>
                    <td className="p-3 font-semibold text-gray-600">How easily you can access your money</td>
                    {results.map((r) => (
                      <td key={r.product.id} className={`p-3 font-bold uppercase ${r.product.liquidity_rating === 'high' ? 'text-indigo-600' : r.product.liquidity_rating === 'medium' ? 'text-yellow-700' : 'text-red-600'}`}>
                        {r.product.liquidity_rating}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-gray-600">Lock-In Period</td>
                    {results.map((r) => (
                      <td key={r.product.id} className={`p-3 font-bold ${r.product.lock_in_months > 0 ? 'text-yellow-700' : 'text-indigo-600'}`}>
                        {r.product.lock_in_months} Months
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-gray-600">Premature Withdrawal Penalty</td>
                    {results.map((r) => (
                      <td key={r.product.id} className={`p-3 font-bold ${r.product.prepayment_penalty_pct > 0 ? 'text-red-600' : 'text-indigo-600'}`}>
                        {r.product.prepayment_penalty_pct}%
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-gray-600">Guaranteed Maturity Value</td>
                    {results.map((r) => (
                      <td key={r.product.id} className="p-3 font-mono font-extrabold text-sm text-indigo-600">
                        ₹{r.secondary_cost_impact.maturity_value?.toLocaleString('en-IN')}
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
            className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-sm font-bold text-gray-700 transition"
          >
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  );
}
