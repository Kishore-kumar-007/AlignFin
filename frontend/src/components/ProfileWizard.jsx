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
        return <span className="px-2.5 py-0.5 rounded-full text-sm font-bold bg-indigo-100 text-indigo-700 border border-indigo-200">HIGH BUFFER</span>;
      case 'moderate':
        return <span className="px-2.5 py-0.5 rounded-full text-sm font-bold bg-yellow-50 text-fintech-warning border border-amber-500/40">MODERATE BUFFER</span>;
      case 'low':
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-sm font-bold bg-red-50 text-fintech-danger border border-red-200">LOW BUFFER</span>;
    }
  };

  return (
    <div className="bg-white fintech-card p-5 md:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-fintech-border">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-fintech-bg text-fintech-accent border border-fintech-border">
            <Sliders className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-fintech-primary tracking-tight">Your Financial Situation & Constraints</h2>
            <p className="text-sm text-fintech-secondary">Real-time profile parameters powering suitability scoring</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-fintech-secondary font-medium">Profile Name:</span>
          <span className="text-sm font-bold text-fintech-accent bg-fintech-bg px-2.5 py-1 rounded-md border border-fintech-border">
            {profile.name || "Custom Profile"}
          </span>
        </div>
      </div>

      {/* Financial Buffer & Solvency Live Gauge */}
      {riskAnalysis && (
        <div className={`p-4 rounded-xl border transition-all ${
          riskAnalysis.conflict_severity === 'critical'
            ? 'bg-rose-950/40 border-red-600/50 glow-rose'
            : riskAnalysis.conflict_severity === 'mild'
            ? 'bg-amber-950/40 border-amber-500/50 glow-amber'
            : 'bg-white/80 border-fintech-border/80'
        }`}>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                {riskAnalysis.risk_mismatch_detected ? (
                  <AlertOctagon className="h-4 w-4 text-fintech-danger shrink-0" />
                ) : (
                  <CheckCircle2 className="h-4 w-4 text-fintech-accent shrink-0" />
                )}
                <span className="text-sm font-bold uppercase tracking-wider text-fintech-primary">
                  Financial Safety Score
                </span>
                {getCapacityBadge(riskAnalysis.derived_risk_capacity)}
              </div>
              <p className="text-sm text-fintech-primary leading-relaxed max-w-3xl">
                {riskAnalysis.analysis_narrative}
              </p>
            </div>

            {/* Quick Metrics Pills */}
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <div className="bg-gray-50/80 px-3 py-2 rounded-lg border border-fintech-border text-center min-w-[100px]">
                <span className="text-sm uppercase font-bold text-fintech-secondary block">Surplus / mo</span>
                <span className="text-sm font-extrabold text-fintech-accent">
                  ₹{riskAnalysis.monthly_surplus.toLocaleString('en-IN')}
                </span>
                <span className="text-sm text-fintech-secondary block">({riskAnalysis.surplus_ratio_pct}%)</span>
              </div>
              <div className="bg-gray-50/80 px-3 py-2 rounded-lg border border-fintech-border text-center min-w-[95px]">
                <span className="text-sm uppercase font-bold text-fintech-secondary block">Runway</span>
                <span className={`text-sm font-extrabold ${riskAnalysis.emergency_runway_months < 3 ? 'text-fintech-danger' : 'text-fintech-accent'}`}>
                  {riskAnalysis.emergency_runway_months} Mo
                </span>
                <span className="text-sm text-fintech-secondary block">buffer</span>
              </div>
              <div className="bg-gray-50/80 px-3 py-2 rounded-lg border border-fintech-border text-center min-w-[85px]">
                <span className="text-sm uppercase font-bold text-fintech-secondary block">DTI Ratio</span>
                <span className={`text-sm font-extrabold ${riskAnalysis.debt_to_income_pct > 40 ? 'text-fintech-danger' : 'text-gray-800'}`}>
                  {riskAnalysis.debt_to_income_pct}%
                </span>
                <span className="text-sm text-fintech-secondary block">debt load</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Profile Form Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Monthly Income */}
        <div className="space-y-1.5 bg-white p-3.5 rounded-xl border border-fintech-border">
          <label className="text-sm font-semibold text-fintech-primary flex items-center justify-between">
            <span>Monthly Income</span>
            <span className="text-fintech-accent font-mono font-bold">₹{Number(profile.monthly_income).toLocaleString('en-IN')}</span>
          </label>
          <input
            type="range"
            min="10000"
            max="250000"
            step="1"
            value={profile.monthly_income}
            onChange={(e) => handleChange('monthly_income', Number(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-gray-200 rounded-lg"
          />
          <div className="flex justify-between text-sm text-fintech-secondary font-mono">
            <span>₹10k</span>
            <span>₹2.5L</span>
          </div>
        </div>

        {/* Monthly Expenses */}
        <div className="space-y-1.5 bg-white p-3.5 rounded-xl border border-fintech-border">
          <label className="text-sm font-semibold text-fintech-primary flex items-center justify-between">
            <span>Monthly Living Expenses</span>
            <span className="text-fintech-warning font-mono font-bold">₹{Number(profile.monthly_expenses).toLocaleString('en-IN')}</span>
          </label>
          <input
            type="range"
            min="5000"
            max="180000"
            step="1"
            value={profile.monthly_expenses}
            onChange={(e) => handleChange('monthly_expenses', Number(e.target.value))}
            className="w-full accent-amber-500 cursor-pointer h-1.5 bg-gray-200 rounded-lg"
          />
          <div className="flex justify-between text-sm text-fintech-secondary font-mono">
            <span>₹5k</span>
            <span>₹1.8L</span>
          </div>
        </div>

        {/* Existing Debt EMI */}
        <div className="space-y-1.5 bg-white p-3.5 rounded-xl border border-fintech-border">
          <label className="text-sm font-semibold text-fintech-primary flex items-center justify-between">
            <span>Existing Debt / EMI</span>
            <span className="text-fintech-danger font-mono font-bold">₹{Number(profile.existing_debt_emi).toLocaleString('en-IN')}</span>
          </label>
          <input
            type="range"
            min="0"
            max="80000"
            step="1"
            value={profile.existing_debt_emi}
            onChange={(e) => handleChange('existing_debt_emi', Number(e.target.value))}
            className="w-full accent-rose-500 cursor-pointer h-1.5 bg-gray-200 rounded-lg"
          />
          <div className="flex justify-between text-sm text-fintech-secondary font-mono">
            <span>₹0</span>
            <span>₹80k</span>
          </div>
        </div>

        {/* Current Savings Buffer */}
        <div className="space-y-1.5 bg-white p-3.5 rounded-xl border border-fintech-border">
          <label className="text-sm font-semibold text-fintech-primary flex items-center justify-between">
            <span>Current Liquid Savings</span>
            <span className="text-cyan-400 font-mono font-bold">₹{Number(profile.current_savings).toLocaleString('en-IN')}</span>
          </label>
          <input
            type="range"
            min="0"
            max="1000000"
            step="1"
            value={profile.current_savings}
            onChange={(e) => handleChange('current_savings', Number(e.target.value))}
            className="w-full accent-cyan-500 cursor-pointer h-1.5 bg-gray-200 rounded-lg"
          />
          <div className="flex justify-between text-sm text-fintech-secondary font-mono">
            <span>₹0</span>
            <span>₹10L</span>
          </div>
        </div>
      </div>

      {/* Row 2: Target Amount, Horizon, Risk & Preferences */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Target Amount */}
        <div className="space-y-1.5 bg-white p-3.5 rounded-xl border border-fintech-border">
          <label className="text-sm font-semibold text-fintech-primary flex items-center justify-between">
            <span>Target Principal / Goal</span>
            <span className="text-fintech-primary font-mono font-bold">₹{Number(profile.target_amount).toLocaleString('en-IN')}</span>
          </label>
          <input
            type="range"
            min="10000"
            max="1500000"
            step="1"
            value={profile.target_amount}
            onChange={(e) => handleChange('target_amount', Number(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-gray-200 rounded-lg"
          />
          <div className="flex justify-between text-sm text-fintech-secondary font-mono">
            <span>₹10k</span>
            <span>₹15L</span>
          </div>
        </div>

        {/* Target Horizon */}
        <div className="space-y-1.5 bg-white p-3.5 rounded-xl border border-fintech-border">
          <label className="text-sm font-semibold text-fintech-primary flex items-center justify-between">
            <span>Target Horizon</span>
            <span className="text-fintech-accent font-mono font-bold">
              {profile.target_horizon_months} Mo ({(profile.target_horizon_months / 12).toFixed(1)} Yrs)
            </span>
          </label>
          <input
            type="range"
            min="6"
            max="84"
            step="1"
            value={profile.target_horizon_months}
            onChange={(e) => handleChange('target_horizon_months', Number(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-gray-200 rounded-lg"
          />
          <div className="flex justify-between text-sm text-fintech-secondary font-mono">
            <span>6m (0.5y)</span>
            <span>84m (7y)</span>
          </div>
        </div>

        {/* Risk Tolerance */}
        <div className="space-y-1.5 bg-white p-3.5 rounded-xl border border-fintech-border">
          <label className="text-sm font-semibold text-fintech-primary flex items-center justify-between">
            <span>Stated Risk Appetite</span>
            <span className="text-sm font-bold uppercase text-fintech-accent">{profile.risk_tolerance}</span>
          </label>
          <div className="grid grid-cols-3 gap-1 pt-0.5">
            {['low', 'moderate', 'high'].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => handleChange('risk_tolerance', t)}
                className={`py-1.5 text-sm font-bold rounded-lg uppercase transition ${
                  profile.risk_tolerance === t
                    ? 'bg-indigo-600 text-white text-white shadow-md '
                    : 'bg-fintech-bg text-fintech-secondary hover:text-gray-800'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Prepayment / Liquidity Priority */}
        <div className="space-y-1.5 bg-white p-3.5 rounded-xl border border-fintech-border">
          <label className="text-sm font-semibold text-fintech-primary flex items-center justify-between">
            <span>Early Exit / Prepayment</span>
            <span className="text-sm font-bold capitalize text-fintech-accent">
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
                className={`py-1.5 text-sm font-bold rounded-lg transition ${
                  profile.prepayment_preference === p.id
                    ? 'bg-indigo-600 text-white text-white shadow-md '
                    : 'bg-fintech-bg text-fintech-secondary hover:text-gray-800'
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
