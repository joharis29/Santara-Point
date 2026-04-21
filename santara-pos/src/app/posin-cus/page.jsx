"use client";

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
import WaitingOverlay from './WaitingOverlay';
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

const ProductImageSlider = ({ product }) => {
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
};

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

    React.useEffect(() => {
        const fetchUserData = async () => {
            const { data: { user }, error } = await supabase.auth.getUser();
            if (user) {
                const meta = user.user_metadata || {};
                const fName = meta.first_name || '';
                const lName = meta.last_name || '';
                const fullName = `${fName} ${lName}`.trim() || 'Sobat Santara';

                setCustomerName(fullName);
                setIsLoggedIn(true);

                // Load additional data (Priority: Supabase Metadata > localStorage)
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

                // Sync to localStorage for immediate consistency check in other tabs if needed
                localStorage.setItem('customerName', fullName);
                localStorage.setItem('customerFirstName', fName);
                localStorage.setItem('customerLastName', lName);
                localStorage.setItem('registeredEmail', user.email || '');
                if (meta.whatsapp) localStorage.setItem('registeredWhatsapp', meta.whatsapp);
            } else {
                // Fallback to localStorage if no session (guest mode or legacy)
                const storedName = localStorage.getItem('customerName');
                if (storedName) {
                    setCustomerName(storedName);
                    setIsLoggedIn(true);
                }
            }
        };

        fetchUserData();

        const storedFavs = JSON.parse(localStorage.getItem('santaraFavorites') || '[]');
        setFavorites(storedFavs);

        const storedProducts = localStorage.getItem('santaraProducts');
        if (storedProducts) {
            try {
                const parsed = JSON.parse(storedProducts);
                // Merge with master data to ensure new properties like discountPercent are present
                const merged = PRODUCTS.map(masterItem => {
                    const storedItem = parsed.find(p => p.id === masterItem.id);
                    return storedItem ? { ...masterItem, ...storedItem } : masterItem;
                });
                setProducts(merged);
            } catch (e) {
                console.error("Error parsing products", e);
                setProducts(PRODUCTS);
            }
        } else {
            localStorage.setItem('santaraProducts', JSON.stringify(PRODUCTS));
            setProducts(PRODUCTS);
        }

        const storedSettings = localStorage.getItem('santaraStoreSettings');
        if (storedSettings) {
            try {
                const parsed = JSON.parse(storedSettings);
                setStoreSettings({ ...DEFAULT_SETTINGS, ...parsed });
            } catch (e) {
                console.error("Error parsing settings", e);
            }
        }

        // Restore active transaction overlay if any
        const activeTxId = localStorage.getItem('santaraActiveTxId');
        if (activeTxId) {
            setCurrentTxId(activeTxId);
            setIsWaitingOpen(true);
        }

        // Load language & theme
        const storedLang = localStorage.getItem('santaraLanguage');
        if (storedLang) setLanguage(storedLang);
        const storedTheme = localStorage.getItem('santaraTheme');
        if (storedTheme) setTheme(storedTheme);

        // Check for settings query param
        if (searchParams.get('settings') === 'true') {
            setIsSettingsOpen(true);
            setActiveSettingsTab('profil');
        }
    }, [router]);

    const addAddress = () => {
        const newAddress = { id: Date.now(), label: '', details: '' };
        setUserProfile({ ...userProfile, addresses: [...userProfile.addresses, newAddress] });
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

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        const fullName = `${userProfile.firstName} ${userProfile.lastName}`.trim();

        try {
            // Update Supabase Metadata
            const { error } = await supabase.auth.updateUser({
                data: {
                    first_name: userProfile.firstName,
                    last_name: userProfile.lastName,
                    whatsapp: userProfile.whatsapp,
                    addresses: userProfile.addresses
                }
            });

            if (error) {
                alert(`Gagal memperbarui profil di server: ${error.message}`);
                return;
            }

            // Sync to local storage
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
    };

    const handleConfirmEmailChange = async (e) => {
        e.preventDefault();
        if (!newEmailInput || !newEmailInput.includes('@')) {
            alert('Silakan masukkan alamat email baru yang valid.');
            return;
        }

        setIsUpdatingEmail(true);
        try {
            const { error } = await supabase.auth.updateUser({ email: newEmailInput });
            if (error) {
                alert(`Gagal mengirim konfirmasi: ${error.message}`);
            } else {
                alert('Alhamdulillah! Permintaan perubahan email telah dikirim. Silakan periksa kotak masuk email BARU Anda untuk melakukan konfirmasi.');
                setIsChangeEmailOpen(false);
                setNewEmailInput('');
            }
        } catch (err) {
            console.error("Email update error:", err);
            alert("Terjadi kesalahan sistem.");
        } finally {
            setIsUpdatingEmail(false);
        }
    };

    const handleConfirmWhatsappChange = async (e) => {
        e.preventDefault();
        if (!newWhatsappInput || newWhatsappInput.length < 10) {
            alert('Silakan masukkan nomor WhatsApp yang valid.');
            return;
        }

        setIsUpdatingWhatsapp(true);
        try {
            const { error } = await supabase.auth.updateUser({
                data: { whatsapp: newWhatsappInput }
            });
            if (error) {
                alert(`Gagal memperbarui WhatsApp: ${error.message}`);
            } else {
                localStorage.setItem('registeredWhatsapp', newWhatsappInput);
                setUserProfile(prev => ({ ...prev, whatsapp: newWhatsappInput }));
                alert('Alhamdulillah! Nomor WhatsApp berhasil diperbarui.');
                setIsChangeWhatsappOpen(false);
                setNewWhatsappInput('');
            }
        } catch (err) {
            console.error("Whatsapp update error:", err);
            alert("Terjadi kesalahan sistem.");
        } finally {
            setIsUpdatingWhatsapp(false);
        }
    };

    const handleConfirmPasswordChange = async (e) => {
        e.preventDefault();
        if (newPasswordInput.length < 6) {
            alert('Kata sandi minimal 6 karakter.');
            return;
        }
        if (newPasswordInput !== confirmPasswordInput) {
            alert('Konfirmasi kata sandi tidak cocok.');
            return;
        }

        setIsUpdatingPassword(true);
        try {
            const { error } = await supabase.auth.updateUser({ password: newPasswordInput });
            if (error) {
                alert(`Gagal memperbarui kata sandi: ${error.message}`);
            } else {
                alert('Alhamdulillah! Kata sandi berhasil diperbarui.');
                setIsChangePasswordOpen(false);
                setNewPasswordInput('');
                setConfirmPasswordInput('');
            }
        } catch (err) {
            console.error("Password update error:", err);
            alert("Terjadi kesalahan sistem.");
        } finally {
            setIsUpdatingPassword(false);
        }
    };

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
    const [isWaitingOpen, setIsWaitingOpen] = useState(false);
    const [currentTxId, setCurrentTxId] = useState(null);
    const [toppingModalProduct, setToppingModalProduct] = useState(null);
    const [isQrisOpen, setIsQrisOpen] = useState(false);
    const [isCodOpen, setIsCodOpen] = useState(false);
    const [isTransferOpen, setIsTransferOpen] = useState(false);
    const [isCartModalOpen, setIsCartModalOpen] = useState(false);
    // Pajak Daerah is strictly mandatory

    const categories = ['Semua', 'Makanan', 'Minuman', 'Snack', 'Frozen Food'];

    // --- Perhitungan Total (Inclusive Pajak 10%) ---
    const menuTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const subtotal = storeSettings.isPajakActive ? menuTotal / 1.10 : menuTotal;
    const pajakValue = storeSettings.isPajakActive ? Math.round(menuTotal - subtotal) : 0;
    const totalAmount = Math.round(menuTotal);

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

    const processTransactionData = async () => {
        const tId = 'TRX-' + Math.floor(Math.random() * 1000000);
        
        // Data for LocalStorage (keep camelCase for internal consistency if needed, 
        // or just use the same as DB)
        const localTransaction = {
            id: tId,
            timestamp: new Date().toISOString(),
            customerName: customerName || 'Pelanggan Online',
            customerPhone: customerPhone || 'N/A',
            deliveryAddress: customerAddress || 'Dine-in / Ambil di Toko',
            queueNumber: 'P-' + Math.floor(Math.random() * 100),
            orderType: customerAddress ? 'Delivery' : 'Dine-in',
            keterangan: orderNote,
            paymentMethod,
            source: 'Cus',
            totalAmount,
            pajak: pajakValue,
            status: 'Menunggu',
            items: cart.map(({ name, quantity, price }) => ({ name, quantity, price }))
        };

        // Data for Supabase (Must match Snake Case column names)
        const dbTransaction = {
            id: tId,
            timestamp: new Date().toISOString(),
            customer_name: customerName || 'Pelanggan Online',
            customer_phone: customerPhone || 'N/A',
            delivery_address: customerAddress || 'Dine-in / Ambil di Toko',
            queue_number: 'P-' + Math.floor(Math.random() * 100),
            order_type: customerAddress ? 'Delivery' : 'Dine-in',
            keterangan: orderNote,
            payment_method: paymentMethod,
            source: 'Cus',
            total_amount: totalAmount,
            pajak: pajakValue,
            status: 'Menunggu',
            items: cart.map(({ name, quantity, price }) => ({ name, quantity, price }))
        };

        try {
            // Push to Supabase for cross-device sync
            const { error } = await supabase.from('transactions').insert([dbTransaction]);
            if (error) throw error;

            console.log("Transaction synced to Supabase successfully");

            // Also keep in localStorage for local history
            const existingHistory = JSON.parse(localStorage.getItem('santaraTransactionHistory') || '[]');
            localStorage.setItem('santaraTransactionHistory', JSON.stringify([localTransaction, ...existingHistory]));
            
            // Persist active ID for tracking overlay
            localStorage.setItem('santaraActiveTxId', tId);
            
            setCurrentTxId(tId);
            setIsWaitingOpen(true);
            setCart([]);
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
        if (!customerName || !customerAddress || !customerPhone || !paymentMethod) {
            return alert('Mohon lengkapi Data Diri Pemesan (Termasuk Alamat) dan Metode Pembayaran!');
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
                <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                    <Store className="text-white" size={24} strokeWidth={3} />
                </div>
                <nav className="flex-1 flex flex-col gap-4">
                    <button 
                        onClick={() => setActiveCategory('Semua')}
                        className={`p-4 rounded-2xl transition-all ${activeCategory === 'Semua' ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-500/20' : 'text-slate-500 hover:bg-slate-800 hover:text-slate-300'}`}
                    >
                        <TrendingUp size={24} />
                    </button>
                    <button 
                        onClick={() => {
                            setActiveSettingsTab('profil');
                            setIsSettingsOpen(true);
                        }}
                        className="p-4 rounded-2xl text-slate-500 hover:bg-slate-800 hover:text-slate-300 transition-all"
                    >
                        <Menu size={24} />
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
                <header className="px-6 py-8 md:px-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => router.push('/homepage')}
                            className="p-2.5 hover:bg-slate-100 rounded-2xl transition-all text-slate-600 border border-slate-100 shadow-sm md:shadow-none md:border-none"
                            title="Kembali ke Beranda"
                        >
                            <ArrowLeft size={24} strokeWidth={3} />
                        </button>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">Pilih Menu Favorit</h1>
                            <div className="flex items-center gap-2 mt-1 md:mt-2">
                                <span className="bg-emerald-600 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1 shadow-lg shadow-emerald-100">
                                    <ShieldCheck size={12} /> Syariah Verified
                                </span>
                                <span className="text-slate-400 text-xs font-bold">Halo, {customerName.trim().split(' ')[0]}!</span>
                            </div>
                        </div>
                    </div>
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Cari rasa yang berkah..."
                            className="w-full pl-12 pr-4 py-3 bg-slate-100 border-none rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm font-medium"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </header>

                <div className="px-6 md:px-10 mb-8 flex items-center justify-between gap-4 overflow-x-auto">
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
                                </div>
                                <div className="px-2 flex-1 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className="font-bold text-slate-800 text-sm line-clamp-2">{product.name}</h4>
                                        </div>
                                        <div className="flex flex-col">
                                            {product.discountPercent > 0 && (
                                                <span className="text-[10px] font-bold line-through text-slate-400">
                                                    Rp {(Math.round(product.price / (1 - (product.discountPercent / 100)))).toLocaleString()}
                                                </span>
                                            )}
                                            <p className="text-emerald-600 font-black text-base italic">Rp {product.price.toLocaleString('en-US')}</p>
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
                                            <p className="text-[11px] text-emerald-600 font-bold mt-1">Rp {item.price.toLocaleString('en-US')}</p>
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
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Data Diri Pemesan</h3>
                            <div className="grid grid-cols-1 gap-3">
                                <input type="text" placeholder="Nama Lengkap" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full text-[13px] px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium" />
                                <div className="space-y-2">
                                    <div className="flex gap-2">
                                        <select
                                            value={customerAddress}
                                            onChange={(e) => setCustomerAddress(e.target.value)}
                                            className="flex-1 text-[13px] px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium appearance-none"
                                        >
                                            <option value="" disabled>Pilih Alamat Pengiriman</option>
                                            {userProfile.addresses.map(addr => (
                                                <option key={addr.id} value={addr.details}>{addr.label}: {addr.details}</option>
                                            ))}
                                        </select>
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
                                <textarea
                                    placeholder="Keterangan / Catatan Pesanan (Optional)..."
                                    value={orderNote}
                                    onChange={(e) => setOrderNote(e.target.value)}
                                    className="w-full text-[13px] px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium min-h-[100px] resize-none"
                                ></textarea>
                                <input type="tel" placeholder="Nomor WhatsApp" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} className="w-full text-[13px] px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium" />
                            </div>
                        </div>
                    </div>

                    <div className="p-4 lg:p-6 bg-white border-t border-slate-100">
                        <div className="mb-4 space-y-2">
                            <div className="flex justify-between text-slate-500 text-xs font-medium">
                                <span>Subtotal</span>
                                <span>Rp {subtotal.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
                            </div>

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
                                        <span className="text-xs font-bold text-emerald-600">Rp {pajakValue.toLocaleString('en-US')}</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-between items-center mb-4">
                            <span className="text-sm font-bold text-slate-800 uppercase tracking-wide">TOTAL AKHIR</span>
                            <span className="text-2xl font-black text-emerald-600 tracking-tighter">Rp {totalAmount.toLocaleString('en-US')}</span>
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

            {/* Injected Waiting Tracker Overlay */}
            <WaitingOverlay
                isOpen={isWaitingOpen}
                onClose={handleCloseWaiting}
                customerName={customerName}
                totalAmount={totalAmount}
                transactionId={currentTxId}
            />

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
                            href={`https://wa.me/${storeSettings.whatsapp}?text=Halo%20${encodeURIComponent(storeSettings.storeName)}%2C%20saya%20${encodeURIComponent(customerName)}%20ingin%20mengonfirmasi%20pesanan%20COD%20saya%20sebesar%20Rp%20${totalAmount.toLocaleString('en-US')}.`}
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
                                                <p className="text-xs text-emerald-600 font-black mt-0.5">Rp {item.price.toLocaleString('en-US')}</p>
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
                                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Data Pemesan</h3>
                                            <input type="text" placeholder="Nama Lengkap" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full text-sm px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold" />
                                            <div className="space-y-2">
                                                <div className="flex gap-2">
                                                    <select
                                                        value={customerAddress}
                                                        onChange={(e) => setCustomerAddress(e.target.value)}
                                                        className="flex-1 text-sm px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold appearance-none"
                                                    >
                                                        <option value="" disabled>Pilih Alamat Pengiriman</option>
                                                        {userProfile.addresses.map(addr => (
                                                            <option key={addr.id} value={addr.details}>{addr.label}: {addr.details}</option>
                                                        ))}
                                                    </select>
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
                                            <textarea
                                                placeholder="Keterangan / Catatan (Optional)..."
                                                value={orderNote}
                                                onChange={(e) => setOrderNote(e.target.value)}
                                                className="w-full text-sm px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold min-h-[100px] resize-none"
                                            ></textarea>
                                            <input type="tel" placeholder="Nomor WhatsApp" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} className="w-full text-sm px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold" />
                                        </div>

                                        <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-xl">
                                            <div className="flex justify-between items-center bg-white/10 p-3 rounded-xl border border-white/10">
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic mb-1">Total Pembayaran</span>
                                                    <span className="text-2xl font-black text-emerald-400 tracking-tighter">Rp {totalAmount.toLocaleString('en-US')}</span>
                                                </div>
                                                {storeSettings.isPajakActive && (
                                                    <div className="flex flex-col items-end">
                                                        <div className="text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-sm">
                                                            Pajak (10%)
                                                        </div>
                                                        <span className="text-[11px] font-bold text-emerald-400/80 mt-1">Rp {pajakValue.toLocaleString('en-US')}</span>
                                                    </div>
                                                )}
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

// Modal Ganti Email
const ChangeEmailModal = ({ isOpen, onClose, oldEmail, newEmail, setNewEmail, onConfirm, isProcessing }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[300] flex items-center justify-center p-4">
            <div className="bg-white rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl p-8 space-y-6">
                <div>
                    <h4 className="text-2xl font-black text-slate-800 tracking-tight">Ganti Email</h4>
                    <p className="text-slate-400 text-sm font-medium mt-1">Sistem akan mengirimkan link verifikasi ke email baru Anda.</p>
                </div>

                <form onSubmit={onConfirm} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Lama</label>
                        <input
                            type="email"
                            value={oldEmail}
                            readOnly
                            className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-slate-400 cursor-not-allowed"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Baru</label>
                        <input
                            type="email"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            required
                            className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-slate-700 transition-all"
                            placeholder="nama@emailbaru.com"
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black transition-all hover:bg-slate-200"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={isProcessing}
                            className="flex-2 py-4 bg-emerald-600 text-white rounded-2xl font-black shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all flex items-center justify-center disabled:opacity-50"
                        >
                            {isProcessing ? 'Memproses...' : 'Konfirmasi Email'}
                        </button>
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
            <div className="bg-white rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl p-8 space-y-6">
                <div>
                    <h4 className="text-2xl font-black text-slate-800 tracking-tight">Ganti WhatsApp</h4>
                    <p className="text-slate-400 text-sm font-medium mt-1">Masukkan nomor WhatsApp baru Anda yang aktif.</p>
                </div>

                <form onSubmit={onConfirm} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Nomor Lama</label>
                        <input
                            type="tel"
                            value={oldWhatsapp}
                            readOnly
                            className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-slate-400 cursor-not-allowed"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Nomor Baru</label>
                        <input
                            type="tel"
                            value={newWhatsapp}
                            onChange={(e) => setNewWhatsapp(e.target.value)}
                            required
                            className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-slate-700 transition-all"
                            placeholder="08xxxxxxxxxx"
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black transition-all hover:bg-slate-200"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={isProcessing}
                            className="flex-2 py-4 bg-emerald-600 text-white rounded-2xl font-black shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all flex items-center justify-center disabled:opacity-50"
                        >
                            {isProcessing ? 'Memproses...' : 'Simpan Nomor'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Modal Ganti Password
const ChangePasswordModal = ({ isOpen, onClose, newPassword, setNewPassword, confirmPassword, setConfirmPassword, onConfirm, isProcessing }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[300] flex items-center justify-center p-4">
            <div className="bg-white rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl p-8 space-y-6">
                <div>
                    <h4 className="text-2xl font-black text-slate-800 tracking-tight">Ganti Kata Sandi</h4>
                    <p className="text-slate-400 text-sm font-medium mt-1">Gunakan kata sandi yang kuat dan mudah diingat.</p>
                </div>

                <form onSubmit={onConfirm} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Kata Sandi Baru</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-slate-700 transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Konfirmasi Kata Sandi Baru</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-slate-700 transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black transition-all hover:bg-slate-200"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={isProcessing}
                            className="flex-2 py-4 bg-emerald-600 text-white rounded-2xl font-black shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all flex items-center justify-center disabled:opacity-50"
                        >
                            {isProcessing ? 'Memproses...' : 'Ubah Kata Sandi'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default function App() {
    return (
        <Suspense fallback={<div className="h-screen w-screen flex items-center justify-center font-bold text-emerald-600">Loading Santara Point...</div>}>
            <CustomerPortalContent />
        </Suspense>
    );
}