import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import ProfileWizard from './components/ProfileWizard';
import SuitabilityCard from './components/SuitabilityCard';
import ComparisonView from './components/ComparisonView';
import ExplainabilityDrawer from './components/ExplainabilityDrawer';
import CatalogExplorer from './components/CatalogExplorer';
import { 
  fetchPersonas, 
  fetchProducts, 
  analyzeRisk, 
  fetchRecommendations, 
  compareProducts 
} from './services/api';
import { 
  Scale, 
  Sparkles, 
  AlertOctagon, 
  ShieldCheck, 
  TrendingUp, 
  Layers, 
  CheckCircle2, 
  RefreshCw,
  Info
} from 'lucide-react';

export default function App() {
  const [personas, setPersonas] = useState([]);
  const [selectedPersonaId, setSelectedPersonaId] = useState('persona-loan-trap');
  const [productsCatalog, setProductsCatalog] = useState([]);
  
  // User Profile State
  const [profile, setProfile] = useState({
    name: 'Rohan Sharma',
    age: 24,
    monthly_income: 35000,
    monthly_expenses: 25000,
    existing_debt_emi: 2000,
    current_savings: 75000,
    financial_goal: 'vehicle_purchase',
    category_interest: 'loan',
    target_amount: 200000,
    target_horizon_months: 36,
    risk_tolerance: 'moderate',
    liquidity_importance: 'medium',
    prepayment_preference: 'very_likely'
  });

  const [riskAnalysis, setRiskAnalysis] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [selectedForCompare, setSelectedForCompare] = useState(['loan-headline-bait', 'loan-flexi-fit']);
  const [isComparing, setIsComparing] = useState(false);
  const [comparisonMatrix, setComparisonMatrix] = useState(null);
  const [inspectResult, setInspectResult] = useState(null);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Initial Load
  useEffect(() => {
    async function init() {
      try {
        const [personasData, productsData] = await Promise.all([
          fetchPersonas(),
          fetchProducts()
        ]);
        setPersonas(personasData);
        setProductsCatalog(productsData);
        
        if (personasData.length > 0) {
          const defaultPersona = personasData[0];
          setSelectedPersonaId(defaultPersona.id);
          setProfile(defaultPersona.profile);
        }
      } catch (err) {
        console.error('Initialization error:', err);
      }
    }
    init();
  }, []);

  // Recalculate Risk and Recommendations on profile or category change
  const evaluateProfile = useCallback(async (currentProfile) => {
    setIsLoading(true);
    try {
      const [riskRes, recsRes] = await Promise.all([
        analyzeRisk(currentProfile),
        fetchRecommendations(currentProfile)
      ]);
      setRiskAnalysis(riskRes);
      setRecommendations(recsRes);

      // Auto-select top 2 for comparison if empty or category switched
      if (recsRes.length >= 2) {
        setSelectedForCompare([recsRes[0].product.id, recsRes[1].product.id]);
      } else {
        setSelectedForCompare([]);
      }
    } catch (err) {
      console.error('Evaluation error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    evaluateProfile(profile);
  }, [profile, evaluateProfile]);

  // Persona switch handler
  const handleSelectPersona = (personaId) => {
    const found = personas.find(p => p.id === personaId);
    if (found) {
      setSelectedPersonaId(personaId);
      setProfile({
        ...found.profile,
        name: found.profile.name || found.name
      });
    }
  };

  // Category switch handler
  const handleSelectCategory = (catId) => {
    const updated = {
      ...profile,
      category_interest: catId
    };
    setProfile(updated);
  };

  // Toggle compare selection
  const handleToggleCompare = (productId) => {
    setSelectedForCompare(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        if (prev.length >= 3) {
          return [...prev.slice(1), productId];
        }
        return [...prev, productId];
      }
    });
  };

  // Trigger Head-to-Head Compare Modal
  const handleRunComparison = async () => {
    if (selectedForCompare.length < 2) return;
    setIsLoading(true);
    try {
      const matrix = await compareProducts(profile, selectedForCompare);
      setComparisonMatrix(matrix);
      setIsComparing(true);
    } catch (err) {
      console.error('Comparison error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-white">
      {/* Top Header & Persona Nav */}
      <Header
        personas={personas}
        selectedPersonaId={selectedPersonaId}
        onSelectPersona={handleSelectPersona}
        categoryInterest={profile.category_interest}
        onSelectCategory={handleSelectCategory}
        onOpenCatalog={() => setIsCatalogOpen(true)}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 flex-1 w-full">
        
        {/* Step 1: Financial Profile Wizard & Live Health Gauge */}
        <section>
          <ProfileWizard
            profile={profile}
            onChangeProfile={setProfile}
            riskAnalysis={riskAnalysis}
            onTriggerEvaluate={() => evaluateProfile(profile)}
            isEvaluating={isLoading}
          />
        </section>

        {/* Step 2: Suitability Leaderboard & Recommendations Grid */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-extrabold text-white tracking-tight">
                  Suitability Leaderboard & Ranked Products
                </h2>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-slate-800 text-emerald-400 border border-slate-700">
                  {recommendations.length} Evaluated
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Ranked by deterministic suitability score (0–100) accounting for horizon, secondary fees, and solvency buffer
              </p>
            </div>

            {/* Compare Trigger Floating Button */}
            {selectedForCompare.length >= 2 && (
              <button
                onClick={handleRunComparison}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/20 transition transform active:scale-95 shrink-0"
              >
                <Scale className="h-4 w-4 stroke-[2.5]" />
                <span>Compare Selected ({selectedForCompare.length})</span>
              </button>
            )}
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendations.map((result) => (
              <SuitabilityCard
                key={result.product.id}
                result={result}
                isSelectedForCompare={selectedForCompare.includes(result.product.id)}
                onToggleCompare={handleToggleCompare}
                onOpenExplain={(res) => setInspectResult(res)}
              />
            ))}
          </div>
        </section>
      </main>

      {/* Modals & Overlays */}
      {isComparing && comparisonMatrix && (
        <ComparisonView
          matrix={comparisonMatrix}
          onClose={() => setIsComparing(false)}
          onOpenExplain={(res) => setInspectResult(res)}
        />
      )}

      {inspectResult && (
        <ExplainabilityDrawer
          result={inspectResult}
          profile={profile}
          onClose={() => setInspectResult(null)}
        />
      )}

      {isCatalogOpen && (
        <CatalogExplorer
          products={productsCatalog}
          onClose={() => setIsCatalogOpen(false)}
          onSelectProductCategory={handleSelectCategory}
        />
      )}

      {/* Footer & Hackathon Disclaimer */}
      <footer className="border-t border-slate-800/80 bg-slate-900/60 py-6 text-center text-xs text-slate-500 space-y-2">
        <div className="flex flex-wrap items-center justify-center gap-4 text-slate-400 font-medium">
          <span>HACKNOVA’26 — 24H Hackathon</span>
          <span>•</span>
          <span>Team AlignFin</span>
          <span>•</span>
          <span>Knowledge Institute of Technology, Salem</span>
          <span>•</span>
          <span>PS-08: Financial Product Suitability Intelligence</span>
        </div>
        <p className="text-[11px] text-slate-500 max-w-2xl mx-auto px-4">
          Disclaimer: AlignFin is a prototype decision-support & financial-literacy intelligence platform. Calculations are based on deterministic models and curated representative data. It does not constitute personalized financial advice.
        </p>
      </footer>
    </div>
  );
}
