import React, { useState, useEffect } from 'react';
import { X, Mic, Loader2, Save } from 'lucide-react';
import { parseFieldNotes } from '../services/geminiService';
import { JournalEntry } from '../types';

interface NewEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (entry: JournalEntry) => void;
  initialData?: JournalEntry | null;
}

const NewEntryModal: React.FC<NewEntryModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [rawNotes, setRawNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewData, setPreviewData] = useState<Partial<JournalEntry> | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setPreviewData(initialData);
        setRawNotes(initialData.narrative);
      } else {
        setRawNotes('');
        setPreviewData(null);
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleProcess = async () => {
    if (!rawNotes.trim()) return;
    setIsProcessing(true);
    try {
      const result = await parseFieldNotes(rawNotes);
      setPreviewData(prev => ({ ...prev, ...result }));
    } catch (e) {
      alert("Failed to parse notes. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSave = () => {
    if (previewData) {
      const newEntry: JournalEntry = {
        id: initialData?.id || previewData.id || crypto.randomUUID(),
        date: initialData?.date || previewData.date || new Date().toISOString(),
        author: previewData.author || "Justin Simpson",
        weather: previewData.weather || { temperature: 60, condition: "Unknown", wind: "Calm" },
        phenology: previewData.phenology || "None noted",
        narrative: previewData.narrative || rawNotes,
        technicalNotes: previewData.technicalNotes || {
          clusterSize: "Unknown",
          queenStatus: "Unknown",
          interventions: [],
          diseases: []
        },
        tags: previewData.tags || [],
        media: initialData?.media || []
      };
      onSave(newEntry);
      onClose();
      setRawNotes('');
      setPreviewData(null);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-stone-100 w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-stone-900 p-4 flex justify-between items-center text-stone-100">
          <h2 className="text-xl font-serif text-amber-500">{initialData ? 'Edit Log Entry' : 'New Field Entry'}</h2>
          <button onClick={onClose} className="hover:text-amber-500"><X /></button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {!previewData ? (
            <div className="space-y-4">
              <label className="block text-stone-700 font-serif text-lg">
                Voice/Messy Notes
                <span className="block text-sm text-stone-500 font-sans mt-1">
                  Dictate conditions, colony mood, and actions. The AI will structure it.
                </span>
              </label>
              <textarea
                className="w-full h-48 p-4 bg-white border border-stone-300 rounded-lg shadow-inner focus:ring-2 focus:ring-amber-500 focus:border-transparent font-mono text-stone-800 placeholder:text-stone-400"
                placeholder="e.g., 'Wind is picking up, 55 degrees. Founder colony looks strong but small cluster. Saw the queen. Added pollen patty...'"
                value={rawNotes}
                onChange={(e) => setRawNotes(e.target.value)}
              />
              <div className="flex justify-end pt-2">
                <button 
                  onClick={handleProcess}
                  disabled={isProcessing || !rawNotes}
                  className="bg-stone-800 text-white px-6 py-3 rounded-lg flex items-center space-x-2 hover:bg-stone-700 disabled:opacity-50 transition-colors"
                >
                  {isProcessing ? <Loader2 className="animate-spin" /> : <Mic className="w-5 h-5" />}
                  <span>{isProcessing ? 'Naturalist AI Processing...' : 'Process Notes'}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="border-l-4 border-amber-500 pl-4 bg-amber-50 p-4 rounded-r-lg">
                <h3 className="font-serif text-xl text-stone-900 mb-2">The Naturalist's Draft</h3>
                <textarea 
                  value={previewData.narrative} 
                  onChange={(e) => setPreviewData({...previewData, narrative: e.target.value})}
                  className="w-full bg-transparent border-0 p-0 text-stone-800 leading-relaxed font-serif focus:ring-0 resize-none"
                  rows={6}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg border border-stone-200 shadow-sm">
                  <h4 className="text-stone-500 text-xs uppercase tracking-wider font-bold mb-2">Weather</h4>
                  <div className="flex gap-2">
                    <input 
                      type="number"
                      value={previewData.weather?.temperature}
                      onChange={(e) => setPreviewData({...previewData, weather: {...previewData.weather!, temperature: parseInt(e.target.value)}})}
                      className="w-16 p-2 border border-stone-300 rounded bg-white text-stone-800 font-mono focus:ring-1 focus:ring-amber-500 outline-none"
                    />
                    <span className="self-center text-stone-600 font-serif">°F</span>
                  </div>
                  <input 
                    type="text" 
                    value={previewData.weather?.condition}
                    onChange={(e) => setPreviewData({...previewData, weather: {...previewData.weather!, condition: e.target.value}})}
                    className="w-full mt-2 p-2 border border-stone-300 rounded text-sm bg-white text-stone-800 focus:ring-1 focus:ring-amber-500 outline-none" 
                  />
                </div>
                <div className="bg-white p-4 rounded-lg border border-stone-200 shadow-sm">
                  <h4 className="text-stone-500 text-xs uppercase tracking-wider font-bold mb-2">Phenology</h4>
                  <textarea 
                    value={previewData.phenology}
                    onChange={(e) => setPreviewData({...previewData, phenology: e.target.value})}
                    className="w-full text-stone-800 italic text-sm p-2 border border-stone-300 rounded h-20 bg-white focus:ring-1 focus:ring-amber-500 outline-none resize-none"
                  />
                </div>
              </div>

              <div className="bg-stone-200 p-4 rounded-lg">
                <h4 className="text-stone-600 font-bold mb-2 text-sm uppercase">Technical Data (Manual Override)</h4>
                <div className="grid grid-cols-2 gap-4">
                  <label className="text-xs font-bold text-stone-500">
                    Queen Status
                    <select 
                       value={previewData.technicalNotes?.queenStatus}
                       onChange={(e) => setPreviewData({...previewData, technicalNotes: {...previewData.technicalNotes!, queenStatus: e.target.value as any}})}
                       className="block w-full mt-1 p-2 rounded bg-white border border-stone-300 text-stone-800 focus:ring-1 focus:ring-amber-500 outline-none"
                    >
                      <option>Queenright</option>
                      <option>Queenless</option>
                      <option>Virgin</option>
                      <option>Unknown</option>
                    </select>
                  </label>
                  <label className="text-xs font-bold text-stone-500">
                    Cluster Size
                    <input 
                      type="text" 
                      value={previewData.technicalNotes?.clusterSize}
                      onChange={(e) => setPreviewData({...previewData, technicalNotes: {...previewData.technicalNotes!, clusterSize: e.target.value}})}
                      className="block w-full mt-1 p-2 rounded bg-white border border-stone-300 text-stone-800 focus:ring-1 focus:ring-amber-500 outline-none"
                    />
                  </label>
                </div>
                <label className="block mt-3 text-xs font-bold text-stone-500">
                  Interventions (Comma separated)
                  <textarea 
                    value={previewData.technicalNotes?.interventions?.join(', ')}
                    onChange={(e) => setPreviewData({...previewData, technicalNotes: {...previewData.technicalNotes!, interventions: e.target.value.split(',').map(s=>s.trim())}})}
                    className="block w-full mt-1 p-2 rounded bg-white border border-stone-300 text-stone-800 focus:ring-1 focus:ring-amber-500 outline-none"
                    rows={2}
                  />
                </label>
              </div>

              <div className="flex space-x-3 pt-4 border-t border-stone-200">
                <button 
                  onClick={() => setPreviewData(null)}
                  className="flex-1 py-3 border border-stone-300 rounded-lg text-stone-600 font-bold hover:bg-stone-50 bg-white transition-colors"
                >
                  Reprocess Notes
                </button>
                <button 
                  onClick={handleSave}
                  className="flex-1 py-3 bg-amber-600 rounded-lg text-white font-bold hover:bg-amber-700 flex justify-center items-center space-x-2 transition-colors"
                >
                  <Save className="w-5 h-5" />
                  <span>{initialData ? 'Update Log' : 'Commit to Log'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewEntryModal;
