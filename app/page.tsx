"use client";

import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';
import DenimCollage from './components/DenimCollage';

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
  
  // Formulär-states
  const [file, setFile] = useState<File | null>(null);
  const [daysWorn, setDaysWorn] = useState('');
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);

  const fetchEntries = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('jeans_entries')
      .select('*')
      .order('days_worn', { ascending: true });

    if (error) {
      console.error("Fel vid hämtning:", error);
    } else if (data) {
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
    setLoading(false);
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !daysWorn) return alert("Välj en bild och fyll i antal dagar!");

    setUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('jeans-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('jeans-images')
        .getPublicUrl(filePath);

      const imageUrl = urlData.publicUrl;

      const randomX = Math.floor(Math.random() * 60) + 20;
      const randomY = Math.floor(Math.random() * 60) + 20;

      const { error: insertError } = await supabase
        .from('jeans_entries')
        .insert([
          {
            image_url: imageUrl,
            days_worn: parseInt(daysWorn),
            caption: caption,
            x_position: randomX,
            y_position: randomY
          }
        ]);

      if (insertError) throw insertError;

      setFile(null);
      setDaysWorn('');
      setCaption('');
      setIsModalOpen(false);
      
      fetchEntries();

    } catch (error: any) {
      alert("Något gick fel: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <main className="relative min-h-screen w-full bg-slate-950">
      
      {/* NY STILREN HEADER: Helt utan mörk bakgrundsbox, ren vit text direkt på denim */}
      <div className="absolute top-8 left-8 z-30 select-none pointer-events-auto">
        <h1 className="text-2xl font-black tracking-widest text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
          DENIM JOURNAL
        </h1>
        <p className="text-xs text-white/70 font-mono mt-1 tracking-wide drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
          » Trådar som berättar en historia
        </p>
        
        {/* Minimalistisk vit knapp */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="mt-4 bg-transparent hover:bg-white text-white hover:text-slate-950 font-bold font-mono text-[11px] tracking-wider py-2 px-4 border border-white rounded-none transition-all duration-300 uppercase shadow-lg"
        >
          + Lägg till bild
        </button>
      </div>

      {/* Uppladdnings-Modal (Behålls mörk för läsbarhet mot formulärfält) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 text-white rounded-none p-6 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-sm font-bold font-mono tracking-wider uppercase text-white">Ny tidslinjebild</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white font-mono text-xs uppercase tracking-wider"
              >
                [ Stäng ]
              </button>
            </div>

            <form onSubmit={handleUpload} className="space-y-5">
              <div>
                <label className="block text-[10px] font-mono tracking-wider text-slate-400 mb-1">VÄLJ BILD</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="w-full text-xs text-slate-400 file:mr-4 file:py-1.5 file:px-3 file:border file:border-slate-700 file:text-xs file:font-mono file:bg-slate-950 file:text-white hover:file:bg-slate-800 file:transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono tracking-wider text-slate-400 mb-1">ANTAL DAGAR ANVÄNDA</label>
                <input 
                  type="number" 
                  placeholder="Ex: 120"
                  value={daysWorn}
                  onChange={(e) => setDaysWorn(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 p-2 text-xs font-mono focus:outline-none focus:border-white text-white"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono tracking-wider text-slate-400 mb-1">BILDTEXT (VALFRI)</label>
                <input 
                  type="text" 
                  placeholder="Ex: Tredje tvätten"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 p-2 text-xs font-mono focus:outline-none focus:border-white text-white"
                />
              </div>

              <button
                type="submit"
                disabled={uploading}
                className="w-full bg-white hover:bg-slate-200 disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 font-bold font-mono py-2.5 transition-colors text-xs tracking-wider uppercase"
              >
                {uploading ? "Laddar upp..." : "Publicera"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Kollaget */}
      {entries.length === 0 && !loading ? (
        <div className="absolute inset-0 flex items-center justify-center text-white/40 font-mono text-xs uppercase tracking-widest z-10 select-none pointer-events-none">
          Kollaget är tomt
        </div>
      ) : (
        <DenimCollage entries={entries} />
      )}
      
    </main>
  );
}
