"use client";

import DenimCollage from './components/DenimCollage';

// Det här är vår temporära demo-data som simulerar bilder från olika tidspunkter
const demoJeansJourney = [
  {
    id: '1',
    // En snygg startbild på ett par råa jeans
    imageUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop',
    daysWorn: 1,
    caption: 'Helt nya! Styva som kartong.',
    x: 25, // Position i procent från vänster
    y: 25, // Position i procent från toppen
  },
  {
    id: '2',
    imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&auto=format&fit=crop',
    daysWorn: 90,
    caption: 'Första vecken bakom knäna (whiskers).',
    x: 50,
    y: 45,
  },
  {
    id: '3',
    imageUrl: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=600&auto=format&fit=crop',
    daysWorn: 180,
    caption: 'Efter första tvätten. Kontrasterna börjar komma!',
    x: 75,
    y: 30,
  },
  {
    id: '4',
    imageUrl: 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=600&auto=format&fit=crop',
    daysWorn: 365,
    caption: 'Ett helt år av dagligt användande. Perfekt blekning.',
    x: 45,
    y: 75,
  },
];

export default function Home() {
  return (
    <main className="relative min-h-screen w-full bg-slate-900">
      
      {/* Enkel, snygg rubrik som svävar över kollaget */}
      <div className="absolute top-6 left-6 z-30 bg-slate-950/80 text-white px-6 py-3 rounded-xl backdrop-blur-md shadow-2xl border border-slate-800">
        <h1 className="text-xl font-black tracking-widest text-indigo-100">DENIM JOURNAL</h1>
        <p className="text-xs text-amber-400 font-mono mt-0.5">» Trådar som berättar en historia</p>
      </div>

      {/* Här laddar vi in kollaget och skickar med vår demo-data */}
      <DenimCollage entries={demoJeansJourney} />
      
    </main>
  );
}
