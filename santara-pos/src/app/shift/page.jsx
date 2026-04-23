"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Store, Clock, User, CheckCircle2, ShoppingBag, ChefHat, History, LogOut, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import CashierHeader from '@/components/CashierHeader';
import CashierSidebar from '@/components/CashierSidebar';
import SettingsModal from '@/components/SettingsModal';

function ShiftContent() {
    const router = useRouter();
    const [activeShift, setActiveShift] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    
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

    // --- State Perubahan Data (Inputs) ---
    const [newEmailInput, setNewEmailInput] = useState('');
    const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);
    const [newWhatsappInput, setNewWhatsappInput] = useState('');
    const [isUpdatingWhatsapp, setIsUpdatingWhatsapp] = useState(false);
    const [newPasswordInput, setNewPasswordInput] = useState('');
    const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
    const [storeSettings, setStoreSettings] = useState({
        storeName: 'Santara Point',
        storeTagline: 'Hidangan Lezat, Penuh Keberkahan.'
    });

    const shiftSchedules = [
        { id: 1, name: 'Zaid', shift: 'Pagi', time: '08:00 - 15:00', role: 'Kasir Utama' },
        { id: 2, name: 'Budi', shift: 'Siang', time: '15:00 - 22:00', role: 'Kasir Utama' },
        { id: 3, name: 'Siti', shift: 'Pagi', time: '08:00 - 15:00', role: 'Kasir Cadangan' },
        { id: 4, name: 'Andi', shift: 'Siang', time: '15:00 - 22:00', role: 'Kasir Cadangan' }
    ];

    useEffect(() => {
        // Security Check
        const userRole = localStorage.getItem('currentUserRole');
        const userEmail = localStorage.getItem('registeredEmail');
        const isAuthorized = userRole === 'Administrator' || userRole === 'Operator' || (userEmail && userEmail.toLowerCase() === 'santarapoint@gmail.com');

        if (!isAuthorized) {
            router.push('/login');
            return;
        }
        const stored = localStorage.getItem('activeCashierShift');
        if (stored) {
            setActiveShift(stored);
        } else {
            setActiveShift('Pagi (Zaid)');
        }

        const storedSettings = localStorage.getItem('santaraStoreSettings');
        if (storedSettings) {
            setStoreSettings(JSON.parse(storedSettings));
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

    const handleClockIn = (name, shift) => {
        const newShiftStr = `${shift} (${name})`;
        setActiveShift(newShiftStr);
        localStorage.setItem('activeCashierShift', newShiftStr);
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

    return (
        <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden relative">
            {/* Standardized Sidebar (Desktop) */}
            <CashierSidebar 
                isOpen={isSidebarOpen} 
                setIsOpen={setIsSidebarOpen} 
                onOpenSettings={() => {
                    setActiveSettingsTab('profil');
                    setIsSettingsOpen(true);
                }}
            />

            {/* Konten Utama */}
            <main className="flex-1 flex flex-col overflow-hidden relative">
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

                <div className="flex-1 overflow-y-auto p-8 lg:p-12 relative z-10">
                    
                    {/* Status Kasir Aktif */}
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-emerald-100 flex items-center gap-6 mb-10 max-w-2xl">
                        <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                            <CheckCircle2 size={32} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Kasir Bertugas Saat Ini</p>
                            <h3 className="text-2xl font-black text-emerald-700 tracking-tight">Shift: {activeShift}</h3>
                        </div>
                    </div>

                    {/* Tabel Jadwal */}
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden max-w-5xl">
                        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                            <h2 className="font-bold text-slate-700 text-sm flex items-center gap-2">
                                <Clock size={16} className="text-slate-400" /> Jadwal Operasional Bulanan
                            </h2>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">
                                        <th className="p-5">Nama Karyawan</th>
                                        <th className="p-5">Posisi</th>
                                        <th className="p-5">Waktu Shift</th>
                                        <th className="p-5 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {shiftSchedules.map((schedule) => {
                                        const isCurrent = activeShift === `${schedule.shift} (${schedule.name})`;
                                        return (
                                            <tr key={schedule.id} className={`hover:bg-slate-50/50 transition-colors ${isCurrent ? 'bg-emerald-50/30' : ''}`}>
                                                <td className="p-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold">
                                                            {schedule.name.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-sm text-slate-800">{schedule.name}</div>
                                                            <div className="text-[10px] font-bold text-slate-400 uppercase">{schedule.role}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-5">
                                                    <span className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border ${
                                                        schedule.shift === 'Pagi' ? 'bg-blue-50 text-blue-600 border-blue-200' : 'bg-amber-50 text-amber-600 border-amber-200'
                                                    }`}>
                                                        Shift {schedule.shift}
                                                    </span>
                                                </td>
                                                <td className="p-5">
                                                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                                                        <Clock size={14} className="text-slate-400" />
                                                        {schedule.time}
                                                    </div>
                                                </td>
                                                <td className="p-5 text-right">
                                                    {isCurrent ? (
                                                        <button disabled className="px-6 py-2.5 rounded-xl font-bold text-xs bg-emerald-100 text-emerald-600 border border-emerald-200 flex items-center gap-2 ml-auto">
                                                            <CheckCircle2 size={14} /> Sedang Bertugas
                                                        </button>
                                                    ) : (
                                                        <button 
                                                            onClick={() => handleClockIn(schedule.name, schedule.shift)}
                                                            className="px-6 py-2.5 rounded-xl font-bold text-xs bg-slate-900 text-white hover:bg-emerald-600 transition-colors shadow-lg shadow-slate-200 flex items-center gap-2 ml-auto"
                                                        >
                                                            Mulai Shift
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Mobile Bottom Navigation (optional for cashier, but let's keep it clean) */}
            </main>

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

export default function ShiftPage() {
    return (
        <Suspense fallback={<div className="h-screen w-screen flex items-center justify-center bg-slate-50"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div></div>}>
            <ShiftContent />
        </Suspense>
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
