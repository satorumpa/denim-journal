"use client";

import React, { useState } from 'react';

interface JournalEntry {
  id: string;
  imageUrl: string;
  daysWorn: number;
  caption: string;
  x: number; 
  y: number;
}

interface DenimCollageProps {
  entries: JournalEntry[];
}

export default function DenimCollage({ entries }: DenimCollageProps) {
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);

  const sortedEntries = [...entries].sort((a, b) => a.daysWorn - b.daysWorn);

  const generateStitchPath = () => {
    if (sortedEntries.length < 2) return "";
    return sortedEntries
      .map((entry, index) => {
        const prefix = index === 0 ? "M" : "L";
        return `${prefix} ${entry.x}% ${entry.y}%`;
      })
      .join(" ");
  };

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-slate-950">
      
      {/* Det faktiska jeans-lagret */}
      <div 
        className="absolute inset-0 bg-repeat z-0"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=2000&auto=format&fit=crop')", 
          backgroundAttachment: "fixed",
          backgroundSize: "500px"
        }}
      />

      <div className="absolute inset-0 bg-slate-950/40 z-0 pointer-events-none" />
      
      {/* Skikt 1: De orangea jeans-stygnen */}
      {sortedEntries.length > 1 && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
          <path
            d={generateStitchPath()}
            fill="none"
            stroke="#f59e0b" 
            strokeWidth="3" 
            strokeDasharray="10, 7" 
            strokeLinecap="round"
            className="drop-shadow-[0_1.5px_3px_rgba(0,0,0,0.8)]"
          />
        </svg>
      )}

      {/* Skikt 2: Polaroid-bilderna i litet format */}
      <div className="relative w-full h-full z-20 min-h-screen">
        {sortedEntries.map((entry, index) => {
          const rotations = ['-rotate-2', 'rotate-3', '-rotate-1', 'rotate-2', '-rotate-3'];
          const rotation = rotations[index % rotations.length];

          return (
            <div
              key={entry.id}
              onClick={() => setSelectedEntry(entry)}
              className={`absolute transform ${rotation} transition-transform hover:scale-110 hover:z-40 duration-300 cursor-pointer`}
              style={{
                left: `${entry.x}%`,
                top: `${entry.y}%`,
                transform: `translate(-50%, -50%)`,
              }}
            >
              {/* TVINGAD BREDD MED INLINE STYLE */}
              <div 
                className="bg-white p-2 pb-3 shadow-2xl border border-gray-200/50 rounded-sm flex flex-col items-center"
                style={{ width: '110px' }} // <- Här låser vi storleken totalt!
              >
                <div className="relative w-full aspect-square bg-gray-100 overflow-hidden border border-gray-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={entry.imageUrl}
                    alt={`Fade efter ${entry.daysWorn} dagar`}
                    className="block object-cover"
                    style={{ width: '100%', height: '100%' }} // <- Tvingar bilden att fylla den lilla rutan
                  />
                </div>
                
                <div className="mt-1.5 text-center font-mono text-gray-800 w-full">
                  <p className="font-bold text-[10px] text-indigo-950">
                    Dag {entry.daysWorn}
                  </p>
                  {entry.caption && (
                    <p className="text-[9px] text-gray-500 italic mt-0.5 px-1 truncate w-full">
                      "{entry.caption}"
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Skikt 3: Lighbox / Större visningsläge (SKOTTSÄKER POSITIONERING) */}
      {selectedEntry && (
        <div 
          className="flex items-center justify-center bg-black/95 backdrop-blur-md cursor-zoom-out"
          onClick={() => setSelectedEntry(null)}
          style={{
            position: 'fixed', // Låser fast den
            top: 0,            // Högst upp
            left: 0,           // Längst till vänster
            width: '100vw',    // Fyller hela bredden
            height: '100vh',   // Fyller hela skärmhöjden oavsett scroll!
            zIndex: 99999,     // Garanterat överst
          }}
        >
          <div 
            className="relative bg-white p-4 rounded-sm shadow-2xl flex flex-col items-center cursor-default"
            onClick={(e) => e.stopPropagation()} 
            style={{
              width: '90%',
              maxWidth: '600px',
              maxHeight: '90vh',
            }}
          >
            <button 
              onClick={() => setSelectedEntry(null)}
              className="absolute top-3 right-3 text-slate-400 hover:text-slate-900 font-mono text-xs uppercase tracking-widest transition-colors z-10"
            >
              [ x ]
            </button>
            
            <div 
              className="w-full mt-4 bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden"
              style={{ maxHeight: '60vh' }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedEntry.imageUrl}
                alt={`Större bild efter ${selectedEntry.daysWorn} dagar`}
                style={{ width: '100%', maxHeight: '60vh', objectFit: 'contain' }}
              />
            </div>
            
            <div className="mt-4 text-center font-mono text-slate-800 w-full pb-2">
              <p className="font-bold text-lg text-indigo-950">
                Dag {selectedEntry.daysWorn}
              </p>
              {selectedEntry.caption && (
                <p className="text-sm text-gray-600 italic mt-1.5 px-2">
                  "{selectedEntry.caption}"
                </p>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
