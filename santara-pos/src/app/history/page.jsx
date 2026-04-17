"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    ArrowLeft,
    Calendar,
    Search,
    TrendingUp,
    Receipt,
    Calculator,
    Clock,
    User,
    Store,
    FolderOpen,
    Filter
} from 'lucide-react';

export default function HistoryPage() {
    const router = useRouter();
    const [transactions, setTransactions] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            setIsAdmin(params.get('role') === 'admin');
        }

        const history = JSON.parse(localStorage.getItem('santaraTransactionHistory') || '[]');
        
        // Mengurutkan dari yang terbaru
        history.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setTransactions(history);
        
        // Setup initial default month to current month if transactions exist
        if (history.length > 0) {
            const months = Array.from(new Set(history.map(t => new Date(t.timestamp).toISOString().slice(0, 7))));
            months.sort().reverse();
            setSelectedMonth(months[0]);
        } else {
            setSelectedMonth(new Date().toISOString().slice(0, 7)); // Cth: "2026-04"
        }
    }, []);

    // Get unique months from transactions for the 'folder' dropdown
    const availableMonths = Array.from(new Set([
        ...transactions.map(t => new Date(t.timestamp).toISOString().slice(0, 7)),
        selectedMonth
    ])).sort().reverse();

    const formatMonthName = (YYYYMM) => {
        const [year, month] = YYYYMM.split('-');
        const date = new Date(year, parseInt(month) - 1, 1);
        return date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
    };

    const filteredTransactions = transactions.filter(t => {
        const isCurrentMonth = t.timestamp.startsWith(selectedMonth);
        const matchesSearch = t.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              t.id.toLowerCase().includes(searchTerm.toLowerCase());
        return isCurrentMonth && matchesSearch;
    });

    const totalIncome = filteredTransactions.reduce((sum, t) => sum + (t.status === 'Ditolak' ? 0 : (t.totalAmount || 0)), 0);
    const totalZakat = filteredTransactions.reduce((sum, t) => sum + (t.status === 'Ditolak' ? 0 : (t.zakat || 0)), 0);

    return (
        <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
            
            {/* Sidebar Navigasi */}
            <aside className="w-20 lg:w-24 bg-slate-900 flex flex-col items-center py-8 gap-10 shadow-2xl z-20 relative">
                <div className="bg-emerald-500 p-3 rounded-2xl shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                    <Store className="text-white" size={24} />
                </div>

                <nav className="flex-1 flex flex-col gap-6">
                    <button 
                        onClick={() => router.back()}
                        className="p-4 text-emerald-400 hover:text-white hover:bg-slate-800 rounded-2xl transition-all shadow-sm"
                        title="Kembali"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <button className="p-4 bg-emerald-500/20 text-emerald-400 rounded-2xl transition-all shadow-sm border border-emerald-500/30" title="Riwayat">
                        <FolderOpen size={24} />
                    </button>
                </nav>
            </aside>

            {/* Konten Utama */}
            <main className="flex-1 flex flex-col overflow-hidden relative">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#10b981 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
                
                <header className="px-8 py-8 lg:px-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 relative z-10 border-b border-slate-200/50 bg-white shadow-sm">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                                <Receipt size={12} /> Database Terpusat
                            </span>
                            <span className="text-slate-400 text-xs font-bold bg-slate-100 px-3 py-1 rounded-full">{filteredTransactions.length} Transaksi</span>
                        </div>
                        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Riwayat Pesanan</h1>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                type="text"
                                placeholder="Cari nama atau ID Transaksi..."
                                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm font-medium"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        
                        {/* Selector Bulan (Folder) */}
                        <div className="relative shrink-0">
                            <select 
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(e.target.value)}
                                className="appearance-none bg-emerald-600 text-white font-bold text-sm px-5 py-3 pr-10 rounded-xl cursor-pointer outline-none hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all"
                            >
                                {availableMonths.map(month => (
                                    <option key={month} value={month}>{formatMonthName(month)}</option>
                                ))}
                            </select>
                            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-200 pointer-events-none" size={16} />
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-8 lg:p-12 relative z-10">
                    
                    {/* Statistik Bulan Ini - Hanya untuk Owner/Admin */}
                    {isAdmin && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-6">
                                <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                                    <TrendingUp size={32} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Pendapatan ({formatMonthName(selectedMonth)})</p>
                                    <h3 className="text-3xl font-black text-slate-800 tracking-tight">Rp {totalIncome.toLocaleString()}</h3>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-6">
                                <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500">
                                    <Calculator size={32} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Alokasi Zakat 2.5%</p>
                                    <h3 className="text-3xl font-black text-slate-800 tracking-tight">Rp {totalZakat.toLocaleString()}</h3>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Tabel / Daftar Riwayat */}
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                            <h2 className="font-bold text-slate-700 text-sm flex items-center gap-2">
                                <Filter size={16} className="text-slate-400" /> Draft Laporan
                            </h2>
                        </div>
                        
                        {filteredTransactions.length === 0 ? (
                            <div className="py-20 flex flex-col items-center justify-center text-slate-400">
                                <FolderOpen size={64} className="mb-4 opacity-20" />
                                <h3 className="text-lg font-bold text-slate-600">Tidak ada riwayat</h3>
                                <p className="text-sm">Belum ada transaksi di bulan {formatMonthName(selectedMonth)}.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">
                                            <th className="p-5">ID & Waktu</th>
                                            <th className="p-5">Pelanggan</th>
                                            <th className="p-5">Pesanan</th>
                                            <th className="p-5">Petugas</th>
                                            <th className="p-5">Metode</th>
                                            <th className="p-5">Status</th>
                                            <th className="p-5 text-right">Total Transaksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {filteredTransactions.map((trx, idx) => (
                                            <tr key={idx} className="hover:bg-emerald-50/30 transition-colors group">
                                                <td className="p-5 align-top">
                                                    <div className="font-bold text-xs text-slate-700 mb-1">{trx.id}</div>
                                                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                                                        <Clock size={10} />
                                                        {new Date(trx.timestamp).toLocaleString('id-ID', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                </td>
                                                <td className="p-5 align-top">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <User size={12} className="text-slate-400" />
                                                        <span className="font-bold text-xs text-slate-800">{trx.customerName}</span>
                                                    </div>
                                                    <span className="inline-block bg-slate-100 text-slate-500 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest">
                                                        Antrian: {trx.queueNumber}
                                                    </span>
                                                </td>
                                                <td className="p-5 align-top">
                                                    <div className="space-y-1">
                                                        {trx.items && trx.items.map((item, i) => (
                                                            <div key={i} className="text-xs text-slate-600 font-medium flex gap-2">
                                                                <span className="text-slate-400 font-black">{item.quantity}x</span>
                                                                <span className="line-clamp-1">{item.name}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td className="p-5 align-top">
                                                    <div className="flex items-center gap-1.5 text-xs text-slate-700 font-bold mb-1">
                                                        <User size={12} className="text-slate-400" />
                                                        {trx.cashierName || (trx.source === 'Owner' ? 'Admin' : trx.source === 'Customer' ? 'Online' : 'Tidak Tercatat')}
                                                    </div>
                                                </td>
                                                <td className="p-5 align-top">
                                                    <span className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border
                                                        ${trx.paymentMethod.toLowerCase() === 'tunai' ? 'bg-amber-50 text-amber-600 border-amber-200' : 
                                                          'bg-emerald-50 text-emerald-600 border-emerald-200'}`}>
                                                        {trx.paymentMethod}
                                                    </span>
                                                    <div className="mt-2 text-[9px] font-bold text-slate-400 uppercase">
                                                        Source: {trx.source || '-'}
                                                    </div>
                                                </td>
                                                <td className="p-5 align-top">
                                                    <span className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border
                                                        ${trx.status === 'Ditolak' ? 'bg-red-50 text-red-600 border-red-200' : 
                                                          (!trx.status || trx.status === 'Selesai') ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                                                          'bg-blue-50 text-blue-600 border-blue-200'}`}>
                                                        {trx.status === 'Ditolak' ? 'Ditolak' : (trx.status || 'Diterima')}
                                                    </span>
                                                </td>
                                                <td className="p-5 align-top text-right">
                                                    <div className="font-black text-sm text-emerald-700">Rp {trx.totalAmount?.toLocaleString()}</div>
                                                    <div className="text-[10px] font-bold text-emerald-600/50 mt-1 uppercase tracking-wider">Inc. Zakat Rp {trx.zakat?.toLocaleString()}</div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                    
                </div>
            </main>
        </div>
    );
}
