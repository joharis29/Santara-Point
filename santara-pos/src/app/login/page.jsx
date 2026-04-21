"use client";
import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import {
  ShoppingBag,
  User,
  Lock,
  Mail,
  Plus,
  Minus,
  Trash2,
  Calculator,
  CheckCircle,
  ShieldCheck,
  Coffee,
  Utensils,
  Search,
  LogOut,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';

const DEFAULT_SETTINGS = {
    storeName: 'Santara Point',
    storeTagline: 'Hidangan Lezat, Penuh Keberkahan.',
    whatsapp: '6285846802177',
    email: 'santarapoint@gmail.com',
    address: 'Jl. Raya Santara No. 123, Bandung',
    footerText: '© 2024 Santara Point. Berkah setiap saat.'
};

// --- Mock Data Produk F&B ---
const PRODUCTS = [
  { id: 1, name: 'Kopi Susu Gula Aren', price: 25000, category: 'Minuman', icon: <Coffee className="w-6 h-6" /> },
  { id: 2, name: 'Nasi Goreng Santara', price: 35000, category: 'Makanan', icon: <Utensils className="w-6 h-6" /> },
  { id: 3, name: 'Croissant Keju', price: 18000, category: 'Snack', icon: <ShoppingBag className="w-6 h-6" /> },
  { id: 4, name: 'Es Teh Manis', price: 10000, category: 'Minuman', icon: <Coffee className="w-6 h-6" /> },
  { id: 5, name: 'Ayam Bakar Madu', price: 42000, category: 'Makanan', icon: <Utensils className="w-6 h-6" /> },
  { id: 6, name: 'Singkong Goreng', price: 15000, category: 'Snack', icon: <ShoppingBag className="w-6 h-6" /> },
];

// --- Sub-Komponen Konten Login ---
const LoginContent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [storeSettings, setStoreSettings] = useState(DEFAULT_SETTINGS);

    useEffect(() => {
        if (searchParams.get('message') === 'confirmed') {
            alert('Selamat Akun Anda Terkonfirmasi');
            // Bersihkan query param agar alert tidak muncul lagi saat refresh
            router.replace('/login');
        }
    }, [searchParams, router]);

  React.useEffect(() => {
    const stored = localStorage.getItem('santaraStoreSettings');
    if (stored) {
      setStoreSettings(JSON.parse(stored));
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert('Tolong lengkapi data!');
      return;
    }

    try {
      // 1. Authenticate with Supabase
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

      // 2. Jika Berhasil, tentukan role
      let role = 'Customer';
      let contact = user.email;
      let finalName = 'Sobat Santara';

      // Metadata dari Supabase
      const meta = user.user_metadata || {};
      if (meta.first_name || meta.last_name) {
          finalName = `${meta.first_name || ''} ${meta.last_name || ''}`.trim();
      }

      // Check for Authorized Users from local settings (Admin/Operator)
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

      // Sync to localStorage (for compatibility with existing modules)
      localStorage.setItem('currentUserRole', role);
      localStorage.setItem('currentUserContact', contact);
      localStorage.setItem('customerName', finalName);
      
      if (meta.first_name) localStorage.setItem('customerFirstName', meta.first_name);
      if (meta.last_name) localStorage.setItem('customerLastName', meta.last_name);
      if (meta.whatsapp) localStorage.setItem('registeredWhatsapp', meta.whatsapp);
      if (meta.address) localStorage.setItem('customerAddress', meta.address);
      localStorage.setItem('registeredEmail', email);

      // 3. Redirect based on role
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
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-emerald-950/60 backdrop-blur-sm"></div>

      {/* Main Content Container */}
      <div className="relative z-10 max-w-md w-full bg-white/95 rounded-2xl shadow-2xl overflow-hidden border border-white/20">
        <div className="bg-emerald-700 p-8 text-white text-center flex flex-col items-center">
          <div className="inline-flex p-1 bg-white rounded-full mb-4 shadow-lg">
            <img src="/santara-logo.png" alt="Santara Logo" className="w-16 h-16 object-contain rounded-full" />
          </div>
          <h1 className="text-3xl font-bold">LOGIN</h1>
          <p className="text-emerald-100 mt-2  italic">{storeSettings.storeName}</p>
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
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="admin@santara.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kata Sandi</label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
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

// --- Komponen Utama: Login Page ---
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