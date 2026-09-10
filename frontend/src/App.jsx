import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './components/Header';
import WelcomeHero from "./components/WelcomeHero";
import ProfileWizard from './components/ProfileWizard';
import SuitabilityCard from './components/SuitabilityCard';
import ComparisonView from './components/ComparisonView';
import DocumentScanner from "./components/DocumentScanner";
import ExplainabilityDrawer from './components/ExplainabilityDrawer';
import CatalogExplorer from './components/CatalogExplorer';
import { 
  fetchPersonas, 
  fetchProducts, 
  analyzeRisk, 
  fetchRecommendations, 
  compareProducts,
  API_BASE
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
  const navigate = useNavigate();
  const [personas, setPersonas] = useState([]);
  const [selectedPersonaId, setSelectedPersonaId] = useState('');
  const [productsCatalog, setProductsCatalog] = useState([]);
  
  // User Profile State
  const [profile, setProfile] = useState(null);
  const [userEmail, setUserEmail] = useState("");

  const [riskAnalysis, setRiskAnalysis] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [selectedForCompare, setSelectedForCompare] = useState([]);
  const [isComparing, setIsComparing] = useState(false);
  const [comparisonMatrix, setComparisonMatrix] = useState(null);
  const [inspectResult, setInspectResult] = useState(null);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('alignfin_token');
    navigate('/login');
  };

  // Initial Load & Auth Check
  useEffect(() => {
    async function init() {
      try {
        const token = localStorage.getItem('alignfin_token');
        if (!token) {
          navigate('/login');
          return;
        }

        // Fetch User Profile
        const userRes = await fetch(`${API_BASE}/auth/me`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!userRes.ok) {
          localStorage.removeItem('alignfin_token');
          navigate('/login');
          return;
        }

        const userData = await userRes.json();
        if (!userData.profile || Object.keys(userData.profile).length === 0) {
          navigate('/onboarding');
          return;
        }

        setProfile(userData.profile);
        setUserEmail(userData.email);

        const [personasData, productsData] = await Promise.all([
          fetchPersonas(),
          fetchProducts()
        ]);
        setPersonas(personasData);
        setProductsCatalog(productsData);
      } catch (err) {
        console.error('Initialization error:', err);
      } finally {
        setIsLoading(false);
      }
    }
    init();
  }, [navigate]);

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
    if (!profile) return;
    const handler = setTimeout(() => {
      evaluateProfile(profile);
    }, 500);
    return () => clearTimeout(handler);
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
        if (prev.length >= 5) {
          return [...prev.slice(1), productId];
        }
        return [...prev, productId];
      }
    });
  };

  const handleRunComparison = async () => {
    if (selectedForCompare.length < 2) return;
    setIsLoading(true);
    try {
      const matrix = await compareProducts(profile, selectedForCompare);
      setComparisonMatrix(matrix);
      setIsComparing(true);
    } catch (err) {
      console.error('Compare error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-emerald-500 font-bold animate-pulse text-lg">Loading Profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col justify-between selection:bg-indigo-600 text-white selection:text-gray-900">
      {/* Top Header & Persona Nav */}
      <Header
        personas={personas}
        selectedPersonaId={selectedPersonaId}
        onSelectPersona={handleSelectPersona}
        categoryInterest={profile.category_interest}
        onSelectCategory={handleSelectCategory}
        onOpenCatalog={() => setIsCatalogOpen(true)}
        profile={profile}
        email={userEmail}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 flex-1 w-full">
        
        <WelcomeHero userName={profile.name} />
        <div className="flex justify-end">
          <button 
            onClick={handleLogout}
            className="text-sm font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-50 px-4 py-2 rounded-lg transition"
          >
            Sign Out
          </button>
        </div>

        {/* 1. Profile & Risk Context */}
        <section>
          <ProfileWizard
            profile={profile}
            onChangeProfile={setProfile}
            onTriggerEvaluate={() => evaluateProfile(profile)}
            isEvaluating={isLoading}
          />
        </section>

        {/* 2. Intelligent Leaderboard */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-gray-200">
            <div>
              <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-indigo-600" />
                Suitability Leaderboard
              </h2>
              <p className="text-sm text-gray-600 mt-0.5">Ranked explicitly for {profile.name}'s constraints.</p>
            </div>
            
            {selectedForCompare.length >= 2 && (
              <button
                onClick={handleRunComparison}
                className="bg-indigo-600 text-white hover:bg-indigo-700 text-white font-black px-5 py-2.5 rounded-xl transition flex items-center gap-2 shadow-sm animate-in fade-in zoom-in duration-300"
              >
                <Scale className="h-5 w-5" />
                Compare Selected ({selectedForCompare.length})
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
        <section className="mt-8">
          <DocumentScanner />
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

      <ExplainabilityDrawer
        result={inspectResult}
        isOpen={!!inspectResult}
        onClose={() => setInspectResult(null)}
      />

      {isCatalogOpen && (
        <CatalogExplorer
          products={productsCatalog}
          onClose={() => setIsCatalogOpen(false)}
        />
      )}
    </div>
  );
}
