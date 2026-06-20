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
  // State för att hålla koll på vilken bild användaren har klickat på
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
            strokeWidth="3" // Lite tunnare tråd för mindre bilder
            strokeDasharray="10, 7" 
            strokeLinecap="round"
            className="drop-shadow-[0_1.5px_3px_rgba(0,0,0,0.8)]"
          />
        </svg>
      )}

      {/* Skikt 2: Polaroid-bilderna i litet format (Krympta previews) */}
      <div className="relative w-full h-full z-20 min-h-screen">
        {sortedEntries.map((entry, index) => {
          const rotations = ['-rotate-2', 'rotate-3', '-rotate-1', 'rotate-2', '-rotate-3'];
          const rotation = rotations[index % rotations.length];

          return (
            <div
              key={entry.id}
              onClick={() => setSelectedEntry(entry)}
              className={`absolute transform ${rotation} transition-transform hover:scale-105 hover:z-40 duration-300 cursor-pointer`}
              style={{
                left: `${entry.x}%`,
                top: `${entry.y}%`,
                transform: `translate(-50%, -50%)`,
              }}
            >
              {/* Polaroid-ramen (HÄR ÄR BREDDEN KRYMPTS) */}
              <div className="bg-white p-2 pb-3 shadow-2xl border border-gray-200/50 rounded-sm w-28 sm:w-36 flex flex-col items-center transition-all duration-300">
                
                <div className="relative w-full aspect-square bg-gray-100 overflow-hidden border border-gray-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={entry.imageUrl}
                    alt={`Fade efter ${entry.daysWorn} dagar`}
                    className="block w-full h-full object-cover"
                  />
                </div>
                
                {/* Mindre font för mindre ramar */}
                <div className="mt-1.5 text-center font-mono text-gray-800 w-full">
                  <p className="font-bold text-[10px] sm:text-xs text-indigo-950">
                    Dag {entry.daysWorn}
                  </p>
                  {entry.caption && (
                    <p className="text-[9px] sm:text-[10px] text-gray-500 italic mt-0.5 px-1 truncate w-full">
                      "{entry.caption}"
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Skikt 3: Lighbox / Större visningsläge (INGEN SCROLL) */}
      {selectedEntry && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 sm:p-6 backdrop-blur-lg cursor-zoom-out"
          onClick={() => setSelectedEntry(null)}
        >
          {/* Stora Polaroid-ramen - Begränsad höjd för att passa skärmen */}
          <div 
            className="relative bg-white p-4 sm:p-5 rounded-sm shadow-2xl max-w-xl w-full max-h-[85vh] flex flex-col items-center cursor-default overflow-hidden"
            onClick={(e) => e.stopPropagation()} 
          >
            {/* Stäng-knapp flyttad för bättre placering */}
            <button 
              onClick={() => setSelectedEntry(null)}
              className="absolute top-3 right-3 text-slate-400 hover:text-slate-900 font-mono text-xs uppercase tracking-widest transition-colors z-10"
            >
              [ x ]
            </button>
            
            <div className="w-full mt-4 bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedEntry.imageUrl}
                alt={`Större bild efter ${selectedEntry.daysWorn} dagar`}
                // Begränsad höjd på bilden för att garantera passform mot texten
                className="w-full max-h-[55vh] object-contain block"
              />
            </div>
            
            <div className="mt-4 text-center font-mono text-slate-800 w-full pb-3 overflow-y-auto">
              <p className="font-bold text-lg sm:text-xl text-indigo-950">
                Dag {selectedEntry.daysWorn}
              </p>
              {selectedEntry.caption && (
                <p className="text-sm sm:text-base text-gray-600 italic mt-1.5 px-2">
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
