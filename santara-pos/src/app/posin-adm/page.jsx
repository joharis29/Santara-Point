"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { generateReceiptPDF } from '@/lib/receiptPdf';
import WaitingOverlay from '../posin-cus/WaitingOverlay';
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
    Menu,
    ShoppingCart,
    User,
    CheckCircle2
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import AdminHeader from '@/components/AdminHeader';
import AdminSidebar from '@/components/AdminSidebar';
import SettingsModal from '@/components/SettingsModal';

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
    const [currentTxId, setCurrentTxId] = useState(null);

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

        const activeTxId = localStorage.getItem('santaraActiveTxId');
        if (activeTxId) {
            setCurrentTxId(activeTxId);
        }
    }, [router]);

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
        alert(`Transaksi ${paymentMethod} Berhasil!`);
    };

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

            <main className="flex-1 flex flex-col overflow-hidden relative">
                <AdminHeader 
                    title={storeSettings.storeName}
                    subtitle={storeSettings.storeTagline}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    onMenuClick={() => setIsSidebarOpen(true)}
                    showBackButton={false}
                />

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
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
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
                isAdmin={true}
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
        </div>
    );
}