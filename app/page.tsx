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

  // 1. Hämta bilder från Supabase live!
  const fetchEntries = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('jeans_entries')
      .select('*')
      .order('daysWorn', { ascending: true });

    if (error) {
      console.error("Fel vid hämtning:", error);
    } else if (data) {
      // Mappa om databasens kolumner till det format vårt kollage vill ha
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

  // 2. En funktion för att slänga in en testbild i databasen direkt från hemsidan
  const addTestPhoto = async () => {
    // Vi slumpar positioner så de inte hamnar på varandra
    const randomX = Math.floor(Math.random() * 60) + 20; // 20-80%
    const randomY = Math.floor(Math.random() * 60) + 20; // 20-80%
    const randomDays = Math.floor(Math.random() * 300) + 1;

    const { error } = await supabase
      .from('jeans_entries')
      .insert([
        {
          image_url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600',
          days_worn: randomDays,
          caption: `Testbild skapad live! Dag ${randomDays}`,
          x_position: randomX,
          y_position: randomY
        }
      ]);

    if (error) {
      alert("Kunde inte lägga till bild: " + error.message);
    } else {
      // Hämta listan på nytt för att visa den nya bilden direkt
      fetchEntries();
    }
  };

  return (
    <main className="relative min-h-screen w-full bg-slate-900">
      
      {/* Header */}
      <div className="absolute top-6 left-6 z-30 bg-slate-950/80 text-white px-6 py-3 rounded-xl backdrop-blur-md shadow-2xl border border-slate-800">
        <h1 className="text-xl font-black tracking-widest text-indigo-100">DENIM JOURNAL</h1>
        <p className="text-xs text-amber-400 font-mono mt-0.5">» Live-koppling till Supabase</p>
        
        {/* Vår magiska test-knapp */}
        <button 
          onClick={addTestPhoto}
          className="mt-3 w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs py-2 px-3 rounded-md transition-colors shadow-md"
        >
          {loading ? "Laddar..." : "+ Släng in en testbild"}
        </button>
      </div>

      {/* Kollaget (visar tom skärm eller bilderna från databasen) */}
      {entries.length === 0 && !loading ? (
        <div className="absolute inset-0 flex items-center justify-center text-slate-400 font-mono text-sm z-10">
          Kollaget är tomt. Tryck på knappen för att lägga till första tråden!
        </div>
      ) : (
        <DenimCollage entries={entries} />
      )}
      
    </main>
  );
}
