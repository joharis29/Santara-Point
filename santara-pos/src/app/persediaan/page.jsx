"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    LayoutDashboard,
    ShoppingBag,
    ChefHat,
    ClipboardList,
    TrendingUp,
    Settings,
    LogOut,
    Search,
    Edit3,
    Trash2,
    PlusCircle,
    ArrowLeft,
    X,
    Package,
    History,
    FileText,
    TrendingDown,
    MapPin,
    AlertCircle,
    Plus,
    Minus,
    ArrowUpDown,
    CheckCircle2,
    Home,
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

const CATEGORIES = ['Bahan Baku', 'Bahan Tambahan', 'Kemasan', 'Jasa'];

export default function PersediaanPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('barang'); // barang, penyesuaian
    const [products, setProducts] = useState([]);
    const [adjustments, setAdjustments] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Modal states
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [isAdjustmentModalOpen, setIsAdjustmentModalOpen] = useState(false);
    
    const [newProduct, setNewProduct] = useState({ name: '', price: '', stock: '', category: 'Bahan Baku', img: '' });
    const [newAdjustment, setNewAdjustment] = useState({ productId: '', type: 'Tambah', qty: '', reason: '', date: new Date().toISOString().split('T')[0] });

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
        const storedProducts = localStorage.getItem('santaraRawMaterials');
        if (storedProducts) setProducts(JSON.parse(storedProducts));

        const storedAdjustments = localStorage.getItem('santaraRawAdjustments');
        if (storedAdjustments) setAdjustments(JSON.parse(storedAdjustments));

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

    const saveProducts = (data) => {
        setProducts(data);
        localStorage.setItem('santaraRawMaterials', JSON.stringify(data));
    };

    const saveAdjustments = (data) => {
        setAdjustments(data);
        localStorage.setItem('santaraRawAdjustments', JSON.stringify(data));
    };

    const handleAddProduct = (e) => {
        e.preventDefault();
        const nextId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
        const productToAdd = {
            ...newProduct,
            id: nextId,
            price: parseInt(newProduct.price) || 0,
            stock: parseInt(newProduct.stock) || 0,
            img: newProduct.img || '/placeholder.jpg'
        };
        saveProducts([productToAdd, ...products]);
        setIsProductModalOpen(false);
        setNewProduct({ name: '', price: '', stock: '', category: 'Makanan', img: '' });
    };

    const handleDeleteProduct = (id) => {
        if (window.confirm('Hapus item ini dari persediaan?')) {
            saveProducts(products.filter(p => p.id !== id));
        }
    };

    const handleSaveAdjustment = (e) => {
        e.preventDefault();
        if (!newAdjustment.productId || !newAdjustment.qty) return alert('Mohon lengkapi data penyesuaian!');
        
        const productId = Number(newAdjustment.productId);
        const qty = Number(newAdjustment.qty);
        const product = products.find(p => p.id === productId);
        
        if (!product) return;

        // 1. Update Product Stock
        const updatedProducts = products.map(p => {
            if (p.id === productId) {
                const newStock = newAdjustment.type === 'Tambah' ? p.stock + qty : p.stock - qty;
                return { ...p, stock: Math.max(0, newStock) };
            }
            return p;
        });
        saveProducts(updatedProducts);

        // 2. Add to History
        const adjustmentRecord = {
            ...newAdjustment,
            id: Date.now(),
            productName: product.name,
            qty: qty
        };
        saveAdjustments([adjustmentRecord, ...adjustments]);
        
        setIsAdjustmentModalOpen(false);
        setNewAdjustment({ productId: '', type: 'Tambah', qty: '', reason: '', date: new Date().toISOString().split('T')[0] });
        alert('Penyesuaian stok berhasil disimpan!');
    };

    const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden relative">
            <AdminSidebar 
                isOpen={isSidebarOpen} 
                setIsOpen={setIsSidebarOpen} 
                onOpenSettings={() => {
                    setActiveSettingsTab('info-toko');
                    setIsSettingsOpen(true);
                }} 
            />

            <main className="flex-1 flex flex-col min-w-0 bg-white">
                <AdminHeader 
                    title="Manajemen Persediaan"
                    subtitle="Kelola Stok Barang, Bahan Baku, & Penyesuaian"
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    onMenuClick={() => setIsSidebarOpen(true)}
                    rightElement={(
                        <div className="flex gap-2">
                            <button 
                                onClick={() => setIsProductModalOpen(true)}
                                className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl shadow-slate-200"
                            >
                                <Plus size={16} /> Item Baru
                            </button>
                            <button 
                                onClick={() => setIsAdjustmentModalOpen(true)}
                                className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-100"
                            >
                                <ArrowUpDown size={16} /> Penyesuaian
                            </button>
                        </div>
                    )}
                />

                {/* Tab Navigation */}
                <div className="bg-white border-b border-slate-100 flex px-6 lg:px-10">
                    <button 
                        onClick={() => setActiveTab('barang')}
                        className={`px-8 py-4 text-xs font-black uppercase tracking-widest transition-all border-b-2 ${activeTab === 'barang' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                    >
                        Barang & Jasa
                    </button>
                    <button 
                        onClick={() => setActiveTab('penyesuaian')}
                        className={`px-8 py-4 text-xs font-black uppercase tracking-widest transition-all border-b-2 ${activeTab === 'penyesuaian' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                    >
                        Penyesuaian Persediaan
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 lg:p-10">
                    {activeTab === 'barang' && (
                        <div className="space-y-6 animate-in fade-in duration-500">
                             <div className="flex justify-between items-center">
                                <h3 className="text-lg font-black text-slate-800 tracking-tight uppercase">Daftar Katalog</h3>
                                <button 
                                    onClick={() => setIsProductModalOpen(true)}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-200 transition-all flex items-center gap-2"
                                >
                                    <Plus size={14} /> Item Baru
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {filteredProducts.map(product => (
                                    <div key={product.id} className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                                        <div className="h-32 rounded-2xl overflow-hidden mb-4 relative bg-slate-100">
                                            <img src={product.img} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                                            <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg">
                                                <p className="text-[9px] font-black text-slate-800 uppercase tracking-tighter">{product.category}</p>
                                            </div>
                                        </div>
                                        <h4 className="font-black text-slate-800 text-sm truncate mb-1">{product.name}</h4>
                                        <div className="flex justify-between items-center mb-3">
                                            <p className="text-emerald-600 font-black text-sm">Rp {product.price.toLocaleString()}</p>
                                            <div className={`px-2 py-0.5 rounded-lg flex items-center gap-1 ${product.stock < 5 ? 'bg-red-50 text-red-500' : 'bg-slate-50 text-slate-500'}`}>
                                                <span className="text-[10px] font-bold">Stok: {product.stock}</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="flex-1 py-2 bg-slate-50 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-all"><Edit3 size={14} className="mx-auto" /></button>
                                            <button onClick={() => handleDeleteProduct(product.id)} className="flex-1 py-2 bg-red-50 hover:bg-red-100 rounded-lg text-red-300 hover:text-red-500 transition-all"><Trash2 size={14} className="mx-auto" /></button>
                                        </div>
                                    </div>
                                ))}
                                {filteredProducts.length === 0 && (
                                    <div className="col-span-full py-24 text-center bg-white border border-dashed border-slate-200 rounded-[3rem] text-slate-300">
                                        <Search size={48} className="mx-auto mb-4 opacity-10" />
                                        <p className="font-black uppercase text-[10px] tracking-widest">Pencarian Tidak Ditemukan</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'penyesuaian' && (
                        <div className="space-y-6 animate-in fade-in duration-500">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-black text-slate-800 tracking-tight uppercase">Riwayat Penyesuaian</h3>
                                <button 
                                    onClick={() => setIsAdjustmentModalOpen(true)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-200 transition-all flex items-center gap-2"
                                >
                                    <ArrowUpDown size={14} /> Buat Penyesuaian
                                </button>
                            </div>

                            <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-slate-50 border-b border-slate-100 text-[10px] uppercase font-black tracking-widest text-slate-400">
                                            <th className="px-6 py-4">Produk</th>
                                            <th className="px-6 py-4">Tipe</th>
                                            <th className="px-6 py-4">Jumlah</th>
                                            <th className="px-6 py-4">Alasan</th>
                                            <th className="px-6 py-4">Tanggal</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {adjustments.map((adj) => (
                                            <tr key={adj.id} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <p className="font-bold text-slate-800 text-sm">{adj.productName}</p>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${adj.type === 'Tambah' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                                        {adj.type === 'Tambah' ? <Plus size={10} className="inline mr-1" /> : <Minus size={10} className="inline mr-1" />}
                                                        {adj.type}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 font-black text-slate-800 text-sm">{adj.qty} Unit</td>
                                                <td className="px-6 py-4 text-xs text-slate-500 italic max-w-xs truncate">{adj.reason || '-'}</td>
                                                <td className="px-6 py-4 text-[11px] font-bold text-slate-400">{adj.date}</td>
                                            </tr>
                                        ))}
                                        {adjustments.length === 0 && (
                                            <tr>
                                                <td colSpan="5" className="px-6 py-12 text-center text-slate-300 italic text-sm">Belum ada riwayat penyesuaian.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
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
                        <Package size={20} />
                        <span className="text-[10px] font-bold uppercase tracking-tight">Stok</span>
                    </button>
                    <button onClick={() => router.push('/pembelian')} className="flex flex-col items-center gap-1 text-slate-400">
                        <ShoppingBag size={20} />
                        <span className="text-[10px] font-bold uppercase tracking-tight">Beli</span>
                    </button>
                    <button onClick={() => router.push('/')} className="flex flex-col items-center gap-1 text-slate-400">
                        <Home size={20} />
                        <span className="text-[10px] font-bold uppercase tracking-tight">Home</span>
                    </button>
                </nav>
            </main>

            {/* Modal Tambah Item (Barang & Jasa) */}
            {isProductModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[60] flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-90 duration-300">
                        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                            <div>
                                <h3 className="text-2xl font-black text-slate-800 tracking-tight">Tambah Item Katalog</h3>
                                <p className="text-slate-400 text-xs font-medium mt-1 uppercase tracking-widest">New Catalog Item</p>
                            </div>
                            <button onClick={() => setIsProductModalOpen(false)} className="p-3 hover:bg-white rounded-full transition-all shadow-sm">
                                <X size={24} />
                            </button>
                        </div>
                        
                        <form onSubmit={handleAddProduct} className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Nama Barang / Jasa</label>
                                <input 
                                    type="text" 
                                    required
                                    placeholder="Masukkan nama item..."
                                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 font-bold text-slate-700"
                                    value={newProduct.name}
                                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Harga Jual (Rp)</label>
                                    <input 
                                        type="number" 
                                        required
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 font-bold text-slate-700 text-center"
                                        value={newProduct.price}
                                        onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Stok Awal</label>
                                    <input 
                                        type="number" 
                                        required
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 font-bold text-slate-700 text-center"
                                        value={newProduct.stock}
                                        onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Kategori</label>
                                <select 
                                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 font-bold text-slate-700 appearance-none cursor-pointer"
                                    value={newProduct.category}
                                    onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                                >
                                    {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                            </div>

                            <div className="pt-4 flex gap-4">
                                <button 
                                    type="button"
                                    onClick={() => setIsProductModalOpen(false)}
                                    className="flex-1 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all border border-slate-100"
                                >
                                    Batal
                                </button>
                                <button 
                                    type="submit"
                                    className="flex-[2] py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-emerald-900/10 active:scale-95 transition-all outline-none"
                                >
                                    Simpan Item
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Penyesuaian Persediaan */}
            {isAdjustmentModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[60] flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-90 duration-300">
                        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                            <div>
                                <h3 className="text-2xl font-black text-slate-800 tracking-tight">Koreksi Persediaan</h3>
                                <p className="text-slate-400 text-xs font-medium mt-1 uppercase tracking-widest">Inventory Reconciliation</p>
                            </div>
                            <button onClick={() => setIsAdjustmentModalOpen(false)} className="p-3 hover:bg-white rounded-full transition-all shadow-sm">
                                <X size={24} />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSaveAdjustment} className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Pilih Item Katalog</label>
                                <select 
                                    required
                                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 font-bold text-slate-700 appearance-none cursor-pointer"
                                    value={newAdjustment.productId}
                                    onChange={(e) => setNewAdjustment({...newAdjustment, productId: e.target.value})}
                                >
                                    <option value="">Pilih Item...</option>
                                    {products.map(p => <option key={p.id} value={p.id}>{p.name} (Stok: {p.stock})</option>)}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Tipe Koreksi</label>
                                    <select 
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 font-black text-slate-700 appearance-none cursor-pointer uppercase tracking-widest"
                                        value={newAdjustment.type}
                                        onChange={(e) => setNewAdjustment({...newAdjustment, type: e.target.value})}
                                    >
                                        <option value="Tambah">TAMBAH (+)</option>
                                        <option value="Kurang">KURANG (-)</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Jumlah Qty</label>
                                    <input 
                                        type="number" 
                                        required
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 font-bold text-slate-700 text-center"
                                        value={newAdjustment.qty}
                                        onChange={(e) => setNewAdjustment({...newAdjustment, qty: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Alasan Koreksi</label>
                                <textarea 
                                    placeholder="Contoh: Barang rusak, Salah input stok awal, dll..."
                                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 font-bold text-slate-700 min-h-[100px]"
                                    value={newAdjustment.reason}
                                    onChange={(e) => setNewAdjustment({...newAdjustment, reason: e.target.value})}
                                ></textarea>
                            </div>

                            <div className="pt-4 flex gap-4">
                                <button 
                                    type="button"
                                    onClick={() => setIsAdjustmentModalOpen(false)}
                                    className="flex-1 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all border border-slate-100"
                                >
                                    Batal
                                </button>
                                <button 
                                    type="submit"
                                    className="flex-[2] py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-blue-900/10 active:scale-95 transition-all outline-none"
                                >
                                    Simpan Koreksi
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

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
        </div>
    );
}

// Modal Ganti Email
const ChangeEmailModal = ({ isOpen, onClose, oldEmail, newEmail, setNewEmail, onConfirm, isProcessing }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[300] flex items-center justify-center p-4">
            <div className="bg-white rounded-[2.5rem] w-full max-md overflow-hidden shadow-2xl p-8 space-y-6">
                <h4 className="text-2xl font-black text-slate-800">Ganti Email</h4>
                <form onSubmit={onConfirm} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Email Baru</label>
                        <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} required className="w-full px-5 py-3 bg-slate-50 border rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold" />
                    </div>
                    <div className="flex gap-3">
                        <button type="button" onClick={onClose} className="flex-1 py-4 bg-slate-100 rounded-2xl font-black">Batal</button>
                        <button type="submit" disabled={isProcessing} className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-black disabled:opacity-50">Konfirmasi</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Modal Ganti WhatsApp
const ChangeWhatsappModal = ({ isOpen, onClose, oldWhatsapp, newWhatsapp, setNewWhatsapp, onConfirm, isProcessing }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[300] flex items-center justify-center p-4">
            <div className="bg-white rounded-[2.5rem] w-full max-md overflow-hidden shadow-2xl p-8 space-y-6">
                <h4 className="text-2xl font-black text-slate-800">Ganti WhatsApp</h4>
                <form onSubmit={onConfirm} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Nomor Baru</label>
                        <input type="tel" value={newWhatsapp} onChange={(e) => setNewWhatsapp(e.target.value)} required className="w-full px-5 py-3 bg-slate-50 border rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold" />
                    </div>
                    <div className="flex gap-3">
                        <button type="button" onClick={onClose} className="flex-1 py-4 bg-slate-100 rounded-2xl font-black">Batal</button>
                        <button type="submit" disabled={isProcessing} className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-black disabled:opacity-50">Simpan</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Modal Ganti Password
const ChangePasswordModal = ({ isOpen, onClose, newPassword, setNewPassword, confirmPassword, setConfirmPassword, onConfirm, isProcessing }) => {
    const [showNewPassword, setShowNewPassword] = React.useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[300] flex items-center justify-center p-4">
            <div className="bg-white rounded-[2.5rem] w-full max-md overflow-hidden shadow-2xl p-8 space-y-6">
                <h4 className="text-2xl font-black text-slate-800">Ganti Sandi</h4>
                <form onSubmit={onConfirm} className="space-y-4">
                    <div className="relative">
                        <input
                            type={showNewPassword ? "text" : "password"}
                            placeholder="Sandi Baru"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            className="w-full px-5 py-3 bg-slate-50 border rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                        />
                        <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600 transition-colors"
                        >
                            {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                    <div className="relative">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Konfirmasi Sandi"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="w-full px-5 py-3 bg-slate-50 border rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600 transition-colors"
                        >
                            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                    <div className="flex gap-3">
                        <button type="button" onClick={onClose} className="flex-1 py-4 bg-slate-100 rounded-2xl font-black">Batal</button>
                        <button type="submit" disabled={isProcessing} className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-black disabled:opacity-50">Simpan</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
