"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Clock } from 'lucide-react';

export default function DokumentasiPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col justify-center items-center p-6 selection:bg-emerald-200 selection:text-emerald-900 relative overflow-hidden">
      
      {/* Background Ornaments */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-emerald-600/20 blur-[100px] rounded-full pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-teal-800/20 blur-[100px] rounded-full pointer-events-none z-0"></div>

      <div className="relative z-10 w-full max-w-lg text-center flex flex-col items-center">
        <div className="flex justify-center mb-8">
          <div className="p-5 bg-emerald-500/10 text-emerald-400 rounded-full animate-bounce">
            <Clock size={56} />
          </div>
        </div>
        
        <h1 className="text-5xl lg:text-6xl font-black mb-4 tracking-tight">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">Coming Soon</span>
        </h1>
        
        <p className="text-gray-400 mb-12 text-lg">
          Halaman dokumentasi penyaluran dana zakat saat ini sedang dipersiapkan dan akan segera hadir.
        </p>

        <button 
          onClick={() => router.back()} 
          className="inline-flex items-center gap-2 bg-white/10 hover:bg-emerald-600 border border-white/10 hover:border-emerald-500 text-white px-8 py-3.5 rounded-full font-bold transition-all shadow-xl hover:-translate-y-1 active:scale-95"
        >
          <ArrowLeft size={20} /> Kembali ke Beranda
        </button>
      </div>
    </div>
  );
}
