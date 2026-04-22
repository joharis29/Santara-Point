"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { generateReceiptPDF } from '@/lib/receiptPdf';
import {
    ArrowLeft,
    Calendar,
    Search,
    TrendingUp,
    Receipt,
    Calculator,
    Clock,
    User,
    Building2,
    Store,
    Menu,
    X,
    Filter,
    ShoppingBag,
    FolderOpen
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import AdminHeader from '@/components/AdminHeader';
import AdminSidebar from '@/components/AdminSidebar';
import CashierHeader from '@/components/CashierHeader';
import CashierSidebar from '@/components/CashierSidebar';
import SettingsModal from '@/components/SettingsModal';

function HistoryContent() {
    const router = useRouter();
    const [transactions, setTransactions] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const searchParams = useSearchParams();
    const [purchasePayments, setPurchasePayments] = useState([]);

    // --- State Standarisasi ---
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [activeSettingsTab, setActiveSettingsTab] = useState('profil');
    const [storeSettings, setStoreSettings] = useState({
        storeName: 'Santara Point',
        storeTagline: 'Hidangan Lezat, Penuh Keberkahan.',
        isPajakActive: true,
        authorizedUsers: []
    });
    const [userProfile, setUserProfile] = useState({
        firstName: '',
        lastName: '',
        email: '',
        whatsapp: '',
        password: '••••••••',
        addresses: []
    });
    const [newUserContact, setNewUserContact] = useState('');
    const [newUserRole, setNewUserRole] = useState('Operator');

    // --- State Perubahan Modals ---
    const [isChangeEmailOpen, setIsChangeEmailOpen] = useState(false);
    const [isChangeWhatsappOpen, setIsChangeWhatsappOpen] = useState(false);
    const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

    useEffect(() => {
        if (searchParams) {
            setIsAdmin(searchParams.get('role') === 'admin');
        }

        const loadTransactions = async () => {
            try {
                // Priority 1: Supabase
                const { data, error } = await supabase
                    .from('transactions')
                    .select('*')
                    .order('timestamp', { ascending: false });

                if (error) throw error;

                if (data && data.length > 0) {
                    const mapped = data.map(trx => ({
                        id: trx.id,
                        timestamp: trx.timestamp,
                        customerName: trx.customer_name,
                        queueNumber: trx.queue_number,
                        orderType: trx.order_type,
                        keterangan: trx.keterangan,
                        paymentMethod: trx.payment_method,
                        source: trx.source,
                        cashierName: trx.cashier_name,
                        totalAmount: trx.total_amount,
                        pajak: trx.pajak,
                        status: trx.status,
                        items: trx.items
                    }));
                    setTransactions(mapped);
                    
                    // Setup initial month
                    const months = Array.from(new Set(mapped.map(t => new Date(t.timestamp).toISOString().slice(0, 7))));
                    months.sort().reverse();
                    setSelectedMonth(months[0]);
                } else {
                    // Fallback to LocalStorage
                    const history = JSON.parse(localStorage.getItem('santaraTransactionHistory') || '[]');
                    history.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
                    setTransactions(history);
                    if (history.length > 0) {
                        const months = Array.from(new Set(history.map(t => {
                            try {
                                const d = new Date(t.timestamp);
                                return isNaN(d.getTime()) ? null : d.toISOString().slice(0, 7);
                            } catch (e) { return null; }
                        }).filter(m => m !== null)));
                        months.sort().reverse();
                        setSelectedMonth(months[0] || new Date().toISOString().slice(0, 7));
                    }
                }
            } catch (err) {
                console.error("Error loading global history:", err);
                const history = JSON.parse(localStorage.getItem('santaraTransactionHistory') || '[]');
                setTransactions(history);
            }
        };

        loadTransactions();
        
        // Auto-refresh every 30 seconds for history
        const pollInterval = setInterval(loadTransactions, 30000);

        const payments = JSON.parse(localStorage.getItem('santaraPurchasePayments') || '[]');
        setPurchasePayments(payments);

        const storedSettings = localStorage.getItem('santaraStoreSettings');
        if (storedSettings) setStoreSettings(JSON.parse(storedSettings));

        const fetchUserProfile = async () => {
            const { data } = await supabase.auth.getUser();
            const user = data?.user;
            if (user) {
                const meta = user.user_metadata || {};
                setUserProfile({
                    firstName: meta.first_name || '',
                    lastName: meta.last_name || '',
                    email: user.email || '',
                    whatsapp: meta.whatsapp || '',
                    password: '••••••••',
                    addresses: meta.addresses || []
                });
            }
        };
        fetchUserProfile();

        return () => clearInterval(pollInterval);
    }, []);

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        try {
            const { error } = await supabase.auth.updateUser({
                data: {
                    first_name: userProfile.firstName,
                    last_name: userProfile.lastName
                }
            });
            if (error) throw error;
            alert('Profil berhasil diperbarui!');
        } catch (err) {
            alert(err.message);
        }
    };

    const addAddress = () => {
        const newAddr = { id: Date.now(), label: '', details: '' };
        setUserProfile({ ...userProfile, addresses: [...userProfile.addresses, newAddr] });
    };

    const removeAddress = (id) => {
        setUserProfile({ ...userProfile, addresses: userProfile.addresses.filter(a => a.id !== id) });
    };

    const updateAddress = (id, field, value) => {
        setUserProfile({
            ...userProfile,
            addresses: userProfile.addresses.map(a => a.id === id ? { ...a, [field]: value } : a)
        });
    };

    // Get unique months from transactions for the 'folder' dropdown
    const availableMonths = Array.from(new Set([
        ...transactions.map(t => {
            try {
                const d = new Date(t.timestamp);
                return isNaN(d.getTime()) ? null : d.toISOString().slice(0, 7);
            } catch (e) { return null; }
        }).filter(m => m !== null),
        selectedMonth
    ])).sort().reverse();

    const formatMonthName = (YYYYMM) => {
        if (!YYYYMM) return 'Bulan Tidak Diketahui';
        const [year, month] = YYYYMM.split('-');
        const date = new Date(year, parseInt(month) - 1, 1);
        return date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
    };

    const filteredTransactions = transactions.filter(t => {
        const isCurrentMonth = t.timestamp && t.timestamp.startsWith(selectedMonth);
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
        <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden relative">
            {/* Sidebar Standardized */}
            {isAdmin ? (
                <AdminSidebar 
                    isOpen={isSidebarOpen} 
                    setIsOpen={setIsSidebarOpen} 
                    onOpenSettings={() => {
                        setActiveSettingsTab('info-toko');
                        setIsSettingsOpen(true);
                    }} 
                />
            ) : (
                <CashierSidebar 
                    isOpen={isSidebarOpen} 
                    setIsOpen={setIsSidebarOpen} 
                    onOpenSettings={() => {
                        setActiveSettingsTab('profil');
                        setIsSettingsOpen(true);
                    }} 
                />
            )}

            <main className="flex-1 flex flex-col overflow-hidden relative">
                {/* Header Standardized */}
                {isAdmin ? (
                    <AdminHeader 
                        title="Riwayat Akuntansi"
                        subtitle="Monitoring Transaksi Penjualan & Pembelian Masa Lalu"
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        onMenuClick={() => setIsSidebarOpen(true)}
                    />
                ) : (
                    <CashierHeader 
                        title="Riwayat Pesanan"
                        subtitle="Daftar Transaksi Yang Telah Selesai"
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        onSettingsClick={() => {
                            setActiveSettingsTab('profil');
                            setIsSettingsOpen(true);
                        }}
                        onMenuClick={() => setIsSidebarOpen(true)}
                    />
                )}

                <div className="flex-1 overflow-y-auto p-6 lg:p-12 relative z-10">
                    
                    {/* Statistik Bulan Ini - Hanya untuk Owner/Admin */}
                    {isAdmin && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-8 lg:mb-10">
                            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4 lg:gap-6">
                                <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                                    <TrendingUp size={32} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Total Omset</p>
                                    <h3 className="text-xl lg:text-3xl font-black text-slate-800 tracking-tight">Rp {totalIncome.toLocaleString()}</h3>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4 lg:gap-6">
                                <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-2xl bg-red-50 flex items-center justify-center text-red-500">
                                    <ShoppingBag size={32} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Total Belanja (Expense)</p>
                                    <h3 className="text-xl lg:text-3xl font-black text-red-600 tracking-tight">Rp {totalExpenses.toLocaleString()}</h3>
                                </div>
                            </div>

                            <div className="bg-emerald-600 p-6 rounded-3xl shadow-xl shadow-emerald-900/10 flex items-center gap-4 lg:gap-6 text-white md:col-span-2 lg:col-span-1">
                                <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-2xl bg-white/20 flex items-center justify-center text-white">
                                    <Calculator size={32} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-emerald-200 uppercase tracking-wider mb-1">Laba Bersih (Estimasi)</p>
                                    <h3 className="text-xl lg:text-3xl font-black tracking-tight">Rp {netProfit.toLocaleString()}</h3>
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
                            <select 
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(e.target.value)}
                                className="bg-white border border-slate-200 text-slate-700 font-bold text-xs px-4 py-2 rounded-xl cursor-pointer outline-none"
                            >
                                {availableMonths.map(month => (
                                    <option key={month} value={month}>{formatMonthName(month)}</option>
                                ))}
                            </select>
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
                                                        {(() => {
                                                            try {
                                                                const d = new Date(trx.timestamp);
                                                                return isNaN(d.getTime()) ? '...' : d.toLocaleString('id-ID', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
                                                            } catch (e) { return '...'; }
                                                        })()}
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
                                                        ${(trx.paymentMethod || '').toLowerCase() === 'tunai' ? 'bg-amber-50 text-amber-600 border-amber-200' : 
                                                          'bg-emerald-50 text-emerald-600 border-emerald-200'}`}>
                                                        {trx.paymentMethod || 'N/A'}
                                                    </span>
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
                                                    <button
                                                        onClick={() => {
                                                            const settings = JSON.parse(localStorage.getItem('santaraStoreSettings') || '{}');
                                                            generateReceiptPDF(trx, settings);
                                                        }}
                                                        className="mt-2 text-emerald-600 hover:text-emerald-700 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest ml-auto p-2 rounded-lg hover:bg-emerald-50 transition-all border border-transparent hover:border-emerald-100"
                                                    >
                                                        <Receipt size={12} /> Cetak
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile Navigation Spacer */}
                <div className="h-20 lg:hidden"></div>

                {/* Standardized Settings Modal (Admin) */}
                <SettingsModal 
                    isOpen={isSettingsOpen}
                    onClose={() => setIsSettingsOpen(false)}
                    isAdmin={true}
                    activeTab={activeSettingsTab}
                    setActiveTab={setActiveSettingsTab}
                    userProfile={userProfile}
                    setUserProfile={setUserProfile}
                    handleSaveProfile={handleSaveProfile}
                    storeSettings={storeSettings}
                    setStoreSettings={setStoreSettings}
                    newUserContact={newUserContact}
                    setNewUserContact={setNewUserContact}
                    newUserRole={newUserRole}
                    setNewUserRole={setNewUserRole}
                    setIsChangeEmailOpen={setIsChangeEmailOpen}
                    setIsChangeWhatsappOpen={setIsChangeWhatsappOpen}
                    setIsChangePasswordOpen={setIsChangePasswordOpen}
                    addAddress={addAddress}
                    removeAddress={removeAddress}
                    updateAddress={updateAddress}
                />
            </main>
        </div>
    );
}

export default function HistoryPage() {
    return (
        <Suspense fallback={<div className="h-screen w-screen flex items-center justify-center bg-slate-50"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div></div>}>
            <HistoryContent />
        </Suspense>
    );
}
