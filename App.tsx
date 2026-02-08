import React, { useState } from 'react';
import Navigation from './components/Navigation';
import FieldJournal from './pages/FieldJournal';
import Colonies from './pages/Colonies';
import YardShed from './pages/YardShed';
import BeeCrew from './pages/BeeCrew';
import NewEntryModal from './components/NewEntryModal';
import { PageView, JournalEntry, ColonyProfile, InventoryItem, CrewMember } from './types';

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
  { id: 'inv-1', name: 'Deep Hive Body (10-frame)', category: 'Hive Body', quantity: 4, status: 'Good' },
  { id: 'inv-2', name: 'Medium Super (8-frame)', category: 'Hive Body', quantity: 6, status: 'Good' },
  { id: 'inv-3', name: 'Frames (New Plastic Foundation)', category: 'Frame', quantity: 20, status: 'Good', notes: 'Expected delivery Feb 20' },
  { id: 'inv-4', name: 'Varroxsan Strips', category: 'Treatment', quantity: 1, status: 'Good' },
  { id: 'inv-5', name: 'Moldy Frames (Frame 8/9)', category: 'Frame', quantity: 2, status: 'Flagged for Removal', notes: 'Excessive mold, possible nosema spores. Bagged.' },
];

const CREW: CrewMember[] = [
  { name: 'Justin Simpson', role: 'Mentor / Lead', initials: 'JS' },
  { name: 'Mark Carlson', role: 'Senior Advisor', initials: 'MC' },
  { name: 'Marc Johnson', role: 'Senior Advisor', initials: 'MJ' },
  { name: 'Annie Ash', role: 'Beekeeper', initials: 'AA' },
  { name: 'David Dubinsky', role: 'Pomeroy Admin', initials: 'DD' },
  { name: 'Jillian Flannery', role: 'Pomeroy Admin', initials: 'JF' },
];

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageView>('journal');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
  
  const [entries, setEntries] = useState<JournalEntry[]>(INITIAL_ENTRIES);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [colonies, setColonies] = useState<ColonyProfile[]>(INITIAL_COLONIES);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);

  const handleSaveEntry = (entry: JournalEntry) => {
    // Check if updating existing
    const exists = entries.find(e => e.id === entry.id);
    if (exists) {
      setEntries(entries.map(e => e.id === entry.id ? entry : e));
    } else {
      setEntries([entry, ...entries]);
    }
  };

  const handleEdit = (entry: JournalEntry) => {
    setEditingEntry(entry);
    setIsModalOpen(true);
  };

  const handleNew = () => {
    setEditingEntry(null);
    setIsModalOpen(true);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'journal': return <FieldJournal entries={entries} onEdit={handleEdit} />;
      case 'colonies': return <Colonies colonies={colonies} />;
      case 'shed': return <YardShed inventory={inventory} />;
      case 'crew': return <BeeCrew crew={CREW} />;
      case 'archive': return (
        <div className="max-w-4xl mx-auto text-center py-20">
          <h1 className="text-4xl font-serif text-stone-300">The Archive</h1>
          <p className="text-stone-500 mt-4">Raw data and budget PDFs are stored here.</p>
        </div>
      );
      default: return <FieldJournal entries={entries} onEdit={handleEdit} />;
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 text-stone-800 font-sans">
      <Navigation 
        currentPage={currentPage} 
        setPage={setCurrentPage} 
        onNewEntry={handleNew} 
      />

      <main className="md:ml-64 p-6 md:p-12 transition-all">
        {renderPage()}
      </main>

      <NewEntryModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveEntry} 
        initialData={editingEntry}
      />
    </div>
  );
};

export default App;
