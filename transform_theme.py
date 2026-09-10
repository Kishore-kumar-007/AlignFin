import os
import re

replacements = {
    r'bg-slate-950': 'bg-gray-50',
    r'bg-slate-900/60': 'bg-white',
    r'bg-slate-900/90': 'bg-white/90',
    r'bg-slate-900/50': 'bg-gray-50',
    r'bg-slate-900': 'bg-white',
    r'bg-slate-800/80': 'bg-gray-100',
    r'bg-slate-800/60': 'bg-gray-50',
    r'bg-slate-800/50': 'bg-gray-100',
    r'bg-slate-800': 'bg-gray-100',
    r'bg-slate-700/70': 'bg-gray-200',
    r'bg-slate-700': 'bg-gray-200',
    
    r'border-slate-800/50': 'border-gray-200',
    r'border-slate-800': 'border-gray-200',
    r'border-slate-700/70': 'border-gray-200',
    r'border-slate-700': 'border-gray-200',
    
    r'text-slate-100': 'text-gray-900',
    r'text-white': 'text-gray-900',
    r'text-slate-200': 'text-gray-800',
    r'text-slate-300': 'text-gray-700',
    r'text-slate-400': 'text-gray-600',
    r'text-slate-500': 'text-gray-500',
    
    r'text-emerald-400': 'text-indigo-600',
    r'text-emerald-300': 'text-indigo-700',
    r'bg-emerald-500/15': 'bg-indigo-50',
    r'bg-emerald-500/10': 'bg-indigo-50',
    r'bg-emerald-500/20': 'bg-indigo-100',
    r'bg-emerald-500': 'bg-indigo-600 text-white',
    r'hover:bg-emerald-400': 'hover:bg-indigo-700',
    r'border-emerald-500/40': 'border-indigo-200',
    r'border-emerald-500/30': 'border-indigo-200',
    r'border-emerald-500': 'border-indigo-600',
    
    r'text-rose-400': 'text-red-600',
    r'text-rose-300': 'text-red-700',
    r'bg-rose-500/20': 'bg-red-50',
    r'bg-rose-500/10': 'bg-red-50',
    r'bg-rose-500': 'bg-red-600 text-white',
    r'border-rose-500/30': 'border-red-200',
    r'border-rose-500/40': 'border-red-200',
    r'border-rose-500': 'border-red-600',
    
    r'text-amber-400': 'text-yellow-700',
    r'text-amber-300': 'text-yellow-800',
    r'bg-amber-500/20': 'bg-yellow-50',
    r'bg-amber-500/10': 'bg-yellow-50',
    r'bg-amber-500': 'bg-yellow-600 text-white',
    r'border-amber-500/30': 'border-yellow-200',
    
    r'text-blue-400': 'text-blue-700',
    r'text-blue-300': 'text-blue-800',
    r'bg-blue-900/10': 'bg-blue-50',
    r'bg-blue-500/20': 'bg-blue-50',
    r'border-blue-900/30': 'border-blue-200',
    
    r'bg-gradient-to-tr': 'bg-indigo-600',
    r'from-emerald-600 to-teal-400': '',
    r'bg-gradient-to-br': 'bg-indigo-600',
    r'from-white via-slate-200 to-emerald-400 bg-clip-text text-transparent': 'text-indigo-800',
    r'text-transparent': '',
    r'bg-clip-text': '',
    
    r'shadow-lg shadow-emerald-500/20': 'shadow-sm',
    r'shadow-emerald-500/20': '',
    
    r'glass-card': 'bg-white border border-gray-200 rounded-xl shadow-sm',
    r'glass-panel': 'bg-white border border-gray-200 rounded-xl shadow-sm',
    
    # Some specific fixes
    r'text-slate-950': 'text-white' # Buttons usually have this
}

def process_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()
    
    for old, new in replacements.items():
        content = re.sub(old, new, content)
        
    with open(filepath, 'w') as f:
        f.write(content)

for root, dirs, files in os.walk('frontend/src'):
    for file in files:
        if file.endswith('.jsx') or file.endswith('.js'):
            process_file(os.path.join(root, file))

process_file('frontend/index.html')
