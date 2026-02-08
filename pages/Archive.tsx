import React, { useState } from 'react';
import { ArchiveDocument, JournalEntry, ColonyProfile, InventoryItem, BudgetItem } from '../types';
import { FileText, Download, Upload, DollarSign, FileBarChart, ShieldAlert, Database, File, Pencil, Trash2 } from 'lucide-react';
import BudgetModal from '../components/BudgetModal';

interface ArchiveProps {
  entries: JournalEntry[];
  colonies: ColonyProfile[];
  inventory: InventoryItem[];
  // Budget Props
  budgetLimit: number;
  budgetExpenses: BudgetItem[];
  onUpdateBudget: (limit: number, expenses: BudgetItem[]) => void;
}

const INITIAL_DOCS: ArchiveDocument[] = [
  { id: 'd1', name: '2024_Pomeroy_Apiary_Budget.pdf', type: 'PDF', category: 'Fiscal', dateAdded: '2024-01-15', size: '1.2 MB' },
  { id: 'd2', name: 'Varroxsan_Safety_Data_Sheet.pdf', type: 'PDF', category: 'Reference', dateAdded: '2024-02-01', size: '450 KB' },
  { id: 'd3', name: 'Disposal_Protocol_v2.docx', type: 'DOC', category: 'Protocol', dateAdded: '2024-02-05', size: '28 KB' },
  { id: 'd4', name: 'Receipt_Mann_Lake_Feb_Order.img', type: 'IMG', category: 'Fiscal', dateAdded: '2024-02-02', size: '2.4 MB' },
];

const Archive: React.FC<ArchiveProps> = ({ 
  entries, 
  colonies, 
  inventory, 
  budgetLimit, 
  budgetExpenses, 
  onUpdateBudget 
}) => {
  const [documents, setDocuments] = useState<ArchiveDocument[]>(INITIAL_DOCS);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);

  // Real-time Calculation
  const currentSpend = budgetExpenses.reduce((sum, item) => sum + item.amount, 0);
  const budgetHealth = Math.min((currentSpend / budgetLimit) * 100, 100);

  // Handle Mock Upload
  const handleUpload = () => {
    const name = prompt("Enter document name (Simulation):");
    if (name) {
      const newDoc: ArchiveDocument = {
        id: crypto.randomUUID(),
        name: name,
        type: 'PDF',
        category: 'Reference',
        dateAdded: new Date().toISOString().split('T')[0],
        size: '0 KB'
      };
      setDocuments([newDoc, ...documents]);
    }
  };

  // Handle Document Deletion
  const handleDeleteDocument = (id: string) => {
    if (confirm("Are you sure you want to remove this document from the library?")) {
      setDocuments(documents.filter(doc => doc.id !== id));
    }
  };

  // Handle Budget Save from Modal
  const handleBudgetSave = (newLimit: number, newExpenses: BudgetItem[]) => {
    onUpdateBudget(newLimit, newExpenses);
    setIsBudgetModalOpen(false);
  };

  // Handle Real Data Export
  const handleExport = () => {
    const data = {
      timestamp: new Date().toISOString(),
      budget: { limit: budgetLimit, expenses: budgetExpenses },
      journal: entries,
      colonies: colonies,
      inventory: inventory
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pomeroy_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'PDF': return <FileText className="w-5 h-5 text-red-500" />;
      case 'IMG': return <File className="w-5 h-5 text-purple-500" />;
      case 'DOC': return <FileBarChart className="w-5 h-5 text-blue-500" />;
      default: return <File className="w-5 h-5 text-stone-400" />;
    }
  };

  return (
    <div className="pb-24 space-y-12">
      <header className="border-b border-stone-300 pb-6">
        <h1 className="text-4xl md:text-5xl font-serif text-stone-900 mb-2">The Archive</h1>
        <p className="text-stone-600 font-serif italic text-lg">Financial records, safety protocols, and raw data.</p>
      </header>

      {/* 1. Fiscal Health Section */}
      <section className="bg-stone-900 text-stone-100 rounded-xl p-8 shadow-md relative group">
         
         {/* Edit Budget Button */}
         <button 
           onClick={() => setIsBudgetModalOpen(true)}
           className="absolute top-6 right-6 p-2 bg-stone-800 rounded-full hover:bg-stone-700 hover:text-amber-500 text-stone-400 transition-colors shadow-lg border border-stone-700"
           title="Edit Budget"
         >
           <Pencil className="w-4 h-4" />
         </button>

         <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pr-12">
            <div>
               <h2 className="text-2xl font-serif text-amber-500 flex items-center gap-2">
                 <DollarSign className="w-6 h-6" /> 2024 Budget Tracking
               </h2>
               <p className="text-stone-400 text-sm mt-1">Allocation for consumables (Sugar, Treatments, Misc).</p>
            </div>
            <div className="mt-4 md:mt-0 text-right">
               <span className="block text-3xl font-bold font-serif">${currentSpend.toFixed(2)}</span>
               <span className="text-xs text-stone-500 uppercase tracking-widest">Spent of ${budgetLimit}.00</span>
            </div>
         </div>

         {/* Progress Bar */}
         <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-amber-600 bg-amber-200">
                Utilization
              </span>
              <span className={`text-xs font-semibold inline-block ${budgetHealth >= 100 ? 'text-red-500' : 'text-amber-600'}`}>
                {budgetHealth.toFixed(0)}%
              </span>
            </div>
            <div className="overflow-hidden h-4 mb-4 text-xs flex rounded bg-stone-700">
              <div 
                style={{ width: `${budgetHealth}%` }} 
                className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-1000 ${
                  budgetHealth >= 100 ? 'bg-red-600' : 'bg-amber-600'
                }`}
              ></div>
            </div>
         </div>
      </section>

      {/* 2. The Filing Cabinet */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-serif text-stone-800">Reference Library</h3>
          <button 
            onClick={handleUpload}
            className="flex items-center gap-2 text-sm bg-white border border-stone-300 px-4 py-2 rounded-lg hover:bg-stone-50 hover:text-amber-700 transition-colors shadow-sm font-bold text-stone-600"
          >
            <Upload className="w-4 h-4" />
            Upload Doc
          </button>
        </div>

        <div className="bg-white border border-stone-200 rounded-lg shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-stone-50 text-xs uppercase text-stone-500 font-bold border-b border-stone-200">
              <tr>
                <th className="p-4 w-12">Type</th>
                <th className="p-4">Document Name</th>
                <th className="p-4">Category</th>
                <th className="p-4 hidden sm:table-cell">Date Added</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {documents.map(doc => (
                <tr key={doc.id} className="hover:bg-amber-50/30 transition-colors group">
                  <td className="p-4">{getIcon(doc.type)}</td>
                  <td className="p-4">
                    <span className="block font-medium text-stone-800">{doc.name}</span>
                    <span className="block sm:hidden text-xs text-stone-400">{doc.dateAdded}</span>
                  </td>
                  <td className="p-4">
                    <span className={`inline-block px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded border ${
                      doc.category === 'Fiscal' ? 'bg-green-50 text-green-700 border-green-100' :
                      doc.category === 'Protocol' ? 'bg-red-50 text-red-700 border-red-100' :
                      'bg-stone-100 text-stone-600 border-stone-200'
                    }`}>
                      {doc.category}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-stone-500 hidden sm:table-cell font-mono">{doc.dateAdded}</td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                        <button className="p-2 text-stone-400 hover:text-amber-600 transition-colors" title="Download">
                          <Download className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteDocument(doc.id)}
                          className="p-2 text-stone-300 hover:text-red-600 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 3. System Data Dump */}
      <section className="bg-stone-100 border-2 border-dashed border-stone-300 rounded-xl p-8 text-center">
        <div className="max-w-md mx-auto space-y-4">
           <div className="w-16 h-16 bg-stone-200 rounded-full flex items-center justify-center mx-auto text-stone-500">
              <Database className="w-8 h-8" />
           </div>
           <h3 className="text-xl font-serif font-bold text-stone-800">System Data Backup</h3>
           <p className="text-stone-600 text-sm">
             Download a complete JSON snapshot of the Field Journal, Colony profiles, and Inventory state. 
             Useful for importing into other tools or for offline backup.
           </p>
           <button 
             onClick={handleExport}
             className="bg-stone-800 hover:bg-stone-900 text-white px-6 py-3 rounded-lg font-bold flex items-center justify-center gap-2 w-full transition-transform hover:scale-105 shadow-lg"
           >
             <Download className="w-5 h-5" />
             Download Full Project JSON
           </button>
        </div>
      </section>

      <BudgetModal 
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
        currentLimit={budgetLimit}
        currentExpenses={budgetExpenses}
        onSave={handleBudgetSave}
      />

    </div>
  );
};

export default Archive;
