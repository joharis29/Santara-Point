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
  ArrowRight
} from 'lucide-react';

/**
 * SANTARA POINT - PREMIUM HOMEPAGE
 * Visual: Fullscreen Food Background with Dark Overlay
 */

export default function App() {
  const router = useRouter();

  // Fungsi placeholder untuk navigasi
  const handleAction = (type) => {
    if (type === 'login') {
      router.push('/login');
    } else if (type === 'register') {
      router.push('/register');
    } else if (type === 'order') {
      router.push('/posin-cus');
    } else {
      console.log(`Navigating to: ${type}`);
    }
  };

  return (
    <div className="relative min-h-screen font-sans overflow-x-hidden selection:bg-emerald-200 selection:text-emerald-900">

      {/* 1. Background Layer (Kompilasi Makanan) */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('/santara-bg-clean-hd.png')`
        }}
      >
        {/* Dark Gradient Overlay untuk Keterbacaan Teks */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/30"></div>
      </div>

      {/* 2. Navigation Bar */}
      <nav className="relative z-20 flex justify-between items-center px-6 py-8 lg:px-16 border-b border-white/10 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <img src="/santara-logo.png" alt="Santara Point Logo" className="w-12 h-12 object-contain bg-white rounded-full p-0.5 shadow-lg shadow-black/20" />
          <h1 className="text-2xl font-black text-white tracking-tighter">
            Santara<span className="text-emerald-500">Point</span>
          </h1>
        </div>

        <div className="flex items-center gap-4 lg:gap-8">
          <button
            onClick={() => handleAction('login')}
            className="hidden md:flex items-center gap-2 text-white font-semibold hover:text-emerald-400 transition ease-in-out"
          >
            <User size={18} /> Masuk
          </button>
          <button
            onClick={() => handleAction('register')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-7 py-2.5 rounded-full font-bold shadow-xl shadow-emerald-900/40 transition-all active:scale-95"
          >
            Daftar Pelanggan Baru
          </button>
        </div>
      </nav>

      {/* 3. Hero Section Content */}
      <main className="relative z-10 px-6 lg:px-16 pt-24 lg:pt-40 pb-20">
        <div className="max-w-3xl">
          {/* Badge Syariah */}
          <div className="inline-flex items-center gap-2 bg-emerald-600/20 border border-emerald-500/40 px-4 py-1.5 rounded-full text-emerald-300 text-xs font-bold mb-8 backdrop-blur-xl animate-fade-in">
            <ShieldCheck size={16} /> POS Full Online Berbasis Syariah
          </div>

          <h2 className="text-5xl lg:text-8xl font-black text-white mb-8 leading-[1.1] tracking-tight">
            Hidangan Lezat, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">
              Penuh Keberkahan.
            </span>
          </h2>

          <p className="text-gray-300 text-lg lg:text-xl mb-12 leading-relaxed max-w-xl font-medium">
            Nikmati kemudahan memesan menu pilihan Anda secara online. Sistem yang mudah dan cepat serta ada keberkahan dalam setiap transaksinya.
          </p>

          <div className="flex flex-wrap gap-5">
            <button
              onClick={() => handleAction('order')}
              className="bg-white text-emerald-900 hover:bg-emerald-50 px-10 py-5 rounded-2xl font-black text-xl flex items-center gap-3 transition-all shadow-2xl hover:-translate-y-1 active:scale-95"
            >
              <ShoppingCart size={24} /> Pesan Sekarang
            </button>
          </div>
        </div>

        {/* 4. Features Section (Bottom Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-32">
          {[
            {
              icon: <MessageCircle className="text-emerald-400" size={28} />,
              title: "Belanja Sambil Beramal",
              desc: "Setiap menu yang Anda pesan sudah termasuk dana kepedulian 2,5%. Nikmati hidangan lezat sekaligus tebarkan manfaat bagi yang membutuhkan."
            },
            {
              icon: <ShieldCheck className="text-emerald-400" size={28} />,
              title: "Transparansi Amanah Penyaluran Dana",
              desc: "Sistem kami secara otomatis memisahkan 2,5% dari pesanan Anda untuk disalurkan secara rutin dan tepat sasaran kepada fakir, miskin, dan golongan yang berhak (mustahiq). Nota digital akan merinci secara transparan."
            },
            {
              icon: <ShoppingBag className="text-emerald-400" size={28} />,
              title: "Akad Syariah yang Jelas",
              desc: "Transaksi Anda diproses dengan prinsip muamalah yang benar. Kami memastikan harga, kualitas, dan tujuan dana amal terkelola dengan amanah."
            }
          ].map((feature, index) => (
            <div
              key={index}
              className="group bg-white/5 border border-white/10 backdrop-blur-2xl p-8 rounded-[2.5rem] hover:bg-white/10 hover:border-emerald-500/50 transition-all duration-300 shadow-2xl"
            >
              <div className="mb-6 p-3 bg-emerald-500/10 rounded-2xl w-fit group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h4 className="text-white font-extrabold text-xl mb-3 tracking-tight">{feature.title}</h4>
              <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>

      {/* 5. Footer Kecil */}
      <footer className="relative z-10 px-6 lg:px-16 py-10 flex justify-between items-center text-gray-500 text-xs border-t border-white/5">
        <p>© 2024 Santara Point. Dikembangkan dengan prinsip Amanah.</p>
        <div className="flex gap-4">
          <span className="hover:text-white cursor-pointer transition">Syarat & Ketentuan</span>
          <span className="hover:text-white cursor-pointer transition">Kebijakan Privasi</span>
        </div>
      </footer>
    </div>
  );
}