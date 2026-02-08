import React from 'react';
import { JournalEntry } from '../types';
import { Wind, Thermometer, Flower, AlertCircle, Pencil } from 'lucide-react';
import SeasonalBloomTracker from '../components/SeasonalBloomTracker';

interface FieldJournalProps {
  entries: JournalEntry[];
  onEdit: (entry: JournalEntry) => void;
}

const FieldJournal: React.FC<FieldJournalProps> = ({ entries, onEdit }) => {
  return (
    <div className="space-y-8 pb-24">
      <header className="mb-8 border-b border-stone-300 pb-6">
        <h1 className="text-4xl md:text-5xl font-serif text-stone-900 mb-2">The Field Journal</h1>
        <p className="text-stone-600 font-serif italic text-lg">Observations from the dunes.</p>
      </header>

      {/* Phenology Check / Bloom Tracker */}
      <SeasonalBloomTracker />

      <div className="space-y-16">
        {entries.map((entry) => (
          <article key={entry.id} className="relative pl-0 md:pl-0 group">
            
            <div className="flex flex-col md:flex-row gap-6">
              {/* Date Column (Desktop) */}
              <div className="hidden md:block w-24 flex-shrink-0 text-right pt-2 border-r border-stone-200 pr-6 mr-2">
                <span className="block text-3xl font-serif font-bold text-stone-400">
                  {new Date(entry.date).getDate()}
                </span>
                <span className="block text-stone-500 uppercase tracking-widest text-sm font-bold">
                  {new Date(entry.date).toLocaleString('default', { month: 'short' })}
                </span>
                <span className="block text-stone-400 text-xs mt-1">
                  {new Date(entry.date).getFullYear()}
                </span>
              </div>

              {/* Mobile Date Bubble */}
              <div className="md:hidden flex items-center gap-2 mb-2">
                <div className="bg-stone-100 border-2 border-stone-300 rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold text-stone-600">
                  {new Date(entry.date).getDate()}
                </div>
                <span className="text-stone-500 uppercase font-bold text-sm">
                  {new Date(entry.date).toLocaleString('default', { month: 'long' })}
                </span>
              </div>

              {/* Content Card */}
              <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden flex-1 relative">
                
                {/* Edit Button */}
                <button 
                  onClick={() => onEdit(entry)}
                  className="absolute top-4 right-4 p-2 text-stone-300 hover:text-amber-600 hover:bg-stone-50 rounded-full transition-colors z-20"
                  title="Edit Entry"
                >
                  <Pencil className="w-4 h-4" />
                </button>

                {/* Coastal Snapshot Bar */}
                <div className="bg-stone-50 border-b border-stone-200 p-4 flex flex-wrap gap-x-8 gap-y-2 text-sm text-stone-600 pr-12">
                  <div className="flex items-center gap-2" title="Temperature">
                    <Thermometer className="w-4 h-4 text-amber-600" />
                    <span className="font-semibold">{entry.weather.temperature}°F</span>
                  </div>
                  <div className="flex items-center gap-2" title="Conditions">
                    <Wind className="w-4 h-4 text-slate-500" />
                    <span>{entry.weather.condition}, {entry.weather.wind}</span>
                  </div>
                  <div className="flex items-center gap-2" title="Phenology Check">
                    <Flower className="w-4 h-4 text-green-600" />
                    <span className="italic">{entry.phenology}</span>
                  </div>
                </div>

                {/* Main Body */}
                <div className="p-6 md:p-10">
                  <div className="prose prose-stone prose-lg max-w-none">
                    <p className="font-serif leading-relaxed text-stone-800 whitespace-pre-line">
                      {entry.narrative}
                    </p>
                  </div>

                  {/* Media / Photo Integration (Gallery) */}
                  {entry.media && entry.media.length > 0 && (
                    <div className="mt-10">
                      <div className={`grid gap-4 ${entry.media.length > 1 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}>
                        {entry.media.map((item, idx) => (
                          <div key={idx} className="relative group/media rounded-lg overflow-hidden border border-stone-200 cursor-pointer shadow-sm">
                            <img 
                              src={item.url} 
                              alt={item.caption} 
                              className="w-full h-56 object-cover filter sepia-[.15] contrast-[1.1] transition-transform duration-700 group-hover/media:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover/media:opacity-100 transition-opacity flex items-end p-4">
                              <p className="text-white text-sm font-medium flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 text-amber-400" />
                                {item.caption}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <p className="mt-3 text-xs text-stone-400 text-center font-serif italic">
                        Visual Evidence — {entry.media.length} file(s) attached
                      </p>
                    </div>
                  )}

                  {/* Technical Footer - Improved Layout */}
                  <div className="mt-10 pt-8 border-t border-dashed border-stone-300">
                    <h4 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-4">Technical Log</h4>
                    
                    <div className="flex flex-col lg:flex-row gap-6 text-sm">
                      
                      {/* Vitals Column */}
                      <div className="flex-shrink-0 w-full lg:w-48 space-y-2">
                         <div className="flex justify-between items-center bg-stone-50 p-3 rounded border border-stone-100">
                           <span className="text-stone-500 font-bold text-xs uppercase">Queen</span>
                           <span className={`font-bold ${entry.technicalNotes.queenStatus === 'Queenright' ? 'text-green-700' : 'text-amber-700'}`}>
                             {entry.technicalNotes.queenStatus}
                           </span>
                         </div>
                         <div className="flex justify-between items-center bg-stone-50 p-3 rounded border border-stone-100">
                           <span className="text-stone-500 font-bold text-xs uppercase">Cluster</span>
                           <span className="font-bold text-stone-700">{entry.technicalNotes.clusterSize}</span>
                         </div>
                      </div>

                      {/* Interventions Column - Expands */}
                      {entry.technicalNotes.interventions.length > 0 && (
                         <div className="flex-1 bg-amber-50/50 p-4 rounded border border-amber-100">
                           <span className="block text-amber-800/70 text-xs font-bold uppercase mb-2">Intervention & Actions</span>
                           <ul className="list-disc list-inside space-y-1 text-stone-800 font-medium">
                             {entry.technicalNotes.interventions.map((action, i) => (
                               <li key={i} className="leading-snug">{action}</li>
                             ))}
                           </ul>
                         </div>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default FieldJournal;
