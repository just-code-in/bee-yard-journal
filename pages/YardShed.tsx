import React from 'react';
import { InventoryItem } from '../types';
import { Package, Trash2, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface YardShedProps {
  inventory: InventoryItem[];
}

const YardShed: React.FC<YardShedProps> = ({ inventory }) => {
  const goodItems = inventory.filter(i => i.status !== 'Flagged for Removal');
  const disposalItems = inventory.filter(i => i.status === 'Flagged for Removal');

  return (
    <div className="max-w-4xl mx-auto pb-24">
      <header className="mb-10 border-b border-stone-300 pb-6">
        <h1 className="text-4xl font-serif text-stone-900 mb-2">The Yard Shed</h1>
        <p className="text-stone-600 font-serif italic text-lg">Inventory logistics and disposal compliance.</p>
      </header>

      {/* Disposal Protocol Section - High Priority */}
      <section className="mb-12 bg-red-50 border border-red-200 rounded-xl overflow-hidden">
        <div className="bg-red-100/50 p-4 border-b border-red-200 flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="bg-red-500 p-2 rounded-full text-white">
                <Trash2 className="w-5 h-5" />
             </div>
             <div>
                <h2 className="text-xl font-serif font-bold text-red-900">The Disposal Protocol</h2>
                <p className="text-xs text-red-700 uppercase tracking-wide font-bold">Review Required: David Dubinsky</p>
             </div>
          </div>
        </div>
        
        {disposalItems.length === 0 ? (
           <div className="p-8 text-center text-stone-500 italic">No items flagged for removal at this time.</div>
        ) : (
          <div className="divide-y divide-red-200">
             {disposalItems.map(item => (
                <div key={item.id} className="p-4 flex justify-between items-center hover:bg-red-100/30 transition-colors">
                   <div className="flex items-center gap-4">
                      <AlertTriangle className="text-red-500 w-5 h-5" />
                      <div>
                         <p className="font-bold text-stone-800 text-lg">{item.name}</p>
                         <p className="text-sm text-stone-600">{item.notes}</p>
                      </div>
                   </div>
                   <div className="text-right">
                      <span className="block font-mono font-bold text-red-800">Qty: {item.quantity}</span>
                      <button className="text-xs text-red-600 underline mt-1 font-bold">Approve Disposal</button>
                   </div>
                </div>
             ))}
          </div>
        )}
      </section>

      {/* Main Inventory */}
      <section>
        <div className="flex justify-between items-end mb-6">
           <h2 className="text-2xl font-serif text-stone-800">Current Stock</h2>
           <span className="text-sm text-stone-500">Updated: Feb 5th, 2024</span>
        </div>

        <div className="bg-white shadow-sm border border-stone-200 rounded-xl overflow-hidden">
           <table className="w-full text-left">
              <thead className="bg-stone-100 border-b border-stone-200 text-stone-500 uppercase text-xs font-bold tracking-wider">
                 <tr>
                    <th className="p-4">Item</th>
                    <th className="p-4">Category</th>
                    <th className="p-4 text-center">Status</th>
                    <th className="p-4 text-right">Quantity</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                 {goodItems.map(item => (
                    <tr key={item.id} className="hover:bg-stone-50">
                       <td className="p-4 font-medium text-lg font-serif">
                          {item.name}
                          {item.notes && <span className="block text-xs font-sans text-stone-400 mt-1 italic">{item.notes}</span>}
                        </td>
                       <td className="p-4">
                          <span className="inline-block px-2 py-1 bg-stone-100 rounded text-xs text-stone-600 font-bold uppercase">{item.category}</span>
                       </td>
                       <td className="p-4 text-center">
                          {item.name.includes("New Plastic") ? (
                             <span className="inline-flex items-center gap-1 text-amber-600 text-sm font-bold animate-pulse">
                                <Package className="w-4 h-4" /> Arriving Soon
                             </span>
                          ) : (
                             <span className="inline-flex items-center gap-1 text-green-700 text-sm font-bold">
                                <CheckCircle2 className="w-4 h-4" /> {item.status}
                             </span>
                          )}
                       </td>
                       <td className="p-4 text-right font-mono font-bold text-lg">{item.quantity}</td>
                    </tr>
                 ))}
              </tbody>
           </table>
        </div>
      </section>
    </div>
  );
};

export default YardShed;
