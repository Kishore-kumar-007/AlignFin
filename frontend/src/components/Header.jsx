import React from 'react';
import { ShieldCheck, Sparkles, BookOpen, Layers, Zap, UserCheck, AlertTriangle } from 'lucide-react';
import ProfileViewer from './ProfileViewer';

export default function Header({ 
  categoryInterest, 
  onSelectCategory,
  onOpenCatalog,
  profile,
  email
}) {
  return (
    <header className="border-b border-fintech-border bg-fintech-bg sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        
        {/* Brand & Tagline */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-fintech-accent flex items-center justify-center shadow-sm">
            <ShieldCheck className="h-6 w-6 text-white stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight text-fintech-primary">
                AlignFin
              </span>
              <span className="text-xs uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-fintech-accent2/10 text-fintech-warning border border-fintech-accent2/20">
                Decision Intelligence
              </span>
            </div>
            <p className="text-sm text-fintech-secondary font-medium hidden sm:block">
              "Eligibility tells you what you can get. AlignFin tells you what fits."
            </p>
          </div>
        </div>

        {/* Action Controls & Profile Viewer */}
        <div className="flex flex-wrap items-center gap-3">
          
          <ProfileViewer profile={profile} email={email} />

          {/* Product Catalog Button */}
          <button
            onClick={onOpenCatalog}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold bg-white hover:bg-gray-50 text-fintech-primary border border-fintech-border transition"
          >
            <BookOpen className="h-4 w-4 text-fintech-secondary" />
            <span>Catalog</span>
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-1 pb-2.5 flex items-center justify-between border-t border-fintech-border bg-white">
        <div className="flex items-center gap-2 mt-2">
          <span className="text-sm font-semibold text-fintech-secondary mr-1 hidden sm:inline">Category:</span>
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
                    ? 'bg-fintech-bg text-fintech-accent border border-fintech-border shadow-sm'
                    : 'text-fintech-secondary hover:text-fintech-primary hover:bg-gray-50'
                }`}
              >
                <Icon className={`h-4 w-4 ${active ? 'text-fintech-accent' : 'text-fintech-secondary'}`} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
