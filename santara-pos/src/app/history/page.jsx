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
    Filter,
    Home,
    ChefHat,
    ShoppingBag,
    Package,
    Tag,
    Landmark,
    BookOpen,
    Building2
} from 'lucide-react';

export default function HistoryPage() {
    const router = useRouter();
    const [transactions, setTransactions] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [purchasePayments, setPurchasePayments] = useState([]);

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

        const payments = JSON.parse(localStorage.getItem('santaraPurchasePayments') || '[]');
        setPurchasePayments(payments);
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

    // Filter purchase payments by month
    const filteredPurchasePayments = purchasePayments.filter(p => p.date.startsWith(selectedMonth));
    const totalExpenses = filteredPurchasePayments.reduce((sum, p) => sum + p.amount, 0);
    const netProfit = totalIncome - totalExpenses;

    return (
        <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden pb-20 lg:pb-0">
            
            {/* Sidebar Navigasi */}
            <aside className="hidden lg:flex w-20 lg:w-24 bg-slate-900 flex-col items-center py-8 gap-10 shadow-2xl z-20 relative">
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
                    <button 
                        onClick={() => router.push('/penjualan')}
                        className="p-4 text-emerald-400 hover:text-white hover:bg-slate-800 rounded-2xl transition-all shadow-sm"
                        title="Penjualan"
                    >
                        <Tag size={24} />
                    </button>
                    <button 
                        onClick={() => router.push('/kas-bank')}
                        className="p-4 text-emerald-400 hover:text-white hover:bg-slate-800 rounded-2xl transition-all shadow-sm"
                        title="Kas \u0026 Bank"
                    >
                        <Landmark size={24} />
                    </button>
                    <button 
                        onClick={() => router.push('/buku-besar')}
                        className="p-4 text-emerald-400 hover:text-white hover:bg-slate-800 rounded-2xl transition-all shadow-sm"
                        title="Buku Besar"
                    >
                        <BookOpen size={24} />
                    </button>
                    <button 
                        onClick={() => router.push('/perusahaan')}
                        className="p-4 text-emerald-400 hover:text-white hover:bg-slate-800 rounded-2xl transition-all shadow-sm"
                        title="Perusahaan"
                    >
                        <Building2 size={24} />
                    </button>
                    <button 
                        onClick={() => router.push('/persediaan')}
                        className="p-4 text-emerald-400 hover:text-white hover:bg-slate-800 rounded-2xl transition-all shadow-sm"
                        title="Persediaan"
                    >
                        <Package size={24} />
                    </button>
                    <button 
                        onClick={() => router.push('/pembelian')}
                        className="p-4 text-emerald-400 hover:text-white hover:bg-slate-800 rounded-2xl transition-all shadow-sm"
                        title="Pembelian"
                    >
                        <ShoppingBag size={24} />
                    </button>
                </nav>
            </aside>

            {/* Konten Utama */}
            <main className="flex-1 flex flex-col overflow-hidden relative">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#10b981 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
                
                <header className="px-6 py-6 lg:px-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 relative z-10 border-b border-slate-200/50 bg-white shadow-sm">
                    <div className="w-full sm:w-auto">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                                <Receipt size={12} /> Database Terpusat
                            </span>
                            <span className="text-slate-400 text-xs font-bold bg-slate-100 px-3 py-1 rounded-full">{filteredTransactions.length} Transaksi</span>
                        </div>
                        <h1 className="text-2xl lg:text-3xl font-black text-slate-800 tracking-tight">Riwayat Pesanan</h1>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                type="text"
                                placeholder="Cari nama atau ID..."
                                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm font-medium"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        
                        {/* Selector Bulan (Folder) */}
                        <div className="relative w-full sm:w-auto shrink-0">
                            <select 
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(e.target.value)}
                                className="w-full appearance-none bg-emerald-600 text-white font-bold text-sm px-5 py-3 pr-10 rounded-xl cursor-pointer outline-none hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all"
                            >
                                {availableMonths.map(month => (
                                    <option key={month} value={month}>{formatMonthName(month)}</option>
                                ))}
                            </select>
                            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-200 pointer-events-none" size={16} />
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-6 lg:p-12 relative z-10">
                    
                    {/* Statistik Bulan Ini - Hanya untuk Owner/Admin */}
                    {isAdmin && (
                        <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-8 lg:mb-10">
                            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4 lg:gap-6">
                                <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                                    <TrendingUp size={24} className="lg:hidden" />
                                    <TrendingUp size={32} className="hidden lg:block" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Total Omset</p>
                                    <h3 className="text-xl lg:text-3xl font-black text-slate-800 tracking-tight">Rp {totalIncome.toLocaleString()}</h3>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4 lg:gap-6">
                                <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-2xl bg-red-50 flex items-center justify-center text-red-500">
                                    <ShoppingBag size={24} className="lg:hidden" />
                                    <ShoppingBag size={32} className="hidden lg:block" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Total Belanja (Expense)</p>
                                    <h3 className="text-xl lg:text-3xl font-black text-red-600 tracking-tight">Rp {totalExpenses.toLocaleString()}</h3>
                                </div>
                            </div>

                            <div className="bg-emerald-600 p-6 rounded-3xl shadow-xl shadow-emerald-900/10 flex items-center gap-4 lg:gap-6 text-white md:col-span-2 lg:col-span-1">
                                <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-2xl bg-white/20 flex items-center justify-center text-white">
                                    <Calculator size={24} className="lg:hidden" />
                                    <Calculator size={32} className="hidden lg:block" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-emerald-200 uppercase tracking-wider mb-1">Laba Bersih (Estimasi)</p>
                                    <h3 className="text-xl lg:text-3xl font-black tracking-tight">Rp {netProfit.toLocaleString()}</h3>
                                </div>
                            </div>
                        </div>

                        </>
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
                            <>
                                {/* Mobile View: Card List */}
                                <div className="lg:hidden divide-y divide-slate-100">
                                    {filteredTransactions.map((trx, idx) => (
                                        <div key={idx} className="p-5 space-y-4 hover:bg-emerald-50/30 transition-colors">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <div className="font-black text-xs text-slate-800 mb-1">{trx.id}</div>
                                                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                                                        <Clock size={10} />
                                                        {new Date(trx.timestamp).toLocaleString('id-ID', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                </div>
                                                <span className={`inline-flex items-center px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-widest border
                                                    ${trx.status === 'Ditolak' ? 'bg-red-50 text-red-600 border-red-200' : 
                                                      (!trx.status || trx.status === 'Selesai') ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                                                      'bg-blue-50 text-blue-600 border-blue-200'}`}>
                                                    {trx.status === 'Ditolak' ? 'Ditolak' : (trx.status || 'Diterima')}
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                                                        <User size={14} />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-black text-slate-800 leading-none mb-1">{trx.customerName}</p>
                                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Antrian {trx.queueNumber}</p>
                                                    </div>
                                                </div>
                                                    <p className="text-sm font-black text-emerald-700 leading-none mb-1">Rp {trx.totalAmount?.toLocaleString()}</p>
                                                </div>

                                                <div className="bg-slate-50 p-3 rounded-xl space-y-1.5">
                                                {trx.items && trx.items.map((item, i) => (
                                                    <div key={i} className="text-[10px] text-slate-600 font-bold flex justify-between">
                                                        <span>{item.quantity}x {item.name}</span>
                                                        <span className="text-slate-400 italic">Rp {(item.price * item.quantity).toLocaleString()}</span>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="flex justify-between items-center pt-1">
                                                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase">
                                                    <User size={10} /> {trx.cashierName || 'Online'}
                                                </div>
                                                <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border
                                                    ${trx.paymentMethod.toLowerCase() === 'tunai' ? 'bg-amber-50 text-amber-600 border-amber-200' : 
                                                      'bg-emerald-50 text-emerald-600 border-emerald-200'}`}>
                                                    {trx.paymentMethod}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Desktop View: Table */}
                                <div className="hidden lg:block overflow-x-auto">
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
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Mobile Bottom Navigation */}
                <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-6 py-4 flex justify-around items-center z-50">
                    <button onClick={() => router.push('/homepage')} className="flex flex-col items-center gap-1 text-slate-400">
                        <Home size={20} />
                        <span className="text-[10px] font-bold uppercase">Home</span>
                    </button>
                    <button onClick={() => router.push(isAdmin ? '/posin-adm' : '/posin-cas')} className="flex flex-col items-center gap-1 text-slate-400">
                        <ShoppingBag size={20} />
                        <span className="text-[10px] font-bold uppercase">POS</span>
                    </button>
                    <button className="flex flex-col items-center gap-1 text-emerald-600">
                        <FolderOpen size={20} />
                        <span className="text-[10px] font-bold uppercase">Riwayat</span>
                    </button>
                    <button onClick={() => router.push('/pembelian')} className="flex flex-col items-center gap-1 text-slate-400">
                        <ShoppingBag size={20} />
                        <span className="text-[10px] font-bold uppercase">Beli</span>
                    </button>
                    <button onClick={() => router.push('/waiting-list')} className="flex flex-col items-center gap-1 text-slate-400">
                        <ChefHat size={20} />
                        <span className="text-[10px] font-bold uppercase">Antrean</span>
                    </button>
                </nav>
            </main>
        </div>
    );
}
