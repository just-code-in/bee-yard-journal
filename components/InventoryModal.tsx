import React, { useState, useEffect } from 'react';
import { X, Save, Package, User } from 'lucide-react';
import { InventoryItem, InventoryLog } from '../types';

interface InventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: InventoryItem, logEntry: InventoryLog) => void;
  initialData?: InventoryItem | null;
  defaultStatus?: 'Good' | 'Flagged for Removal';
}

const InventoryModal: React.FC<InventoryModalProps> = ({ isOpen, onClose, onSave, initialData, defaultStatus = 'Good' }) => {
  const [formData, setFormData] = useState<Partial<InventoryItem>>({});
  
  // Transaction fields (for the history log)
  const [actorName, setActorName] = useState('');
  const [changeNote, setChangeNote] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData(initialData);
      } else {
        setFormData({
          category: 'Hive Body',
          quantity: 1,
          status: defaultStatus
        });
      }
      setActorName('');
      setChangeNote('');
    }
  }, [isOpen, initialData, defaultStatus]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!formData.name || !actorName || !changeNote) {
      alert("Please provide Item Name, Your Name, and a Note for the log.");
      return;
    }

    const newItem: InventoryItem = {
      id: initialData?.id || crypto.randomUUID(),
      name: formData.name,
      category: formData.category || 'Tool',
      quantity: formData.quantity || 0,
      status: formData.status || 'Good',
      notes: changeNote, // Set current note to the latest change note
      history: initialData?.history || []
    };

    const newLog: InventoryLog = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      action: initialData ? 'Updated' : 'Created',
      actor: actorName,
      note: changeNote
    };

    onSave(newItem, newLog);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-stone-100 w-full max-w-lg rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-stone-900 p-4 flex justify-between items-center text-stone-100">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-amber-500" />
            <h2 className="text-xl font-serif text-stone-100">{initialData ? 'Update Inventory' : 'New Item'}</h2>
          </div>
          <button onClick={onClose} className="hover:text-amber-500"><X /></button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          
          {/* Item Details */}
          <div className="space-y-4">
             <div>
               <label className="block text-xs font-bold text-stone-500 mb-1">Item Description</label>
               <input 
                 type="text" 
                 value={formData.name || ''}
                 onChange={(e) => setFormData({...formData, name: e.target.value})}
                 placeholder="e.g. Deep Hive Body (10-frame)"
                 className="block w-full p-2 rounded bg-white border border-stone-300 text-stone-800 focus:ring-1 focus:ring-amber-500 outline-none font-serif text-lg"
               />
             </div>

             <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-xs font-bold text-stone-500 mb-1">Category</label>
                   <select 
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value as any})}
                      className="block w-full p-2 rounded bg-white border border-stone-300 text-stone-800 text-sm"
                   >
                     <option value="Hive Body">Hive Body</option>
                     <option value="Frame">Frame</option>
                     <option value="Feed">Feed</option>
                     <option value="Treatment">Treatment</option>
                     <option value="Tool">Tool</option>
                   </select>
                </div>
                <div>
                   <label className="block text-xs font-bold text-stone-500 mb-1">Quantity</label>
                   <input 
                      type="number" 
                      min="0"
                      value={formData.quantity}
                      onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value)})}
                      className="block w-full p-2 rounded bg-white border border-stone-300 text-stone-800 text-sm font-mono"
                   />
                </div>
             </div>

             <div>
                <label className="block text-xs font-bold text-stone-500 mb-1">Current Status</label>
                <select 
                   value={formData.status}
                   onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                   className={`block w-full p-2 rounded border text-sm font-bold ${
                     formData.status === 'Flagged for Removal' 
                       ? 'bg-red-50 border-red-200 text-red-800' 
                       : 'bg-white border-stone-300 text-green-800'
                   }`}
                >
                  <option value="Good">Good Condition</option>
                  <option value="Fair">Fair / Worn</option>
                  <option value="Flagged for Removal">Flagged for Disposal</option>
                </select>
             </div>
          </div>

          {/* Log Entry Section */}
          <div className="bg-stone-200 p-4 rounded-lg border border-stone-300 mt-6">
             <div className="flex items-center gap-2 mb-3 border-b border-stone-300 pb-2">
                <User className="w-4 h-4 text-stone-500" />
                <h4 className="text-xs font-bold text-stone-600 uppercase tracking-wider">Required Log Entry</h4>
             </div>
             
             <div className="space-y-3">
               <div>
                  <label className="block text-xs font-bold text-stone-500 mb-1">Your Name (Required)</label>
                  <input 
                    type="text" 
                    value={actorName}
                    onChange={(e) => setActorName(e.target.value)}
                    placeholder="e.g. Justin S."
                    className="block w-full p-2 rounded bg-white border border-stone-300 text-stone-800 text-sm focus:ring-1 focus:ring-amber-500 outline-none"
                  />
               </div>
               <div>
                  <label className="block text-xs font-bold text-stone-500 mb-1">Reason for Update / Note (Required)</label>
                  <textarea 
                    value={changeNote}
                    onChange={(e) => setChangeNote(e.target.value)}
                    placeholder="e.g. Restocked 5 frames, Found mold on bottom board..."
                    className="block w-full p-2 rounded bg-white border border-stone-300 text-stone-800 text-sm focus:ring-1 focus:ring-amber-500 outline-none h-20 resize-none"
                  />
               </div>
             </div>
          </div>

          <div className="flex justify-end pt-4">
             <button 
               onClick={handleSave}
               className="bg-stone-800 text-white px-8 py-3 rounded-lg font-bold hover:bg-stone-900 flex items-center gap-2 transition-colors shadow-sm"
             >
               <Save className="w-4 h-4" />
               <span>Update Ledger</span>
             </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default InventoryModal;
