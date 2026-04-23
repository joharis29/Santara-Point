"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const [storeName, setStoreName] = useState('Santara Point');

    useEffect(() => {
        setIsClient(true);
        // Handle confirmed message
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            if (params.get('message') === 'confirmed') {
                alert('Selamat! Akun Anda telah terkonfirmasi. Silakan masuk.');
                router.replace('/login');
            }

            const stored = localStorage.getItem('santaraStoreSettings');
            if (stored) {
                try {
                    const settings = JSON.parse(stored);
                    if (settings.storeName) setStoreName(settings.storeName);
                } catch (e) {}
            }
        }
    }, [router]);

    const handleLogin = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;

        if (!email || !password) {
            alert('Silakan masukkan email dan kata sandi.');
            return;
        }

        setIsSubmitting(true);
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email.trim(),
                password: password
            });

            if (error) {
                alert(`Gagal Masuk: ${error.message}`);
                setIsSubmitting(false);
                return;
            }

            if (data?.user) {
                const user = data.user;
                let role = 'Customer';
                
                if (email.toLowerCase() === 'santarapoint@gmail.com') {
                    role = 'Administrator';
                } else {
                    const storedSettings = localStorage.getItem('santaraStoreSettings');
                    if (storedSettings) {
                        try {
                            const settings = JSON.parse(storedSettings);
                            const authorizedUser = settings.authorizedUsers?.find(u => u.contact === email);
                            if (authorizedUser) role = authorizedUser.role;
                        } catch (e) {}
                    }
                }

                const meta = user.user_metadata || {};
                const name = `${meta.first_name || ''} ${meta.last_name || ''}`.trim() || 'Sobat Santara';

                localStorage.setItem('currentUserRole', role);
                localStorage.setItem('registeredEmail', email);
                localStorage.setItem('customerName', name);

                if (role === 'Administrator') router.push('/posin-adm');
                else if (role === 'Operator') router.push('/posin-cas');
                else router.push('/posin-cus');
            }
        } catch (err) {
            console.error("Login Error:", err);
            alert("Terjadi kesalahan sistem.");
            setIsSubmitting(false);
        }
    };

    if (!isClient) {
        return <div className="min-h-screen bg-emerald-950"></div>;
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat relative" style={{ backgroundImage: "url('/bg-food.png')" }}>
            {/* Background Overlay */}
            <div className="absolute inset-0 bg-emerald-950/70 backdrop-blur-md"></div>

            {/* Main Content Container */}
            <div className="relative z-10 max-w-md w-full bg-white/95 rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/20">
                <div className="bg-emerald-700 p-10 text-white text-center flex flex-col items-center">
                    <div className="inline-flex p-2 bg-white rounded-full mb-6 shadow-xl">
                        <img src="/santara-logo.png" alt="Santara Logo" className="w-20 h-20 object-contain rounded-full" />
                    </div>
                    <h1 className="text-4xl font-black tracking-tighter uppercase mb-1">MASUK</h1>
                    <p className="text-emerald-100/70 text-[10px] font-black uppercase tracking-[0.2em]">{storeName}</p>
                </div>
                
                <div className="p-10">
                    <div className="mb-8 p-6 bg-emerald-50 border-l-4 border-emerald-500 rounded-2xl text-emerald-800 text-xs font-medium italic leading-relaxed">
                        "Sesungguhnya Allah menyukai jika salah seorang dari kalian melakukan suatu pekerjaan, ia melakukannya dengan itqan (profesional/sempurna)."
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-2">Email</label>
                            <input
                                type="email"
                                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 font-bold text-slate-700 transition-all"
                                placeholder="nama@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-2 ml-2">
                                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400">Kata Sandi</label>
                                <button 
                                    type="button" 
                                    onClick={() => router.push('/forgot-password')}
                                    className="text-[10px] font-black text-emerald-600 hover:underline uppercase tracking-widest"
                                >
                                    Lupa Sandi?
                                </button>
                            </div>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 font-bold text-slate-700 transition-all"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-emerald-500 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button 
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-5 rounded-2xl shadow-xl shadow-emerald-200 active:scale-[0.98] transition-all text-[10px] uppercase tracking-[0.2em] disabled:opacity-70"
                        >
                            {isSubmitting ? 'MEMPROSES...' : 'MASUK SEKARANG'}
                        </button>
                    </form>

                    <div className="mt-10 text-center">
                        <p className="text-xs text-slate-400 font-medium">
                            Belum punya akun? 
                            <button onClick={() => router.push('/register')} className="ml-2 text-emerald-600 font-black hover:underline uppercase tracking-widest">
                                Daftar Disini
                            </button>
                        </p>
                    </div>

                    <div className="mt-8 pt-8 border-t border-slate-50 flex justify-center">
                        <button onClick={() => router.push('/')} className="inline-flex items-center text-[10px] font-black text-slate-300 hover:text-emerald-600 transition-all uppercase tracking-widest">
                            Kembali ke Beranda
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
