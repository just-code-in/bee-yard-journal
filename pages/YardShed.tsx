import React, { useState } from 'react';
import { InventoryItem } from '../types';
import { Package, Trash2, CheckCircle2, Archive, Plus, ChevronDown, ChevronUp, Pencil } from 'lucide-react';

interface YardKitProps {
  inventory: InventoryItem[];
  onEdit: (item: InventoryItem) => void;
  onAdd: (type: 'Good' | 'Flagged for Removal') => void;
}

const YardKit: React.FC<YardKitProps> = ({ inventory, onEdit, onAdd }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const goodItems = inventory.filter(i => i.status !== 'Flagged for Removal');
  const disposalItems = inventory.filter(i => i.status === 'Flagged for Removal');

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const renderHistoryLog = (item: InventoryItem) => (
    <div className="bg-stone-100 p-4 border-t border-stone-200 shadow-inner">
      <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-3 flex items-center gap-2">
        <Archive className="w-3 h-3" /> Item History Log
      </h4>
      {item.history.length === 0 ? (
        <p className="text-stone-400 text-sm italic">No history recorded.</p>
      ) : (
        <ul className="space-y-3">
          {item.history.map((log) => (
            <li key={log.id} className="text-sm bg-white p-3 rounded border border-stone-200">
              <div className="flex justify-between items-baseline mb-1">
                 <span className="font-bold text-stone-700">{log.actor}</span>
                 <span className="text-xs text-stone-400 font-mono">{new Date(log.date).toLocaleDateString()}</span>
              </div>
              <p className="text-stone-600 font-serif leading-snug">"{log.note}"</p>
              <span className="inline-block mt-2 text-[10px] uppercase font-bold text-stone-400 bg-stone-50 px-1.5 py-0.5 rounded border border-stone-100">
                {log.action}
              </span>
            </li>
          )).reverse()}
        </ul>
      )}
    </div>
  );

  return (
    <div className="pb-24">
      <header className="mb-10 border-b border-stone-300 pb-6 flex flex-col md:flex-row justify-between md:items-end gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-serif text-stone-900 mb-2">The Yard Kit</h1>
          <p className="text-stone-600 font-serif italic text-lg">Inventory tracking & disposal protocols.</p>
        </div>
      </header>

      {/* Disposal Protocol Section - Neutral/Bureaucratic Style */}
      <section className="mb-16">
        <div className="bg-stone-200/50 rounded-xl overflow-hidden border border-stone-300">
          <div className="bg-stone-300/50 p-4 flex justify-between items-center border-b border-stone-300">
             <div className="flex items-center gap-3">
                <div className="bg-white p-1.5 rounded-full text-stone-600 shadow-sm">
                   <Trash2 className="w-4 h-4" />
                </div>
                <h2 className="text-lg font-serif font-bold text-stone-700">Disposal Protocol</h2>
             </div>
             <button 
               onClick={() => onAdd('Flagged for Removal')}
               className="text-xs bg-stone-800 text-white px-3 py-1.5 rounded hover:bg-stone-900 transition-colors font-bold flex items-center gap-1"
             >
               <Plus className="w-3 h-3" /> Log Disposal
             </button>
          </div>
          
          <div className="p-4 md:p-6">
            {disposalItems.length === 0 ? (
               <div className="p-8 text-center text-stone-400 italic font-serif border-2 border-dashed border-stone-300 rounded-lg">
                 No items currently flagged for removal.
               </div>
            ) : (
              <div className="grid gap-3">
                 {disposalItems.map(item => (
                    <div key={item.id} className="bg-white border border-stone-300 rounded shadow-sm overflow-hidden">
                       <div 
                          className="p-4 flex flex-col md:flex-row justify-between md:items-center gap-4 cursor-pointer hover:bg-stone-50 transition-colors"
                          onClick={() => toggleExpand(item.id)}
                        >
                           <div className="flex items-start gap-3">
                              <span className="mt-1 w-2 h-2 rounded-full bg-stone-400 flex-shrink-0"></span>
                              <div>
                                 <p className="font-serif font-bold text-stone-800 text-lg leading-none">{item.name}</p>
                                 <p className="text-xs text-stone-500 mt-1 uppercase tracking-wide font-bold">Qty: {item.quantity}</p>
                              </div>
                           </div>
                           
                           <div className="flex items-center gap-4">
                              <button 
                                onClick={(e) => { e.stopPropagation(); onEdit(item); }}
                                className="p-2 hover:bg-stone-200 rounded-full text-stone-400 hover:text-stone-700 transition-colors"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              {expandedId === item.id ? <ChevronUp className="w-5 h-5 text-stone-400" /> : <ChevronDown className="w-5 h-5 text-stone-400" />}
                           </div>
                       </div>
                       
                       {/* Accordion Content */}
                       {expandedId === item.id && renderHistoryLog(item)}
                    </div>
                 ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Inventory Ledger */}
      <section>
        <div className="flex items-center justify-between mb-6">
           <div className="flex items-baseline gap-4">
             <h2 className="text-2xl font-serif text-stone-800">Current Stock</h2>
             <span className="text-xs font-mono text-stone-400 uppercase">Live Ledger</span>
           </div>
           <button 
             onClick={() => onAdd('Good')}
             className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow-sm transition-colors text-sm"
           >
             <Plus className="w-4 h-4" />
             <span>Add Item</span>
           </button>
        </div>

        <div className="bg-white shadow-sm border border-stone-200 rounded-lg overflow-hidden">
           <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
                <thead className="bg-stone-50 text-stone-400 uppercase text-xs font-bold tracking-wider border-b border-stone-200">
                   <tr>
                      <th className="p-5 font-serif text-stone-500 w-1/3">Item Description</th>
                      <th className="p-5">Category</th>
                      <th className="p-5 text-center">Status</th>
                      <th className="p-5 text-right font-serif text-stone-500">Qty</th>
                      <th className="p-5 w-10"></th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-stone-700">
                   {goodItems.map(item => (
                      <React.Fragment key={item.id}>
                        <tr 
                          onClick={() => toggleExpand(item.id)}
                          className="hover:bg-stone-50/50 transition-colors group cursor-pointer"
                        >
                           <td className="p-5">
                              <span className="block font-serif text-lg text-stone-800 font-medium group-hover:text-amber-700 transition-colors">{item.name}</span>
                              {item.notes && <span className="block text-xs font-sans text-stone-400 mt-1 italic">{item.notes}</span>}
                            </td>
                           <td className="p-5">
                              <span className="inline-block px-2 py-1 bg-stone-100 rounded-sm text-xs text-stone-500 font-bold uppercase tracking-wide border border-stone-200">
                                {item.category}
                              </span>
                           </td>
                           <td className="p-5 text-center">
                              {item.name.includes("New Plastic") ? (
                                 <span className="inline-flex items-center gap-1.5 text-amber-600 text-xs font-bold uppercase tracking-wider bg-amber-50 px-2 py-1 rounded-full border border-amber-100">
                                    <Package className="w-3 h-3" /> In Transit
                                 </span>
                              ) : (
                                 <span className="inline-flex items-center gap-1.5 text-green-700 text-xs font-bold uppercase tracking-wider opacity-70">
                                    <CheckCircle2 className="w-3 h-3" /> {item.status}
                                 </span>
                              )}
                           </td>
                           <td className="p-5 text-right">
                              <span className="font-serif text-xl text-stone-800">{item.quantity}</span>
                           </td>
                           <td className="p-5 text-right">
                              <button 
                                onClick={(e) => { e.stopPropagation(); onEdit(item); }}
                                className="p-2 text-stone-300 hover:text-amber-600 rounded-full hover:bg-stone-100 transition-colors"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                           </td>
                        </tr>
                        {/* Expanded Row Details */}
                        {expandedId === item.id && (
                          <tr>
                            <td colSpan={5} className="p-0 border-b border-stone-200">
                              {renderHistoryLog(item)}
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                   ))}
                </tbody>
             </table>
           </div>
        </div>
      </section>
    </div>
  );
};

export default YardKit;
