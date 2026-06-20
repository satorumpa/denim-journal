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

  // 1. Hämta bilder från Supabase live!
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

  // 2. Hantera uppladdning av bild och data
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !daysWorn) return alert("Välj en bild och fyll i antal dagar!");

    setUploading(true);

    try {
      // A. Skapa ett unikt filnamn för Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      // B. Ladda upp filen till 'jeans-images' hinken
      const { error: uploadError } = await supabase.storage
        .from('jeans-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // C. Hämta den publika URL:en för bilden vi nyss laddade upp
      const { data: urlData } = supabase.storage
        .from('jeans-images')
        .getPublicUrl(filePath);

      const imageUrl = urlData.publicUrl;

      // D. Slumpa koordinater för kollaget så de sprids ut (0-100%)
      const randomX = Math.floor(Math.random() * 60) + 20; // Mellan 20% och 80%
      const randomY = Math.floor(Math.random() * 60) + 20;

      // E. Spara posten i databasen
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

      // Återställ formuläret och stäng rutan
      setFile(null);
      setDaysWorn('');
      setCaption('');
      setIsModalOpen(false);
      
      // Hämta om listan så nya bilden dyker upp direkt
      fetchEntries();

    } catch (error: any) {
      alert("Något gick fel: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <main className="relative min-h-screen w-full bg-slate-900">
      
      {/* Header med kontrollpanel */}
      <div className="absolute top-6 left-6 z-30 bg-slate-950/80 text-white px-6 py-3 rounded-xl backdrop-blur-md shadow-2xl border border-slate-800">
        <h1 className="text-xl font-black tracking-widest text-indigo-100">DENIM JOURNAL</h1>
        <p className="text-xs text-amber-400 font-mono mt-0.5">» Dokumentera dina fades</p>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="mt-3 w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs py-2 px-4 rounded-md transition-colors shadow-md border border-indigo-400/20"
        >
          + Ladda upp bild på dina jeans
        </button>
      </div>

      {/* Uppladdnings-Modal (Popup-fönster) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-indigo-200">Ny tidslinjebild</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white font-bold text-sm"
              >
                Stäng
              </button>
            </div>

            <form onSubmit={handleUpload} className="space-y-4">
              {/* Filväljare */}
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">VÄLJ BILD</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-indigo-950 file:text-indigo-300 hover:file:bg-indigo-900"
                />
              </div>

              {/* Antal dagar */}
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">ANTAL DAGAR ANVÄNDA (WEAR DAYS)</label>
                <input 
                  type="number" 
                  placeholder="Ex: 120"
                  value={daysWorn}
                  onChange={(e) => setDaysWorn(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-md p-2 text-sm focus:outline-none focus:border-indigo-500 text-white"
                />
              </div>

              {/* Bildtext */}
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">BILDTEXT / NOTERING (VALFRI)</label>
                <input 
                  type="text" 
                  placeholder="Ex: Första tvätten gjord!"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-md p-2 text-sm focus:outline-none focus:border-indigo-500 text-white"
                />
              </div>

              {/* Skicka-knapp */}
              <button
                type="submit"
                disabled={uploading}
                className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-slate-700 text-slate-950 font-bold py-2.5 rounded-md transition-colors text-sm shadow-lg mt-2"
              >
                {uploading ? "Laddar upp till molnet..." : "Publicera till kollaget"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Kollaget */}
      {entries.length === 0 && !loading ? (
        <div className="absolute inset-0 flex items-center justify-center text-slate-400 font-mono text-sm z-10">
          Kollaget är tomt. Tryck på knappen för att starta din denim-resa!
        </div>
      ) : (
        <DenimCollage entries={entries} />
      )}
      
    </main>
  );
}
