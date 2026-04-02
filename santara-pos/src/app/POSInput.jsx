"use client";
import React, { useState } from 'react';
import { ShoppingBag, User, Calculator, LogOut, ShieldCheck, Search, Minus, Plus, Coffee } from 'lucide-react';

// MOCK DATA: Daftar Produk Awal (sama dengan Login.jsx)
const PRODUCTS = [
    { id: 1, name: 'Kopi Susu Gula Aren', price: 18000, stock: 45, category: 'Minuman' },
    { id: 2, name: 'Nasi Goreng Spesial', price: 25000, stock: 20, category: 'Makanan' },
    { id: 3, name: 'Teh Tarik Madu', price: 15000, stock: 30, category: 'Minuman' },
    { id: 4, name: 'Roti Bakar Cokelat', price: 12000, stock: 15, category: 'Snack' },
    { id: 5, name: 'Samosa Daging (Isi 3)', price: 22000, stock: 10, category: 'Snack' },
    { id: 6, name: 'Kurma Sukari 250g', price: 35000, stock: 25, category: 'Oleh-oleh' },
];

export default function POSDashboard({ onLogout }) {
    const [cart, setCart] = useState([]);
    const [includeZakat, setIncludeZakat] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredProducts = PRODUCTS.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const zakatValue = includeZakat ? subtotal * 0.025 : 0;
    const total = subtotal + zakatValue;

    const addToCart = (product) => {
        const existing = cart.find(item => item.id === product.id);
        if (existing) {
            setCart(cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
        } else {
            setCart([...cart, { ...product, quantity: 1 }]);
        }
    };

    const updateQuantity = (id, delta) => {
        setCart(cart.map(item => {
            if (item.id === id) {
                const newQty = Math.max(0, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        }).filter(item => item.quantity > 0));
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row overflow-hidden">
            {/* Sidebar Navigation */}
            <div className="w-full md:w-20 bg-emerald-800 text-white flex flex-col items-center py-6 gap-8">
                <div className="bg-white p-2 rounded-xl">
                    <div className="w-8 h-8 bg-emerald-700 rounded-lg flex items-center justify-center font-bold text-white text-xl italic">S</div>
                </div>
                <div className="flex-1 flex flex-col gap-6">
                    <button className="p-3 bg-emerald-700 rounded-xl"><ShoppingBag /></button>
                    <button className="p-3 hover:bg-emerald-700 rounded-xl transition text-emerald-300"><User /></button>
                    <button className="p-3 hover:bg-emerald-700 rounded-xl transition text-emerald-300"><Calculator /></button>
                </div>
                <button onClick={onLogout} className="p-3 hover:bg-red-500 rounded-xl transition"><LogOut /></button>
            </div>

            {/* Main Product Grid */}
            <div className="flex-1 p-6 overflow-y-auto">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Santara Point POS</h1>
                        <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center gap-1 bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full text-xs font-bold border border-amber-200">
                                <ShieldCheck size={14} />
                                Audit Syariah Verified
                            </div>
                            <span className="text-gray-400 text-xs uppercase tracking-widest font-semibold">Kasir: Abdullah</span>
                        </div>
                    </div>
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl shadow-sm outline-none focus:ring-2 focus:ring-emerald-500"
                            placeholder="Cari Menu..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </header>

                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredProducts.map(product => (
                        <div
                            key={product.id}
                            onClick={() => addToCart(product)}
                            className="bg-white p-4 rounded-2xl shadow-sm border border-transparent hover:border-emerald-500 hover:shadow-md transition cursor-pointer group"
                        >
                            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
                                <Coffee />
                            </div>
                            <h3 className="font-bold text-gray-800 line-clamp-1">{product.name}</h3>
                            <p className="text-xs text-gray-400 mb-2">{product.category}</p>
                            <p className="text-emerald-700 font-bold">Rp {product.price.toLocaleString('id-ID')}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Checkout Sidebar */}
            <div className="w-full md:w-96 bg-white border-l border-gray-100 flex flex-col shadow-2xl">
                <div className="p-6 flex-1 overflow-y-auto">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-800">Ringkasan Pesanan</h2>
                        <span className="bg-gray-100 px-2 py-1 rounded text-xs text-gray-500 font-bold">{cart.length} Item</span>
                    </div>

                    {cart.length === 0 ? (
                        <div className="h-64 flex flex-col items-center justify-center text-gray-300">
                            <ShoppingBag size={48} className="mb-2 opacity-20" />
                            <p>Keranjang masih kosong</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {cart.map(item => (
                                <div key={item.id} className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                                    <div className="flex-1">
                                        <h4 className="text-sm font-bold text-gray-800">{item.name}</h4>
                                        <p className="text-xs text-gray-400">Rp {item.price.toLocaleString()}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => updateQuantity(item.id, -1)} className="p-1 text-emerald-600 hover:bg-white rounded border"><Minus size={14} /></button>
                                        <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                                        <button onClick={() => addToCart(item)} className="p-1 text-emerald-600 hover:bg-white rounded border"><Plus size={14} /></button>
                                    </div>
                                    <div className="text-sm font-bold text-gray-700">
                                        Rp {(item.price * item.quantity).toLocaleString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Pricing Summary */}
                <div className="p-6 bg-slate-50 border-t border-gray-200">
                    <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>Subtotal</span>
                            <span>Rp {subtotal.toLocaleString('id-ID')}</span>
                        </div>

                        {/* Sharia Feature: Zakat Calculation */}
                        <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-emerald-100 shadow-sm">
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={includeZakat}
                                    onChange={(e) => setIncludeZakat(e.target.checked)}
                                    className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
                                />
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-emerald-800">Infaq/Zakat Mal</span>
                                    <span className="text-[10px] text-gray-400 italic">Otomatis 2.5% dari total</span>
                                </div>
                            </div>
                            {includeZakat && <span className="text-xs font-bold text-emerald-600">+ Rp {zakatValue.toLocaleString('id-ID')}</span>}
                        </div>
                    </div>

                    <div className="flex justify-between items-center mb-6">
                        <span className="text-lg font-bold text-gray-800">Total Akhir</span>
                        <span className="text-2xl font-black text-emerald-700 tracking-tight">Rp {total.toLocaleString('id-ID')}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-4">
                        <button className="py-2 px-3 border border-emerald-500 text-emerald-600 rounded-lg text-xs font-bold hover:bg-emerald-50 transition uppercase">Cash</button>
                        <button className="py-2 px-3 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition uppercase shadow-md shadow-emerald-200">Transfer (QRIS)</button>
                    </div>

                    <div className="text-[10px] text-center text-gray-400 italic">
                        "Semoga transaksi ini membawa keberkahan bagi pemberi dan penerima."
                    </div>
                </div>
            </div>
        </div>
    );
}
