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
import BackgroundSlider from '@/components/BackgroundSlider';

/**
 * SANTARA POINT - PREMIUM HOMEPAGE
 * Visual: Fullscreen Food Background with Dark Overlay
 */

export default function HomePage() {
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
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'PASSWORD_RECOVERY') {
                router.push('/reset-password');
                return;
            }

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
        const role = localStorage.getItem('currentUserRole');

        if (type === 'login') {
            router.push('/login');
        } else if (type === 'register') {
            router.push('/register');
        } else if (type === 'order') {
            // Role-Aware Redirection
            if (role === 'Administrator') {
                router.push('/posin-adm');
            } else if (role === 'Operator') {
                router.push('/posin-cas');
            } else {
                router.push('/posin-cus');
            }
        } else if (type === 'profile') {
            if (role === 'Administrator') {
                router.push('/posin-adm?settings=true&tab=profile');
            } else if (role === 'Operator') {
                router.push('/posin-cas?settings=true&tab=profile');
            } else {
                router.push('/posin-cus?settings=true&tab=profile');
            }
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
        <div className="relative h-screen w-full flex flex-col font-sans overflow-hidden selection:bg-emerald-200 selection:text-emerald-900">

            {/* 1. Background Layer (Kompilasi Makanan - Moving Slider) */}
            <BackgroundSlider
                images={[
                    '/santara-bg-clean-hd.png',
                    '/santara-slide-2.png',
                    '/santara-slide-3.png',
                    '/santara-slide-4.png',
                    '/santara-slide-5.png'
                ]}
                interval={7000}
            />

            {/* 2. Navigation Bar */}
            <nav className="relative z-20 flex justify-between items-center px-6 lg:px-16 py-3 border-b border-white/5 backdrop-blur-md flex-none">
                <div className="flex items-center gap-2 lg:gap-4 group cursor-pointer" onClick={() => router.push('/')}>
                    <div className="bg-white p-1 rounded-xl lg:rounded-2xl shadow-xl shadow-black/20 group-hover:scale-110 transition-transform duration-500">
                        <img src="/santara-logo.png" alt="Santara Point Logo" className="w-7 h-7 lg:w-11 lg:h-11 object-contain rounded-lg lg:rounded-xl" />
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-lg lg:text-2xl font-black text-white tracking-tighter leading-none">
                            Santara<span className="text-emerald-500">Point</span>
                        </h1>
                        <span className="text-[9px] text-emerald-400/80 font-black uppercase tracking-[0.3em] mt-1 hidden sm:block">POS Full Online Berbasis Syariah</span>
                    </div>
                </div>

                <div className="flex items-center gap-3 lg:gap-6">
                    <div className="hidden lg:flex items-center gap-6 mr-4 border-r border-white/10 pr-6">
                        <button onClick={() => handleAction('dokumentasi')} className="text-gray-400 hover:text-white font-bold text-xs transition-colors uppercase tracking-widest">Dokumentasi</button>
                        <button onClick={() => handleAction('kontak')} className="text-gray-400 hover:text-white font-bold text-xs transition-colors uppercase tracking-widest">Kontak</button>
                    </div>

                    {!loading && (
                        user ? (
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => handleAction('profile')}
                                    className="hidden sm:flex bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-2xl font-black text-xs shadow-xl shadow-emerald-900/40 transition-all active:scale-95 items-center gap-2 uppercase tracking-widest"
                                >
                                    <User size={16} /> Profil
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/30 px-4 py-2.5 rounded-2xl font-black text-xs transition-all active:scale-95 flex items-center gap-2 uppercase tracking-widest"
                                >
                                    <LogOut size={16} /> <span className="hidden lg:inline">Keluar</span>
                                </button>
                            </div>
                        ) : (
                            <>
                                <button
                                    onClick={() => handleAction('login')}
                                    className="hidden md:flex items-center gap-2 text-white font-black hover:text-emerald-400 transition text-xs uppercase tracking-widest"
                                >
                                    Masuk
                                </button>
                                <button
                                    onClick={() => handleAction('register')}
                                    className="hidden md:flex bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-emerald-900/40 transition-all active:scale-95"
                                >
                                    Daftar Sekarang
                                </button>
                            </>
                        )
                    )}

                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden text-white p-3 bg-white/5 rounded-2xl border border-white/10 transition-all"
                    >
                        {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex flex-col p-8 lg:hidden animate-in fade-in duration-300">
                    <div className="flex justify-between items-center mb-12">
                        <div className="flex items-center gap-3">
                            <div className="bg-white p-1 rounded-xl">
                                <img src="/santara-logo.png" alt="Logo" className="w-8 h-8 object-contain" />
                            </div>
                            <h2 className="text-xl font-black text-white">Santara<span className="text-emerald-500">Point</span></h2>
                        </div>
                        <button onClick={() => setIsMobileMenuOpen(false)} className="text-white p-2 bg-white/10 rounded-full">
                            <X size={24} />
                        </button>
                    </div>

                    <div className="flex flex-col gap-6 mb-12">
                        <button onClick={() => { handleAction('dokumentasi'); setIsMobileMenuOpen(false); }} className="text-2xl font-black text-slate-400 hover:text-white transition-colors text-left">DOKUMENTASI</button>
                        <button onClick={() => { handleAction('kontak'); setIsMobileMenuOpen(false); }} className="text-2xl font-black text-slate-400 hover:text-white transition-colors text-left">KONTAK</button>
                    </div>

                    <div className="mt-auto space-y-4">
                        {!loading && (
                            user ? (
                                <>
                                    <button
                                        onClick={() => { handleAction('profile'); setIsMobileMenuOpen(false); }}
                                        className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2"
                                    >
                                        <User size={18} /> Profil Saya
                                    </button>
                                    <button
                                        onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                                        className="w-full bg-red-500/10 text-red-500 border border-red-500/20 py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2"
                                    >
                                        <LogOut size={18} /> Keluar
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={() => { handleAction('login'); setIsMobileMenuOpen(false); }}
                                        className="w-full bg-white/5 border border-white/10 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest"
                                    >
                                        Masuk
                                    </button>
                                    <button
                                        onClick={() => { handleAction('register'); setIsMobileMenuOpen(false); }}
                                        className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-emerald-900/40"
                                    >
                                        Daftar Sekarang
                                    </button>
                                </>
                            )
                        )}
                    </div>
                </div>
            )}

            {/* 3. Hero Section Content */}
            <main className="relative z-10 px-6 lg:px-16 py-8 lg:py-4 flex-1 flex flex-col justify-center min-h-0">
                <div className="max-w-4xl mt-12 lg:mt-0">
                    {/* Badge Syariah */}
                    <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-4 py-1.5 rounded-full text-emerald-400 text-[10px] lg:text-xs font-black mb-3 backdrop-blur-xl animate-fade-in uppercase tracking-[0.2em] shadow-lg shadow-emerald-950/20">
                        <ShieldCheck size={14} className="animate-pulse" /> POS Full Online Berbasis Syariah
                    </div>

                    <h2 className="text-[clamp(1.8rem,6vw,4.2rem)] font-black text-white mb-4 leading-[0.95] tracking-[-0.04em]">
                        Hidangan Lezat, <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-300">
                            Penuh Keberkahan.
                        </span>
                    </h2>

                    <p className="text-gray-400 text-xs lg:text-sm mb-4 leading-relaxed max-w-xl font-bold italic opacity-80">
                        Nikmati kemudahan memesan menu pilihan Anda secara online. Sistem yang transparan, amanah, dan membawa keberkahan dalam setiap transaksi.
                    </p>

                    <div className="flex flex-wrap gap-4">
                        <button
                            onClick={() => handleAction('order')}
                            className="bg-white text-emerald-950 hover:bg-emerald-50 px-8 py-3 lg:px-10 lg:py-4 rounded-[2rem] font-black text-xs lg:text-base flex items-center gap-3 transition-all shadow-2xl shadow-black/40 hover:-translate-y-1 active:scale-95 uppercase tracking-widest border-b-4 border-emerald-100"
                        >
                            <ShoppingCart size={20} /> Pesan Sekarang
                        </button>


                    </div>
                </div>

                {/* 4. Features Section (Bottom Grid) - Minimalist Refinement */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 lg:gap-4 mt-4 pb-2">
                    {[
                        {
                            icon: <MessageCircle className="text-emerald-400" size={18} />,
                            title: "Program Berbagi",
                            desc: "Nikmati Hidangan lezat sembari terus mengalirkan kebaikan tanpa harus menunggu perhitungan akhir tahun"
                        },
                        {
                            icon: <ShieldCheck className="text-emerald-400" size={18} />,
                            title: "Tata Kelola Yang Amanah",
                            desc: "Penyaluran dana sosial tercatat rapi dan terintegrasi dengan laporan keuangan"
                        },
                        {
                            icon: <ShoppingBag className="text-emerald-400" size={18} />,
                            title: "Akad Jual Beli Jelas",
                            desc: "Rincian harga pokok, pajak daerah, hingga porsi donasi dipisahkan secara transparan disetiap nota"
                        }
                    ].map((feature, index) => (
                        <div
                            key={index}
                            className="group bg-black/40 border border-white/5 backdrop-blur-3xl p-4 rounded-[2rem] hover:bg-white/5 hover:border-emerald-500/30 transition-all duration-500 shadow-2xl"
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-emerald-500/10 rounded-2xl w-fit group-hover:bg-emerald-500/20 group-hover:scale-110 transition-all">
                                    {feature.icon}
                                </div>
                                <h4 className="text-white font-black text-[10px] lg:text-xs tracking-tight uppercase tracking-widest">{feature.title}</h4>
                            </div>
                            <p className="text-gray-500 text-[9px] lg:text-[10px] leading-relaxed font-bold">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </main>

            {/* 5. Footer Refinement */}
            <footer className="relative z-10 px-6 lg:px-16 py-2 flex-none flex flex-col sm:flex-row justify-between items-center text-gray-500 text-[9px] border-t border-white/5 bg-black/60 shadow-2xl backdrop-blur-md gap-4">
                <p className="font-bold">© 2024 <span className="text-emerald-600">Santara Point</span>. Dikembangkan dengan prinsip Amanah & Keberkahan.</p>
                <div className="flex gap-8 font-black uppercase tracking-widest text-[9px]">
                    <span className="hover:text-emerald-500 cursor-pointer transition">Syarat & Ketentuan</span>
                    <span className="hover:text-emerald-500 cursor-pointer transition">Kebijakan Privasi</span>
                </div>
            </footer>
        </div>
    );
}