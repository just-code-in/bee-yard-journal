import React, { useState, useEffect } from 'react';
import { X, Save, DollarSign, Plus, Trash2 } from 'lucide-react';
import { BudgetItem } from '../types';

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLimit: number;
  currentExpenses: BudgetItem[];
  onSave: (newLimit: number, newExpenses: BudgetItem[]) => void;
}

const BudgetModal: React.FC<BudgetModalProps> = ({ isOpen, onClose, currentLimit, currentExpenses, onSave }) => {
  const [limit, setLimit] = useState(currentLimit);
  const [expenses, setExpenses] = useState<BudgetItem[]>([]);
  
  // New Item State
  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemAmount, setNewItemAmount] = useState('');
  const [newItemCat, setNewItemCat] = useState<BudgetItem['category']>('Consumable');

  useEffect(() => {
    if (isOpen) {
      setLimit(currentLimit);
      setExpenses(currentExpenses);
      setNewItemDesc('');
      setNewItemAmount('');
    }
  }, [isOpen, currentLimit, currentExpenses]);

  if (!isOpen) return null;

  const handleAddExpense = () => {
    if (!newItemDesc || !newItemAmount) return;
    const item: BudgetItem = {
      id: crypto.randomUUID(),
      description: newItemDesc,
      amount: parseFloat(newItemAmount),
      date: new Date().toISOString(),
      category: newItemCat
    };
    setExpenses([item, ...expenses]);
    setNewItemDesc('');
    setNewItemAmount('');
  };

  const handleRemoveExpense = (id: string) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  const handleSave = () => {
    onSave(limit, expenses);
  };

  const totalSpent = expenses.reduce((sum, item) => sum + item.amount, 0);
  const remaining = limit - totalSpent;

  return (
    <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-stone-100 w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-stone-900 p-4 flex justify-between items-center text-stone-100">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-amber-500" />
            <h2 className="text-xl font-serif text-stone-100">Manage Fiscal Budget</h2>
          </div>
          <button onClick={onClose} className="hover:text-amber-500"><X /></button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-8">
          
          {/* Top Level Control */}
          <div className="bg-white p-6 rounded-lg border border-stone-200 shadow-sm flex flex-col md:flex-row gap-6 items-center justify-between">
            <div>
               <label className="block text-xs font-bold text-stone-500 mb-1 uppercase tracking-wider">Total Season Budget</label>
               <div className="relative">
                 <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 font-serif text-lg">$</span>
                 <input 
                   type="number" 
                   value={limit}
                   onChange={(e) => setLimit(parseFloat(e.target.value))}
                   className="pl-8 p-2 w-40 rounded bg-stone-50 border border-stone-300 text-stone-900 text-2xl font-serif font-bold focus:ring-1 focus:ring-amber-500 outline-none"
                 />
               </div>
            </div>
            <div className="text-right">
               <span className="block text-xs font-bold text-stone-500 mb-1 uppercase tracking-wider">Remaining</span>
               <span className={`text-2xl font-serif font-bold ${remaining < 0 ? 'text-red-600' : 'text-green-700'}`}>
                 ${remaining.toFixed(2)}
               </span>
            </div>
          </div>

          {/* Ledger Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-stone-800 uppercase tracking-widest border-b border-stone-300 pb-2">Expense Ledger</h3>
            
            {/* Add New Row */}
            <div className="flex gap-2 items-end bg-stone-200 p-3 rounded-lg border border-stone-300">
              <div className="flex-1">
                <label className="block text-[10px] font-bold text-stone-500 mb-1">Item Description</label>
                <input 
                  type="text" 
                  value={newItemDesc} 
                  onChange={(e) => setNewItemDesc(e.target.value)}
                  placeholder="e.g. Sugar (25lb bag)"
                  className="w-full p-2 rounded border border-stone-300 text-sm"
                />
              </div>
              <div className="w-32">
                 <label className="block text-[10px] font-bold text-stone-500 mb-1">Category</label>
                 <select 
                   value={newItemCat}
                   onChange={(e) => setNewItemCat(e.target.value as any)}
                   className="w-full p-2 rounded border border-stone-300 text-sm"
                 >
                   <option value="Consumable">Consumable</option>
                   <option value="Feed">Feed</option>
                   <option value="Treatment">Treatment</option>
                   <option value="Equipment">Equipment</option>
                 </select>
              </div>
              <div className="w-28">
                <label className="block text-[10px] font-bold text-stone-500 mb-1">Cost ($)</label>
                <input 
                  type="number"
                  step="0.01"
                  min="0"
                  value={newItemAmount} 
                  onChange={(e) => setNewItemAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full p-2 rounded border border-stone-300 text-sm font-mono text-right"
                />
              </div>
              <button 
                onClick={handleAddExpense}
                className="bg-stone-800 text-white p-2 rounded hover:bg-stone-900 transition-colors h-[38px] w-[38px] flex items-center justify-center"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            {/* List */}
            <div className="bg-white border border-stone-200 rounded-lg overflow-hidden">
               {expenses.length === 0 ? (
                 <div className="p-8 text-center text-stone-400 italic">No expenses recorded yet.</div>
               ) : (
                 <table className="w-full text-left text-sm">
                   <thead className="bg-stone-50 text-stone-500 font-bold border-b border-stone-200">
                     <tr>
                       <th className="p-3">Item</th>
                       <th className="p-3">Category</th>
                       <th className="p-3 text-right">Cost</th>
                       <th className="p-3 w-10"></th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-stone-100">
                     {expenses.map(item => (
                       <tr key={item.id} className="group">
                         <td className="p-3 font-medium text-stone-800">{item.description}</td>
                         <td className="p-3 text-stone-500 text-xs uppercase">{item.category}</td>
                         <td className="p-3 text-right font-mono font-bold text-stone-700 whitespace-nowrap">${item.amount.toFixed(2)}</td>
                         <td className="p-3 text-right">
                           <button 
                             onClick={() => handleRemoveExpense(item.id)}
                             className="text-stone-300 hover:text-red-500 transition-colors"
                           >
                             <Trash2 className="w-4 h-4" />
                           </button>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               )}
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-stone-200">
             <button 
               onClick={handleSave}
               className="bg-amber-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-amber-700 flex items-center gap-2 transition-colors shadow-sm"
             >
               <Save className="w-5 h-5" />
               <span>Update Budget</span>
             </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default BudgetModal;
