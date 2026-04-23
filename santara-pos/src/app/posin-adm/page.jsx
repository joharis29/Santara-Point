"use client";

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChangeEmailModal, ChangeWhatsappModal, ChangePasswordModal } from '@/components/UserManagementModals';
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
    ChefHat,
    CreditCard,
    UserCircle,
    ShoppingCart,
    ArrowUpDown,
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
    User,
    CheckCircle2,
    Eye,
    EyeOff
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
    address: 'Jl. Ir. H. Djuanda No. 78, Sentul, Kota Bogor, Jawa Barat 16810',
    instagram: '@santarapoint',
    footerText: '© 2024 Santara Point. Berkah setiap saat.',
    companyCategory: 'Retailer',
    companyField: 'Restoran',
    startDate: '',
    accountingPeriod: 'Januari - Desember',
    currency: 'IDR',
    taxCompanyName: '',
    pkpDate: '',
    pkpNumber: '',
    companyType: 'PT',
    companyNpwp: '',
    klu: '',
    nitku: '',
    taxAddress: '',
    authorizedUsers: [
        { contact: 'santarapoint@gmail.com', role: 'Administrator' }
    ],
    isPajakActive: true
};




function AdminPortalContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [products, setProducts] = useState(INITIAL_PRODUCTS);
    const [cart, setCart] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isWaitingOpen, setIsWaitingOpen] = useState(false);
    const [currentTxId, setCurrentTxId] = useState(null);

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

    // --- Function Hoisting (Standard Function Declarations for TDZ Safety) ---

    function handleCloseWaiting() {
        setIsWaitingOpen(false);
        localStorage.removeItem('santaraActiveTxId');
        setCurrentTxId(null);
    }

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
    const [isCartModalOpen, setIsCartModalOpen] = useState(false);
    const [storeSettings, setStoreSettings] = useState(DEFAULT_SETTINGS);

    // --- State Perubahan Data (Inputs) ---
    const [newEmailInput, setNewEmailInput] = useState('');
    const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);
    const [newWhatsappInput, setNewWhatsappInput] = useState('');
    const [isUpdatingWhatsapp, setIsUpdatingWhatsapp] = useState(false);
    const [newPasswordInput, setNewPasswordInput] = useState('');
    const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
    const [isSavingStore, setIsSavingStore] = useState(false);
    const [newUserContact, setNewUserContact] = useState('');
    const [newUserRole, setNewUserRole] = useState('Operator');

    const handleSaveStoreSettings = async () => {
        setIsSavingStore(true);
        try {
            const toSave = {
                id: 1,
                store_name: storeSettings.storeName,
                store_tagline: storeSettings.storeTagline || '',
                whatsapp: storeSettings.whatsapp || '',
                email: storeSettings.email || '',
                instagram: storeSettings.instagram || '',
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
        
        const finalPrice = product.discountPercent > 0 
            ? Math.round(product.price * (1 - (product.discountPercent / 100))) 
            : product.price;
        
        setCart(prev => {
            const exist = prev.find(x => x.id === finalId);
            if (exist) {
                return prev.map(x => x.id === finalId ? { ...x, quantity: x.quantity + 1 } : x);
            }
            return [...prev, { ...product, id: finalId, name: finalName, price: finalPrice, quantity: 1, originalId: product.id }];
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

    async function handleCheckout() {
        if (cart.length === 0) return alert('Keranjang masih kosong!');
        if (!customerName || !queueNumber) return alert('Mohon lengkapi Nama Pemesan dan Nomor Antrian!');
        if (!paymentMethod) return alert('Mohon pilih Metode Pembayaran!');

        const trxId = 'TRX-' + Math.floor(Math.random() * 1000000);
        const newTransaction = {
            id: trxId,
            timestamp: new Date().toISOString(),
            customerName: customerName,
            queueNumber: queueNumber,
            orderType: orderType,
            keterangan: orderNote,
            paymentMethod: paymentMethod,
            source: 'Owner', 
            cashierName: 'Administrator',
            totalAmount: totalAmount,
            pajak: pajakValue,
            status: 'Menunggu',
            items: cart.map(item => ({
                name: item.name,
                price: item.price,
                quantity: item.quantity
            }))
        };

        const dbTransaction = {
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

        try {
            // 1. Save to Supabase (Transactions)
            const { error } = await supabase.from('transactions').insert([dbTransaction]);
            if (error) throw error;

            // 2. Update Stock in Supabase for global consistency
            for (const item of cart) {
                const product = products.find(p => p.id === item.id);
                if (product) {
                    const newStock = Math.max(0, product.stock - item.quantity);
                    await supabase
                        .from('products')
                        .update({ stock: newStock })
                        .eq('id', item.id);
                }
            }

            const existingHistory = JSON.parse(localStorage.getItem('santaraTransactionHistory') || '[]');
            localStorage.setItem('santaraTransactionHistory', JSON.stringify([newTransaction, ...existingHistory]));

            const newUsed = [...usedQueueNumbers, queueNumber.toString()];
            setUsedQueueNumbers(newUsed);
            localStorage.setItem('santaraUsedQueue', JSON.stringify(newUsed));

            await generateReceiptPDF(newTransaction, storeSettings);

            alert(`Transaksi Admin Berhasil!\nMetode: ${paymentMethod}\nNota telah dibuat.`);
            
            setCart([]);
            setCustomerName('');
            setQueueNumber('');
            setOrderNote('');
            setPaymentMethod('');

        } catch (err) {
            console.error("Error processing admin transaction:", err);
            alert("Gagal memproses transaksi: " + err.message);
        }
    }

    React.useEffect(() => {
        const userRole = localStorage.getItem('currentUserRole');
        const userEmail = localStorage.getItem('registeredEmail');
        const isAdmin = userRole === 'Administrator' || (userEmail && userEmail.toLowerCase() === 'santarapoint@gmail.com');

        if (!isAdmin) {
            router.push('/login');
            return;
        }

        const storedQueue = localStorage.getItem('santaraUsedQueue');
        if (storedQueue) {
            try { setUsedQueueNumbers(JSON.parse(storedQueue)); } catch (e) { }
        }

        const fetchProducts = async () => {
            try {
                // 1. Fetch from Supabase
                const { data: dbData, error } = await supabase
                    .from('products')
                    .select('*')
                    .order('id', { ascending: true });

                if (error) throw error;

                // 2. Proactive Sync Logic: If cloud data is missing items from the hardcoded menu, push them
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
                    
                    // Re-fetch to get final state
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
                    // Use Supabase as the source of truth
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
                console.error("Admin POS Fetch/Sync Error:", err);
                const stored = localStorage.getItem('santaraProducts');
                if (stored) setProducts(JSON.parse(stored));
                else setProducts(INITIAL_PRODUCTS);
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
                        instagram: data.instagram,
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
        if (storedSettings) {
            try {
                const parsed = JSON.parse(storedSettings);
                setStoreSettings({ ...DEFAULT_SETTINGS, ...parsed });
            } catch (e) { }
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

        const activeTxId = localStorage.getItem('santaraActiveTxId');
        if (activeTxId) setCurrentTxId(activeTxId);

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
                                    {/* Quantity Overlay */}
                                    {(() => {
                                        const productInCart = cart.filter(item => item.originalId === product.id || item.id === product.id);
                                        const totalQty = productInCart.reduce((sum, item) => sum + item.quantity, 0);
                                        
                                        return (
                                            <div className={`absolute bottom-2 right-2 z-40 flex items-center transition-all duration-300 ${totalQty > 0 ? 'bg-emerald-600 text-white px-1 py-1 rounded-full shadow-lg border-2 border-white gap-1.5' : ''}`}>
                                                {totalQty > 0 ? (
                                                    <>
                                                        <button 
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                const itemToDec = productInCart[0];
                                                                if (itemToDec) updateQty(itemToDec.id, -1);
                                                            }}
                                                            className="w-5 h-5 flex items-center justify-center hover:bg-emerald-700 rounded-full transition-colors"
                                                        >
                                                            <Minus size={10} strokeWidth={4} />
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
                                                                    else addToCart(product);
                                                                }
                                                            }}
                                                            onClick={(e) => e.stopPropagation()}
                                                            className="text-[10px] font-black min-w-[20px] w-6 text-center bg-transparent outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                        />
                                                        <button 
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                addToCart(product);
                                                            }}
                                                            className="w-5 h-5 flex items-center justify-center hover:bg-emerald-700 rounded-full transition-colors"
                                                        >
                                                            <Plus size={10} strokeWidth={4} />
                                                        </button>
                                                    </>
                                                ) : (
                                                    <button 
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            addToCart(product);
                                                        }}
                                                        className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white hover:scale-110 active:scale-95 transition-all"
                                                    >
                                                        <Plus size={16} strokeWidth={4} />
                                                    </button>
                                                )}
                                            </div>
                                        );
                                    })()}
                                </div>
                                <div className="px-1 lg:px-2 flex-1 flex flex-col justify-between">
                                    <div>
                                        <h4 className="font-bold text-slate-800 text-[11px] lg:text-sm line-clamp-2 leading-tight mb-1">{product.name}</h4>
                                        <div className="flex flex-col">
                                            {product.discountPercent > 0 && (
                                                <span className="text-[9px] lg:text-[10px] font-bold line-through text-slate-400">
                                                    Rp {product.price.toLocaleString('id-ID')}
                                                </span>
                                            )}
                                            <p className="text-emerald-700 font-black text-xs lg:text-base italic leading-none">
                                                Rp {(product.discountPercent > 0 
                                                    ? Math.round(product.price * (1 - (product.discountPercent / 100))) 
                                                    : product.price).toLocaleString('id-ID')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            {/* 3. Right Sidebar: Keranjang & Checkout (Desktop) */}
            <aside className="hidden lg:flex w-[400px] bg-white border-l border-slate-200 flex-col shadow-2xl z-30">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
                    <div className="flex items-center gap-2">
                        <ShoppingBag size={20} className="text-emerald-600" />
                        <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest text-[11px] lg:text-sm">Ringkasan Pesanan</h2>
                    </div>
                    <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black px-3 py-1 rounded-full border border-emerald-100">
                        {cart.length} Item
                    </span>
                    <button 
                        onClick={() => setCart([])}
                        className="text-[10px] font-bold text-red-500 hover:underline"
                    >
                        Bersihkan
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
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

                {/* Payment Summary */}
                <div className="p-6 bg-slate-50 border-t border-slate-200">
                    <div className="space-y-3 mb-5">
                        <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
                            <span>Subtotal</span>
                            <span className="text-slate-800">Rp {subtotal.toLocaleString('id-ID')}</span>
                        </div>
                        {storeSettings.isPajakActive && (
                            <div className="flex items-center justify-between p-3 rounded-xl border bg-emerald-600 border-emerald-600 text-white shadow-lg">
                                <div className="flex items-center gap-3">
                                    <Calculator size={14} />
                                    <span className="text-[10px] font-black uppercase">Pajak Daerah (10%)</span>
                                </div>
                                <span className="text-xs font-black">Rp {pajakValue.toLocaleString('id-ID')}</span>
                            </div>
                        )}
                    </div>
                    <div className="flex justify-between items-center mb-5">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Tagihan</span>
                        <span className="text-2xl font-black text-emerald-700 tracking-tight">Rp {totalAmount.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex flex-col gap-2">
                        <select
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="w-full text-xs px-3 py-3 bg-white border-2 border-emerald-600 rounded-xl outline-none font-black text-emerald-700 cursor-pointer uppercase text-center appearance-none"
                        >
                            <option value="" disabled>Pilih Pembayaran</option>
                            <option value="Tunai">Tunai</option>
                            <option value="Transfer">Transfer</option>
                        </select>
                        <button
                            onClick={handleCheckout}
                            disabled={cart.length === 0}
                            className="w-full py-3 rounded-xl bg-emerald-600 text-white font-black text-xs uppercase tracking-widest hover:bg-emerald-700 shadow-lg active:scale-95 disabled:opacity-50"
                        >
                            Proses Pesanan
                        </button>
                    </div>
                </div>
            </aside>

            {/* Floating Cart Button (Mobile) */}
            <div className="lg:hidden fixed bottom-6 right-6 z-40">
                <button
                    onClick={() => setIsCartModalOpen(true)}
                    className="relative bg-emerald-600 text-white p-4 rounded-full shadow-2xl active:scale-95 transition-all outline-none"
                >
                    <ShoppingBag size={24} />
                    {cart.length > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-black w-6 h-6 flex items-center justify-center rounded-full border-2 border-white animate-bounce">
                            {cart.length}
                        </span>
                    )}
                </button>
            </div>

            {/* Cart Modal Mobile (Admin) */}
            {isCartModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] lg:hidden">
                    <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[2.5rem] h-[90vh] flex flex-col overflow-hidden shadow-2xl">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                            <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">Ringkasan Pesanan</h2>
                            <button onClick={() => setIsCartModalOpen(false)} className="p-2 bg-slate-100 rounded-full text-slate-400">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6">
                            {cart.length === 0 ? (
                                <div className="h-40 flex flex-col items-center justify-center text-slate-300 italic">
                                    <ShoppingCart size={40} className="opacity-20" />
                                    <p className="text-xs">Keranjang kosong</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {cart.map(item => (
                                        <div key={item.id} className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border">
                                            <div className="flex-1">
                                                <h5 className="font-bold text-sm">{item.name}</h5>
                                                <p className="text-xs font-black text-emerald-600">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center gap-3 bg-white p-1 rounded-lg border">
                                                    <button onClick={() => updateQty(item.id, -1)} className="w-7 h-7 flex items-center justify-center bg-slate-50 rounded"><Minus size={12}/></button>
                                                    <span className="font-black text-sm">{item.quantity}</span>
                                                    <button onClick={() => addToCart(item)} className="w-7 h-7 flex items-center justify-center bg-slate-50 rounded"><Plus size={12}/></button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="mt-8 space-y-4">
                                <input type="text" placeholder="Nama Pemesan" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full px-4 py-4 bg-slate-50 border rounded-2xl font-bold" />
                                <select value={queueNumber} onChange={(e) => setQueueNumber(e.target.value)} className="w-full px-4 py-4 bg-slate-50 border rounded-2xl font-bold">
                                    <option value="" disabled>No Antrian</option>
                                    {Array.from({ length: 100 }, (_, i) => i + 1).map(num => <option key={num} value={num}>Antrian {num}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="p-6 bg-slate-50 border-t border-slate-100">
                            <div className="flex justify-between items-center mb-6">
                                <span className="font-black text-slate-400 uppercase text-[10px]">Total Bayar</span>
                                <span className="text-2xl font-black text-emerald-700">Rp {totalAmount.toLocaleString('id-ID')}</span>
                            </div>
                            <button onClick={handleCheckout} className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-emerald-100">Proses Pembayaran</button>
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
                isAdmin={true}
                activeTab={activeSettingsTab}
                setActiveTab={setActiveSettingsTab}
                userProfile={userProfile}
                setUserProfile={setUserProfile}
                handleSaveProfile={handleSaveProfile}
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
        </div>
    );
}

export default function AdminPOSPage() {
    return (
        <Suspense fallback={<div className="h-screen w-screen flex items-center justify-center bg-slate-50"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div></div>}>
            <AdminPortalContent />
        </Suspense>
    );
}
