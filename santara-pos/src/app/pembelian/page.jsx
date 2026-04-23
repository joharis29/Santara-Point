"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChangeEmailModal, ChangeWhatsappModal, ChangePasswordModal } from '@/components/UserManagementModals';

import {
    LayoutDashboard,
    ShoppingBag,
    ChefHat,
    ClipboardList,
    TrendingUp,
    Settings,
    LogOut,
    Truck,
    FileText,
    Receipt,
    CreditCard,
    RotateCcw,
    PlusCircle,
    Search,
    X,
    ArrowLeft,
    Home,
    History,
    Mail,
    ChevronRight,
    SearchCheck,
    AlertCircle,
    Package,
    Calendar,
    ChevronDown,
    MapPin,
    Phone,
    User,
    Plus,
    Trash2,
    Tag,
    Landmark,
    BookOpen,
    Building2,
    Store,
    Menu,
    Eye,
    EyeOff
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import AdminHeader from '@/components/AdminHeader';
import AdminSidebar from '@/components/AdminSidebar';
import SettingsModal from '@/components/SettingsModal';

/**
 * SANTARA POINT - MODUL PEMBELIAN (OWNER ONLY)
 * Fitur: Pemasok, PO, Faktur, Pembayaran, Retur.
 */

export default function PembelianPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('dashboard'); // dashboard, pemasok, po, faktur, pembayaran, retur
    const [searchTerm, setSearchTerm] = useState('');
    
    // States for various entities
    const [suppliers, setSuppliers] = useState([]);
    const [purchaseOrders, setPurchaseOrders] = useState([]);
    const [invoices, setInvoices] = useState([]);
    const [payments, setPayments] = useState([]);
    const [returns, setReturns] = useState([]);
    const [products, setProducts] = useState([]);

    // Modals
    const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
    const [isPOModalOpen, setIsPOModalOpen] = useState(false);
    const [newSupplier, setNewSupplier] = useState({ name: '', phone: '', address: '', email: '' });
    const [newPO, setNewPO] = useState({ 
        supplierId: '', 
        date: new Date().toISOString().split('T')[0],
        items: [],
        status: 'Sent' 
    });
    const [poSearchTerm, setPoSearchTerm] = useState('');

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

    // --- State Perubahan Data (Inputs) ---
    const [newEmailInput, setNewEmailInput] = useState('');
    const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);
    const [newWhatsappInput, setNewWhatsappInput] = useState('');
    const [isUpdatingWhatsapp, setIsUpdatingWhatsapp] = useState(false);
    const [newPasswordInput, setNewPasswordInput] = useState('');
    const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

    useEffect(() => {
        // Security Check
        const userRole = localStorage.getItem('currentUserRole');
        const userEmail = localStorage.getItem('registeredEmail');
        const isAdmin = userRole === 'Administrator' || (userEmail && userEmail.toLowerCase() === 'santarapoint@gmail.com');

        if (!isAdmin) {
            router.push('/login');
            return;
        }
        // Load data from LocalStorage
        const storedProducts = localStorage.getItem('santaraProducts');
        if (storedProducts) setProducts(JSON.parse(storedProducts));

        const storedSuppliers = localStorage.getItem('santaraSuppliers');
        if (storedSuppliers) setSuppliers(JSON.parse(storedSuppliers));

        const storedPO = localStorage.getItem('santaraPurchaseOrders');
        if (storedPO) setPurchaseOrders(JSON.parse(storedPO));

        const storedInvoices = localStorage.getItem('santaraPurchaseInvoices');
        if (storedInvoices) setInvoices(JSON.parse(storedInvoices));

        const storedPayments = localStorage.getItem('santaraPurchasePayments');
        if (storedPayments) setPayments(JSON.parse(storedPayments));

        const storedReturns = localStorage.getItem('santaraPurchaseReturns');
        if (storedReturns) setReturns(JSON.parse(storedReturns));

        const storedSettings = localStorage.getItem('santaraStoreSettings');
        if (storedSettings) setStoreSettings(JSON.parse(storedSettings));

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
    }, [router]);

    const handleConfirmEmailChange = async (e) => {
        e.preventDefault();
        if (!newEmailInput || !newEmailInput.includes('@')) return alert('Email tidak valid.');
        setIsUpdatingEmail(true);
        try {
            const { error } = await supabase.auth.updateUser({ email: newEmailInput });
            if (error) throw error;
            alert('Permintaan perubahan email dikirim! Cek email BARU Anda.');
            setIsChangeEmailOpen(false);
            setNewEmailInput('');
        } catch (err) {
            alert("Gagal: " + err.message);
        } finally {
            setIsUpdatingEmail(false);
        }
    };

    const handleConfirmWhatsappChange = async (e) => {
        e.preventDefault();
        if (!newWhatsappInput || newWhatsappInput.length < 10) return alert('Nomor WhatsApp tidak valid.');
        setIsUpdatingWhatsapp(true);
        try {
            const { error } = await supabase.auth.updateUser({ data: { whatsapp: newWhatsappInput } });
            if (error) throw error;
            setUserProfile(prev => ({ ...prev, whatsapp: newWhatsappInput }));
            alert('WhatsApp berhasil diperbarui.');
            setIsChangeWhatsappOpen(false);
            setNewWhatsappInput('');
        } catch (err) {
            alert("Gagal: " + err.message);
        } finally {
            setIsUpdatingWhatsapp(false);
        }
    };

    const handleConfirmPasswordChange = async (e) => {
        e.preventDefault();
        if (newPasswordInput.length < 6) return alert('Sandi minimal 6 karakter.');
        if (newPasswordInput !== confirmPasswordInput) return alert('Konfirmasi sandi tidak cocok.');
        setIsUpdatingPassword(true);
        try {
            const { error } = await supabase.auth.updateUser({ password: newPasswordInput });
            if (error) throw error;
            alert('Kata sandi berhasil diperbarui.');
            setIsChangePasswordOpen(false);
            setNewPasswordInput('');
            setConfirmPasswordInput('');
        } catch (err) {
            alert("Gagal: " + err.message);
        } finally {
            setIsUpdatingPassword(false);
        }
    };

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

    const saveToLocal = (key, data) => {
        localStorage.setItem(key, JSON.stringify(data));
    };

    const handleReceivePO = (po) => {
        if (po.status === 'Received') return alert('PO ini sudah diterima!');
        
        if (window.confirm(`Konfirmasi penerimaan barang untuk PO-${po.id.toString().slice(-6)}? Stok akan bertambah otomatis.`)) {
            // 1. Create Invoice
            const totalInvoice = po.items.reduce((sum, item) => sum + (item.quantity * (item.unitCost || 0)), 0);
            const newInvoice = {
                id: Date.now(),
                poId: po.id,
                supplierId: po.supplierId,
                date: new Date().toISOString().split('T')[0],
                total: totalInvoice,
                status: 'Unpaid'
            };
            const updatedInvoices = [newInvoice, ...invoices];
            setInvoices(updatedInvoices);
            saveToLocal('santaraPurchaseInvoices', updatedInvoices);

            // 2. Update PO Status
            const updatedPO = purchaseOrders.map(p => p.id === po.id ? { ...p, status: 'Received' } : p);
            setPurchaseOrders(updatedPO);
            saveToLocal('santaraPurchaseOrders', updatedPO);

            // 3. Update Product Stock
            const updatedProducts = products.map(p => {
                const poItem = po.items.find(item => item.productId === p.id);
                if (poItem) {
                    return { ...p, stock: p.stock + poItem.quantity };
                }
                return p;
            });
            setProducts(updatedProducts);
            saveToLocal('santaraProducts', updatedProducts);

            alert('Penerimaan berhasil! Stok telah diupdate dan faktur telah dibuat.');
        }
    };

    const handlePayInvoice = (inv) => {
        if (inv.status === 'Paid') return alert('Faktur ini sudah lunas!');
        
        const method = window.prompt('Pilih Metode Pembayaran (Tunai/Transfer):', 'Tunai');
        if (!method) return;

        if (window.confirm(`Konfirmasi pembayaran faktur INV-${inv.id.toString().slice(-6)} sebesar Rp ${inv.total.toLocaleString()}?`)) {
            // 1. Record Payment
            const newPayment = {
                id: Date.now(),
                invoiceId: inv.id,
                amount: inv.total,
                method: method,
                date: new Date().toISOString().split('T')[0]
            };
            const updatedPayments = [newPayment, ...payments];
            setPayments(updatedPayments);
            saveToLocal('santaraPurchasePayments', updatedPayments);

            // 2. Update Invoice Status
            const updatedInvoices = invoices.map(i => i.id === inv.id ? { ...i, status: 'Paid' } : i);
            setInvoices(updatedInvoices);
            saveToLocal('santaraPurchaseInvoices', updatedInvoices);

            alert('Pembayaran berhasil dicatat!');
        }
    };

    // Sub-components for each tab will be added progressively
    // For now, let's create the layout

    const NavItems = [
        { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
        { id: 'pemasok', label: 'Pemasok', icon: <Truck size={20} /> },
        { id: 'po', label: 'Pesanan (PO)', icon: <FileText size={20} /> },
        { id: 'faktur', label: 'Faktur', icon: <Receipt size={20} /> },
        { id: 'pembayaran', label: 'Pembayaran', icon: <CreditCard size={20} /> },
        { id: 'retur', label: 'Retur', icon: <RotateCcw size={20} /> },
    ];

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
                    title="Modul Pembelian"
                    subtitle="Manajemen Pemasok, PO, Faktur, & Retur Pembelian"
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    onMenuClick={() => setIsSidebarOpen(true)}
                />

                {/* Konten Tab */}
                <div className="flex-1 overflow-y-auto p-6 lg:p-10">
                    {activeTab === 'dashboard' && (
                        <div className="space-y-8 animate-in fade-in duration-500">
                            {/* Summary Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 flex items-center gap-5">
                                    <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                                        <FileText size={28} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none mb-1">Pesanan Aktif (PO)</p>
                                        <h3 className="text-2xl font-black text-slate-800 leading-none">{purchaseOrders.filter(p => p.status === 'Sent').length} Transaksi</h3>
                                    </div>
                                </div>
                                <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 flex items-center gap-5">
                                    <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500">
                                        <Receipt size={28} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none mb-1">Faktur Belum Lunas</p>
                                        <h3 className="text-2xl font-black text-slate-800 leading-none">{invoices.filter(i => i.status === 'Unpaid').length} Invoice</h3>
                                    </div>
                                </div>
                                <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 flex items-center gap-5">
                                    <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center text-red-500">
                                        <AlertCircle size={28} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none mb-1">Hutang Jatuh Tempo</p>
                                        <h3 className="text-2xl font-black text-slate-800 leading-none">Rp {(invoices.filter(i => i.status === 'Unpaid').reduce((sum, i) => sum + (i.total || 0), 0)).toLocaleString()}</h3>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div>
                                <h3 className="text-lg font-black text-slate-800 mb-4 px-2 tracking-tight flex items-center gap-2">
                                    <PlusCircle size={20} className="text-emerald-600" /> Akses Cepat
                                </h3>
                                <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 lg:gap-4">
                                    {NavItems.slice(1).map((item) => (
                                        <button 
                                            key={item.id}
                                            onClick={() => setActiveTab(item.id)}
                                            className="bg-white p-6 rounded-[2rem] border border-slate-100 flex flex-col items-center gap-3 hover:border-emerald-500 hover:shadow-xl hover:shadow-emerald-900/5 transition-all active:scale-95 text-slate-600 hover:text-emerald-700"
                                        >
                                            <div className="p-4 bg-slate-50 rounded-2xl group-hover:bg-emerald-50">
                                                {item.icon}
                                            </div>
                                            <span className="font-black text-[10px] uppercase tracking-widest text-center">{item.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Recent Activity (Dummy for now) */}
                            <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm">
                                <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                                    <h3 className="font-black text-slate-800 tracking-tight">Riwayat Pembelian Terbaru</h3>
                                    <button onClick={() => setActiveTab('po')} className="text-xs font-bold text-emerald-600 hover:underline">Lihat Semua</button>
                                </div>
                                <div className="p-8 text-center text-slate-300 italic py-16">
                                    <SearchCheck size={48} className="mx-auto mb-4 opacity-20" />
                                    <p>Belum ada aktivitas pembelian hari ini.</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'pemasok' && (
                         <div className="animate-in slide-in-from-bottom-4 duration-500">
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                                    <Truck className="text-emerald-600" size={24} /> Daftar Pemasok (Suppliers)
                                </h3>
                                <button 
                                    onClick={() => {
                                        setNewSupplier({ name: '', phone: '', address: '', email: '' });
                                        setIsSupplierModalOpen(true);
                                    }}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-200 transition-all flex items-center gap-2"
                                >
                                    <PlusCircle size={16} /> Tambah Pemasok
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {suppliers.map((s, idx) => (
                                    <div key={idx} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative group overflow-hidden transition-all hover:shadow-xl">
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-[4rem] group-hover:bg-emerald-100 transition-colors flex items-center justify-center pl-4 pb-4">
                                            <Truck className="text-emerald-200 group-hover:text-emerald-400" size={32} />
                                        </div>
                                        <h4 className="text-xl font-black text-slate-800 mb-6 truncate pr-16">{s.name}</h4>
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3 text-slate-500">
                                                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center"><Phone size={16} /></div>
                                                <span className="text-sm font-bold">{s.phone}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-slate-500">
                                                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center"><Mail size={16} /></div>
                                                <span className="text-sm font-bold">{s.email}</span>
                                            </div>
                                            <div className="flex items-start gap-3 text-slate-500">
                                                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center shrink-0"><MapPin size={16} /></div>
                                                <span className="text-sm font-medium leading-relaxed">{s.address}</span>
                                            </div>
                                        </div>
                                        <div className="mt-8 pt-6 border-t border-slate-50 flex gap-3">
                                            <button className="flex-1 py-3 bg-slate-50 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-600 transition-all text-[10px] font-black uppercase tracking-widest">Detail</button>
                                            <button 
                                                onClick={() => {
                                                    const updated = suppliers.filter((_, i) => i !== idx);
                                                    setSuppliers(updated);
                                                    saveToLocal('santaraSuppliers', updated);
                                                }}
                                                className="p-3 bg-red-50 hover:bg-red-100 text-red-300 hover:text-red-500 rounded-xl transition-all"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {suppliers.length === 0 && (
                                    <div className="col-span-full py-24 text-center bg-white border border-dashed border-slate-200 rounded-[3rem] text-slate-300">
                                        <Truck size={64} className="mx-auto mb-4 opacity-10" />
                                        <p className="font-black uppercase text-[10px] tracking-widest">Belum Ada Pemasok Terdaftar</p>
                                    </div>
                                )}
                            </div>
                         </div>
                    )}

                    {activeTab === 'po' && (
                         <div className="animate-in slide-in-from-bottom-4 duration-500">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                                <div>
                                    <h3 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                                        <FileText className="text-emerald-600" size={24} /> Pesanan Pembelian (PO)
                                    </h3>
                                    <p className="text-slate-400 text-xs font-medium uppercase tracking-widest mt-1">Purchase Order Tracking</p>
                                </div>
                                <button 
                                    onClick={() => {
                                        setNewPO({ supplierId: '', date: new Date().toISOString().split('T')[0], items: [], status: 'Sent' });
                                        setIsPOModalOpen(true);
                                    }}
                                    className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2"
                                >
                                    <PlusCircle size={16} /> Buat PO Baru
                                </button>
                            </div>

                            <div className="space-y-4">
                                {purchaseOrders.length === 0 ? (
                                    <div className="py-24 text-center bg-white border border-dashed border-slate-200 rounded-[3rem] text-slate-300">
                                        <FileText size={64} className="mx-auto mb-4 opacity-10" />
                                        <p className="font-black uppercase text-[10px] tracking-widest">Belum Ada Pesanan Pembelian</p>
                                    </div>
                                ) : (
                                    purchaseOrders.map((po, idx) => {
                                        const supplier = suppliers.find(s => s.id === po.supplierId);
                                        const totalItems = po.items.reduce((sum, item) => sum + item.quantity, 0);
                                        return (
                                            <div key={idx} className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row items-center gap-6 group hover:shadow-xl transition-all">
                                                <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                                                    <FileText size={24} />
                                                </div>
                                                <div className="flex-1 text-center md:text-left">
                                                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-1">
                                                        <h4 className="font-black text-slate-800 tracking-tight uppercase">PO-{po.id.toString().slice(-6)}</h4>
                                                        <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${po.status === 'Received' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                                                            {po.status}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm font-bold text-slate-500">{supplier?.name || 'Pemasok Tidak Dikenal'}</p>
                                                </div>
                                                <div className="flex items-center gap-10">
                                                    <div className="text-right hidden sm:block">
                                                        <p className="text-[10px] font-black uppercase text-slate-400">Total Item</p>
                                                        <p className="font-black text-slate-800">{totalItems} Unit</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-[10px] font-black uppercase text-slate-400">Tgl Pesan</p>
                                                        <p className="font-bold text-slate-800">{po.date}</p>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        {po.status !== 'Received' && (
                                                            <button 
                                                                onClick={() => handleReceivePO(po)}
                                                                className="p-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-400 hover:text-emerald-600 rounded-xl transition-all font-black text-[10px] uppercase tracking-widest flex items-center gap-2"
                                                                title="Terima Barang"
                                                            >
                                                                <Truck size={16} /> Terima
                                                            </button>
                                                        )}
                                                        <button 
                                                            onClick={() => {
                                                                const updated = purchaseOrders.filter((_, i) => i !== idx);
                                                                setPurchaseOrders(updated);
                                                                saveToLocal('santaraPurchaseOrders', updated);
                                                            }}
                                                            className="p-3 bg-red-50 hover:bg-red-100 text-red-300 hover:text-red-500 rounded-xl transition-all"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                         </div>
                    )}

                    {activeTab === 'faktur' && (
                         <div className="animate-in slide-in-from-bottom-4 duration-500">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                                <div>
                                    <h3 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                                        <Receipt className="text-emerald-600" size={24} /> Faktur Pembelian
                                    </h3>
                                    <p className="text-slate-400 text-xs font-medium uppercase tracking-widest mt-1">Invoice & Goods Receipt</p>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {invoices.length === 0 ? (
                                    <div className="col-span-full py-24 text-center bg-white border border-dashed border-slate-200 rounded-[3rem] text-slate-300">
                                        <Receipt size={64} className="mx-auto mb-4 opacity-10" />
                                        <p className="font-black uppercase text-[10px] tracking-widest">Belum Ada Faktur Pembelian</p>
                                    </div>
                                ) : (
                                    invoices.map((inv, idx) => (
                                        <div key={idx} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col gap-6 group hover:shadow-xl transition-all">
                                            <div className="flex justify-between items-start">
                                                <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500">
                                                    <Receipt size={20} />
                                                </div>
                                                <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${inv.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                                    {inv.status}
                                                </span>
                                            </div>
                                            <div>
                                                <h4 className="font-black text-slate-800 tracking-tight text-lg">INV/{inv.id.toString().slice(-6)}</h4>
                                                <p className="text-sm font-bold text-slate-400">{inv.poId ? `Dari PO-${inv.poId.toString().slice(-6)}` : 'Entry Langsung'}</p>
                                            </div>
                                            <div className="flex justify-between items-end">
                                                <div>
                                                    <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Total Tagihan</p>
                                                    <p className="text-xl font-black text-emerald-600 italic">Rp {inv.total.toLocaleString()}</p>
                                                </div>
                                                <button 
                                                    onClick={() => handlePayInvoice(inv)}
                                                    disabled={inv.status === 'Paid'}
                                                    className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${inv.status === 'Paid' ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-slate-900 text-white hover:bg-emerald-600'}`}
                                                >
                                                    {inv.status === 'Paid' ? 'Sudah Lunas' : 'Bayar Sekarang'}
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                         </div>
                    )}

                    {activeTab === 'pembayaran' && (
                         <div className="animate-in slide-in-from-bottom-4 duration-500">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                                <div>
                                    <h3 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                                        <CreditCard className="text-emerald-600" size={24} /> Riwayat Pembayaran
                                    </h3>
                                    <p className="text-slate-400 text-xs font-medium uppercase tracking-widest mt-1">Payment History & Cash Out</p>
                                </div>
                            </div>
                            
                            <div className="space-y-4">
                                {payments.length === 0 ? (
                                    <div className="py-24 text-center bg-white border border-dashed border-slate-200 rounded-[3rem] text-slate-300">
                                        <CreditCard size={64} className="mx-auto mb-4 opacity-10" />
                                        <p className="font-black uppercase text-[10px] tracking-widest">Belum Ada Riwayat Pembayaran</p>
                                    </div>
                                ) : (
                                    payments.map((pay, idx) => (
                                        <div key={idx} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-6">
                                            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                                                <CreditCard size={20} />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-black text-slate-800">Pembayaran INV-{pay.invoiceId.toString().slice(-6)}</h4>
                                                <p className="text-[10px] font-black uppercase text-slate-400">{pay.method} • {pay.date}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-lg font-black text-emerald-600 leading-none">Rp {pay.amount.toLocaleString()}</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                         </div>
                    )}

                    {activeTab === 'retur' && (
                         <div className="animate-in slide-in-from-bottom-4 duration-500">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                                <div>
                                    <h3 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                                        <RotateCcw className="text-emerald-600" size={24} /> Retur Pembelian
                                    </h3>
                                    <p className="text-slate-400 text-xs font-medium uppercase tracking-widest mt-1">Returns & Stock Adjustments</p>
                                </div>
                            </div>
                            
                            <div className="py-24 text-center bg-white border border-dashed border-slate-200 rounded-[3rem] text-slate-300">
                                <RotateCcw size={64} className="mx-auto mb-4 opacity-10" />
                                <p className="font-black uppercase text-[10px] tracking-widest italic leading-relaxed">Menu Retur sedang dalam tahap finalisasi.<br/>Hubungi Tim IT untuk aktivasi darurat.</p>
                            </div>
                         </div>
                    )}

                    {/* Temporary Placeholder for other tabs (Final check) */}
                    {!['dashboard', 'pemasok', 'po', 'faktur', 'pembayaran', 'retur'].includes(activeTab) && (
                        <div className="animate-in zoom-in-95 duration-500 py-32 text-center text-slate-300">
                            <Package size={80} className="mx-auto mb-6 opacity-10 animate-bounce" />
                            <h3 className="text-2xl font-black text-slate-800 tracking-tight">Menu {activeTab.toUpperCase()} Sedang Dibangun</h3>
                            <p className="max-w-md mx-auto mt-4 text-slate-400 font-medium">Fitur ini akan diimplementasikan pada langkah pengerjaan berikutnya.</p>
                        </div>
                    )}
                </div>
            </main>
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
                    updateAddress={updateAddress}
                />

                <ChangeEmailModal 
                    isOpen={isChangeEmailOpen}
                    onClose={() => setIsChangeEmailOpen(false)}
                    oldEmail={userProfile.email}
                    newEmail={newEmailInput}
                    setNewEmail={setNewEmailInput}
                    onConfirm={handleConfirmEmailChange}
                    isProcessing={isUpdatingEmail}
                />

                <ChangeWhatsappModal 
                    isOpen={isChangeWhatsappOpen}
                    onClose={() => setIsChangeWhatsappOpen(false)}
                    oldWhatsapp={userProfile.whatsapp}
                    newWhatsapp={newWhatsappInput}
                    setNewWhatsapp={setNewWhatsappInput}
                    onConfirm={handleConfirmWhatsappChange}
                    isProcessing={isUpdatingWhatsapp}
                />

                <ChangePasswordModal 
                    isOpen={isChangePasswordOpen}
                    onClose={() => setIsChangePasswordOpen(false)}
                    newPassword={newPasswordInput}
                    setNewPassword={setNewPasswordInput}
                    confirmPassword={confirmPasswordInput}
                    setConfirmPassword={setConfirmPasswordInput}
                    onConfirm={handleConfirmPasswordChange}
                    isProcessing={isUpdatingPassword}
                />


            {/* Modal Tambah Pemasok */}
            {isSupplierModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[60] flex items-center justify-center p-4">
                    <div className="bg-white rounded-[3rem] w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-90 duration-300 flex flex-col max-h-[90vh]">
                        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                            <div>
                                <h3 className="text-2xl font-black text-slate-800 tracking-tight">Tambah Pemasok</h3>
                                <p className="text-slate-400 text-xs font-medium mt-1 uppercase tracking-widest">Supplier Registration</p>
                            </div>
                            <button onClick={() => setIsSupplierModalOpen(false)} className="p-3 hover:bg-white rounded-full transition-all shadow-sm">
                                <X size={24} />
                            </button>
                        </div>
                        
                        <div className="p-8 space-y-5">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Nama Pemasok / Vendor</label>
                                <div className="relative">
                                    <Truck className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-500" size={18} />
                                    <input 
                                        type="text" 
                                        placeholder="Contoh: UD Sumber Barokah"
                                        className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 font-bold text-slate-700 transition-all placeholder:text-slate-300"
                                        value={newSupplier.name}
                                        onChange={(e) => setNewSupplier({...newSupplier, name: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Nomor WhatsApp / Telp</label>
                                    <div className="relative">
                                        <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-500" size={18} />
                                        <input 
                                            type="text" 
                                            placeholder="0812xxxx"
                                            className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 font-bold text-slate-700 transition-all placeholder:text-slate-300"
                                            value={newSupplier.phone}
                                            onChange={(e) => setNewSupplier({...newSupplier, phone: e.target.value})}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Alamat Email Resmi</label>
                                    <div className="relative">
                                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-500" size={18} />
                                        <input 
                                            type="email" 
                                            placeholder="vendor@example.com"
                                            className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 font-bold text-slate-700 transition-all placeholder:text-slate-300"
                                            value={newSupplier.email}
                                            onChange={(e) => setNewSupplier({...newSupplier, email: e.target.value})}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Alamat Lengkap</label>
                                <div className="relative">
                                    <MapPin className="absolute left-5 top-5 text-emerald-500" size={18} />
                                    <textarea 
                                        placeholder="Masukkan alamat pusat atau gudang..."
                                        className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 font-bold text-slate-700 transition-all placeholder:text-slate-300 min-h-[100px]"
                                        value={newSupplier.address}
                                        onChange={(e) => setNewSupplier({...newSupplier, address: e.target.value})}
                                    ></textarea>
                                </div>
                            </div>
                        </div>

                        <div className="px-8 pb-8 flex gap-4">
                            <button 
                                onClick={() => setIsSupplierModalOpen(false)}
                                className="flex-1 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 hover:bg-slate-50 transition-all"
                            >
                                Batal
                            </button>
                            <button 
                                onClick={() => {
                                    if (!newSupplier.name) return alert('Nama pemasok wajib diisi!');
                                    if (!newSupplier.email) return alert('Email pemasok wajib diisi!');
                                    const updated = [{ ...newSupplier, id: Date.now() }, ...suppliers];
                                    setSuppliers(updated);
                                    saveToLocal('santaraSuppliers', updated);
                                    setIsSupplierModalOpen(false);
                                }}
                                className="flex-[2] py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-emerald-900/10 active:scale-95 transition-all"
                            >
                                Simpan Pemasok
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Modal Tambah PO */}
            {isPOModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[60] flex items-center justify-center p-4">
                    <div className="bg-white rounded-[3rem] w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-90 duration-300 flex flex-col max-h-[90vh]">
                        <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                            <div>
                                <h3 className="text-2xl font-black text-slate-800 tracking-tight">Buat PO Baru</h3>
                                <p className="text-slate-400 text-xs font-medium mt-1 uppercase tracking-widest">New Purchase Order</p>
                            </div>
                            <button onClick={() => setIsPOModalOpen(false)} className="p-3 hover:bg-white rounded-full transition-all shadow-sm">
                                <X size={24} />
                            </button>
                        </div>
                        
                        <div className="p-10 space-y-8 overflow-y-auto flex-1">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Pilih Pemasok</label>
                                    <select 
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 font-bold text-slate-700 appearance-none cursor-pointer"
                                        value={newPO.supplierId}
                                        onChange={(e) => setNewPO({...newPO, supplierId: Number(e.target.value)})}
                                    >
                                        <option value="">Pilih Supplier...</option>
                                        {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Tanggal Pesanan</label>
                                    <input 
                                        type="date" 
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 font-bold text-slate-700"
                                        value={newPO.date}
                                        onChange={(e) => setNewPO({...newPO, date: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center px-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Daftar Barang Dipesan</label>
                                    <button 
                                        onClick={() => setNewPO({...newPO, items: [...newPO.items, { productId: '', quantity: 1, unitCost: 0 }]})}
                                        className="text-xs font-black text-blue-600 flex items-center gap-1 hover:underline"
                                    >
                                        <Plus size={14} /> Tambah Baris
                                    </button>
                                </div>
                                
                                <div className="space-y-3">
                                    {newPO.items.map((item, idx) => (
                                        <div key={idx} className="flex gap-3 items-center animate-in slide-in-from-right-2 duration-300">
                                            <select 
                                                className="flex-[3] px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-blue-500 font-bold text-sm"
                                                value={item.productId}
                                                onChange={(e) => {
                                                    const updatedItems = [...newPO.items];
                                                    updatedItems[idx].productId = Number(e.target.value);
                                                    setNewPO({...newPO, items: updatedItems});
                                                }}
                                            >
                                                <option value="">Pilih Produk...</option>
                                                {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                            </select>
                                            <input 
                                                type="number" 
                                                placeholder="Qty"
                                                className="flex-1 px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-blue-500 font-bold text-sm text-center"
                                                value={item.quantity}
                                                onChange={(e) => {
                                                    const updatedItems = [...newPO.items];
                                                    updatedItems[idx].quantity = Number(e.target.value);
                                                    setNewPO({...newPO, items: updatedItems});
                                                }}
                                            />
                                            <button 
                                                onClick={() => {
                                                    const updatedItems = newPO.items.filter((_, i) => i !== idx);
                                                    setNewPO({...newPO, items: updatedItems});
                                                }}
                                                className="p-3 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ))}
                                    {newPO.items.length === 0 && (
                                        <div className="py-12 border-2 border-dashed border-slate-100 rounded-3xl text-center text-slate-300 italic text-sm">
                                            Klik tombol di atas untuk menambah barang.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="p-10 border-t border-slate-50 bg-slate-50/50 flex gap-4">
                            <button 
                                onClick={() => setIsPOModalOpen(false)}
                                className="flex-1 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 hover:bg-white transition-all shadow-sm shadow-slate-200/50"
                            >
                                Batal
                            </button>
                            <button 
                                onClick={() => {
                                    if (!newPO.supplierId) return alert('Pilih pemasok terlebih dahulu!');
                                    if (newPO.items.length === 0 || newPO.items.some(i => !i.productId)) return alert('Mohon lengkapi daftar barang!');
                                    
                                    const updated = [{ ...newPO, id: Date.now() }, ...purchaseOrders];
                                    setPurchaseOrders(updated);
                                    saveToLocal('santaraPurchaseOrders', updated);
                                    setIsPOModalOpen(false);
                                }}
                                className="flex-[2] py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-blue-900/10 active:scale-95 transition-all outline-none"
                            >
                                Simpan Pesanan (PO)
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}



