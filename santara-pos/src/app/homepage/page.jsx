"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ShoppingBag,
  ShieldCheck,
  MessageCircle,
  Store,
  User,
  ShoppingCart,
  ChevronRight,
  ArrowRight,
  Menu,
  X
} from 'lucide-react';

/**
 * SANTARA POINT - PREMIUM HOMEPAGE
 * Visual: Fullscreen Food Background with Dark Overlay
 */

const DEFAULT_SETTINGS = {
    storeName: 'Santara Point',
    storeTagline: 'Hidangan Lezat, Penuh Keberkahan.',
    whatsapp: '6285846802177',
    email: 'santarapoint@gmail.com',
    address: 'Jl. Raya Santara No. 123, Bandung',
    footerText: '© 2024 Santara Point. Berkah setiap saat.'
};

export default function App() {
  const router = useRouter();
  const [storeSettings, setStoreSettings] = useState(DEFAULT_SETTINGS);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('santaraStoreSettings');
    if (stored) {
      setStoreSettings(JSON.parse(stored));
    }
  }, []);

  // Fungsi placeholder untuk navigasi
  const handleAction = (type) => {
    if (type === 'login') {
      router.push('/login');
    } else if (type === 'register') {
      router.push('/register');
    } else if (type === 'order') {
      router.push('/posin-cus');
    } else if (type === 'kontak') {
      router.push('/kontak');
    } else if (type === 'dokumentasi') {
      router.push('/dokumentasi');
    } else {
      console.log(`Navigating to: ${type}`);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col font-sans overflow-x-hidden selection:bg-emerald-200 selection:text-emerald-900 bg-black">

      {/* 1. Background Layer (Kompilasi Makanan) */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('/santara-bg-clean-hd.png')`
        }}
      >
        {/* Dark Gradient Overlay untuk Keterbacaan Teks */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/30"></div>
      </div>

      {/* 2. Navigation Bar */}
      <nav className="relative z-50 flex justify-between items-center px-6 lg:px-12 py-4 border-b border-white/10 backdrop-blur-xl flex-none bg-black/20">
        <div className="flex items-center gap-2 lg:gap-3">
          <img src="/santara-logo.png" alt="Santara Point Logo" className="w-8 h-8 lg:w-10 lg:h-10 object-contain bg-white rounded-full p-0.5 shadow-lg shadow-black/20" />
          <h1 className="text-xl lg:text-2xl font-black text-white tracking-tighter">
            {storeSettings.storeName.split(' ')[0]}<span className="text-emerald-500">{storeSettings.storeName.split(' ').slice(1).join('')}</span>
          </h1>
        </div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-6">
          <button onClick={() => handleAction('login')} className="flex items-center gap-2 text-white font-bold hover:text-emerald-400 transition-all text-sm">
            <User size={18} /> Masuk
          </button>
          <button onClick={() => handleAction('dokumentasi')} className="text-gray-300 hover:text-white font-bold text-sm transition-all">
            Dokumentasi
          </button>
          <button onClick={() => handleAction('kontak')} className="text-gray-300 hover:text-white font-bold text-sm transition-all">
            Kontak
          </button>
          <button onClick={() => handleAction('register')} className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-full font-black text-sm shadow-xl shadow-emerald-900/40 transition-all active:scale-95">
            Daftar Baru
          </button>
        </div>

        {/* Mobile Toggle */}
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden text-white p-2">
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 top-[73px] bg-black/95 backdrop-blur-2xl z-50 flex flex-col p-8 gap-8 lg:hidden animate-in fade-in slide-in-from-top-4 duration-300">
            <button onClick={() => handleAction('login')} className="text-2xl font-black text-white flex items-center gap-4">
              <User size={24} className="text-emerald-500" /> Masuk Akun
            </button>
            <button onClick={() => handleAction('register')} className="text-2xl font-black text-white flex items-center gap-4">
              <ShoppingCart size={24} className="text-emerald-500" /> Daftar Sekarang
            </button>
            <button onClick={() => handleAction('kontak')} className="text-2xl font-black text-white flex items-center gap-4">
              <MessageCircle size={24} className="text-emerald-500" /> Kontak Kami
            </button>
            <button onClick={() => handleAction('dokumentasi')} className="text-2xl font-black text-white flex items-center gap-4">
              <ShieldCheck size={24} className="text-emerald-500" /> Dokumentasi Layanan
            </button>
            <div className="mt-auto border-t border-white/10 pt-8">
              <p className="text-emerald-500 font-bold mb-2">Santara Point POS</p>
              <p className="text-gray-500 text-sm">{storeSettings.storeTagline}</p>
            </div>
          </div>
        )}
      </nav>

      {/* 3. Hero Section Content */}
      <main className="relative z-10 px-6 lg:px-12 py-10 lg:py-24 flex-1 flex flex-col justify-center min-h-[500px]">
        <div className="max-w-4xl">
          {/* Badge Syariah */}
          <div className="inline-flex items-center gap-2 bg-emerald-600/20 border border-emerald-500/40 px-4 py-2 rounded-full text-emerald-300 text-xs lg:text-sm font-black mb-6 backdrop-blur-3xl animate-fade-in shadow-xl shadow-emerald-900/20">
            <ShieldCheck size={18} /> POS Full Online Berbasis Syariah
          </div>

          <h2 className="text-5xl lg:text-7xl xl:text-8xl font-black text-white mb-6 leading-[1.05] tracking-tighter">
            {storeSettings.storeTagline.split(',')[0]}, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600 animate-gradient-x">
              {storeSettings.storeTagline.split(',')[1] || ''}
            </span>
          </h2>

          <p className="text-gray-300 text-sm lg:text-xl mb-10 leading-relaxed max-w-2xl font-medium">
            Nikmati kemudahan memesan menu pilihan Anda secara online. Sistem yang mudah, transparan, dan penuh keberkahan dalam setiap transaksi.
          </p>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => handleAction('order')}
              className="w-full sm:w-auto bg-white text-emerald-900 hover:bg-emerald-50 px-10 py-4 lg:px-12 lg:py-5 rounded-2xl font-black text-base lg:text-xl flex items-center justify-center gap-3 transition-all shadow-2xl hover:-translate-y-2 active:scale-95 group"
            >
              <ShoppingCart size={28} className="group-hover:rotate-12 transition-transform" /> Pesan Sekarang
            </button>
          </div>
        </div>

        {/* 4. Features Section (Bottom Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mt-16 lg:mt-24 pb-8">
          {[
            {
              icon: <MessageCircle className="text-emerald-400" size={24} />,
              title: "Kualitas Premium",
              desc: "Kami menyajikan hidangan dengan bahan baku pilihan yang selalu segar setiap harinya untuk menjaga cita rasa terbaik."
            },
            {
              icon: <ShieldCheck className="text-emerald-400" size={24} />,
              title: "Jaminan Halal & Higienis",
              desc: "Seluruh proses pengolahan makanan kami dilakukan dengan standar kebersihan tinggi dan jaminan kehalalan 100%."
            },
            {
              icon: <ShoppingBag className="text-emerald-400" size={24} />,
              title: "Pesanan Cepat & Mudah",
              desc: "Nikmati kemudahan memesan menu favorit Anda melalui sistem online kami yang terintegrasi untuk layanan yang lebih efisien."
            }
          ].map((feature, index) => (
            <div
              key={index}
              className="group bg-white/5 border border-white/10 backdrop-blur-3xl p-6 lg:p-8 rounded-[2rem] hover:bg-white/10 hover:border-emerald-500/50 transition-all duration-500 shadow-2xl overflow-hidden relative"
            >
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all"></div>
              <div className="mb-4 p-3 bg-emerald-500/10 rounded-2xl w-fit group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all duration-500">
                {feature.icon}
              </div>
              <h4 className="text-white font-black text-lg xl:text-xl mb-3 tracking-tight">{feature.title}</h4>
              <p className="text-gray-400 text-xs xl:text-sm leading-relaxed font-medium">{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>

      {/* 5. Footer Kecil (Branding Bawah) */}
      <footer className="relative z-10 px-4 lg:px-12 py-3 flex-none flex justify-between items-center text-gray-500 text-[10px] lg:text-xs border-t border-white/5 bg-black/40">
        <p>{storeSettings.footerText}</p>
        <div className="flex gap-4">
          <span className="hover:text-white cursor-pointer transition">Syarat & Ketentuan</span>
          <span className="hover:text-white cursor-pointer transition">Kebijakan Privasi</span>
        </div>
      </footer>
    </div>
  );
}