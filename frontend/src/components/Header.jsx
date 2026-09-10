import React from 'react';
import { ShieldCheck, Sparkles, BookOpen, Layers, Zap, UserCheck, AlertTriangle } from 'lucide-react';
import ProfileViewer from './ProfileViewer';

export default function Header({ 
  personas = [], 
  selectedPersonaId, 
  onSelectPersona, 
  categoryInterest, 
  onSelectCategory,
  onOpenCatalog,
  profile,
  email
}) {
  return (
    <header className="border-b border-gray-200 bg-white/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        
        {/* Brand & Tagline */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-indigo-600  flex items-center justify-center shadow-sm">
            <ShieldCheck className="h-6 w-6 text-white stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight bg-blue-600 text-indigo-800">
                AlignFin
              </span>
              <span className="text-sm uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-950/80 text-indigo-600 border border-emerald-800/60">
                Decision Intelligence
              </span>
            </div>
            <p className="text-sm text-gray-600 font-medium hidden sm:block">
              "Eligibility tells you what you can get. AlignFin tells you what fits."
            </p>
          </div>
        </div>

        {/* Action Controls & Persona Quick-Switcher */}
        <div className="flex flex-wrap items-center gap-3">
          
          <ProfileViewer profile={profile} email={email} />

          {/* 1-Click Demo Persona Switcher */}
          <div className="flex items-center gap-2 bg-gray-100 border border-gray-200 rounded-xl p-1.5 px-3 shadow-inner">
            <UserCheck className="h-4 w-4 text-indigo-600 shrink-0" />
            <span className="text-sm text-gray-700 font-semibold shrink-0">Demo Persona:</span>
            <select
              value={selectedPersonaId || ''}
              onChange={(e) => onSelectPersona(e.target.value)}
              className="bg-white text-sm font-medium text-indigo-700 rounded-lg border border-gray-200 px-2 py-1 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer max-w-[150px] truncate"
            >
              <option value="" disabled>Select Preset...</option>
              {personas.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Product Catalog Button */}
          <button
            onClick={onOpenCatalog}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200 transition"
          >
            <BookOpen className="h-3.5 w-3.5 text-gray-600" />
            <span>Catalog</span>
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-1 pb-2.5 flex items-center justify-between border-t border-gray-200">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-600 mr-1 hidden sm:inline">Category:</span>
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
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold transition ${
                  active
                    ? 'bg-indigo-50 text-indigo-600 border border-indigo-200 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${active ? 'text-indigo-600' : 'text-gray-600'}`} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        <div className="text-sm text-gray-600 font-mono hidden md:flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-indigo-600 text-white animate-pulse" />
          <span>AlignFin Intelligence Active</span>
        </div>
      </div>
    </header>
  );
}
