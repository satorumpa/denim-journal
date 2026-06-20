"use client";

import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';
import DenimCollage from './components/DenimCollage';

export const dynamic = 'force-dynamic';

interface JournalEntry {
  id: string;
  imageUrl: string;
  daysWorn: number;
  caption: string;
  x: number;
  y: number;
}

export default function Home() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [file, setFile] = useState<File | null>(null);
  const [daysWorn, setDaysWorn] = useState('');
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);

  const fetchEntries = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('jeans_entries')
        .select('*')
        .order('days_worn', { ascending: true });

      if (data && Array.isArray(data)) {
        const mapped = data.map((d: any) => ({
          id: d.id,
          imageUrl: d.image_url,
          daysWorn: d.days_worn,
          caption: d.caption || '',
          x: d.x_position,
          y: d.y_position
        }));
        setEntries(mapped);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !daysWorn) return;
    setUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('jeans-images').upload(fileName, file);
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from('jeans-images').getPublicUrl(fileName);
      
      const { error: insertError } = await supabase.from('jeans_entries').insert([{
        image_url: urlData.publicUrl,
        days_worn: parseInt(daysWorn),
        caption: caption,
        x_position: 0, // Används inte längre i rutnätet, men vi behåller för databasens skull
        y_position: 0
      }]);
      if (insertError) throw insertError;

      setFile(null); setDaysWorn(''); setCaption(''); setIsModalOpen(false);
      fetchEntries();
    } catch (error: any) {
      alert("Fel: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <main className="relative min-h-screen w-full bg-slate-950 overflow-x-hidden pb-20">
      
      {/* Bakgrunden stannar i botten */}
      <div 
        className="fixed inset-0 z-0 opacity-40 mix-blend-luminosity"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=2000&auto=format&fit=crop')", backgroundSize: "cover", backgroundPosition: "center" }}
      />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top,_transparent_0%,_#020617_100%)] z-0 pointer-events-none" />

      {/* STATISK HEADER - Låst högst upp */}
      <header className="sticky top-0 z-40 w-full flex flex-row items-center justify-between px-6 py-4 bg-slate-950/70 backdrop-blur-xl border-b border-white/10">
        <div className="flex flex-col">
          <h1 className="text-xl md:text-2xl font-black tracking-[0.15em] text-white">
            DENIM JOURNAL
          </h1>
          <p className="text-[9px] md:text-[10px] text-white/60 font-mono tracking-widest uppercase mt-0.5">
            » Trådar som berättar en historia
          </p>
        </div>
        
        {/* Snygg, modern piller-knapp */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="group flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white text-white hover:text-slate-950 font-mono text-[10px] sm:text-xs font-bold uppercase tracking-widest rounded-full transition-all duration-300 border border-white/20 hover:border-white shadow-lg"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
          </svg>
          <span className="hidden sm:inline">Ny bild</span>
        </button>
      </header>

      {/* Uppladdnings-Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 text-white p-6 rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-sm font-bold font-mono tracking-wider uppercase">Ny tidslinjebild</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white font-mono text-xs uppercase">[ Stäng ]</button>
            </div>
            <form onSubmit={handleUpload} className="space-y-5">
              <div>
                <label className="block text-[10px] font-mono tracking-wider text-slate-400 mb-1">VÄLJ BILD</label>
                <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="w-full text-xs text-slate-400 file:mr-4 file:py-1.5 file:px-3 file:border file:border-slate-700 file:rounded-full file:text-xs file:font-mono file:bg-slate-950 file:text-white hover:file:bg-slate-800" />
              </div>
              <div>
                <label className="block text-[10px] font-mono tracking-wider text-slate-400 mb-1">ANTAL DAGAR ANVÄNDA</label>
                <input type="number" placeholder="Ex: 120" value={daysWorn} onChange={(e) => setDaysWorn(e.target.value)} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-xs font-mono focus:outline-none focus:border-white text-white" />
              </div>
              <div>
                <label className="block text-[10px] font-mono tracking-wider text-slate-400 mb-1">BILDTEXT (VALFRI)</label>
                <input type="text" placeholder="Ex: Tredje tvätten" value={caption} onChange={(e) => setCaption(e.target.value)} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-xs font-mono focus:outline-none focus:border-white text-white" />
              </div>
              <button type="submit" disabled={uploading} className="w-full bg-white hover:bg-slate-200 text-slate-950 font-bold font-mono py-3 rounded-xl transition-colors text-xs tracking-wider uppercase mt-4">
                {uploading ? "Laddar upp..." : "Publicera"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Rutnätet (App-layout) */}
      <div className="relative z-20 w-full pt-8">
        <DenimCollage entries={Array.isArray(entries) ? entries : []} />
      </div>
      
    </main>
  );
}
