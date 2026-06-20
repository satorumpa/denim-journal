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
    
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) setMessage(error.message);
    else setMessage("Konto skapat! Du loggas in...");
    
    setLoading(false);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setMessage(error.message);
    } else {
      router.push('/');
    }
    setLoading(false);
  };

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 overflow-hidden bg-slate-950">
      
      {/* Bakgrund: Denim-textur med "Luminosity" för en mörkare, råare känsla */}
      <div 
        className="absolute inset-0 z-0 opacity-40 mix-blend-luminosity"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=2000&auto=format&fit=crop')", 
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      />
      {/* Mörk radiell gradient som skapar ett snyggt djup mot mitten */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#020617_100%)] z-0 pointer-events-none" />

      {/* Själva inloggningskortet: Frostad glas-effekt (Glassmorphism) */}
      <div className="relative z-10 w-full max-w-md bg-white/[0.03] backdrop-blur-2xl border border-white/10 p-8 sm:p-10 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        
        {/* Logotyp & Header */}
        <div className="flex flex-col items-center mb-10">
          <div className="h-12 w-12 bg-white rounded-full flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(255,255,255,0.3)]">
            <span className="font-black text-slate-950 text-xl tracking-tighter">DJ</span>
          </div>
          <h1 className="text-2xl font-black tracking-[0.15em] text-white text-center">
            DENIM JOURNAL
          </h1>
          <p className="text-[10px] text-slate-400 font-mono tracking-widest uppercase mt-2">
            Autentisering
          </p>
        </div>

        <form className="space-y-5">
          
          {/* Snyggt input-fält med "Flytande Etikett" (Floating Label) */}
          <div className="relative">
            <input 
              type="email" 
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder=" "
              className="peer w-full bg-white/5 border border-white/10 px-4 pt-6 pb-2 rounded-xl text-sm font-mono text-white focus:outline-none focus:border-white/50 focus:bg-white/10 transition-all"
            />
            <label 
              htmlFor="email"
              className="absolute left-4 top-4 text-xs font-mono tracking-wider text-slate-400 transition-all pointer-events-none 
                         peer-focus:top-2 peer-focus:text-[9px] peer-focus:text-white/70 
                         peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-[9px] peer-[:not(:placeholder-shown)]:text-white/70"
            >
              E-POSTADRESS
            </label>
          </div>

          <div className="relative">
            <input 
              type="password" 
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder=" "
              className="peer w-full bg-white/5 border border-white/10 px-4 pt-6 pb-2 rounded-xl text-sm font-mono text-white focus:outline-none focus:border-white/50 focus:bg-white/10 transition-all"
            />
            <label 
              htmlFor="password"
              className="absolute left-4 top-4 text-xs font-mono tracking-wider text-slate-400 transition-all pointer-events-none 
                         peer-focus:top-2 peer-focus:text-[9px] peer-focus:text-white/70 
                         peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-[9px] peer-[:not(:placeholder-shown)]:text-white/70"
            >
              LÖSENORD
            </label>
          </div>

          {/* Meddelande/Fel-ruta */}
          {message && (
            <div className="p-3 bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm mt-4">
              <p className="text-[11px] font-mono text-center text-white/90">{message}</p>
            </div>
          )}

          {/* Knappar med mjuka hover-effekter */}
          <div className="flex flex-col gap-3 mt-8 pt-2">
            <button
              onClick={handleSignIn}
              disabled={loading}
              className="group relative w-full bg-white text-slate-950 font-bold font-mono py-4 rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] disabled:opacity-50 disabled:hover:scale-100"
            >
              <span className="text-xs tracking-widest uppercase">Logga in</span>
            </button>
            
            <button
              onClick={handleSignUp}
              disabled={loading}
              className="w-full bg-transparent text-slate-300 font-mono py-3.5 border border-white/10 rounded-xl transition-all duration-300 hover:bg-white/5 hover:text-white hover:border-white/30 text-[11px] tracking-widest uppercase"
            >
              Skapa nytt konto
            </button>
          </div>
          
        </form>
      </div>
    </main>
  );
}
