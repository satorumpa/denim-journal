"use client";

import React from 'react';

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
  // Sortera efter dagar så att stygnen följer tidslinjen kronologiskt
  const sortedEntries = [...entries].sort((a, b) => a.daysWorn - b.daysWorn);

  // Generera SVG-path för de orangea stygnen
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
    <div 
      className="relative w-full min-h-screen bg-repeat p-8 overflow-hidden select-none"
      style={{ backgroundImage: "url('/denim-bg.jpg')", backgroundAttachment: "fixed" }}
    >
      
      {/* Skikt 1: De orangea jeans-stygnen */}
      {sortedEntries.length > 1 && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
          <path
            d={generateStitchPath()}
            fill="none"
            stroke="#f59e0b" // Klassisk orange/tobaksfärgad söm
            strokeWidth="4"
            strokeDasharray="12, 8" // Skapar själva "stygn"-effekten
            strokeLinecap="round"
            className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]"
          />
        </svg>
      )}

      {/* Skikt 2: Polaroid-bilderna */}
      <div className="relative w-full h-full z-10">
        {sortedEntries.map((entry, index) => {
          // Ge varje bild en subtil, unik rotation baserat på dess index för analog känsla
          const rotations = ['-rotate-2', 'rotate-3', '-rotate-1', 'rotate-2', '-rotate-3'];
          const rotation = rotations[index % rotations.length];

          return (
            <div
              key={entry.id}
              className={`absolute transform ${rotation} transition-transform hover:scale-105 hover:z-20 duration-300`}
              style={{
                left: `${entry.x}%`,
                top: `${entry.y}%`,
                transform: `translate(-50%, -50%)`, // Centrera på koordinaten
              }}
            >
              {/* Polaroid-ramen - Fast bredd så den inte drar iväg */}
              <div className="bg-white p-3 pb-5 shadow-2xl border border-gray-200/50 rounded-sm w-44 sm:w-56 flex flex-col items-center">
                
                {/* Den kvadratiska bildbehållaren */}
                <div className="relative w-full aspect-square bg-gray-100 overflow-hidden border border-gray-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={entry.imageUrl}
                    alt={`Fade efter ${entry.daysWorn} dagar`}
                    className="block w-full h-full object-cover"
                  />
                </div>
                
                {/* Polaroid-text (Texten under bilden) */}
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
    </div>
  );
}
