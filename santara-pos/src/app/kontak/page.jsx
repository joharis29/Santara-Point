"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Phone, ArrowLeft } from 'lucide-react';

export default function ContactPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col justify-center items-center p-6 selection:bg-emerald-200 selection:text-emerald-900 relative overflow-hidden">
      
      {/* Background Ornaments */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-emerald-600/20 blur-[100px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-emerald-800/20 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="w-full max-w-lg relative z-10">
        <button 
          onClick={() => router.back()} 
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft size={20} /> Kembali
        </button>

        <h1 className="text-4xl font-black mb-2 tracking-tight">Hubungi Kami</h1>
        <p className="text-gray-400 mb-10">
          Punya pertanyaan atau masukan? Jangan ragu untuk menghubungi tim Santara Point melalui kontak di bawah ini.
        </p>

        <div className="space-y-4">
          {/* Email */}
          <a 
            href="mailto:santarapoint@gmail.com"
            className="group flex items-center p-5 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-emerald-500/50 transition-all duration-300"
          >
            <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl group-hover:scale-110 transition-transform mr-5">
              <Mail size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Email</p>
              <p className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">santarapoint@gmail.com</p>
            </div>
          </a>

          {/* WhatsApp */}
          <a 
            href="https://wa.me/6285846802177"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center p-5 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-emerald-500/50 transition-all duration-300"
          >
            <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl group-hover:scale-110 transition-transform mr-5">
              <Phone size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">WhatsApp</p>
              <p className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">0858-4680-2177</p>
            </div>
          </a>
        </div>

        <div className="mt-12 text-center text-sm text-gray-500">
          © 2024 Santara Point. Berkah setiap saat.
        </div>
      </div>
    </div>
  );
}
