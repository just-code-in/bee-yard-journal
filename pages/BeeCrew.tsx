import React from 'react';
import { CrewMember } from '../types';
import { Mail, Shield, User } from 'lucide-react';

interface BeeCrewProps {
  crew: CrewMember[];
}

const BeeCrew: React.FC<BeeCrewProps> = ({ crew }) => {
  return (
    <div className="max-w-4xl mx-auto pb-24">
      <header className="mb-10 border-b border-stone-300 pb-6">
        <h1 className="text-4xl font-serif text-stone-900 mb-2">The Bee Crew</h1>
        <p className="text-stone-600 font-serif italic text-lg">Stewards of the Pomeroy Project.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {crew.map((member, index) => (
          <div key={index} className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm flex items-start gap-4 hover:border-amber-400 transition-colors group">
            <div className="bg-stone-100 p-3 rounded-full text-stone-400 group-hover:bg-amber-50 group-hover:text-amber-600 transition-colors">
              {member.role.includes('Advisor') ? <Shield className="w-6 h-6" /> : <User className="w-6 h-6" />}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-stone-800 font-serif">{member.name}</h3>
              <p className="text-amber-700 text-sm font-bold uppercase tracking-wide mb-2">{member.role}</p>
              
              <div className="flex items-center gap-2 mt-4">
                 <button className="flex items-center gap-2 text-sm text-stone-500 hover:text-stone-800 border border-stone-200 rounded px-3 py-1.5 transition-colors">
                    <Mail className="w-3 h-3" />
                    Contact
                 </button>
              </div>
            </div>
            <div className="text-4xl font-serif font-black text-stone-100 select-none group-hover:text-amber-50">
               {member.initials}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BeeCrew;
