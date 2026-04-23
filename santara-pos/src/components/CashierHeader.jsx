"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { 
    Search, 
    ArrowLeft, 
    Menu, 
    Settings,
    Clock,
    User,
    Store
} from 'lucide-react';

export default function CashierHeader({ 
    storeName = "Santara Point",
    activeShift = "Pagi",
    searchTerm, 
    setSearchTerm, 
    onSettingsClick,
    onMenuClick, 
    showBackButton = false 
}) {
    const router = useRouter();

    return (
        <header className="bg-white border-b border-slate-200 p-4 lg:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 z-10 shadow-sm">
            <div className="flex items-center gap-4 w-full md:w-auto">
                <button 
                    onClick={onMenuClick}
                    className="lg:hidden p-2.5 hover:bg-slate-100 rounded-2xl transition-all text-slate-600 border border-slate-100 shadow-sm"
                >
                    <Menu size={20} />
                </button>
                
                {showBackButton && (
                    <button 
                        onClick={() => router.back()}
                        className="p-2.5 hover:bg-slate-100 rounded-2xl transition-all text-slate-600 border border-slate-100 shadow-sm hidden md:flex"
                        title="Kembali"
                    >
                        <ArrowLeft size={20} strokeWidth={3} />
                    </button>
                )}
                
                <div className="flex-1 md:flex-none">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
                            <Store size={20} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-slate-800 tracking-tight leading-none uppercase italic">
                                {storeName}
                            </h2>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase tracking-widest">
                                    Cashier Mode
                                </span>
                                <div className="flex items-center gap-1 text-[9px] font-bold text-slate-400">
                                    <Clock size={10} />
                                    {activeShift}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
                {setSearchTerm !== undefined && (
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Cari transaksi..."
                            className="w-full pl-9 pr-4 py-2.5 bg-slate-100 border-none rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm font-medium"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                )}
                
                <button 
                    onClick={onSettingsClick}
                    className="p-2.5 hover:bg-slate-100 rounded-2xl transition-all text-slate-600 border border-slate-100 shadow-sm flex items-center gap-2"
                    title="Pengaturan"
                >
                    <Settings size={20} />
                    <span className="hidden sm:inline text-xs font-black uppercase tracking-widest">Profil</span>
                </button>
            </div>
        </header>
    );
}
