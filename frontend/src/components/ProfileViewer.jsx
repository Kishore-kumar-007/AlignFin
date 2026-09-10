import React, { useState } from 'react';
import { User, Mail, DollarSign, Target, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ProfileViewer({ profile, email }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  if (!profile) return null;

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 border border-gray-200 px-3 py-1.5 rounded-full transition-colors"
      >
        <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-gray-900 font-bold text-sm">
          {profile.name ? profile.name.charAt(0) : (email ? email.charAt(0).toUpperCase() : 'U')}
        </div>
        <span className="text-sm font-semibold text-gray-900 hidden sm:block">Profile</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 overflow-hidden">
          <div className="bg-gray-100 p-4 border-b border-gray-200">
            <h3 className="font-bold text-gray-900 text-lg">My Profile</h3>
            <p className="text-gray-600 text-sm flex items-center gap-1 mt-1">
              <Mail className="w-3 h-3" />
              {email || 'user@example.com'}
            </p>
          </div>
          
          <div className="p-4 space-y-4">
            <p className="text-xs font-bold uppercase text-gray-500 mb-2 tracking-wider">Your financial snapshot</p>
            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
              <span className="text-sm text-gray-600 flex items-center gap-2"><User className="w-4 h-4"/> Name</span>
              <span className="font-semibold text-gray-900">{profile.name || 'User'}</span>
            </div>
            
            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
              <span className="text-sm text-gray-600 flex items-center gap-2"><User className="w-4 h-4"/> Age</span>
              <span className="font-semibold text-gray-900">{profile.age || 25}</span>
            </div>
            
            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
              <span className="text-sm text-gray-600 flex items-center gap-2"><DollarSign className="w-4 h-4"/> Monthly Income</span>
              <span className="font-semibold text-indigo-600">₹{profile.monthly_income?.toLocaleString() || 0}</span>
            </div>
            
            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
              <span className="text-sm text-gray-600 flex items-center gap-2"><DollarSign className="w-4 h-4"/> Monthly Expenses</span>
              <span className="font-semibold text-red-600">₹{profile.monthly_expenses?.toLocaleString() || 0}</span>
            </div>
            
            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
              <span className="text-sm text-gray-600 flex items-center gap-2"><DollarSign className="w-4 h-4"/> Current Savings</span>
              <span className="font-semibold text-blue-700">₹{profile.current_savings?.toLocaleString() || 0}</span>
            </div>

            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
              <span className="text-sm text-gray-600 flex items-center gap-2"><Target className="w-4 h-4"/> Financial Goal</span>
              <span className="font-semibold text-gray-900 capitalize">{profile.financial_goal?.replace('_', ' ') || 'Wealth Creation'}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 flex items-center gap-2"><Activity className="w-4 h-4"/> Risk Profile</span>
              <span className="font-semibold text-gray-900 capitalize">{profile.risk_tolerance?.toLowerCase() || 'Moderate'}</span>
            </div>
          </div>
          
          <div className="bg-gray-100 p-3 border-t border-gray-200 flex justify-between gap-3">
            <button 
              onClick={() => {
                setIsOpen(false);
                navigate('/onboarding');
              }}
              className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 rounded-lg text-sm transition text-center"
            >
              Edit Profile
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
