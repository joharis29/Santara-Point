"use client";

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { 
    ShoppingBag, 
    Clock, 
    ChefHat, 
    History, 
    LogOut,
    Store,
    LayoutDashboard,
    X,
    User,
    Settings,
    Home
} from 'lucide-react';

export default function CashierSidebar({ isOpen, setIsOpen, onOpenSettings }) {
    const router = useRouter();
    const pathname = usePathname();

    const menuItems = [
        { 
            id: 'pos', 
            icon: <ShoppingBag size={20} />, 
            label: 'POS Kasir', 
            href: '/posin-cas',
            title: 'Point of Sale'
        },
        { 
            id: 'waiting-list', 
            icon: <ChefHat size={20} />, 
            label: 'Daftar Antrean', 
            href: '/waiting-list',
            title: 'Manajemen Pesanan'
        },
        { 
            id: 'shift', 
            icon: <Clock size={20} />, 
            label: 'Manajemen Shift', 
            href: '/shift',
            title: 'Shift Kasir'
        },
        { 
            id: 'history', 
            icon: <History size={20} />, 
            label: 'Riwayat Transaksi', 
            href: '/history?role=cashier',
            title: 'Laporan Penjualan'
        },
        { 
            id: 'pengaturan', 
            icon: <User size={20} />, 
            label: 'Profil Kasir', 
            action: onOpenSettings,
            title: 'Pengaturan Profil'
        }
    ];

    function isActive(item) {
        if (!item.href) return false;
        const itemPath = item.href.split('?')[0];
        return pathname === itemPath;
    }

    return (
        <aside className={`fixed lg:static inset-y-0 left-0 w-64 bg-slate-900 text-white flex flex-col shadow-2xl z-[100] transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
            <div className="p-6 flex items-center justify-between border-b border-slate-800 bg-slate-950/20">
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => router.push('/')} 
                        className="bg-emerald-500 p-2 rounded-xl flex items-center justify-center hover:scale-110 transition-transform cursor-pointer shadow-lg shadow-emerald-500/20"
                    >
                        <Store className="text-white" size={20} />
                    </button>
                    <span className="font-black tracking-tighter text-xl italic uppercase text-white">SANTARA POS</span>
                </div>
                <button 
                    onClick={() => setIsOpen(false)}
                    className="lg:hidden p-2 hover:bg-slate-800 rounded-xl transition-colors text-slate-400"
                >
                    <X size={20} />
                </button>
            </div>
            
            <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto no-scrollbar">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-4 mb-2">Main Menu</p>
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
                        className={`w-full flex items-center gap-4 p-3.5 rounded-2xl transition-all cursor-pointer group ${isActive(item) ? 'bg-emerald-600 shadow-lg shadow-emerald-950/20 text-white' : 'hover:bg-slate-800 text-slate-400 hover:text-white'}`}
                    >
                        <div className={`${isActive(item) ? 'text-white' : 'text-slate-500 group-hover:text-emerald-400'} transition-colors`}>
                            {item.icon}
                        </div>
                        <span className="font-bold text-sm tracking-tight">{item.label}</span>
                    </button>
                ))}
            </nav>

            <div className="p-4 border-t border-slate-800 space-y-2">
                <button 
                    onClick={() => router.push('/')} 
                    className="w-full flex items-center gap-4 p-3 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-all font-bold text-sm"
                >
                    <Home size={20} />
                    <span>Layar Utama</span>
                </button>
                <button 
                    onClick={() => window.location.href = '/login'} 
                    className="w-full flex items-center gap-4 p-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all font-bold text-sm"
                >
                    <LogOut size={20} />
                    <span>Keluar Kasir</span>
                </button>
            </div>
        </aside>
    );
}

