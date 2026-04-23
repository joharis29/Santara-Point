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
    Search,
    Edit3,
    Trash2,
    PlusCircle,
    ArrowLeft,
    X,
    Image as ImageIcon,
    Home,
    History,
    Package,
    Store,
    Menu,
    Eye,
    EyeOff
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
    { id: 28, name: 'Cireng Ayam Suwir', price: 5000, stock: 10, category: 'Snack', img: '/cireng-ayam-suwir-asli.jpg' },
    { id: 29, name: 'Pisang Bolen', price: 35000, stock: 10, category: 'Snack', img: '/pisang-bolen-asli.jpg' },
    { id: 30, name: 'Macaroni Schotel', price: 5000, stock: 10, category: 'Snack', img: '/macaroni-schotel-asli.jpg' },
    { id: 31, name: 'Siomay Ayam', price: 10000, stock: 10, category: 'Snack', img: '/siomay-ayam-asli.jpg' },
    { id: 32, name: 'Batagor Pangsit', price: 10000, stock: 10, category: 'Snack', img: '/batagor-pangsit-asli.jpg' },
    { id: 33, name: 'Risol Ragout', price: 5000, stock: 10, category: 'Snack', img: '/risol-ragout-asli.jpg' },
    { id: 34, name: 'Zuppa Soup', price: 10000, stock: 10, category: 'Snack', img: '/zuppa-soup-asli.jpg' },
    { id: 35, name: 'Piscok', price: 10000, stock: 10, category: 'Snack', img: '/piscok-asli.jpg' },
    { id: 36, name: 'Cheese Roll', price: 10000, stock: 10, category: 'Snack', img: '/cheese-roll-asli.jpg' },
    { id: 37, name: 'Chicken Teriyaki', price: 25000, stock: 5, category: 'Frozen Food', img: '/frozen-chicken-teriyaki-asli.jpg' },
    { id: 38, name: 'Ayam Pop', price: 25000, stock: 5, category: 'Frozen Food', img: '/frozen-ayam-pop-asli.jpg' },
    { id: 39, name: 'Chicken Nugget', price: 25000, stock: 5, category: 'Frozen Food', img: '/frozen-chicken-nugget-asli.jpg' },
    { id: 40, name: 'Ayam Kecap', price: 25000, stock: 5, category: 'Frozen Food', img: '/frozen-ayam-kecap-asli.jpg' },
    { id: 41, name: 'Ayam Kremes', price: 25000, stock: 5, category: 'Frozen Food', img: '/frozen-ayam-kremes-asli-v2.jpg' },
    { id: 42, name: 'Ayam Serundeng', price: 25000, stock: 5, category: 'Frozen Food', img: '/frozen-ayam-serundeng-asli.jpg' },
    { id: 43, name: 'Ayam Rica-Rica', price: 25000, stock: 5, category: 'Frozen Food', img: '/frozen-ayam-rica-rica-asli.jpg' },
    { id: 44, name: 'Ayam Balado', price: 25000, stock: 5, category: 'Frozen Food', img: '/frozen-ayam-balado-asli.jpg' },
    { id: 45, name: 'Ayam Curry', price: 25000, stock: 5, category: 'Frozen Food', img: '/frozen-ayam-curry-asli.jpg' },
    { id: 46, name: 'Sambal Baby Cumi', price: 30000, stock: 5, category: 'Frozen Food', img: '/frozen-sambal-baby-cumi-asli.jpg' },
    { id: 47, name: 'Cireng (Ayam Suwir)', price: 10000, stock: 5, category: 'Frozen Food', img: '/frozen-cireng-ayam-suwir-asli.jpg' },
    { id: 48, name: 'Bajigur', price: 10000, stock: 10, category: 'Minuman', img: '/minuman-bajigur-asli.jpg' },
    { id: 49, name: 'Es Cendol', price: 10000, stock: 10, category: 'Minuman', img: '/minuman-es-cendol-asli.png' },
    { id: 50, name: 'Es Teh Manis', price: 5000, stock: 10, category: 'Minuman', img: '/minuman-es-teh-manis-asli.jpg' },
    { id: 51, name: 'Es Teh Tawar', price: 5000, stock: 10, category: 'Minuman', img: '/minuman-es-teh-tawar-asli.jpg' },
    { id: 52, name: 'Es Jeruk Peras', price: 10000, stock: 10, category: 'Minuman', img: '/minuman-es-jeruk-peras-asli.jpg' },
    { id: 53, name: 'Es Kuwut', price: 8000, stock: 10, category: 'Minuman', img: '/minuman-es-kuwut-asli.jpg' },
    { id: 54, name: 'Es Campur', price: 10000, stock: 10, category: 'Minuman', img: '/minuman-es-campur-asli.png' },
];

export default function ManajemenStok() {
    const router = useRouter();
    const [products, setProducts] = useState(INITIAL_PRODUCTS);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

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
    const [isSavingStore, setIsSavingStore] = useState(false);

    const handleSaveStoreSettings = async () => {
        setIsSavingStore(true);
        try {
            const toSave = {
                id: 1,
                store_name: storeSettings.storeName,
                store_tagline: storeSettings.storeTagline || '',
                whatsapp: storeSettings.whatsapp || '',
                email: storeSettings.email || '',
                is_pajak_active: storeSettings.isPajakActive,
                address: storeSettings.address || '',
                company_category: storeSettings.companyCategory || '',
                company_field: storeSettings.companyField || '',
                currency: storeSettings.currency || 'IDR',
                company_npwp: storeSettings.companyNpwp || '',
                company_type: storeSettings.companyType || 'PT',
                authorized_users: storeSettings.authorizedUsers || [],
                updated_at: new Date().toISOString()
            };

            const { error } = await supabase
                .from('store_settings')
                .upsert(toSave, { onConflict: 'id' });

            if (error) throw error;
            localStorage.setItem('santaraStoreSettings', JSON.stringify(storeSettings));
            alert('Pengaturan toko berhasil disimpan secara global!');
        } catch (err) {
            console.error("Error saving store settings:", err);
            alert('Gagal menyimpan pengaturan toko: ' + err.message);
        } finally {
            setIsSavingStore(false);
        }
    };

    const filteredProducts = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        // Security Check
        const userRole = localStorage.getItem('currentUserRole');
        const userEmail = localStorage.getItem('registeredEmail');
        const isAdmin = userRole === 'Administrator' || (userEmail && userEmail.toLowerCase() === 'santarapoint@gmail.com');

        if (!isAdmin) {
            router.push('/login');
            return;
        }
        const fetchProducts = async () => {
            try {
                // 1. Fetch from Supabase
                const { data: dbData, error } = await supabase
                    .from('products')
                    .select('*')
                    .order('id', { ascending: true });

                if (error) throw error;

                // 2. Proactive Sync: If cloud is incomplete, restore the hardcoded full list
                if (!dbData || dbData.length < INITIAL_PRODUCTS.length) {
                    const initial = INITIAL_PRODUCTS.map(p => ({
                        id: p.id,
                        name: p.name,
                        price: p.price,
                        stock: p.stock,
                        category: p.category,
                        img: p.img,
                        discount_percent: p.discountPercent || 0,
                        original_price: p.originalPrice || p.price
                    }));
                    await supabase.from('products').upsert(initial, { onConflict: 'id' });
                    
                    // Re-fetch to confirm
                    const { data: syncedData } = await supabase.from('products').select('*').order('id', { ascending: true });
                    const mapped = syncedData.map(p => ({
                        id: p.id,
                        name: p.name,
                        price: p.price,
                        stock: p.stock,
                        category: p.category,
                        img: p.img,
                        discountPercent: p.discount_percent,
                        originalPrice: p.original_price
                    }));
                    setProducts(mapped);
                    localStorage.setItem('santaraProducts', JSON.stringify(mapped));
                } else {
                    // Use Supabase data as the Source of Truth
                    const mapped = dbData.map(p => ({
                        id: p.id,
                        name: p.name,
                        price: p.price,
                        stock: p.stock,
                        category: p.category,
                        img: p.img,
                        discountPercent: p.discount_percent,
                        originalPrice: p.original_price
                    }));
                    setProducts(mapped);
                    localStorage.setItem('santaraProducts', JSON.stringify(mapped));
                }
            } catch (err) {
                console.error("Manajemen Stok Fetch/Sync Error:", err);
                const stored = localStorage.getItem('santaraProducts');
                if (stored) setProducts(JSON.parse(stored));
            }

            // Fetch Store Settings from Supabase
            try {
                const { data, error } = await supabase
                    .from('store_settings')
                    .select('*')
                    .single();
                
                if (error && error.code !== 'PGRST116') throw error;
                if (data) {
                    const mapped = {
                        storeName: data.store_name,
                        storeTagline: data.store_tagline,
                        whatsapp: data.whatsapp,
                        email: data.email,
                        isPajakActive: data.is_pajak_active,
                        address: data.address,
                        companyCategory: data.company_category,
                        companyField: data.company_field,
                        currency: data.currency,
                        companyNpwp: data.company_npwp,
                        companyType: data.company_type,
                        authorizedUsers: data.authorized_users
                    };
                    setStoreSettings(prev => ({ ...prev, ...mapped }));
                    localStorage.setItem('santaraStoreSettings', JSON.stringify(mapped));
                } else {
                    const storedSettings = localStorage.getItem('santaraStoreSettings');
                    if (storedSettings) setStoreSettings(JSON.parse(storedSettings));
                }
            } catch (err) {
                console.error("Error fetching store settings:", err);
                const storedSettings = localStorage.getItem('santaraStoreSettings');
                if (storedSettings) setStoreSettings(JSON.parse(storedSettings));
            }
        };
        fetchProducts();

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

    const handleUpdateStock = async (id, newStock) => {
        try {
            const { error } = await supabase
                .from('products')
                .update({ stock: newStock })
                .eq('id', id);
            
            if (error) throw error;

            const updated = products.map(p => p.id === id ? { ...p, stock: newStock } : p);
            setProducts(updated);
            localStorage.setItem('santaraProducts', JSON.stringify(updated));
        } catch (err) {
            console.error("Stock sync error:", err);
            const updated = products.map(p => p.id === id ? { ...p, stock: newStock } : p);
            setProducts(updated);
            localStorage.setItem('santaraProducts', JSON.stringify(updated));
        }
    };

    const handleDeleteProduct = async (id) => {
        if(window.confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
            try {
                const { error } = await supabase
                    .from('products')
                    .delete()
                    .eq('id', id);
                
                if (error) throw error;

                const updated = products.filter(p => p.id !== id);
                setProducts(updated);
                localStorage.setItem('santaraProducts', JSON.stringify(updated));
            } catch (err) {
                console.error("Delete sync error:", err);
                const updated = products.filter(p => p.id !== id);
                setProducts(updated);
                localStorage.setItem('santaraProducts', JSON.stringify(updated));
            }
        }
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        if (!newProduct.name || !newProduct.price || !newProduct.stock) {
            alert('Harap isi Nama, Harga, dan Stok!');
            return;
        }
        
        const nextId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
        const productToAdd = {
            id: nextId,
            name: newProduct.name,
            price: parseInt(newProduct.price) || 0,
            stock: parseInt(newProduct.stock) || 0,
            category: newProduct.category,
            img: newProduct.img || '/placeholder.jpg',
            isNew: true
        };

        try {
            const { error } = await supabase
                .from('products')
                .insert([{
                    id: productToAdd.id,
                    name: productToAdd.name,
                    price: productToAdd.price,
                    stock: productToAdd.stock,
                    category: productToAdd.category,
                    img: productToAdd.img,
                    discount_percent: 0,
                    original_price: productToAdd.price
                }]);
            
            if (error) throw error;

            const updated = [productToAdd, ...products];
            setProducts(updated);
            localStorage.setItem('santaraProducts', JSON.stringify(updated));
            setIsModalOpen(false);
            setNewProduct({ name: '', price: '', category: 'Makanan', stock: '', img: '' });
            alert('Produk berhasil ditambahkan dan disinkronkan!');
        } catch (err) {
            console.error("Add product sync error:", err);
            const updated = [productToAdd, ...products];
            setProducts(updated);
            localStorage.setItem('santaraProducts', JSON.stringify(updated));
            setIsModalOpen(false);
            setNewProduct({ name: '', price: '', category: 'Makanan', stock: '', img: '' });
            alert('Produk ditambahkan lokal, gagal sinkron: ' + err.message);
        }
    };

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
                    title="Manajemen Stok"
                    subtitle="Kelola Data Produk, Harga, & Ketersediaan Stok"
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    onMenuClick={() => setIsSidebarOpen(true)}
                />

                <div className="p-6 lg:p-10 flex-1 overflow-y-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold">Daftar Produk</h3>
                        <button 
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-emerald-700 transition"
                        >
                            <PlusCircle size={16} /> Tambah Produk
                        </button>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                        <div className="p-4 lg:p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center lg:hidden">
                            <h2 className="font-bold text-slate-700 text-xs">Semua Produk ({filteredProducts.length})</h2>
                        </div>

                        {/* Mobile View: Card List */}
                        <div className="lg:hidden divide-y divide-slate-100">
                            {filteredProducts.map(product => (
                                <div key={product.id} className="p-4 space-y-4 hover:bg-slate-50/50 transition-colors">
                                    <div className="flex gap-4">
                                        <img src={product.img} alt={product.name} className="w-16 h-16 rounded-xl object-cover shadow-sm" />
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-sm text-slate-800 truncate mb-1">{product.name}</h4>
                                            <div className="flex items-center gap-2">
                                                <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest">{product.category}</span>
                                                <span className="text-emerald-700 font-bold text-[10px]">Rp {product.price.toLocaleString('id-ID')}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-end justify-between gap-4 pt-1">
                                        <div className="flex-1">
                                            <label className="block text-[10px] uppercase font-black text-slate-400 mb-1.5 ml-1">Update Stok</label>
                                            <div className="flex items-center gap-2">
                                                <input 
                                                    type="number" 
                                                    value={product.stock} 
                                                    onChange={(e) => handleUpdateStock(product.id, parseInt(e.target.value) || 0)} 
                                                    className="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                                />
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter w-12 leading-tight">Portion / Pcs</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="p-2.5 bg-amber-50 hover:bg-amber-100 text-amber-600 rounded-xl transition shadow-sm border border-amber-100" title="Edit Detail">
                                                <Edit3 size={18} />
                                            </button>
                                            <button onClick={() => handleDeleteProduct(product.id)} className="p-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition shadow-sm border border-red-100" title="Hapus Produk">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {filteredProducts.length === 0 && (
                                <div className="p-10 text-center text-slate-400 text-sm font-medium">Pecarian tidak ditemukan...</div>
                            )}
                        </div>

                        {/* Desktop View: Table */}
                        <div className="hidden lg:block overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-200 text-sm">
                                        <th className="p-4 font-bold text-slate-500">Nama Produk</th>
                                        <th className="p-4 font-bold text-slate-500">Kategori</th>
                                        <th className="p-4 font-bold text-slate-500">Harga</th>
                                        <th className="p-4 font-bold text-slate-500">Sisa Stok</th>
                                        <th className="p-4 font-bold text-slate-500 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredProducts.map(product => (
                                        <tr key={product.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition">
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <img src={product.img} alt={product.name} className="w-10 h-10 rounded-lg object-cover" />
                                                    <span className="font-bold text-slate-800">{product.name}</span>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-md text-xs font-bold">{product.category}</span>
                                            </td>
                                            <td className="p-4 font-medium text-slate-700">Rp {product.price.toLocaleString('id-ID')}</td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-2">
                                                    <input 
                                                        type="number" 
                                                        value={product.stock} 
                                                        onChange={(e) => handleUpdateStock(product.id, parseInt(e.target.value) || 0)} 
                                                        className="w-20 border border-slate-200 rounded-lg px-2 py-1 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                                    />
                                                    <span className="text-xs text-slate-400">Porsi / Pcs</span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button className="p-2 bg-amber-50 hover:bg-amber-100 text-amber-600 rounded-lg transition" title="Edit Detail">
                                                        <Edit3 size={16} />
                                                    </button>
                                                    <button onClick={() => handleDeleteProduct(product.id)} className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition" title="Hapus Produk">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredProducts.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="p-8 text-center text-slate-400 font-medium">Pencarian tidak ditemukan...</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                {/* Standardized Settings Modal (Admin) */}
                <SettingsModal 
                    isOpen={isSettingsOpen}
                    onClose={() => setIsSettingsOpen(false)}
                    isAdmin={true}
                    activeTab={activeSettingsTab}
                    setActiveTab={setActiveSettingsTab}
                    userProfile={userProfile}
                    setUserProfile={setUserProfile}
                    storeSettings={storeSettings}
                    setStoreSettings={setStoreSettings}
                    onSaveStoreSettings={handleSaveStoreSettings}
                    isSavingStore={isSavingStore}
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
            </main>

            {/* Modal Tambah Produk */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="text-xl font-black text-slate-800 tracking-tight">Tambah Produk Baru</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors bg-slate-50 p-2 rounded-full">
                                <X size={20} />
                            </button>
                        </div>
                        
                        <div className="p-6 overflow-y-auto">
                            <form id="addProductForm" onSubmit={handleAddProduct} className="space-y-5">
                                {/* Gambar Produk */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">Upload Gambar / Ambil Foto</label>
                                    <div className="relative">
                                        <input 
                                            type="file" 
                                            accept="image/*"
                                            capture="environment"
                                            onChange={(e) => {
                                                const file = e.target.files[0];
                                                if (file) {
                                                    const imageUrl = URL.createObjectURL(file);
                                                    setNewProduct({...newProduct, img: imageUrl});
                                                }
                                            }}
                                            className="w-full text-slate-500 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all text-sm file:mr-4 file:py-3 file:px-4 file:border-0 file:text-sm file:font-bold file:bg-emerald-100 file:text-emerald-700 hover:file:bg-emerald-200 cursor-pointer" 
                                        />
                                    </div>
                                    {newProduct.img && !newProduct.img.startsWith('/') && (
                                        <div className="mt-3">
                                            <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Preview Gambar:</p>
                                            <img src={newProduct.img} alt="Preview" className="h-20 w-20 object-cover rounded-xl border border-slate-200 shadow-sm" />
                                        </div>
                                    )}
                                </div>

                                {/* Nama Produk */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">Nama Produk</label>
                                    <input 
                                        type="text" 
                                        placeholder="Masukkan nama produk..."
                                        value={newProduct.name}
                                        onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all font-medium text-sm" 
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    {/* Harga Produk */}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">Harga (Rp)</label>
                                        <input 
                                            type="number" 
                                            placeholder="15000"
                                            value={newProduct.price}
                                            onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all font-medium text-sm" 
                                            min="0"
                                            required
                                        />
                                    </div>
                                    
                                    {/* Stok Produk */}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">Stok Awal</label>
                                        <input 
                                            type="number" 
                                            placeholder="20"
                                            value={newProduct.stock}
                                            onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all font-medium text-sm" 
                                            min="0"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Kategori */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">Kategori</label>
                                    <select 
                                        value={newProduct.category}
                                        onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all font-bold text-slate-700 appearance-none text-sm cursor-pointer"
                                    >
                                        <option value="Makanan">Makanan</option>
                                        <option value="Minuman">Minuman</option>
                                        <option value="Snack">Snack</option>
                                        <option value="Frozen Food">Frozen Food</option>
                                    </select>
                                </div>
                            </form>
                        </div>
                        
                        <div className="p-6 border-t border-slate-100 bg-slate-50 flex gap-3">
                            <button 
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="flex-1 px-4 py-3 rounded-xl font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-100 transition-colors"
                            >
                                Batal
                            </button>
                            <button 
                                type="submit"
                                form="addProductForm"
                                className="flex-1 px-4 py-3 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-900/20 active:scale-95 transition-all"
                            >
                                Simpan Produk
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}



