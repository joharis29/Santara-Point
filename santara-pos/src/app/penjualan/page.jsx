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
    User,
    Users,
    FileText,
    CreditCard,
    RotateCcw,
    Tag,
    Plus,
    X,
    MoreVertical,
    CheckCircle2,
    Clock,
    Filter,
    ArrowRight,
    Edit3,
    Trash2,
    ChevronRight,
    ArrowUpDown,
    Percent,
    ArrowLeft,
    Landmark,
    BookOpen,
    Building2,
    Store,
    Menu
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import AdminHeader from '@/components/AdminHeader';
import AdminSidebar from '@/components/AdminSidebar';
import SettingsModal from '@/components/SettingsModal';

const INITIAL_PRODUCTS = [
    { id: 7, name: 'Nasi Kuning', price: 15000, stock: 15, category: 'Makanan', img: '/nasi-kuning-baru.jpg' },
    { id: 8, name: 'Nasi Uduk', price: 15000, stock: 20, category: 'Makanan', img: '/nasi-uduk-asli.jpg' },
    { id: 9, name: 'Soto Ayam', price: 15000, stock: 15, category: 'Makanan', img: '/soto-ayam-asli.jpg' },
    { id: 10, name: 'Bubur Ayam', price: 15000, stock: 20, category: 'Makanan', img: '/bubur-ayam-asli.jpg' },
    { id: 11, name: 'Ketoprak', price: 15000, stock: 15, category: 'Makanan', img: '/ketoprak-asli.jpg' },
    { id: 12, name: 'Nasi Ayam Pop', price: 16000, stock: 15, category: 'Makanan', img: '/nasi-ayam-pop-asli.jpg' },
    { id: 13, name: 'Nasi Ayam Kecap', price: 16000, stock: 15, category: 'Makanan', img: '/nasi-ayam-kecap-asli.jpg' },
    { id: 14, name: 'Nasi Ayam Balado', price: 16000, stock: 15, category: 'Makanan', img: '/nasi-ayam-balado-asli.jpg' },
    { id: 15, name: 'Nasi Ayam Kremes', price: 16000, stock: 15, category: 'Makanan', img: '/nasi-ayam-kremes-asli.jpg' },
    { id: 16, name: 'Nasi Chicken Nugget', price: 16000, stock: 15, category: 'Makanan', img: '/nasi-chicken-nugget-asli.jpg' },
    { id: 17, name: 'Nasi Ayam Rica-Rica', price: 16000, stock: 15, category: 'Makanan', img: '/nasi-ayam-rica-rica-asli.jpg' },
    { id: 18, name: 'Nasi Curry Ayam', price: 16000, stock: 15, category: 'Makanan', img: '/nasi-curry-ayam-asli.jpg' },
    { id: 19, name: 'Nasi Ayam Serundeng', price: 16000, stock: 15, category: 'Makanan', img: '/nasi-ayam-serundeng-asli.jpg' },
    { id: 20, name: 'Nasi Chicken Teriyaki', price: 16000, stock: 15, category: 'Makanan', img: '/nasi-chicken-teriyaki-asli.jpg' },
    { id: 21, name: 'Nasi Sambal Baby Cumi', price: 16000, stock: 15, category: 'Makanan', img: '/nasi-sambal-baby-cumi-asli.jpg' },
    { id: 22, name: 'Rice Bowl Chicken Teriyaki', price: 17000, stock: 20, category: 'Makanan', img: '/rice-bowl-chicken-teriyaki-asli.jpg' },
    { id: 23, name: 'Rice Bowl Chicken Nugget', price: 17000, stock: 20, category: 'Makanan', img: '/rice-bowl-chicken-nugget-asli.jpg' },
    { id: 24, name: 'Rice Bowl Chicken Popcorn', price: 17000, stock: 20, category: 'Makanan', img: '/rice-bowl-chicken-popcorn-asli.jpg' },
    { id: 25, name: 'Rice Bowl Sambal Baby Cumi', price: 17000, stock: 20, category: 'Makanan', img: '/rice-bowl-sambal-baby-cumi-asli.jpg' },
    { id: 26, name: 'Mie Ayam Pangsit', price: 15000, stock: 20, category: 'Makanan', img: '/mie-ayam-pangsit-asli.jpg' },
    { id: 27, name: 'Mie Chilli Oil', price: 15000, stock: 20, category: 'Makanan', img: '/mie-chili-oil-asli.jpg' },
];

export default function PenjualanPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('pelanggan'); // pelanggan, faktur, penerimaan, retur, harga
    const [products, setProducts] = useState(INITIAL_PRODUCTS);
    const [transactions, setTransactions] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [returns, setReturns] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Modal states
    const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
    const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
    const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
    
    // Form states
    const [newCustomer, setNewCustomer] = useState({ name: '', phone: '', email: '', address: '' });
    const [selectedTrxForReturn, setSelectedTrxForReturn] = useState(null);
    const [returnQty, setReturnQty] = useState({});
    const [returnReason, setReturnReason] = useState('');

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
        const storedProducts = localStorage.getItem('santaraProducts');
        if (storedProducts) {
            const parsed = JSON.parse(storedProducts);
            // Migrasi data: pastikan originalPrice dan discountPercent ada
            const migrated = parsed.map(p => ({
                ...p,
                originalPrice: p.originalPrice ?? p.price,
                discountPercent: p.discountPercent ?? 0
            }));
            setProducts(migrated);
        } else {
            const initial = INITIAL_PRODUCTS.map(p => ({ 
                ...p, 
                originalPrice: p.price, 
                discountPercent: 0 
            }));
            setProducts(initial);
            localStorage.setItem('santaraProducts', JSON.stringify(initial));
        }

        const fetchData = () => {
            const storedCustomers = localStorage.getItem('santaraCustomers');
            if (storedCustomers) setCustomers(JSON.parse(storedCustomers));

            const storedHistory = localStorage.getItem('santaraTransactionHistory');
            if (storedHistory) setTransactions(JSON.parse(storedHistory));

            const storedReturns = localStorage.getItem('santaraReturns');
            if (storedReturns) setReturns(JSON.parse(storedReturns));

            const storedSettings = localStorage.getItem('santaraStoreSettings');
            if (storedSettings) setStoreSettings(JSON.parse(storedSettings));
        };
        fetchData();

        const fetchUserProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser();
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

    const saveProducts = (data) => {
        setProducts(data);
        localStorage.setItem('santaraProducts', JSON.stringify(data));
    };

    const saveCustomers = (data) => {
        setCustomers(data);
        localStorage.setItem('santaraCustomers', JSON.stringify(data));
    };

    const handleAddCustomer = (e) => {
        e.preventDefault();
        const nextId = customers.length > 0 ? Math.max(...customers.map(c => c.id)) + 1 : 1;
        const customerToAdd = { ...newCustomer, id: nextId, totalSpent: 0 };
        saveCustomers([customerToAdd, ...customers]);
        setIsCustomerModalOpen(false);
        setNewCustomer({ name: '', phone: '', email: '', address: '' });
    };

    const handleProcessReturn = (e) => {
        e.preventDefault();
        if (!selectedTrxForReturn) return;
        
        const returnRecord = {
            id: 'RTN-' + Date.now(),
            trxId: selectedTrxForReturn.id,
            customerName: selectedTrxForReturn.customerName,
            items: selectedTrxForReturn.items.filter(item => returnQty[item.name] > 0).map(item => ({
                name: item.name,
                qty: returnQty[item.name]
            })),
            reason: returnReason,
            date: new Date().toISOString()
        };

        // Update Stock
        const updatedProducts = products.map(p => {
            const returned = returnRecord.items.find(ri => ri.name === p.name);
            if (returned) {
                return { ...p, stock: p.stock + returned.qty };
            }
            return p;
        });
        saveProducts(updatedProducts);

        const updatedReturns = [returnRecord, ...returns];
        setReturns(updatedReturns);
        localStorage.setItem('santaraSalesReturns', JSON.stringify(updatedReturns));
        
        setIsReturnModalOpen(false);
        setSelectedTrxForReturn(null);
        setReturnQty({});
        setReturnReason('');
        alert('Retur penjualan berhasil diproses!');
    };

    const handleUpdateOriginalPrice = (id, val) => {
        const originalPrice = parseInt(val) || 0;
        const updated = products.map(p => {
            if (p.id === id) {
                const price = Math.round(originalPrice * (1 - (p.discountPercent || 0) / 100));
                return { ...p, originalPrice, price };
            }
            return p;
        });
        saveProducts(updated);
    };

    const handleUpdateDiscountPercent = (id, val) => {
        const discountPercent = parseFloat(val) || 0;
        const updated = products.map(p => {
            if (p.id === id) {
                const price = Math.round((p.originalPrice || 0) * (1 - discountPercent / 100));
                return { ...p, discountPercent, price };
            }
            return p;
        });
        saveProducts(updated);
    };

    const handleUpdateFinalPrice = (id, val) => {
        const price = parseInt(val) || 0;
        const updated = products.map(p => {
            if (p.id === id) {
                const originalPrice = p.originalPrice || price;
                const discountPercent = originalPrice > 0 ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;
                return { ...p, price, discountPercent };
            }
            return p;
        });
        saveProducts(updated);
    };

    const filteredCustomers = customers.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const filteredInvoices = transactions.filter(t => t.id.toLowerCase().includes(searchTerm.toLowerCase()) || t.customerName.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden relative">
            {/* Standardized Sidebar Admin */}
            <AdminSidebar 
                isOpen={isSidebarOpen} 
                setIsOpen={setIsSidebarOpen} 
                onOpenSettings={() => {
                    setActiveSettingsTab('info-toko');
                    setIsSettingsOpen(true);
                }} 
            />

            <main className="flex-1 flex flex-col overflow-hidden relative">
                {/* Standardized Header Admin */}
                <AdminHeader 
                    title="Modul Penjualan"
                    subtitle="Manajemen Pelanggan, Faktur, Retur & Harga"
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    onMenuClick={() => setIsSidebarOpen(true)}
                />

                {/* Tab Navigation */}
                <div className="bg-white border-b border-slate-100 flex overflow-x-auto scrollbar-hide">
                    {[
                        { id: 'pelanggan', label: 'Pelanggan', icon: <Users size={16} /> },
                        { id: 'faktur', label: 'Faktur Penjualan', icon: <FileText size={16} /> },
                        { id: 'penerimaan', label: 'Penerimaan', icon: <CreditCard size={16} /> },
                        { id: 'retur', label: 'Retur', icon: <RotateCcw size={16} /> },
                        { id: 'harga', label: 'Harga & Diskon', icon: <Tag size={16} /> },
                    ].map(tab => (
                        <button 
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-6 py-4 text-xs font-black uppercase tracking-widest transition-all border-b-2 whitespace-nowrap flex items-center gap-2 ${activeTab === tab.id ? 'border-emerald-600 text-emerald-600 bg-emerald-50/30' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                        >
                            {tab.icon} {tab.label}
                        </button>
                    ))}
                </div>

                <div className="flex-1 overflow-y-auto p-6 lg:p-10">
                    {activeTab === 'pelanggan' && (
                        <div className="space-y-6 animate-in fade-in duration-500">
                             <div className="flex justify-between items-center">
                                <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">Database Pelanggan</h3>
                                <button onClick={() => setIsCustomerModalOpen(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-200 transition-all flex items-center gap-2">
                                    <Plus size={14} /> Pelanggan Baru
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredCustomers.map(c => (
                                    <div key={c.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
                                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-50 rounded-full blur-3xl group-hover:bg-emerald-100 transition-all"></div>
                                        <div className="relative z-10">
                                            <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 mb-4 group-hover:scale-110 transition-all">
                                                <User size={24} />
                                            </div>
                                            <h4 className="font-black text-slate-800 text-lg mb-1">{c.name}</h4>
                                            <p className="text-slate-400 text-xs font-medium mb-4">{c.email || 'Email tidak tercatat'}</p>
                                            
                                            <div className="space-y-2 mb-6">
                                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                                                    <span>Total Belanja</span>
                                                    <span className="text-emerald-600">Rp {c.totalSpent?.toLocaleString()}</span>
                                                </div>
                                                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                    <div className="h-full bg-emerald-500 w-[60%]"></div>
                                                </div>
                                            </div>
                                            
                                            <button className="w-full py-2.5 bg-slate-50 hover:bg-emerald-600 text-slate-400 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Lihat Detail</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'faktur' && (
                        <div className="space-y-6 animate-in fade-in duration-500">
                             <div className="flex justify-between items-center">
                                <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">Daftar Faktur</h3>
                                <div className="flex gap-2">
                                    <button className="bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase flex items-center gap-2 hover:bg-slate-50 transition-all">
                                        <Filter size={14} /> Filter Tanggal
                                    </button>
                                </div>
                            </div>

                            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                            <th className="px-8 py-5">No. Faktur</th>
                                            <th className="px-8 py-5">Tanggal</th>
                                            <th className="px-8 py-5">Pelanggan</th>
                                            <th className="px-8 py-5">Status</th>
                                            <th className="px-8 py-5 text-right">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {filteredInvoices.map(trx => (
                                            <tr key={trx.id} className="hover:bg-slate-50/50 transition-colors group cursor-pointer">
                                                <td className="px-8 py-5">
                                                    <p className="font-black text-slate-800 text-xs">{trx.id}</p>
                                                    <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">{trx.paymentMethod}</p>
                                                </td>
                                                <td className="px-8 py-5 text-xs text-slate-500 font-medium">
                                                    {new Date(trx.timestamp).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                </td>
                                                <td className="px-8 py-5">
                                                    <p className="font-bold text-slate-700 text-xs">{trx.customerName}</p>
                                                </td>
                                                <td className="px-8 py-5">
                                                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${trx.status === 'Selesai' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                                        {trx.status || 'Diterima'}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-5 text-right font-black text-slate-800 text-sm">
                                                    Rp {trx.totalAmount?.toLocaleString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'retur' && (
                        <div className="space-y-6 animate-in fade-in duration-500">
                             <div className="flex justify-between items-center">
                                <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">Retur Penjualan</h3>
                                <button onClick={() => setIsReturnModalOpen(true)} className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-red-200 transition-all">
                                    Proses Retur Baru
                                </button>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {returns.map(r => (
                                    <div key={r.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
                                        <div className="flex justify-between items-start mb-6">
                                            <div>
                                                <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-1">{r.id}</p>
                                                <h4 className="font-black text-slate-800">Retur: {r.customerName}</h4>
                                                <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-tight">Invoice Ref: {r.trxId}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] font-black text-slate-400 uppercase">{new Date(r.date).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="space-y-2 bg-slate-50 p-4 rounded-3xl mb-4">
                                            {r.items.map((item, i) => (
                                                <div key={i} className="flex justify-between items-center text-xs font-bold text-slate-700">
                                                    <span>{item.name}</span>
                                                    <span className="text-red-500">{item.qty} pcs</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex items-start gap-2 text-[10px] text-slate-400 italic">
                                            <RotateCcw size={14} className="shrink-0" />
                                            <p>Alasan: {r.reason}</p>
                                        </div>
                                    </div>
                                ))}
                                {returns.length === 0 && (
                                    <div className="col-span-full py-20 text-center bg-white border border-dashed border-slate-200 rounded-[3rem] text-slate-300">
                                        <RotateCcw size={48} className="mx-auto mb-4 opacity-10" />
                                        <p className="font-black uppercase text-[10px] tracking-widest italic">Belum ada data retur penjualan</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'harga' && (
                        <div className="space-y-6 animate-in fade-in duration-500">
                             <div className="flex justify-between items-center">
                                <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">Penyesuaian Harga & Diskon</h3>
                                <p className="text-slate-400 text-xs font-medium">Update harga produk jadi secara real-time.</p>
                            </div>

                            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                            <th className="px-8 py-5">Produk</th>
                                            <th className="px-8 py-5">Kategori</th>
                                            <th className="px-8 py-5">Harga Awal</th>
                                            <th className="px-8 py-5">Diskon</th>
                                            <th className="px-8 py-5">Harga Saat Ini</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {products.map(p => (
                                            <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group">
                                                <td className="px-8 py-5">
                                                    <div className="flex items-center gap-4">
                                                        <img src={p.img} className="w-10 h-10 rounded-xl object-cover shadow-sm" />
                                                        <span className="font-black text-slate-800 text-xs">{p.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                    {p.category}
                                                </td>
                                                <td className="px-8 py-5">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[10px] font-bold text-slate-400 mr-1">Rp</span>
                                                        <input 
                                                            type="number" 
                                                            defaultValue={p.originalPrice || p.price}
                                                            className="w-28 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500"
                                                            onBlur={(e) => handleUpdateOriginalPrice(p.id, e.target.value)}
                                                        />
                                                    </div>
                                                </td>
                                                <td className="px-8 py-5">
                                                    <div className="flex items-center gap-2">
                                                        <input 
                                                            type="number" 
                                                            step="0.1"
                                                            defaultValue={p.discountPercent || 0}
                                                            className="w-20 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500"
                                                            onBlur={(e) => handleUpdateDiscountPercent(p.id, e.target.value)}
                                                        />
                                                        <span className="text-[10px] font-bold text-slate-400">%</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-5">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[10px] font-bold text-emerald-600 mr-1">Rp</span>
                                                        <input 
                                                            type="number" 
                                                            value={p.price}
                                                            onChange={(e) => {
                                                                // Local update for responsive feel
                                                                const newPrice = parseInt(e.target.value) || 0;
                                                                setProducts(prev => prev.map(item => item.id === p.id ? { ...item, price: newPrice } : item));
                                                            }}
                                                            onBlur={(e) => handleUpdateFinalPrice(p.id, e.target.value)}
                                                            className="w-28 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-lg text-xs font-black text-emerald-700 outline-none focus:ring-2 focus:ring-emerald-500"
                                                        />
                                                        <div className="bg-emerald-600 text-white p-1.5 rounded-lg shadow-sm">
                                                            <CheckCircle2 size={12} />
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'penerimaan' && (
                         <div className="space-y-6 animate-in fade-in duration-500">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">Monitor Penerimaan Kas</h3>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-emerald-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-emerald-900/10">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                                            <CreditCard size={24} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-100">Total Tunai (Cash)</p>
                                            <h3 className="text-3xl font-black">Rp {transactions.filter(t => t.paymentMethod === 'Tunai').reduce((sum, t) => sum + (t.totalAmount || 0), 0).toLocaleString()}</h3>
                                        </div>
                                    </div>
                                    <p className="text-[10px] font-bold text-emerald-200/50 uppercase italic tracking-tighter">Berdasarkan data Faktur Penjualan POS</p>
                                </div>

                                <div className="bg-blue-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-blue-900/10">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                                            <ArrowUpDown size={24} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-blue-100">Total Transfer / QRIS</p>
                                            <h3 className="text-3xl font-black">Rp {transactions.filter(t => t.paymentMethod === 'Transfer').reduce((sum, t) => sum + (t.totalAmount || 0), 0).toLocaleString()}</h3>
                                        </div>
                                    </div>
                                    <p className="text-[10px] font-bold text-blue-200/50 uppercase italic tracking-tighter">Tervalidasi melalui sistem pembayaran digital</p>
                                </div>
                            </div>
                         </div>
                    )}
                </div>

                {/* Mobile Bottom Navigation (Admin Only) */}
                <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-6 py-4 flex justify-around items-center z-50 shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
                    <button onClick={() => router.push('/posin-adm')} className="flex flex-col items-center gap-1 text-slate-400">
                        <LayoutDashboard size={20} />
                        <span className="text-[10px] font-bold uppercase tracking-tight">Dash</span>
                    </button>
                    <button className="flex flex-col items-center gap-1 text-emerald-600">
                        <Tag size={20} />
                        <span className="text-[10px] font-bold uppercase tracking-tight">Jual</span>
                    </button>
                    <button onClick={() => router.push('/pembelian')} className="flex flex-col items-center gap-1 text-slate-400">
                        <ShoppingBag size={20} />
                        <span className="text-[10px] font-bold uppercase tracking-tight">Beli</span>
                    </button>
                    <button onClick={() => router.push('/homepage')} className="flex flex-col items-center gap-1 text-slate-400">
                        <ArrowLeft size={20} />
                        <span className="text-[10px] font-bold uppercase tracking-tight">Home</span>
                    </button>
                </nav>
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

            {/* Modal Tambah Pelanggan */}
            {isCustomerModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[60] flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-90 duration-300">
                        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                            <div>
                                <h3 className="text-2xl font-black text-slate-800 tracking-tight">Daftar Pelanggan Baru</h3>
                                <p className="text-slate-400 text-xs font-medium mt-1 uppercase tracking-widest">New CRM Entry</p>
                            </div>
                            <button onClick={() => setIsCustomerModalOpen(false)} className="p-3 hover:bg-white rounded-full transition-all shadow-sm">
                                <X size={24} />
                            </button>
                        </div>
                        
                        <form onSubmit={handleAddCustomer} className="p-8 space-y-6">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Nama Lengkap</label>
                                <input type="text" required placeholder="Contoh: Bapak Ahmad" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 font-bold" value={newCustomer.name} onChange={e => setNewCustomer({...newCustomer, name: e.target.value})} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">No. WhatsApp</label>
                                    <input type="text" placeholder="0821..." className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 font-bold" value={newCustomer.phone} onChange={e => setNewCustomer({...newCustomer, phone: e.target.value})} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email</label>
                                    <input type="email" placeholder="email@ext.com" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 font-bold" value={newCustomer.email} onChange={e => setNewCustomer({...newCustomer, email: e.target.value})} />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Alamat Domisili</label>
                                <textarea placeholder="Alamat lengkap..." className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 font-bold min-h-[80px]" value={newCustomer.address} onChange={e => setNewCustomer({...newCustomer, address: e.target.value})}></textarea>
                            </div>
                            <div className="pt-4 flex gap-4">
                                <button type="button" onClick={() => setIsCustomerModalOpen(false)} className="flex-1 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest text-slate-400 border border-slate-100">Batal</button>
                                <button type="submit" className="flex-[2] py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-emerald-900/10 active:scale-95 transition-all">Daftarkan Pelanggan</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Retur Penjualan */}
            {isReturnModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[60] flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-90 duration-300">
                        <div className="p-8 border-b border-slate-50 bg-red-50/50 flex justify-between items-center">
                            <div>
                                <h3 className="text-2xl font-black text-slate-800 tracking-tight">Koreksi & Retur Jual</h3>
                                <p className="text-red-500 text-xs font-black mt-1 uppercase tracking-widest">Sales Return Processing</p>
                            </div>
                            <button onClick={() => setIsReturnModalOpen(false)} className="p-3 hover:bg-white rounded-full shadow-sm">
                                <X size={24} />
                            </button>
                        </div>
                        
                        <form onSubmit={handleProcessReturn} className="p-8 space-y-6">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Pilih Nomor Faktur</label>
                                <select 
                                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 font-bold"
                                    onChange={(e) => setSelectedTrxForReturn(transactions.find(t => t.id === e.target.value))}
                                >
                                    <option value="">Cari invoice...</option>
                                    {transactions.map(t => <option key={t.id} value={t.id}>{t.id} - {t.customerName}</option>)}
                                </select>
                            </div>

                            {selectedTrxForReturn && (
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Detail Item yang Diretur</label>
                                        <div className="space-y-2">
                                            {selectedTrxForReturn.items.map((item, i) => (
                                                <div key={i} className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100">
                                                    <span className="text-xs font-bold text-slate-700">{item.name} (Pesan: {item.quantity})</span>
                                                    <input 
                                                        type="number" 
                                                        placeholder="Qty" 
                                                        className="w-16 px-2 py-1 bg-white border border-slate-200 rounded text-center text-xs font-bold"
                                                        max={item.quantity}
                                                        min={0}
                                                        onChange={(e) => setReturnQty({...returnQty, [item.name]: parseInt(e.target.value) || 0})}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Alasan Pengembalian</label>
                                        <textarea required placeholder="Alasan retur..." className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 font-bold min-h-[80px]" value={returnReason} onChange={e => setReturnReason(e.target.value)}></textarea>
                                    </div>
                                </div>
                            )}

                            <div className="pt-4 flex gap-4">
                                <button type="button" onClick={() => setIsReturnModalOpen(false)} className="flex-1 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest text-slate-400 border border-slate-100">Batal</button>
                                <button type="submit" disabled={!selectedTrxForReturn} className="flex-[2] py-4 bg-red-600 hover:bg-red-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-red-900/10 active:scale-95 transition-all outline-none disabled:opacity-50">Proses Retur</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
