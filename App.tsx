import React, { useState } from 'react';
import Navigation from './components/Navigation';
import FieldJournal from './pages/FieldJournal';
import Colonies from './pages/Colonies';
import YardKit from './pages/YardShed';
import BeeCrew from './pages/BeeCrew';
import Archive from './pages/Archive';
import NewEntryModal from './components/NewEntryModal';
import ColonyModal from './components/ColonyModal';
import InventoryModal from './components/InventoryModal';
import MarginDoodles from './components/MarginDoodles';
import { PageView, JournalEntry, ColonyProfile, InventoryItem, CrewMember, InventoryLog, BudgetItem } from './types';

// --- INITIAL DATA SEEDING ---

const INITIAL_ENTRIES: JournalEntry[] = [
  {
    id: 'entry-feb-5',
    date: '2024-02-05T14:30:00',
    author: 'Justin Simpson',
    weather: {
      temperature: 54,
      condition: 'Overcast',
      wind: 'W 15mph (Biting)',
    },
    phenology: 'Sea Fig (Carpobrotus chilensis) in early bloom. Rosemary pungent.',
    narrative: `A quiet day in the yard until the wind picked up off the Pacific. The Founder Colony is holding on, though the cluster is remarkably small—scarcely larger than a basketball. 

    Encouragingly, we spotted the Queen; she is laying, despite the chill, moving with purpose across the comb. Mark applied Varroxsan strips to knock back the mite load before the critical spring buildup. 
    
    The most heartwarming moment: patrons stopping by the fence line, pointing out the "bee boxes" with genuine curiosity. It reminds us why we are here.`,
    technicalNotes: {
      clusterSize: '< Basketball',
      queenStatus: 'Queenright',
      interventions: [
        'Applied Varroxsan strips (2 per brood box) to address potential phoretic mite load',
        'Performed thorough brood pattern analysis (Frame 4 & 5)',
        'Cleaned bottom board debris',
        'Reduced entrance to prevent robbing during nectar dearth'
      ],
      diseases: ['Brood disease signs noted (monitor)'],
    },
    tags: ['Mark Carlson', 'Marc Johnson'],
    media: [
      {
        type: 'image',
        url: 'https://picsum.photos/seed/bees1/800/600?grayscale', 
        caption: 'Low density brood pattern observed on Frame 4.',
      },
      {
        type: 'image',
        url: 'https://picsum.photos/seed/bees2/800/600?grayscale', 
        caption: 'Queen spotted on Frame 5, moving well.',
      }
    ]
  }
];

const INITIAL_COLONIES: ColonyProfile[] = [
  {
    id: 'col-1',
    name: 'The Founder Colony',
    type: 'Overwintered',
    status: 'Active',
    queenName: 'Queen Victoria (Unmarked)',
    healthScore: 65,
    lastInspection: '2024-02-05T14:30:00',
    notes: 'Small cluster. Varroa treatment ongoing. Needs syrup if temp drops below 50F for extended periods.',
  },
  {
    id: 'col-2',
    name: 'The Spring Split',
    type: 'Split',
    status: 'Planned',
    healthScore: 0,
    lastInspection: '1970-01-01T00:00:00',
    notes: 'Equipment ready. Scheduled for late March/April depending on Founder Colony buildup.',
  },
];

const INITIAL_INVENTORY: InventoryItem[] = [
  { 
    id: 'inv-1', 
    name: 'Deep Hive Body (10-frame)', 
    category: 'Hive Body', 
    quantity: 4, 
    status: 'Good', 
    history: [] 
  },
  { 
    id: 'inv-2', 
    name: 'Medium Super (8-frame)', 
    category: 'Hive Body', 
    quantity: 6, 
    status: 'Good', 
    history: [] 
  },
  { 
    id: 'inv-3', 
    name: 'Frames (New Plastic Foundation)', 
    category: 'Frame', 
    quantity: 20, 
    status: 'Good', 
    notes: 'Expected delivery Feb 20',
    history: [
      { id: 'log-1', date: '2024-02-01T10:00:00', action: 'Created', actor: 'Justin S.', note: 'Ordered for spring split.'}
    ]
  },
  { 
    id: 'inv-4', 
    name: 'Varroxsan Strips', 
    category: 'Treatment', 
    quantity: 1, 
    status: 'Good',
    history: []
  },
  { 
    id: 'inv-5', 
    name: 'Moldy Frames (Frame 8/9)', 
    category: 'Frame', 
    quantity: 2, 
    status: 'Flagged for Removal', 
    notes: 'Excessive mold, possible nosema spores. Bagged.',
    history: [
      { id: 'log-2', date: '2024-02-05T15:00:00', action: 'Flagged', actor: 'Mark C.', note: 'Removed from Founder Colony due to mold.'}
    ]
  },
];

const INITIAL_EXPENSES: BudgetItem[] = [
  { id: 'exp-1', description: 'Varroxsan Pack (10 strips)', amount: 45.50, date: '2024-02-01T12:00:00', category: 'Treatment' },
  { id: 'exp-2', description: 'Pollen Patties (2lb)', amount: 12.00, date: '2024-02-05T12:00:00', category: 'Feed' },
];

const CREW: CrewMember[] = [
  { name: 'Mark Carlson', role: 'Senior Advisor', initials: 'MC', email: 'markacarlson@gmail.com', phone: '(415) 542-8154' },
  { name: 'Marc Johnson', role: 'Senior Advisor', initials: 'MJ', email: 'marc@sfbee.org', phone: '(415) 225-2594' },
  { name: 'Annie Ash', role: 'Beekeeper', initials: 'AA', email: 'annie.e.ash@gmail.com' },
  { name: 'Justin Simpson', role: 'Mentor', initials: 'JS', email: 'justin.s.simpson@mac.com', phone: '(650) 509-7682' },
  { name: 'David Dubinsky', role: 'Pomeroy CEO', initials: 'DD', email: 'ddubinsky@prrcsf.org', phone: '(415) 213-8564' },
  { name: 'Jillian Flannery', role: 'Pomeroy Centre', initials: 'JF', email: 'jflannery@prrcsf.org' },
];

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageView>('journal');
  
  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
  
  const [isColonyModalOpen, setIsColonyModalOpen] = useState(false);
  const [editingColony, setEditingColony] = useState<ColonyProfile | null>(null);

  const [isInventoryModalOpen, setIsInventoryModalOpen] = useState(false);
  const [editingInventory, setEditingInventory] = useState<InventoryItem | null>(null);
  const [inventoryDefaultStatus, setInventoryDefaultStatus] = useState<'Good' | 'Flagged for Removal'>('Good');
  
  // Data States
  const [entries, setEntries] = useState<JournalEntry[]>(INITIAL_ENTRIES);
  const [colonies, setColonies] = useState<ColonyProfile[]>(INITIAL_COLONIES);
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  
  // Fiscal Data State
  const [budgetLimit, setBudgetLimit] = useState<number>(100);
  const [budgetExpenses, setBudgetExpenses] = useState<BudgetItem[]>(INITIAL_EXPENSES);

  // Journal Handlers
  const handleSaveEntry = (entry: JournalEntry) => {
    const exists = entries.find(e => e.id === entry.id);
    if (exists) {
      setEntries(entries.map(e => e.id === entry.id ? entry : e));
    } else {
      setEntries([entry, ...entries]);
    }
  };

  const handleEditEntry = (entry: JournalEntry) => {
    setEditingEntry(entry);
    setIsModalOpen(true);
  };

  const handleNewEntry = () => {
    setEditingEntry(null);
    setIsModalOpen(true);
  };

  // Colony Handlers
  const handleEditColony = (colony: ColonyProfile) => {
    setEditingColony(colony);
    setIsColonyModalOpen(true);
  };

  const handleSaveColony = (updatedColony: ColonyProfile) => {
    setColonies(colonies.map(c => c.id === updatedColony.id ? updatedColony : c));
    setIsColonyModalOpen(false);
    setEditingColony(null);
  };

  // Inventory Handlers
  const handleEditInventory = (item: InventoryItem) => {
    setEditingInventory(item);
    setInventoryDefaultStatus(item.status);
    setIsInventoryModalOpen(true);
  };

  const handleAddInventory = (status: 'Good' | 'Flagged for Removal') => {
    setEditingInventory(null);
    setInventoryDefaultStatus(status);
    setIsInventoryModalOpen(true);
  };

  const handleSaveInventory = (item: InventoryItem, logEntry: InventoryLog) => {
    // Append the new log entry to history
    const updatedItem = {
      ...item,
      history: [...item.history, logEntry]
    };

    const exists = inventory.find(i => i.id === item.id);
    if (exists) {
      setInventory(inventory.map(i => i.id === item.id ? updatedItem : i));
    } else {
      setInventory([...inventory, updatedItem]);
    }
    
    setIsInventoryModalOpen(false);
    setEditingInventory(null);
  };

  // Budget Handler
  const handleUpdateBudget = (limit: number, expenses: BudgetItem[]) => {
    setBudgetLimit(limit);
    setBudgetExpenses(expenses);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'journal': return <FieldJournal entries={entries} onEdit={handleEditEntry} />;
      case 'colonies': return <Colonies colonies={colonies} onEdit={handleEditColony} />;
      case 'shed': return (
        <YardKit 
          inventory={inventory} 
          onEdit={handleEditInventory}
          onAdd={handleAddInventory}
        />
      );
      case 'crew': return <BeeCrew crew={CREW} />;
      case 'archive': return (
        <Archive 
          entries={entries} 
          colonies={colonies} 
          inventory={inventory}
          budgetLimit={budgetLimit}
          budgetExpenses={budgetExpenses}
          onUpdateBudget={handleUpdateBudget}
        />
      );
      default: return <FieldJournal entries={entries} onEdit={handleEditEntry} />;
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 text-stone-800 font-sans">
      <Navigation 
        currentPage={currentPage} 
        setPage={setCurrentPage} 
        onNewEntry={handleNewEntry} 
      />

      <main className="md:ml-64 p-6 md:p-12 transition-all min-h-screen">
        <div className="flex gap-6 lg:gap-8 max-w-[1400px] mx-auto">
          {/* Global Aesthetic Margin - Persists across pages */}
          <MarginDoodles />
          
          {/* Content Area */}
          <div className="flex-1 min-w-0">
             {renderPage()}
          </div>
        </div>
      </main>

      <NewEntryModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveEntry} 
        initialData={editingEntry}
      />

      <ColonyModal
        isOpen={isColonyModalOpen}
        onClose={() => setIsColonyModalOpen(false)}
        onSave={handleSaveColony}
        initialData={editingColony}
      />

      <InventoryModal 
        isOpen={isInventoryModalOpen}
        onClose={() => setIsInventoryModalOpen(false)}
        onSave={handleSaveInventory}
        initialData={editingInventory}
        defaultStatus={inventoryDefaultStatus}
      />
    </div>
  );
};

export default App;
