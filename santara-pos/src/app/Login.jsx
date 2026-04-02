import React, { useState, useMemo } from 'react';
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
  ArrowRight
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
const Login = ({ onNavigate, onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-emerald-700 p-8 text-white text-center">
          <h1 className="text-3xl font-bold italic">Santara Point</h1>
          <p className="text-emerald-100 mt-2">Sistem POS Syariah Amanah & Berkah</p>
        </div>
        <div className="p-8">
          <div className="mb-6 p-4 bg-emerald-50 border-l-4 border-emerald-500 rounded text-emerald-800 text-sm italic">
            "Sesungguhnya Allah menyukai jika salah seorang dari kalian melakukan suatu pekerjaan, ia melakukannya dengan itqan (profesional/sempurna)."
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
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
            <button onClick={() => onNavigate('register')} className="ml-1 text-emerald-600 font-bold hover:underline">
              Daftar Pelanggan Baru
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};