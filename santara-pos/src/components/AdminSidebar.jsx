"use client";

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    ShoppingBag,
    Tag,
    Landmark,
    BookOpen,
    Building2,
    ChefHat,
    Package,
    ClipboardList,
    TrendingUp,
    Settings,
    LogOut,
    X,
    ArrowLeft
} from 'lucide-react';

const AdminSidebar = ({ isOpen, setIsOpen, onOpenSettings }) => {
    const router = useRouter();
    const pathname = usePathname();

    const menuItems = [
        { icon: <LayoutDashboard size={20} />, label: "Dashboard", href: "/posin-adm", id: 'dashboard' },
        { icon: <ShoppingBag size={20} />, label: "POS Kasir", href: "/posin-adm", id: 'pos' },
        { icon: <Tag size={20} />, label: "Penjualan", href: "/penjualan", id: 'penjualan' },
        { icon: <Landmark size={20} />, label: "Kas & Bank", href: "/kas-bank", id: 'kas-bank' },
        { icon: <BookOpen size={20} />, label: "Buku Besar", href: "/buku-besar", id: 'buku-besar' },
        { icon: <Building2 size={20} />, label: "Perusahaan", href: "/perusahaan", id: 'perusahaan' },
        { icon: <ChefHat size={20} />, label: "Daftar Antrean", href: "/waiting-list", id: 'waiting-list' },
        { icon: <Package size={20} />, label: "Persediaan", href: "/persediaan", id: 'persediaan' },
        { icon: <ClipboardList size={20} />, label: "Manajemen Stok", href: "/manajemen-stok", id: 'manajemen-stok' },
        { icon: <ShoppingBag size={20} />, label: "Pembelian", href: "/pembelian", id: 'pembelian' },
        { icon: <TrendingUp size={20} />, label: "Laporan Keuangan", href: "/history?role=admin", id: 'laporan' },
        { icon: <Settings size={20} />, label: "Pengaturan Toko", action: onOpenSettings, id: 'pengaturan' },
    ];

    const isActive = (item) => {
        if (item.href === '/history?role=admin') return pathname === '/history';
        return pathname === item.href;
    };

    return (
        <aside className={`fixed lg:static inset-y-0 left-0 w-64 bg-emerald-900 text-white flex flex-col shadow-2xl z-[100] transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
            <div className="p-6 flex items-center justify-between border-b border-emerald-800 bg-emerald-950/20">
                <div className="flex items-center gap-3">
                    <button onClick={() => router.push('/')} className="bg-white p-1.5 rounded-lg flex items-center justify-center hover:scale-110 transition-transform cursor-pointer">
                        <img src="/santara-logo.png" alt="Santara" className="w-6 h-6 object-contain" />
                    </button>
                    <span className="font-black tracking-tighter text-xl italic uppercase">SANTARA OPS</span>
                </div>
                <button 
                    onClick={() => setIsOpen(false)}
                    className="lg:hidden p-2 hover:bg-emerald-800 rounded-xl transition-colors"
                >
                    <X size={20} />
                </button>
            </div>
            
            <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto no-scrollbar">
                {menuItems.map((item, i) => (
                    <button
                        key={i}
                        onClick={() => {
                            if (item.action) {
                                item.action();
                            } else {
                                router.push(item.href);
                            }
                            if (window.innerWidth < 1024) setIsOpen(false);
                        }}
                        className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all cursor-pointer group ${isActive(item) ? 'bg-emerald-600 shadow-lg shadow-emerald-950/20 text-white' : 'hover:bg-emerald-800 text-emerald-300 hover:text-white'}`}
                    >
                        <div className={`${isActive(item) ? 'text-white' : 'text-emerald-400 group-hover:text-white'} transition-colors`}>
                            {item.icon}
                        </div>
                        <span className="font-bold text-sm tracking-tight">{item.label}</span>
                    </button>
                ))}
            </nav>

            <div className="p-4 border-t border-emerald-800">
                <button onClick={() => window.location.href = '/login'} className="w-full flex items-center gap-4 p-3 rounded-xl text-red-300 hover:bg-red-500/10 hover:text-red-400 transition-all font-bold text-sm">
                    <LogOut size={20} />
                    <span>Keluar Admin</span>
                </button>
            </div>
        </aside>
    );
};

export default AdminSidebar;
