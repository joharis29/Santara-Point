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
    Package,
    TrendingUp,
    AlertCircle,
    MessageCircle,
    Mail,
    LogOut,
    LayoutDashboard,
    ClipboardList,
    Settings,
    Store // Ditambahkan untuk memperbaiki ReferenceError
} from 'lucide-react';

/**
 * SANTARA POINT - POS INPUT (OWNER ROLE)
 * Fokus: Manajemen Stok Presisi, Kalkulator Zakat, & Kontrol Operasional.
 */

const INITIAL_PRODUCTS = [
    { id: 1, name: 'Santara Signature Coffee', price: 28000, stock: 45, category: 'Minuman', img: 'https://images.unsplash.com/photo-1541167760496-162955ed8a9f?auto=format&fit=crop&q=80&w=500' },
    { id: 2, name: 'Nasi Kebuli Spesial', price: 45000, stock: 12, category: 'Makanan', img: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&q=80&w=500' },
    { id: 3, name: 'Croissant Almond', price: 22000, stock: 8, category: 'Snack', img: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=500' },
    { id: 4, name: 'Iced Matcha Latte', price: 25000, stock: 30, category: 'Minuman', img: 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?auto=format&fit=crop&q=80&w=500' },
    { id: 5, name: 'Ayam Bakar Madu', price: 42000, stock: 15, category: 'Makanan', img: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&q=80&w=500' },
    { id: 6, name: 'Singkong Goreng', price: 15000, stock: 25, category: 'Snack', img: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&q=80&w=500' },
];

const categories = ['Semua', 'Makanan', 'Minuman', 'Snack'];

export default function App() {
    const [products, setProducts] = useState(INITIAL_PRODUCTS);
    const [cart, setCart] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [zakatEnabled, setZakatEnabled] = useState(true);
    const [activeCategory, setActiveCategory] = useState('Semua');

    // --- Logika Perhitungan ---
    const menuTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const subtotal = zakatEnabled ? menuTotal / 1.025 : menuTotal;
    const zakatValue = zakatEnabled ? menuTotal - (menuTotal / 1.025) : 0;
    const totalAmount = menuTotal;

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = activeCategory === 'Semua' || p.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    // --- Handler Keranjang ---
    const addToCart = (product) => {
        if (product.stock <= 0) return;
        const exist = cart.find(x => x.id === product.id);
        if (exist) {
            setCart(cart.map(x => x.id === product.id ? { ...x, quantity: x.quantity + 1 } : x));
        } else {
            setCart([...cart, { ...product, quantity: 1 }]);
        }
    };

    const removeFromCart = (id) => {
        setCart(cart.filter(item => item.id !== id));
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

    const handleCheckout = () => {
        alert(`Transaksi Berhasil!\nTotal: Rp ${totalAmount.toLocaleString()}\nNota terkirim ke WhatsApp Owner.`);
        // Reset state setelah simulasi
        setCart([]);
    };

    return (
        <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">

            {/* 1. Sidebar Navigasi (Eksklusif Owner) */}
            <aside className="w-20 lg:w-64 bg-emerald-900 text-white flex flex-col transition-all duration-300">
                <div className="p-6 flex items-center gap-3 border-b border-emerald-800">
                    <div className="bg-white p-2 rounded-lg">
                        <Store className="text-emerald-900" size={20} />
                    </div>
                    <span className="hidden lg:block font-black tracking-tighter text-xl italic uppercase">SANTARA OPS</span>
                </div>
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {[
                        { icon: <LayoutDashboard size={20} />, label: "Dashboard", active: false },
                        { icon: <ShoppingBag size={20} />, label: "POS Kasir", active: true },
                        { icon: <ClipboardList size={20} />, label: "Manajemen Stok", active: false },
                        { icon: <TrendingUp size={20} />, label: "Laporan Keuangan", active: false },
                        { icon: <Settings size={20} />, label: "Pengaturan Toko", active: false },
                    ].map((item, i) => (
                        <button key={i} className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all ${item.active ? 'bg-emerald-600 shadow-lg shadow-emerald-950/20 text-white' : 'hover:bg-emerald-800 text-emerald-300 hover:text-white'}`}>
                            {item.icon}
                            <span className="hidden lg:block font-bold text-sm">{item.label}</span>
                        </button>
                    ))}
                </nav>
                <div className="p-4 border-t border-emerald-800">
                    <button onClick={() => window.location.href = '/login'} className="w-full flex items-center gap-4 p-3 rounded-xl text-red-300 hover:bg-red-500/10 hover:text-red-400 transition-all">
                        <LogOut size={20} />
                        <span className="hidden lg:block font-bold text-sm">Keluar</span>
                    </button>
                </div>
            </aside>

            {/* 2. Area Utama Produk */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Header Dashboard */}
                <header className="bg-white border-b border-slate-200 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Terminal Kasir</h2>
                            <div className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded flex items-center gap-1 text-[10px] font-black uppercase border border-amber-200">
                                <ShieldCheck size={12} /> Syariah Verified
                            </div>
                        </div>
                        <p className="text-slate-400 text-xs font-medium">Selamat Bekerja, <span className="text-emerald-700 font-bold">Owner Santara</span></p>
                    </div>

                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Cari menu atau kategori..."
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border-none rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </header>

                {/* Kategori Makanan - Filter */}
                <div className="px-6 lg:px-10 mt-6 overflow-x-auto">
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

                {/* Grid Produk */}
                <section className="flex-1 overflow-y-auto p-6 lg:p-10">
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredProducts.map(product => (
                            <div
                                key={product.id}
                                onClick={() => addToCart(product)}
                                className={`bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all border-2 border-transparent hover:border-emerald-500 cursor-pointer group ${product.stock <= 0 ? 'opacity-50 grayscale' : ''}`}
                            >
                                <div className="h-44 overflow-hidden relative">
                                    <img src={product.img} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black uppercase text-slate-600">
                                        {product.category}
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-extrabold text-slate-800 text-lg leading-tight">{product.name}</h4>
                                        {product.stock < 10 && product.stock > 0 && (
                                            <span className="flex items-center gap-1 text-[10px] text-red-500 font-bold animate-pulse">
                                                <AlertCircle size={10} /> Stok Menipis
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="text-emerald-700 font-black text-xl">Rp {product.price.toLocaleString()}</p>
                                            {/* INFORMASI STOK PRESISI UNTUK OWNER */}
                                            <div className="flex items-center gap-1.5 mt-1">
                                                <Package size={12} className="text-slate-400" />
                                                <p className={`text-xs font-bold ${product.stock < 10 ? 'text-red-500' : 'text-slate-400'}`}>
                                                    Persediaan: {product.stock} unit
                                                </p>
                                            </div>
                                        </div>
                                        <div className="bg-emerald-50 p-2 rounded-xl text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                                            <Plus size={20} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            {/* 3. Panel Ringkasan Transaksi (Sidebar Kanan) */}
            <aside className="hidden md:flex w-[400px] lg:w-[450px] bg-white border-l border-slate-200 flex flex-col shadow-2xl relative z-10">
                <div className="p-8 flex-1 overflow-y-auto">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-2xl font-black text-slate-800 tracking-tight">Keranjang</h3>
                        <span className="bg-slate-100 px-3 py-1 rounded-full text-xs font-bold text-slate-500 tracking-wider uppercase">
                            {cart.length} Item
                        </span>
                    </div>

                    {cart.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-slate-300 opacity-50 italic py-20">
                            <ShoppingBag size={64} className="mb-4" />
                            <p className="text-sm font-bold">Belum ada pesanan terpilih</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {cart.map(item => (
                                <div key={item.id} className="flex items-center gap-4 bg-slate-50 p-4 rounded-3xl border border-slate-100 group">
                                    <img src={item.img} className="w-16 h-16 rounded-2xl object-cover shadow-sm" />
                                    <div className="flex-1">
                                        <h5 className="font-black text-sm text-slate-800 line-clamp-1">{item.name}</h5>
                                        <p className="text-xs text-emerald-600 font-bold mt-0.5">Rp {item.price.toLocaleString()}</p>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-slate-200">
                                            <button onClick={() => updateQty(item.id, -1)} className="p-1 hover:bg-emerald-50 rounded-lg text-emerald-600"><Minus size={14} /></button>
                                            <span className="text-sm font-black w-4 text-center">{item.quantity}</span>
                                            <button onClick={() => addToCart(item)} className="p-1 hover:bg-emerald-50 rounded-lg text-emerald-600"><Plus size={14} /></button>
                                        </div>
                                        <button onClick={() => removeFromCart(item.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Bagian Pembayaran & Zakat */}
                <div className="p-8 bg-slate-900 text-white rounded-t-[3rem] shadow-[0_-20px_50px_rgba(0,0,0,0.1)]">
                    <div className="space-y-4 mb-8">
                        <div className="flex justify-between text-slate-400 font-bold text-sm tracking-widest uppercase">
                            <span>Subtotal</span>
                            <span>Rp {subtotal.toLocaleString()}</span>
                        </div>

                        {/* KALKULATOR ZAKAT OTOMATIS */}
                        <div className={`flex items-center justify-between p-4 rounded-2xl transition-all border ${zakatEnabled ? 'bg-emerald-600/20 border-emerald-500' : 'bg-slate-800 border-slate-700'}`}>
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-xl ${zakatEnabled ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-400'}`}>
                                    <Calculator size={18} />
                                </div>
                                <div>
                                    <p className="text-xs font-black uppercase tracking-wider leading-none mb-1">Zakat (2.5%)</p>
                                    <button
                                        onClick={() => setZakatEnabled(!zakatEnabled)}
                                        className="text-[10px] font-bold text-emerald-400 underline decoration-dotted"
                                    >
                                        {zakatEnabled ? 'Nonaktifkan' : 'Aktifkan'}
                                    </button>
                                </div>
                            </div>
                            <span className={`text-sm font-black ${zakatEnabled ? 'text-emerald-400' : 'text-slate-500'}`}>
                                Rp {zakatValue.toLocaleString()}
                            </span>
                        </div>
                    </div>

                    <div className="flex justify-between items-center mb-8">
                        <span className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em]">Total Akhir</span>
                        <span className="text-3xl font-black text-white">Rp {totalAmount.toLocaleString()}</span>
                    </div>

                    <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                            <button className="py-4 rounded-2xl border-2 border-slate-700 font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-95">
                                Transfer
                            </button>
                            <button
                                onClick={handleCheckout}
                                disabled={cart.length === 0}
                                className="py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-900/40 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100"
                            >
                                Tunai
                            </button>
                        </div>
                    </div>
                    <p className="mt-6 text-[10px] text-center text-slate-500 italic font-medium">
                        "Sistem amanah. Laporan transaksi otomatis tersimpan di Cloud Owner."
                    </p>
                </div>
            </aside>
        </div>
    );
}