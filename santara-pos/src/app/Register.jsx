import React, { useState } from 'react';
import { User, Mail, Lock, ShieldCheck, AlertCircle, ArrowRight } from 'lucide-react';

export default function Register({ onNavigate }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Tambahkan logika pendaftaran di sini
        console.log('Register attempt:', formData);
        // Setelah daftar sukses, bisa diarahkan ke login atau langsung masuk
        if (onNavigate) {
            onNavigate('login');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-emerald-100">
                <div className="bg-emerald-700 p-8 text-center text-white">
                    <div className="inline-flex p-3 bg-white/20 rounded-full mb-4">
                        <ShieldCheck size={40} />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight">Santara Point</h1>
                    <p className="text-emerald-100 mt-2">Daftar Akun Pegawai Baru</p>
                </div>

                <div className="p-8">
                    <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 mb-6">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <AlertCircle className="h-5 w-5 text-emerald-500" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-emerald-800 italic">
                                    "Berkah niaga ada pada kejujuran dan amanah."
                                </p>
                            </div>
                        </div>
                    </div>

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
                            <div className="mt-1 relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                                    placeholder="Budi Santoso"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email Pegawai</label>
                            <div className="mt-1 relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                                    placeholder="admin@santaranpoint.com"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Kata Sandi</label>
                            <div className="mt-1 relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Konfirmasi Kata Sandi</label>
                            <div className="mt-1 relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-200 mt-6"
                        >
                            Daftar Sekarang <ArrowRight size={18} />
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-500">
                            Sudah Punya Akun? <button onClick={() => onNavigate && onNavigate('login')} className="text-emerald-600 font-semibold hover:underline">Masuk di sini</button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}