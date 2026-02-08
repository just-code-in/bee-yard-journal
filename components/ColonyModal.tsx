import React, { useState, useEffect } from 'react';
import { X, Save, Activity, Crown, Thermometer } from 'lucide-react';
import { ColonyProfile } from '../types';

interface ColonyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (colony: ColonyProfile) => void;
  initialData?: ColonyProfile | null;
}

const ColonyModal: React.FC<ColonyModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState<Partial<ColonyProfile>>({});

  useEffect(() => {
    if (isOpen && initialData) {
      setFormData(initialData);
    }
  }, [isOpen, initialData]);

  if (!isOpen || !initialData) return null;

  const handleSave = () => {
    if (formData.name && formData.id) {
       onSave(formData as ColonyProfile);
    }
  };

  // Helper to format ISO date string to YYYY-MM-DD for input
  const formatDateForInput = (isoString?: string) => {
    if (!isoString) return '';
    return isoString.split('T')[0];
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-stone-100 w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-stone-900 p-4 flex justify-between items-center text-stone-100">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-amber-500" />
            <h2 className="text-xl font-serif text-stone-100">Edit Colony Profile</h2>
          </div>
          <button onClick={onClose} className="hover:text-amber-500"><X /></button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* Identity Section */}
          <div className="bg-white p-4 rounded-lg border border-stone-200 shadow-sm">
            <h4 className="text-stone-500 text-xs uppercase tracking-wider font-bold mb-4 border-b border-stone-100 pb-2">Colony Identity</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-xs font-bold text-stone-600">Colony Name</span>
                <input 
                  type="text" 
                  value={formData.name || ''}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="block w-full mt-1 p-2 rounded bg-stone-50 border border-stone-300 text-stone-800 focus:ring-1 focus:ring-amber-500 outline-none font-serif text-lg"
                />
              </label>
              
              <div className="grid grid-cols-2 gap-2">
                <label className="block">
                  <span className="text-xs font-bold text-stone-600">Origin Type</span>
                  <select 
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value as any})}
                    className="block w-full mt-1 p-2 rounded bg-stone-50 border border-stone-300 text-stone-800 focus:ring-1 focus:ring-amber-500 outline-none text-sm"
                  >
                    <option value="Overwintered">Overwintered</option>
                    <option value="Split">Split</option>
                    <option value="Swarm">Swarm</option>
                  </select>
                </label>
                <label className="block">
                  <span className="text-xs font-bold text-stone-600">Current Status</span>
                  <select 
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                    className="block w-full mt-1 p-2 rounded bg-stone-50 border border-stone-300 text-stone-800 focus:ring-1 focus:ring-amber-500 outline-none text-sm"
                  >
                    <option value="Active">Active</option>
                    <option value="Planned">Planned</option>
                    <option value="Collapsed">Collapsed</option>
                  </select>
                </label>
              </div>
            </div>
          </div>

          {/* Vitals Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="bg-white p-4 rounded-lg border border-stone-200 shadow-sm">
                <h4 className="text-stone-500 text-xs uppercase tracking-wider font-bold mb-3 flex items-center gap-2">
                  <Crown className="w-3 h-3 text-amber-600" /> Queen Status
                </h4>
                <label className="block">
                  <span className="text-xs font-bold text-stone-400">Queen Name / ID</span>
                  <input 
                    type="text" 
                    value={formData.queenName || ''}
                    onChange={(e) => setFormData({...formData, queenName: e.target.value})}
                    placeholder="e.g. Unmarked, Blue Dot"
                    className="block w-full mt-1 p-2 rounded bg-stone-50 border border-stone-300 text-stone-800 focus:ring-1 focus:ring-amber-500 outline-none text-sm"
                  />
                </label>
             </div>

             <div className="bg-white p-4 rounded-lg border border-stone-200 shadow-sm">
                <h4 className="text-stone-500 text-xs uppercase tracking-wider font-bold mb-3 flex items-center gap-2">
                  <Thermometer className="w-3 h-3 text-red-600" /> Vitals
                </h4>
                
                <div className="space-y-3">
                  <label className="block">
                    <div className="flex justify-between">
                      <span className="text-xs font-bold text-stone-400">Health Score</span>
                      <span className="text-xs font-bold text-stone-800">{formData.healthScore}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={formData.healthScore || 0}
                      onChange={(e) => setFormData({...formData, healthScore: parseInt(e.target.value)})}
                      className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-amber-600 mt-1"
                    />
                  </label>
                  
                  <label className="block">
                    <span className="text-xs font-bold text-stone-400">Last Inspection</span>
                    <input 
                      type="date" 
                      value={formatDateForInput(formData.lastInspection)}
                      onChange={(e) => setFormData({...formData, lastInspection: new Date(e.target.value).toISOString()})}
                      className="block w-full mt-1 p-2 rounded bg-stone-50 border border-stone-300 text-stone-800 focus:ring-1 focus:ring-amber-500 outline-none text-sm"
                    />
                  </label>
                </div>
             </div>
          </div>

          {/* Notes Section */}
          <div className="bg-amber-50/50 p-4 rounded-lg border border-amber-100">
             <h4 className="text-amber-800/70 text-xs font-bold uppercase mb-2">Technical Field Notes</h4>
             <textarea 
               value={formData.notes || ''}
               onChange={(e) => setFormData({...formData, notes: e.target.value})}
               className="w-full bg-white border border-stone-200 rounded p-3 text-stone-800 focus:ring-1 focus:ring-amber-500 outline-none font-serif text-base leading-relaxed h-32 resize-none"
               placeholder="Current observations on cluster size, temperament, and resources..."
             />
          </div>

          <div className="flex justify-end pt-4 border-t border-stone-200">
             <button 
               onClick={handleSave}
               className="bg-amber-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-amber-700 flex items-center gap-2 transition-colors shadow-sm"
             >
               <Save className="w-5 h-5" />
               <span>Save Profile</span>
             </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ColonyModal;
