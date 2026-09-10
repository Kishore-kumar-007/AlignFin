import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE } from '../services/api';
import { ChevronRight } from 'lucide-react';

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    name: '',
    age: 25,
    monthly_income: 50000,
    monthly_expenses: 30000,
    existing_debt_emi: 0,
    current_savings: 50000,
    financial_goal: 'vehicle_purchase',
    category_interest: 'loan',
    target_amount: 500000,
    target_horizon_months: 48,
    risk_tolerance: 'moderate',
    liquidity_importance: 'medium',
    prepayment_preference: 'possible'
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setProfile({ ...profile, [field]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem('alignfin_token');
    
    try {
      const res = await fetch(`${API_BASE}/auth/profile`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profile)
      });
      
      if (res.ok) {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-4 sm:p-8 flex justify-center">
      <div className="w-full max-w-2xl bg-slate-900/60 p-6 sm:p-10 rounded-2xl border border-slate-800 shadow-2xl h-fit">
        <h1 className="text-3xl font-black text-white tracking-tight mb-2">Let's build your profile</h1>
        <p className="text-slate-400 mb-8">We need some details to provide accurate financial suitability intelligence.</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Your Name</label>
              <input
                type="text" required
                value={profile.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-4 text-white focus:outline-none focus:border-emerald-500"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Age</label>
              <input
                type="number" required min="18"
                value={profile.age}
                onChange={(e) => handleChange('age', Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-4 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Monthly Income (₹)</label>
              <input
                type="number" required min="0" step="1"
                value={profile.monthly_income}
                onChange={(e) => handleChange('monthly_income', Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-4 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Monthly Expenses (₹)</label>
              <input
                type="number" required min="0" step="1"
                value={profile.monthly_expenses}
                onChange={(e) => handleChange('monthly_expenses', Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-4 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Liquid Savings (₹)</label>
              <input
                type="number" required min="0" step="1"
                value={profile.current_savings}
                onChange={(e) => handleChange('current_savings', Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-4 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Existing EMI (₹)</label>
              <input
                type="number" required min="0" step="1"
                value={profile.existing_debt_emi}
                onChange={(e) => handleChange('existing_debt_emi', Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-4 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Primary Interest</label>
              <div className="grid grid-cols-3 gap-3">
                {['loan', 'investment', 'savings'].map(cat => (
                  <button
                    type="button"
                    key={cat}
                    onClick={() => handleChange('category_interest', cat)}
                    className={`py-3 rounded-xl border font-bold capitalize transition-all ${
                      profile.category_interest === cat 
                        ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400 ring-1 ring-emerald-500' 
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {cat}s
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 mt-6 border-t border-slate-800">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-4 rounded-xl transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50"
            >
              <span>{loading ? 'Saving Profile...' : 'Complete Setup & Go to Dashboard'}</span>
              {!loading && <ChevronRight className="h-5 w-5" />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
