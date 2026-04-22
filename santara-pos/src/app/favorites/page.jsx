"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
    ShoppingBag,
    ShieldCheck,
    Search,
    Plus,
    Minus,
    Trash2,
    Info,
    ChevronRight,
    MessageCircle,
    Mail,
    LogOut,
    Home,
    Clock,
    ShoppingCart,
    Heart,
    Star,
    X,
    Filter,
    HeartOff,
    ArrowLeft,
    Settings
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import WaitingOverlay from '../posin-cus/WaitingOverlay';
import CustomerHeader from '@/components/CustomerHeader';
import CustomerBottomNav from '@/components/CustomerBottomNav';
import SettingsModal from '@/components/SettingsModal';

const DEFAULT_SETTINGS = {
    storeName: 'Santara Point',
    storeTagline: 'Hidangan Lezat, Penuh Keberkahan.',
    whatsapp: '6285846802177',
    email: 'santarapoint@gmail.com',
    address: 'Jl. Raya Santara No. 123, Bandung',
    footerText: '© 2024 Santara Point. Berkah setiap saat.'
};

const PRODUCTS = [
    { id: 7, name: 'Nasi Kuning', price: 15000, stock: 15, category: 'Makanan', img: '/nasi-kuning-baru.jpg', images: ['/nasi-kuning-baru.jpg'], rating: 4.8 },
    { id: 8, name: 'Nasi Uduk', price: 15000, stock: 20, category: 'Makanan', img: '/nasi-uduk-asli.jpg', images: ['/nasi-uduk-asli.jpg'], rating: 4.7 },
    { id: 9, name: 'Soto Ayam', price: 15000, stock: 15, category: 'Makanan', img: '/soto-ayam-asli.jpg', images: ['/soto-ayam-asli.jpg'], rating: 4.8 },
    { id: 10, name: 'Bubur Ayam', price: 15000, stock: 20, category: 'Makanan', img: '/bubur-ayam-asli.jpg', images: ['/bubur-ayam-asli.jpg'], rating: 4.8 },
    { id: 11, name: 'Ketoprak', price: 15000, stock: 15, category: 'Makanan', img: '/ketoprak-asli.jpg', images: ['/ketoprak-asli.jpg'], rating: 4.8 },
    { id: 12, name: 'Nasi Ayam Pop', price: 16000, stock: 15, category: 'Makanan', img: '/nasi-ayam-pop-asli.jpg', images: ['/nasi-ayam-pop-asli.jpg'], rating: 4.8 },
    { id: 13, name: 'Nasi Ayam Kecap', price: 16000, stock: 15, category: 'Makanan', img: '/nasi-ayam-kecap-asli.jpg', images: ['/nasi-ayam-kecap-asli.jpg'], rating: 4.8 },
    { id: 14, name: 'Nasi Ayam Balado', price: 16000, stock: 15, category: 'Makanan', img: '/nasi-ayam-balado-asli.jpg', images: ['/nasi-ayam-balado-asli.jpg'], rating: 4.8 },
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

            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black text-slate-800 shadow-sm flex items-center gap-1 z-10">
                <Star size={12} className="text-amber-500 fill-amber-500" /> {product.rating || '4.5'}
            </div>
            {product.stock <= 0 && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-10">
                    <span className="bg-white text-slate-900 px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest">Habis Terjual</span>
                </div>
            )}
            {product.isNew && (
                <div className="absolute top-4 right-4 bg-red-500 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-md z-30">
                    NEW
                </div>
            )}
        </div>
    );
};

function FavoritesContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [customerName, setCustomerName] = useState('Sobat Santara');
    const [favorites, setFavorites] = useState([]);
    const [products, setProducts] = useState(PRODUCTS);
    const [storeSettings, setStoreSettings] = useState(DEFAULT_SETTINGS);
    const [cart, setCart] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('Semua');
    const [customerEmail, setCustomerEmail] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [customerAddress, setCustomerAddress] = useState('');
    const [orderNote, setOrderNote] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [isWaitingOpen, setIsWaitingOpen] = useState(false);
    const [currentTxId, setCurrentTxId] = useState(null);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [activeSettingsTab, setActiveSettingsTab] = useState('profil');
    const [isAdmin, setIsAdmin] = useState(false);

    const handleCloseWaiting = () => {
        setIsWaitingOpen(false);
        setCurrentTxId(null);
        localStorage.removeItem('santaraActiveTxId');
        setCart([]);
        setPaymentMethod('');
    };
    const [toppingModalProduct, setToppingModalProduct] = useState(null);
    const [isQrisOpen, setIsQrisOpen] = useState(false);
    const [isCodOpen, setIsCodOpen] = useState(false);
    const [isTransferOpen, setIsTransferOpen] = useState(false);
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
    const [isCartModalOpen, setIsCartModalOpen] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const { data } = await supabase.auth.getUser();
                const user = data?.user;
                if (user) {
                    const meta = user.user_metadata || {};
                    const fName = meta.first_name || '';
                    const lName = meta.last_name || '';
                    const fullName = `${fName} ${lName}`.trim() || 'Sobat Santara';

                    setCustomerName(fullName);
                    setIsLoggedIn(true);
                    setCustomerEmail(user.email || '');
                    setCustomerPhone(meta.whatsapp || '');

                    setUserProfile({
                        firstName: fName,
                        lastName: lName,
                        email: user.email || '',
                        whatsapp: meta.whatsapp || '',
                        password: '••••••••',
                        addresses: meta.addresses || []
                    });
                } else {
                    const storedName = localStorage.getItem('customerName');
                    if (storedName) {
                        setCustomerName(storedName);
                        setIsLoggedIn(true);
                    }
                }
            } catch (err) {
                console.error("Error fetching user data:", err);
            }
        };

        fetchUserData();

        try {
            const storedFavs = JSON.parse(localStorage.getItem('santaraFavorites') || '[]');
            setFavorites(Array.isArray(storedFavs) ? storedFavs : []);
        } catch (e) {
            console.error("Error parsing favorites", e);
            setFavorites([]);
        }

        const storedProducts = localStorage.getItem('santaraProducts');
        if (storedProducts) {
            try {
                setProducts(JSON.parse(storedProducts));
            } catch (e) {
                console.error("Error parsing products", e);
            }
        }

        const storedSettings = localStorage.getItem('santaraStoreSettings');
        if (storedSettings) {
            try {
                setStoreSettings(JSON.parse(storedSettings));
            } catch (e) {
                console.error("Error parsing settings", e);
            }
        }

        const activeTxId = localStorage.getItem('santaraActiveTxId');
        if (activeTxId) {
            setCurrentTxId(activeTxId);
            setIsWaitingOpen(true);
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
            setCustomerName(`${userProfile.firstName} ${userProfile.lastName}`.trim());
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

    const categories = ['Semua', 'Makanan', 'Minuman', 'Snack', 'Frozen Food'];

    const menuTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const subtotal = menuTotal / 1.10;
    const pajakValue = Math.round(menuTotal - subtotal);
    const totalAmount = Math.round(menuTotal);

    const filteredProducts = products.filter(p =>
        favorites.includes(p.id) &&
        (activeCategory === 'Semua' || p.category === activeCategory) &&
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

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

    const processTransactionData = async () => {
        const tId = 'TRX-' + Math.floor(Math.random() * 1000000);

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
            const { error } = await supabase.from('transactions').insert([dbTransaction]);
            if (error) throw error;

            const localTransaction = { ...dbTransaction, customerName, customerPhone, deliveryAddress: customerAddress };
            const existingHistory = JSON.parse(localStorage.getItem('santaraTransactionHistory') || '[]');
            localStorage.setItem('santaraTransactionHistory', JSON.stringify([localTransaction, ...existingHistory]));
            localStorage.setItem('santaraActiveTxId', tId);

            setCurrentTxId(tId);
            setIsWaitingOpen(true);
            setCart([]);
        } catch (err) {
            console.error("Error syncing transaction:", err);
            alert("Gagal mengirim pesanan ke sistem.");
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


    const updateQty = (id, delta) => {
        setCart(cart.map(item => {
            if (item.id === id) {
                const newQty = Math.max(0, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        }).filter(item => item.quantity > 0));
    };

    return (
        <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden relative">
            {/* Standardized Sidebar (Desktop) */}
            <aside className="hidden lg:flex w-24 bg-white border-r border-slate-100 flex-col items-center py-10 gap-12 shrink-0">
                <button onClick={() => router.push('/')} className="hover:scale-105 transition-transform" title="Ke Beranda">
                    <img src="/santara-logo.png" alt="Santara Logo" className="w-10 h-10 object-contain" />
                </button>
                <nav className="flex-1 flex flex-col gap-8">
                    <button onClick={() => router.push('/posin-cus')} className="p-3 text-slate-300 hover:text-emerald-600 transition-colors" title="Buka Menu Utama">
                        <ShoppingBag size={24} />
                    </button>
                    <button className="p-3 text-emerald-600 bg-emerald-50 rounded-2xl shadow-md" title="Menu Favorit">
                        <Heart size={24} />
                    </button>
                    <button onClick={() => router.push('/customer-history')} className="p-3 text-slate-300 hover:text-emerald-600 transition-colors" title="Riwayat Pesanan">
                        <Clock size={24} />
                    </button>
                    <button onClick={() => setIsSettingsOpen(true)} className="p-3 text-slate-300 hover:text-emerald-600 transition-colors" title="Pengaturan">
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
            <main className="flex-1 flex flex-col overflow-hidden relative">
                <CustomerHeader
                    title={storeSettings.storeName}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    onSettingsClick={() => setIsSettingsOpen(true)}
                />

                {/* Left: Products List */}
                <div className="flex-1 flex flex-col overflow-hidden pt-6 pb-20 md:pb-0">
                    <div className="px-6 md:px-10 mb-6 overflow-x-auto">
                        <div className="flex gap-3">
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
                    </div>

                    <section className="flex-1 overflow-y-auto px-6 md:px-10 pb-32">
                        {filteredProducts.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-slate-300 gap-4 opacity-70">
                                <HeartOff size={64} strokeWidth={1.5} />
                                <p className="font-bold text-lg">Belum ada menu favorit</p>
                                <button onClick={() => router.push('/posin-cus')} className="text-emerald-600 font-black text-sm hover:underline">Lihat Semua Menu</button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-5">
                                {filteredProducts.map(product => (
                                    <div
                                        key={product.id}
                                        className={`bg-white p-3 rounded-[1.5rem] lg:rounded-[2rem] shadow-sm transition-all border border-transparent flex flex-col ${product.stock <= 0 ? 'opacity-60 grayscale' : ''}`}
                                    >
                                        <div className="relative">
                                            <button
                                                onClick={(e) => toggleFavorite(e, product.id)}
                                                className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur rounded-full shadow-sm z-30 hover:scale-110 active:scale-95 transition-transform"
                                                title="Hapus dari Favorit"
                                            >
                                                <Heart size={16} fill={favorites.includes(product.id) ? "#ef4444" : "transparent"} color={favorites.includes(product.id) ? "#ef4444" : "#94a3b8"} />
                                            </button>
                                            <ProductImageSlider product={product} />
                                        </div>
                                        <div className="px-1 lg:px-2 flex-1 flex flex-col justify-between">
                                            <div>
                                                <div className="flex justify-between items-start mb-1">
                                                    <h4 className="font-bold text-slate-800 text-[11px] lg:text-sm line-clamp-2 leading-tight">{product.name}</h4>
                                                </div>
                                                <p className="text-emerald-600 font-black text-sm lg:text-base italic">Rp {product.price.toLocaleString('id-ID')}</p>
                                            </div>
                                            <div className="mt-2 lg:mt-3 flex items-center justify-between text-[8px] lg:text-[10px] font-bold text-slate-400">
                                                <span className="truncate max-w-[50px]">{product.category}</span>
                                                <span className={`font-black uppercase tracking-tighter ${product.stock > 10 ? 'text-emerald-400' : product.stock > 0 ? 'text-amber-500' : 'text-slate-400'}`}>
                                                    {product.stock > 10 ? 'Ada' : product.stock > 0 ? 'Limit' : 'Habis'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                    <CustomerBottomNav onOpenSettings={() => setIsSettingsOpen(true)} />
                </div>

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


                {/* Mobile Cart Modal Overlay */}
                {isCartModalOpen && (
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xl z-[60] animate-in fade-in duration-300">
                        <div className="absolute inset-x-0 bottom-0 top-10 bg-white rounded-t-[3rem] shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-20 duration-500">
                            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-white/50 backdrop-blur-md sticky top-0 z-10">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600">
                                        <ShoppingBag size={24} />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-black text-slate-800">Keranjang Belanja</h2>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{cart.length} Menu Terpilih</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsCartModalOpen(false)}
                                    className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-200 transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                {cart.map(item => (
                                    <div key={item.id} className="flex items-center gap-5 bg-slate-50 p-4 rounded-[2rem] border border-slate-100 transition-all active:scale-[0.98]">
                                        <img src={item.img} className="w-20 h-20 rounded-2xl object-cover shadow-md" />
                                        <div className="flex-1">
                                            <h4 className="font-black text-slate-800 mb-1">{item.name}</h4>
                                            <p className="text-emerald-600 font-black text-sm mb-3">Rp {item.price.toLocaleString('id-ID')}</p>
                                            <div className="flex items-center gap-4">
                                                <button onClick={() => updateQty(item.id, -1)} className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm text-slate-500 border border-slate-100">
                                                    <Minus size={14} />
                                                </button>
                                                <span className="text-sm font-black text-slate-800">{item.quantity}</span>
                                                <button onClick={() => addToCart(item)} className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm text-slate-400 border border-slate-100">
                                                    <Plus size={14} />
                                                </button>
                                            </div>
                                        </div>
                                        <button onClick={() => updateQty(item.id, -item.quantity)} className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                ))}

                                {/* Data Pemesan in Mobile Modal */}
                                <div className="bg-emerald-50/50 p-6 rounded-[2rem] border border-emerald-100 space-y-4">
                                    <h3 className="text-xs font-black text-emerald-800 uppercase tracking-widest mb-2">Data Pemesan</h3>
                                    <input type="text" placeholder="Nama Lengkap" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full px-5 py-4 bg-white border border-emerald-100 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10 text-sm font-bold placeholder:text-slate-300" />
                                    <input type="email" placeholder="Email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} className="w-full px-5 py-4 bg-white border border-emerald-100 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10 text-sm font-bold placeholder:text-slate-300" />
                                    <input type="tel" placeholder="WhatsApp" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} className="w-full px-5 py-4 bg-white border border-emerald-100 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10 text-sm font-bold placeholder:text-slate-300" />
                                    <select
                                        value={paymentMethod}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="w-full px-5 py-4 bg-white border border-emerald-100 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10 text-sm font-black text-slate-700 appearance-none bg-[url('https://cdn-icons-png.flaticon.com/512/60/60995.png')] bg-[length:12px] bg-[right_20px_center] bg-no-repeat"
                                    >
                                        <option value="" disabled>Pilih Metode Pembayaran</option>
                                        <option value="COD">COD (Tunai)</option>
                                        <option value="Gopay">Gopay</option>
                                        <option value="Dana">Dana</option>
                                        <option value="Transfer Bank">Transfer Bank</option>
                                    </select>
                                </div>
                            </div>

                            <div className="p-8 bg-slate-50 border-t border-slate-100 p-safe-bottom">
                                <div className="flex justify-between items-center mb-6">
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Pembayaran</p>
                                        <p className="text-2xl font-black text-emerald-600 tracking-tighter">Rp {totalAmount.toLocaleString('id-ID')}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleCheckout}
                                    disabled={isProcessing || cart.length === 0}
                                    className="w-full py-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-lg shadow-xl shadow-emerald-200 active:scale-95 transition-all disabled:bg-slate-200 disabled:shadow-none"
                                >
                                    {isProcessing ? 'Memproses...' : 'Checkout Sekarang'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* Standardized Settings Modal (Customer) */}
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

export default function App() {
    return (
        <Suspense fallback={<div className="h-screen w-screen flex items-center justify-center font-bold text-emerald-600">Loading Favorites...</div>}>
            <FavoritesContent />
        </Suspense>
    );
}