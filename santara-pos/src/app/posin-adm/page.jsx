"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
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
    LayoutDashboard,
    ClipboardList,
    Settings,
    Store,
    ChefHat,
    CreditCard,
    UserCircle,
    X
} from 'lucide-react';

/**
 * SANTARA POINT - POS INPUT (OWNER ROLE)
 * Fokus: Manajemen Stok Presisi, Kalkulator Zakat, & Kontrol Operasional.
 */

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

const categories = ['Semua', 'Makanan', 'Minuman', 'Snack', 'Frozen Food'];

export default function App() {
    const router = useRouter();
    const [products, setProducts] = useState(INITIAL_PRODUCTS);
    const [cart, setCart] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [zakatEnabled, setZakatEnabled] = useState(true);
    const [activeCategory, setActiveCategory] = useState('Semua');
    const [customerName, setCustomerName] = useState('');
    const [queueNumber, setQueueNumber] = useState('');
    const [usedQueueNumbers, setUsedQueueNumbers] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState('');
    const [toppingModalProduct, setToppingModalProduct] = useState(null);

    React.useEffect(() => {
        const stored = localStorage.getItem('santaraUsedQueue');
        if (stored) {
            setUsedQueueNumbers(JSON.parse(stored));
        }
        
        const storedProducts = localStorage.getItem('santaraProducts');
        if (storedProducts) {
            setProducts(JSON.parse(storedProducts));
        } else {
            localStorage.setItem('santaraProducts', JSON.stringify(INITIAL_PRODUCTS));
        }
    }, [INITIAL_PRODUCTS]);

    // --- Logika Perhitungan ---
    const menuTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const subtotal = zakatEnabled ? menuTotal / 1.025 : menuTotal;
    const zakatValue = zakatEnabled ? menuTotal - (menuTotal / 1.025) : 0;
    const totalAmount = menuTotal;

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = activeCategory === 'Semua' || p.category === activeCategory;
        return matchesSearch && matchesCategory;
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
            paymentMethod,
            source: 'Owner',
            cashierName: 'Admin',
            totalAmount,
            zakat: zakatValue,
            status: 'Menunggu',
            items: cart.map(({ name, quantity, price }) => ({ name, quantity, price }))
        };
        const existingHistory = JSON.parse(localStorage.getItem('santaraTransactionHistory') || '[]');
        localStorage.setItem('santaraTransactionHistory', JSON.stringify([newTransaction, ...existingHistory]));

        alert(`Transaksi ${paymentMethod} Berhasil!\nNama: ${customerName}\nAntrian: ${queueNumber}\nTotal: Rp ${totalAmount.toLocaleString('en-US')}\nNota terkirim ke WhatsApp Owner.`);
        // Reset state setelah simulasi
        setCart([]);
        setCustomerName('');
        setQueueNumber('');
        setPaymentMethod('');
    };

    return (
        <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">

            {/* 1. Sidebar Navigasi (Eksklusif Owner) */}
            <aside className="w-20 lg:w-64 bg-emerald-900 text-white flex flex-col transition-all duration-300">
                <div className="p-6 flex items-center gap-3 border-b border-emerald-800">
                    <button onClick={() => router.push('/homepage')} className="bg-white p-1.5 rounded-lg flex items-center justify-center hover:scale-105 transition-transform cursor-pointer" title="Ke Beranda">
                        <img src="/santara-logo.png" alt="Santara" className="w-6 h-6 object-contain" />
                    </button>
                    <span className="hidden lg:block font-black tracking-tighter text-xl italic uppercase">SANTARA OPS</span>
                </div>
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {[
                        { icon: <LayoutDashboard size={20} />, label: "Dashboard", active: false },
                        { icon: <ShoppingBag size={20} />, label: "POS Kasir", active: true },
                        { icon: <ChefHat size={20} />, label: "Daftar Antrean", active: false, action: () => router.push('/waiting-list') },
                        { icon: <ClipboardList size={20} />, label: "Manajemen Stok", active: false, action: () => router.push('/manajemen-stok') },
                        { icon: <TrendingUp size={20} />, label: "Laporan Keuangan", active: false, action: () => router.push('/history?role=admin') },
                        { icon: <Settings size={20} />, label: "Pengaturan Toko", active: false },
                    ].map((item, i) => (
                        <button key={i} onClick={item.action} className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all ${item.active ? 'bg-emerald-600 shadow-lg shadow-emerald-950/20 text-white' : 'hover:bg-emerald-800 text-emerald-300 hover:text-white'}`}>
                            {item.icon}
                            <span className="hidden lg:block font-bold text-sm">{item.label}</span>
                        </button>
                    ))}
                </nav>
                <div className="p-4 border-t border-emerald-800">
                    <button onClick={() => window.location.href = '/login'} className="w-full flex items-center gap-4 p-3 rounded-xl text-red-300 hover:bg-red-500/10 hover:text-red-400 transition-all">
                        <LogOut size={20} />
                        <span className="hidden lg:block font-bold text-sm">Keluar</span>
                    </button>
                </div>
            </aside>

            {/* 2. Area Utama Produk */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Header Dashboard */}
                <header className="bg-white border-b border-slate-200 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Terminal Kasir</h2>
                            <div className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded flex items-center gap-1 text-[10px] font-black uppercase border border-amber-200">
                                <ShieldCheck size={12} /> Syariah Verified
                            </div>
                        </div>
                        <p className="text-slate-400 text-xs font-medium">Selamat Bekerja, <span className="text-emerald-700 font-bold">Owner Santara</span></p>
                    </div>

                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Cari menu atau kategori..."
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border-none rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </header>

                {/* Kategori Makanan - Filter */}
                <div className="px-6 lg:px-10 mt-6 overflow-x-auto">
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

                {/* Grid Produk */}
                <section className="flex-1 overflow-y-auto p-6 lg:p-10">
                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
                        {filteredProducts.map(product => (
                            <div
                                key={product.id}
                                onClick={() => addToCart(product)}
                                className={`bg-white p-3 rounded-[2rem] shadow-sm hover:shadow-xl transition-all border border-transparent hover:border-emerald-500 cursor-pointer group flex flex-col ${product.stock <= 0 ? 'opacity-50 grayscale' : ''}`}
                            >
                                <div className="h-36 rounded-[1.5rem] overflow-hidden mb-4 relative">
                                    <img src={product.img} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                                    <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition"></div>
                                    {product.isNew && (
                                        <div className="absolute top-2 right-2 bg-red-500 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-md">
                                            NEW
                                        </div>
                                    )}
                                </div>
                                <div className="px-2 flex-1 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className="font-bold text-slate-800 text-sm line-clamp-2">{product.name}</h4>
                                        </div>
                                        <p className="text-emerald-600 font-black text-base italic">Rp {product.price.toLocaleString('en-US')}</p>
                                    </div>
                                    <div className="mt-3 flex items-center justify-between text-[10px] font-bold text-slate-400">
                                        <span>{product.category}</span>
                                        <span className={`flex items-center gap-1 ${product.stock < 10 ? 'text-red-500' : ''}`}>
                                            Stok: {product.stock}
                                            {product.stock < 10 && product.stock > 0 && <AlertCircle size={10} className="animate-pulse" />}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            {/* 3. Panel Ringkasan Transaksi (Sidebar Kanan) */}
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
                                <div key={item.id} className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100 group">
                                    <img src={item.img} className="w-12 h-12 rounded-xl object-cover shadow-sm" />
                                    <div className="flex-1">
                                        <h5 className="font-black text-xs text-slate-800 line-clamp-1">{item.name}</h5>
                                        <p className="text-[10px] text-emerald-600 font-bold mt-0.5">Rp {item.price.toLocaleString('en-US')}</p>
                                    </div>
                                    <div className="flex flex-col items-end gap-1.5">
                                        <div className="flex items-center gap-1.5 bg-white p-1 rounded-lg border border-slate-200">
                                            <button onClick={() => updateQty(item.id, -1)} className="p-0.5 hover:bg-emerald-50 rounded-md text-emerald-600"><Minus size={12} /></button>
                                            <span className="text-xs font-black w-3 text-center">{item.quantity}</span>
                                            <button onClick={() => addToCart(item)} className="p-0.5 hover:bg-emerald-50 rounded-md text-emerald-600"><Plus size={12} /></button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Customer Details Form */}
                    <div className="mt-5 space-y-2 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <h3 className="text-[10px] font-black text-slate-800 uppercase mb-1">Data Pemesan</h3>
                        <input type="text" placeholder="Nama Pemesan" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-slate-700" />
                        <select
                            value={queueNumber}
                            onChange={(e) => setQueueNumber(e.target.value)}
                            className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-slate-700 cursor-pointer"
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
                </div>

                {/* Bagian Pembayaran & Zakat */}
                <div className="p-5 lg:p-6 bg-slate-900 border-t border-slate-800 text-white shadow-[0_-10px_40px_rgba(0,0,0,0.15)] relative z-20">
                    <div className="space-y-3 mb-5">
                        <div className="flex justify-between text-slate-400 font-bold text-xs tracking-widest uppercase mb-2">
                            <span>Subtotal</span>
                            <span>Rp {subtotal.toLocaleString('en-US')}</span>
                        </div>

                        {/* KALKULATOR ZAKAT OTOMATIS */}
                        <div className={`flex items-center justify-between p-3 rounded-xl transition-all border ${zakatEnabled ? 'bg-emerald-600/20 border-emerald-500' : 'bg-slate-800 border-slate-700'}`}>
                            <div className="flex items-center gap-3">
                                <div className={`p-1.5 rounded-lg ${zakatEnabled ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-400'}`}>
                                    <Calculator size={14} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-wider leading-none mb-0.5">Zakat (2.5%)</p>
                                    <button
                                        onClick={() => setZakatEnabled(!zakatEnabled)}
                                        className="text-[9px] font-bold text-emerald-400 underline decoration-dotted"
                                    >
                                        {zakatEnabled ? 'Nonaktifkan' : 'Aktifkan'}
                                    </button>
                                </div>
                            </div>
                            <span className={`text-xs font-black ${zakatEnabled ? 'text-emerald-400' : 'text-slate-500'}`}>
                                Rp {zakatValue.toLocaleString('en-US')}
                            </span>
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
        </div>
    );
}