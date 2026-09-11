import React, { useState } from 'react';
import { User, Mail, DollarSign, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ProfileViewer({ profile, email }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  if (!profile) return null;

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-fintech-bg hover:bg-gray-100 border border-fintech-border px-3 py-1.5 rounded-xl transition-colors"
      >
        <div className="w-6 h-6 rounded-full bg-fintech-accent flex items-center justify-center text-white font-bold text-sm">
          {profile.name ? profile.name.charAt(0).toUpperCase() : (email ? email.charAt(0).toUpperCase() : 'U')}
        </div>
        <span className="text-sm font-semibold text-fintech-primary hidden sm:block">
          {profile.name || email?.split('@')[0]}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 fintech-card z-50 overflow-hidden shadow-lg border-fintech-border">
          <div className="bg-fintech-bg p-4 border-b border-fintech-border">
            <h3 className="font-bold text-fintech-primary text-lg">My Profile</h3>
            <p className="text-fintech-secondary text-sm flex items-center gap-1 mt-1">
              <Mail className="w-3 h-3" />
              {email || 'user@example.com'}
            </p>
          </div>
          
          <div className="p-4 space-y-4 bg-white">
            <p className="text-xs font-bold uppercase text-gray-400 mb-2 tracking-wider">Financial Snapshot</p>
            
            <div className="flex justify-between items-center border-b border-gray-100 pb-2">
              <span className="text-sm text-fintech-secondary flex items-center gap-2"><User className="w-4 h-4"/> Age</span>
              <span className="font-semibold text-fintech-primary">{profile.age || 25}</span>
            </div>
            
            <div className="flex justify-between items-center border-b border-gray-100 pb-2">
              <span className="text-sm text-fintech-secondary flex items-center gap-2"><DollarSign className="w-4 h-4"/> Monthly Income</span>
              <span className="font-semibold text-fintech-primary">₹{profile.monthly_income?.toLocaleString() || 0}</span>
            </div>
            
            <div className="flex justify-between items-center border-b border-gray-100 pb-2">
              <span className="text-sm text-fintech-secondary flex items-center gap-2"><DollarSign className="w-4 h-4"/> Monthly Expenses</span>
              <span className="font-semibold text-fintech-primary">₹{profile.monthly_expenses?.toLocaleString() || 0}</span>
            </div>
            
            <div className="flex justify-between items-center border-b border-gray-100 pb-2">
              <span className="text-sm text-fintech-secondary flex items-center gap-2"><DollarSign className="w-4 h-4"/> Current Savings</span>
              <span className="font-semibold text-fintech-primary">₹{profile.current_savings?.toLocaleString() || 0}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-fintech-secondary flex items-center gap-2"><Activity className="w-4 h-4"/> Risk Profile</span>
              <span className="font-semibold text-fintech-primary capitalize">{profile.risk_tolerance?.toLowerCase() || 'Moderate'}</span>
            </div>
          </div>
          
          <div className="bg-fintech-bg p-3 border-t border-fintech-border flex justify-between gap-3">
            <button 
              onClick={() => {
                setIsOpen(false);
                navigate('/onboarding');
              }}
              className="flex-1 bg-white hover:bg-gray-50 border border-fintech-border text-fintech-primary font-semibold py-2 rounded-lg text-sm transition text-center"
            >
              Edit Profile
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
