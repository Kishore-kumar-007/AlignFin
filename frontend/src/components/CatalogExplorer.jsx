import React, { useState } from 'react';
import { X, Search, Filter, BookOpen, ShieldCheck, Zap, Sparkles, Tag } from 'lucide-react';

export default function CatalogExplorer({ products = [], onClose, onSelectProductCategory }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch = 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.badge && p.badge.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Curated Financial Product Catalog
              </h2>
              <p className="text-xs text-slate-400">
                30 Representative products engineered with realistic secondary terms and fees
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

        {/* Search & Category Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="h-4 w-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search products, providers, tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: 'all', label: 'All Products (30)' },
              { id: 'loan', label: 'Loans (12)' },
              { id: 'investment', label: 'Investments (10)' },
              { id: 'savings', label: 'Savings & FDs (8)' }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((p) => (
            <div key={p.id} className="bg-slate-950/80 rounded-xl p-4 border border-slate-800 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    {p.provider}
                  </span>
                  {p.badge && (
                    <span className={`text-[9px] uppercase font-extrabold px-2 py-0.5 rounded-full border ${
                      p.badge.includes('Trap') || p.badge.includes('Warning') || p.badge.includes('High Cost')
                        ? 'bg-rose-950/80 text-rose-300 border-rose-800'
                        : 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
                    }`}>
                      {p.badge}
                    </span>
                  )}
                </div>

                <h4 className="text-sm font-bold text-white leading-tight">
                  {p.name}
                </h4>

                <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800/80 flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Headline Rate</span>
                  <span className="text-sm font-extrabold text-emerald-400 font-mono">{p.headline_label}</span>
                </div>

                {/* Secondary Terms Callout */}
                <div className="space-y-1 text-[11px] text-slate-300">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Secondary Conditions:</span>
                  {p.secondary_conditions && p.secondary_conditions.map((sc, i) => (
                    <div key={i} className="text-amber-300/90 flex items-start gap-1">
                      <span className="text-amber-400">•</span>
                      <span>{sc}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
                <span className="capitalize">{p.category}</span>
                <span>Risk: <strong className="uppercase text-slate-200">{p.risk_level}</strong></span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 transition"
          >
            Close Catalog
          </button>
        </div>
      </div>
    </div>
  );
}
