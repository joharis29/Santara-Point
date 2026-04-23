"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

// --------------------------------------------------------------------------------
// STABILIZATION: Inline SVGs to avoid Lucide-React initialization errors in NextJS
// --------------------------------------------------------------------------------
const IconMail = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
);
const IconLock = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
);
const IconEye = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>
);
const IconEyeOff = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
);
const IconArrowLeft = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
);

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
        
        // Cek konfirmasi email dari URL (Stable)
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

    async function handleLogin(e) {
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
    }

    if (!isClient) {
        return <div className="min-h-screen bg-emerald-950"></div>;
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat relative" style={{ backgroundImage: "url('/bg-food.png')" }}>
            <div className="absolute inset-0 bg-emerald-950/70 backdrop-blur-md"></div>

            <div className="relative z-10 max-w-md w-full bg-white/95 rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/20 animate-in zoom-in-95 duration-300">
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
                            <div className="relative">
                                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-500">
                                    <IconMail />
                                </div>
                                <input
                                    type="email"
                                    className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 font-bold text-slate-700 transition-all"
                                    placeholder="nama@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
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
                                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-500">
                                    <IconLock />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="w-full pl-14 pr-14 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 font-bold text-slate-700 transition-all"
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
                                    {showPassword ? <IconEyeOff /> : <IconEye />}
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
                            <span className="mr-2"><IconArrowLeft /></span>
                            Kembali ke Beranda
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}