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
  // Nytt state för att hålla koll på vilken bild användaren har klickat på
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
            strokeWidth="4"
            strokeDasharray="12, 8" 
            strokeLinecap="round"
            className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
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
              // Gör hela polaroiden klickbar
              onClick={() => setSelectedEntry(entry)}
              className={`absolute transform ${rotation} transition-transform hover:scale-105 hover:z-40 duration-300 cursor-pointer`}
              style={{
                left: `${entry.x}%`,
                top: `${entry.y}%`,
                transform: `translate(-50%, -50%)`,
              }}
            >
              {/* Polaroid-ramen (Småbilderna) */}
              <div className="bg-white p-3 pb-5 shadow-2xl border border-gray-200/50 rounded-sm w-40 sm:w-48 flex flex-col items-center">
                
                <div className="relative w-full aspect-square bg-gray-100 overflow-hidden border border-gray-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={entry.imageUrl}
                    alt={`Fade efter ${entry.daysWorn} dagar`}
                    className="block w-full h-full object-cover"
                  />
                </div>
                
                <div className="mt-3 text-center font-mono text-gray-800 w-full">
                  <p className="font-bold text-xs sm:text-sm text-indigo-950">
                    Dag {entry.daysWorn}
                  </p>
                  {entry.caption && (
                    <p className="text-[10px] sm:text-xs text-gray-500 italic mt-0.5 px-1 truncate w-full">
                      "{entry.caption}"
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Skikt 3: Lighbox / Större visningsläge när man klickat på en bild */}
      {selectedEntry && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 sm:p-8 backdrop-blur-md cursor-zoom-out"
          onClick={() => setSelectedEntry(null)} // Stäng när man klickar utanför
        >
          {/* Stora Polaroid-ramen */}
          <div 
            className="relative bg-white p-4 sm:p-6 pb-8 sm:pb-12 rounded-sm shadow-2xl max-w-2xl w-full flex flex-col items-center cursor-default"
            onClick={(e) => e.stopPropagation()} // Förhindra att klick på själva ramen stänger fönstret
          >
            <button 
              onClick={() => setSelectedEntry(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 font-mono text-xs sm:text-sm uppercase tracking-widest transition-colors"
            >
              [ Stäng ]
            </button>
            
            <div className="w-full mt-6 bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedEntry.imageUrl}
                alt={`Större bild efter ${selectedEntry.daysWorn} dagar`}
                className="w-full max-h-[60vh] object-contain"
              />
            </div>
            
            <div className="mt-6 text-center font-mono text-slate-800 w-full">
              <p className="font-bold text-lg sm:text-xl text-indigo-950">
                Dag {selectedEntry.daysWorn}
              </p>
              {selectedEntry.caption && (
                <p className="text-sm sm:text-base text-gray-600 italic mt-2">
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
