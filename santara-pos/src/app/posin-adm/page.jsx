"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { generateReceiptPDF } from '@/lib/receiptPdf';
import {
    LayoutDashboard,
    Home,
    ShoppingBag,
    ShieldCheck,
    Search,
    Plus,
    Minus,
    Trash2,
    Calculator,
    ChevronRight,
    Package,
    TrendingUp,
    AlertCircle,
    MessageCircle,
    Mail,
    LogOut,
    ClipboardList,
    Settings,
    ArrowUpDown,
    Store,
    ChefHat,
    CreditCard,
    UserCircle,
    X,
    MapPin,
    Phone,
    PlusCircle,
    ArrowLeft,
    Image as ImageIcon,
    History,
    Package as PackageIcon,
    Calendar,
    ChevronDown,
    Tag,
    Landmark,
    BookOpen,
    Building2,
    Briefcase,
    Globe,
    FileText,
    Coins,
    Clock,
    Users,
    UserPlus
} from 'lucide-react';

/**
 * SANTARA POINT - POS INPUT (OWNER ROLE)
 * Fokus: Manajemen Stok Presisi, Kontrol Operasional, & Transaksi Cepat.
 */

const INITIAL_PRODUCTS = [
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

export default function App() {
    const router = useRouter();
    const [products, setProducts] = useState(INITIAL_PRODUCTS);
    const [cart, setCart] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    // Pajak Daerah strictly mandatory
    const [activeCategory, setActiveCategory] = useState('Semua');
    const [customerName, setCustomerName] = useState('');
    const [queueNumber, setQueueNumber] = useState('');
    const [sortBy, setSortBy] = useState('default');
    const [orderNote, setOrderNote] = useState('');
    const [usedQueueNumbers, setUsedQueueNumbers] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState('');
    const [orderType, setOrderType] = useState('Dine-In');
    const [toppingModalProduct, setToppingModalProduct] = useState(null);
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
    const [settingsTab, setSettingsTab] = useState('info'); // 'info', 'tax', or 'users'
    const [newUserContact, setNewUserContact] = useState('');
    const [newUserRole, setNewUserRole] = useState('Operator');
    const [isCartModalOpen, setIsCartModalOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [storeSettings, setStoreSettings] = useState(DEFAULT_SETTINGS);

    React.useEffect(() => {
        // Security Check
        const userRole = localStorage.getItem('currentUserRole');
        if (userRole !== 'Administrator') {
            console.log('Access denied: Role is', userRole);
            router.push('/login');
            return;
        }

        const stored = localStorage.getItem('santaraUsedQueue');
        if (stored) {
            try { setUsedQueueNumbers(JSON.parse(stored)); } catch (e) { }
        }

        const storedProducts = localStorage.getItem('santaraProducts');
        if (storedProducts) {
            try { setProducts(JSON.parse(storedProducts)); } catch (e) { }
        } else {
            localStorage.setItem('santaraProducts', JSON.stringify(INITIAL_PRODUCTS));
        }

        const storedSettings = localStorage.getItem('santaraStoreSettings');
        if (storedSettings) {
            try {
                const parsed = JSON.parse(storedSettings);
                setStoreSettings({ ...DEFAULT_SETTINGS, ...parsed });
            } catch (e) {
                console.error("Error parsing settings", e);
            }
        } else {
            localStorage.setItem('santaraStoreSettings', JSON.stringify(DEFAULT_SETTINGS));
        }
    }, []);

    // --- Logika Perhitungan (Inclusive Pajak 10%) ---
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

    // --- Handler Keranjang ---
    const addToCart = (product) => {
        if (product.stock <= 0) return;
        if (product.id === 35) {
            setToppingModalProduct(product);
            return;
        }
        confirmAddToCart(product);
    };

    const confirmAddToCart = (product, topping = null) => {
        const finalId = topping && topping !== 'Tanpa Toping' ? `${product.id}-${topping}` : product.id;
        const finalName = topping && topping !== 'Tanpa Toping' ? `${product.name} (${topping})` : product.name;

        const exist = cart.find(x => x.id === finalId);
        if (exist) {
            setCart(cart.map(x => x.id === finalId ? { ...x, quantity: x.quantity + 1 } : x));
        } else {
            setCart([...cart, { ...product, id: finalId, name: finalName, quantity: 1, originalId: product.id }]);
        }
        setToppingModalProduct(null);
    };

    const removeFromCart = (id) => {
        setCart(cart.filter(item => item.id !== id));
    };

    const updateQty = (id, delta) => {
        setCart(cart.map(item => {
            if (item.id === id) {
                const newQty = Math.max(0, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        }).filter(item => item.quantity > 0));
    };

    const handleCheckout = () => {
        if (cart.length === 0) return alert('Keranjang masih kosong!');
        if (!customerName || !queueNumber) return alert('Mohon lengkapi Nama Pemesan dan Nomor Antrian!');
        if (!paymentMethod) return alert('Mohon pilih Metode Pembayaran!');

        const newUsed = [...usedQueueNumbers, queueNumber];
        setUsedQueueNumbers(newUsed);
        localStorage.setItem('santaraUsedQueue', JSON.stringify(newUsed));

        const newTransaction = {
            id: 'TRX-' + Math.floor(Math.random() * 1000000),
            timestamp: new Date().toISOString(),
            customerName,
            queueNumber,
            orderType,
            keterangan: orderNote,
            paymentMethod,
            source: 'Owner',
            cashierName: 'Admin',
            totalAmount,
            pajak: pajakValue,
            status: 'Menunggu',
            items: cart.map(({ name, quantity, price }) => ({ name, quantity, price }))
        };
        const existingHistory = JSON.parse(localStorage.getItem('santaraTransactionHistory') || '[]');
        localStorage.setItem('santaraTransactionHistory', JSON.stringify([newTransaction, ...existingHistory]));

        // Generate PDF Receipt
        generateReceiptPDF(newTransaction, storeSettings);

        alert(`Transaksi ${paymentMethod} Berhasil!\nNama: ${customerName}\nAntrian: ${queueNumber}\nTotal: Rp ${totalAmount.toLocaleString('en-US')}\nNota/Struk telah berhasil dibuat.`);
        // Reset state setelah simulasi
        setCart([]);
        setCustomerName('');
        setQueueNumber('');
        setOrderNote('');
        setOrderType('Dine-In');
        setPaymentMethod('');
    };

    return (
        <div className="flex flex-col lg:flex-row h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden relative">
            
            {/* Mobile Header (Visible only on mobile/tablet) */}
            <header className="lg:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between z-40">
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-600"
                    >
                        <Menu size={24} />
                    </button>
                    <div className="flex items-center gap-2">
                        <img src="/santara-logo.png" alt="Santara" className="w-6 h-6 object-contain" />
                        <span className="font-black text-sm italic uppercase tracking-tighter">SANTARA OPS</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-[8px] font-black uppercase border border-amber-200 flex items-center gap-1 shrink-0">
                        <ShieldCheck size={10} /> Syariah
                    </div>
                </div>
            </header>

            {/* 1. Sidebar Navigasi (Desktop: Permanent, Mobile: Drawer) */}
            {/* Backdrop for Mobile Sidebar */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] lg:hidden animate-fade-in"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            <aside className={`
                fixed lg:relative inset-y-0 left-0 w-72 lg:w-64 bg-emerald-900 text-white flex flex-col z-[70] transition-transform duration-300 shadow-2xl
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="p-6 flex items-center justify-between border-b border-emerald-800">
                    <div className="flex items-center gap-3">
                        <button onClick={() => router.push('/homepage')} className="bg-white p-1.5 rounded-lg flex items-center justify-center hover:scale-105 transition-transform cursor-pointer" title="Ke Beranda">
                            <img src="/santara-logo.png" alt="Santara" className="w-6 h-6 object-contain" />
                        </button>
                        <span className="font-black tracking-tighter text-xl italic uppercase">SANTARA OPS</span>
                    </div>
                    <button 
                        onClick={() => setIsSidebarOpen(false)}
                        className="lg:hidden p-2 hover:bg-emerald-800 rounded-xl transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {[
                        { icon: <LayoutDashboard size={20} />, label: "Dashboard", active: false, action: () => alert('Dashboard akan segera hadir!') },
                        { icon: <ShoppingBag size={20} />, label: "POS Kasir", active: true, action: () => { } },
                        { icon: <Tag size={20} />, label: "Penjualan", active: false, action: () => router.push('/penjualan') },
                        { icon: <Landmark size={20} />, label: "Kas \u0026 Bank", active: false, action: () => router.push('/kas-bank') },
                        { icon: <BookOpen size={20} />, label: "Buku Besar", active: false, action: () => router.push('/buku-besar') },
                        { icon: <Building2 size={20} />, label: "Perusahaan", active: false, action: () => router.push('/perusahaan') },
                        { icon: <ChefHat size={20} />, label: "Daftar Antrean", active: false, action: () => router.push('/waiting-list') },
                        { icon: <Package size={20} />, label: "Persediaan", active: false, action: () => router.push('/persediaan') },
                        { icon: <ClipboardList size={20} />, label: "Manajemen Stok", active: false, action: () => router.push('/manajemen-stok') },
                        { icon: <ShoppingBag size={20} />, label: "Pembelian", active: false, action: () => router.push('/pembelian') },
                        { icon: <TrendingUp size={20} />, label: "Laporan Keuangan", active: false, action: () => router.push('/history?role=admin') },
                        { icon: <Settings size={20} />, label: "Pengaturan Toko", active: false, action: () => setIsSettingsModalOpen(true) },
                    ].map((item, i) => (
                        <button
                            key={i}
                            onClick={item.action}
                            className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all cursor-pointer group ${item.active ? 'bg-emerald-600 shadow-lg shadow-emerald-950/20 text-white' : 'hover:bg-emerald-800 text-emerald-300 hover:text-white'}`}
                        >
                            <div className={`${item.active ? 'text-white' : 'text-emerald-400 group-hover:text-white'} transition-colors`}>
                                {item.icon}
                            </div>
                            <span className="font-bold text-sm tracking-tight">{item.label}</span>
                        </button>
                    ))}
                </nav>
                <div className="p-4 border-t border-emerald-800">
                    <button onClick={() => window.location.href = '/login'} className="w-full flex items-center gap-4 p-3 rounded-xl text-red-300 hover:bg-red-500/10 hover:text-red-400 transition-all font-bold text-sm">
                        <LogOut size={20} />
                        <span>Keluar</span>
                    </button>
                </div>
            </aside>

            {/* 2. Area Utama Produk */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Header Dashboard */}
                <header className="bg-white border-b border-slate-200 p-4 lg:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="hidden lg:block">
                        <div className="flex items-center gap-2 mb-1">
                            <h2 className="text-2xl font-black text-slate-800 tracking-tight">{storeSettings.storeName}</h2>
                            <div className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded flex items-center gap-1 text-[10px] font-black uppercase border border-amber-200">
                                <ShieldCheck size={12} /> Syariah Verified
                            </div>
                        </div>
                        <p className="text-slate-400 text-xs font-medium">Selamat Bekerja, <span className="text-emerald-700 font-bold">Owner {storeSettings.storeName}</span></p>
                    </div>

                    <div className="relative w-full md:w-96 lg:w-[450px]">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Cari menu, kategori, atau kode..."
                            className="w-full pl-12 pr-4 py-3 bg-slate-100 border-none rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm font-medium"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </header>

                <div className="px-4 lg:px-10 mt-4 lg:mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between overflow-x-auto gap-4">
                    <div className="flex gap-2 lg:gap-3 pb-2 overflow-x-auto no-scrollbar">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-4 lg:px-6 py-2 rounded-xl text-[11px] lg:text-xs font-bold transition-all border whitespace-nowrap ${activeCategory === cat ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg' : 'bg-white border-slate-200 text-slate-400 hover:border-emerald-600 hover:text-emerald-600'}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-sm shrink-0 mb-2">
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

                {/* Grid Produk */}
                <section className="flex-1 overflow-y-auto p-4 lg:p-10 pb-32 lg:pb-10">
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 lg:gap-5">
                        {filteredProducts.map(product => (
                            <div
                                key={product.id}
                                onClick={() => addToCart(product)}
                                className={`bg-white p-2 lg:p-3 rounded-[1.5rem] lg:rounded-[2rem] shadow-sm hover:shadow-xl transition-all border border-transparent hover:border-emerald-500 cursor-pointer group flex flex-col ${product.stock <= 0 ? 'opacity-50 grayscale' : ''}`}
                            >
                                <div className="h-28 lg:h-36 rounded-xl lg:rounded-[1.5rem] overflow-hidden mb-3 lg:mb-4 relative">
                                    <img src={product.img} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                                    <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition"></div>
                                    {product.discountPercent > 0 && (
                                        <div className="absolute top-2 left-2 bg-red-600 text-white text-[8px] lg:text-[9px] font-black px-1.5 lg:px-2.5 py-0.5 lg:py-1 rounded-full uppercase tracking-widest shadow-md z-10">
                                            -{product.discountPercent}%
                                        </div>
                                    )}
                                </div>
                                <div className="px-1 lg:px-2 flex-1 flex flex-col justify-between">
                                    <div>
                                        <h4 className="font-bold text-slate-800 text-[11px] lg:text-sm line-clamp-2 leading-tight mb-1">{product.name}</h4>
                                        <p className="text-emerald-700 font-black text-xs lg:text-base italic">Rp {product.price.toLocaleString('en-US')}</p>
                                    </div>
                                    <div className="mt-2 flex items-center justify-between text-[9px] lg:text-[10px] font-bold text-slate-400">
                                        <span className={`flex items-center gap-1 ${product.stock < 10 ? 'text-red-500' : ''}`}>
                                            Stok: {product.stock}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            {/* Floating Cart Button (Mobile Only) */}
            <div className="md:hidden fixed bottom-24 right-5 z-40">
                <button
                    onClick={() => setIsCartModalOpen(true)}
                    className="relative bg-emerald-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all outline-none border-2 border-white/20"
                >
                    <ShoppingCart size={24} />
                    {cart.length > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-black w-6 h-6 flex items-center justify-center rounded-full border-2 border-white animate-bounce">
                            {cart.length}
                        </span>
                    )}
                </button>
            </div>

            {/* Mobile Bottom Navigation Bar */}
            <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-emerald-900 border-t border-emerald-800 px-4 py-3 flex justify-between items-center z-40 shadow-[0_-10px_20px_rgba(0,0,0,0.1)] text-emerald-300">
                <button onClick={() => router.push('/homepage')} className="flex flex-col items-center gap-1">
                    <Home size={18} />
                    <span className="text-[9px] font-bold uppercase">Beranda</span>
                </button>
                <button className="flex flex-col items-center gap-1 text-white">
                    <ShoppingBag size={18} />
                    <span className="text-[9px] font-bold uppercase">POS</span>
                </button>
                <button onClick={() => router.push('/waiting-list')} className="flex flex-col items-center gap-1">
                    <ChefHat size={18} />
                    <span className="text-[9px] font-bold uppercase">Antrean</span>
                </button>
                <button onClick={() => router.push('/manajemen-stok')} className="flex flex-col items-center gap-1">
                    <ClipboardList size={18} />
                    <span className="text-[9px] font-bold uppercase">Stok</span>
                </button>
                <button onClick={() => router.push('/pembelian')} className="flex flex-col items-center gap-1">
                    <ShoppingBag size={18} />
                    <span className="text-[9px] font-bold uppercase">Beli</span>
                </button>
                <button onClick={() => setIsSettingsModalOpen(true)} className="flex flex-col items-center gap-1">
                    <Settings size={18} />
                    <span className="text-[9px] font-bold uppercase">Toko</span>
                </button>
            </nav>

            {/* 3. Panel Ringkasan Transaksi (Sidebar Kanan - Desktop) */}
            <aside className="hidden md:flex w-[350px] lg:w-[400px] bg-white border-l border-slate-200 flex flex-col shadow-2xl relative z-10">
                <div className="p-5 lg:p-6 flex-1 overflow-y-auto">
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="text-xl font-black text-slate-800 tracking-tight">Ringkasan Pesanan</h3>
                        <span className="bg-slate-100 px-3 py-1 rounded-full text-[10px] font-bold text-slate-500 tracking-wider uppercase">
                            {cart.length} Item
                        </span>
                    </div>

                    {cart.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-slate-300 opacity-50 italic py-10">
                            <ShoppingBag size={48} className="mb-3" />
                            <p className="text-xs font-bold">Belum ada pesanan terpilih</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {cart.map(item => (
                                <div key={item.id} className="flex items-center justify-between bg-slate-800 p-4 rounded-2xl border border-slate-700 hover:border-emerald-500/50 transition-all">
                                    <div className="flex-1">
                                        <h5 className="font-bold text-[13px] text-slate-100 leading-tight">{item.name}</h5>
                                        <p className="text-[10px] text-emerald-400 font-black mt-0.5">Rp {(item.price * item.quantity).toLocaleString('en-US')}</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2.5 bg-slate-900/50 p-1 rounded-lg border border-slate-700 shadow-sm">
                                            <button onClick={() => updateQty(item.id, -1)} className="w-6 h-6 flex items-center justify-center bg-slate-800 rounded shadow-sm text-slate-400 hover:text-emerald-500 transition-colors">
                                                <Minus size={10} />
                                            </button>
                                            <span className="text-[12px] font-black w-4 text-center text-slate-100">{item.quantity}</span>
                                            <button onClick={() => addToCart(item)} className="w-6 h-6 flex items-center justify-center bg-slate-800 rounded shadow-sm text-slate-400 hover:text-emerald-500 transition-colors">
                                                <Plus size={10} />
                                            </button>
                                        </div>
                                        <button onClick={() => updateQty(item.id, -item.quantity)} className="text-slate-500 hover:text-red-400 transition-colors p-1">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Customer Details Form */}
                    <div className="mt-6 p-5 bg-slate-800 border border-slate-700 rounded-[24px] space-y-4 shadow-sm">
                        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Keterangan Pesanan</h3>
                        <div className="space-y-3">
                            <input type="text" placeholder="Nama Pemesan" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full text-[13px] px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-slate-200" />
                            <select
                                value={queueNumber}
                                onChange={(e) => setQueueNumber(e.target.value)}
                                className="w-full text-[13px] px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-slate-200 cursor-pointer"
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
                                className="w-full text-[13px] px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-slate-200 cursor-pointer"
                            >
                                <option value="Dine-In">Dine-In</option>
                                <option value="Takeaway">Takeaway</option>
                            </select>
                            <textarea
                                placeholder="Keterangan (Optional)..."
                                value={orderNote}
                                onChange={(e) => setOrderNote(e.target.value)}
                                className="w-full text-[13px] px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-slate-200 min-h-[80px] resize-none"
                            ></textarea>
                        </div>
                    </div>
                </div>

                {/* Bagian Pembayaran & Ringkasan */}
                <div className="p-5 lg:p-6 bg-slate-900 border-t border-slate-800 text-white shadow-[0_-10px_40px_rgba(0,0,0,0.15)] relative z-20">
                    <div className="space-y-3 mb-5">
                        <div className="flex justify-between text-slate-400 font-bold text-xs tracking-widest uppercase mb-2">
                            <span>Subtotal</span>
                            <span>Rp {subtotal.toLocaleString('en-US')}</span>
                        </div>

                        {/* KALKULATOR PAJAK DAERAH */}
                        <div className="space-y-2">
                            <div className={`flex items-center justify-between p-3 rounded-xl transition-all border ${storeSettings.isPajakActive ? 'bg-emerald-600/20 border-emerald-500' : 'bg-slate-800 border-slate-700 opacity-50'}`}>
                                <div className="flex items-center gap-3">
                                    <div className={`p-1.5 rounded-lg ${storeSettings.isPajakActive ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-500'}`}>
                                        <Calculator size={14} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-wider leading-none mb-0.5">Pajak Daerah (10%)</p>
                                    </div>
                                </div>
                                <span className={`text-xs font-black ${storeSettings.isPajakActive ? 'text-emerald-400' : 'text-slate-500'}`}>
                                    {storeSettings.isPajakActive ? `Rp ${pajakValue.toLocaleString('en-US')}` : 'Nonaktif'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-between items-center mb-5">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Total Akhir</span>
                        <span className="text-2xl font-black text-white">Rp {totalAmount.toLocaleString('en-US')}</span>
                    </div>

                    <div className="flex flex-col gap-2">
                        <select
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="w-full text-xs px-3 py-3 bg-slate-800 border-2 border-slate-700 rounded-xl outline-none focus:border-slate-500 font-black text-white cursor-pointer uppercase tracking-widest text-center appearance-none"
                        >
                            <option value="" disabled>Pilih Pembayaran</option>
                            <option value="Tunai">Tunai</option>
                            <option value="Transfer">Transfer</option>
                        </select>
                        <button
                            onClick={handleCheckout}
                            disabled={cart.length === 0}
                            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-900/40 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100"
                        >
                            Selesaikan Pesanan
                        </button>
                    </div>
                </div>
            </aside>

            {/* 4. Topping Modal (Universal) */}
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

            {/* 5. Settings Modal (Global) */}
            {isSettingsModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        {/* Header Modal */}
                        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <div>
                                <h3 className="text-2xl font-black text-slate-800 tracking-tight">Pengaturan Toko</h3>
                                <p className="text-slate-400 text-sm font-medium">Sesuaikan identitas dan operasional toko Anda</p>
                            </div>
                            <button onClick={() => setIsSettingsModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        {/* TABS Navigation */}
                        <div className="flex bg-slate-100 p-2 mx-8 mt-6 rounded-2xl shrink-0">
                            <button
                                onClick={() => setSettingsTab('info')}
                                className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${settingsTab === 'info' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                <Building2 size={16} />
                                Info Perusahaan
                            </button>
                            <button
                                onClick={() => setSettingsTab('tax')}
                                className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${settingsTab === 'tax' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                <Calculator size={16} />
                                Pajak
                            </button>
                            <button
                                onClick={() => setSettingsTab('users')}
                                className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${settingsTab === 'users' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                <Users size={16} />
                                Pengguna
                            </button>
                        </div>

                        <div className="p-8 overflow-y-auto space-y-6 flex-1">
                            {settingsTab === 'info' ? (
                                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Nama Usaha</label>
                                            <div className="relative">
                                                <Store className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500" size={18} />
                                                <input
                                                    type="text"
                                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-slate-700"
                                                    value={storeSettings.storeName}
                                                    onChange={(e) => setStoreSettings({ ...storeSettings, storeName: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Kategori Usaha</label>
                                            <div className="relative">
                                                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500" size={18} />
                                                <select
                                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-slate-700 appearance-none cursor-pointer"
                                                    value={storeSettings.companyCategory}
                                                    onChange={(e) => setStoreSettings({ ...storeSettings, companyCategory: e.target.value })}
                                                >
                                                    <option value="Manufaktur">Manufaktur</option>
                                                    <option value="Distributor">Distributor</option>
                                                    <option value="Grosir/Wholesaler">Grosir/Wholesaler</option>
                                                    <option value="Retailer">Retailer</option>
                                                    <option value="Jasa/Service">Jasa/Service</option>
                                                </select>
                                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Bidang Usaha</label>
                                            <div className="relative">
                                                <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500" size={18} />
                                                <select
                                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-slate-700 appearance-none cursor-pointer"
                                                    value={storeSettings.companyField}
                                                    onChange={(e) => setStoreSettings({ ...storeSettings, companyField: e.target.value })}
                                                >
                                                    <option value="Restoran">Restoran</option>
                                                    <option value="Cafe">Cafe</option>
                                                    <option value="Toko Kelontong">Toko Kelontong</option>
                                                    <option value="Fashion">Fashion</option>
                                                    <option value="Teknologi">Teknologi</option>
                                                    <option value="Pendidikan">Pendidikan</option>
                                                    <option value="Kesehatan">Kesehatan</option>
                                                    <option value="Lainnya">Lainnya</option>
                                                </select>
                                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Telepon</label>
                                            <div className="relative">
                                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500" size={18} />
                                                <input
                                                    type="text"
                                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-slate-700"
                                                    value={storeSettings.whatsapp}
                                                    onChange={(e) => setStoreSettings({ ...storeSettings, whatsapp: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email</label>
                                            <div className="relative">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500" size={18} />
                                                <input
                                                    type="email"
                                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-slate-700"
                                                    value={storeSettings.email}
                                                    onChange={(e) => setStoreSettings({ ...storeSettings, email: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Tanggal Mulai Data</label>
                                            <div className="relative">
                                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500" size={18} />
                                                <input
                                                    type="date"
                                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-slate-700"
                                                    value={storeSettings.startDate}
                                                    onChange={(e) => setStoreSettings({ ...storeSettings, startDate: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Periode Akuntansi</label>
                                            <div className="relative">
                                                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500" size={18} />
                                                <input
                                                    type="text"
                                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-slate-700"
                                                    placeholder="Januari - Desember"
                                                    value={storeSettings.accountingPeriod}
                                                    onChange={(e) => setStoreSettings({ ...storeSettings, accountingPeriod: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Mata Uang</label>
                                            <div className="relative">
                                                <Coins className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500" size={18} />
                                                <select
                                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-slate-700 appearance-none cursor-pointer"
                                                    value={storeSettings.currency}
                                                    onChange={(e) => setStoreSettings({ ...storeSettings, currency: e.target.value })}
                                                >
                                                    <option value="IDR">IDR - Rupiah Indonesia</option>
                                                    <option value="USD">USD - US Dollar</option>
                                                    <option value="MYR">MYR - Ringgit Malaysia</option>
                                                    <option value="SGD">SGD - Singapore Dollar</option>
                                                </select>
                                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Alamat Toko</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-4 top-4 text-emerald-500" size={18} />
                                            <textarea
                                                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-slate-700 min-h-[80px]"
                                                value={storeSettings.address}
                                                onChange={(e) => setStoreSettings({ ...storeSettings, address: e.target.value })}
                                            ></textarea>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Teks Footer (Nota/Web)</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-slate-700"
                                            value={storeSettings.footerText}
                                            onChange={(e) => setStoreSettings({ ...storeSettings, footerText: e.target.value })}
                                        />
                                    </div>
                                </div>
                            ) : settingsTab === 'tax' ? (
                                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <div className="bg-emerald-50 p-6 rounded-[2rem] border border-emerald-100 flex items-center justify-between group">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-white rounded-2xl shadow-sm text-emerald-600">
                                                <Calculator size={24} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-800 text-sm">Aktifkan Pajak Daerah (10%)</h4>
                                                <p className="text-[10px] text-slate-400 font-medium tracking-tight">Hitung breakdown pajak 10% (Inclusive) pada setiap transaksi</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setStoreSettings({ ...storeSettings, isPajakActive: !storeSettings.isPajakActive })}
                                            className={`w-14 h-8 rounded-full transition-all relative ${storeSettings.isPajakActive ? 'bg-emerald-600' : 'bg-slate-300'}`}
                                        >
                                            <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all shadow-sm ${storeSettings.isPajakActive ? 'right-1' : 'left-1'}`} />
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Nama Perusahaan</label>
                                            <div className="relative">
                                                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500" size={18} />
                                                <input
                                                    type="text"
                                                    className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-slate-700 shadow-sm"
                                                    value={storeSettings.taxCompanyName || ''}
                                                    onChange={(e) => setStoreSettings({ ...storeSettings, taxCompanyName: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Tanggal Pengukuhan PKP</label>
                                            <div className="relative">
                                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500" size={18} />
                                                <input
                                                    type="date"
                                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-slate-700"
                                                    value={storeSettings.pkpDate}
                                                    onChange={(e) => setStoreSettings({ ...storeSettings, pkpDate: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">No. Pengukuhan PKP</label>
                                            <div className="relative">
                                                <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500" size={18} />
                                                <input
                                                    type="text"
                                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-slate-700"
                                                    value={storeSettings.pkpNumber}
                                                    onChange={(e) => setStoreSettings({ ...storeSettings, pkpNumber: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Tipe Usaha</label>
                                            <div className="relative">
                                                <LayoutDashboard className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500" size={18} />
                                                <select
                                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-slate-700 appearance-none cursor-pointer"
                                                    value={storeSettings.companyType}
                                                    onChange={(e) => setStoreSettings({ ...storeSettings, companyType: e.target.value })}
                                                >
                                                    <option value="PT">PT (Perseroan Terbatas)</option>
                                                    <option value="CV">CV (Commanditaire Vennootschap)</option>
                                                    <option value="Perorangan">Perorangan</option>
                                                    <option value="Yayasan">Yayasan</option>
                                                    <option value="Lainnya">Lainnya</option>
                                                </select>
                                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">NPWP Perusahaan</label>
                                            <div className="relative">
                                                <Calculator className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500" size={18} />
                                                <input
                                                    type="text"
                                                    placeholder="00.000.000.0-000.000"
                                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-slate-700"
                                                    value={storeSettings.companyNpwp}
                                                    onChange={(e) => setStoreSettings({ ...storeSettings, companyNpwp: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">KLU (Klasifikasi Lapangan Usaha)</label>
                                            <div className="relative">
                                                <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500" size={18} />
                                                <input
                                                    type="text"
                                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-slate-700"
                                                    value={storeSettings.klu}
                                                    onChange={(e) => setStoreSettings({ ...storeSettings, klu: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-span-1 md:col-span-2 space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">NITKU</label>
                                            <div className="relative">
                                                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500" size={18} />
                                                <input
                                                    type="text"
                                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-slate-700"
                                                    value={storeSettings.nitku}
                                                    onChange={(e) => setStoreSettings({ ...storeSettings, nitku: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Alamat (Pajak)</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-4 top-4 text-emerald-500" size={18} />
                                            <textarea
                                                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-slate-700 min-h-[100px]"
                                                value={storeSettings.taxAddress}
                                                onChange={(e) => setStoreSettings({ ...storeSettings, taxAddress: e.target.value })}
                                            ></textarea>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <div className="bg-emerald-50 p-6 rounded-[2rem] border border-emerald-100">
                                        <h4 className="text-sm font-black text-emerald-800 mb-4 flex items-center gap-2">
                                            <UserPlus size={18} />
                                            Tambah Pengguna Baru
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-emerald-600/50 ml-1">Email / No. HP</label>
                                                <input
                                                    type="text"
                                                    placeholder="contoh@gmail.com"
                                                    className="w-full px-4 py-3 bg-white border border-emerald-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-slate-700"
                                                    value={newUserContact}
                                                    onChange={(e) => setNewUserContact(e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-emerald-600/50 ml-1">Peran (Role)</label>
                                                <div className="flex gap-2">
                                                    <select
                                                        className="flex-1 px-4 py-3 bg-white border border-emerald-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-slate-700 cursor-pointer"
                                                        value={newUserRole}
                                                        onChange={(e) => setNewUserRole(e.target.value)}
                                                    >
                                                        <option value="Operator">Operator</option>
                                                        <option value="Administrator">Administrator</option>
                                                    </select>
                                                    <button
                                                        onClick={() => {
                                                            if (!newUserContact) return alert('Masukkan Email atau Nomor HP!');
                                                            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                                                            const phoneRegex = /^\d{7,15}$/;
                                                            if (!emailRegex.test(newUserContact) && !phoneRegex.test(newUserContact)) {
                                                                return alert('Format Email atau Nomor HP tidak valid!');
                                                            }
                                                            const updatedUsers = [...storeSettings.authorizedUsers, { contact: newUserContact, role: newUserRole }];
                                                            setStoreSettings({ ...storeSettings, authorizedUsers: updatedUsers });
                                                            setNewUserContact('');
                                                        }}
                                                        className="px-6 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase hover:bg-emerald-500 transition-all active:scale-95 shadow-lg shadow-emerald-900/10"
                                                    >
                                                        Tambah
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Daftar Pengguna Terdaftar</h4>
                                        <div className="space-y-2">
                                            {storeSettings.authorizedUsers && storeSettings.authorizedUsers.map((user, idx) => (
                                                <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:border-emerald-200 transition-all group">
                                                    <div className="flex items-center gap-4">
                                                        <div className={`p-3 rounded-xl ${user.role === 'Administrator' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-500'}`}>
                                                            <UserCircle size={20} />
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-slate-800 text-sm">{user.contact}</p>
                                                            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">{user.role}</p>
                                                        </div>
                                                    </div>
                                                    {user.contact !== 'santarapoint@gmail.com' && (
                                                        <button
                                                            onClick={() => {
                                                                const updatedUsers = storeSettings.authorizedUsers.filter((_, i) => i !== idx);
                                                                setStoreSettings({ ...storeSettings, authorizedUsers: updatedUsers });
                                                            }}
                                                            className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer Modal */}
                        <div className="p-8 border-t border-slate-100 bg-slate-50 flex gap-4">
                            <button
                                onClick={() => setIsSettingsModalOpen(false)}
                                className="flex-1 py-4 px-6 border border-slate-200 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 hover:bg-white hover:text-slate-600 transition-all active:scale-95"
                            >
                                Batal
                            </button>
                            <button
                                onClick={() => {
                                    localStorage.setItem('santaraStoreSettings', JSON.stringify(storeSettings));
                                    setIsSettingsModalOpen(false);
                                    alert('Pengaturan Berhasil Disimpan!');
                                }}
                                className="flex-2 py-4 px-10 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-emerald-900/10 transition-all active:scale-95"
                            >
                                Simpan Perubahan
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 6. Cart Modal for Mobile (Admin) */}
            {isCartModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] md:hidden">
                    <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[2.5rem] h-[90vh] flex flex-col overflow-hidden shadow-2xl">
                        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h3 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                                <ShoppingBag size={20} className="text-emerald-600" />
                                Transaksi Baru
                            </h3>
                            <button onClick={() => setIsCartModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6 bg-white space-y-6">
                            {cart.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-slate-300 opacity-50 py-10">
                                    <ShoppingBag size={64} className="mb-4" />
                                    <p className="font-bold">Belum ada item terpilih</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {cart.map(item => (
                                        <div key={item.id} className="flex items-center justify-between bg-slate-800 p-4 rounded-2xl border border-slate-700">
                                            <div className="flex-1">
                                                <h4 className="font-bold text-sm text-slate-100">{item.name}</h4>
                                                <p className="text-xs text-emerald-400 font-black mt-0.5">Rp {(item.price * item.quantity).toLocaleString('en-US')}</p>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-2.5 bg-slate-900 p-1 rounded-xl border border-slate-700">
                                                    <button onClick={() => updateQty(item.id, -1)} className="w-8 h-8 flex items-center justify-center bg-slate-800 border border-slate-700 rounded-lg text-slate-400">
                                                        <Minus size={14} />
                                                    </button>
                                                    <span className="text-sm font-black w-5 text-center text-slate-100">{item.quantity}</span>
                                                    <button onClick={() => addToCart(item)} className="w-8 h-8 flex items-center justify-center bg-slate-800 border border-slate-700 rounded-lg text-slate-400">
                                                        <Plus size={14} />
                                                    </button>
                                                </div>
                                                <button onClick={() => updateQty(item.id, -item.quantity)} className="text-slate-400 hover:text-red-500 transition-colors p-1">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}

                                    <div className="pt-6 space-y-4">
                                        <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Detail Pelanggan</h3>
                                            <input type="text" placeholder="Nama Pemesan" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full text-sm px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold" />
                                            <select
                                                value={queueNumber}
                                                onChange={(e) => setQueueNumber(e.target.value)}
                                                className="w-full text-sm px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold cursor-pointer"
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
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic mb-1">Total Transaksi</span>
                                                    <span className="text-2xl font-black text-emerald-400 tracking-tighter">Rp {totalAmount.toLocaleString('en-US')}</span>
                                                </div>
                                            </div>
                                            <div className="space-y-3 pb-4">
                                                <select
                                                    value={paymentMethod}
                                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                                    className="w-full text-xs px-4 py-3 bg-white/10 border border-white/20 rounded-xl outline-none focus:border-white font-black text-emerald-400 uppercase tracking-widest text-center"
                                                >
                                                    <option value="" disabled className="text-slate-800">Metode Pembayaran</option>
                                                    <option value="Tunai" className="text-slate-800">Tunai / Cash</option>
                                                    <option value="Transfer" className="text-slate-800">Transfer Bank / QRIS</option>
                                                </select>
                                                <button
                                                    onClick={() => {
                                                        setIsCartModalOpen(false);
                                                        handleCheckout();
                                                    }}
                                                    className="w-full py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-emerald-500/20 transition-all active:scale-95"
                                                >
                                                    Selesaikan Pesanan
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
        </div>
    );
}