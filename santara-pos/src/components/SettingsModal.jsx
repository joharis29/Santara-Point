"use client";

import React from 'react';
import { 
    X, 
    User, 
    Languages, 
    Palette, 
    Settings,
    MapPin,
    Trash2,
    Building2,
    Calculator,
    Users,
    UserPlus,
    UserCircle,
    Globe,
    FileText,
    BookOpen,
    LayoutDashboard,
    ShieldCheck,
    ChevronDown
} from 'lucide-react';

const SettingsModal = ({ 
    isOpen, 
    onClose, 
    activeTab, 
    setActiveTab, 
    userProfile, 
    setUserProfile, 
    handleSaveProfile,
    setIsChangeEmailOpen,
    setIsChangeWhatsappOpen,
    setIsChangePasswordOpen,
    addAddress,
    removeAddress,
    updateAddress,
    // Admin Props
    isAdmin = false,
    storeSettings = {},
    setStoreSettings = () => {},
    newUserContact = '',
    setNewUserContact = () => {},
    newUserRole = 'Operator',
    setNewUserRole = () => {}
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[200] flex items-center justify-center p-4">
            <div className="bg-white rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row h-[80vh] md:h-auto max-h-[90vh]">
                {/* Sidebar Modal */}
                <div className="w-full md:w-64 bg-slate-50 p-6 flex flex-col gap-2 border-r border-slate-100">
                    <div className="mb-6 px-2 text-emerald-600 block">
                        <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center mb-4">
                            <Settings size={24} />
                        </div>
                        <h3 className="text-xl font-black text-slate-800">Pengaturan</h3>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Santara Settings</p>
                    </div>
                    
                    <button
                        onClick={() => setActiveTab('profil')}
                        className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all ${activeTab === 'profil' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-100' : 'text-slate-500 hover:bg-emerald-50 hover:text-emerald-600'}`}
                    >
                        <User size={20} />
                        Profil Saya
                    </button>
                    <button
                        onClick={() => setActiveTab('bahasa')}
                        className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all ${activeTab === 'bahasa' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-100' : 'text-slate-500 hover:bg-emerald-50 hover:text-emerald-600'}`}
                    >
                        <Languages size={20} />
                        Bahasa
                    </button>
                    <button
                        onClick={() => setActiveTab('tema')}
                        className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all ${activeTab === 'tema' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-100' : 'text-slate-500 hover:bg-emerald-50 hover:text-emerald-600'}`}
                    >
                        <Palette size={20} />
                        Tema
                    </button>

                    {isAdmin && (
                        <>
                            <div className="h-px bg-slate-200 my-2 mx-4" />
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-4 mb-1">Manajemen Toko</p>
                            <button
                                onClick={() => setActiveTab('info-toko')}
                                className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all ${activeTab === 'info-toko' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-100' : 'text-slate-500 hover:bg-emerald-50 hover:text-emerald-600'}`}
                            >
                                <Building2 size={20} />
                                Info Toko
                            </button>
                            <button
                                onClick={() => setActiveTab('pajak')}
                                className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all ${activeTab === 'pajak' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-100' : 'text-slate-500 hover:bg-emerald-50 hover:text-emerald-600'}`}
                            >
                                <Calculator size={20} />
                                Pajak
                            </button>
                            <button
                                onClick={() => setActiveTab('pengguna')}
                                className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all ${activeTab === 'pengguna' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-100' : 'text-slate-500 hover:bg-emerald-50 hover:text-emerald-600'}`}
                            >
                                <Users size={20} />
                                Pengguna
                            </button>
                        </>
                    )}
                    
                    <button
                        onClick={onClose}
                        className="mt-auto flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-slate-400 hover:text-red-500 transition-all border border-transparent hover:border-red-100 mb-2"
                    >
                        <X size={20} />
                        Tutup
                    </button>
                </div>

                {/* Content Modal */}
                <div className="flex-1 p-8 md:p-10 bg-white overflow-y-auto no-scrollbar">
                    {activeTab === 'profil' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div>
                                <h4 className="text-2xl font-black text-slate-800 tracking-tight">Profil Saya</h4>
                                <p className="text-slate-400 text-sm font-medium mt-1">Kelola informasi data diri Anda.</p>
                            </div>
                            <form onSubmit={handleSaveProfile} className="space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Nama Depan</label>
                                        <input
                                            type="text"
                                            value={userProfile.firstName}
                                            onChange={(e) => setUserProfile({ ...userProfile, firstName: e.target.value })}
                                            className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-slate-700 transition-all shadow-sm"
                                            placeholder="Nama Depan"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Nama Belakang</label>
                                        <input
                                            type="text"
                                            value={userProfile.lastName}
                                            onChange={(e) => setUserProfile({ ...userProfile, lastName: e.target.value })}
                                            className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-slate-700 transition-all shadow-sm"
                                            placeholder="Nama Belakang"
                                        />
                                    </div>
                                </div>
                                
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center ml-1">
                                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Alamat Email</label>
                                        <button
                                            type="button"
                                            onClick={() => setIsChangeEmailOpen(true)}
                                            className="text-[10px] font-black text-emerald-600 hover:text-emerald-700 uppercase tracking-widest transition-colors bg-emerald-50 px-2 py-1 rounded-md"
                                        >
                                            Ganti
                                        </button>
                                    </div>
                                    <input
                                        type="email"
                                        value={userProfile.email}
                                        readOnly
                                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-slate-400 cursor-not-allowed italic"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between items-center ml-1">
                                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">WhatsApp</label>
                                        <button
                                            type="button"
                                            onClick={() => setIsChangeWhatsappOpen(true)}
                                            className="text-[10px] font-black text-emerald-600 hover:text-emerald-700 uppercase tracking-widest transition-colors bg-emerald-50 px-2 py-1 rounded-md"
                                        >
                                            Ganti
                                        </button>
                                    </div>
                                    <input
                                        type="tel"
                                        value={userProfile.whatsapp}
                                        readOnly
                                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-slate-400 cursor-not-allowed italic"
                                    />
                                </div>

                                {/* Address Section */}
                                <div className="pt-8 border-t border-slate-100 space-y-5">
                                    <div className="flex items-center justify-between px-1">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-slate-900 rounded-xl flex items-center justify-center text-white">
                                                <MapPin size={16} />
                                            </div>
                                            <h5 className="text-sm font-black text-slate-800 tracking-tight">Daftar Alamat</h5>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={addAddress}
                                            className="text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:bg-emerald-50 px-3 py-1.5 rounded-lg transition-all border border-emerald-100"
                                        >
                                            + Tambah
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        {userProfile.addresses.length === 0 ? (
                                            <div className="p-10 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center text-center gap-3">
                                                <MapPin size={32} className="text-slate-300" />
                                                <p className="text-xs font-bold text-slate-400 italic">Belum ada alamat pengiriman yang tersimpan.</p>
                                            </div>
                                        ) : (
                                            userProfile.addresses.map((addr) => (
                                                <div key={addr.id} className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-4 relative group shadow-sm hover:shadow-md transition-all">
                                                    <button
                                                        type="button"
                                                        onClick={() => removeAddress(addr.id)}
                                                        className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors bg-white w-8 h-8 rounded-full flex items-center justify-center border border-slate-100"
                                                        title="Hapus Alamat"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">Label Alamat</label>
                                                        <input
                                                            type="text"
                                                            value={addr.label}
                                                            onChange={(e) => updateAddress(addr.id, 'label', e.target.value)}
                                                            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-slate-700 text-sm"
                                                            placeholder="Contoh: Rumah / Kantor"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">Detail Jalan & No Rumah</label>
                                                        <textarea
                                                            value={addr.details}
                                                            onChange={(e) => updateAddress(addr.id, 'details', e.target.value)}
                                                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-slate-600 text-sm min-h-[80px] leading-relaxed resize-none"
                                                            placeholder="Jl. Merdeka No. 123..."
                                                        />
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] hover:bg-emerald-600 transition-all shadow-xl shadow-slate-200"
                                >
                                    Simpan Perubahan
                                </button>
                            </form>
                        </div>
                    )}

                    {activeTab === 'bahasa' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                             <div>
                                <h4 className="text-2xl font-black text-slate-800 tracking-tight">Pilih Bahasa</h4>
                                <p className="text-slate-400 text-sm font-medium mt-1">Sesuaikan bahasa aplikasi Santara.</p>
                            </div>
                            <div className="grid grid-cols-1 gap-3">
                                {['Bahasa Indonesia', 'English (UK)', 'Arabic (\u0627\u0644\u0639\u0631\u0628\u064a\u0629)'].map(lang => (
                                    <button key={lang} className="p-4 w-full text-left font-bold text-slate-700 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-700 rounded-2xl transition-all border border-slate-100 flex items-center justify-between">
                                        {lang}
                                        {lang === 'Bahasa Indonesia' && <div className="w-2 h-2 rounded-full bg-emerald-500" />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'tema' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                             <div>
                                <h4 className="text-2xl font-black text-slate-800 tracking-tight">Tema Aplikasi</h4>
                                <p className="text-slate-400 text-sm font-medium mt-1">Pilih tampilan yang paling nyaman.</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <button className="p-6 bg-white border-4 border-emerald-500 rounded-[2.5rem] flex flex-col items-center gap-3 shadow-xl">
                                    <div className="w-16 h-12 bg-slate-100 rounded-xl" />
                                    <span className="font-black text-slate-800 text-sm">Light Mode</span>
                                </button>
                                <button className="p-6 bg-slate-900 border-4 border-transparent rounded-[2.5rem] flex flex-col items-center gap-3">
                                    <div className="w-16 h-12 bg-slate-800 rounded-xl" />
                                    <span className="font-black text-slate-400 text-sm">Dark Mode</span>
                                </button>
                            </div>
                        </div>
                    )}

                    {isAdmin && activeTab === 'info-toko' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div>
                                <h4 className="text-2xl font-black text-slate-800 tracking-tight">Informasi Toko</h4>
                                <p className="text-slate-400 text-sm font-medium mt-1">Data identitas operasional Santara Point.</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Nama Toko</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-slate-700"
                                        value={storeSettings.storeName}
                                        onChange={(e) => setStoreSettings({ ...storeSettings, storeName: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Kategori Perusahaan</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-slate-700"
                                        value={storeSettings.companyCategory}
                                        onChange={(e) => setStoreSettings({ ...storeSettings, companyCategory: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Bidang Usaha</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-slate-700"
                                        value={storeSettings.companyField}
                                        onChange={(e) => setStoreSettings({ ...storeSettings, companyField: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Mata Uang Penggunaan</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-slate-700"
                                        value={storeSettings.currency}
                                        onChange={(e) => setStoreSettings({ ...storeSettings, currency: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Alamat Utama</label>
                                <textarea
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-slate-700 min-h-[100px]"
                                    value={storeSettings.address}
                                    onChange={(e) => setStoreSettings({ ...storeSettings, address: e.target.value })}
                                ></textarea>
                            </div>
                        </div>
                    )}

                    {isAdmin && activeTab === 'pajak' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                             <div>
                                <h4 className="text-2xl font-black text-slate-800 tracking-tight">Pengaturan Pajak</h4>
                                <p className="text-slate-400 text-sm font-medium mt-1">Konfigurasi PPN dan identitas PKP.</p>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-2xl border border-emerald-100 mb-6">
                                <div>
                                    <p className="font-bold text-emerald-800 text-sm">Aktifkan Pajak (10%)</p>
                                    <p className="text-[10px] text-emerald-600 font-medium">Otomatis ditambahkan pada setiap struk penjualan.</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        className="sr-only peer" 
                                        checked={storeSettings.isPajakActive}
                                        onChange={(e) => setStoreSettings({ ...storeSettings, isPajakActive: e.target.checked })}
                                    />
                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                                </label>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">NPWP Perusahaan</label>
                                    <input
                                        type="text"
                                        placeholder="00.000.000.0-000.000"
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-slate-700"
                                        value={storeSettings.companyNpwp}
                                        onChange={(e) => setStoreSettings({ ...storeSettings, companyNpwp: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Tipe Usaha</label>
                                    <select
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-slate-700 appearance-none cursor-pointer"
                                            value={storeSettings.companyType}
                                            onChange={(e) => setStoreSettings({ ...storeSettings, companyType: e.target.value })}
                                        >
                                            <option value="PT">PT</option>
                                            <option value="CV">CV</option>
                                            <option value="Perorangan">Perorangan</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {isAdmin && activeTab === 'pengguna' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                             <div>
                                <h4 className="text-2xl font-black text-slate-800 tracking-tight">Manajemen Pengguna</h4>
                                <p className="text-slate-400 text-sm font-medium mt-1">Kelola akses Administrator dan Operator.</p>
                            </div>
                            <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100 flex flex-col gap-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-emerald-600/50 ml-1">Email / No. HP</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 bg-white border border-emerald-200 rounded-2xl outline-none font-bold text-slate-700"
                                            value={newUserContact}
                                            onChange={(e) => setNewUserContact(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-emerald-600/50 ml-1">Role</label>
                                        <select
                                            className="w-full px-4 py-3 bg-white border border-emerald-200 rounded-2xl outline-none font-bold text-slate-700"
                                            value={newUserRole}
                                            onChange={(e) => setNewUserRole(e.target.value)}
                                        >
                                            <option value="Operator">Operator</option>
                                            <option value="Administrator">Administrator</option>
                                        </select>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => {
                                        if (!newUserContact) return;
                                        setStoreSettings({
                                            ...storeSettings,
                                            authorizedUsers: [...storeSettings.authorizedUsers, { contact: newUserContact, role: newUserRole }]
                                        });
                                        setNewUserContact('');
                                    }}
                                    className="w-full py-3 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-500 transition-all"
                                >
                                    Tambah Pengguna
                                </button>
                            </div>
                            <div className="space-y-2">
                                {storeSettings.authorizedUsers && storeSettings.authorizedUsers.map((user, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                                        <div>
                                            <p className="font-bold text-slate-800 text-sm">{user.contact}</p>
                                            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">{user.role}</p>
                                        </div>
                                        {user.contact !== 'santarapoint@gmail.com' && (
                                            <button 
                                                onClick={() => {
                                                    setStoreSettings({
                                                        ...storeSettings,
                                                        authorizedUsers: storeSettings.authorizedUsers.filter((_, i) => i !== idx)
                                                    });
                                                }}
                                                className="p-2 text-slate-300 hover:text-red-500"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;
