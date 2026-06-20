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
      
      {/* Det faktiska jeans-lagret (Garanterat äkta denim-textur) */}
      <div 
        className="absolute inset-0 bg-repeat z-0"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=2000&auto=format&fit=crop')", 
          backgroundAttachment: "fixed",
          backgroundSize: "500px"
        }}
      />

      {/* En mjuk, mörk toning över jeansen för maximal kontrast mot den vita texten */}
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

      {/* Skikt 2: Polaroid-bilderna */}
      <div className="relative w-full h-full z-20 min-h-screen">
        {sortedEntries.map((entry, index) => {
          const rotations = ['-rotate-2', 'rotate-3', '-rotate-1', 'rotate-2', '-rotate-3'];
          const rotation = rotations[index % rotations.length];

          return (
            <div
              key={entry.id}
              className={`absolute transform ${rotation} transition-transform hover:scale-105 hover:z-40 duration-300`}
              style={{
                left: `${entry.x}%`,
                top: `${entry.y}%`,
                transform: `translate(-50%, -50%)`,
              }}
            >
              {/* Polaroid-ramen */}
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
                
                {/* Polaroid-text */}
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
