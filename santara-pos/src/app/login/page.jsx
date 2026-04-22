"use client";
import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import {
  Lock,
  Mail,
  ArrowLeft,
  Eye,
  EyeOff
} from 'lucide-react';

const DEFAULT_SETTINGS = {
    storeName: 'Santara Point',
    storeTagline: 'Hidangan Lezat, Penuh Keberkahan.',
    whatsapp: '6285846802177',
    email: 'santarapoint@gmail.com',
    address: 'Jl. Raya Santara No. 123, Bandung',
    footerText: '© 2024 Santara Point. Berkah setiap saat.'
};

// --- Sub-Komponen Konten Login ---
const LoginContent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [storeSettings, setStoreSettings] = useState(DEFAULT_SETTINGS);

    useEffect(() => {
        if (searchParams.get('message') === 'confirmed') {
            alert('Selamat Akun Anda Terkonfirmasi');
            router.replace('/login');
        }
    }, [searchParams, router]);

    useEffect(() => {
        const stored = localStorage.getItem('santaraStoreSettings');
        if (stored) {
            try {
                setStoreSettings(JSON.parse(stored));
            } catch (e) {
                console.error("Error parsing settings", e);
            }
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            alert('Tolong lengkapi data!');
            return;
        }

        try {
            const { data: { user }, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) {
                if (error.message.toLowerCase().includes('email not confirmed')) {
                    alert('Email Anda belum terverifikasi. Silakan cek kotak masuk email Anda.');
                } else {
                    alert(`Gagal Masuk: ${error.message}`);
                }
                return;
            }

            let role = 'Customer';
            let contact = user.email;
            let finalName = 'Sobat Santara';

            const meta = user.user_metadata || {};
            if (meta.first_name || meta.last_name) {
                finalName = `${meta.first_name || ''} ${meta.last_name || ''}`.trim();
            }

            const storedSettings = localStorage.getItem('santaraStoreSettings');
            if (email.toLowerCase() === 'santarapoint@gmail.com') {
                role = 'Administrator';
            } else if (storedSettings) {
                const settings = JSON.parse(storedSettings);
                if (settings.authorizedUsers) {
                    const authorizedUser = settings.authorizedUsers.find(u => u.contact === email);
                    if (authorizedUser) {
                        role = authorizedUser.role;
                    }
                }
            }

            localStorage.setItem('currentUserRole', role);
            localStorage.setItem('currentUserContact', contact);
            localStorage.setItem('customerName', finalName);
            
            if (meta.first_name) localStorage.setItem('customerFirstName', meta.first_name);
            if (meta.last_name) localStorage.setItem('customerLastName', meta.last_name);
            if (meta.whatsapp) localStorage.setItem('registeredWhatsapp', meta.whatsapp);
            if (meta.address) localStorage.setItem('customerAddress', meta.address);
            localStorage.setItem('registeredEmail', email);

            if (role === 'Administrator') {
                router.push('/posin-adm');
            } else if (role === 'Operator') {
                router.push('/posin-cas');
            } else {
                router.push('/posin-cus');
            }

        } catch (err) {
            console.error("Kesalahan sistem:", err);
            alert("Terjadi kesalahan sistem, mohon coba lagi nanti.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat relative" style={{ backgroundImage: "url('/bg-food.png')" }}>
            <div className="absolute inset-0 bg-emerald-950/60 backdrop-blur-sm"></div>

            <div className="relative z-10 max-w-md w-full bg-white/95 rounded-2xl shadow-2xl overflow-hidden border border-white/20">
                <div className="bg-emerald-700 p-8 text-white text-center flex flex-col items-center">
                    <div className="inline-flex p-1 bg-white rounded-full mb-4 shadow-lg">
                        <img src="/santara-logo.png" alt="Santara Logo" className="w-16 h-16 object-contain rounded-full" />
                    </div>
                    <h1 className="text-3xl font-bold uppercase tracking-tight">Login</h1>
                    <p className="text-emerald-100 mt-2 italic">{storeSettings.storeName}</p>
                </div>
                <div className="p-8">
                    <div className="mb-6 p-4 bg-emerald-50 border-l-4 border-emerald-500 rounded text-emerald-800 text-sm italic">
                        "Sesungguhnya Allah menyukai jika salah seorang dari kalian melakukan suatu pekerjaan, ia melakukannya dengan itqan (profesional/sempurna)."
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                                <input
                                    type="email"
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900 font-bold"
                                    placeholder="admin@santara.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-1">
                            <div className="flex justify-between items-center mb-1">
                                <label className="block text-sm font-medium text-gray-700">Kata Sandi</label>
                                <button 
                                    type="button" 
                                    onClick={() => router.push('/forgot-password')}
                                    className="text-xs font-bold text-emerald-600 hover:underline"
                                >
                                    Lupa Kata Sandi?
                                </button>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900 font-bold"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-2.5 text-gray-400 hover:text-emerald-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>
                        <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-lg transition duration-200">
                            Masuk Sekarang
                        </button>
                    </form>
                    <div className="mt-6 text-center text-sm text-gray-600">
                        Belum punya akun?
                        <button type="button" onClick={() => router.push('/register')} className="ml-1 text-emerald-600 font-bold hover:underline">
                            Daftar Pelanggan Baru
                        </button>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-200/50 flex justify-center">
                        <button type="button" onClick={() => router.push('/')} className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-emerald-600 transition-colors duration-200">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Kembali ke Beranda
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-emerald-950">
                <div className="animate-pulse flex flex-col items-center gap-4">
                    <img src="/santara-logo.png" alt="Loading" className="w-16 h-16 opacity-50" />
                    <p className="text-emerald-100 font-bold tracking-widest text-xs uppercase">Memuat Santara...</p>
                </div>
            </div>
        }>
            <LoginContent />
        </Suspense>
    );
}