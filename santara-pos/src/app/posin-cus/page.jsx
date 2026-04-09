"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    ShoppingBag,
    ShieldCheck,
    Search,
    Plus,
    Minus,
    Trash2,
    Info,
    ChevronRight,
    MessageCircle,
    Mail,
    LogOut,
    Home,
    Clock,
    ShoppingCart,
    Heart,
    Star,
    CheckCircle2
} from 'lucide-react';

const PRODUCTS = [
    { id: 1, name: 'Santara Signature Coffee', price: 28000, stock: 45, category: 'Minuman', img: 'https://images.unsplash.com/photo-1541167760496-162955ed8a9f?auto=format&fit=crop&q=80&w=500', rating: 4.8 },
    { id: 2, name: 'Nasi Kebuli Spesial', price: 45000, stock: 12, category: 'Makanan', img: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&q=80&w=500', rating: 4.9 },
    { id: 3, name: 'Croissant Almond', price: 22000, stock: 5, category: 'Snack', img: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=500', rating: 4.7 },
    { id: 4, name: 'Iced Matcha Latte', price: 25000, stock: 30, category: 'Minuman', img: 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?auto=format&fit=crop&q=80&w=500', rating: 4.6 },
    { id: 5, name: 'Ayam Bakar Madu', price: 42000, stock: 15, category: 'Makanan', img: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&q=80&w=500', rating: 4.9 },
    { id: 6, name: 'Singkong Goreng', price: 15000, stock: 0, category: 'Snack', img: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&q=80&w=500', rating: 4.5 },
];

export default function App() {
    const router = useRouter();
    // Simulasi status login customer
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [customerName, setCustomerName] = useState('Sobat Santara');

    React.useEffect(() => {
        const storedName = localStorage.getItem('customerName');
        if (storedName) {
            setCustomerName(storedName);
            setIsLoggedIn(true);
        }
    }, []);

    const [cart, setCart] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('Semua');

    const categories = ['Semua', 'Makanan', 'Minuman', 'Snack'];

    // --- Perhitungan Total (102.5%) ---
    const menuTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const subtotal = menuTotal / 1.025; // Harga original tanpa zakat
    const zakatValue = menuTotal - subtotal; // Otomatis terhitung untuk transparansi
    const totalAmount = menuTotal; // Total yang dibayar tetap

    const filteredProducts = PRODUCTS.filter(p =>
        (activeCategory === 'Semua' || p.category === activeCategory) &&
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

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

    const handleCheckout = () => {
        if (!isLoggedIn) {
            router.push('/login');
            return;
        }

        alert(`Pesanan Anda Berhasil diproses!\nTotal Harga: Rp ${totalAmount.toLocaleString('id-ID')}\nNota Digital telah dikirim ke WhatsApp Anda.\nTerima kasih telah berbelanja secara amanah di Santara Point.`);
        setCart([]);
    };

    return (
        <div className="flex h-screen bg-white font-sans text-slate-900 overflow-hidden">
            {/* Sidebar Navigasi Customer */}
            <aside className="hidden lg:flex w-24 bg-slate-50 border-r border-slate-100 flex-col items-center py-10 gap-12">
                <div className="text-emerald-600">
                    <ShoppingBag size={32} strokeWidth={2.5} />
                </div>
                <nav className="flex-1 flex flex-col gap-8">
                    <button className="p-3 text-emerald-600 bg-white rounded-2xl shadow-md"><Home size={24} /></button>
                    <button className="p-3 text-slate-300 hover:text-emerald-600 transition-colors"><Clock size={24} /></button>
                    <button className="p-3 text-slate-300 hover:text-emerald-600 transition-colors"><Heart size={24} /></button>
                </nav>
                <button
                    onClick={() => {
                        localStorage.removeItem('customerName');
                        setIsLoggedIn(false);
                        setCustomerName('Sobat Santara');
                        router.push('/login');
                    }}
                    className="p-3 flex flex-col items-center gap-1 text-slate-300 hover:text-red-500 transition-colors"
                >
                    <LogOut size={24} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Keluar</span>
                </button>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col overflow-hidden">
                <header className="px-6 py-8 md:px-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Pilih Menu Favorit</h1>
                        <div className="flex items-center gap-2 mt-2">
                            <span className="bg-emerald-600 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1 shadow-lg shadow-emerald-100">
                                <ShieldCheck size={12} /> Syariah Verified
                            </span>
                            <span className="text-slate-400 text-xs font-bold">Halo, {customerName}!</span>
                        </div>
                    </div>
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Cari rasa yang berkah..."
                            className="w-full pl-12 pr-4 py-3 bg-slate-100 border-none rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm font-medium"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </header>

                <div className="px-6 md:px-10 mb-8 overflow-x-auto">
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

                <section className="flex-1 overflow-y-auto px-6 md:px-10 pb-10">
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                        {filteredProducts.map(product => (
                            <div
                                key={product.id}
                                onClick={() => addToCart(product)}
                                className={`group bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer border border-slate-50 flex flex-col ${product.stock <= 0 ? 'opacity-60 grayscale' : ''}`}
                            >
                                <div className="h-56 overflow-hidden relative">
                                    <img src={product.img} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black text-slate-800 shadow-sm flex items-center gap-1">
                                        <Star size={12} className="text-amber-500 fill-amber-500" /> {product.rating}
                                    </div>
                                    {product.stock <= 0 && (
                                        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
                                            <span className="bg-white text-slate-900 px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest">Habis Terjual</span>
                                        </div>
                                    )}
                                </div>
                                <div className="p-8 flex-1 flex flex-col justify-between">
                                    <div>
                                        <h3 className="font-extrabold text-slate-800 text-lg mb-2 leading-tight group-hover:text-emerald-700 transition-colors">{product.name}</h3>
                                        <div className="flex justify-between items-end">
                                            <p className="text-emerald-600 font-black text-2xl">Rp {product.price.toLocaleString('id-ID')}</p>
                                            <span className={`text-[10px] font-black uppercase tracking-tighter ${product.stock > 10 ? 'text-emerald-400' : product.stock > 0 ? 'text-amber-500 animate-pulse' : 'text-slate-400'}`}>
                                                {product.stock > 10 ? 'Tersedia' : product.stock > 0 ? 'Stok Terbatas' : 'Habis'}
                                            </span>
                                        </div>
                                    </div>
                                    <button className="mt-6 w-full py-3 bg-slate-50 text-slate-400 group-hover:bg-emerald-600 group-hover:text-white rounded-2xl font-bold text-xs transition-all flex items-center justify-center gap-2">
                                        <Plus size={16} /> Tambah ke Keranjang
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            {/* Right Side: Order Summary */}
            <aside className="hidden md:flex w-[320px] lg:w-[420px] shrink-0 bg-slate-50 p-4 lg:p-6 flex-col">
                <div className="bg-white rounded-[24px] shadow-sm border border-slate-200 flex-1 flex flex-col overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex items-center gap-3">
                        <div className="text-emerald-600">
                            <ShoppingBag size={24} />
                        </div>
                        <h2 className="text-[17px] font-bold text-slate-800">
                            Ringkasan Pesanan
                        </h2>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 bg-slate-50/30">
                        {cart.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-slate-300 gap-4 opacity-70">
                                <ShoppingBag size={48} strokeWidth={1.5} />
                                <p className="font-medium text-sm">Keranjang kosong</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {cart.map(item => (
                                    <div key={item.id} className="flex items-center gap-4 bg-white p-3 rounded-xl shadow-sm border border-slate-100">
                                        <img src={item.img} className="w-16 h-16 rounded-xl object-cover" />
                                        <div className="flex-1">
                                            <h4 className="font-bold text-sm text-slate-800 line-clamp-1">{item.name}</h4>
                                            <p className="text-xs text-emerald-600 font-bold mt-1">Rp {item.price.toLocaleString('id-ID')}</p>
                                            <div className="flex items-center gap-2 mt-2">
                                                <button onClick={() => updateQty(item.id, -1)} className="w-6 h-6 flex items-center justify-center bg-slate-100 rounded text-slate-500 hover:bg-emerald-50 hover:text-emerald-600 transition-colors">
                                                    <Minus size={12} />
                                                </button>
                                                <span className="text-xs font-bold text-slate-800 w-4 text-center">{item.quantity}</span>
                                                <button onClick={() => addToCart(item)} className="w-6 h-6 flex items-center justify-center bg-slate-100 rounded text-slate-500 hover:bg-emerald-50 hover:text-emerald-600 transition-colors">
                                                    <Plus size={12} />
                                                </button>
                                            </div>
                                        </div>
                                        <button onClick={() => updateQty(item.id, -item.quantity)} className="text-slate-300 hover:text-red-500 transition-colors self-start p-1">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="p-6 bg-white border-t border-slate-100">
                        <div className="mb-6 space-y-3">
                            <div className="flex justify-between text-slate-500 text-sm font-medium">
                                <span>Total Pesanan</span>
                                <span>Rp {subtotal.toLocaleString('id-ID', { maximumFractionDigits: 0 })}</span>
                            </div>

                            <div className="flex justify-between items-center py-2.5 px-3 rounded-lg border border-emerald-100 bg-white">
                                <div className="flex items-center gap-2">
                                    <div className="text-emerald-500 flex items-center justify-center w-5 h-5 rounded-full bg-emerald-50">
                                        <Info size={12} />
                                    </div>
                                    <span className="text-[13px] font-medium text-emerald-600">Termasuk Zakat (2.5%)</span>
                                </div>
                                <span className="text-[13px] font-bold text-emerald-600">Rp {zakatValue.toLocaleString('id-ID', { maximumFractionDigits: 0 })}</span>
                            </div>
                        </div>

                        <div className="flex justify-between items-center mb-8">
                            <span className="text-[15px] font-bold text-slate-800 uppercase tracking-wide">TOTAL AKHIR</span>
                            <span className="text-[32px] font-black text-emerald-600 tracking-tighter">Rp {totalAmount.toLocaleString('id-ID')}</span>
                        </div>

                        <div className="flex flex-col">
                            <div className="flex items-center justify-center gap-1.5 text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-2">
                                <CheckCircle2 size={12} className="text-emerald-500" /> NOTIFIKASI AKTIF: WA & EMAIL
                            </div>

                            <button
                                onClick={handleCheckout}
                                disabled={cart.length === 0}
                                className={`w-full py-3.5 rounded-xl font-bold text-base transition flex items-center justify-center gap-2 ${cart.length === 0 ? 'bg-slate-200 text-slate-500 cursor-not-allowed' : 'bg-slate-200 hover:bg-slate-300 text-slate-700 shadow-sm'}`}
                            >
                                Konfirmasi & Bayar <ChevronRight size={18} />
                            </button>

                            <p className="text-center text-[11px] text-slate-400 mt-4 italic">
                                *Setiap transaksi diawasi oleh sistem audit syariah otomatis.*
                            </p>
                        </div>
                    </div>
                </div>
            </aside>

        </div>
    );
}