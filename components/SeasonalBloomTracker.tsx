import React, { useState } from 'react';
import { Flora } from '../types';
import { Sprout, Droplets, Sun, Wand2, Loader2, Calendar } from 'lucide-react';
import { generateBotanicalSketch } from '../services/geminiService';

const INITIAL_FLORA: Flora[] = [
  {
    id: 'f1',
    commonName: 'Rosemary',
    scientificName: 'Salvia rosmarinus',
    type: 'Both',
    bloomMonths: [0, 1, 2, 3, 4, 10, 11],
    peakMonths: [1, 2, 3],
    color: 'bg-indigo-400'
  },
  {
    id: 'f2',
    commonName: 'Sea Fig',
    scientificName: 'Carpobrotus chilensis',
    type: 'Nectar',
    bloomMonths: [3, 4, 5, 6, 7],
    peakMonths: [4, 5, 6],
    color: 'bg-rose-400'
  },
  {
    id: 'f3',
    commonName: 'Monterey Cypress',
    scientificName: 'Hesperocyparis macrocarpa',
    type: 'Pollen',
    bloomMonths: [0, 1, 11],
    peakMonths: [0, 1],
    color: 'bg-amber-400'
  },
   {
    id: 'f4',
    commonName: 'Pride of Madeira',
    scientificName: 'Echium candicans',
    type: 'Both',
    bloomMonths: [2, 3, 4, 5, 6],
    peakMonths: [3, 4, 5],
    color: 'bg-violet-500'
  },
  {
    id: 'f5',
    commonName: 'California Poppy',
    scientificName: 'Eschscholzia californica',
    type: 'Pollen',
    bloomMonths: [1, 2, 3, 4, 5, 6, 7, 8],
    peakMonths: [2, 3, 4, 5],
    color: 'bg-orange-400'
  },
  {
    id: 'f6',
    commonName: 'Blue Gum Eucalyptus',
    scientificName: 'Eucalyptus globulus',
    type: 'Nectar',
    bloomMonths: [0, 1, 2, 3, 4, 10, 11],
    peakMonths: [11, 0, 1, 2],
    color: 'bg-teal-500'
  }
];

const MONTHS = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
const CACHE_KEY = 'pomeroy_botanical_sketches_v1';

const SeasonalBloomTracker: React.FC = () => {
  // Initialize state by checking localStorage first
  const [flora, setFlora] = useState<Flora[]>(() => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const urlMap = JSON.parse(cached);
        return INITIAL_FLORA.map(plant => ({
          ...plant,
          sketchUrl: urlMap[plant.id] || undefined
        }));
      }
    } catch (e) {
      console.error("Failed to load cached sketches:", e);
    }
    return INITIAL_FLORA;
  });

  const [generatingId, setGeneratingId] = useState<string | null>(null);
  
  const currentMonthIndex = new Date().getMonth();
  const activeFlora = flora.filter(f => f.bloomMonths.includes(currentMonthIndex));

  const handleGenerateSketch = async (plant: Flora) => {
    setGeneratingId(plant.id);
    const sketch = await generateBotanicalSketch(plant.commonName);
    if (sketch) {
      setFlora(prev => {
        const updated = prev.map(p => p.id === plant.id ? { ...p, sketchUrl: sketch } : p);
        
        // Persist to localStorage
        try {
          const cacheMap = updated.reduce((acc, item) => {
            if (item.sketchUrl) acc[item.id] = item.sketchUrl;
            return acc;
          }, {} as Record<string, string>);
          localStorage.setItem(CACHE_KEY, JSON.stringify(cacheMap));
        } catch (e) {
          console.warn("Quota exceeded or storage error:", e);
        }
        
        return updated;
      });
    }
    setGeneratingId(null);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden mb-8">
      <div className="bg-stone-50 px-4 py-3 border-b border-stone-200 flex justify-between items-center">
        <div className="flex items-center gap-2">
           <Sprout className="w-4 h-4 text-green-700" />
           <h2 className="font-serif font-bold text-stone-800 text-lg">Seasonal Bloom Tracker</h2>
        </div>
        <div className="flex items-center gap-2 text-stone-500 text-xs font-sans">
           <Calendar className="w-3 h-3" />
           <span className="italic">{new Date().toLocaleString('default', { month: 'long' })} Overview</span>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        {activeFlora.map(plant => {
          const isPeaking = plant.peakMonths.includes(currentMonthIndex);
          return (
            <div key={plant.id} className="flex gap-4 items-start group">
              {/* Image / Sketch Area */}
              <div className="relative w-20 h-20 bg-stone-100 rounded-lg overflow-hidden border border-stone-200 flex-shrink-0 shadow-inner">
                {plant.sketchUrl ? (
                  <img src={plant.sketchUrl} alt={plant.commonName} className="w-full h-full object-cover filter sepia contrast-125 mix-blend-multiply" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-stone-400 gap-1 bg-stone-50 hover:bg-stone-100 transition-colors cursor-pointer" onClick={() => handleGenerateSketch(plant)}>
                    {generatingId === plant.id ? (
                      <Loader2 className="w-6 h-6 animate-spin text-amber-600" />
                    ) : (
                      <>
                        <Wand2 className="w-5 h-5 opacity-40" />
                        <span className="text-[9px] font-bold uppercase tracking-widest text-center px-1">Sketch</span>
                      </>
                    )}
                    <button 
                      className="absolute inset-0 z-10 bg-transparent"
                      disabled={generatingId === plant.id}
                      title="Click to generate Botanical Sketch"
                    />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                   <div>
                      <p className="font-serif font-bold text-stone-800 text-lg leading-tight">{plant.commonName}</p>
                      <p className="font-serif italic text-stone-500 text-xs">{plant.scientificName}</p>
                   </div>
                   <div className="flex gap-1">
                      {plant.type.match(/Nectar|Both/) && <Droplets className="w-3 h-3 text-amber-500" title="Nectar Source" />}
                      {plant.type.match(/Pollen|Both/) && <Sun className="w-3 h-3 text-yellow-500" title="Pollen Source" />}
                   </div>
                </div>

                {/* Timeline Bar */}
                <div className="flex gap-0.5 mt-3 h-2 w-full max-w-[200px]">
                    {MONTHS.map((m, idx) => {
                      const isBloom = plant.bloomMonths.includes(idx);
                      const isPeak = plant.peakMonths.includes(idx);
                      const isCurrent = idx === currentMonthIndex;
                      
                      let bgClass = 'bg-stone-100';
                      if (isPeak) bgClass = plant.color.replace('400', '600').replace('500', '700');
                      else if (isBloom) bgClass = plant.color;

                      return (
                        <div 
                          key={idx} 
                          className={`flex-1 rounded-sm relative ${bgClass} ${isCurrent ? 'ring-1 ring-stone-800 ring-offset-0 z-10' : 'opacity-70'}`}
                          title={`${m} - ${isPeak ? 'Peak' : isBloom ? 'Bloom' : ''}`}
                        />
                      );
                    })}
                </div>
                
                <div className="mt-1">
                   {isPeaking ? (
                     <span className="text-[10px] text-amber-700 font-bold uppercase tracking-wider">Peak Bloom</span>
                   ) : (
                     <span className="text-[10px] text-green-700 font-bold uppercase tracking-wider">In Bloom</span>
                   )}
                </div>
              </div>
            </div>
          );
        })}
        {activeFlora.length === 0 && (
          <p className="col-span-2 text-center text-stone-500 italic py-4">No key flora currently in bloom.</p>
        )}
      </div>
    </div>
  );
};

export default SeasonalBloomTracker;
