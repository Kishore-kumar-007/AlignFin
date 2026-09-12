import React from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  ChevronRight, 
} from 'lucide-react';

export default function SuitabilityCard({ 
  result, 
  isSelectedForCompare, 
  onToggleCompare, 
  onOpenExplain 
}) {
  const prod = result.product;
  const isTopFit = result.rank === 1;

  const getMatchTheme = (strength, recommended) => {
    if (!recommended) return { bg: 'bg-fintech-danger bg-opacity-10', text: 'text-fintech-danger', border: 'border-fintech-danger' };
    switch (strength) {
      case 'Strong match':
        return { bg: 'bg-fintech-success bg-opacity-10', text: 'text-fintech-success', border: 'border-fintech-success' };
      case 'Moderate match':
        return { bg: 'bg-fintech-warning bg-opacity-10', text: 'text-fintech-warning', border: 'border-fintech-warning' };
      default:
        return { bg: 'bg-gray-100', text: 'text-fintech-secondary', border: 'border-fintech-border' };
    }
  };

  const theme = getMatchTheme(result.match_strength, result.is_recommended);

  return (
    <div className={`fintech-card p-5 transition-all duration-200 relative ${
      isTopFit ? 'ring-1 ring-fintech-accent' : ''
    } ${isSelectedForCompare ? 'ring-2 ring-fintech-accent2 bg-[#FDFCF9]' : 'hover:border-gray-300'}`}>
      
      {/* Top Tag */}
      {prod.badge && (
        <div className={`absolute top-0 right-0 px-3 py-1 text-[10px] uppercase tracking-wider font-bold rounded-bl-lg bg-fintech-bg text-fintech-secondary border-l border-b border-fintech-border`}>
          {prod.badge}
        </div>
      )}

      <div className="flex flex-col gap-4">
        
        {/* Header: Provider & Match */}
        <div className="flex items-center justify-between pr-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-fintech-secondary">{prod.provider}</span>
            <span className="text-sm text-gray-400">|</span>
            <span className="text-xs text-gray-400">{prod.source || 'Provider product document'}</span>
          </div>
          
          <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${theme.bg} ${theme.text} ${theme.border}`}>
            {!result.is_recommended ? 'Not Recommended' : result.match_strength}
          </span>
        </div>

        {/* Product Name & Rate */}
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-bold text-fintech-primary tracking-tight">
              {prod.name}
            </h3>
            <p className="text-lg font-semibold text-fintech-accent mt-0.5">
              {prod.headline_label}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Suitability Score</p>
            <div className="flex items-baseline justify-end gap-0.5">
              <span className="text-2xl font-black text-gray-800">{result.suitability_score.toFixed(0)}</span>
              <span className="text-xs font-bold text-gray-400">/100</span>
            </div>
          </div>
        </div>

        {/* Key Reason & Warning */}
        <div className="space-y-2 mt-2">
          {result.is_recommended && result.pros && result.pros.length > 0 && (
            <div className="flex items-start gap-2 text-sm text-fintech-secondary">
              <CheckCircle2 className="h-4 w-4 text-fintech-success shrink-0 mt-0.5" />
              <span className="leading-tight">{result.pros[0]}</span>
            </div>
          )}

          {(!result.is_recommended || result.penalties.length > 0) && (
            <div className="flex items-start gap-2 text-sm text-fintech-danger">
              <AlertTriangle className="h-4 w-4 text-fintech-danger shrink-0 mt-0.5" />
              <span className="leading-tight">
                {result.penalties.length > 0 ? result.penalties[0].reason : "Conflicts with your profile constraints."}
              </span>
            </div>
          )}
        </div>

        {/* Action Footer */}
        <div className="flex items-center justify-between pt-4 mt-2 border-t border-fintech-border">
          <label className="flex items-center gap-2 text-sm font-medium text-fintech-secondary cursor-pointer select-none group">
            <input
              type="checkbox"
              checked={isSelectedForCompare}
              onChange={() => onToggleCompare(prod.id)}
              className="rounded bg-white border-fintech-border text-fintech-accent focus:ring-fintech-accent accent-fintech-accent cursor-pointer h-4 w-4 transition-colors"
            />
            <span className="group-hover:text-fintech-primary transition-colors">Compare</span>
          </label>

          <button
            onClick={() => onOpenExplain(result)}
            className="flex items-center gap-1 text-sm font-semibold text-fintech-accent hover:text-fintech-primary transition-colors"
          >
            <span>View Analysis</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
