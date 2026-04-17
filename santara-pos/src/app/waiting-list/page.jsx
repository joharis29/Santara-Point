"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    ArrowLeft,
    Clock,
    ChefHat,
    CheckCircle2,
    RefreshCw,
    User,
    ListTodo,
    ChevronRight,
    Utensils
} from 'lucide-react';

export default function WaitingListPage() {
    const router = useRouter();
    const [transactions, setTransactions] = useState([]);

    const loadData = () => {
        const history = JSON.parse(localStorage.getItem('santaraTransactionHistory') || '[]');
        
        // Kita hanya mengambil transaksi hari ini atau yang masih aktif untuk papan antrean.
        // Untuk prototype, kita akan mengambil yang statusnya belum diarsipkan (Selain Selesai jika mau difilter, tapi kita tampilkan Selesai juga)
        // Sortir: Terlama ke Terbaru (FIFO) untuk Antrean
        const queueOrders = history
            .filter(t => t.status === 'Menunggu' || t.status === 'Diproses' || t.status === 'Selesai')
            .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

        // Tampilkan maks 60 terakhir agar tidak berat
        setTransactions(queueOrders.slice(-60));
    };

    useEffect(() => {
        loadData();
        // Polling setiap 2 detik untuk efek real-time multiple tabs
        const timer = setInterval(loadData, 2000);
        return () => clearInterval(timer);
    }, []);

    const handleChangeStatus = (id, newStatus) => {
        const history = JSON.parse(localStorage.getItem('santaraTransactionHistory') || '[]');
        const updated = history.map(t => t.id === id ? { ...t, status: newStatus } : t);
        localStorage.setItem('santaraTransactionHistory', JSON.stringify(updated));
        loadData();
    };

    const menungguList = transactions.filter(t => t.status === 'Menunggu');
    const diprosesList = transactions.filter(t => t.status === 'Diproses');
    const selesaiList = transactions.filter(t => t.status === 'Selesai').slice(-10); // Hanya tampilkan 10 terakhir di kolom selesai

    const QueueCard = ({ trx, type }) => (
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col gap-3 group relative overflow-hidden transition-all hover:shadow-md">
            {/* Indikator Warna Header */}
            <div className={`absolute top-0 left-0 w-full h-1 ${
                type === 'Menunggu' ? 'bg-amber-400' : 
                type === 'Diproses' ? 'bg-blue-500' : 'bg-emerald-500'
            }`} />

            <div className="flex justify-between items-start mt-1">
                <div>
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Antrian</span>
                    <h3 className="text-2xl font-black text-slate-800 leading-none">{trx.queueNumber}</h3>
                </div>
                <div className="text-right">
                    <span className="text-[9px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full uppercase">
                        {trx.source}
                    </span>
                    <p className="text-[10px] text-slate-400 font-medium mt-1">
                        {new Date(trx.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-2 text-sm font-bold text-slate-700 bg-slate-50 p-2 rounded-lg">
                <User size={14} className="text-slate-400" /> {trx.customerName}
            </div>

            <div className="flex-1">
                <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2 border-b border-slate-100 pb-1">Pesanan:</h4>
                <ul className="space-y-1">
                    {trx.items && trx.items.map((item, idx) => (
                        <li key={idx} className="flex gap-2 text-xs font-medium text-slate-700">
                            <span className="font-black text-emerald-600">{item.quantity}x</span>
                            <span className="line-clamp-1">{item.name}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Aksi */}
            <div className="pt-2 mt-2 border-t border-slate-100">
                {type === 'Menunggu' && (
                    <div className="flex gap-2">
                        <button 
                            onClick={() => handleChangeStatus(trx.id, 'Ditolak')}
                            className="flex-1 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 font-black text-xs uppercase tracking-widest rounded-xl transition flex items-center justify-center gap-1"
                        >
                            Tolak
                        </button>
                        <button 
                            onClick={() => handleChangeStatus(trx.id, 'Diproses')}
                            className="flex-1 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-black text-xs uppercase tracking-widest rounded-xl transition flex items-center justify-center gap-1"
                        >
                            <ChefHat size={14} /> Terima
                        </button>
                    </div>
                )}
                {type === 'Diproses' && (
                    <button 
                        onClick={() => handleChangeStatus(trx.id, 'Selesai')}
                        className="w-full py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-black text-xs uppercase tracking-widest rounded-xl transition flex items-center justify-center gap-2"
                    >
                        <Utensils size={14} /> Pesanan Siap
                    </button>
                )}
                {type === 'Selesai' && (
                    <div className="w-full py-2.5 bg-emerald-50 text-emerald-600 font-black text-xs uppercase tracking-widest rounded-xl flex items-center justify-center gap-2">
                        <CheckCircle2 size={14} /> Berhasil
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className="flex flex-col h-screen bg-slate-100 font-sans text-slate-900 overflow-hidden">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shrink-0 shadow-sm z-10">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => router.back()}
                        className="w-10 h-10 flex items-center justify-center bg-slate-50 hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 rounded-xl transition-colors"
                        title="Kembali"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-xl font-black text-slate-800 flex items-center gap-2">
                            <ListTodo className="text-emerald-500" /> Papan Manajemen Dapur (Kitchen Display)
                        </h1>
                        <p className="text-xs font-bold text-slate-400">Kelola dan update status pesanan The Santara Point secara Real-Time.</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
                        <RefreshCw size={12} className="animate-spin" /> Live Sync Aktif
                    </span>
                </div>
            </header>

            {/* Kanban Board */}
            <main className="flex-1 overflow-x-auto overflow-y-hidden p-6">
                <div className="flex gap-6 h-full min-w-[900px]">
                    
                    {/* Kolom 1: Menunggu */}
                    <div className="flex-1 flex flex-col bg-slate-50 border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                        <div className="p-4 bg-white border-b border-slate-200 flex items-center justify-between shadow-sm z-10">
                            <h2 className="font-black text-slate-800 flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.8)]"></span>
                                Menunggu Konfirmasi
                            </h2>
                            <span className="bg-amber-100 text-amber-700 text-xs font-black px-2.5 py-1 rounded-full">{menungguList.length}</span>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {menungguList.length === 0 ? (
                                <p className="text-center text-slate-400 text-xs font-medium py-10 italic">Belum ada pesanan masuk.</p>
                            ) : (
                                menungguList.map(trx => <QueueCard key={trx.id} trx={trx} type="Menunggu" />)
                            )}
                        </div>
                    </div>

                    {/* Kolom 2: Diproses */}
                    <div className="flex-1 flex flex-col bg-slate-50 border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                        <div className="p-4 bg-white border-b border-slate-200 flex items-center justify-between shadow-sm z-10">
                            <h2 className="font-black text-slate-800 flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]"></span>
                                Sedang Dimasak
                            </h2>
                            <span className="bg-blue-100 text-blue-700 text-xs font-black px-2.5 py-1 rounded-full">{diprosesList.length}</span>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-blue-50/30">
                            {diprosesList.length === 0 ? (
                                <p className="text-center text-slate-400 text-xs font-medium py-10 italic">Tidak ada pesanan dimasak.</p>
                            ) : (
                                diprosesList.map(trx => <QueueCard key={trx.id} trx={trx} type="Diproses" />)
                            )}
                        </div>
                    </div>

                    {/* Kolom 3: Selesai */}
                    <div className="flex-1 flex flex-col bg-slate-50 border border-slate-200 rounded-3xl overflow-hidden shadow-sm opacity-80">
                        <div className="p-4 bg-white border-b border-slate-200 flex items-center justify-between shadow-sm z-10">
                            <h2 className="font-black text-slate-800 flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]"></span>
                                Siap Disajikan
                            </h2>
                            <span className="bg-emerald-100 text-emerald-700 text-xs font-black px-2.5 py-1 rounded-full">{selesaiList.length}</span>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {selesaiList.length === 0 ? (
                                <p className="text-center text-slate-400 text-xs font-medium py-10 italic">Belum ada pesanan selesai.</p>
                            ) : (
                                selesaiList.slice().reverse().map(trx => <QueueCard key={trx.id} trx={trx} type="Selesai" />)
                            )}
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}
