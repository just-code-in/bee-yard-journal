import React from 'react';
import { ColonyProfile } from '../types';
import { Activity, ShieldCheck, ThermometerSnowflake, GitBranch } from 'lucide-react';

interface ColoniesProps {
  colonies: ColonyProfile[];
}

const Colonies: React.FC<ColoniesProps> = ({ colonies }) => {
  return (
    <div className="max-w-5xl mx-auto pb-24">
       <header className="mb-10 border-b border-stone-300 pb-6">
        <h1 className="text-4xl font-serif text-stone-900 mb-2">The Colonies</h1>
        <p className="text-stone-600 font-serif italic text-lg">Genetic lineage and vital statistics.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {colonies.map((colony) => (
          <div 
            key={colony.id} 
            className={`rounded-xl border-2 overflow-hidden transition-all duration-300 ${
              colony.status === 'Active' 
                ? 'bg-white border-amber-500/30 shadow-md hover:shadow-xl hover:border-amber-500' 
                : 'bg-stone-50 border-stone-200 border-dashed opacity-80'
            }`}
          >
            <div className={`p-6 border-b ${colony.status === 'Active' ? 'bg-amber-50 border-amber-100' : 'bg-stone-100 border-stone-200'}`}>
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-serif font-bold text-stone-800">{colony.name}</h2>
                  <span className={`inline-block mt-1 px-2 py-0.5 text-xs font-bold uppercase tracking-wider rounded-full ${
                    colony.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-stone-200 text-stone-600'
                  }`}>
                    {colony.status}
                  </span>
                </div>
                {colony.type === 'Overwintered' && <ThermometerSnowflake className="text-blue-400 w-8 h-8" />}
                {colony.type === 'Split' && <GitBranch className="text-amber-400 w-8 h-8" />}
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                   <p className="text-xs text-stone-400 uppercase font-bold tracking-wider">Health Score</p>
                   <div className="w-full bg-stone-200 rounded-full h-3 mt-1">
                      <div 
                        className="bg-gradient-to-r from-amber-400 to-green-500 h-3 rounded-full" 
                        style={{ width: `${colony.healthScore}%` }}
                      ></div>
                   </div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-stone-700">{colony.healthScore}</span>
                  <span className="text-xs text-stone-400">/100</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="bg-stone-50 p-3 rounded border border-stone-100">
                    <span className="block text-xs text-stone-400 uppercase font-bold">Queen</span>
                    <span className="text-stone-800 font-serif text-lg">{colony.queenName || "Pending..."}</span>
                 </div>
                 <div className="bg-stone-50 p-3 rounded border border-stone-100">
                    <span className="block text-xs text-stone-400 uppercase font-bold">Last Inspection</span>
                    <span className="text-stone-800 font-serif text-lg">{new Date(colony.lastInspection).toLocaleDateString()}</span>
                 </div>
              </div>

              <div className="prose prose-sm prose-stone">
                 <h4 className="text-xs font-bold text-stone-500 uppercase">Notes</h4>
                 <p>{colony.notes}</p>
              </div>

              {colony.status === 'Active' && (
                <div className="pt-4 border-t border-stone-100 flex gap-2">
                   <button className="flex-1 py-2 text-sm font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 rounded transition-colors flex justify-center items-center gap-2">
                     <Activity className="w-4 h-4" /> View Treatment Log
                   </button>
                   <button className="flex-1 py-2 text-sm font-bold text-stone-600 bg-stone-100 hover:bg-stone-200 rounded transition-colors flex justify-center items-center gap-2">
                     <ShieldCheck className="w-4 h-4" /> Compliance
                   </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Colonies;
