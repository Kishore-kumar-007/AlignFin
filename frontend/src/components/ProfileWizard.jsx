import React from 'react';
import { 
  DollarSign, 
  Clock, 
  ShieldAlert, 
  TrendingUp, 
  Sliders, 
  HelpCircle, 
  Sparkles, 
  AlertOctagon, 
  CheckCircle2, 
  Info,
  Layers
} from 'lucide-react';

export default function ProfileWizard({ profile, onChangeProfile, riskAnalysis, onTriggerEvaluate, isEvaluating }) {
  const handleChange = (field, value) => {
    onChangeProfile({
      ...profile,
      [field]: value
    });
  };

  const getCapacityBadge = (capacity) => {
    switch (capacity) {
      case 'high':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">HIGH BUFFER</span>;
      case 'moderate':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">MODERATE BUFFER</span>;
      case 'low':
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">LOW BUFFER</span>;
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-5 md:p-6 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Sliders className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">Your Financial Situation & Constraints</h2>
            <p className="text-xs text-slate-400">Real-time profile parameters powering suitability scoring</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Profile Name:</span>
          <span className="text-xs font-bold text-emerald-400 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700">
            {profile.name || "Custom Profile"}
          </span>
        </div>
      </div>

      {/* Financial Buffer & Solvency Live Gauge */}
      {riskAnalysis && (
        <div className={`p-4 rounded-xl border transition-all ${
          riskAnalysis.conflict_severity === 'critical'
            ? 'bg-rose-950/40 border-rose-500/50 glow-rose'
            : riskAnalysis.conflict_severity === 'mild'
            ? 'bg-amber-950/40 border-amber-500/50 glow-amber'
            : 'bg-slate-900/80 border-slate-700/80'
        }`}>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                {riskAnalysis.risk_mismatch_detected ? (
                  <AlertOctagon className="h-4 w-4 text-rose-400 shrink-0" />
                ) : (
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                )}
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Financial Buffer & Risk Capacity Index (FBSI)
                </span>
                {getCapacityBadge(riskAnalysis.derived_risk_capacity)}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
                {riskAnalysis.analysis_narrative}
              </p>
            </div>

            {/* Quick Metrics Pills */}
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <div className="bg-slate-950/80 px-3 py-2 rounded-lg border border-slate-800 text-center min-w-[100px]">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Surplus / mo</span>
                <span className="text-xs font-extrabold text-emerald-400">
                  ₹{riskAnalysis.monthly_surplus.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-slate-400 block">({riskAnalysis.surplus_ratio_pct}%)</span>
              </div>
              <div className="bg-slate-950/80 px-3 py-2 rounded-lg border border-slate-800 text-center min-w-[95px]">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Runway</span>
                <span className={`text-xs font-extrabold ${riskAnalysis.emergency_runway_months < 3 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {riskAnalysis.emergency_runway_months} Mo
                </span>
                <span className="text-[10px] text-slate-400 block">buffer</span>
              </div>
              <div className="bg-slate-950/80 px-3 py-2 rounded-lg border border-slate-800 text-center min-w-[85px]">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">DTI Ratio</span>
                <span className={`text-xs font-extrabold ${riskAnalysis.debt_to_income_pct > 40 ? 'text-rose-400' : 'text-slate-200'}`}>
                  {riskAnalysis.debt_to_income_pct}%
                </span>
                <span className="text-[10px] text-slate-400 block">debt load</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Profile Form Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Monthly Income */}
        <div className="space-y-1.5 bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
          <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
            <span>Monthly Income</span>
            <span className="text-emerald-400 font-mono font-bold">₹{Number(profile.monthly_income).toLocaleString('en-IN')}</span>
          </label>
          <input
            type="range"
            min="10000"
            max="250000"
            step="2500"
            value={profile.monthly_income}
            onChange={(e) => handleChange('monthly_income', Number(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>₹10k</span>
            <span>₹2.5L</span>
          </div>
        </div>

        {/* Monthly Expenses */}
        <div className="space-y-1.5 bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
          <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
            <span>Monthly Living Expenses</span>
            <span className="text-amber-400 font-mono font-bold">₹{Number(profile.monthly_expenses).toLocaleString('en-IN')}</span>
          </label>
          <input
            type="range"
            min="5000"
            max="180000"
            step="1000"
            value={profile.monthly_expenses}
            onChange={(e) => handleChange('monthly_expenses', Number(e.target.value))}
            className="w-full accent-amber-500 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>₹5k</span>
            <span>₹1.8L</span>
          </div>
        </div>

        {/* Existing Debt EMI */}
        <div className="space-y-1.5 bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
          <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
            <span>Existing Debt / EMI</span>
            <span className="text-rose-400 font-mono font-bold">₹{Number(profile.existing_debt_emi).toLocaleString('en-IN')}</span>
          </label>
          <input
            type="range"
            min="0"
            max="80000"
            step="1000"
            value={profile.existing_debt_emi}
            onChange={(e) => handleChange('existing_debt_emi', Number(e.target.value))}
            className="w-full accent-rose-500 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>₹0</span>
            <span>₹80k</span>
          </div>
        </div>

        {/* Current Savings Buffer */}
        <div className="space-y-1.5 bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
          <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
            <span>Current Liquid Savings</span>
            <span className="text-cyan-400 font-mono font-bold">₹{Number(profile.current_savings).toLocaleString('en-IN')}</span>
          </label>
          <input
            type="range"
            min="0"
            max="1000000"
            step="5000"
            value={profile.current_savings}
            onChange={(e) => handleChange('current_savings', Number(e.target.value))}
            className="w-full accent-cyan-500 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>₹0</span>
            <span>₹10L</span>
          </div>
        </div>
      </div>

      {/* Row 2: Target Amount, Horizon, Risk & Preferences */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Target Amount */}
        <div className="space-y-1.5 bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
          <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
            <span>Target Principal / Goal</span>
            <span className="text-white font-mono font-bold">₹{Number(profile.target_amount).toLocaleString('en-IN')}</span>
          </label>
          <input
            type="range"
            min="10000"
            max="1500000"
            step="10000"
            value={profile.target_amount}
            onChange={(e) => handleChange('target_amount', Number(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>₹10k</span>
            <span>₹15L</span>
          </div>
        </div>

        {/* Target Horizon */}
        <div className="space-y-1.5 bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
          <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
            <span>Target Horizon</span>
            <span className="text-emerald-400 font-mono font-bold">
              {profile.target_horizon_months} Mo ({(profile.target_horizon_months / 12).toFixed(1)} Yrs)
            </span>
          </label>
          <input
            type="range"
            min="6"
            max="84"
            step="6"
            value={profile.target_horizon_months}
            onChange={(e) => handleChange('target_horizon_months', Number(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>6m (0.5y)</span>
            <span>84m (7y)</span>
          </div>
        </div>

        {/* Risk Tolerance */}
        <div className="space-y-1.5 bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
          <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
            <span>Stated Risk Appetite</span>
            <span className="text-xs font-bold uppercase text-emerald-400">{profile.risk_tolerance}</span>
          </label>
          <div className="grid grid-cols-3 gap-1 pt-0.5">
            {['low', 'moderate', 'high'].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => handleChange('risk_tolerance', t)}
                className={`py-1.5 text-xs font-bold rounded-lg uppercase transition ${
                  profile.risk_tolerance === t
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Prepayment / Liquidity Priority */}
        <div className="space-y-1.5 bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
          <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
            <span>Early Exit / Prepayment</span>
            <span className="text-xs font-bold capitalize text-emerald-400">
              {profile.prepayment_preference.replace('_', ' ')}
            </span>
          </label>
          <div className="grid grid-cols-3 gap-1 pt-0.5">
            {[
              { id: 'unlikely', label: 'Hold' },
              { id: 'possible', label: 'Maybe' },
              { id: 'very_likely', label: 'Early Exit' }
            ].map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => handleChange('prepayment_preference', p.id)}
                className={`py-1.5 text-xs font-bold rounded-lg transition ${
                  profile.prepayment_preference === p.id
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
