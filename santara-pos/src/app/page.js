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
 * SANTARA POINT - PREMIUM HOMEPAGE (PIXEL PERFECT VERSION)
 * Visual: High-Impact Glassmorphism & Precise Hierarchy matching User's "Gambar 4"
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

    const handleAction = (type) => {
        const role = localStorage.getItem('currentUserRole');
        const email = localStorage.getItem('registeredEmail');

        if (type === 'login') {
            router.push('/login');
        } else if (type === 'register') {
            router.push('/register');
        } else if (type === 'order') {
            // Absolute Role Routing
            if (role === 'Administrator' || (email && email.toLowerCase() === 'santarapoint@gmail.com')) {
                router.push('/posin-adm');
            } else if (role === 'Operator') {
                router.push('/posin-cas');
            } else {
                router.push('/posin-cus');
            }
        } else if (type === 'profile') {
            if (role === 'Administrator' || (email && email.toLowerCase() === 'santarapoint@gmail.com')) {
                router.push('/posin-adm');
            } else {
                router.push('/posin-cus?settings=true');
            }
        } else if (type === 'kontak') {
            router.push('/kontak');
        } else if (type === 'dokumentasi') {
            router.push('/dokumentasi');
        }
    };

    const handleLogout = async () => {
        try {
            await supabase.auth.signOut();
            localStorage.removeItem('currentUserRole');
            localStorage.removeItem('currentUserContact');
            localStorage.removeItem('customerName');
            localStorage.removeItem('registeredEmail');
            setUser(null);
            router.push('/login');
        } catch (err) {
            console.error("Logout error:", err);
        }
    };

    return (
        <div className="relative min-h-screen w-full flex flex-col font-sans overflow-x-hidden selection:bg-emerald-200 selection:text-emerald-900 bg-black">

            {/* 1. Background Layer */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url('/santara-bg-clean-hd.png')`
                }}
            >
                {/* Precise Overlay to match screenshot depth */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/75 to-black/40"></div>
            </div>

            {/* 2. Navigation Bar (Exact Pixel Matching) */}
            <nav className="relative z-20 flex justify-between items-center px-6 lg:px-16 py-6 backdrop-blur-md flex-none bg-black/0">
                <div className="flex items-center gap-4 group cursor-pointer" onClick={() => router.push('/')}>
                    <div className="bg-white p-2 rounded-2xl shadow-xl">
                        <img src="/santara-logo.png" alt="Logo" className="w-10 h-10 lg:w-11 lg:h-11 object-contain" />
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-2xl lg:text-3xl font-black text-white tracking-tighter leading-none italic">
                            Santara<span className="text-emerald-500">Point</span>
                        </h1>
                        <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-[0.2em] mt-1 hidden sm:block font-sans">Syariah POS Online</span>
                    </div>
                </div>

                <div className="flex items-center gap-4 lg:gap-10">
                    <div className="hidden lg:flex items-center gap-8 mr-4 border-r border-white/10 pr-10">
                        <button onClick={() => handleAction('dokumentasi')} className="text-white/70 hover:text-white font-black text-[13px] transition-colors uppercase tracking-[0.15em]">Dokumentasi</button>
                        <button onClick={() => handleAction('kontak')} className="text-white/70 hover:text-white font-black text-[13px] transition-colors uppercase tracking-[0.15em]">Kontak</button>
                    </div>

                    {!loading && (
                        user ? (
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => handleAction('profile')}
                                    className="bg-emerald-500 hover:bg-emerald-400 text-white px-8 py-3 rounded-2xl font-black text-xs shadow-2xl shadow-emerald-500/20 transition-all active:scale-95 flex items-center gap-2 uppercase tracking-widest"
                                >
                                    <User size={18} /> PROFIL
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="bg-red-500/5 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/30 px-6 py-3 rounded-2xl font-black text-xs transition-all active:scale-95 flex items-center gap-2 uppercase tracking-widest"
                                >
                                    <LogOut size={18} /> KELUAR
                                </button>
                            </div>
                        ) : (
                            <>
                                <button
                                    onClick={() => handleAction('login')}
                                    className="hidden sm:flex items-center gap-2 text-white font-black hover:text-emerald-400 transition text-[13px] uppercase tracking-widest"
                                >
                                    Login Admin
                                </button>
                                <button
                                    onClick={() => handleAction('register')}
                                    className="bg-emerald-500 hover:bg-emerald-400 text-white px-8 py-4 rounded-2xl font-black text-[13px] uppercase tracking-[0.2em] shadow-2xl transition-all active:scale-95"
                                >
                                    Daftar Sekarang
                                </button>
                            </>
                        )
                    )}

                    {/* Mobile Toggle */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden text-white p-3.5 bg-white/5 rounded-2xl border border-white/10"
                    >
                        {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>
            </nav>

            {/* 3. Hero Section (Pixel Perfect to Screenshot) */}
            <main className="relative z-10 px-6 lg:px-16 py-12 lg:py-16 flex-1 flex flex-col justify-center min-h-0">
                <div className="max-w-6xl">
                    <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-5 py-2.5 rounded-full text-emerald-400 text-[11px] lg:text-xs font-black mb-8 animate-fade-in uppercase tracking-[0.25em]">
                        <ShieldCheck size={16} /> POS Full Online Berbasis Syariah
                    </div>

                    <h2 className="text-[clamp(2.5rem,10vw,6.5rem)] font-black text-white mb-8 leading-[0.92] tracking-tighter">
                        Hidangan Lezat, <br />
                        <span className="text-emerald-500">
                            Penuh Keberkahan.
                        </span>
                    </h2>

                    <p className="text-gray-300 text-sm lg:text-lg mb-12 leading-relaxed max-w-2xl font-bold italic opacity-80 pl-2">
                        Nikmati kemudahan memesan menu pilihan Anda secara online. Sistem yang transparan, amanah, dan membawa keberkahan dalam setiap transaksi.
                    </p>

                    <div className="flex flex-wrap items-center gap-8">
                        <button
                            onClick={() => handleAction('order')}
                            className="w-full sm:w-auto bg-white text-emerald-950 hover:bg-emerald-50 px-14 py-5 lg:px-16 lg:py-6 rounded-[2.5rem] font-black text-lg lg:text-xl flex items-center justify-center gap-4 transition-all shadow-2xl hover:-translate-y-2 active:scale-95 uppercase tracking-[0.1em]"
                        >
                            <ShoppingCart size={26} /> PESAN SEKARANG
                        </button>
                        
                        <div className="flex items-center gap-4">
                            <div className="flex -space-x-3">
                                {[11, 12, 13].map(i => (
                                    <div key={i} className="w-12 h-12 rounded-full border-2 border-emerald-900 overflow-hidden shadow-2xl bg-emerald-950">
                                        <img src={`https://i.pravatar.cc/100?img=${i}`} alt="User" />
                                    </div>
                                ))}
                            </div>
                            <div className="text-left font-sans">
                                <p className="text-white font-black text-base tracking-tight">5,000+ Pelanggan</p>
                                <p className="text-emerald-500 font-bold text-[11px] uppercase tracking-widest whitespace-nowrap">TELAH BERGABUNG</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 4. Bottom Grid (Subtle Visual Enhancement) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mt-24 pb-4">
                    {[
                        {
                            icon: <MessageCircle className="text-emerald-400" size={26} />,
                            title: "Zakat & Infaq 2,5%",
                            desc: "Setiap pesanan otomatis menyisihkan dana kepedulian. Hidangan lezat, pahala mengalir deras."
                        },
                        {
                            icon: <ShieldCheck className="text-emerald-400" size={26} />,
                            title: "Amanah & Transparan",
                            desc: "Penyaluran dana amal tercatat otomatis di sistem dan dapat dipantau langsung di nota."
                        },
                        {
                            icon: <ShoppingBag className="text-emerald-400" size={26} />,
                            title: "Akad Muamalah",
                            desc: "Transaksi diproses sesuai prinsip syariah. Jual beli yang tenang, aman, dan barokah."
                        }
                    ].map((feature, index) => (
                        <div
                            key={index}
                            className="group bg-black/50 border border-white/5 backdrop-blur-3xl p-8 rounded-[2.5rem] hover:bg-white/5 transition-all duration-500 shadow-2xl"
                        >
                            <div className="mb-6 p-4 bg-emerald-500/10 rounded-2xl w-fit group-hover:scale-110 transition-all duration-500">
                                {feature.icon}
                            </div>
                            <h4 className="text-white font-black text-sm xl:text-base mb-3 tracking-widest uppercase">{feature.title}</h4>
                            <p className="text-gray-500 text-xs xl:text-sm leading-relaxed font-bold">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </main>

            {/* 5. Minimalist Footer */}
            <footer className="relative z-10 px-6 lg:px-16 py-6 flex-none flex flex-col sm:flex-row justify-between items-center text-gray-500 text-[11px] border-t border-white/5 bg-black/80 backdrop-blur-xl">
                <p className="font-extrabold">© 2024 <span className="text-emerald-500">Santara Point</span>. Dikembangkan dengan prinsip Amanah & Keberkahan.</p>
                <div className="flex gap-10 font-bold uppercase tracking-[0.2em] text-[10px]">
                    <span className="hover:text-emerald-400 cursor-pointer transition-colors">Syarat & Ketentuan</span>
                    <span className="hover:text-emerald-400 cursor-pointer transition-colors">Kebijakan Privasi</span>
                </div>
            </footer>
        </div>
    );
}