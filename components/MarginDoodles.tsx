import React, { useEffect, useState, useRef } from 'react';
import { generateBotanicalSketch } from '../services/geminiService';
import { Wand2, Loader2 } from 'lucide-react';

interface Doodle {
  id: number;
  prompt: string;
  url?: string;
  rotation: number;
  caption: string;
  isLoading: boolean;
}

const DOODLE_PROMPTS = [
  { prompt: 'Scientific illustration of a honey bee wing structure, vintage style', caption: 'Fig A. Wing Venation' },
  { prompt: 'Detailed pencil sketch of a honeycomb cell structure with larvae', caption: 'Brood Cells' },
  { prompt: 'Vintage drawing of a California Poppy seed pod', caption: 'E. californica pod' },
  { prompt: 'Sketch of a traditional hive tool', caption: 'Standard Tool' },
  { prompt: 'Botanical drawing of Eucalyptus leaves and gum nuts', caption: 'E. globulus' },
  { prompt: 'Pencil sketch of a bee stinger mechanism anatomy', caption: 'Morphology' },
  { prompt: 'Sketch of a Sea Fig succulent leaf cross section', caption: 'C. chilensis' },
  { prompt: 'Drawing of pollen grains under microscope', caption: 'Pollen Sample' },
];

const MarginDoodles: React.FC = () => {
  const [doodles, setDoodles] = useState<Doodle[]>([]);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // Select only 2 random doodles to display to conserve API quota
    const shuffled = [...DOODLE_PROMPTS].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 2).map((item, index) => ({
      ...item,
      id: index,
      rotation: Math.random() * 8 - 4, // Random tilt
      isLoading: true, // Start in loading state
    }));
    setDoodles(selected);

    // Auto-generate images one by one with significant delay
    const loadImages = async () => {
      // Small initial delay so page renders first
      await new Promise(r => setTimeout(r, 1000));
      
      for (const item of selected) {
        try {
          // Add a 5-second delay between requests to avoid 429 errors
          await new Promise(r => setTimeout(r, 5000));
          const url = await generateBotanicalSketch(item.prompt);
          if (url) {
            setDoodles(prev => prev.map(d => d.id === item.id ? { ...d, url, isLoading: false } : d));
          } else {
             setDoodles(prev => prev.map(d => d.id === item.id ? { ...d, isLoading: false } : d));
          }
        } catch (e) {
          console.error(e);
          setDoodles(prev => prev.map(d => d.id === item.id ? { ...d, isLoading: false } : d));
        }
      }
    };

    loadImages();
  }, []);

  return (
    <div className="hidden lg:flex flex-col gap-16 w-48 pt-32 pr-4 opacity-90 flex-shrink-0">
      <div className="text-right border-b border-stone-300 pb-2 mb-4">
         <p className="font-serif text-xs text-stone-400 italic">Fig. Reference</p>
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
                   <Wand2 className="w-5 h-5" />
                   <span className="text-[9px] font-bold uppercase tracking-widest text-center px-2">Pending</span>
                 </>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MarginDoodles;
