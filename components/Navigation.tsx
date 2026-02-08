import React from 'react';
import { BookOpen, Hexagon, Warehouse, Users, Archive, PenTool } from 'lucide-react';
import { PageView } from '../types';

interface NavigationProps {
  currentPage: PageView;
  setPage: (page: PageView) => void;
  onNewEntry: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentPage, setPage, onNewEntry }) => {
  const navItems: { id: PageView; label: string; icon: React.ReactNode }[] = [
    { id: 'journal', label: 'Field Journal', icon: <BookOpen className="w-6 h-6" /> },
    { id: 'colonies', label: 'The Colonies', icon: <Hexagon className="w-6 h-6" /> },
    { id: 'shed', label: 'The Yard Shed', icon: <Warehouse className="w-6 h-6" /> },
    { id: 'crew', label: 'The Bee Crew', icon: <Users className="w-6 h-6" /> },
    { id: 'archive', label: 'Archive', icon: <Archive className="w-6 h-6" /> },
  ];

  return (
    <>
      {/* Mobile Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-stone-900 text-stone-100 p-4 pb-8 md:hidden z-50 shadow-lg border-t-4 border-amber-600">
        <div className="flex justify-between items-center">
          {navItems.slice(0, 4).map((item) => (
            <button
              key={item.id}
              onClick={() => setPage(item.id)}
              className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                currentPage === item.id ? 'text-amber-500 bg-stone-800' : 'text-stone-400'
              }`}
            >
              {item.icon}
              <span className="text-xs mt-1 font-serif">{item.label.split(' ')[1] || item.label}</span>
            </button>
          ))}
          <button
            onClick={onNewEntry}
            className="flex flex-col items-center p-2 bg-amber-600 rounded-full text-white shadow-xl -mt-8 border-4 border-stone-100"
          >
            <PenTool className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col w-64 bg-stone-900 text-stone-100 h-screen fixed left-0 top-0 p-6 border-r border-stone-700">
        <h1 className="text-2xl font-serif text-amber-500 mb-2">The Pomeroy Apiary</h1>
        <p className="text-stone-400 text-sm mb-10 italic">Est. 2024 • San Francisco</p>
        
        <nav className="flex-1 space-y-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setPage(item.id)}
              className={`flex items-center space-x-3 w-full p-3 rounded-lg text-left transition-all ${
                currentPage === item.id 
                  ? 'bg-amber-900/30 text-amber-500 border-l-4 border-amber-500' 
                  : 'text-stone-400 hover:text-stone-100 hover:bg-stone-800'
              }`}
            >
              {item.icon}
              <span className="font-serif text-lg tracking-wide">{item.label}</span>
            </button>
          ))}
        </nav>

        <button
          onClick={onNewEntry}
          className="bg-amber-600 hover:bg-amber-700 text-white p-4 rounded-lg flex items-center justify-center space-x-2 shadow-lg transition-transform transform hover:scale-105"
        >
          <PenTool className="w-5 h-5" />
          <span className="font-bold tracking-wider">NEW ENTRY</span>
        </button>
      </div>
    </>
  );
};

export default Navigation;
