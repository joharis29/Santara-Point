"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import {
  Mail,
  ArrowLeft,
  Send,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const DEFAULT_SETTINGS = {
    storeName: 'Santara Point',
    storeTagline: 'Hidangan Lezat, Penuh Keberkahan.',
    whatsapp: '6285846802177',
    email: 'santarapoint@gmail.com',
    address: 'Jl. Raya Santara No. 123, Bandung',
    footerText: '© 2024 Santara Point. Berkah setiap saat.'
};

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const [storeSettings, setStoreSettings] = useState(DEFAULT_SETTINGS);

    useEffect(() => {
        const stored = localStorage.getItem('santaraStoreSettings');
        if (stored) {
            setStoreSettings(JSON.parse(stored));
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) return;

        setIsSubmitting(true);
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
            });

            if (error) {
                alert(`Gagal mengirim email reset: ${error.message}`);
            } else {
                setIsSent(true);
            }
        } catch (err) {
            console.error("Kesalahan sistem:", err);
            alert("Terjadi kesalahan sistem, mohon coba lagi nanti.");
        } finally {
            setIsSubmitting(false);
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
                    <h1 className="text-3xl font-bold uppercase tracking-tight">Lupa Sandi</h1>
                    <p className="text-emerald-100 mt-2 italic">{storeSettings.storeName}</p>
                </div>

                <div className="p-8">
                    {!isSent ? (
                        <>
                            <div className="mb-6 p-4 bg-emerald-50 border-l-4 border-emerald-500 rounded text-emerald-800 text-sm italic">
                                Masukkan email Anda yang terdaftar. Kami akan mengirimkan tautan untuk mengatur ulang kata sandi Anda.
                            </div>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Terdaftar</label>
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
                                <button
                                    disabled={isSubmitting}
                                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-lg transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Memproses...' : (
                                        <>
                                            Kirim Tautan Reset <Send size={18} />
                                        </>
                                    )}
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="text-center py-4 space-y-4 animate-in fade-in zoom-in duration-500">
                            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2">
                                <CheckCircle size={32} />
                            </div>
                            <h2 className="text-xl font-bold text-slate-800">Email Terkirim!</h2>
                            <p className="text-sm text-gray-600">
                                Silakan cek kotak masuk email Anda (**{email}**) untuk melanjutkan pengaturan ulang kata sandi.
                            </p>
                            <div className="bg-amber-50 p-3 rounded-lg border border-amber-200 text-amber-800 text-xs flex gap-2">
                                <AlertCircle size={14} className="shrink-0 mt-0.5" />
                                <p>Jika tidak ada, periksa folder **Spam** atau tunggu beberapa saat.</p>
                            </div>
                        </div>
                    )}

                    <div className="mt-8 pt-6 border-t border-gray-200/50 flex justify-center">
                        <button type="button" onClick={() => router.push('/login')} className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-emerald-600 transition-colors duration-200">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Kembali ke Login
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
