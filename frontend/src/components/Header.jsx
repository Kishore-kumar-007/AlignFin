import React from 'react';
import { ShieldCheck, Sparkles, BookOpen, Layers, Zap, UserCheck, AlertTriangle } from 'lucide-react';

export default function Header({ 
  personas = [], 
  selectedPersonaId, 
  onSelectPersona, 
  categoryInterest, 
  onSelectCategory,
  onOpenCatalog
}) {
  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        
        {/* Brand & Tagline */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <ShieldCheck className="h-6 w-6 text-slate-950 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-emerald-400 bg-clip-text text-transparent">
                AlignFin
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800/60">
                Decision Intelligence
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium hidden sm:block">
              "Eligibility tells you what you can get. AlignFin tells you what fits."
            </p>
          </div>
        </div>

        {/* Action Controls & Persona Quick-Switcher */}
        <div className="flex flex-wrap items-center gap-3">
          {/* 1-Click Demo Persona Switcher */}
          <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700/70 rounded-xl p-1.5 px-3 shadow-inner">
            <UserCheck className="h-4 w-4 text-emerald-400 shrink-0" />
            <span className="text-xs text-slate-300 font-semibold shrink-0">Demo Persona:</span>
            <select
              value={selectedPersonaId || ''}
              onChange={(e) => onSelectPersona(e.target.value)}
              className="bg-slate-900 text-xs font-medium text-emerald-300 rounded-lg border border-slate-700 px-2 py-1 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer max-w-[210px] truncate"
            >
              <option value="" disabled>Select a Preset Persona...</option>
              {personas.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.tagline})
                </option>
              ))}
            </select>
          </div>

          {/* Product Catalog Button */}
          <button
            onClick={onOpenCatalog}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
          >
            <BookOpen className="h-3.5 w-3.5 text-slate-400" />
            <span>Catalog (30)</span>
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-1 pb-2.5 flex items-center justify-between border-t border-slate-800/50">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 mr-1 hidden sm:inline">Category:</span>
          {[
            { id: 'loan', label: 'Personal Loans & Credit', icon: Zap },
            { id: 'investment', label: 'Wealth & Investments', icon: Sparkles },
            { id: 'savings', label: 'Emergency Savings & FDs', icon: ShieldCheck }
          ].map((cat) => {
            const Icon = cat.icon;
            const active = categoryInterest === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  active
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${active ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        <div className="text-[11px] text-slate-400 font-mono hidden md:flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Deterministic FBSI Core Active</span>
        </div>
      </div>
    </header>
  );
}
