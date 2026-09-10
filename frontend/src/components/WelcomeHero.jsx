import React from 'react';

export default function WelcomeHero({ userName }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-8 mb-6 shadow-sm">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
        Welcome to AlignFin{userName ? `, ${userName}` : ''}.
      </h1>
      <p className="text-lg text-gray-700 mb-6 max-w-3xl">
        Make financial decisions with confidence. Compare products, understand the fine print, and find options that actually fit your current financial situation.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6 border-t border-gray-100 pt-6">
        <div>
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold mb-3">1</span>
          <h3 className="font-bold text-gray-900 text-sm mb-1">Tell us your situation</h3>
          <p className="text-sm text-gray-600">Enter your income, savings, and goals.</p>
        </div>
        <div>
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold mb-3">2</span>
          <h3 className="font-bold text-gray-900 text-sm mb-1">Explore Products</h3>
          <p className="text-sm text-gray-600">See personalized recommendations.</p>
        </div>
        <div>
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold mb-3">3</span>
          <h3 className="font-bold text-gray-900 text-sm mb-1">Compare Options</h3>
          <p className="text-sm text-gray-600">Review costs, risks, and lock-ins.</p>
        </div>
        <div>
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold mb-3">4</span>
          <h3 className="font-bold text-gray-900 text-sm mb-1">Analyze Documents</h3>
          <p className="text-sm text-gray-600">Upload a brochure to find hidden clauses.</p>
        </div>
      </div>
    </div>
  );
}
