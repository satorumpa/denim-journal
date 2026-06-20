"use client";

import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) setMessage(error.message);
    else setMessage("Konto skapat! Du loggas in...");
    
    setLoading(false);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
    } else {
      // Om inloggningen lyckas, skicka tillbaka användaren till startsidan!
      router.push('/');
    }
    setLoading(false);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-slate-950">
      
      {/* Bakgrundsstruktur för att matcha temat */}
      <div 
        className="absolute inset-0 bg-repeat z-0 opacity-30"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=2000&auto=format&fit=crop')", 
          backgroundSize: "500px"
        }}
      />

      <div className="relative z-10 w-full max-w-sm bg-slate-900 border border-slate-800 p-8 shadow-2xl">
        <h1 className="text-2xl font-black tracking-widest text-white text-center mb-2">
          DENIM JOURNAL
        </h1>
        <p className="text-[10px] text-slate-400 font-mono tracking-widest uppercase text-center mb-8">
          Identifiera dig
        </p>

        <form className="space-y-4">
          <div>
            <label className="block text-[10px] font-mono tracking-wider text-slate-400 mb-1">E-POST</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 p-2.5 text-xs font-mono focus:outline-none focus:border-white text-white transition-colors"
              placeholder="din@epost.se"
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono tracking-wider text-slate-400 mb-1">LÖSENORD (MINST 6 TECKEN)</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 p-2.5 text-xs font-mono focus:outline-none focus:border-white text-white transition-colors"
              placeholder="••••••••"
            />
          </div>

          {message && (
            <p className="text-xs font-mono text-amber-500 text-center py-2">{message}</p>
          )}

          <div className="flex flex-col gap-3 mt-6">
            <button
              onClick={handleSignIn}
              disabled={loading}
              className="w-full bg-white hover:bg-slate-200 disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 font-bold font-mono py-3 transition-colors text-xs tracking-wider uppercase"
            >
              Logga in
            </button>
            <button
              onClick={handleSignUp}
              disabled={loading}
              className="w-full bg-transparent hover:bg-slate-800 text-white font-mono py-2.5 border border-slate-700 transition-colors text-xs tracking-wider uppercase"
            >
              Skapa nytt konto
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
