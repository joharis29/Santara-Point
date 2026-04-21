"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { generateReceiptPDF } from '@/lib/receiptPdf';
import {
    ShoppingBag,
    ShieldCheck,
    LogOut,
    Home,
    Clock,
    Heart,
    CheckCircle2,
    XCircle,
    Calendar,
    ChevronRight,
    ShoppingBag as ShoppingBagIcon,
    Receipt
} from 'lucide-react';

export default function CustomerHistory() {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [customerName, setCustomerName] = useState('Sobat Santara');
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const storedName = localStorage.getItem('customerName');
        if (storedName) {
            setCustomerName(storedName);
            setIsLoggedIn(true);
        }

        const rawHistory = JSON.parse(localStorage.getItem('santaraTransactionHistory') || '[]');
        const userHistory = rawHistory.filter(trx => 
            trx.customerName === storedName && 
            (trx.status === 'Selesai' || trx.status === 'Ditolak')
        );
        setHistory(userHistory);
    }, []);

    return (
        <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
            {/* Sidebar Navigasi Customer */}
            <aside className="hidden lg:flex w-24 bg-white border-r border-slate-100 flex-col items-center py-10 gap-12">
                <button onClick={() => router.push('/homepage')} className="hover:scale-105 transition-transform" title="Ke Beranda">
                    <img src="/santara-logo.png" alt="Santara Logo" className="w-10 h-10 object-contain" />
                </button>
                <nav className="flex-1 flex flex-col gap-8">
                    <button onClick={() => router.push('/posin-cus')} className="p-3 text-slate-300 hover:text-emerald-600 transition-colors" title="Buka Menu Utama"><ShoppingBag size={24} /></button>
                    <button className="p-3 text-emerald-600 bg-emerald-50 rounded-2xl shadow-md" title="Riwayat Pesanan"><Clock size={24} /></button>
                    <button onClick={() => router.push('/favorites')} className="p-3 text-slate-300 hover:text-red-500 transition-colors" title="Menu Favorit">
                        <Heart size={24} />
                    </button>
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

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white px-6 py-8 md:px-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-100">
                    <div>
                        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Riwayat Pesanan Anda</h1>
                        <div className="flex items-center gap-2 mt-2">
                            <span className="bg-emerald-600 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1 shadow-lg shadow-emerald-100">
                                <ShieldCheck size={12} /> Syariah Verified
                            </span>
                            <span className="text-slate-400 text-xs font-bold">Halo, {customerName}! Ini adalah catatan riwayat pesanan Anda.</span>
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto px-6 md:px-10 py-10 bg-slate-50">
                    <div className="max-w-4xl mx-auto space-y-6">
                        {history.length === 0 ? (
                            <div className="bg-white rounded-3xl p-10 flex flex-col items-center justify-center text-center shadow-sm border border-slate-100 mt-10">
                                <ShoppingBagIcon size={64} className="text-slate-200 mb-6" />
                                <h3 className="text-xl font-bold text-slate-800 mb-2">Belum Ada Riwayat Lunas</h3>
                                <p className="text-slate-500">Anda tidak memiliki daftar pesanan dengan status 'Selesai' atau 'Ditolak'.</p>
                                <button 
                                    onClick={() => router.push('/posin-cus')}
                                    className="mt-6 px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition"
                                >
                                    Belanja Sekarang
                                </button>
                            </div>
                        ) : (
                            history.map(trx => (
                                <div key={trx.id} className="bg-white rounded-[2rem] p-6 lg:p-8 shadow-sm border border-slate-100 flex flex-col lg:flex-row gap-8 hover:shadow-md transition">
                                    {/* Left Status Area */}
                                    <div className="w-full lg:w-48 flex flex-col items-start gap-4">
                                        <div className={`px-4 py-2 rounded-full font-black text-xs uppercase tracking-widest flex items-center gap-2 ${
                                            trx.status === 'Selesai' 
                                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' 
                                            : 'bg-red-50 text-red-500 border border-red-200'
                                        }`}>
                                            {trx.status === 'Selesai' ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                                            {trx.status}
                                        </div>
                                        <div className="text-xs font-bold text-slate-400 flex items-center gap-2 uppercase">
                                            <Calendar size={14} />
                                            {new Date(trx.timestamp).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                            ID: {trx.id}
                                        </div>
                                    </div>

                                    {/* Inner Items Area */}
                                    <div className="flex-1 flex flex-col gap-3">
                                        <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wide border-b border-slate-100 pb-2 mb-2">Daftar Menu</h4>
                                        <div className="space-y-2">
                                            {trx.items.map((item, idx) => (
                                                <div key={idx} className="flex justify-between items-center text-sm">
                                                    <div className="flex items-center gap-3">
                                                        <span className="font-black text-slate-400">{item.quantity}x</span>
                                                        <span className="font-bold text-slate-700">{item.name}</span>
                                                    </div>
                                                    <span className="font-black text-emerald-600">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Right Payment Area */}
                                    <div className="w-full lg:w-64 bg-slate-50 rounded-2xl p-5 border border-slate-100 flex flex-col justify-between">
                                        <div>
                                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Metode Bayar</p>
                                            <p className="font-black text-slate-700 text-base">{trx.paymentMethod}</p>
                                        </div>
                                        <div className="mt-4 pt-4 border-t border-slate-200">
                                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Total Dibayar</p>
                                            <p className="font-black text-emerald-600 text-2xl tracking-tighter">Rp {trx.totalAmount?.toLocaleString('id-ID') || 0}</p>
                                            
                                            <button
                                                onClick={() => {
                                                    const settings = JSON.parse(localStorage.getItem('santaraStoreSettings') || '{}');
                                                    generateReceiptPDF(trx, settings);
                                                }}
                                                className="mt-4 w-full py-2.5 bg-white border-2 border-emerald-500 text-emerald-600 rounded-xl font-bold hover:bg-emerald-50 transition-all flex items-center justify-center gap-2 text-xs"
                                            >
                                                <Receipt size={14} /> Cetak Struk (PDF)
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
