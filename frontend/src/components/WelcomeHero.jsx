import React from 'react';

export default function WelcomeHero({ userName }) {
  return (
    <div className="fintech-card p-8 mb-6">
      <h1 className="text-3xl font-extrabold text-fintech-primary mb-2">
        Welcome to AlignFin{userName ? `, ${userName}` : ''}.
      </h1>
      <p className="text-lg text-fintech-secondary mb-6 max-w-3xl">
        Make financial decisions with confidence. Compare products, understand the fine print, and find options that actually fit your current financial situation.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6 border-t border-fintech-border pt-6">
        <div>
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-fintech-bg text-fintech-accent font-bold mb-3 border border-fintech-border">1</span>
          <h3 className="font-bold text-fintech-primary text-sm mb-1">Set your context</h3>
          <p className="text-sm text-fintech-secondary">Update your income, savings, and goals.</p>
        </div>
        <div>
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-fintech-bg text-fintech-accent font-bold mb-3 border border-fintech-border">2</span>
          <h3 className="font-bold text-fintech-primary text-sm mb-1">Explore Products</h3>
          <p className="text-sm text-fintech-secondary">See personalized recommendations.</p>
        </div>
        <div>
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-fintech-bg text-fintech-accent font-bold mb-3 border border-fintech-border">3</span>
          <h3 className="font-bold text-fintech-primary text-sm mb-1">Compare Options</h3>
          <p className="text-sm text-fintech-secondary">Review costs, risks, and lock-ins.</p>
        </div>
        <div>
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-fintech-bg text-fintech-accent font-bold mb-3 border border-fintech-border">4</span>
          <h3 className="font-bold text-fintech-primary text-sm mb-1">Check Documents</h3>
          <p className="text-sm text-fintech-secondary">Upload a policy to find hidden clauses.</p>
        </div>
      </div>
    </div>
  );
}
