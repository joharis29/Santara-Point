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
    Utensils,
    Home,
    ShoppingBag,
    History,
    MapPin,
    Phone,
    Info,
    Hash,
    Truck
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

const DEFAULT_SETTINGS = {
    storeName: 'Santara Point',
    storeTagline: 'Hidangan Lezat, Penuh Keberkahan.',
    whatsapp: '6285846802177',
    email: 'santarapoint@gmail.com',
    address: 'Jl. Raya Santara No. 123, Bandung',
    footerText: '© 2024 Santara Point. Berkah setiap saat.'
};

export default function WaitingListPage() {
    const router = useRouter();
    const [transactions, setTransactions] = useState([]);
    const [storeSettings, setStoreSettings] = useState(DEFAULT_SETTINGS);

    const loadData = async () => {
        try {
            // Priority 1: Get from Supabase
            const { data, error } = await supabase
                .from('transactions')
                .select('*')
                .in('status', ['Menunggu', 'Diproses', 'Selesai'])
                .order('timestamp', { ascending: true })
                .limit(60);

            if (error) throw error;

            if (data && data.length > 0) {
                setTransactions(data);
            } else {
                // Priority 2: Fallback to LocalStorage if DB empty or offline
                const history = JSON.parse(localStorage.getItem('santaraTransactionHistory') || '[]');
                const queueOrders = history
                    .filter(t => t.status === 'Menunggu' || t.status === 'Diproses' || t.status === 'Selesai')
                    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
                setTransactions(queueOrders.slice(-60));
            }
        } catch (err) {
            console.error("Error loading Supabase queue:", err);
            // Silent fallback to local
            const history = JSON.parse(localStorage.getItem('santaraTransactionHistory') || '[]');
            setTransactions(history.filter(t => ['Menunggu', 'Diproses', 'Selesai'].includes(t.status)).slice(-60));
        }
    };

    useEffect(() => {
        loadData();

        // 1. Realtime Subscription for Cross-Device Sync
        const channel = supabase
            .channel('transaction-updates')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'transactions' }, (payload) => {
                console.log('Realtime update received!', payload);
                loadData();
            })
            .subscribe();

        // 2. Polling Fallback (setiap 10 detik, lebih jarang karena sudah ada realtime)
        const timer = setInterval(loadData, 10000);

        const storedSettings = localStorage.getItem('santaraStoreSettings');
        if (storedSettings) {
            setStoreSettings(JSON.parse(storedSettings));
        }

        return () => {
            clearInterval(timer);
            supabase.removeChannel(channel);
        };
    }, []);

    const handleChangeStatus = async (id, newStatus) => {
        try {
            // Update Supabase
            const { error } = await supabase
                .from('transactions')
                .update({ status: newStatus })
                .eq('id', id);
            
            if (error) throw error;
            
            // Also update local for immediate feedback
            setTransactions(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));

            // Sync back to localstorage for other pages
            const history = JSON.parse(localStorage.getItem('santaraTransactionHistory') || '[]');
            const updated = history.map(t => t.id === id ? { ...t, status: newStatus } : t);
            localStorage.setItem('santaraTransactionHistory', JSON.stringify(updated));
        } catch (err) {
            console.error("Error updating status:", err);
            alert("Gagal merubah status di database.");
        }
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

            <div className="space-y-2.5">
                {(trx.source === 'Owner' || trx.source === 'Kasir') ? (
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 space-y-2">
                        <div className="flex items-center gap-2 border-b border-slate-100 pb-1.5">
                            <Info size={11} className="text-slate-400" />
                            <h4 className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Keterangan Pesanan</h4>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="flex items-center gap-1.5">
                                <Utensils size={12} className="text-emerald-500" />
                                <span className="text-[10px] font-bold text-slate-600">{trx.orderType || 'Dine-In'}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Hash size={12} className="text-amber-500" />
                                <span className="text-[10px] font-bold text-slate-600">No. {trx.queueNumber}</span>
                            </div>
                        </div>
                        {trx.keterangan && (
                            <p className="text-[10px] text-slate-500 italic bg-amber-50/50 p-2 rounded border border-amber-100/50 border-dashed">
                                "{trx.keterangan}"
                            </p>
                        )}
                    </div>
                ) : (
                    <div className="bg-emerald-50/30 p-2.5 rounded-xl border border-emerald-100/50 space-y-2">
                        <div className="flex items-center gap-2 border-b border-emerald-100/30 pb-1.5">
                            <Truck size={11} className="text-emerald-600" />
                            <h4 className="text-[9px] font-black uppercase text-emerald-600 tracking-widest">Data Diri Pemesan</h4>
                        </div>
                        <div className="space-y-1.5">
                            <div className="flex items-center gap-1.5">
                                <Phone size={11} className="text-emerald-600" />
                                <span className="text-[10px] font-bold text-slate-600">{trx.customerPhone || 'N/A'}</span>
                            </div>
                            <div className="flex items-start gap-1.5">
                                <MapPin size={11} className="text-red-500 mt-0.5 shrink-0" />
                                <p className="text-[10px] font-bold text-slate-600 leading-tight line-clamp-2">{trx.deliveryAddress || 'Ambil di Toko'}</p>
                            </div>
                        </div>
                        {trx.keterangan && (
                            <p className="text-[10px] text-emerald-700 italic bg-white/80 p-2 rounded border border-emerald-100/50 border-dashed">
                                "{trx.keterangan}"
                            </p>
                        )}
                    </div>
                )}
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
        <div className="flex flex-col h-screen bg-slate-100 font-sans text-slate-900 overflow-hidden pb-20 lg:pb-0">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shrink-0 shadow-sm z-10 transition-all">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => router.back()}
                        className="hidden sm:flex w-10 h-10 items-center justify-center bg-slate-50 hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 rounded-xl transition-colors"
                        title="Kembali"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-lg lg:text-xl font-black text-slate-800 flex items-center gap-2">
                            <ListTodo className="text-emerald-500" /> <span className="hidden sm:inline">Papan Manajemen</span> Dapur
                        </h1>
                        <p className="text-[10px] lg:text-xs font-bold text-slate-400">Update status pesanan secara Real-Time.</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1.5 text-[10px] lg:text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
                        <RefreshCw size={12} className="animate-spin" /> <span className="hidden sm:inline">Live</span> Sync
                    </span>
                </div>
            </header>

            {/* Kanban Board */}
            <main className="flex-1 overflow-x-auto lg:overflow-x-hidden overflow-y-auto lg:overflow-y-hidden p-4 lg:p-6 bg-slate-100">
                <div className="flex flex-col lg:flex-row gap-6 h-full min-w-0">
                    
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

                {/* Mobile Bottom Navigation */}
                <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-6 py-4 flex justify-around items-center z-50">
                    <button onClick={() => router.push('/homepage')} className="flex flex-col items-center gap-1 text-slate-400">
                        <Home size={20} />
                        <span className="text-[10px] font-bold uppercase tracking-tight">Home</span>
                    </button>
                    <button onClick={() => router.push('/posin-adm')} className="flex flex-col items-center gap-1 text-slate-400">
                        <ShoppingBag size={20} />
                        <span className="text-[10px] font-bold uppercase tracking-tight">POS</span>
                    </button>
                    <button onClick={() => router.push('/history?role=admin')} className="flex flex-col items-center gap-1 text-slate-400">
                        <History size={20} />
                        <span className="text-[10px] font-bold uppercase tracking-tight">Riwayat</span>
                    </button>
                    <button onClick={() => router.push('/pembelian')} className="flex flex-col items-center gap-1 text-slate-400">
                        <ShoppingBag size={20} />
                        <span className="text-[10px] font-bold uppercase tracking-tight">Beli</span>
                    </button>
                    <button className="flex flex-col items-center gap-1 text-emerald-600">
                        <ChefHat size={20} />
                        <span className="text-[10px] font-bold uppercase tracking-tight">Antrean</span>
                    </button>
                </nav>
            </main>
        </div>
    );
}
