"use client";

import React, { useState } from 'react';
import {
    ShoppingBag,
    ShieldCheck,
    Search,
    Plus,
    Minus,
    Trash2,
    Calculator,
    ChevronRight,
    MessageCircle,
    Mail,
    LogOut,
    Store,
    Clock,
    History,
    CreditCard,
    UserCircle,
    ShoppingCart // Ditambahkan untuk memperbaiki ReferenceError
} from 'lucide-react';

/**
 * SANTARA POINT - POS INPUT (KASIR ROLE)
 * Fokus: Kecepatan Transaksi, Kemudahan Navigasi, & Notifikasi Nota Otomatis.
 */

const PRODUCTS = [
    { id: 1, name: 'Santara Signature Coffee', price: 28000, stock: 45, category: 'Minuman', img: 'https://images.unsplash.com/photo-1541167760496-162955ed8a9f?auto=format&fit=crop&q=80&w=500' },
    { id: 2, name: 'Nasi Kebuli Spesial', price: 45000, stock: 12, category: 'Makanan', img: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&q=80&w=500' },
    { id: 3, name: 'Croissant Almond', price: 22000, stock: 8, category: 'Snack', img: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=500' },
    { id: 4, name: 'Iced Matcha Latte', price: 25000, stock: 30, category: 'Minuman', img: 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?auto=format&fit=crop&q=80&w=500' },
    { id: 5, name: 'Ayam Bakar Madu', price: 42000, stock: 15, category: 'Makanan', img: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&q=80&w=500' },
    { id: 6, name: 'Singkong Goreng', price: 15000, stock: 25, category: 'Snack', img: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&q=80&w=500' },
];

const categories = ['Semua', 'Makanan', 'Minuman', 'Snack'];

export default function App() {
    const [cart, setCart] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [zakatEnabled, setZakatEnabled] = useState(false);
    const [activeCategory, setActiveCategory] = useState('Semua');

    // --- Perhitungan Total ---
    const menuTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const subtotal = zakatEnabled ? menuTotal / 1.025 : menuTotal;
    const zakatValue = zakatEnabled ? menuTotal - (menuTotal / 1.025) : 0;
    const totalAmount = menuTotal;

    const filteredProducts = PRODUCTS.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = activeCategory === 'Semua' || p.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    // --- Logic Keranjang ---
    const addToCart = (product) => {
        if (product.stock <= 0) return;
        const exist = cart.find(x => x.id === product.id);
        if (exist) {
            setCart(cart.map(x => x.id === product.id ? { ...x, quantity: x.quantity + 1 } : x));
        } else {
            setCart([...cart, { ...product, quantity: 1 }]);
        }
    };

    const updateQty = (id, delta) => {
        setCart(cart.map(item => {
            if (item.id === id) {
                const newQty = Math.max(0, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        }).filter(item => item.quantity > 0));
    };

    const handlePayment = (method) => {
        alert(`Pembayaran ${method} Berhasil!\nNota Digital telah dikirim.\nJazakallahu Khairan.`);
        setCart([]);
    };

    return (
        <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">

            {/* 1. Sidebar Navigasi Kasir (Simplified) */}
            <aside className="w-20 lg:w-24 bg-white border-r border-slate-200 flex flex-col items-center py-8 gap-10">
                <div className="bg-emerald-600 p-3 rounded-2xl shadow-lg shadow-emerald-200">
                    <Store className="text-white" size={24} />
                </div>

                <nav className="flex-1 flex flex-col gap-6">
                    <button className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl transition-all shadow-sm">
                        <ShoppingBag size={24} />
                    </button>
                    <button className="p-4 text-slate-300 hover:text-emerald-600 hover:bg-emerald-50 rounded-2xl transition-all">
                        <History size={24} />
                    </button>
                    <button className="p-4 text-slate-300 hover:text-emerald-600 hover:bg-emerald-50 rounded-2xl transition-all">
                        <Clock size={24} />
                    </button>
                </nav>

                <button 
                    onClick={() => window.location.href = '/login'}
                    className="p-4 flex flex-col items-center gap-1 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                >
                    <LogOut size={24} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Keluar</span>
                </button>
            </aside>

            {/* 2. Main Content: Grid Produk */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Header Kasir */}
                <header className="p-6 bg-white border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="hidden md:block">
                            <h2 className="text-xl font-bold text-slate-800">Layar Kasir</h2>
                            <div className="flex items-center gap-2 mt-0.5">
                                <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 uppercase">
                                    <ShieldCheck size={12} /> Syariah Verified
                                </span>
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Shift: Pagi (Zaid)</span>
                            </div>
                        </div>
                    </div>

                    <div className="relative w-full max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Cari menu (Ctrl + F)..."
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </header>

                {/* Kategori Makanan - Filter */}
                <div className="px-6 mt-6 overflow-x-auto">
                    <div className="flex gap-3">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-6 py-2 rounded-full text-xs font-bold transition-all border whitespace-nowrap ${activeCategory === cat ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-100' : 'bg-white border-slate-200 text-slate-400 hover:border-emerald-600 hover:text-emerald-600'}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Scrollable Products */}
                <section className="flex-1 overflow-y-auto p-6 scroll-smooth">
                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
                        {filteredProducts.map(product => (
                            <div
                                key={product.id}
                                onClick={() => addToCart(product)}
                                className="bg-white p-3 rounded-[2rem] shadow-sm hover:shadow-xl transition-all border border-transparent hover:border-emerald-500 cursor-pointer group flex flex-col"
                            >
                                <div className="h-36 rounded-[1.5rem] overflow-hidden mb-4 relative">
                                    <img src={product.img} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                                    <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition"></div>
                                </div>
                                <div className="px-2 flex-1 flex flex-col justify-between">
                                    <div>
                                        <h4 className="font-bold text-slate-800 text-sm mb-1 line-clamp-2">{product.name}</h4>
                                        <p className="text-emerald-600 font-black text-base italic">Rp {product.price.toLocaleString()}</p>
                                    </div>
                                    <div className="mt-3 flex items-center justify-between text-[10px] font-bold text-slate-400">
                                        <span>{product.category}</span>
                                        <span className={product.stock < 10 ? 'text-red-500' : ''}>Stok: {product.stock}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            {/* 3. Panel Transaksi (Right Sidebar) */}
            <aside className="w-[380px] lg:w-[420px] bg-white border-l border-slate-100 flex flex-col shadow-2xl">
                <div className="p-8 flex-1 overflow-y-auto">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-2">
                            <ShoppingBag className="text-emerald-600" size={20} />
                            <h3 className="text-lg font-bold text-slate-800 tracking-tight">Daftar Belanja</h3>
                        </div>
                        <button
                            onClick={() => setCart([])}
                            className="text-xs font-bold text-red-500 hover:underline"
                        >
                            Bersihkan
                        </button>
                    </div>

                    {cart.length === 0 ? (
                        <div className="h-48 flex flex-col items-center justify-center text-slate-300 gap-2 italic">
                            <ShoppingCart size={40} className="opacity-20" />
                            <p className="text-xs">Silakan pilih menu</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {cart.map(item => (
                                <div key={item.id} className="flex items-center gap-4 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                                    <div className="w-12 h-12 rounded-xl overflow-hidden shadow-sm">
                                        <img src={item.img} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1">
                                        <h5 className="font-bold text-xs text-slate-800 line-clamp-1">{item.name}</h5>
                                        <p className="text-xs text-emerald-600 font-black">Rp {(item.price * item.quantity).toLocaleString()}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => updateQty(item.id, -1)} className="w-6 h-6 flex items-center justify-center bg-white rounded-lg border border-slate-200 text-slate-400 hover:text-emerald-600 hover:border-emerald-600 transition-colors">
                                            <Minus size={12} />
                                        </button>
                                        <span className="text-xs font-black w-4 text-center">{item.quantity}</span>
                                        <button onClick={() => addToCart(item)} className="w-6 h-6 flex items-center justify-center bg-white rounded-lg border border-slate-200 text-slate-400 hover:text-emerald-600 hover:border-emerald-600 transition-colors">
                                            <Plus size={12} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Payment Summary Area */}
                <div className="p-8 bg-slate-50 border-t border-slate-200">
                    <div className="space-y-3 mb-6">
                        <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
                            <span>Subtotal</span>
                            <span className="text-slate-800">Rp {subtotal.toLocaleString()}</span>
                        </div>

                        {/* Kalkulator Zakat Mal */}
                        <div className={`flex items-center justify-between p-3 rounded-xl border transition-all ${zakatEnabled ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white border-slate-200 text-slate-500'}`}>
                            <div className="flex items-center gap-3">
                                <Calculator size={16} />
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black uppercase leading-none">Zakat (2.5%)</span>
                                    <button
                                        onClick={() => setZakatEnabled(!zakatEnabled)}
                                        className={`text-[9px] font-bold underline text-left ${zakatEnabled ? 'text-emerald-100' : 'text-emerald-600'}`}
                                    >
                                        {zakatEnabled ? 'Batalkan' : 'Aktifkan'}
                                    </button>
                                </div>
                            </div>
                            <span className="text-xs font-black">Rp {zakatValue.toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="flex justify-between items-center mb-8">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Total Tagihan</span>
                        <span className="text-3xl font-black text-emerald-700 tracking-tight">Rp {totalAmount.toLocaleString()}</span>
                    </div>

                    <div className="flex flex-col gap-3">
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => handlePayment('Akad')}
                                className="py-4 rounded-2xl border-2 border-emerald-600 text-emerald-600 font-bold text-xs uppercase tracking-widest hover:bg-emerald-50 transition-all active:scale-95"
                            >
                                Transfer
                            </button>
                            <button
                                onClick={() => handlePayment('Tunai')}
                                disabled={cart.length === 0}
                                className="py-4 rounded-2xl bg-emerald-600 text-white font-bold text-xs uppercase tracking-widest hover:bg-emerald-700 shadow-lg shadow-emerald-100 transition-all active:scale-95 disabled:opacity-50"
                            >
                                Tunai
                            </button>
                        </div>

                        {/* Customer Lookup Link */}
                        <button className="flex items-center justify-center gap-2 text-xs font-bold text-slate-400 hover:text-emerald-600 py-2 transition-colors">
                            <UserCircle size={16} /> Cari Data Customer
                        </button>
                    </div>
                </div>
            </aside>
        </div>
    );
}