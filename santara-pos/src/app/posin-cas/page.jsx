"use client";

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChangeEmailModal, ChangeWhatsappModal, ChangePasswordModal } from '@/components/UserManagementModals';
import { generateReceiptPDF } from '@/lib/receiptPdf';
import WaitingOverlay from '../posin-cus/WaitingOverlay';
import {
    Home,
    ShoppingBag,
    ShieldCheck,
    Search,
    Plus,
    Minus,
    Trash2,
    Calculator,
    ChevronRight,
    LogOut,
    Store,
    Clock,
    History,
    ChefHat,
    CreditCard,
    UserCircle,
    ShoppingCart,
    ArrowUpDown,
    X,
    User,
    CheckCircle2,
    ArrowLeft,
    Menu,
    Eye,
    EyeOff
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import CashierHeader from '@/components/CashierHeader';
import CashierSidebar from '@/components/CashierSidebar';
import SettingsModal from '@/components/SettingsModal';

/**
 * SANTARA POINT - POS INPUT (KASIR ROLE)
 * Fokus: Kecepatan Transaksi, Kemudahan Navigasi, & Notifikasi Nota Otomatis.
 */

const DEFAULT_SETTINGS = {
    storeName: 'Santara Point',
    storeTagline: 'Hidangan Lezat, Penuh Keberkahan.',
    whatsapp: '6285846802177',
    email: 'santarapoint@gmail.com',
    address: 'Jl. Raya Santara No. 123, Bandung',
    footerText: '© 2024 Santara Point. Berkah setiap saat.',
    // Info Perusahaan
    companyCategory: 'Retailer',
    companyField: 'Restoran',
    startDate: '',
    accountingPeriod: 'Januari - Desember',
    currency: 'IDR',
    // Pajak
    taxCompanyName: '',
    pkpDate: '',
    pkpNumber: '',
    companyType: 'PT',
    companyNpwp: '',
    klu: '',
    nitku: '',
    taxAddress: '',
    // Pengguna
    authorizedUsers: [
        { contact: 'santarapoint@gmail.com', role: 'Administrator' }
    ],
    // Pengaturan Pajak
    isPajakActive: true
};

const PRODUCTS = [
    { id: 7, name: 'Nasi Kuning', price: 15000, stock: 15, category: 'Makanan', img: '/nasi-kuning-baru.jpg', discountPercent: 10, rating: 4.8 },
    { id: 8, name: 'Nasi Uduk', price: 15000, stock: 20, category: 'Makanan', img: '/nasi-uduk-asli.jpg', discountPercent: 0, rating: 4.5 },
    { id: 9, name: 'Soto Ayam', price: 15000, stock: 15, category: 'Makanan', img: '/soto-ayam-asli.jpg', discountPercent: 0, rating: 4.7 },
    { id: 10, name: 'Bubur Ayam', price: 15000, stock: 20, category: 'Makanan', img: '/bubur-ayam-asli.jpg', discountPercent: 0, rating: 4.6 },
    { id: 11, name: 'Ketoprak', price: 15000, stock: 15, category: 'Makanan', img: '/ketoprak-asli.jpg', discountPercent: 15, rating: 4.9 },
    { id: 12, name: 'Nasi Ayam Pop', price: 16000, stock: 15, category: 'Makanan', img: '/nasi-ayam-pop-asli.jpg', discountPercent: 0, rating: 4.4 },
    { id: 13, name: 'Nasi Ayam Kecap', price: 16000, stock: 15, category: 'Makanan', img: '/nasi-ayam-kecap-asli.jpg', discountPercent: 0, rating: 4.3 },
    { id: 14, name: 'Nasi Ayam Balado', price: 16000, stock: 15, category: 'Makanan', img: '/nasi-ayam-balado-asli.jpg', discountPercent: 0, rating: 4.2 },
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

const categories = ['Semua', 'Makanan', 'Minuman', 'Snack', 'Frozen Food'];



function CashierPortalContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [cart, setCart] = useState([]);
    const [products, setProducts] = useState(PRODUCTS);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentTxId, setCurrentTxId] = useState(null);
    // Pajak Daerah strictly mandatory
    const [activeCategory, setActiveCategory] = useState('Semua');
    const [customerName, setCustomerName] = useState('');
    const [queueNumber, setQueueNumber] = useState('');
    const [orderNote, setOrderNote] = useState('');
    const [usedQueueNumbers, setUsedQueueNumbers] = useState([]);
    const [sortBy, setSortBy] = useState('default');
    const [activeShift, setActiveShift] = useState('Pagi (Zaid)');
    const [toppingModalProduct, setToppingModalProduct] = useState(null);
    const [isCartModalOpen, setIsCartModalOpen] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('');
    const [orderType, setOrderType] = useState('Dine-In');

    // --- State Standarisasi ---
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [activeSettingsTab, setActiveSettingsTab] = useState('profil');
    const [userProfile, setUserProfile] = useState({
        firstName: '',
        lastName: '',
        email: '',
        whatsapp: '',
        password: '••••••••',
        addresses: []
    });

    // --- State Perubahan Modals ---
    const [isChangeEmailOpen, setIsChangeEmailOpen] = useState(false);
    const [isChangeWhatsappOpen, setIsChangeWhatsappOpen] = useState(false);
    const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
    const [storeSettings, setStoreSettings] = useState(DEFAULT_SETTINGS);
    const [isWaitingOpen, setIsWaitingOpen] = useState(false);

    // --- State Perubahan Data (Inputs) ---
    const [newEmailInput, setNewEmailInput] = useState('');
    const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);
    const [newWhatsappInput, setNewWhatsappInput] = useState('');
    const [isUpdatingWhatsapp, setIsUpdatingWhatsapp] = useState(false);
    const [newPasswordInput, setNewPasswordInput] = useState('');
    const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
    // --- Function Hoisting (Standard Function Declarations for TDZ Safety) ---

    async function handleSaveProfile(e) {
        if (e) e.preventDefault();
        try {
            const { error } = await supabase.auth.updateUser({
                data: {
                    first_name: userProfile.firstName,
                    last_name: userProfile.lastName,
                    whatsapp: userProfile.whatsapp,
                    addresses: userProfile.addresses
                }
            });
            if (error) throw error;
            alert('Profil berhasil diperbarui!');
        } catch (err) {
            alert(err.message);
        }
    }

    async function handleConfirmEmailChange(e) {
        if (e) e.preventDefault();
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
    }

    async function handleConfirmWhatsappChange(e) {
        if (e) e.preventDefault();
        if (!newWhatsappInput || newWhatsappInput.length < 10) return alert('Nomor WhatsApp tidak valid.');
        setIsUpdatingWhatsapp(true);
        try {
            const { error } = await supabase.auth.updateUser({
                data: { whatsapp: newWhatsappInput }
            });
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
    }

    async function handleConfirmPasswordChange(e) {
        if (e) e.preventDefault();
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
    }

    function addAddress() {
        const newAddr = { id: Date.now(), label: '', details: '' };
        setUserProfile(prev => ({ ...prev, addresses: [...prev.addresses, newAddr] }));
    }

    function removeAddress(id) {
        setUserProfile(prev => ({ ...prev, addresses: prev.addresses.filter(a => a.id !== id) }));
    }

    function updateAddress(id, field, value) {
        setUserProfile(prev => ({
            ...prev,
            addresses: prev.addresses.map(a => a.id === id ? { ...a, [field]: value } : a)
        }));
    }

    function addToCart(product) {
        if (product.stock <= 0) return;
        if (product.id === 35) {
            setToppingModalProduct(product);
            return;
        }
        confirmAddToCart(product);
    }

    function confirmAddToCart(product, topping = null) {
        const finalId = topping && topping !== 'Tanpa Toping' ? `${product.id}-${topping}` : product.id;
        const finalName = topping && topping !== 'Tanpa Toping' ? `${product.name} (${topping})` : product.name;

        setCart(prev => {
            const exist = prev.find(x => x.id === finalId);
            if (exist) {
                return prev.map(x => x.id === finalId ? { ...x, quantity: x.quantity + 1 } : x);
            }
            return [...prev, { ...product, id: finalId, name: finalName, quantity: 1, originalId: product.id }];
        });
        setToppingModalProduct(null);
    }

    function updateQty(id, delta) {
        setCart(prev => prev.map(item => {
            if (item.id === id) {
                const newQty = Math.max(0, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        }).filter(item => item.quantity > 0));
    }

    function clearCart() {
        setCart([]);
        setCustomerName('');
        setQueueNumber('');
        setOrderNote('');
    }

    function handleCloseWaiting() {
        setIsWaitingOpen(false);
        setCurrentTxId(null);
        localStorage.removeItem('santaraActiveTxId');
        clearCart();
        setOrderType('Dine-In');
        setPaymentMethod('');
    }

    async function handlePayment() {
        if (cart.length === 0) return alert('Keranjang masih kosong!');
        if (!customerName || !queueNumber) return alert('Mohon lengkapi Nama Pemesan dan Nomor Antrian!');
        if (!paymentMethod) return alert('Mohon pilih Metode Pembayaran!');

        const trxId = 'TRX-' + Math.floor(Math.random() * 1000000);
        const newTransaction = {
            id: trxId,
            timestamp: new Date().toISOString(),
            customerName,
            queueNumber,
            orderType,
            keterangan: orderNote,
            paymentMethod,
            source: 'Kasir',
            cashierName: activeShift,
            totalAmount,
            pajak: pajakValue,
            status: 'Menunggu',
            items: cart.map(({ name, quantity, price }) => ({ name, quantity, price }))
        };

        try {
            const dbTrx = {
                id: newTransaction.id,
                timestamp: newTransaction.timestamp,
                customer_name: newTransaction.customerName,
                queue_number: newTransaction.queueNumber,
                order_type: newTransaction.orderType,
                keterangan: newTransaction.keterangan,
                payment_method: newTransaction.paymentMethod,
                source: newTransaction.source,
                cashier_name: newTransaction.cashierName,
                total_amount: newTransaction.totalAmount,
                pajak: newTransaction.pajak,
                status: newTransaction.status,
                items: newTransaction.items
            };
            const { error } = await supabase.from('transactions').insert([dbTrx]);
            if (error) throw error;

            localStorage.setItem('santaraActiveTxId', newTransaction.id);
            setCurrentTxId(newTransaction.id);
            setIsWaitingOpen(true);

            const newUsed = [...usedQueueNumbers, queueNumber];
            setUsedQueueNumbers(newUsed);
            localStorage.setItem('santaraUsedQueue', JSON.stringify(newUsed));

            const existingHistory = JSON.parse(localStorage.getItem('santaraTransactionHistory') || '[]');
            localStorage.setItem('santaraTransactionHistory', JSON.stringify([newTransaction, ...existingHistory]));

            generateReceiptPDF(newTransaction, storeSettings);
            alert(`Pembayaran ${paymentMethod} Berhasil! Struk telah dibuat.`);
        } catch (err) {
            console.error("Supabase sync failed (Cashier):", err);
            alert("Gagal memproses transaksi: " + err.message);
        }
    }

    React.useEffect(() => {
        const userRole = localStorage.getItem('currentUserRole');
        const userEmail = localStorage.getItem('registeredEmail');
        const isAuthorized = userRole === 'Operator' || userRole === 'Administrator' || (userEmail && userEmail.toLowerCase() === 'santarapoint@gmail.com');

        if (!isAuthorized) {
            router.push('/login');
            return;
        }

        async function fetchUserProfile() {
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
        }
        fetchUserProfile();

        const storedShift = localStorage.getItem('activeCashierShift');
        if (storedShift) setActiveShift(storedShift);

        const storedQueue = localStorage.getItem('santaraUsedQueue');
        if (storedQueue) setUsedQueueNumbers(JSON.parse(storedQueue));

        const storedProducts = localStorage.getItem('santaraProducts');
        if (storedProducts) {
            try {
                const localData = JSON.parse(storedProducts);
                const syncedProducts = PRODUCTS.map(p => {
                    const localMatch = localData.find(lp => lp.id === p.id);
                    return { ...p, stock: localMatch ? localMatch.stock : p.stock };
                });
                setProducts(syncedProducts);
                localStorage.setItem('santaraProducts', JSON.stringify(syncedProducts));
            } catch (e) {
                setProducts(PRODUCTS);
            }
        } else {
            setProducts(PRODUCTS);
            localStorage.setItem('santaraProducts', JSON.stringify(PRODUCTS));
        }

        const storedSettings = localStorage.getItem('santaraStoreSettings');
        if (storedSettings) {
            try {
                const parsed = JSON.parse(storedSettings);
                setStoreSettings({ ...DEFAULT_SETTINGS, ...parsed });
            } catch (e) { }
        }

        const activeTxId = localStorage.getItem('santaraActiveTxId');
        if (activeTxId) {
            setCurrentTxId(activeTxId);
            setIsWaitingOpen(true);
        }

        if (searchParams.get('settings') === 'true') {
            setIsSettingsOpen(true);
            if (searchParams.get('tab') === 'profile') setActiveSettingsTab('profil');
        }
    }, [router, searchParams]);

    const menuTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const subtotal = storeSettings.isPajakActive ? menuTotal / 1.10 : menuTotal;
    const pajakValue = storeSettings.isPajakActive ? Math.round(menuTotal - subtotal) : 0;
    const totalAmount = menuTotal;

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = activeCategory === 'Semua' || p.category === activeCategory;
        return matchesSearch && matchesCategory;
    }).sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
        if (sortBy === 'discount') return (b.discountPercent || 0) - (a.discountPercent || 0);
        return 0;
    });

    return (
        <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">

            {/* Standardized Sidebar */}
            <CashierSidebar 
                isOpen={isSidebarOpen} 
                setIsOpen={setIsSidebarOpen} 
                onOpenSettings={() => {
                    setActiveSettingsTab('profil');
                    setIsSettingsOpen(true);
                }}
            />

            {/* 2. Main Content: Grid Produk */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Standardized Header Kasir */}
                <CashierHeader 
                    storeName={storeSettings.storeName}
                    activeShift={activeShift}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    onSettingsClick={() => {
                        setActiveSettingsTab('profil');
                        setIsSettingsOpen(true);
                    }}
                    onMenuClick={() => setIsSidebarOpen(true)}
                />

                <div className="px-6 mt-6 flex items-center justify-between gap-4 overflow-x-auto">
                    <div className="flex gap-3 pb-2">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-6 py-2 rounded-full text-xs font-bold transition-all border whitespace-nowrap ${activeCategory === cat ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-100' : 'bg-white border-slate-200 text-slate-400 hover:border-emerald-600 hover:text-emerald-600'}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-2xl border border-slate-200 shadow-sm shrink-0 mb-2">
                        <ArrowUpDown size={14} className="text-slate-400" />
                        <select 
                            value={sortBy} 
                            onChange={(e) => setSortBy(e.target.value)}
                            className="text-[11px] font-black uppercase tracking-widest text-slate-600 outline-none bg-transparent cursor-pointer"
                        >
                            <option value="default">Urutkan</option>
                            <option value="price-low">Termurah</option>
                            <option value="price-high">Termahal</option>
                            <option value="rating">Rating</option>
                            <option value="discount">Diskon</option>
                        </select>
                    </div>
                </div>

                {/* Scrollable Products */}
                <section className="flex-1 overflow-y-auto p-6 scroll-smooth pb-20 lg:pb-6">
                    <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
                        {filteredProducts.map(product => (
                            <div
                                key={product.id}
                                onClick={() => addToCart(product)}
                                className="bg-white p-3 rounded-[2rem] shadow-sm hover:shadow-xl transition-all border border-transparent hover:border-emerald-500 cursor-pointer group flex flex-col"
                            >
                                <div className="h-36 rounded-[1.5rem] overflow-hidden mb-4 relative">
                                    <img src={product.img} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                                    <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition"></div>
                                    {product.discountPercent > 0 && (
                                        <div className="absolute top-2 left-2 bg-red-600 text-white text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest shadow-md z-10">
                                            -{product.discountPercent}%
                                        </div>
                                    )}
                                    {product.isNew && (
                                        <div className="absolute top-2 right-2 bg-red-500 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-md">
                                            NEW
                                        </div>
                                    )}
                                </div>
                                <div className="px-2 flex-1 flex flex-col justify-between">
                                    <div>
                                        <h4 className="font-bold text-slate-800 text-sm mb-1 line-clamp-2">{product.name}</h4>
                                        <div className="flex flex-col">
                                            {product.discountPercent > 0 && (
                                                <span className="text-[10px] font-bold line-through text-slate-400">Rp {product.originalPrice?.toLocaleString()}</span>
                                            )}
                                            <p className="text-emerald-600 font-black text-base italic">Rp {product.price.toLocaleString('id-ID')}</p>
                                        </div>
                                    </div>
                                    <div className="mt-3 flex items-center justify-between text-[10px] font-bold text-slate-400">
                                        <span>{product.category}</span>
                                        <span className={product.stock < 10 ? 'text-red-500' : ''}>Stok: {product.stock}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            {/* 3. Panel Transaksi (Right Sidebar) */}
            <aside className="hidden md:flex w-[350px] lg:w-[400px] bg-white border-l border-slate-100 flex-col shadow-2xl">
                <div className="p-5 lg:p-6 flex-1 overflow-y-auto">
                    <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-2">
                            <ShoppingBag className="text-emerald-600" size={20} />
                            <h3 className="text-lg font-bold text-slate-800 tracking-tight">Ringkasan Pesanan</h3>
                        </div>
                        <button
                            onClick={() => setCart([])}
                            className="text-[10px] font-bold text-red-500 hover:underline"
                        >
                            Bersihkan
                        </button>
                    </div>

                    {cart.length === 0 ? (
                        <div className="h-40 flex flex-col items-center justify-center text-slate-300 gap-2 italic">
                            <ShoppingCart size={40} className="opacity-20" />
                            <p className="text-xs">Silakan pilih menu</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {cart.map(item => (
                                <div key={item.id} className="flex items-center justify-between bg-slate-50 p-3.5 rounded-2xl border border-slate-100 hover:border-emerald-200 transition-all">
                                    <div className="flex-1">
                                        <h5 className="font-bold text-[13px] text-slate-800 leading-tight">{item.name}</h5>
                                        <p className="text-[10px] text-emerald-600 font-black mt-0.5">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2.5 bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
                                            <button onClick={() => updateQty(item.id, -1)} className="w-6 h-6 flex items-center justify-center bg-slate-50 rounded shadow-sm text-slate-400 hover:text-emerald-600 transition-colors">
                                                <Minus size={10} />
                                            </button>
                                            <span className="text-[12px] font-black w-4 text-center">{item.quantity}</span>
                                            <button onClick={() => addToCart(item)} className="w-6 h-6 flex items-center justify-center bg-slate-50 rounded shadow-sm text-slate-400 hover:text-emerald-600 transition-colors">
                                                <Plus size={10} />
                                            </button>
                                        </div>
                                        <button onClick={() => updateQty(item.id, -item.quantity)} className="text-slate-200 hover:text-red-400 transition-colors p-1">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Customer Details Form */}
                    <div className="mt-6 p-5 bg-slate-50 border border-slate-200 rounded-[24px] space-y-4 shadow-sm">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Keterangan Pesanan</h3>
                        <div className="space-y-3">
                            <input type="text" placeholder="Nama Pemesan" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full text-[13px] px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-slate-700" />
                            <select
                                value={queueNumber}
                                onChange={(e) => setQueueNumber(e.target.value)}
                                className="w-full text-[13px] px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-slate-700 cursor-pointer"
                            >
                                <option value="" disabled>Pilih Nomor Antrian</option>
                                {Array.from({ length: 100 }, (_, i) => i + 1).map(num => {
                                    const isUsed = usedQueueNumbers.includes(num.toString());
                                    return (
                                        <option key={num} value={num} disabled={isUsed}>
                                            Antrian {num} {isUsed ? '(Terpakai)' : ''}
                                        </option>
                                    );
                                })}
                            </select>
                            <select
                                value={orderType}
                                onChange={(e) => setOrderType(e.target.value)}
                                className="w-full text-[13px] px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-slate-700 cursor-pointer"
                            >
                                <option value="Dine-In">Dine-In</option>
                                <option value="Takeaway">Takeaway</option>
                            </select>
                            <textarea 
                                placeholder="Keterangan (Optional)..." 
                                value={orderNote} 
                                onChange={(e) => setOrderNote(e.target.value)} 
                                className="w-full text-[13px] px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-slate-700 min-h-[80px] resize-none"
                            ></textarea>
                        </div>
                    </div>
                </div>

                {/* Payment Summary Area */}
                <div className="p-5 lg:p-6 bg-slate-50 border-t border-slate-200">
                    <div className="space-y-3 mb-5">
                        <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
                            <span>Subtotal</span>
                            <span className="text-slate-800">Rp {subtotal.toLocaleString('id-ID')}</span>
                        </div>

                        {/* Kalkulator Pajak Daerah */}
                        {storeSettings.isPajakActive && (
                            <div className="space-y-2">
                                <div className="flex items-center justify-between p-3 rounded-xl border bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-900/10">
                                    <div className="flex items-center gap-3">
                                        <Calculator size={14} />
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black uppercase leading-none">Pajak Daerah (10%)</span>
                                        </div>
                                    </div>
                                    <span className="text-xs font-black">Rp {pajakValue.toLocaleString('id-ID')}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-between items-center mb-5">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Total Tagihan</span>
                        <span className="text-2xl font-black text-emerald-700 tracking-tight">Rp {totalAmount.toLocaleString('id-ID')}</span>
                    </div>

                    <div className="flex flex-col gap-2">
                        <select
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="w-full text-xs px-3 py-3 bg-white border-2 border-emerald-600 rounded-xl outline-none focus:ring-4 focus:ring-emerald-50 font-black text-emerald-700 cursor-pointer uppercase tracking-widest text-center appearance-none"
                        >
                            <option value="" disabled>Pilih Pembayaran</option>
                            <option value="Tunai">Tunai</option>
                            <option value="Transfer">Transfer</option>
                        </select>
                        <button
                            onClick={handlePayment}
                            disabled={cart.length === 0}
                            className="w-full py-3 rounded-xl bg-emerald-600 text-white font-black text-xs uppercase tracking-widest hover:bg-emerald-700 shadow-lg shadow-emerald-100 transition-all active:scale-95 disabled:opacity-50"
                        >
                            Selesaikan Pesanan
                        </button>

                        {/* Customer Lookup Link */}
                        <button className="flex items-center justify-center gap-2 text-[10px] font-bold text-slate-400 hover:text-emerald-600 py-1.5 transition-colors">
                            <UserCircle size={14} /> Cari Data Customer
                        </button>
                    </div>
                </div>
            </aside>
            {/* Floating Cart Button (Mobile Only) */}
            <div className="md:hidden fixed bottom-24 right-6 z-40">
                <button
                    onClick={() => setIsCartModalOpen(true)}
                    className="relative bg-emerald-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all outline-none"
                >
                    <ShoppingBag size={24} />
                    {cart.length > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-black w-6 h-6 flex items-center justify-center rounded-full border-2 border-white animate-bounce">
                            {cart.length}
                        </span>
                    )}
                </button>
            </div>


            {/* Cart Modal for Mobile (Cashier) */}
            {isCartModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] md:hidden">
                    <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[2.5rem] h-[90vh] flex flex-col overflow-hidden shadow-2xl">
                        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h3 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                                <ShoppingBag size={20} className="text-emerald-600" />
                                Pesanan Baru
                            </h3>
                            <button onClick={() => setIsCartModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6 bg-white space-y-6">
                            {cart.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-slate-300 opacity-50 py-10">
                                    <ShoppingBag size={64} className="mb-4" />
                                    <p className="font-bold">Keranjang kosong</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {cart.map(item => (
                                        <div key={item.id} className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                                            <div className="flex-1">
                                                <h4 className="font-bold text-sm text-slate-800">{item.name}</h4>
                                                <p className="text-xs text-emerald-600 font-black mt-0.5">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</p>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-2.5 bg-slate-50 p-1 rounded-xl border border-slate-200 shadow-sm">
                                                    <button onClick={() => updateQty(item.id, -1)} className="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 rounded-lg text-slate-600 shadow-sm">
                                                        <Minus size={14} />
                                                    </button>
                                                    <span className="text-sm font-black w-5 text-center">{item.quantity}</span>
                                                    <button onClick={() => addToCart(item)} className="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 rounded-lg text-slate-600 shadow-sm">
                                                        <Plus size={14} />
                                                    </button>
                                                </div>
                                                <button onClick={() => updateQty(item.id, -item.quantity)} className="text-slate-300 hover:text-red-500 p-1">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}

                                    <div className="pt-6 space-y-4">
                                        <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                            <h3 className="text-[10px] font-black text-slate-800 uppercase mb-1">Data Pemesan</h3>
                                            <input type="text" placeholder="Nama Pemesan" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full text-sm px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold" />
                                            <select
                                                value={queueNumber}
                                                onChange={(e) => setQueueNumber(e.target.value)}
                                                className="w-full text-sm px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                                            >
                                                <option value="" disabled>Pilih Nomor Antrian</option>
                                                {Array.from({ length: 100 }, (_, i) => i + 1).map(num => {
                                                    const isUsed = usedQueueNumbers.includes(num.toString());
                                                    return (
                                                        <option key={num} value={num} disabled={isUsed}>
                                                            Antrian {num} {isUsed ? '(Terpakai)' : ''}
                                                        </option>
                                                    );
                                                })}
                                            </select>
                                        </div>

                                        <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-xl">
                                            <div className="flex justify-between items-center mb-6">
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic mb-1">Total Tunai</span>
                                                    <span className="text-2xl font-black text-emerald-400 tracking-tighter">Rp {totalAmount.toLocaleString('id-ID')}</span>
                                                </div>
                                             <div className="flex flex-col items-end gap-1">
                                                {storeSettings.isPajakActive && (
                                                    <div className="text-[8px] font-black uppercase tracking-wider px-2 py-1 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                                        Pajak (10%)
                                                    </div>
                                                )}
                                            </div>
                                            </div>
                                            <div className="space-y-3 pb-4">
                                                <select
                                                    value={paymentMethod}
                                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                                    className="w-full text-xs px-4 py-3 bg-white/10 border border-white/20 rounded-xl outline-none focus:border-white font-black text-white uppercase tracking-widest text-center"
                                                >
                                                    <option value="" disabled className="text-slate-800">Metode Pembayaran</option>
                                                    <option value="Tunai" className="text-slate-800">Tunai</option>
                                                    <option value="Transfer" className="text-slate-800">Transfer</option>
                                                </select>
                                                <button
                                                    onClick={() => {
                                                        setIsCartModalOpen(false);
                                                        handlePayment();
                                                    }}
                                                    className="w-full py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-emerald-500/20 transition-all active:scale-95"
                                                >
                                                    Proses Pembayaran
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
            {toppingModalProduct && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl relative">
                        <button onClick={() => setToppingModalProduct(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                            <X size={20} />
                        </button>
                        <h3 className="text-xl font-black text-slate-800 mb-2">Pilih Toping</h3>
                        <p className="text-sm text-slate-500 mb-6">Pilih varian toping untuk {toppingModalProduct.name}</p>
                        <div className="flex flex-col gap-3">
                            {['Vanilla', 'Coklat', 'Mocca', 'Matcha', 'Tanpa Toping'].map(toping => (
                                <button
                                    key={toping}
                                    onClick={() => confirmAddToCart(toppingModalProduct, toping)}
                                    className="p-3 w-full text-left font-bold text-slate-700 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl transition-all border border-slate-100 hover:border-emerald-200"
                                >
                                    {toping}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
            {/* Tracking Overlay */}
            <WaitingOverlay 
                isOpen={isWaitingOpen}
                onClose={handleCloseWaiting}
                customerName={customerName}
                totalAmount={totalAmount}
                transactionId={currentTxId}
            />
            <SettingsModal 
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                isAdmin={false}
                activeTab={activeSettingsTab}
                setActiveTab={setActiveSettingsTab}
                userProfile={userProfile}
                setUserProfile={setUserProfile}
                handleSaveProfile={handleSaveProfile}
                storeSettings={storeSettings}
                setStoreSettings={setStoreSettings}
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

export default function CashierPOSPage() {
    return (
        <Suspense fallback={<div className="h-screen w-screen flex items-center justify-center bg-slate-50"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div></div>}>
            <CashierPortalContent />
        </Suspense>
    );
}
