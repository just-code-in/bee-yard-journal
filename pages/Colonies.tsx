import React from 'react';
import { ColonyProfile } from '../types';
import { Activity, ShieldCheck, ThermometerSnowflake, GitBranch, HeartPulse, Pencil } from 'lucide-react';

interface ColoniesProps {
  colonies: ColonyProfile[];
  onEdit: (colony: ColonyProfile) => void;
}

const Colonies: React.FC<ColoniesProps> = ({ colonies, onEdit }) => {
  return (
    <div className="pb-24">
       <header className="mb-10 border-b border-stone-300 pb-6">
        <h1 className="text-4xl md:text-5xl font-serif text-stone-900 mb-2">The Colonies</h1>
        <p className="text-stone-600 font-serif italic text-lg">Genetic lineage and vital statistics.</p>
      </header>

      <div className="grid grid-cols-1 gap-12">
        {colonies.map((colony) => (
          <div 
            key={colony.id} 
            className={`group relative rounded-xl border-2 overflow-hidden transition-all duration-500 ${
              colony.status === 'Active' 
                ? 'bg-white border-stone-200 shadow-sm hover:shadow-md hover:border-amber-400/50' 
                : 'bg-stone-50/50 border-stone-200 border-dashed opacity-75'
            }`}
          >
            {/* Edit Button */}
            <button 
              onClick={() => onEdit(colony)}
              className="absolute top-4 right-4 p-2 text-stone-300 hover:text-amber-600 hover:bg-stone-50 rounded-full transition-colors z-20"
              title="Edit Colony Profile"
            >
              <Pencil className="w-5 h-5" />
            </button>

            {/* Header Plate */}
            <div className={`px-8 py-6 border-b flex flex-wrap gap-4 justify-between items-center ${colony.status === 'Active' ? 'bg-stone-50 border-stone-100' : 'bg-transparent border-stone-200'}`}>
              <div className="flex items-center gap-4">
                 <div className={`p-3 rounded-full border ${colony.status === 'Active' ? 'bg-white border-stone-200' : 'bg-stone-100 border-stone-300 text-stone-400'}`}>
                    {colony.type === 'Overwintered' && <ThermometerSnowflake className="w-6 h-6 text-sky-700" />}
                    {colony.type === 'Split' && <GitBranch className="w-6 h-6 text-amber-600" />}
                 </div>
                 <div>
                    <h2 className="text-3xl font-serif font-bold text-stone-800 leading-none">{colony.name}</h2>
                    <span className="font-serif italic text-stone-500 text-sm">{colony.type} Origin</span>
                 </div>
              </div>
              
              <span className={`px-4 py-1.5 text-xs font-bold uppercase tracking-widest border rounded-full ${
                colony.status === 'Active' 
                  ? 'bg-green-50 border-green-200 text-green-800' 
                  : 'bg-stone-100 border-stone-300 text-stone-500'
              }`}>
                {colony.status}
              </span>
            </div>

            <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Vital Stats Column */}
              <div className="lg:col-span-1 space-y-6">
                 <div className="bg-stone-50 p-5 rounded border border-stone-100">
                    <span className="block text-xs text-stone-400 uppercase font-bold tracking-wider mb-3">Colony Vigor</span>
                    
                    <div className="flex items-end gap-2 mb-2">
                       <span className="text-4xl font-serif font-bold text-stone-800">{colony.healthScore}</span>
                       <span className="text-sm text-stone-400 mb-1.5 font-bold">/ 100</span>
                    </div>

                    <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-stone-800 h-full rounded-full opacity-60" 
                        style={{ width: `${colony.healthScore}%` }}
                      ></div>
                   </div>
                 </div>

                 <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm border-b border-stone-100 pb-2">
                        <span className="text-stone-500 font-serif italic">Queen Lineage</span>
                        <span className="font-bold text-stone-800">{colony.queenName || "—"}</span>
                    </div>
                     <div className="flex justify-between items-center text-sm border-b border-stone-100 pb-2">
                        <span className="text-stone-500 font-serif italic">Last Inspection</span>
                        <span className="font-bold text-stone-800">
                          {colony.lastInspection.startsWith('1970') ? 'Pending' : new Date(colony.lastInspection).toLocaleDateString()}
                        </span>
                    </div>
                 </div>
              </div>

              {/* Notes Column */}
              <div className="lg:col-span-2 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Activity className="w-3 h-3" /> Field Notes
                  </h4>
                  <p className="font-serif text-lg leading-relaxed text-stone-700 bg-stone-50/50 p-4 rounded-lg border border-stone-100">
                    "{colony.notes}"
                  </p>
                </div>

                {colony.status === 'Active' && (
                  <div className="flex gap-4 mt-8 pt-6 border-t border-dashed border-stone-200">
                     <button className="flex items-center gap-2 text-sm font-bold text-stone-600 hover:text-amber-700 transition-colors">
                       <HeartPulse className="w-4 h-4" />
                       View Treatment Log
                     </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Colonies;
