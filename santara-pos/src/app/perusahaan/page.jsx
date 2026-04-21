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
    Building2,
    Users,
    Percent,
    ClipboardList,
    Calendar as CalendarIcon,
    Plus,
    X,
    Filter,
    Edit3,
    Trash2,
    CheckCircle2,
    AlertCircle,
    ArrowLeft,
    Tag,
    Landmark,
    BookOpen,
    Clock,
    User,
    CalendarDays,
    Store,
    Menu,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import AdminHeader from '@/components/AdminHeader';
import AdminSidebar from '@/components/AdminSidebar';
import SettingsModal from '@/components/SettingsModal';

const INITIAL_TAXES = [
    { id: 1, name: 'PPN 11%', rate: 11, status: 'Aktif' },
    { id: 2, name: 'Service Charge 5%', rate: 5, status: 'Aktif' }
];

const INITIAL_EMPLOYEES = [
    { id: 1, name: 'Zaid', role: 'Kasir Utama', status: 'Aktif', joinDate: '2025-01-10' },
    { id: 2, name: 'Budi', role: 'Kasir Utama', status: 'Aktif', joinDate: '2025-01-12' },
    { id: 3, name: 'Siti', role: 'Kasir Cadangan', status: 'Cuti', joinDate: '2025-02-01' },
    { id: 4, name: 'Andi', role: 'Kasir Cadangan', status: 'Aktif', joinDate: '2025-02-05' }
];

const INITIAL_LOGS = [
    { id: 1, action: 'Update Stok Bahan', user: 'Admin', time: '2026-04-18 10:30', detail: 'Beras +50kg' },
    { id: 2, action: 'Mulai Shift', user: 'Zaid', time: '2026-04-18 08:00', detail: 'Shift Pagi' },
    { id: 3, action: 'Login Berhasil', user: 'Owner', time: '2026-04-18 07:45', detail: 'IP: 192.168.1.5' },
    { id: 4, action: 'Retur Penjualan', user: 'Admin', time: '2026-04-17 16:20', detail: 'ID: INV-20260417-001' }
];

export default function PerusahaanPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('karyawan'); // pajak, karyawan, log, kalender
    const [employees, setEmployees] = useState(INITIAL_EMPLOYEES);
    const [taxes, setTaxes] = useState(INITIAL_TAXES);
    const [logs, setLogs] = useState(INITIAL_LOGS);
    
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
    
    // Calendar state
    const [currentDate, setCurrentDate] = useState(new Date());
    const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const storedEmployees = localStorage.getItem('santaraEmployees');
        if (storedEmployees) setEmployees(JSON.parse(storedEmployees));
        
        const storedTaxes = localStorage.getItem('santaraTaxes');
        if (storedTaxes) setTaxes(JSON.parse(storedTaxes));

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
    }, []);

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

    const saveEmployees = (data) => {
        setEmployees(data);
        localStorage.setItem('santaraEmployees', JSON.stringify(data));
    };

    const renderCalendar = () => {
        const month = currentDate.getMonth();
        const year = currentDate.getFullYear();
        const numDays = daysInMonth(month, year);
        const startDay = firstDayOfMonth(month, year);
        const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
        
        const days = [];
        // empty slots for previous month
        for(let i = 0; i < startDay; i++) {
            days.push(<div key={`empty-${i}`} className="h-24 border border-slate-50 bg-slate-50/20"></div>);
        }
        
        // current month days
        for(let d = 1; d <= numDays; d++) {
            const isToday = d === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();
            days.push(
                <div key={d} className={`h-24 border border-slate-50 p-2 transition-colors hover:bg-emerald-50/30 group ${isToday ? 'bg-emerald-50/50' : 'bg-white'}`}>
                    <span className={`text-[10px] font-black ${isToday ? 'bg-emerald-600 text-white w-5 h-5 flex items-center justify-center rounded-full' : 'text-slate-400'}`}>
                        {d}
                    </span>
                    {/* Simulated events */}
                    {d % 7 === 0 && <div className="mt-1 bg-blue-100 text-blue-600 text-[8px] font-bold py-1 px-1.5 rounded-md truncate">Meeting Bulanan</div>}
                    {d === 25 && <div className="mt-1 bg-purple-100 text-purple-600 text-[8px] font-bold py-1 px-1.5 rounded-md truncate">Gajian</div>}
                </div>
            );
        }

        return (
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden animate-in fade-in duration-700">
                <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                    <h3 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2 italic uppercase underline decoration-emerald-500 decoration-4">
                        <CalendarIcon size={20} /> {monthNames[month]} {year}
                    </h3>
                    <div className="flex gap-2">
                        <button onClick={() => setCurrentDate(new Date(year, month-1, 1))} className="p-2 hover:bg-white rounded-xl transition-all shadow-sm border border-slate-200">
                            <ChevronLeft size={18} />
                        </button>
                        <button onClick={() => setCurrentDate(new Date())} className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest">Hari Ini</button>
                        <button onClick={() => setCurrentDate(new Date(year, month+1, 1))} className="p-2 hover:bg-white rounded-xl transition-all shadow-sm border border-slate-200">
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
                <div className="grid grid-cols-7 text-center border-b border-slate-100 italic bg-slate-50/30">
                    {["Ming", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map(d => (
                        <div key={d} className="py-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">{d}</div>
                    ))}
                </div>
                <div className="grid grid-cols-7 italic">
                    {days}
                </div>
            </div>
        )
    };

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
                    title="Modul Perusahaan"
                    subtitle="Manajemen Karyawan, Pajak, & Audit Log"
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    onMenuClick={() => setIsSidebarOpen(true)}
                />

                <div className="bg-white border-b border-slate-100 flex overflow-x-auto scrollbar-hide z-10 p-2">
                    {[
                        { id: 'karyawan', label: 'Data Karyawan', icon: <Users size={16} /> },
                        { id: 'pajak', label: 'Pajak & Retribusi', icon: <Percent size={16} /> },
                        { id: 'log', label: 'Log Aktivitas', icon: <ClipboardList size={16} /> },
                        { id: 'kalender', label: 'Kalender Kerja', icon: <CalendarDays size={16} /> },
                    ].map(tab => (
                        <button 
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] italic transition-all border-b-2 whitespace-nowrap flex items-center gap-2 ${activeTab === tab.id ? 'border-emerald-600 text-emerald-600 bg-emerald-50/30 rounded-t-2xl' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                        >
                            {tab.icon} {tab.label}
                        </button>
                    ))}
                </div>

                <div className="flex-1 overflow-y-auto p-6 lg:p-10 relative z-10 italic">
                    {activeTab === 'karyawan' && (
                        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                            <div className="flex justify-between items-center px-4">
                                <h3 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2 uppercase italic underline decoration-blue-500 decoration-4">Daftar Staff Aktif</h3>
                                <button className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center gap-2 hover:bg-emerald-600 transition-all">
                                    <Plus size={16} /> Tambah Staff
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {employees.map(emp => (
                                    <div key={emp.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:scale-[1.02] transition-all group">
                                        <div className="w-16 h-16 rounded-3xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-emerald-500 group-hover:text-white transition-all mb-4">
                                            <User size={32} />
                                        </div>
                                        <h4 className="font-black text-slate-800 tracking-tighter text-lg">{emp.name}</h4>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 italic">{emp.role}</p>
                                        <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${emp.status === 'Aktif' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                                {emp.status}
                                            </span>
                                            <span className="text-[10px] font-black text-slate-300">{emp.joinDate}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'pajak' && (
                        <div className="animate-in fade-in duration-700">
                             <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
                                <div className="p-8 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
                                    <h3 className="text-xl font-black text-slate-800 tracking-tight italic uppercase underline decoration-amber-500 decoration-4">Konfigurasi Fiskal</h3>
                                    <button className="p-2 bg-emerald-100 text-emerald-700 rounded-xl hover:scale-110 transition-all"><Plus size={20} /></button>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="border-b border-slate-50 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 italic bg-slate-50/30">
                                                <th className="px-8 py-6">Nama Pajak</th>
                                                <th className="px-8 py-6">Persentase</th>
                                                <th className="px-8 py-6">Status</th>
                                                <th className="px-8 py-6 text-right">Manajemen</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50">
                                            {taxes.map(tax => (
                                                <tr key={tax.id} className="hover:bg-slate-50 transition-colors group">
                                                    <td className="px-8 py-6 font-black text-slate-800 italic">{tax.name}</td>
                                                    <td className="px-8 py-6">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-12 h-1 bg-slate-100 rounded-full overflow-hidden">
                                                                <div className="h-full bg-emerald-500" style={{width: `${tax.rate*4}%`}}></div>
                                                            </div>
                                                            <span className="font-black text-emerald-600 text-sm">{tax.rate}%</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black rounded-full uppercase italic">{tax.status}</span>
                                                    </td>
                                                    <td className="px-8 py-6 text-right">
                                                        <button className="p-2 text-slate-300 hover:text-emerald-600 transition-all"><Edit3 size={16} /></button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                             </div>
                        </div>
                    )}

                    {activeTab === 'log' && (
                        <div className="space-y-4 animate-in slide-in-from-right-4 duration-500">
                             <div className="bg-slate-900 text-white p-6 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
                                <div className="absolute inset-0 bg-emerald-600 opacity-0 group-hover:opacity-10 transition-opacity"></div>
                                <h3 className="text-xl font-black italic tracking-widest uppercase flex items-center gap-3">
                                    <Clock className="text-emerald-500" /> System Activity Log
                                </h3>
                                <p className="text-slate-500 text-[10px] font-bold mt-1 tracking-widest">REAL-TIME MONITORING ACTIVATED</p>
                             </div>

                             <div className="grid gap-3">
                                {logs.map(log => (
                                    <div key={log.id} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-emerald-500 transition-all relative overflow-hidden group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 font-black text-xs group-hover:bg-slate-900 group-hover:text-white transition-all">
                                                {log.user.charAt(0)}
                                            </div>
                                            <div>
                                                <h4 className="font-black text-slate-800 tracking-tight text-sm uppercase italic">{log.action}</h4>
                                                <p className="text-[10px] font-bold text-slate-400 italic">{log.user} \u2022 {log.time}</p>
                                            </div>
                                        </div>
                                        <div className="px-4 py-2 bg-slate-50 rounded-xl text-[10px] font-black text-slate-500 uppercase tracking-widest italic flex items-center gap-2">
                                            <AlertCircle size={14} className="text-blue-500" /> {log.detail}
                                        </div>
                                    </div>
                                ))}
                             </div>
                        </div>
                    )}

                    {activeTab === 'kalender' && renderCalendar()}
                </div>

                {/* Mobile Navigation */}
                <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-6 py-4 flex justify-around items-center z-50 shadow-2xl">
                    <button onClick={() => router.push('/posin-adm')} className="flex flex-col items-center gap-1 text-slate-400">
                        <LayoutDashboard size={20} />
                        <span className="text-[10px] font-bold uppercase tracking-tight">Dash</span>
                    </button>
                    <button className="flex flex-col items-center gap-1 text-emerald-600">
                        <Building2 size={20} />
                        <span className="text-[10px] font-bold uppercase tracking-tight">Corp</span>
                    </button>
                    <button onClick={() => router.push('/buku-besar')} className="flex flex-col items-center gap-1 text-slate-400">
                        <BookOpen size={20} />
                        <span className="text-[10px] font-bold uppercase tracking-tight">Ledger</span>
                    </button>
                    <button onClick={() => router.push('/homepage')} className="flex flex-col items-center gap-1 text-slate-400">
                        <ArrowLeft size={20} />
                        <span className="text-[10px] font-bold uppercase tracking-tight">Back</span>
                    </button>
                </nav>
            </main>

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
            />
        </div>
    );
}
