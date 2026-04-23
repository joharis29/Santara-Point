"use client";
import React, { useState, useEffect } from 'react';
import { User, Mail, Lock, ShieldCheck, AlertCircle, ArrowRight, Phone, ArrowLeft, MapPin, Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient'; // Sesuaikan jalur/path ini dengan letak file Supabase Anda

const DEFAULT_SETTINGS = {
    storeName: 'Santara Point',
    storeTagline: 'Hidangan Lezat, Penuh Keberkahan.',
    whatsapp: '6285846802177',
    email: 'santarapoint@gmail.com',
    address: 'Jl. Ir. H. Djuanda No. 78, Sentul, Kota Bogor, Jawa Barat 16810',
    instagram: '@santarapoint',
    footerText: '© 2024 Santara Point. Berkah setiap saat.'
};

export default function Register() {
    const router = useRouter();
    const [storeSettings, setStoreSettings] = useState(DEFAULT_SETTINGS);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem('santaraStoreSettings');
        if (stored) {
            setStoreSettings(JSON.parse(stored));
        }
    }, []);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        whatsapp: '',
        address: '',
        password: '',
        confirmPassword: ''
    });
    const [touched, setTouched] = useState({
        firstName: false,
        lastName: false,
        email: false,
        whatsapp: false,
        address: false,
        password: false,
        confirmPassword: false
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleBlur = (e) => {
        setTouched({ ...touched, [e.target.name]: true });
    };

    const handleSubmit = async (e) => { // Pastikan ada kata 'async' di sini
        e.preventDefault();

        // 1. Validasi dasar
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.whatsapp || !formData.address || !formData.password || !formData.confirmPassword) {
            alert('Tolong lengkapi data yang masih kosong!');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            alert('Kata Sandi Tidak Sama!');
            return;
        }

        try {
            // 2. MENGIRIM DATA KE SUPABASE
            const { data, error } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        first_name: formData.firstName,
                        last_name: formData.lastName,
                        whatsapp: formData.whatsapp,
                        address: formData.address,
                        addresses: [{ id: Date.now(), label: 'Utama', details: formData.address }]
                    }
                }
            });

            // 3. Jika Supabase menolak (misal: email sudah terdaftar)
            if (error) {
                if (error.message.toLowerCase().includes('already registered') || error.message.toLowerCase().includes('already in use')) {
                    alert('Email ini sudah terdaftar. Silakan masuk menggunakan akun Anda.');
                    router.push('/login');
                } else {
                    alert(`Gagal Mendaftar: ${error.message}`);
                }
                return;
            }

            // 4. Jika Berhasil
            const fullName = `${formData.firstName} ${formData.lastName}`.trim();
            localStorage.setItem('registeredName', fullName);

            alert(`Alhamdulillah! Anda telah berhasil mendaftar akun pelanggan ${storeSettings.storeName}.\n\nSilakan cek kotak masuk Email Anda (${formData.email}) untuk melakukan verifikasi akun.`);

            // Setelah daftar sukses, arahkan ke login
            router.push('/login');

        } catch (err) {
            console.error("Gagal terhubung ke server:", err);
            alert("Terjadi kesalahan sistem, mohon coba lagi nanti.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat relative" style={{ backgroundImage: "url('/bg-food.png')" }}>
            {/* Background Overlay */}
            <div className="absolute inset-0 bg-emerald-950/60 backdrop-blur-sm"></div>

            {/* Main Content Container */}
            <div className="relative z-10 max-w-md w-full bg-white/95 rounded-2xl shadow-2xl overflow-hidden border border-white/20">
                <div className="bg-emerald-700 p-8 text-center text-white">
                    <div className="inline-flex p-1 bg-white rounded-full mb-4 shadow-lg">
                        <img src="/santara-logo.png" alt="Santara Logo" className="w-16 h-16 object-contain rounded-full" />
                    </div>
                    <h1 className="text-3xl font-bold">Daftar Akun Baru</h1>
                    <p className="text-emerald-100 mt-2  italic">{storeSettings.storeName}</p>
                </div>

                <div className="p-8">
                    <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 mb-6">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <AlertCircle className="h-5 w-5 text-emerald-500" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-emerald-800 italic">
                                    &quot;Berkah niaga ada pada kejujuran dan amanah.&quot;
                                </p>
                            </div>
                        </div>
                    </div>

                    <form className="space-y-4" onSubmit={handleSubmit} noValidate>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Nama Depan</label>
                                <div className="mt-1 relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-slate-900 font-bold"
                                        placeholder="Budi"
                                        required
                                    />
                                </div>
                                {touched.firstName && !formData.firstName && (
                                    <p className="text-red-500 text-xs mt-1 font-medium">Wajib diisi!</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Nama Belakang</label>
                                <div className="mt-1 relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-slate-900 font-bold"
                                        placeholder="Santoso"
                                        required
                                    />
                                </div>
                                {touched.lastName && !formData.lastName && (
                                    <p className="text-red-500 text-xs mt-1 font-medium">Wajib diisi!</p>
                                )}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <div className="mt-1 relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-slate-900 font-bold"
                                    placeholder="budi123@gmail.com"
                                    required
                                />
                            </div>
                            {touched.email && !formData.email && (
                                <p className="text-red-500 text-xs mt-1 font-medium">Wajib diisi!</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nomor Whatsapp</label>
                            <div className="mt-1 relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="tel"
                                    name="whatsapp"
                                    value={formData.whatsapp}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-slate-900 font-bold"
                                    placeholder="0821XXXXXXXX"
                                    required
                                />
                            </div>
                            {touched.whatsapp && !formData.whatsapp && (
                                <p className="text-red-500 text-xs mt-1 font-medium">Wajib diisi!</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Alamat Lengkap</label>
                            <div className="mt-1 relative">
                                <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all resize-none h-20 text-slate-900 font-bold"
                                    placeholder="Jl. Merdeka No. 10, RT 01/RW 02..."
                                    required
                                />
                            </div>
                            {touched.address && !formData.address && (
                                <p className="text-red-500 text-xs mt-1 font-medium">Wajib diisi!</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Kata Sandi</label>
                            <div className="mt-1 relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-slate-900 font-bold"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {touched.password && !formData.password && (
                                <p className="text-red-500 text-xs mt-1 font-medium">Wajib diisi!</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Konfirmasi Kata Sandi</label>
                            <div className="mt-1 relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-slate-900 font-bold"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-600 transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {touched.confirmPassword && !formData.confirmPassword ? (
                                <p className="text-red-500 text-xs mt-1 font-medium">Wajib diisi!</p>
                            ) : touched.confirmPassword && formData.confirmPassword !== formData.password ? (
                                <p className="text-red-500 text-xs mt-1 font-medium">Kata Sandi Tidak Sama</p>
                            ) : null}
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
                            Sudah Punya Akun? <button type="button" onClick={() => router.push('/login')} className="text-emerald-600 font-semibold hover:underline">Masuk di sini</button>
                        </p>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-200/50 flex justify-center">
                        <button type="button" onClick={() => router.push('/')} className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-emerald-600 transition-colors duration-200">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Kembali ke Beranda
                        </button>
                    </div>
                </div >
            </div >
        </div >
    );
}
