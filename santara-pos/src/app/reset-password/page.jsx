"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import {
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const DEFAULT_SETTINGS = {
    storeName: 'Santara Point',
    storeTagline: 'Hidangan Lezat, Penuh Keberkahan.',
    whatsapp: '6285846802177',
    email: 'santarapoint@gmail.com',
    address: 'Jl. Ir. H. Djuanda No. 78, Sentul, Kota Bogor, Jawa Barat 16810',
    footerText: '© 2024 Santara Point. Berkah setiap saat.'
};

export default function ResetPasswordPage() {
    const router = useRouter();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [storeSettings, setStoreSettings] = useState(DEFAULT_SETTINGS);

    useEffect(() => {
        const stored = localStorage.getItem('santaraStoreSettings');
        if (stored) {
            setStoreSettings(JSON.parse(stored));
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (newPassword.length < 6) {
            alert('Kata sandi minimal 6 karakter.');
            return;
        }
        
        if (newPassword !== confirmPassword) {
            alert('Konfirmasi kata sandi tidak cocok.');
            return;
        }

        setIsSubmitting(true);
        try {
            const { error } = await supabase.auth.updateUser({
                password: newPassword
            });

            if (error) {
                alert(`Gagal memperbarui kata sandi: ${error.message}`);
            } else {
                setIsSuccess(true);
                // Beri waktu sejenak agar user melihat pesan sukses
                setTimeout(() => {
                    router.push('/login');
                }, 3000);
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
                    <h1 className="text-3xl font-bold uppercase tracking-tight">Atur Ulang Sandi</h1>
                    <p className="text-emerald-100 mt-2 italic">{storeSettings.storeName}</p>
                </div>

                <div className="p-8">
                    {!isSuccess ? (
                        <>
                            <div className="mb-6 p-4 bg-emerald-50 border-l-4 border-emerald-500 rounded text-emerald-800 text-sm italic">
                                Masukkan kata sandi baru Anda di bawah ini.
                            </div>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Kata Sandi Baru</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                                        <input
                                            type={showNewPassword ? "text" : "password"}
                                            className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900 font-bold"
                                            placeholder="••••••••"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                            className="absolute right-3 top-2.5 text-gray-400 hover:text-emerald-600 transition-colors"
                                        >
                                            {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Konfirmasi Kata Sandi</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900 font-bold"
                                            placeholder="••••••••"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-2.5 text-gray-400 hover:text-emerald-600 transition-colors"
                                        >
                                            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                </div>

                                <button
                                    disabled={isSubmitting}
                                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-lg transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Memperbarui...' : (
                                        <>
                                            Simpan Kata Sandi Baru <ArrowRight size={18} />
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
                            <h2 className="text-xl font-bold text-slate-800">Sandi Diperbarui!</h2>
                            <p className="text-sm text-gray-600">
                                Alhamdulillah! Kata sandi Anda telah berhasil diubah. Mengalihkan ke halaman login dalam hitungan detik...
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
