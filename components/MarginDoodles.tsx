import React, { useEffect, useState, useRef } from 'react';
import { generateBotanicalSketch } from '../services/geminiService';
import { Wand2, Loader2, BookImage } from 'lucide-react';

interface DoodleDefinition {
  id: string;
  prompt: string;
  caption: string;
}

interface DoodleState extends DoodleDefinition {
  url?: string;
  rotation: number;
  isLoading: boolean;
}

// Complete library of 20 prompts
const DOODLE_LIBRARY: DoodleDefinition[] = [
  { id: 'd1', prompt: 'Scientific illustration of a honey bee wing structure, vintage style', caption: 'Fig A. Wing Venation' },
  { id: 'd2', prompt: 'Detailed pencil sketch of a honeycomb cell structure with larvae', caption: 'Brood Cells' },
  { id: 'd3', prompt: 'Vintage drawing of a California Poppy seed pod', caption: 'E. californica pod' },
  { id: 'd4', prompt: 'Sketch of a traditional hive tool', caption: 'Standard Tool' },
  { id: 'd5', prompt: 'Botanical drawing of Eucalyptus leaves and gum nuts', caption: 'E. globulus' },
  { id: 'd6', prompt: 'Pencil sketch of a bee stinger mechanism anatomy', caption: 'Morphology' },
  { id: 'd7', prompt: 'Sketch of a Sea Fig succulent leaf cross section', caption: 'C. chilensis' },
  { id: 'd8', prompt: 'Drawing of pollen grains under microscope', caption: 'Pollen Sample' },
  { id: 'd9', prompt: 'Scientific sketch of a Queen Bee marking cage plunger style', caption: 'Plunger Cage' },
  { id: 'd10', prompt: 'Vintage illustration of a bee smoker bellows', caption: 'Smoker App.' },
  { id: 'd11', prompt: 'Detailed drawing of a honey bee compound eye', caption: 'Omatidia' },
  { id: 'd12', prompt: 'Botanical sketch of wild blackberry bramble', caption: 'Rubus ursinus' },
  { id: 'd13', prompt: 'Sketch of a queen cell peanut shape on comb', caption: 'Supersedure' },
  { id: 'd14', prompt: 'Anatomical drawing of a honey bee hind leg pollen basket', caption: 'Corbicula' },
  { id: 'd15', prompt: 'Vintage sketch of a Langstroth frame sidebar', caption: 'Hoffman Frame' },
  { id: 'd16', prompt: 'Scientific illustration of Varroa destructor mite', caption: 'V. destructor' },
  { id: 'd17', prompt: 'Sketch of Propolis scraping markings on wood', caption: 'Propolis' },
  { id: 'd18', prompt: 'Botanical drawing of Lavender sprig', caption: 'Lavandula' },
  { id: 'd19', prompt: 'Sketch of worker bee proboscis details', caption: 'Mouthparts' },
  { id: 'd20', prompt: 'Vintage drawing of wax moth cocoon webbing', caption: 'G. mellonella' }
];

const CACHE_KEY = 'pomeroy_margin_sketches_v2';
const DISPLAY_COUNT = 2; // Number of doodles to show at once

const MarginDoodles: React.FC = () => {
  const [doodles, setDoodles] = useState<DoodleState[]>([]);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // 1. Load Cache
    let cache: Record<string, string> = {};
    try {
      const saved = localStorage.getItem(CACHE_KEY);
      if (saved) cache = JSON.parse(saved);
    } catch (e) {
      console.error("Failed to load doodle cache", e);
    }

    // 2. Identify Cached vs Uncached
    const cachedDefs = DOODLE_LIBRARY.filter(d => cache[d.id]);
    const uncachedDefs = DOODLE_LIBRARY.filter(d => !cache[d.id]);

    // 3. Select Doodles to Display
    // Strategy: Prefer cached images to make it feel "static". 
    // If we have few cached images, mix in some new ones to generate.
    let selectedDefs: DoodleDefinition[] = [];

    if (cachedDefs.length >= DISPLAY_COUNT) {
      // We have enough cached images, pick random ones from cache
      const shuffled = [...cachedDefs].sort(() => 0.5 - Math.random());
      selectedDefs = shuffled.slice(0, DISPLAY_COUNT);
    } else {
      // Not enough cache, take what we have and fill the rest with new ones
      selectedDefs = [...cachedDefs, ...uncachedDefs].slice(0, DISPLAY_COUNT);
    }

    // 4. Initialize State
    const initialDoodles: DoodleState[] = selectedDefs.map(def => ({
      ...def,
      url: cache[def.id] || undefined,
      rotation: Math.random() * 6 - 3, // Gentle random tilt
      isLoading: !cache[def.id],
    }));
    setDoodles(initialDoodles);

    // 5. Trigger Generation for Uncached Display Items
    // Plus: Background generate 1 extra item to build the library for next time
    const itemsToGenerate = initialDoodles.filter(d => !d.url);
    
    // If we have very few cached items overall, proactively generate a random background one from the library
    // to build up the static asset list for future visits.
    if (itemsToGenerate.length === 0 && uncachedDefs.length > 0) {
        // Pick one random uncached item to generate in background
        const backgroundItem = uncachedDefs[Math.floor(Math.random() * uncachedDefs.length)];
        // We won't add it to view, but we will generate and cache it
        generateAndCache(backgroundItem);
    }

    // Generate the visible ones
    itemsToGenerate.forEach(async (item) => {
        const url = await generateAndCache(item);
        if (url) {
            setDoodles(prev => prev.map(d => d.id === item.id ? { ...d, url, isLoading: false } : d));
        } else {
            setDoodles(prev => prev.map(d => d.id === item.id ? { ...d, isLoading: false } : d));
        }
    });

  }, []);

  const generateAndCache = async (def: DoodleDefinition): Promise<string | null> => {
    try {
        // Delay slightly to prevent UI stutter or rate limits
        await new Promise(r => setTimeout(r, Math.random() * 2000 + 1000));
        
        const url = await generateBotanicalSketch(def.prompt);
        if (url) {
            // Update Cache
            try {
                const currentCache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
                currentCache[def.id] = url;
                localStorage.setItem(CACHE_KEY, JSON.stringify(currentCache));
            } catch (e) {
                console.warn("Storage quota exceeded, could not cache image");
            }
            return url;
        }
    } catch (e) {
        console.error("Generation failed", e);
    }
    return null;
  };

  return (
    <div className="hidden lg:flex flex-col gap-16 w-48 pt-32 pr-4 opacity-90 flex-shrink-0">
      <div className="text-right border-b border-stone-300 pb-2 mb-4">
         <p className="font-serif text-xs text-stone-400 italic">Field Notes & Sketches</p>
      </div>
      {doodles.map((doodle) => (
        <div 
          key={doodle.id} 
          className="relative group transition-transform duration-500 hover:scale-105"
          style={{ transform: `rotate(${doodle.rotation}deg)` }}
        >
          {doodle.url ? (
            <div className="flex flex-col items-center">
               <img 
                 src={doodle.url} 
                 alt={doodle.caption} 
                 className="w-40 h-auto mix-blend-multiply filter sepia-[0.3] contrast-125 rounded-sm shadow-sm bg-white p-1"
               />
               <span className="font-serif text-[11px] italic text-stone-500 mt-2 font-bold">{doodle.caption}</span>
            </div>
          ) : (
            <div className="w-32 h-32 border border-dashed border-stone-300 rounded-lg flex flex-col items-center justify-center text-stone-300 gap-2 mx-auto bg-stone-50/50">
              {doodle.isLoading ? (
                 <>
                   <Loader2 className="w-5 h-5 animate-spin text-amber-500" />
                   <span className="text-[9px] font-bold uppercase tracking-widest text-center px-2">Sketching...</span>
                 </>
              ) : (
                 <>
                   <BookImage className="w-5 h-5" />
                   <span className="text-[9px] font-bold uppercase tracking-widest text-center px-2">Pending</span>
                 </>
              )}
            </div>
          )}
        </div>
      ))}
      
      {/* Footer hint */}
      <div className="mt-auto text-center opacity-50">
        <p className="text-[9px] text-stone-400 font-serif italic">
            Sketches generated by Naturalist AI
        </p>
      </div>
    </div>
  );
};

export default MarginDoodles;
