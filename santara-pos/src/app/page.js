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
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

/**
 * SANTARA POINT - PREMIUM HOMEPAGE
 * Visual: Fullscreen Food Background with Dark Overlay
 */

export default function App() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [customerName, setCustomerName] = useState('Sobat Santara');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // 1. Check initial session
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
        if (session?.user) {
          const meta = session.user.user_metadata || {};
          if (meta.first_name || meta.last_name) {
            setCustomerName(`${meta.first_name || ''} ${meta.last_name || ''}`.trim());
          }
        }
      } catch (err) {
        console.error("Auth check error:", err);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // 2. Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        const meta = session.user.user_metadata || {};
        if (meta.first_name || meta.last_name) {
          setCustomerName(`${meta.first_name || ''} ${meta.last_name || ''}`.trim());
        }
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Fungsi placeholder untuk navigasi
  const handleAction = (type) => {
    if (type === 'login') {
      router.push('/login');
    } else if (type === 'register') {
      router.push('/register');
    } else if (type === 'order') {
      router.push('/posin-cus');
    } else if (type === 'profile') {
      router.push('/posin-cus?settings=true');
    } else if (type === 'kontak') {
      router.push('/kontak');
    } else if (type === 'dokumentasi') {
      router.push('/dokumentasi');
    } else {
      console.log(`Navigating to: ${type}`);
    }
  };
  
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem('currentUserRole');
      localStorage.removeItem('currentUserContact');
      localStorage.removeItem('customerName');
      setUser(null);
      router.push('/login');
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col font-sans overflow-x-hidden selection:bg-emerald-200 selection:text-emerald-900">

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
      <nav className="relative z-20 flex justify-between items-center px-4 lg:px-12 py-3 border-b border-white/10 backdrop-blur-sm flex-none">
        <div className="flex items-center gap-2 lg:gap-3">
          <img src="/santara-logo.png" alt="Santara Point Logo" className="w-8 h-8 lg:w-10 lg:h-10 object-contain bg-white rounded-full p-0.5 shadow-lg shadow-black/20" />
          <h1 className="text-lg lg:text-xl font-black text-white tracking-tighter">
            Santara<span className="text-emerald-500">Point</span>
          </h1>
        </div>

        <div className="flex items-center gap-2 lg:gap-4">
          <button
            onClick={() => handleAction('dokumentasi')}
            className="hidden md:block text-gray-300 hover:text-white px-2 py-1.5 font-bold text-xs lg:text-sm transition-colors"
          >
            Dokumentasi
          </button>
          <button
            onClick={() => handleAction('kontak')}
            className="hidden sm:block bg-white/10 hover:bg-white/20 border border-white/20 text-white px-3 py-1.5 lg:px-5 lg:py-2.5 rounded-full font-bold text-xs lg:text-sm backdrop-blur-md transition-all active:scale-95"
          >
            Kontak Kami
          </button>

          {!loading && (
            user ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleAction('profile')}
                  className="hidden sm:flex bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 lg:px-6 lg:py-2.5 rounded-full font-bold text-xs lg:text-sm shadow-xl shadow-emerald-900/40 transition-all active:scale-95 items-center gap-2"
                >
                  <User size={18} /> Profil
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-red-500/80 hover:bg-red-600 text-white p-2 lg:px-4 lg:py-2.5 rounded-full font-bold text-xs lg:text-sm shadow-lg transition-all active:scale-95 flex items-center gap-2"
                  title="Keluar"
                >
                  <LogOut size={18} /> <span className="hidden lg:inline">Keluar</span>
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => handleAction('login')}
                  className="hidden md:flex items-center gap-2 text-white font-semibold hover:text-emerald-400 transition ease-in-out text-sm mr-1"
                >
                  <User size={16} /> Masuk
                </button>
                <button
                  onClick={() => handleAction('register')}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 lg:px-6 lg:py-2.5 rounded-full font-bold text-xs lg:text-sm shadow-xl shadow-emerald-900/40 transition-all active:scale-95"
                >
                  Daftar
                </button>
              </>
            )
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-all"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-emerald-950/95 backdrop-blur-xl border-b border-white/10 flex flex-col p-6 gap-4 z-[100] md:hidden animate-fade-in-down shadow-2xl">
            <button onClick={() => { handleAction('dokumentasi'); setIsMobileMenuOpen(false); }} className="flex items-center gap-3 text-white font-bold text-sm p-3 hover:bg-white/5 rounded-xl transition-all">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> Dokumentasi Layanan
            </button>
            <button onClick={() => { handleAction('kontak'); setIsMobileMenuOpen(false); }} className="flex items-center gap-3 text-white font-bold text-sm p-3 hover:bg-white/5 rounded-xl transition-all">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> Kontak Kami
            </button>
            {user ? (
              <>
                <button onClick={() => { handleAction('profile'); setIsMobileMenuOpen(false); }} className="flex items-center gap-3 text-emerald-400 font-bold text-sm p-3 bg-white/5 rounded-xl transition-all">
                  <User size={18} /> Profil Saya
                </button>
                <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="flex items-center gap-3 text-red-400 font-bold text-sm p-3 bg-red-500/10 rounded-xl transition-all">
                  <LogOut size={18} /> Keluar / Logout
                </button>
              </>
            ) : (
              <button onClick={() => { handleAction('login'); setIsMobileMenuOpen(false); }} className="flex items-center gap-3 text-emerald-400 font-bold text-sm p-3 bg-white/5 rounded-xl transition-all">
                <User size={18} /> Masuk Akun
              </button>
            )}
          </div>
        )}
      </nav>

      {/* 3. Hero Section Content */}
      <main className="relative z-10 px-4 lg:px-12 py-2 lg:py-4 flex-1 flex flex-col justify-around min-h-0">
        <div className="max-w-2xl mt-4">
          {/* Badge Syariah */}
          <div className="inline-flex items-center gap-1.5 bg-emerald-600/20 border border-emerald-500/40 px-3 py-1 rounded-full text-emerald-300 text-[10px] lg:text-xs font-bold mb-3 backdrop-blur-xl animate-fade-in">
            <ShieldCheck size={14} /> POS Full Online Berbasis Syariah
          </div>

          <h2 className="text-4xl lg:text-5xl xl:text-6xl font-black text-white mb-3 leading-[1.1] tracking-tight">
            Hidangan Lezat, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">
              Penuh Keberkahan.
            </span>
          </h2>

          <p className="text-gray-300 text-xs lg:text-sm mb-5 leading-relaxed max-w-lg font-medium">
            Nikmati kemudahan memesan menu pilihan Anda secara online. Sistem yang mudah dan cepat serta ada keberkahan dalam setiap transaksinya.
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => handleAction('order')}
              className="bg-white text-emerald-900 hover:bg-emerald-50 px-6 py-2.5 lg:px-8 lg:py-3 rounded-xl font-black text-sm lg:text-base flex items-center gap-2 transition-all shadow-xl hover:-translate-y-1 active:scale-95"
            >
              <ShoppingCart size={20} /> Pesan Sekarang
            </button>
          </div>
        </div>

        {/* 4. Features Section (Bottom Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 lg:gap-5 mt-4 pb-2">
          {[
            {
              icon: <MessageCircle className="text-emerald-400" size={20} />,
              title: "Belanja Sambil Beramal",
              desc: "Setiap pesanan termasuk dana kepedulian 2,5%. Nikmati hidangan lezat sekaligus tebarkan manfaat bagi yang membutuhkan."
            },
            {
              icon: <ShieldCheck className="text-emerald-400" size={20} />,
              title: "Penyaluran Transparan",
              desc: "Sistem otomatis memisahkan 2,5% pesanan untuk disalurkan rutin kepada mustahiq. Nota digital merinci secara transparan."
            },
            {
              icon: <ShoppingBag className="text-emerald-400" size={20} />,
              title: "Akad Syariah Jelas",
              desc: "Transaksi diproses dengan prinsip muamalah yang benar. Kami memastikan harga dan tujuan dana amal terkelola amanah."
            }
          ].map((feature, index) => (
            <div
              key={index}
              className="group bg-white/5 border border-white/10 backdrop-blur-2xl p-4 lg:p-5 rounded-2xl hover:bg-white/10 hover:border-emerald-500/50 transition-all duration-300 shadow-xl"
            >
              <div className="mb-3 p-2 bg-emerald-500/10 rounded-lg w-fit group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h4 className="text-white font-extrabold text-sm xl:text-base mb-1.5 tracking-tight">{feature.title}</h4>
              <p className="text-gray-400 text-[10px] xl:text-xs leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>

      {/* 5. Footer Kecil (Branding Bawah) */}
      <footer className="relative z-10 px-4 lg:px-12 py-3 flex-none flex justify-between items-center text-gray-500 text-[10px] lg:text-xs border-t border-white/5 bg-black/40">
        <p>© 2024 Santara Point. Dikembangkan dengan prinsip Amanah.</p>
        <div className="flex gap-4">
          <span className="hover:text-white cursor-pointer transition">Syarat & Ketentuan</span>
          <span className="hover:text-white cursor-pointer transition">Kebijakan Privasi</span>
        </div>
      </footer>
    </div>
  );
}