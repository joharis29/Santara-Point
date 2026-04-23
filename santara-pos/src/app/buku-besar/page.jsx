"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    LayoutDashboard,
    ShoppingBag,
    ChefHat,
    Package,
    TrendingUp,
    Settings,
    LogOut,
    Search,
    BookOpen,
    ListTree,
    Plus,
    X,
    Filter,
    Edit3,
    Trash2,
    CheckCircle2,
    AlertCircle,
    ArrowLeft,
    History,
    Tag,
    Landmark,
    FileText,
    Building2,
    ChevronRight,
    ChevronDown,
    MoreVertical,
    Store,
    Menu,
    Eye,
    EyeOff
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import AdminHeader from '@/components/AdminHeader';
import AdminSidebar from '@/components/AdminSidebar';
import SettingsModal from '@/components/SettingsModal';

const INITIAL_COA = [
    { code: '1-1001', name: 'Kas Utama (Toko)', type: 'Aktiva', subType: 'Kas & Bank', balance: 0 },
    { code: '1-1002', name: 'Bank BCA', type: 'Aktiva', subType: 'Kas & Bank', balance: 0 },
    { code: '1-1003', name: 'Bank Mandiri', type: 'Aktiva', subType: 'Kas & Bank', balance: 0 },
    { code: '1-1101', name: 'Piutang Usaha', type: 'Aktiva', subType: 'Piutang', balance: 0 },
    { code: '1-1201', name: 'Persediaan Barang Jadi', type: 'Aktiva', subType: 'Persediaan', balance: 0 },
    { code: '1-1202', name: 'Persediaan Bahan Baku', type: 'Aktiva', subType: 'Persediaan', balance: 0 },
    { code: '2-1001', name: 'Hutang Usaha', type: 'Kewajiban', subType: 'Hutang Lancar', balance: 0 },
    { code: '3-1001', name: 'Modal Pemilik', type: 'Modal', subType: 'Ekuitas', balance: 0 },
    { code: '4-1001', name: 'Pendapatan Penjualan', type: 'Pendapatan', subType: 'Operasional', balance: 0 },
    { code: '5-1001', name: 'Beban Gaji Karyawan', type: 'Beban', subType: 'Operasional', balance: 0 },
    { code: '5-1002', name: 'Beban Sewa Tempat', type: 'Beban', subType: 'Operasional', balance: 0 },
    { code: '5-1003', name: 'Beban Listrik & Air', type: 'Beban', subType: 'Operasional', balance: 0 },
    { code: '5-1004', name: 'Beban Bahan Baku', type: 'Beban', subType: 'HPP', balance: 0 }
];

const ACCOUNT_TYPES = ['Aktiva', 'Kewajiban', 'Modal', 'Pendapatan', 'Beban'];

export default function BukuBesarPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('coa'); // coa, ledger
    const [coa, setCoa] = useState(INITIAL_COA);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newAccount, setNewAccount] = useState({ code: '', name: '', type: 'Aktiva', subType: '', balance: '' });

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

    useEffect(() => {
        // Security Check
        const userRole = localStorage.getItem('currentUserRole');
        const userEmail = localStorage.getItem('registeredEmail');
        const isAdmin = userRole === 'Administrator' || (userEmail && userEmail.toLowerCase() === 'santarapoint@gmail.com');

        if (!isAdmin) {
            router.push('/login');
            return;
        }
        const storedCoa = localStorage.getItem('santaraCoA');
        if (storedCoa) {
            setCoa(JSON.parse(storedCoa));
        } else {
            localStorage.setItem('santaraCoA', JSON.stringify(INITIAL_COA));
        }

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

    const saveCoa = (data) => {
        setCoa(data);
        localStorage.setItem('santaraCoA', JSON.stringify(data));
    };

    const handleAddAccount = (e) => {
        e.preventDefault();
        if (coa.some(a => a.code === newAccount.code)) return alert('Kode akun sudah digunakan!');
        
        const accountToAdd = {
            ...newAccount,
            balance: parseFloat(newAccount.balance) || 0
        };
        
        saveCoa([...coa, accountToAdd].sort((a, b) => a.code.localeCompare(b.code)));
        setIsAddModalOpen(false);
        setNewAccount({ code: '', name: '', type: 'Aktiva', subType: '', balance: '' });
    };

    const handleDeleteAccount = (code) => {
        if (window.confirm('Hapus akun perkiraan ini?')) {
            saveCoa(coa.filter(a => a.code !== code));
        }
    };

    const filteredCoa = coa.filter(a => 
        (a.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
        (a.code || '').includes(searchTerm)
    );

    const getGroupedCoa = () => {
        const groups = {};
        ACCOUNT_TYPES.forEach(type => {
            groups[type] = filteredCoa.filter(a => a.type === type);
        });
        return groups;
    };

    const groupedCoa = getGroupedCoa();

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
                    title="Buku Besar & CoA"
                    subtitle="General Ledger & Chart of Accounts"
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    onMenuClick={() => setIsSidebarOpen(true)}
                />

                <div className="bg-white border-b border-slate-100 flex overflow-x-auto scrollbar-hide z-10">
                    {[
                        { id: 'coa', label: 'Akun Perkiraan (CoA)', icon: <ListTree size={16} /> },
                        { id: 'ledger', label: 'Buku Pembantu Ledger', icon: <FileText size={16} /> },
                    ].map(tab => (
                        <button 
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-8 py-4 text-xs font-black uppercase tracking-widest transition-all border-b-2 whitespace-nowrap flex items-center gap-2 ${activeTab === tab.id ? 'border-emerald-600 text-emerald-600 bg-emerald-50/30' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                        >
                            {tab.icon} {tab.label}
                        </button>
                    ))}
                </div>

                <div className="flex-1 overflow-y-auto p-6 lg:p-10 relative">
                    <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#10b981 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
                    
                    {activeTab === 'coa' && (
                        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10">
                            {Object.entries(groupedCoa).map(([type, accounts]) => (
                                <div key={type} className="space-y-4">
                                    <div className="flex items-center gap-4 px-2">
                                        <h3 className="text-sm font-black text-slate-500 uppercase tracking-[0.2em]">{type}</h3>
                                        <div className="flex-1 h-px bg-slate-200"></div>
                                        <span className="text-[10px] font-bold text-slate-300 uppercase">{accounts.length} Akun</span>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                        {accounts.map(acc => (
                                            <div key={acc.code} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group relative overflow-hidden">
                                                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                                     <button onClick={() => handleDeleteAccount(acc.code)} className="p-1.5 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={14} /></button>
                                                </div>
                                                
                                                <div className="flex flex-col h-full">
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 text-white shadow-lg ${
                                                        type === 'Aktiva' ? 'bg-blue-500 shadow-blue-100' : 
                                                        type === 'Kewajiban' ? 'bg-amber-500 shadow-amber-100' : 
                                                        type === 'Modal' ? 'bg-purple-500 shadow-purple-100' : 
                                                        type === 'Pendapatan' ? 'bg-emerald-500 shadow-emerald-100' : 
                                                        'bg-red-500 shadow-red-100'
                                                    }`}>
                                                        <span className="text-xs font-black">{acc.code.charAt(0)}</span>
                                                    </div>
                                                    
                                                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">{acc.code}</p>
                                                    <h4 className="font-bold text-slate-800 text-sm mb-4 line-clamp-1">{acc.name}</h4>
                                                    
                                                    <div className="mt-auto pt-4 border-t border-slate-50 flex justify-between items-center">
                                                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{acc.subType || 'General'}</span>
                                                        <span className="font-black text-slate-700 text-xs">Rp {acc.balance.toLocaleString()}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {accounts.length === 0 && (
                                            <div className="col-span-full py-10 text-center bg-slate-50 border border-dashed border-slate-200 rounded-[2rem] text-slate-300 italic text-[10px] uppercase font-bold tracking-widest">
                                                Belum ada akun kategori {type}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'ledger' && (
                        <div className="flex flex-col items-center justify-center py-20 animate-in fade-in zoom-in-95 duration-500 bg-white rounded-[3rem] border border-slate-100 text-center relative z-10 overflow-hidden">
                             <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500"></div>
                             <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mb-6">
                                <FileText size={48} className="opacity-40" />
                             </div>
                             <h3 className="text-2xl font-black text-slate-800 tracking-tight">Buku Pembantu Ledger</h3>
                             <p className="max-w-md text-slate-400 text-sm mt-3 px-6">Fitur ini digunakan untuk melihat mutasi transaksi per akun secara mendalam. Akan tersedia segera pada update modul finansial berikutnya.</p>
                             <button onClick={() => setActiveTab('coa')} className="mt-10 px-8 py-3 bg-emerald-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-100 active:scale-95">Kembali ke CoA</button>
                        </div>
                    )}
                </div>

                {/* Mobile Bottom Navigation (Admin Only) */}
                <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-6 py-4 flex justify-around items-center z-50">
                    <button onClick={() => router.push('/posin-adm')} className="flex flex-col items-center gap-1 text-slate-400">
                        <LayoutDashboard size={20} />
                        <span className="text-[10px] font-bold uppercase tracking-tight">Dash</span>
                    </button>
                    <button className="flex flex-col items-center gap-1 text-emerald-600">
                        <BookOpen size={20} />
                        <span className="text-[10px] font-bold uppercase tracking-tight">CoA</span>
                    </button>
                    <button onClick={() => router.push('/kas-bank')} className="flex flex-col items-center gap-1 text-slate-400">
                        <Landmark size={20} />
                        <span className="text-[10px] font-bold uppercase tracking-tight">Kas</span>
                    </button>
                    <button onClick={() => router.push('/penjualan')} className="flex flex-col items-center gap-1 text-slate-400">
                        <Tag size={20} />
                        <span className="text-[10px] font-bold uppercase tracking-tight">Jual</span>
                    </button>
                </nav>
                {/* Standardized Settings Modal (Admin) */}
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

            {/* Modal Tambah Akun */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[60] flex items-center justify-center p-4">
                    <div className="bg-white rounded-[3rem] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                            <div>
                                <h3 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2 italic uppercase"><Plus size={24} /> Registrasi Akun CoA</h3>
                                <p className="text-slate-400 text-[10px] font-bold mt-1 uppercase tracking-[0.2em] italic">Chart of Account Enrollment</p>
                            </div>
                            <button onClick={() => setIsAddModalOpen(false)} className="p-3 hover:bg-white rounded-full transition-all shadow-sm">
                                <X size={24} />
                            </button>
                        </div>
                        
                        <form onSubmit={handleAddAccount} className="p-10 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Kode Akun</label>
                                    <input 
                                        type="text" 
                                        required 
                                        placeholder="Contoh: 1-1001" 
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 font-bold uppercase" 
                                        value={newAccount.code} 
                                        onChange={e => setNewAccount({...newAccount, code: e.target.value})} 
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Kategori Utama</label>
                                    <select 
                                        required 
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 font-bold appearance-none cursor-pointer" 
                                        value={newAccount.type} 
                                        onChange={e => setNewAccount({...newAccount, type: e.target.value})}
                                    >
                                        {ACCOUNT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Nama Akun Perkiraan</label>
                                <input 
                                    type="text" 
                                    required 
                                    placeholder="Masukkan nama akun lengkap..." 
                                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 font-bold" 
                                    value={newAccount.name} 
                                    onChange={e => setNewAccount({...newAccount, name: e.target.value})} 
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Sub-Kategori</label>
                                    <input 
                                        type="text" 
                                        placeholder="Contoh: Operasional" 
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 font-bold" 
                                        value={newAccount.subType} 
                                        onChange={e => setNewAccount({...newAccount, subType: e.target.value})} 
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Saldo Awal (Rp)</label>
                                    <input 
                                        type="number" 
                                        placeholder="0" 
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 font-black text-center" 
                                        value={newAccount.balance} 
                                        onChange={e => setNewAccount({...newAccount, balance: e.target.value})} 
                                    />
                                </div>
                            </div>

                            <button type="submit" className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-emerald-200 active:scale-95 transition-all outline-none">Daftarkan Akun Baru</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

// Modal Ganti Email
const ChangeEmailModal = ({ isOpen, onClose, oldEmail, newEmail, setNewEmail, onConfirm, isProcessing }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[300] flex items-center justify-center p-4">
            <div className="bg-white rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl p-8 space-y-6">
                <h4 className="text-2xl font-black text-slate-800">Ganti Email</h4>
                <form onSubmit={onConfirm} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Email Baru</label>
                        <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} required className="w-full px-5 py-3 bg-slate-50 border rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold" />
                    </div>
                    <div className="flex gap-3">
                        <button type="button" onClick={onClose} className="flex-1 py-4 bg-slate-100 rounded-2xl font-black">Batal</button>
                        <button type="submit" disabled={isProcessing} className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-black disabled:opacity-50">Konfirmasi</button>
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
                <h4 className="text-2xl font-black text-slate-800">Ganti WhatsApp</h4>
                <form onSubmit={onConfirm} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Nomor Baru</label>
                        <input type="tel" value={newWhatsapp} onChange={(e) => setNewWhatsapp(e.target.value)} required className="w-full px-5 py-3 bg-slate-50 border rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold" />
                    </div>
                    <div className="flex gap-3">
                        <button type="button" onClick={onClose} className="flex-1 py-4 bg-slate-100 rounded-2xl font-black">Batal</button>
                        <button type="submit" disabled={isProcessing} className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-black disabled:opacity-50">Simpan</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Modal Ganti Password
const ChangePasswordModal = ({ isOpen, onClose, newPassword, setNewPassword, confirmPassword, setConfirmPassword, onConfirm, isProcessing }) => {
    const [showNewPassword, setShowNewPassword] = React.useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[300] flex items-center justify-center p-4">
            <div className="bg-white rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl p-8 space-y-6">
                <h4 className="text-2xl font-black text-slate-800">Ganti Sandi</h4>
                <form onSubmit={onConfirm} className="space-y-4">
                    <div className="relative">
                        <input
                            type={showNewPassword ? "text" : "password"}
                            placeholder="Sandi Baru"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            className="w-full px-5 py-3 bg-slate-50 border rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                        />
                        <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600 transition-colors"
                        >
                            {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                    <div className="relative">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Konfirmasi Sandi"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="w-full px-5 py-3 bg-slate-50 border rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600 transition-colors"
                        >
                            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                    <div className="flex gap-3">
                        <button type="button" onClick={onClose} className="flex-1 py-4 bg-slate-100 rounded-2xl font-black">Batal</button>
                        <button type="submit" disabled={isProcessing} className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-black disabled:opacity-50">Simpan</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
