"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    LayoutDashboard,
    ShoppingBag,
    ChefHat,
    Package,
    TrendingUp,
    Settings,
    LogOut,
    Search,
    Landmark,
    Wallet,
    CreditCard,
    ArrowDownLeft,
    ArrowUpRight,
    RefreshCw,
    Plus,
    X,
    Filter,
    Calendar,
    ArrowRight,
    Edit3,
    Trash2,
    CheckCircle2,
    AlertCircle,
    ArrowLeft,
    History,
    Tag,
    BookOpen,
    Building2
} from 'lucide-react';

const INITIAL_ACCOUNTS = [
    { id: 1, name: 'Kas Utama (Toko)', balance: 0, icon: <Wallet size={20} /> },
    { id: 2, name: 'Bank BCA', balance: 0, icon: <Landmark size={20} /> },
    { id: 3, name: 'Bank Mandiri', balance: 0, icon: <Landmark size={20} /> }
];

const PAYMENT_CATEGORIES = [
    'Biaya Listrik \u0026 Air',
    'Biaya Sewa Tempat',
    'Gaji Karyawan',
    'Biaya Internet \u0026 Telp',
    'Biaya Kebersihan',
    'Biaya Marketing',
    'Biaya Lain-lain'
];

const RECEIPT_CATEGORIES = [
    'Modal Pemilik',
    'Refund Pembelian',
    'Pendapatan Jasa',
    'Hibah / Pemberian',
    'Pendapatan Lain-lain'
];

export default function KasBankPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('ringkasan'); // ringkasan, penerimaan, pembayaran, transfer, riwayat
    const [accounts, setAccounts] = useState(INITIAL_ACCOUNTS);
    const [transactions, setTransactions] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Modal & Form states
    const [isPenerimaanModalOpen, setIsPenerimaanModalOpen] = useState(false);
    const [isPembayaranModalOpen, setIsPembayaranModalOpen] = useState(false);
    const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);

    const [newTransaction, setNewTransaction] = useState({
        amount: '',
        accountId: '',
        category: '',
        note: '',
        date: new Date().toISOString().split('T')[0]
    });

    const [transferData, setTransferData] = useState({
        fromAccountId: '',
        toAccountId: '',
        amount: '',
        note: '',
        date: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        const storedAccounts = localStorage.getItem('santaraAccounts');
        if (storedAccounts) {
            setAccounts(JSON.parse(storedAccounts));
        } else {
            localStorage.setItem('santaraAccounts', JSON.stringify(INITIAL_ACCOUNTS));
        }

        const storedTransactions = localStorage.getItem('santaraKasTransactions');
        if (storedTransactions) setTransactions(JSON.parse(storedTransactions));
    }, []);

    const saveAccounts = (data) => {
        setAccounts(data);
        localStorage.setItem('santaraAccounts', JSON.stringify(data));
    };

    const saveTransactions = (data) => {
        setTransactions(data);
        localStorage.setItem('santaraKasTransactions', JSON.stringify(data));
    };

    const handleAddReceipt = (e) => {
        e.preventDefault();
        const amountNum = parseFloat(newTransaction.amount);
        const account = accounts.find(a => a.id === parseInt(newTransaction.accountId));
        
        if (!account) return alert('Pilih akun kas/bank!');

        const trx = {
            id: 'KIN-' + Date.now(),
            type: 'Penerimaan',
            ...newTransaction,
            amount: amountNum,
            accountName: account.name,
            timestamp: new Date().toISOString()
        };

        const updatedAccounts = accounts.map(a => 
            a.id === account.id ? { ...a, balance: a.balance + amountNum } : a
        );
        
        saveAccounts(updatedAccounts);
        saveTransactions([trx, ...transactions]);
        
        setIsPenerimaanModalOpen(false);
        setNewTransaction({ amount: '', accountId: '', category: '', note: '', date: new Date().toISOString().split('T')[0] });
    };

    const handleAddPayment = (e) => {
        e.preventDefault();
        const amountNum = parseFloat(newTransaction.amount);
        const account = accounts.find(a => a.id === parseInt(newTransaction.accountId));
        
        if (!account) return alert('Pilih akun kas/bank!');
        if (account.balance < amountNum) return alert('Saldo tidak mencukupi!');

        const trx = {
            id: 'KOUT-' + Date.now(),
            type: 'Pembayaran',
            ...newTransaction,
            amount: amountNum,
            accountName: account.name,
            timestamp: new Date().toISOString()
        };

        const updatedAccounts = accounts.map(a => 
            a.id === account.id ? { ...a, balance: a.balance - amountNum } : a
        );
        
        saveAccounts(updatedAccounts);
        saveTransactions([trx, ...transactions]);
        
        setIsPembayaranModalOpen(false);
        setNewTransaction({ amount: '', accountId: '', category: '', note: '', date: new Date().toISOString().split('T')[0] });
    };

    const handleTransfer = (e) => {
        e.preventDefault();
        const amountNum = parseFloat(transferData.amount);
        const fromAccount = accounts.find(a => a.id === parseInt(transferData.fromAccountId));
        const toAccount = accounts.find(a => a.id === parseInt(transferData.toAccountId));

        if (!fromAccount || !toAccount) return alert('Pilih akun asal dan tujuan!');
        if (fromAccount.id === toAccount.id) return alert('Akun asal dan tujuan tidak boleh sama!');
        if (fromAccount.balance < amountNum) return alert('Saldo asal tidak mencukupi!');

        const trx = {
            id: 'KTRF-' + Date.now(),
            type: 'Transfer',
            amount: amountNum,
            fromAccountName: fromAccount.name,
            toAccountName: toAccount.name,
            note: transferData.note,
            date: transferData.date,
            timestamp: new Date().toISOString()
        };

        const updatedAccounts = accounts.map(a => {
            if (a.id === fromAccount.id) return { ...a, balance: a.balance - amountNum };
            if (a.id === toAccount.id) return { ...a, balance: a.balance + amountNum };
            return a;
        });

        saveAccounts(updatedAccounts);
        saveTransactions([trx, ...transactions]);
        
        setIsTransferModalOpen(false);
        setTransferData({ fromAccountId: '', toAccountId: '', amount: '', note: '', date: new Date().toISOString().split('T')[0] });
    };

    const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0);

    return (
        <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden pb-20 lg:pb-0">
            {/* Sidebar */}
            <aside className="hidden lg:flex w-64 bg-emerald-900 text-white flex-col shadow-2xl z-40">
                <div className="p-6 flex items-center gap-3 border-b border-emerald-800">
                    <button onClick={() => router.push('/homepage')} className="bg-white p-1.5 rounded-lg flex items-center justify-center hover:scale-110 transition-transform cursor-pointer">
                        <img src="/santara-logo.png" alt="Santara" className="w-6 h-6 object-contain" />
                    </button>
                    <span className="font-black tracking-tighter text-xl italic uppercase">SANTARA OPS</span>
                </div>
                
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {[
                        { id: 'pos', label: 'POS Kasir', icon: <ShoppingBag size={20} />, action: () => router.push('/posin-adm') },
                        { id: 'penjualan', label: 'Penjualan', icon: <Tag size={20} />, action: () => router.push('/penjualan') },
                        { id: 'kas-bank', label: 'Kas \u0026 Bank', icon: <Landmark size={20} />, action: () => router.push('/kas-bank') },
                        { id: 'buku-besar', label: 'Buku Besar', icon: <BookOpen size={20} />, action: () => router.push('/buku-besar') },
                        { id: 'perusahaan', label: 'Perusahaan', icon: <Building2 size={20} />, action: () => router.push('/perusahaan') },
                        { id: 'persediaan', label: 'Persediaan', icon: <Package size={20} />, action: () => router.push('/persediaan') },
                        { id: 'pembelian', label: 'Pembelian', icon: <ShoppingBag size={20} />, action: () => router.push('/pembelian') },
                        { id: 'laporan', label: 'Riwayat', icon: <History size={20} />, action: () => router.push('/history?role=admin') },
                    ].map((item) => (
                        <button 
                            key={item.id}
                            onClick={item.action}
                            className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all ${item.active ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/20' : 'text-emerald-300 hover:bg-emerald-800 hover:text-white'}`}
                        >
                            {item.icon}
                            <span className="font-bold text-sm tracking-tight">{item.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-emerald-800">
                    <button onClick={() => window.location.href = '/login'} className="w-full flex items-center gap-4 p-3 rounded-xl text-red-300 hover:bg-red-500/10 hover:text-red-400 transition-all">
                        <LogOut size={20} />
                        <span className="font-bold text-sm">Keluar</span>
                    </button>
                </div>
            </aside>

            {/* Main Area */}
            <main className="flex-1 flex flex-col overflow-hidden relative">
                <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#10b981 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

                <header className="bg-white border-b border-slate-200 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 z-10 shadow-sm">
                    <div>
                        <h2 className="text-xl lg:text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                            <Landmark size={28} className="text-emerald-600" />
                            Kas \u0026 Bank
                        </h2>
                        <p className="text-slate-400 text-xs font-medium mt-1">Monitoring saldo, penerimaan, dan pembayaran operasional.</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="bg-emerald-50 px-6 py-3 rounded-2xl border border-emerald-100 hidden md:block">
                            <p className="text-[10px] font-black uppercase text-emerald-600 tracking-widest mb-1">Total Saldo (All Accounts)</p>
                            <h4 className="text-xl font-black text-slate-800">Rp {totalBalance.toLocaleString()}</h4>
                        </div>
                    </div>
                </header>

                <div className="bg-white border-b border-slate-100 flex overflow-x-auto scrollbar-hide z-10">
                    {[
                        { id: 'ringkasan', label: 'Ringkasan Saldo', icon: <LayoutDashboard size={16} /> },
                        { id: 'riwayat', label: 'Buku Kas (Ledger)', icon: <History size={16} /> },
                    ].map(tab => (
                        <button 
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-8 py-4 text-xs font-black uppercase tracking-widest transition-all border-b-2 whitespace-nowrap flex items-center gap-2 ${activeTab === tab.id ? 'border-emerald-600 text-emerald-600 bg-emerald-50/30' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                        >
                            {tab.icon} {tab.label}
                        </button>
                    ))}
                </div>

                <div className="flex-1 overflow-y-auto p-6 lg:p-10 relative z-10">
                    {activeTab === 'ringkasan' && (
                        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {accounts.map(acc => (
                                    <div key={acc.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
                                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-50 rounded-full blur-3xl group-hover:bg-emerald-100 transition-all opacity-50"></div>
                                        <div className="relative z-10">
                                            <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 mb-6 group-hover:scale-110 transition-transform shadow-inner">
                                                {acc.id === 1 ? <Wallet size={28} /> : <Landmark size={28} />}
                                            </div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{acc.name}</p>
                                            <h3 className="text-2xl font-black text-slate-800 tracking-tight mb-6">Rp {acc.balance.toLocaleString()}</h3>
                                            
                                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                                                <button onClick={() => { setIsPenerimaanModalOpen(true); setNewTransaction({...newTransaction, accountId: acc.id.toString()}) }} className="flex-1 py-2 rounded-lg bg-emerald-600 text-white text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-200 hover:bg-emerald-700">
                                                    <ArrowDownLeft size={12} /> Terima
                                                </button>
                                                <button onClick={() => { setIsPembayaranModalOpen(true); setNewTransaction({...newTransaction, accountId: acc.id.toString()}) }} className="flex-1 py-2 rounded-lg bg-red-600 text-white text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5 shadow-lg shadow-red-200 hover:bg-red-700">
                                                    <ArrowUpRight size={12} /> Bayar
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex flex-col md:flex-row gap-6">
                                <button onClick={() => setIsPenerimaanModalOpen(true)} className="flex-1 p-10 rounded-[3rem] bg-white border border-slate-100 shadow-sm hover:border-emerald-500 transition-all group text-center relative overflow-hidden">
                                    <div className="absolute inset-x-0 bottom-0 h-1.5 bg-emerald-500 transform translate-y-full group-hover:translate-y-0 transition-transform"></div>
                                    <div className="w-16 h-16 bg-emerald-100 rounded-3xl flex items-center justify-center text-emerald-600 mx-auto mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                                        <ArrowDownLeft size={32} />
                                    </div>
                                    <h4 className="text-xl font-black text-slate-800 tracking-tight mb-2">Penerimaan Kas</h4>
                                    <p className="text-slate-400 text-xs font-medium">Tambah saldo dari modal, hibah, atau refund.</p>
                                </button>

                                <button onClick={() => setIsPembayaranModalOpen(true)} className="flex-1 p-10 rounded-[3rem] bg-white border border-slate-100 shadow-sm hover:border-red-500 transition-all group text-center relative overflow-hidden">
                                     <div className="absolute inset-x-0 bottom-0 h-1.5 bg-red-500 transform translate-y-full group-hover:translate-y-0 transition-transform"></div>
                                    <div className="w-16 h-16 bg-red-100 rounded-3xl flex items-center justify-center text-red-600 mx-auto mb-6 group-hover:bg-red-600 group-hover:text-white transition-all">
                                        <ArrowUpRight size={32} />
                                    </div>
                                    <h4 className="text-xl font-black text-slate-800 tracking-tight mb-2">Pembayaran Kas</h4>
                                    <p className="text-slate-400 text-xs font-medium">Catat pengeluaran seperti sewa, gaji, atau listrik.</p>
                                </button>

                                <button onClick={() => setIsTransferModalOpen(true)} className="flex-1 p-10 rounded-[3rem] bg-white border border-slate-100 shadow-sm hover:border-blue-500 transition-all group text-center relative overflow-hidden">
                                     <div className="absolute inset-x-0 bottom-0 h-1.5 bg-blue-500 transform translate-y-full group-hover:translate-y-0 transition-transform"></div>
                                    <div className="w-16 h-16 bg-blue-100 rounded-3xl flex items-center justify-center text-blue-600 mx-auto mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                        <RefreshCw size={32} />
                                    </div>
                                    <h4 className="text-xl font-black text-slate-800 tracking-tight mb-2">Transfer Antar Bank</h4>
                                    <p className="text-slate-400 text-xs font-medium">Pindahkan saldo antar akun kas dan bank.</p>
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'riwayat' && (
                        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
                             <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                                <div className="px-6 py-4 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                                    <h3 className="font-black text-slate-800 uppercase text-sm tracking-widest flex items-center gap-2">
                                        <History size={16} className="text-emerald-500" /> Buku Besar Kas \u0026 Bank
                                    </h3>
                                    <div className="flex gap-2">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                                            <input type="text" placeholder="Cari catatan..." className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-emerald-500" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                                        </div>
                                    </div>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                                <th className="px-8 py-5">Tanggal</th>
                                                <th className="px-8 py-5">Tipe</th>
                                                <th className="px-8 py-5">Deskripsi</th>
                                                <th className="px-8 py-5">Akun</th>
                                                <th className="px-8 py-5 text-right">Jumlah</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50">
                                            {transactions.filter(t => t.note.toLowerCase().includes(searchTerm.toLowerCase())).map(trx => (
                                                <tr key={trx.id} className="hover:bg-slate-50 transition-colors group">
                                                    <td className="px-8 py-5 text-xs text-slate-500 font-medium whitespace-nowrap">
                                                        {new Date(trx.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                    </td>
                                                    <td className="px-8 py-5">
                                                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest inline-flex items-center gap-1 border ${
                                                            trx.type === 'Penerimaan' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                                                            trx.type === 'Pembayaran' ? 'bg-red-50 text-red-600 border-red-100' : 
                                                            'bg-blue-50 text-blue-600 border-blue-100'
                                                        }`}>
                                                            {trx.type === 'Penerimaan' && <ArrowDownLeft size={10} />}
                                                            {trx.type === 'Pembayaran' && <ArrowUpRight size={10} />}
                                                            {trx.type === 'Transfer' && <RefreshCw size={10} />}
                                                            {trx.type}
                                                        </span>
                                                    </td>
                                                    <td className="px-8 py-5">
                                                       <p className="text-xs font-bold text-slate-800">{trx.category || 'Transfer Saldo'}</p>
                                                       <p className="text-[10px] text-slate-400 font-medium italic mt-0.5 line-clamp-1">{trx.note}</p>
                                                    </td>
                                                    <td className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-tighter">
                                                        {trx.type === 'Transfer' ? `${trx.fromAccountName} → ${trx.toAccountName}` : trx.accountName}
                                                    </td>
                                                    <td className="px-8 py-5 text-right font-black text-sm">
                                                        <span className={trx.type === 'Penerimaan' ? 'text-emerald-600' : trx.type === 'Pembayaran' ? 'text-red-500' : 'text-blue-600'}>
                                                            {trx.type === 'Pembayaran' ? '-' : '+'} Rp {trx.amount.toLocaleString()}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                            {transactions.length === 0 && (
                                                <tr>
                                                    <td colSpan="5" className="py-20 text-center text-slate-300 italic">
                                                        <Landmark size={48} className="mx-auto mb-4 opacity-5" />
                                                        <p className="text-[10px] font-black uppercase tracking-[0.2em]">Data keuangan masih kosong</p>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                             </div>
                        </div>
                    )}
                </div>

                {/* Mobile Bottom Navigation */}
                <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-6 py-4 flex justify-around items-center z-50">
                    <button onClick={() => router.push('/posin-adm')} className="flex flex-col items-center gap-1 text-slate-400">
                        <LayoutDashboard size={20} />
                        <span className="text-[10px] font-bold uppercase">POS</span>
                    </button>
                    <button className="flex flex-col items-center gap-1 text-emerald-600">
                        <Landmark size={20} />
                        <span className="text-[10px] font-bold uppercaseTracking-tight">Kas</span>
                    </button>
                    <button onClick={() => router.push('/penjualan')} className="flex flex-col items-center gap-1 text-slate-400">
                        <Tag size={20} />
                        <span className="text-[10px] font-bold uppercase">Jual</span>
                    </button>
                    <button onClick={() => router.push('/pembelian')} className="flex flex-col items-center gap-1 text-slate-400">
                        <ShoppingBag size={20} />
                        <span className="text-[10px] font-bold uppercase">Beli</span>
                    </button>
                </nav>
            </main>

            {/* Modal Penerimaan */}
            {isPenerimaanModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[60] flex items-center justify-center p-4">
                    <div className="bg-white rounded-[3rem] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-8 border-b border-slate-50 bg-emerald-50/50 flex justify-between items-center text-emerald-700">
                            <div>
                                <h3 className="text-2xl font-black tracking-tight flex items-center gap-2 italic uppercase"><Plus size={24} /> Penerimaan Kas</h3>
                                <p className="text-[10px] font-bold uppercase tracking-widest mt-1 opacity-60 italic">Record cash/bank inflow</p>
                            </div>
                            <button onClick={() => setIsPenerimaanModalOpen(false)} className="p-3 hover:bg-white rounded-full transition-all shadow-sm"><X size={24} /></button>
                        </div>
                        
                        <form onSubmit={handleAddReceipt} className="p-10 space-y-6">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Metode Akun Kas \u0026 Bank</label>
                                <select required className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 font-bold" value={newTransaction.accountId} onChange={e => setNewTransaction({...newTransaction, accountId: e.target.value})}>
                                    <option value="">Pilih Akun...</option>
                                    {accounts.map(a => <option key={a.id} value={a.id}>{a.name} (Saldo: Rp {a.balance.toLocaleString()})</option>)}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Kategori</label>
                                    <select required className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 font-bold" value={newTransaction.category} onChange={e => setNewTransaction({...newTransaction, category: e.target.value})}>
                                        <option value="">Kategori...</option>
                                        {RECEIPT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Tanggal</label>
                                    <input type="date" required className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 font-bold" value={newTransaction.date} onChange={e => setNewTransaction({...newTransaction, date: e.target.value})} />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Jumlah Penerimaan (IDR)</label>
                                <div className="relative">
                                    <div className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-emerald-600">Rp</div>
                                    <input type="number" required placeholder="0" className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 font-black text-lg" value={newTransaction.amount} onChange={e => setNewTransaction({...newTransaction, amount: e.target.value})} />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Deksripsi / Catatan Tambahan</label>
                                <textarea placeholder="Catatan transaksi..." className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 font-bold resize-none h-24" value={newTransaction.note} onChange={e => setNewTransaction({...newTransaction, note: e.target.value})}></textarea>
                            </div>
                            <button type="submit" className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-emerald-200 active:scale-95 transition-all">Simpan Transaksi Penerimaan</button>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Pembayaran */}
            {isPembayaranModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[60] flex items-center justify-center p-4">
                    <div className="bg-white rounded-[3rem] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-8 border-b border-slate-50 bg-red-50/50 flex justify-between items-center text-red-700">
                            <div>
                                <h3 className="text-2xl font-black tracking-tight flex items-center gap-2 italic uppercase"><Plus size={24} /> Pembayaran Kas</h3>
                                <p className="text-[10px] font-bold uppercase tracking-widest mt-1 opacity-60 italic">Record cash/bank outflow</p>
                            </div>
                            <button onClick={() => setIsPembayaranModalOpen(false)} className="p-3 hover:bg-white rounded-full transition-all shadow-sm"><X size={24} /></button>
                        </div>
                        
                        <form onSubmit={handleAddPayment} className="p-10 space-y-6">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Sumber Akun Kas \u0026 Bank</label>
                                <select required className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 font-bold" value={newTransaction.accountId} onChange={e => setNewTransaction({...newTransaction, accountId: e.target.value})}>
                                    <option value="">Pilih Akun...</option>
                                    {accounts.map(a => <option key={a.id} value={a.id}>{a.name} (Saldo: Rp {a.balance.toLocaleString()})</option>)}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Kategori Biaya</label>
                                    <select required className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 font-bold" value={newTransaction.category} onChange={e => setNewTransaction({...newTransaction, category: e.target.value})}>
                                        <option value="">Biaya...</option>
                                        {PAYMENT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Tanggal</label>
                                    <input type="date" required className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 font-bold" value={newTransaction.date} onChange={e => setNewTransaction({...newTransaction, date: e.target.value})} />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Jumlah Yang Dibayar (IDR)</label>
                                <div className="relative">
                                    <div className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-red-600">Rp</div>
                                    <input type="number" required placeholder="0" className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 font-black text-lg" value={newTransaction.amount} onChange={e => setNewTransaction({...newTransaction, amount: e.target.value})} />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Deksripsi / Peruntukan Biaya</label>
                                <textarea placeholder="Contoh: Bayar tagihan PLN bulan April" className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 font-bold resize-none h-24" value={newTransaction.note} onChange={e => setNewTransaction({...newTransaction, note: e.target.value})}></textarea>
                            </div>
                            <button type="submit" className="w-full py-5 bg-red-600 hover:bg-red-500 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-red-200 active:scale-95 transition-all">Konfirmasi \u0026 Catat Pembayaran</button>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Transfer */}
            {isTransferModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[60] flex items-center justify-center p-4">
                    <div className="bg-white rounded-[3rem] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-8 border-b border-slate-50 bg-blue-50/50 flex justify-between items-center text-blue-700">
                            <div>
                                <h3 className="text-2xl font-black tracking-tight flex items-center gap-2 italic uppercase"><RefreshCw size={24} /> Transfer Bank</h3>
                                <p className="text-[10px] font-bold uppercase tracking-widest mt-1 opacity-60 italic">Fund movement between accounts</p>
                            </div>
                            <button onClick={() => setIsTransferModalOpen(false)} className="p-3 hover:bg-white rounded-full transition-all shadow-sm"><X size={24} /></button>
                        </div>
                        
                        <form onSubmit={handleTransfer} className="p-10 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Dari Akun Asal</label>
                                    <select required className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 font-bold" value={transferData.fromAccountId} onChange={e => setTransferData({...transferData, fromAccountId: e.target.value})}>
                                        <option value="">Pilih Asal...</option>
                                        {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Ke Akun Tujuan</label>
                                    <select required className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 font-bold" value={transferData.toAccountId} onChange={e => setTransferData({...transferData, toAccountId: e.target.value})}>
                                        <option value="">Pilih Tujuan...</option>
                                        {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Jumlah Transfer</label>
                                    <input type="number" required placeholder="0" className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 font-black text-lg" value={transferData.amount} onChange={e => setTransferData({...transferData, amount: e.target.value})} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Tanggal</label>
                                    <input type="date" required className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 font-bold" value={transferData.date} onChange={e => setTransferData({...transferData, date: e.target.value})} />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Catatan Transfer</label>
                                <textarea placeholder="Kenapa saldo dipindahkan?" className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 font-bold resize-none h-24" value={transferData.note} onChange={e => setTransferData({...transferData, note: e.target.value})}></textarea>
                            </div>
                            <button type="submit" className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-blue-200 active:scale-95 transition-all">Proses Transfer Saldo</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
