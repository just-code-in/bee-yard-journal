export interface WeatherSnapshot {
  temperature: number;
  condition: string;
  wind: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  author: string;
  weather: WeatherSnapshot;
  phenology: string; // "Phenology Check"
  narrative: string;
  technicalNotes: {
    clusterSize: string;
    queenStatus: 'Queenright' | 'Queenless' | 'Virgin' | 'Unknown';
    interventions: string[];
    diseases: string[];
  };
  media?: {
    type: 'image' | 'video';
    url: string;
    caption: string;
  }[];
  tags: string[]; // Mentions of advisors
}

export interface ColonyProfile {
  id: string;
  name: string;
  type: 'Overwintered' | 'Split' | 'Swarm';
  status: 'Active' | 'Planned' | 'Collapsed';
  queenName?: string;
  healthScore: number; // 0-100
  lastInspection: string;
  notes: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'Hive Body' | 'Frame' | 'Feed' | 'Treatment' | 'Tool';
  quantity: number;
  status: 'Good' | 'Fair' | 'Flagged for Removal';
  notes?: string;
}

export interface CrewMember {
  name: string;
  role: string;
  initials: string;
  email?: string;
}

export interface Flora {
  id: string;
  commonName: string;
  scientificName: string;
  type: 'Nectar' | 'Pollen' | 'Both';
  bloomMonths: number[]; // 0-11
  peakMonths: number[]; // 0-11
  color: string; // Tailwind class
  sketchUrl?: string; // URL for the AI generated sketch
}

export type PageView = 'journal' | 'colonies' | 'shed' | 'crew' | 'archive';
