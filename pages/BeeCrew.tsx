import React from 'react';
import { CrewMember } from '../types';
import { Mail, Phone, PenTool } from 'lucide-react';

interface BeeCrewProps {
  crew: CrewMember[];
}

const BeeSketchIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full p-3 text-stone-700 opacity-80" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    {/* Wings (Behind) */}
    <path d="M35 45 C 10 20, 0 50, 35 55" strokeDasharray="2 2" strokeWidth="1.5" className="text-stone-400" />
    <path d="M65 45 C 90 20, 100 50, 65 55" strokeDasharray="2 2" strokeWidth="1.5" className="text-stone-400" />
    <path d="M38 40 C 20 10, 10 30, 38 45" strokeDasharray="2 2" strokeWidth="1.5" className="text-stone-400" />
    <path d="M62 40 C 80 10, 90 30, 62 45" strokeDasharray="2 2" strokeWidth="1.5" className="text-stone-400" />

    {/* Body */}
    <ellipse cx="50" cy="55" rx="14" ry="22" fill="#fafaf9" stroke="currentColor" />
    
    {/* Stripes */}
    <path d="M38 50 H62" strokeWidth="2.5" />
    <path d="M36 58 H64" strokeWidth="2.5" />
    <path d="M40 66 H60" strokeWidth="2.5" />
    
    {/* Head */}
    <circle cx="50" cy="28" r="9" fill="#fafaf9" stroke="currentColor" />
    
    {/* Antennae */}
    <path d="M45 20 L 40 10" strokeWidth="2" />
    <path d="M55 20 L 60 10" strokeWidth="2" />
  </svg>
);

const BeeCrew: React.FC<BeeCrewProps> = ({ crew }) => {
  return (
    <div className="pb-24">
      <header className="mb-10 border-b border-stone-300 pb-6">
        <h1 className="text-4xl md:text-5xl font-serif text-stone-900 mb-2">The Bee Crew</h1>
        <p className="text-stone-600 font-serif italic text-lg">Stewards of the Pomeroy Project.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {crew.map((member, index) => (
          <div key={index} className="bg-white p-6 rounded-lg border border-stone-200 shadow-sm hover:border-amber-200 hover:shadow-md transition-all group relative overflow-hidden flex flex-col">
            
            {/* Top Section: Avatar & Identity */}
            <div className="flex items-start gap-5 mb-5 relative z-10">
                {/* Portrait - Custom Naturalist Sketch */}
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-stone-200 shadow-inner shrink-0 bg-stone-100 group-hover:border-amber-300 transition-colors flex items-center justify-center">
                   <BeeSketchIcon />
                </div>
                
                <div className="flex-1 min-w-0 pt-1">
                    <div className="flex justify-between items-start">
                        <div className="pr-4">
                           <h3 className="text-2xl font-serif font-bold text-stone-800 leading-tight mb-1">{member.name}</h3>
                           {/* Unified Title Color */}
                           <p className="text-xs font-bold uppercase tracking-widest text-amber-700">
                              {member.role}
                           </p>
                        </div>
                        
                        {/* Journal Author Badge */}
                        {(member.role.includes('Lead') || member.role.includes('Mentor')) && (
                           <div className="bg-stone-50 border border-stone-100 p-1.5 rounded-full text-stone-400 shrink-0" title="Journal Author">
                              <PenTool className="w-4 h-4" />
                           </div>
                         )}
                    </div>
                </div>
            </div>
              
            {/* Contact Card - Full Width Block */}
            <div className="bg-stone-50 p-4 rounded border border-stone-100 relative z-10 mt-auto">
                 {member.email && (
                   <div className="flex items-start gap-3 mb-2">
                      <Mail className="w-4 h-4 mt-0.5 text-stone-400 shrink-0" />
                      <a href={`mailto:${member.email}`} className="text-sm text-stone-600 hover:text-amber-700 hover:underline transition-colors break-all leading-tight font-medium">
                        {member.email}
                      </a>
                   </div>
                 )}
                 {member.phone && (
                   <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-stone-400 shrink-0" />
                      <a href={`tel:${member.phone.replace(/[^\d]/g, '')}`} className="text-sm text-stone-600 hover:text-amber-700 hover:underline transition-colors font-medium">
                        {member.phone}
                      </a>
                   </div>
                 )}
                 {!member.email && !member.phone && (
                    <span className="text-xs text-stone-400 italic pl-1">Contact via Pomeroy Admin</span>
                 )}
            </div>

            {/* Decorative Initials */}
            <div className="absolute top-2 right-4 text-6xl font-serif font-black text-stone-50 opacity-0 group-hover:opacity-100 transition-opacity select-none pointer-events-none z-0">
               {member.initials}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BeeCrew;
