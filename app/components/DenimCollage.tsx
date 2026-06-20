"use client";

import React, { useState } from 'react';

interface JournalEntry {
  id: string;
  imageUrl: string;
  daysWorn: number;
  caption: string;
}

interface DenimCollageProps {
  entries: JournalEntry[];
}

export default function DenimCollage({ entries }: DenimCollageProps) {
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);

  // Sortera kronologiskt
  const sortedEntries = [...entries].sort((a, b) => a.daysWorn - b.daysWorn);

  return (
    <div className="w-full max-w-7xl mx-auto px-6">
      
      {/* App-rutnätet (Grid) */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 sm:gap-6 lg:gap-8">
        {sortedEntries.map((entry) => (
          <div
            key={entry.id}
            onClick={() => setSelectedEntry(entry)}
            // App-ikon-styling: Kvadratisk, stark rundning (squircle), shadow och hover-effekt
            className="group relative aspect-square w-full rounded-[22%] bg-slate-900 shadow-xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.05] hover:shadow-[0_10px_30px_rgba(0,0,0,0.6)] border border-white/5 hover:border-white/20"
          >
            <img
              src={entry.imageUrl}
              alt={`Dag ${entry.daysWorn}`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            
            {/* Mörk toning i botten för att texten alltid ska synas */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
            
            <div className="absolute bottom-3 sm:bottom-4 left-0 w-full text-center px-2">
              <p className="text-[10px] sm:text-xs font-mono font-bold text-white tracking-widest drop-shadow-md">
                DAG {entry.daysWorn}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Resan (Fullskärms-overlay när man klickar) */}
      {selectedEntry && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 backdrop-blur-2xl cursor-zoom-out p-4"
          onClick={() => setSelectedEntry(null)}
        >
          <div 
            className="relative w-full max-w-4xl flex flex-col md:flex-row items-center md:items-start gap-8 cursor-default"
            onClick={(e) => e.stopPropagation()} 
          >
            {/* Stängknapp */}
            <button 
              onClick={() => setSelectedEntry(null)}
              className="absolute -top-12 right-0 md:-top-8 md:-right-8 text-white/50 hover:text-white font-mono text-sm tracking-widest transition-colors flex items-center gap-2"
            >
              STÄNG <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
            
            {/* Bilden */}
            <div className="w-full md:w-3/5 relative rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10">
              <img
                src={selectedEntry.imageUrl}
                alt={`Dag ${selectedEntry.daysWorn}`}
                className="w-full max-h-[65vh] md:max-h-[80vh] object-contain bg-black/50"
              />
            </div>
            
            {/* Resans Data (Texten vid sidan av eller under bilden) */}
            <div className="w-full md:w-2/5 flex flex-col pt-4 md:pt-12 text-center md:text-left px-4 md:px-0">
              <p className="text-amber-500 font-mono text-xs tracking-widest uppercase mb-2">Tidslinje</p>
              <h3 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-6">
                Dag {selectedEntry.daysWorn}
              </h3>
              
              {selectedEntry.caption && (
                <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
                  <p className="text-sm md:text-base text-white/80 font-mono italic leading-relaxed">
                    "{selectedEntry.caption}"
                  </p>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
