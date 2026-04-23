"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChangeEmailModal, ChangeWhatsappModal, ChangePasswordModal } from '@/components/UserManagementModals';

import { generateReceiptPDF } from '@/lib/receiptPdf';
import {
    ShoppingBag,
    ShieldCheck,
    LogOut,
    Home,
    Clock,
    Heart,
    CheckCircle2,
    XCircle,
    Calendar,
    ChevronRight,
    ShoppingBag as ShoppingBagIcon,
    Receipt,
    ArrowLeft,
    Settings,
    Eye,
    EyeOff
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import WaitingOverlay from '@/app/posin-cus/WaitingOverlay';
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

export default function CustomerHistory() {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [customerName, setCustomerName] = useState('Sobat Santara');
    const [history, setHistory] = useState([]);
    const [cart, setCart] = useState([]);
    const [searchTerm, setSearchTerm] = useState(''); // Needed for CustomerHeader

    // --- State Pengaturan ---
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

    // --- State Perubahan Data (Inputs) ---
    const [newEmailInput, setNewEmailInput] = useState('');
    const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);
    const [newWhatsappInput, setNewWhatsappInput] = useState('');
    const [isUpdatingWhatsapp, setIsUpdatingWhatsapp] = useState(false);
    const [newPasswordInput, setNewPasswordInput] = useState('');
    const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
    const [storeSettings, setStoreSettings] = useState(DEFAULT_SETTINGS);

    // --- State Pelacakan Pesanan ---
    const [isWaitingOpen, setIsWaitingOpen] = useState(false);
    const [currentTrackingId, setCurrentTrackingId] = useState(null);
    const [trackingName, setTrackingName] = useState('');
    const [trackingAmount, setTrackingAmount] = useState(0);

    useEffect(() => {
        // Security Check
        const registeredEmail = localStorage.getItem('registeredEmail');
        if (!registeredEmail) {
            router.push('/login');
            return;
        }

        const fetchUserData = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const meta = user.user_metadata || {};
                const fName = meta.first_name || '';
                const lName = meta.last_name || '';
                const fullName = `${fName} ${lName}`.trim() || 'Sobat Santara';

                setCustomerName(fullName);
                setIsLoggedIn(true);

                setUserProfile({
                    firstName: fName,
                    lastName: lName,
                    email: user.email || '',
                    whatsapp: meta.whatsapp || '',
                    password: '••••••••',
                    addresses: meta.addresses || []
                });
                
                loadHistory(fullName);
            } else {
                const storedName = localStorage.getItem('customerName');
                if (storedName) {
                    setCustomerName(storedName);
                    setIsLoggedIn(true);
                    loadHistory(storedName);
                }
            }
        };

        const loadHistory = async (name) => {
            try {
                const { data, error } = await supabase
                    .from('transactions')
                    .select('*')
                    .eq('customer_name', name)
                    .order('timestamp', { ascending: false });

                if (error) throw error;

                if (data && data.length > 0) {
                    const mapped = data.map(trx => ({
                        id: trx.id,
                        timestamp: trx.timestamp,
                        customerName: trx.customer_name,
                        queueNumber: trx.queue_number,
                        orderType: trx.order_type,
                        keterangan: trx.keterangan,
                        paymentMethod: trx.payment_method,
                        source: trx.source,
                        cashierName: trx.cashier_name,
                        totalAmount: trx.total_amount,
                        pajak: trx.pajak,
                        status: trx.status,
                        items: trx.items
                    }));
                    setHistory(mapped);
                } else {
                    const rawHistory = JSON.parse(localStorage.getItem('santaraTransactionHistory') || '[]');
                    const userHistory = rawHistory.filter(trx => 
                        trx.customerName === name && 
                        (trx.status === 'Selesai' || trx.status === 'Ditolak')
                    );
                    setHistory(userHistory);
                }
            } catch (err) {
                console.error("Error loading Supabase history:", err);
                const rawHistory = JSON.parse(localStorage.getItem('santaraTransactionHistory') || '[]');
                setHistory(rawHistory.filter(trx => trx.customerName === name && ['Selesai', 'Ditolak'].includes(trx.status)));
            }
        };

        const storedSettings = localStorage.getItem('santaraStoreSettings');
        if (storedSettings) {
            try {
                const parsed = JSON.parse(storedSettings);
                setStoreSettings({ ...DEFAULT_SETTINGS, ...parsed });
            } catch (e) {
                console.error("Error parsing settings", e);
            }
        }

        // Load cart from localStorage
        const storedCart = localStorage.getItem('santaraCart');
        if (storedCart) {
            try {
                setCart(JSON.parse(storedCart));
            } catch (e) {
                console.error("Error parsing cart", e);
            }
        }

        fetchUserData();
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

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('santaraCart', JSON.stringify(cart));
    }, [cart]);

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

    return (
        <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden relative">
            {/* Standardized Sidebar (Desktop) */}
            <aside className="hidden lg:flex w-24 bg-white border-r border-slate-100 flex-col items-center py-10 gap-12">
                <button onClick={() => router.push('/')} className="hover:scale-105 transition-transform" title="Ke Beranda">
                    <img src="/santara-logo.png" alt="Santara Logo" className="w-10 h-10 object-contain" />
                </button>
                <nav className="flex-1 flex flex-col gap-8">
                    <button onClick={() => router.push('/posin-cus')} className="p-3 text-slate-300 hover:text-emerald-600 transition-colors" title="Buka Menu Utama">
                        <ShoppingBag size={24} />
                    </button>
                    <button onClick={() => router.push('/favorites')} className="p-3 text-slate-300 hover:text-red-500 transition-colors" title="Menu Favorit">
                        <Heart size={24} />
                    </button>
                    <button className="p-3 text-emerald-600 bg-emerald-50 rounded-2xl shadow-md" title="Riwayat Pesanan">
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

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Standardized Header */}
                <CustomerHeader 
                    title="Santara Point"
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    cartCount={cart.length}
                    onSettingsClick={() => setIsSettingsOpen(true)}
                />

                <div className="flex-1 overflow-y-auto px-6 md:px-10 py-10 bg-slate-50">
                    <div className="max-w-4xl mx-auto space-y-6">
                        {history.length === 0 ? (
                            <div className="bg-white rounded-3xl p-10 flex flex-col items-center justify-center text-center shadow-sm border border-slate-100 mt-10">
                                <ShoppingBagIcon size={64} className="text-slate-200 mb-6" />
                                <h3 className="text-xl font-bold text-slate-800 mb-2">Belum Ada Riwayat Lunas</h3>
                                <p className="text-slate-500">Anda tidak memiliki daftar pesanan dengan status 'Selesai' atau 'Ditolak'.</p>
                                <button 
                                    onClick={() => router.push('/posin-cus')}
                                    className="mt-6 px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition"
                                >
                                    Belanja Sekarang
                                </button>
                            </div>
                        ) : (
                            history.map(trx => (
                                <div key={trx.id} className="bg-white rounded-[2rem] p-6 lg:p-8 shadow-sm border border-slate-100 flex flex-col lg:flex-row gap-8 hover:shadow-md transition">
                                    {/* Left Status Area */}
                                    <div className="w-full lg:w-48 flex flex-col items-start gap-4">
                                        <div className={`px-4 py-2 rounded-full font-black text-xs uppercase tracking-widest flex items-center gap-2 ${
                                            trx.status === 'Selesai' 
                                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' 
                                            : trx.status === 'Ditolak'
                                            ? 'bg-red-50 text-red-500 border border-red-200'
                                            : 'bg-amber-50 text-amber-600 border border-amber-200 animate-pulse'
                                        }`}>
                                            {trx.status === 'Selesai' ? <CheckCircle2 size={16} /> : trx.status === 'Ditolak' ? <XCircle size={16} /> : <Clock size={16} />}
                                            {trx.status === 'Selesai' ? 'Selesai' : trx.status === 'Ditolak' ? 'Dibatalkan' : 'Diproses'}
                                        </div>
                                        <div className="text-xs font-bold text-slate-400 flex items-center gap-2 uppercase">
                                            <Calendar size={14} />
                                            {new Date(trx.timestamp).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                            ID: {trx.id}
                                        </div>
                                    </div>

                                    {/* Inner Items Area */}
                                    <div className="flex-1 flex flex-col gap-3">
                                        <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wide border-b border-slate-100 pb-2 mb-2">Daftar Menu</h4>
                                        <div className="space-y-2">
                                            {trx.items.map((item, idx) => (
                                                <div key={idx} className="flex justify-between items-center text-sm">
                                                    <div className="flex items-center gap-3">
                                                        <span className="font-black text-slate-400">{item.quantity}x</span>
                                                        <span className="font-bold text-slate-700">{item.name}</span>
                                                    </div>
                                                    <span className="font-black text-emerald-600">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Right Payment Area */}
                                    <div className="w-full lg:w-64 bg-slate-50 rounded-2xl p-5 border border-slate-100 flex flex-col justify-between">
                                        <div>
                                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Metode Bayar</p>
                                            <p className="font-black text-slate-700 text-base">{trx.paymentMethod}</p>
                                        </div>
                                        <div className="mt-4 pt-4 border-t border-slate-200">
                                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Total Dibayar</p>
                                            <p className="font-black text-emerald-600 text-2xl tracking-tighter">Rp {trx.totalAmount?.toLocaleString('id-ID') || 0}</p>
                                            
                                            {trx.status === 'Selesai' ? (
                                                <button
                                                    onClick={async () => {
                                                        const settings = JSON.parse(localStorage.getItem('santaraStoreSettings') || '{}');
                                                        await generateReceiptPDF(trx, settings);
                                                    }}
                                                    className="mt-4 w-full py-2.5 bg-white border-2 border-emerald-500 text-emerald-600 rounded-xl font-bold hover:bg-emerald-50 transition-all flex items-center justify-center gap-2 text-xs"
                                                >
                                                    <Receipt size={14} /> Cetak Struk (PDF)
                                                </button>
                                            ) : trx.status === 'Ditolak' ? (
                                                <div className="mt-4 text-center p-2 bg-red-50 rounded-xl text-[10px] font-bold text-red-400 uppercase tracking-widest">Pesanan Gagal</div>
                                            ) : (
                                                <button
                                                    onClick={() => {
                                                        setCurrentTrackingId(trx.id);
                                                        setTrackingName(trx.customerName);
                                                        setTrackingAmount(trx.totalAmount);
                                                        setIsWaitingOpen(true);
                                                    }}
                                                    className="mt-4 w-full py-2.5 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 text-xs shadow-lg shadow-emerald-100"
                                                >
                                                    <Clock size={14} /> Lacak Pesanan
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
                {/* Standardized Bottom Navigation */}
                <CustomerBottomNav onOpenSettings={() => setIsSettingsOpen(true)} />
            </main>

            {/* Order Tracking Modal for Active Orders */}
            <WaitingOverlay 
                isOpen={isWaitingOpen}
                onClose={() => setIsWaitingOpen(false)}
                transactionId={currentTrackingId}
                customerName={trackingName}
                totalAmount={trackingAmount}
                isGlobal={true}
            />

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
                storeSettings={storeSettings}
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




