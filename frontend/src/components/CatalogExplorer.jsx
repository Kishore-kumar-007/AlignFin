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
    <div className="fixed inset-0 z-50 bg-gray-50/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-gray-200 rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 tracking-tight">
                Curated Financial Product Catalog
              </h2>
              <p className="text-sm text-gray-600">
                30 Representative products engineered with realistic secondary terms and fees
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

        {/* Search & Category Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="h-4 w-4 text-gray-600 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search products, providers, tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-3 py-2 text-sm text-gray-800 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
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
                className={`px-3 py-1.5 rounded-lg text-sm font-bold transition whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? 'bg-indigo-600 text-white text-white shadow-md '
                    : 'bg-gray-100 text-gray-600 hover:text-gray-800'
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
            <div key={p.id} className="bg-gray-50/80 rounded-xl p-4 border border-gray-200 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm uppercase font-bold text-gray-600 tracking-wider">
                    {p.provider}
                  </span>
                  {p.badge && (
                    <span className={`text-[9px] uppercase font-extrabold px-2 py-0.5 rounded-full border ${
                      p.badge.includes('Trap') || p.badge.includes('Warning') || p.badge.includes('High Cost')
                        ? 'bg-rose-950/80 text-red-700 border-rose-800'
                        : 'bg-emerald-950/80 text-indigo-700 border-emerald-800'
                    }`}>
                      {p.badge}
                    </span>
                  )}
                </div>

                <h4 className="text-sm font-bold text-gray-900 leading-tight">
                  {p.name}
                </h4>

                <div className="bg-white/90 p-2.5 rounded-lg border border-gray-200/80 flex items-center justify-between">
                  <span className="text-sm uppercase font-bold text-gray-600">Headline Rate</span>
                  <span className="text-sm font-extrabold text-indigo-600 font-mono">{p.headline_label}</span>
                </div>

                {/* Secondary Terms Callout */}
                <div className="space-y-1 text-sm text-gray-700">
                  <span className="text-sm uppercase font-bold text-gray-500 block">Secondary Conditions:</span>
                  {p.secondary_conditions && p.secondary_conditions.map((sc, i) => (
                    <div key={i} className="text-yellow-800/90 flex items-start gap-1">
                      <span className="text-yellow-700">•</span>
                      <span>{sc}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-gray-200/60 flex items-center justify-between text-sm text-gray-600">
                <span className="capitalize">{p.category}</span>
                <span>Risk: <strong className="uppercase text-gray-800">{p.risk_level}</strong></span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-sm font-bold text-gray-700 transition"
          >
            Close Catalog
          </button>
        </div>
      </div>
    </div>
  );
}
