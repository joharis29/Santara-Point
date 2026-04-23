"use client";

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChangeEmailModal, ChangeWhatsappModal, ChangePasswordModal } from '@/components/UserManagementModals';
import {
    ShoppingBag,
    ShieldCheck,
    Search,
    Plus,
    Minus,
    Trash2,
    Info,
    Calculator,
    LogOut,
    Home,
    Clock,
    ShoppingCart,
    Heart,
    Star,
    CheckCircle2,
    X,
    Settings,
    User,
    Languages,
    Palette,
    Eye,
    EyeOff,
    ArrowUpDown,
    MapPin,
    ChevronRight,
    MessageCircle,
    ArrowLeft,
    Store,
    Menu,
    TrendingUp
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { useOrderTracking } from '@/components/OrderTrackingProvider';
import CustomerHeader from '@/components/CustomerHeader';
import CustomerBottomNav from '@/components/CustomerBottomNav';
import SettingsModal from '@/components/SettingsModal';

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
    { id: 7, name: 'Nasi Kuning', price: 15000, stock: 15, category: 'Makanan', img: '/nasi-kuning-baru.jpg', images: ['/nasi-kuning-baru.jpg'], discountPercent: 10, rating: 4.8 },
    { id: 8, name: 'Nasi Uduk', price: 15000, stock: 20, category: 'Makanan', img: '/nasi-uduk-asli.jpg', images: ['/nasi-uduk-asli.jpg'], discountPercent: 0, rating: 4.7 },
    { id: 9, name: 'Soto Ayam', price: 15000, stock: 15, category: 'Makanan', img: '/soto-ayam-asli.jpg', images: ['/soto-ayam-asli.jpg'], discountPercent: 0, rating: 4.8 },
    { id: 10, name: 'Bubur Ayam', price: 15000, stock: 20, category: 'Makanan', img: '/bubur-ayam-asli.jpg', images: ['/bubur-ayam-asli.jpg'], discountPercent: 0, rating: 4.8 },
    { id: 11, name: 'Ketoprak', price: 15000, stock: 15, category: 'Makanan', img: '/ketoprak-asli.jpg', images: ['/ketoprak-asli.jpg'], discountPercent: 15, rating: 4.8 },
    { id: 12, name: 'Nasi Ayam Pop', price: 16000, stock: 15, category: 'Makanan', img: '/nasi-ayam-pop-asli.jpg', images: ['/nasi-ayam-pop-asli.jpg'], discountPercent: 0, rating: 4.8 },
    { id: 13, name: 'Nasi Ayam Kecap', price: 16000, stock: 15, category: 'Makanan', img: '/nasi-ayam-kecap-asli.jpg', images: ['/nasi-ayam-kecap-asli.jpg'], discountPercent: 0, rating: 4.8 },
    { id: 14, name: 'Nasi Ayam Balado', price: 16000, stock: 15, category: 'Makanan', img: '/nasi-ayam-balado-asli.jpg', images: ['/nasi-ayam-balado-asli.jpg'], discountPercent: 0, rating: 4.8 },
    { id: 15, name: 'Nasi Ayam Kremes', price: 16000, stock: 15, category: 'Makanan', img: '/nasi-ayam-kremes-asli.jpg', images: ['/nasi-ayam-kremes-asli.jpg'], rating: 4.8 },
    { id: 16, name: 'Nasi Chicken Nugget', price: 16000, stock: 15, category: 'Makanan', img: '/nasi-chicken-nugget-asli.jpg', images: ['/nasi-chicken-nugget-asli.jpg'], rating: 4.8 },
    { id: 17, name: 'Nasi Ayam Rica-Rica', price: 16000, stock: 15, category: 'Makanan', img: '/nasi-ayam-rica-rica-asli.jpg', images: ['/nasi-ayam-rica-rica-asli.jpg'], rating: 4.8 },
    { id: 18, name: 'Nasi Curry Ayam', price: 16000, stock: 15, category: 'Makanan', img: '/nasi-curry-ayam-asli.jpg', images: ['/nasi-curry-ayam-asli.jpg'], rating: 4.8 },
    { id: 19, name: 'Nasi Ayam Serundeng', price: 16000, stock: 15, category: 'Makanan', img: '/nasi-ayam-serundeng-asli.jpg', images: ['/nasi-ayam-serundeng-asli.jpg'], rating: 4.8 },
    { id: 20, name: 'Nasi Chicken Teriyaki', price: 16000, stock: 15, category: 'Makanan', img: '/nasi-chicken-teriyaki-asli.jpg', images: ['/nasi-chicken-teriyaki-asli.jpg'], rating: 4.8 },
    { id: 21, name: 'Nasi Sambal Baby Cumi', price: 16000, stock: 15, category: 'Makanan', img: '/nasi-sambal-baby-cumi-asli.jpg', images: ['/nasi-sambal-baby-cumi-asli.jpg'], rating: 4.8 },
    { id: 22, name: 'Rice Bowl Chicken Teriyaki', price: 17000, stock: 20, category: 'Makanan', img: '/rice-bowl-chicken-teriyaki-asli.jpg', images: ['/rice-bowl-chicken-teriyaki-asli.jpg'], rating: 4.8 },
    { id: 23, name: 'Rice Bowl Chicken Nugget', price: 17000, stock: 20, category: 'Makanan', img: '/rice-bowl-chicken-nugget-asli.jpg', images: ['/rice-bowl-chicken-nugget-asli.jpg'], rating: 4.8 },
    { id: 24, name: 'Rice Bowl Chicken Popcorn', price: 17000, stock: 20, category: 'Makanan', img: '/rice-bowl-chicken-popcorn-asli.jpg', images: ['/rice-bowl-chicken-popcorn-asli.jpg'], rating: 4.8 },
    { id: 25, name: 'Rice Bowl Sambal Baby Cumi', price: 17000, stock: 20, category: 'Makanan', img: '/rice-bowl-sambal-baby-cumi-asli.jpg', images: ['/rice-bowl-sambal-baby-cumi-asli.jpg'], rating: 4.8 },
    { id: 26, name: 'Mie Ayam Pangsit', price: 15000, stock: 20, category: 'Makanan', img: '/mie-ayam-pangsit-asli.jpg', images: ['/mie-ayam-pangsit-asli.jpg'], rating: 4.8 },
    { id: 27, name: 'Mie Chilli Oil', price: 15000, stock: 20, category: 'Makanan', img: '/mie-chili-oil-asli.jpg', images: ['/mie-chili-oil-asli.jpg'], rating: 4.8 },
    { id: 28, name: 'Cireng Ayam Suwir', price: 5000, stock: 10, category: 'Snack', img: '/cireng-ayam-suwir-asli.jpg', images: ['/cireng-ayam-suwir-asli.jpg'], rating: 4.6 },
    { id: 29, name: 'Pisang Bolen', price: 35000, stock: 10, category: 'Snack', img: '/pisang-bolen-asli.jpg', images: ['/pisang-bolen-asli.jpg'], rating: 4.6 },
    { id: 30, name: 'Macaroni Schotel', price: 5000, stock: 10, category: 'Snack', img: '/macaroni-schotel-asli.jpg', images: ['/macaroni-schotel-asli.jpg'], rating: 4.6 },
    { id: 31, name: 'Siomay Ayam', price: 10000, stock: 10, category: 'Snack', img: '/siomay-ayam-asli.jpg', images: ['/siomay-ayam-asli.jpg'], rating: 4.6 },
    { id: 32, name: 'Batagor Pangsit', price: 10000, stock: 10, category: 'Snack', img: '/batagor-pangsit-asli.jpg', images: ['/batagor-pangsit-asli.jpg'], rating: 4.6 },
    { id: 33, name: 'Risol Ragout', price: 5000, stock: 10, category: 'Snack', img: '/risol-ragout-asli.jpg', images: ['/risol-ragout-asli.jpg'], rating: 4.6 },
    { id: 34, name: 'Zuppa Soup', price: 10000, stock: 10, category: 'Snack', img: '/zuppa-soup-asli.jpg', images: ['/zuppa-soup-asli.jpg'], rating: 4.6 },
    { id: 35, name: 'Piscok', price: 10000, stock: 10, category: 'Snack', img: '/piscok-asli.jpg', images: ['/piscok-asli.jpg'], rating: 4.6 },
    { id: 36, name: 'Cheese Roll', price: 10000, stock: 10, category: 'Snack', img: '/cheese-roll-asli.jpg', images: ['/cheese-roll-asli.jpg'], rating: 4.6 },
    { id: 37, name: 'Chicken Teriyaki', price: 25000, stock: 5, category: 'Frozen Food', img: '/frozen-chicken-teriyaki-asli.jpg', images: ['/frozen-chicken-teriyaki-asli.jpg'], rating: 4.8 },
    { id: 38, name: 'Ayam Pop', price: 25000, stock: 5, category: 'Frozen Food', img: '/frozen-ayam-pop-asli.jpg', images: ['/frozen-ayam-pop-asli.jpg'], rating: 4.8 },
    { id: 39, name: 'Chicken Nugget', price: 25000, stock: 5, category: 'Frozen Food', img: '/frozen-chicken-nugget-asli.jpg', images: ['/frozen-chicken-nugget-asli.jpg'], rating: 4.8 },
    { id: 40, name: 'Ayam Kecap', price: 25000, stock: 5, category: 'Frozen Food', img: '/frozen-ayam-kecap-asli.jpg', images: ['/frozen-ayam-kecap-asli.jpg'], rating: 4.8 },
    { id: 41, name: 'Ayam Kremes', price: 25000, stock: 5, category: 'Frozen Food', img: '/frozen-ayam-kremes-asli-v2.jpg', images: ['/frozen-ayam-kremes-asli-v2.jpg'], rating: 4.8 },
    { id: 42, name: 'Ayam Serundeng', price: 25000, stock: 5, category: 'Frozen Food', img: '/frozen-ayam-serundeng-asli.jpg', images: ['/frozen-ayam-serundeng-asli.jpg'], rating: 4.8 },
    { id: 43, name: 'Ayam Rica-Rica', price: 25000, stock: 5, category: 'Frozen Food', img: '/frozen-ayam-rica-rica-asli.jpg', images: ['/frozen-ayam-rica-rica-asli.jpg'], rating: 4.8 },
    { id: 44, name: 'Ayam Balado', price: 25000, stock: 5, category: 'Frozen Food', img: '/frozen-ayam-balado-asli.jpg', images: ['/frozen-ayam-balado-asli.jpg'], rating: 4.8 },
    { id: 45, name: 'Ayam Curry', price: 25000, stock: 5, category: 'Frozen Food', img: '/frozen-ayam-curry-asli.jpg', images: ['/frozen-ayam-curry-asli.jpg'], rating: 4.8 },
    { id: 46, name: 'Sambal Baby Cumi', price: 30000, stock: 5, category: 'Frozen Food', img: '/frozen-sambal-baby-cumi-asli.jpg', images: ['/frozen-sambal-baby-cumi-asli.jpg'], rating: 4.8 },
    { id: 47, name: 'Cireng (Ayam Suwir)', price: 10000, stock: 5, category: 'Frozen Food', img: '/frozen-cireng-ayam-suwir-asli.jpg', images: ['/frozen-cireng-ayam-suwir-asli.jpg'], rating: 4.8 },
    { id: 48, name: 'Bajigur', price: 10000, stock: 10, category: 'Minuman', img: '/minuman-bajigur-asli.jpg', images: ['/minuman-bajigur-asli.jpg'], rating: 4.8 },
    { id: 49, name: 'Es Cendol', price: 10000, stock: 10, category: 'Minuman', img: '/minuman-es-cendol-asli.png', images: ['/minuman-es-cendol-asli.png'], rating: 4.8 },
    { id: 50, name: 'Es Teh Manis', price: 5000, stock: 10, category: 'Minuman', img: '/minuman-es-teh-manis-asli.jpg', images: ['/minuman-es-teh-manis-asli.jpg'], rating: 4.8 },
    { id: 51, name: 'Es Teh Tawar', price: 5000, stock: 10, category: 'Minuman', img: '/minuman-es-teh-tawar-asli.jpg', images: ['/minuman-es-teh-tawar-asli.jpg'], rating: 4.8 },
    { id: 52, name: 'Es Jeruk Peras', price: 10000, stock: 10, category: 'Minuman', img: '/minuman-es-jeruk-peras-asli.jpg', images: ['/minuman-es-jeruk-peras-asli.jpg'], rating: 4.8 },
    { id: 53, name: 'Es Kuwut', price: 8000, stock: 10, category: 'Minuman', img: '/minuman-es-kuwut-asli.jpg', images: ['/minuman-es-kuwut-asli.jpg'], rating: 4.8 },
    { id: 54, name: 'Es Campur', price: 10000, stock: 10, category: 'Minuman', img: '/minuman-es-campur-asli.png', images: ['/minuman-es-campur-asli.png'], rating: 4.8 },
];

const CATEGORIES = ['Semua', 'Makanan', 'Minuman', 'Snack', 'Frozen Food'];





function ProductImageSlider({ product }) {

    const [currentIndex, setCurrentIndex] = useState(0);
    const hasMultiple = product.images && product.images.length > 1;

    const nextImage = (e) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev + 1) % product.images.length);
    };

    const prevImage = (e) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
    };

    const currentImg = hasMultiple ? product.images[currentIndex] : product.img;

    return (
        <div className="h-36 rounded-[1.5rem] overflow-hidden mb-4 relative group/slider">
            <img src={currentImg} alt={product.name} className="w-full h-full object-cover transition duration-700 group-hover/slider:scale-110" />

            {hasMultiple && (
                <>
                    <button
                        onClick={prevImage}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-1.5 rounded-full opacity-0 group-hover/slider:opacity-100 transition hover:bg-black/60 z-20"
                    >
                        <ChevronRight className="rotate-180" size={16} />
                    </button>
                    <button
                        onClick={nextImage}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-1.5 rounded-full opacity-0 group-hover/slider:opacity-100 transition hover:bg-black/60 z-20"
                    >
                        <ChevronRight size={16} />
                    </button>

                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
                        {product.images.map((_, idx) => (
                            <div key={idx} className={`w-1.5 h-1.5 rounded-full ${idx === currentIndex ? 'bg-white' : 'bg-white/50'}`} />
                        ))}
                    </div>
                </>
            )}

            {product.discountPercent > 0 && (
                <div className="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-md z-30">
                    -{product.discountPercent}%
                </div>
            )}
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black text-slate-800 shadow-sm flex items-center gap-1 z-10">
                <Star size={12} className="text-amber-500 fill-amber-500" /> {product.rating || '4.5'}
            </div>
            {product.stock <= 0 && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-10">
                    <span className="bg-white text-slate-900 px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest">Habis Terjual</span>
                </div>
            )}
            {product.isNew && (
                <div className="absolute top-4 right-4 translate-y-8 bg-red-500 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-md z-30">
                    NEW
                </div>
            )}
        </div>
    );
}

function CustomerPortalContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    // Simulasi status login customer
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [customerName, setCustomerName] = useState('Sobat Santara');
    const [favorites, setFavorites] = useState([]);

    const [products, setProducts] = useState(PRODUCTS);
    const [storeSettings, setStoreSettings] = useState(DEFAULT_SETTINGS);

    // --- State Pengaturan ---
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [activeSettingsTab, setActiveSettingsTab] = useState('profil');
    const [showPassword, setShowPassword] = useState(false);
    const [language, setLanguage] = useState('ID');
    const [theme, setTheme] = useState('Light');
    const [userProfile, setUserProfile] = useState({
        firstName: '',
        lastName: '',
        email: '',
        whatsapp: '',
        password: '••••••••',
        addresses: []
    });

    // --- State Perubahan Email ---
    const [isChangeEmailOpen, setIsChangeEmailOpen] = useState(false);
    const [newEmailInput, setNewEmailInput] = useState('');
    const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);

    // --- State Perubahan WhatsApp ---
    const [isChangeWhatsappOpen, setIsChangeWhatsappOpen] = useState(false);
    const [newWhatsappInput, setNewWhatsappInput] = useState('');
    const [isUpdatingWhatsapp, setIsUpdatingWhatsapp] = useState(false);

    // --- State Perubahan Password ---
    const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
    const [newPasswordInput, setNewPasswordInput] = useState('');
    const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
    const [isWaitingOpen, setIsWaitingOpen] = useState(false);
    const [currentTxId, setCurrentTxId] = useState(null);

    const [cart, setCart] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('Semua');
    const [customerEmail, setCustomerEmail] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [customerAddress, setCustomerAddress] = useState('');
    const [orderNote, setOrderNote] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [sortBy, setSortBy] = useState('default');
    const [orderType, setOrderType] = useState('');
    
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [toppingModalProduct, setToppingModalProduct] = useState(null);
    const [isQrisOpen, setIsQrisOpen] = useState(false);
    const [isCodOpen, setIsCodOpen] = useState(false);
    const [isTransferOpen, setIsTransferOpen] = useState(false);
    const [isCartModalOpen, setIsCartModalOpen] = useState(false);

    // --- Function Hoisting (Standard Function Declarations for TDZ Safety) ---

    function addAddress() {
        const newAddress = { id: Date.now(), label: '', details: '' };
        setUserProfile(prev => ({ ...prev, addresses: [...prev.addresses, newAddress] }));
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

    async function handleSaveProfile(e) {
        if (e) e.preventDefault();
        const fullName = `${userProfile.firstName} ${userProfile.lastName}`.trim();
        try {
            const { error } = await supabase.auth.updateUser({
                data: {
                    first_name: userProfile.firstName,
                    last_name: userProfile.lastName,
                    whatsapp: userProfile.whatsapp,
                    addresses: userProfile.addresses
                }
            });
            if (error) {
                alert(`Gagal memperbarui profil: ${error.message}`);
                return;
            }
            localStorage.setItem('customerFirstName', userProfile.firstName);
            localStorage.setItem('customerLastName', userProfile.lastName);
            localStorage.setItem('customerName', fullName);
            localStorage.setItem('registeredEmail', userProfile.email);
            localStorage.setItem('registeredWhatsapp', userProfile.whatsapp);
            localStorage.setItem('santaraCustomerAddresses', JSON.stringify(userProfile.addresses));
            setCustomerName(fullName);
            alert('Profil berhasil diperbaharui!');
        } catch (err) {
            console.error("Gagal memperbarui profil:", err);
            alert("Terjadi kesalahan sistem.");
        }
    }

    async function handleConfirmEmailChange(e) {
        if (e) e.preventDefault();
        if (!newEmailInput || !newEmailInput.includes('@')) return alert('Email tidak valid.');
        setIsUpdatingEmail(true);
        try {
            const { error } = await supabase.auth.updateUser({ email: newEmailInput });
            if (error) {
                alert(`Gagal mengirim konfirmasi: ${error.message}`);
            } else {
                alert('Alhamdulillah! Permintaan perubahan email telah dikirim. Cek email BARU Anda.');
                setIsChangeEmailOpen(false);
                setNewEmailInput('');
            }
        } catch (err) {
            alert("Terjadi kesalahan sistem.");
        } finally {
            setIsUpdatingEmail(false);
        }
    }

    async function handleConfirmWhatsappChange(e) {
        if (e) e.preventDefault();
        if (!newWhatsappInput || newWhatsappInput.length < 10) return alert('WhatsApp tidak valid.');
        setIsUpdatingWhatsapp(true);
        try {
            const { error } = await supabase.auth.updateUser({
                data: { whatsapp: newWhatsappInput }
            });
            if (error) throw error;
            setUserProfile(prev => ({ ...prev, whatsapp: newWhatsappInput }));
            localStorage.setItem('registeredWhatsapp', newWhatsappInput);
            alert('WhatsApp berhasil diperbaharui.');
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
            alert('Kata sandi berhasil diperbaharui.');
            setIsChangePasswordOpen(false);
            setNewPasswordInput('');
            setConfirmPasswordInput('');
        } catch (err) {
            alert("Gagal: " + err.message);
        } finally {
            setIsUpdatingPassword(false);
        }
    }

    React.useEffect(() => {
        async function fetchUserData() {
            const currentRole = localStorage.getItem('currentUserRole');
            const currentUserEmail = localStorage.getItem('registeredEmail');

            if (currentRole === 'Administrator' || (currentUserEmail && currentUserEmail.toLowerCase() === 'santarapoint@gmail.com')) {
                router.push('/posin-adm');
                return;
            } else if (currentRole === 'Operator') {
                router.push('/posin-cas');
                return;
            }

            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const meta = user.user_metadata || {};
                const fName = meta.first_name || '';
                const lName = meta.last_name || '';
                const fullName = `${fName} ${lName}`.trim() || 'Sobat Santara';

                setCustomerName(fullName);
                setIsLoggedIn(true);

                let storedAddresses = meta.addresses;
                if (!storedAddresses || storedAddresses.length === 0) {
                    storedAddresses = JSON.parse(localStorage.getItem('santaraCustomerAddresses') || '[]');
                }

                setUserProfile({
                    firstName: fName,
                    lastName: lName,
                    email: user.email || '',
                    whatsapp: meta.whatsapp || '',
                    password: '••••••••',
                    addresses: storedAddresses
                });

                localStorage.setItem('customerName', fullName);
                localStorage.setItem('customerFirstName', fName);
                localStorage.setItem('customerLastName', lName);
                localStorage.setItem('registeredEmail', user.email || '');
                if (meta.whatsapp) localStorage.setItem('registeredWhatsapp', meta.whatsapp);
            } else {
                const storedName = localStorage.getItem('customerName');
                if (storedName) {
                    setCustomerName(storedName);
                    setIsLoggedIn(true);
                }
            }
        }
        fetchUserData();

        const storedFavs = JSON.parse(localStorage.getItem('santaraFavorites') || '[]');
        setFavorites(storedFavs);

        const fetchProducts = async () => {
            try {
                // 1. Fetch from Supabase
                const { data: dbData, error } = await supabase
                    .from('products')
                    .select('*')
                    .order('id', { ascending: true });

                if (error) throw error;

                // 2. Proactive Recovery: Ensure cloud has the full menu
                if (!dbData || dbData.length < PRODUCTS.length) {
                    const initial = PRODUCTS.map(p => ({
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
                    // Use Supabase data
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
                console.error("Customer POS Fetch/Sync Error:", err);
                const stored = localStorage.getItem('santaraProducts');
                if (stored) setProducts(JSON.parse(stored));
                else setProducts(PRODUCTS);
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
                        isPajakActive: data.is_pajak_active,
                        address: data.address,
                        companyCategory: data.company_category,
                        companyField: data.company_field,
                        currency: data.currency,
                        companyNpwp: data.company_npwp,
                        companyType: data.company_type,
                        authorizedUsers: data.authorized_users
                    };
                    setStoreSettings(mapped);
                    localStorage.setItem('santaraStoreSettings', JSON.stringify(mapped));
                }
            } catch (err) {
                console.error("Error fetching store settings:", err);
            }
        };
        fetchProducts();

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

        const storedLang = localStorage.getItem('santaraLanguage');
        if (storedLang) setLanguage(storedLang);
        const storedTheme = localStorage.getItem('santaraTheme');
        if (storedTheme) setTheme(storedTheme);

        if (searchParams.get('settings') === 'true') {
            setIsSettingsOpen(true);
            if (searchParams.get('tab') === 'profile') setActiveSettingsTab('profil');
        }

        const storedCart = localStorage.getItem('santaraCart');
        if (storedCart) {
            try { setCart(JSON.parse(storedCart)); } catch (e) { }
        }
    }, [router, searchParams]);

    // Save cart to localStorage whenever it changes
    React.useEffect(() => {
        localStorage.setItem('santaraCart', JSON.stringify(cart));
    }, [cart]);


    const handleSaveLanguage = (lang) => {
        setLanguage(lang);
        localStorage.setItem('santaraLanguage', lang);
    };

    const handleSaveTheme = (tm) => {
        setTheme(tm);
        localStorage.setItem('santaraTheme', tm);
    };

    const toggleFavorite = (e, id) => {
        e.stopPropagation();
        let newFavs;
        if (favorites.includes(id)) {
            newFavs = favorites.filter(favId => favId !== id);
        } else {
            newFavs = [...favorites, id];
        }
        setFavorites(newFavs);
        localStorage.setItem('santaraFavorites', JSON.stringify(newFavs));
    };

    // Global Order Tracking
    const { startTracking } = useOrderTracking();
    // Pajak Daerah is strictly mandatory




    // --- Perhitungan Total (Inclusive Pajak 10%) ---
    const menuTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = orderType === 'Delivery' ? 5000 : 0;
    const subtotal = storeSettings.isPajakActive ? menuTotal / 1.10 : menuTotal;
    const pajakValue = storeSettings.isPajakActive ? Math.round(menuTotal - subtotal) : 0;
    const totalAmount = Math.round(menuTotal + deliveryFee);

    const filteredProducts = products.filter(p =>
        (activeCategory === 'Semua' || p.category === activeCategory) &&
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return a.price - b.price;
        if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
        if (sortBy === 'discount') return (b.discountPercent || 0) - (a.discountPercent || 0);
        return 0;
    });

    // --- Logic Keranjang ---
    const addToCart = (product) => {
        if (product.stock <= 0) return;
        if (product.id === 35) {
            setToppingModalProduct(product);
            return;
        }
        confirmAddToCart(product);
    };

    const confirmAddToCart = (product, topping = null) => {
        const discountedPrice = product.discountPercent > 0 
            ? Math.round(product.price * (1 - (product.discountPercent / 100))) 
            : product.price;

        const finalId = topping && topping !== 'Tanpa Toping' ? `${product.id}-${topping}` : product.id;
        const finalName = topping && topping !== 'Tanpa Toping' ? `${product.name} (${topping})` : product.name;

        const exist = cart.find(x => x.id === finalId);
        if (exist) {
            setCart(cart.map(x => x.id === finalId ? { ...x, quantity: x.quantity + 1 } : x));
        } else {
            setCart([...cart, { ...product, id: finalId, name: finalName, price: discountedPrice, quantity: 1, originalId: product.id }]);
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

    const processTransactionData = async () => {
        const tId = 'TRX-' + Math.floor(Math.random() * 1000000);

        // Data for LocalStorage
        const localTransaction = {
            id: tId,
            timestamp: new Date().toISOString(),
            customerName: customerName || 'Pelanggan Online',
            customerPhone: customerPhone || 'N/A',
            deliveryAddress: orderType === 'Delivery' ? (customerAddress || 'Alamat tidak diisi') : 'Ambil di Resto',
            queueNumber: 'P-' + Math.floor(Math.random() * 100),
            orderType: orderType,
            keterangan: orderNote,
            paymentMethod,
            source: 'Cus',
            totalAmount,
            pajak: pajakValue,
            status: 'Menunggu',
            items: [
                ...cart.map(({ name, quantity, price }) => ({ name, quantity, price })),
                ...(deliveryFee > 0 ? [{ name: 'Biaya Pengiriman', quantity: 1, price: deliveryFee }] : [])
            ]
        };

        // Data for Supabase
        const dbTransaction = {
            id: tId,
            timestamp: new Date().toISOString(),
            customer_name: customerName || 'Pelanggan Online',
            customer_phone: customerPhone || 'N/A',
            delivery_address: orderType === 'Delivery' ? (customerAddress || 'Alamat tidak diisi') : 'Ambil di Resto',
            queue_number: 'P-' + Math.floor(Math.random() * 100),
            order_type: orderType,
            keterangan: orderNote,
            payment_method: paymentMethod,
            source: 'Cus',
            total_amount: totalAmount,
            pajak: pajakValue,
            status: 'Menunggu',
            items: [
                ...cart.map(({ name, quantity, price }) => ({ name, quantity, price })),
                ...(deliveryFee > 0 ? [{ name: 'Biaya Pengiriman', quantity: 1, price: deliveryFee }] : [])
            ]
        };

        try {
            // Push to Supabase for cross-device sync
            const { error } = await supabase.from('transactions').insert([dbTransaction]);
            if (error) throw error;

            console.log("Transaction synced to Supabase successfully");

            // Also keep in localStorage for local history
            const existingHistory = JSON.parse(localStorage.getItem('santaraTransactionHistory') || '[]');
            localStorage.setItem('santaraTransactionHistory', JSON.stringify([localTransaction, ...existingHistory]));

            // 11. Success - Clear local cart and start tracking
            setCart([]);
            localStorage.removeItem('santaraCart');
            
            // Trigger Global Order Tracking
            startTracking(tId, customerName, totalAmount);
            
            alert(`Pesanan Berhasil!\nID: ${tId}\n\nStaf kami sedang memproses hidangan Anda.`);
            router.push('/customer-history');
        } catch (err) {
            console.error("Error syncing transaction:", err);
            alert("Gagal mengirim pesanan ke sistem. Mohon hubungi admin (Error DB).");
        }
    };

    const handleCheckout = async () => {
        if (!isLoggedIn) {
            router.push('/login');
            return;
        }

        if (cart.length === 0) return alert('Keranjang masih kosong!');
        
        // Validation logic
        if (!customerName || !customerPhone || !paymentMethod) {
            return alert('Mohon lengkapi Nama, Nomor WhatsApp, dan Metode Pembayaran!');
        }

        if (!orderType) {
            return alert('Mohon pilih Opsi Pengiriman!');
        }
        
        if (orderType === 'Delivery' && !customerAddress) {
            return alert('Mohon pilih/isi Alamat Pengiriman untuk pesanan Delivery!');
        }

        setIsProcessing(true);
        try {
            // Simulasi pemrosesan lokal (tanpa API eksternal)
            await new Promise(resolve => setTimeout(resolve, 700));

            if (paymentMethod === 'Gopay' || paymentMethod === 'Dana') {
                setIsQrisOpen(true);
            } else if (paymentMethod === 'COD') {
                setIsCodOpen(true);
            } else if (paymentMethod === 'Transfer Bank') {
                setIsTransferOpen(true);
            } else {
                processTransactionData();
            }
        } catch (error) {
            console.error(error);
            alert('Kesalahan jaringan, gagal memproses pesanan.');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleCloseWaiting = () => {
        setIsWaitingOpen(false);
        setCurrentTxId(null);
        localStorage.removeItem('santaraActiveTxId');
        setCart([]);
        setPaymentMethod('');
        // Optional: Reset data diri
        // setCustomerName('');
        // setCustomerEmail('');
        // setCustomerPhone('');
    };

    return (
        <div className="flex h-screen bg-white font-sans text-slate-900 overflow-hidden">
            {/* Sidebar (Desktop) */}
            <aside className="hidden md:flex w-24 bg-slate-900 flex-col items-center py-8 gap-8 shrink-0">
                <button
                    onClick={() => router.push('/')}
                    className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/10 hover:scale-110 active:scale-95 transition-all group border border-slate-100"
                    title="Ke Halaman Utama"
                >
                    <img src="/santara-logo.png" alt="Logo" className="w-7 h-7 object-contain" />
                </button>
                <nav className="flex-1 flex flex-col gap-4">
                    <button
                        onClick={() => setActiveCategory('Semua')}
                        className={`p-4 rounded-2xl transition-all ${activeCategory === 'Semua' ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-500/20' : 'text-slate-500 hover:bg-slate-800 hover:text-slate-300'}`}
                    >
                        <ShoppingBag size={24} />
                    </button>
                    <button
                        onClick={() => router.push('/favorites')}
                        className="p-4 rounded-2xl text-slate-500 hover:bg-slate-800 hover:text-slate-300 transition-all"
                        title="Favorit Saya"
                    >
                        <Heart size={24} />
                    </button>
                    <button
                        onClick={() => router.push('/customer-history')}
                        className="p-4 rounded-2xl text-slate-500 hover:bg-slate-800 hover:text-slate-300 transition-all"
                        title="Riwayat Pesanan"
                    >
                        <Clock size={24} />
                    </button>
                    <button
                        onClick={() => {
                            setActiveSettingsTab('profil');
                            setIsSettingsOpen(true);
                        }}
                        className="p-4 rounded-2xl text-slate-500 hover:bg-slate-800 hover:text-slate-300 transition-all"
                    >
                        <Settings size={24} />
                    </button>
                </nav>
                <button
                    onClick={() => {
                        localStorage.removeItem('customerName');
                        setIsLoggedIn(false);
                        setCustomerName('Sobat Santara');
                        router.push('/login');
                    }}
                    className="p-3 flex flex-col items-center gap-1 text-slate-300 hover:text-red-500 transition-colors"
                >
                    <LogOut size={24} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Keluar</span>
                </button>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col overflow-hidden">
                <CustomerHeader
                    title={storeSettings.storeName}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    cartCount={cart.length}
                    onCartClick={() => setIsCartModalOpen(true)}
                    onSettingsClick={() => setIsSettingsOpen(true)}
                />

                <div className="px-6 md:px-10 mb-8 flex items-center justify-between gap-4 overflow-x-auto">
                    <div className="flex gap-3 pb-2">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-6 py-2 rounded-full text-xs font-bold transition-all border whitespace-nowrap ${activeCategory === cat ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-100' : 'bg-white border-slate-200 text-slate-400 hover:border-emerald-600 hover:text-emerald-600'}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-2xl border border-slate-100 shadow-sm shrink-0 mb-2">
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

                <section className="flex-1 overflow-y-auto px-6 md:px-10 pb-10">
                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
                        {filteredProducts.map(product => (
                            <div
                                key={product.id}
                                onClick={() => addToCart(product)}
                                className={`bg-white p-3 rounded-[2rem] shadow-sm hover:shadow-xl transition-all border border-transparent hover:border-emerald-500 cursor-pointer group flex flex-col ${product.stock <= 0 ? 'opacity-60 grayscale' : ''}`}
                            >
                                <div className="relative">
                                    <button
                                        onClick={(e) => toggleFavorite(e, product.id)}
                                        className="absolute bottom-4 left-4 p-1.5 bg-white/90 backdrop-blur rounded-full shadow-sm z-30 hover:scale-110 active:scale-95 transition-transform"
                                        title="Tambahkan ke Favorit"
                                    >
                                        <Heart size={16} fill={favorites.includes(product.id) ? "#ef4444" : "transparent"} color={favorites.includes(product.id) ? "#ef4444" : "#94a3b8"} />
                                    </button>
                                    <ProductImageSlider product={product} />
                                    {/* Quantity Overlay */}
                                    {(() => {
                                        const productInCart = cart.filter(item => item.originalId === product.id || item.id === product.id);
                                        const totalQty = productInCart.reduce((sum, item) => sum + item.quantity, 0);
                                        
                                        return (
                                            <div className={`absolute bottom-4 right-4 z-40 flex items-center transition-all duration-300 ${totalQty > 0 ? 'bg-emerald-600 text-white px-1.5 py-1 rounded-full shadow-lg border-2 border-white gap-2' : ''}`}>
                                                {totalQty > 0 ? (
                                                    <>
                                                        <button 
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                const itemToDec = productInCart[0];
                                                                if (itemToDec) updateQty(itemToDec.id, -1);
                                                            }}
                                                            className="w-7 h-7 flex items-center justify-center hover:bg-emerald-700 rounded-full transition-colors"
                                                        >
                                                            <Minus size={14} strokeWidth={4} />
                                                        </button>
                                                        <input 
                                                            type="number"
                                                            value={totalQty}
                                                            onChange={(e) => {
                                                                e.stopPropagation();
                                                                const newVal = Math.max(0, parseInt(e.target.value) || 0);
                                                                const diff = newVal - totalQty;
                                                                if (diff !== 0) {
                                                                    const itemToUpdate = productInCart[0];
                                                                    if (itemToUpdate) updateQty(itemToUpdate.id, diff);
                                                                    else addToCart(product); // Should not happen if totalQty > 0
                                                                }
                                                            }}
                                                            onClick={(e) => e.stopPropagation()}
                                                            className="text-[13px] font-black min-w-[24px] w-8 text-center bg-transparent outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                        />
                                                        <button 
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                addToCart(product);
                                                            }}
                                                            className="w-7 h-7 flex items-center justify-center hover:bg-emerald-700 rounded-full transition-colors"
                                                        >
                                                            <Plus size={14} strokeWidth={4} />
                                                        </button>
                                                    </>
                                                ) : (
                                                    <button 
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            addToCart(product);
                                                        }}
                                                        className="w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white hover:scale-110 active:scale-95 transition-all"
                                                    >
                                                        <Plus size={20} strokeWidth={4} />
                                                    </button>
                                                )}
                                            </div>
                                        );
                                    })()}
                                </div>
                                <div className="px-2 flex-1 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className="font-bold text-slate-800 text-sm line-clamp-2">{product.name}</h4>
                                        </div>
                                        <div className="flex flex-col">
                                            {product.discountPercent > 0 && (
                                                <span className="text-[10px] font-bold line-through text-slate-400">
                                                    Rp {product.price.toLocaleString('id-ID')}
                                                </span>
                                            )}
                                            <p className="text-emerald-600 font-black text-base italic">
                                                Rp {(product.discountPercent > 0 
                                                    ? Math.round(product.price * (1 - (product.discountPercent / 100))) 
                                                    : product.price).toLocaleString('id-ID')}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-3 flex items-center justify-between text-[10px] font-bold text-slate-400">
                                        <span>{product.category}</span>
                                        <span className={`text-[10px] font-black uppercase tracking-tighter ${product.stock > 10 ? 'text-emerald-400' : product.stock > 0 ? 'text-amber-500 animate-pulse' : 'text-slate-400'}`}>
                                            {product.stock > 10 ? 'Tersedia' : product.stock > 0 ? 'Stok Terbatas' : 'Habis'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            {/* Right Side: Order Summary */}
            <aside className="hidden md:flex w-[320px] lg:w-[420px] shrink-0 bg-slate-50 p-4 lg:p-6 flex-col">
                <div className="bg-white rounded-[24px] shadow-sm border border-slate-200 flex-1 flex flex-col overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex items-center gap-3">
                        <div className="text-emerald-600">
                            <ShoppingBag size={24} />
                        </div>
                        <h2 className="text-[17px] font-bold text-slate-800">
                            Ringkasan Pesanan
                        </h2>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 lg:p-6 bg-slate-50/30 flex flex-col gap-6">
                        {cart.length === 0 ? (
                            <div className="h-40 flex flex-col items-center justify-center text-slate-300 gap-4 opacity-70">
                                <ShoppingBag size={48} strokeWidth={1.5} />
                                <p className="font-medium text-sm">Keranjang kosong</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {cart.map(item => (
                                    <div key={item.id} className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-slate-100 hover:border-emerald-200 transition-all">
                                        <div className="flex-1">
                                            <h4 className="font-bold text-[13px] text-slate-800 leading-tight">{item.name}</h4>
                                            <p className="text-[11px] text-emerald-600 font-bold mt-1">Rp {item.price.toLocaleString('id-ID')}</p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-2.5 bg-slate-50 p-1 rounded-lg border border-slate-100">
                                                <button onClick={() => updateQty(item.id, -1)} className="w-6 h-6 flex items-center justify-center bg-white rounded shadow-sm text-slate-500 hover:text-emerald-600 transition-colors">
                                                    <Minus size={12} />
                                                </button>
                                                <span className="text-[12px] font-black text-slate-800 w-4 text-center">{item.quantity}</span>
                                                <button onClick={() => addToCart(item)} className="w-6 h-6 flex items-center justify-center bg-white rounded shadow-sm text-slate-500 hover:text-emerald-600 transition-colors">
                                                    <Plus size={12} />
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
                        <div className="space-y-4 bg-white p-5 rounded-[24px] border border-slate-100 shadow-sm mt-auto">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Informasi Pemesanan</h3>
                            <div className="grid grid-cols-1 gap-3">
                                <div className="relative">
                                    <select
                                        value={orderType}
                                        onChange={(e) => setOrderType(e.target.value)}
                                        className="w-full text-[13px] px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium appearance-none"
                                    >
                                        <option value="" disabled>Opsi Pengiriman</option>
                                        <option value="Ambil di Resto">Ambil di Resto</option>
                                        <option value="Delivery">Delivery</option>
                                    </select>
                                    <span className="absolute top-2 right-4 text-red-500 font-bold text-sm">*</span>
                                </div>

                                <div className="relative">
                                    <input type="text" placeholder="Nama Lengkap" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full text-[13px] px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium" />
                                    <span className="absolute top-2 right-4 text-red-500 font-bold text-sm">*</span>
                                </div>
                                
                                {orderType === 'Delivery' && (
                                    <div className="space-y-2">
                                        <div className="flex gap-2">
                                            <div className="relative flex-1">
                                                <select
                                                    value={customerAddress}
                                                    onChange={(e) => setCustomerAddress(e.target.value)}
                                                    className="w-full text-[13px] px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium appearance-none"
                                                >
                                                    <option value="" disabled>Pilih Alamat Pengiriman</option>
                                                    {userProfile.addresses.map(addr => (
                                                        <option key={addr.id} value={addr.details}>{addr.label}: {addr.details}</option>
                                                    ))}
                                                </select>
                                                <span className="absolute top-2 right-4 text-red-500 font-bold text-sm">*</span>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    setIsSettingsOpen(true);
                                                    setActiveSettingsTab('profil');
                                                }}
                                                className="px-4 py-3 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl hover:bg-emerald-100 transition-all flex items-center justify-center shrink-0"
                                                title="Tambah Alamat"
                                            >
                                                <Plus size={18} />
                                            </button>
                                        </div>
                                        {userProfile.addresses.length === 0 && (
                                            <p className="text-[10px] text-amber-600 font-bold">* Belum ada alamat. Silakan tambah alamat baru.</p>
                                        )}
                                    </div>
                                )}
                                <textarea
                                    placeholder="Keterangan / Catatan Pesanan (Optional)..."
                                    value={orderNote}
                                    onChange={(e) => setOrderNote(e.target.value)}
                                    className="w-full text-[13px] px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium min-h-[100px] resize-none"
                                ></textarea>
                                <div className="relative">
                                    <input type="tel" placeholder="Nomor WhatsApp" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} className="w-full text-[13px] px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium" />
                                    <span className="absolute top-2 right-4 text-red-500 font-bold text-sm">*</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 lg:p-6 bg-white border-t border-slate-100">
                        <div className="mb-4 space-y-2">
                            <div className="flex justify-between text-slate-500 text-xs font-medium">
                                <span>Subtotal</span>
                                <span>Rp {subtotal.toLocaleString('id-ID', { maximumFractionDigits: 0 })}</span>
                            </div>

                            {orderType === 'Delivery' && (
                                <div className="flex justify-between text-slate-500 text-xs font-medium">
                                    <span>Biaya Pengiriman</span>
                                    <span>Rp {deliveryFee.toLocaleString('id-ID')}</span>
                                </div>
                            )}

                            {/* Toggles & Breakdown Pajak */}
                            {storeSettings.isPajakActive && (
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center py-2 px-3 rounded-lg border border-emerald-100 bg-emerald-50/50 flex-wrap gap-2 transition-all">
                                        <div className="flex items-center gap-2">
                                            <div className="text-emerald-500 flex items-center justify-center w-4 h-4 rounded-full bg-white shadow-sm shrink-0">
                                                <Info size={10} />
                                            </div>
                                            <span className="text-xs font-medium text-emerald-600">Pajak Daerah (10%)</span>
                                        </div>
                                        <span className="text-xs font-bold text-emerald-600">Rp {pajakValue.toLocaleString('id-ID')}</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-between items-center mb-4">
                            <span className="text-sm font-bold text-slate-800 uppercase tracking-wide">TOTAL AKHIR</span>
                            <span className="text-2xl font-black text-emerald-600 tracking-tighter">Rp {totalAmount.toLocaleString('id-ID')}</span>
                        </div>

                        <div className="flex flex-col gap-3">
                            <select
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                className="w-full text-sm px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer text-slate-600 font-medium"
                            >
                                <option value="" disabled>Pilih Metode Pembayaran</option>
                                <option value="COD">COD</option>
                                <option value="Gopay">Gopay</option>
                                <option value="Dana">Dana</option>
                                <option value="Transfer Bank">Transfer Bank</option>
                            </select>

                            <button
                                onClick={handleCheckout}
                                disabled={cart.length === 0 || isProcessing}
                                className={`w-full py-3 rounded-xl font-bold text-base transition flex items-center justify-center gap-2 ${cart.length === 0 || isProcessing ? 'bg-slate-200 text-slate-500 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-200'}`}
                            >
                                {isProcessing ? 'Memproses...' : <>Bayar Sekarang <ChevronRight size={18} /></>}
                            </button>
                        </div>
                    </div>
                </div>
            </aside>



            {isQrisOpen && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl relative flex flex-col items-center text-center">
                        <button onClick={() => setIsQrisOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                            <X size={20} />
                        </button>
                        <h3 className="text-xl font-black text-slate-800 mb-2">Scan QRIS</h3>
                        <div className="bg-emerald-50 px-4 py-2 rounded-2xl border border-emerald-100 mb-4 inline-block">
                            <p className="text-sm font-black text-emerald-700">Total Tagihan: Rp {totalAmount.toLocaleString('id-ID')}</p>
                        </div>
                        <p className="text-sm text-slate-500 mb-4">Silakan scan kode QR di bawah menggunakan aplikasi {paymentMethod} Anda.</p>
                        <div className="bg-white border rounded-xl p-2 mb-6">
                            <img src={paymentMethod === 'Gopay' ? "/qris-gopay.jpg" : "/qris-dana.jpg"} alt={`QRIS ${paymentMethod}`} className="w-full max-w-[250px] mx-auto rounded-lg" />
                        </div>
                        <button
                            onClick={() => {
                                setIsQrisOpen(false);
                                processTransactionData();
                            }}
                            className="p-4 w-full font-black text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all shadow-lg text-lg"
                        >
                            Sudah Bayar
                        </button>
                    </div>
                </div>
            )}

            {isCodOpen && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl relative flex flex-col items-center text-center">
                        <button onClick={() => setIsCodOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                            <X size={20} />
                        </button>
                        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4 mt-2">
                            <MessageCircle size={32} />
                        </div>
                        <h3 className="text-xl font-black text-slate-800 mb-2">Konfirmasi Pesanan</h3>
                        <div className="bg-emerald-50 px-4 py-2 rounded-2xl border border-emerald-100 mb-4 inline-block">
                            <p className="text-sm font-black text-emerald-700">Total Tagihan: Rp {totalAmount.toLocaleString('id-ID')}</p>
                        </div>
                        <p className="text-sm text-slate-500 mb-4">Silakan konfirmasi pesanan Anda dengan menekan tombol dibawah ini: </p>

                        <a
                            href={`https://wa.me/${storeSettings.whatsapp}?text=Halo%20${encodeURIComponent(storeSettings.storeName)}%2C%20saya%20${encodeURIComponent(customerName)}%20ingin%20mengonfirmasi%20pesanan%20COD%20saya%20sebesar%20Rp%20${totalAmount.toLocaleString('id-ID')}.`}
                            target="_blank"
                            rel="noreferrer"
                            className="bg-slate-50 border border-slate-200 text-emerald-600 font-bold px-4 py-3 rounded-xl mb-6 flex items-center gap-2 hover:bg-emerald-50 transition w-full justify-center"
                        >
                            <MessageCircle size={18} /> Hubungi WhatsApp
                        </a>

                        <button
                            onClick={() => {
                                setIsCodOpen(false);
                                processTransactionData();
                            }}
                            className="p-4 w-full font-black text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all shadow-lg text-lg"
                        >
                            Sudah Konfirmasi
                        </button>
                    </div>
                </div>
            )}

            {isTransferOpen && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl relative flex flex-col items-center text-center">
                        <button onClick={() => setIsTransferOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                            <X size={20} />
                        </button>
                        <h3 className="text-xl font-black text-slate-800 mb-2 mt-4">Transfer Bank</h3>
                        <div className="bg-emerald-50 px-4 py-2 rounded-2xl border border-emerald-100 mb-4 inline-block">
                            <p className="text-sm font-black text-emerald-700">Total Tagihan: Rp {totalAmount.toLocaleString('id-ID')}</p>
                        </div>
                        <p className="text-sm text-slate-500 mb-6">Silakan transfer sesuai nominal total di atas ke salah satu rekening berikut:</p>

                        <div className="w-full flex flex-col gap-4 mb-6">
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-left">
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Bank BSI</p>
                                <p className="text-lg font-black text-slate-800 tracking-wider">7270099127</p>
                                <p className="text-sm font-medium text-slate-600">A/N Sidqi Alaudin</p>
                            </div>
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-left">
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Bank BRI</p>
                                <p className="text-lg font-black text-slate-800 tracking-wider">431301004479505</p>
                                <p className="text-sm font-medium text-slate-600">A/N Sidqi Alaudin</p>
                            </div>
                        </div>

                        <button
                            onClick={() => {
                                setIsTransferOpen(false);
                                processTransactionData();
                            }}
                            className="p-4 w-full font-black text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all shadow-lg text-lg"
                        >
                            Sudah Bayar
                        </button>
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
            {/* Floating Cart Button (Mobile Only) */}
            <div className="md:hidden fixed bottom-24 right-6 z-40">
                <button
                    onClick={() => setIsCartModalOpen(true)}
                    className="relative bg-emerald-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all outline-none"
                >
                    <ShoppingCart size={24} />
                    {cart.length > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-black w-6 h-6 flex items-center justify-center rounded-full border-2 border-white animate-bounce">
                            {cart.length}
                        </span>
                    )}
                </button>
            </div>

            {/* Standardized Bottom Navigation */}
            <CustomerBottomNav onOpenSettings={() => setIsSettingsOpen(true)} />

            {/* Cart Modal for Mobile */}
            {isCartModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] md:hidden">
                    <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[2.5rem] h-[90vh] flex flex-col overflow-hidden shadow-2xl">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h3 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                                <ShoppingCart size={20} className="text-emerald-600" />
                                Keranjang Pesanan
                            </h3>
                            <button onClick={() => setIsCartModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6 bg-white">
                            {cart.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-slate-300 opacity-50 py-10">
                                    <ShoppingBag size={64} className="mb-4" />
                                    <p className="font-bold">Keranjang masih kosong</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {cart.map(item => (
                                        <div key={item.id} className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                            <div className="flex-1">
                                                <h4 className="font-bold text-sm text-slate-800">{item.name}</h4>
                                                <p className="text-xs text-emerald-600 font-black mt-0.5">Rp {item.price.toLocaleString('id-ID')}</p>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-2.5 bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
                                                    <button onClick={() => updateQty(item.id, -1)} className="w-8 h-8 flex items-center justify-center bg-slate-50 rounded-lg text-slate-600">
                                                        <Minus size={14} />
                                                    </button>
                                                    <span className="text-sm font-black w-5 text-center">{item.quantity}</span>
                                                    <button onClick={() => addToCart(item)} className="w-8 h-8 flex items-center justify-center bg-slate-50 rounded-lg text-slate-600">
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
                                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Informasi Pemesanan</h3>
                                            <div className="relative">
                                                <select
                                                    value={orderType}
                                                    onChange={(e) => setOrderType(e.target.value)}
                                                    className="w-full text-sm px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold appearance-none mb-1"
                                                >
                                                    <option value="" disabled>Opsi Pengiriman</option>
                                                    <option value="Ambil di Resto">Ambil di Resto</option>
                                                    <option value="Delivery">Delivery</option>
                                                </select>
                                                <span className="absolute top-2 right-4 text-red-500 font-bold text-sm">*</span>
                                            </div>

                                            <div className="relative">
                                                <input type="text" placeholder="Nama Lengkap" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full text-sm px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold" />
                                                <span className="absolute top-2 right-4 text-red-500 font-bold text-sm">*</span>
                                            </div>
                                            
                                            {orderType === 'Delivery' && (
                                                <div className="space-y-2">
                                                    <div className="flex gap-2">
                                                        <div className="relative flex-1">
                                                            <select
                                                                value={customerAddress}
                                                                onChange={(e) => setCustomerAddress(e.target.value)}
                                                                className="w-full text-sm px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold appearance-none"
                                                            >
                                                                <option value="" disabled>Pilih Alamat Pengiriman</option>
                                                                {userProfile.addresses.map(addr => (
                                                                    <option key={addr.id} value={addr.details}>{addr.label}: {addr.details}</option>
                                                                ))}
                                                            </select>
                                                            <span className="absolute top-2 right-4 text-red-500 font-bold text-sm">*</span>
                                                        </div>
                                                        <button
                                                            onClick={() => {
                                                                setIsCartModalOpen(false);
                                                                setIsSettingsOpen(true);
                                                                setActiveSettingsTab('profil');
                                                            }}
                                                            className="px-4 py-3 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl flex items-center justify-center"
                                                        >
                                                            <Plus size={18} />
                                                        </button>
                                                    </div>
                                                    {userProfile.addresses.length === 0 && (
                                                        <p className="text-[10px] text-amber-600 font-bold">* Silakan tambah alamat lebih dulu.</p>
                                                    )}
                                                </div>
                                            )}
                                            <textarea
                                                placeholder="Keterangan / Catatan (Optional)..."
                                                value={orderNote}
                                                onChange={(e) => setOrderNote(e.target.value)}
                                                className="w-full text-sm px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold min-h-[100px] resize-none"
                                            ></textarea>
                                            <div className="relative">
                                                <input type="tel" placeholder="Nomor WhatsApp" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} className="w-full text-sm px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold" />
                                                <span className="absolute top-2 right-4 text-red-500 font-bold text-sm">*</span>
                                            </div>
                                        </div>

                                        <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-xl">
                                            <div className="flex justify-between items-center bg-white/10 p-3 rounded-xl border border-white/10">
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic mb-1">Total Pembayaran</span>
                                                    <span className="text-2xl font-black text-emerald-400 tracking-tighter">Rp {totalAmount.toLocaleString('id-ID')}</span>
                                                </div>
                                                <div className="flex flex-col items-end gap-1">
                                                    {orderType === 'Delivery' && (
                                                        <div className="flex flex-col items-end">
                                                            <div className="text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30 shadow-sm">
                                                                Delivery Fee
                                                            </div>
                                                            <span className="text-[11px] font-bold text-blue-400/80 mt-1">Rp {deliveryFee.toLocaleString('id-ID')}</span>
                                                        </div>
                                                    )}
                                                    {storeSettings.isPajakActive && (
                                                        <div className="flex flex-col items-end">
                                                            <div className="text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-sm">
                                                                Pajak (10%)
                                                            </div>
                                                            <span className="text-[11px] font-bold text-emerald-400/80 mt-1">Rp {pajakValue.toLocaleString('id-ID')}</span>
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
                                                    <option value="" disabled className="text-slate-800">Pilih Pembayaran</option>
                                                    <option value="COD" className="text-slate-800">COD (Bayar di Tempat)</option>
                                                    <option value="Gopay" className="text-slate-800">Gopay</option>
                                                    <option value="Dana" className="text-slate-800">Dana</option>
                                                    <option value="Transfer Bank" className="text-slate-800">Transfer Bank</option>
                                                </select>
                                                <button
                                                    onClick={() => {
                                                        setIsCartModalOpen(false);
                                                        handleCheckout();
                                                    }}
                                                    disabled={isProcessing}
                                                    className="w-full py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-emerald-500/20 transition-all active:scale-95"
                                                >
                                                    {isProcessing ? 'Memproses...' : 'Selesaikan Pesanan'}
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

            {/* Standardized Settings Modal */}
            <SettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                activeTab={activeSettingsTab}
                setActiveTab={setActiveSettingsTab}
                userProfile={userProfile}
                setUserProfile={setUserProfile}
                handleSaveProfile={handleSaveProfile}
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

export default function CustomerPOSPage() {
    return (
        <Suspense fallback={<div className="h-screen w-screen flex items-center justify-center font-bold text-emerald-600">Loading Santara Point...</div>}>
            <CustomerPortalContent />
        </Suspense>
    );
}
