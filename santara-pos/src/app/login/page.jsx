"use client";
import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
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

/**
 * SANTARA POINT - POS SYARIAH
 * Tech Stack: React, Tailwind CSS, Lucide Icons
 */

// --- Mock Data Produk F&B ---
const PRODUCTS = [
  { id: 1, name: 'Kopi Susu Gula Aren', price: 25000, category: 'Minuman', icon: <Coffee className="w-6 h-6" /> },
  { id: 2, name: 'Nasi Goreng Santara', price: 35000, category: 'Makanan', icon: <Utensils className="w-6 h-6" /> },
  { id: 3, name: 'Croissant Keju', price: 18000, category: 'Snack', icon: <ShoppingBag className="w-6 h-6" /> },
  { id: 4, name: 'Es Teh Manis', price: 10000, category: 'Minuman', icon: <Coffee className="w-6 h-6" /> },
  { id: 5, name: 'Ayam Bakar Madu', price: 42000, category: 'Makanan', icon: <Utensils className="w-6 h-6" /> },
  { id: 6, name: 'Singkong Goreng', price: 15000, category: 'Snack', icon: <ShoppingBag className="w-6 h-6" /> },
];

// --- Sub-Komponen: Login ---
const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert('Tolong lengkapi data!');
      return;
    }

    // Simulate login for different roles
    if (email === 'santarapoint@gmail.com') {
      router.push('/posin-adm');
    } else {
      // Coba ambil dari data registrasi jika ada
      const registeredName = localStorage.getItem('registeredName');
      let finalName = 'Sobat Santara';
      
      if (registeredName) {
        // Ambil hanya nama pertama (kata pertama)
        finalName = registeredName.split(' ')[0];
      } else {
        // Jika belum registrasi, kita fallback dari prefix email
        const nameFallback = email.split('@')[0];
        finalName = nameFallback.charAt(0).toUpperCase() + nameFallback.slice(1);
      }
      
      localStorage.setItem('customerName', finalName);
      router.push('/posin-cus');
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
          <p className="text-emerald-100 mt-2  italic">Santara Point</p>
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

export default Login;