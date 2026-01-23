'use client';

import { useState } from 'react';

export default function Home() {
  const [dbStatus, setDbStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [version, setVersion] = useState<string>('');

  const checkConnection = async () => {
    setDbStatus('loading');
    try {
      const res = await fetch('/api/health');
      const data = await res.json();

      if (res.ok && data.success) {
        setVersion(data.version);
        setDbStatus('success');
      } else {
        setDbStatus('error');
      }
    } catch (err) {
      setDbStatus('error');
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#1b1b1b] text-white p-6 relative overflow-hidden">
      {/* Background Gradient Effect (CS2 Smoke/Blue vibe) */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-900/20 to-orange-900/10 pointer-events-none" />

      {/* Main Card */}
      <div className="z-10 w-full max-w-2xl bg-[#0d0d0d]/80 backdrop-blur-md border border-white/10 p-10 rounded-lg shadow-2xl">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black tracking-tighter italic text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-200 mb-2">
            Skin Trader Market
          </h1>
          <p className="text-gray-400 font-mono text-sm tracking-widest uppercase">
            CS348 Project <span className="text-orange-500 mx-2">•</span>  By Bach Le
          </p>
        </div>

        {/* Action Section */}
        <div className="flex flex-col items-center space-y-6">
          <button
            onClick={checkConnection}
            disabled={dbStatus === 'loading'}
            className={`
              group relative px-8 py-4 font-bold uppercase tracking-widest text-sm transition-all duration-300
              ${dbStatus === 'loading' ? 'opacity-70 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}
            `}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 skew-x-[-12deg] rounded-sm group-hover:from-blue-500 group-hover:to-blue-700 transition-colors" />
            <span className="relative z-10 drop-shadow-md">
              {dbStatus === 'loading' ? 'CONNECTING...' : 'HELLO WORLD!!'}
            </span>
          </button>
        </div>
      </div>
    </main>
  );
}

