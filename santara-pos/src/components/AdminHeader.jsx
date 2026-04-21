"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { 
    Search, 
    ArrowLeft, 
    Menu, 
    ShieldCheck 
} from 'lucide-react';

const AdminHeader = ({ 
    title, 
    subtitle, 
    searchTerm, 
    setSearchTerm, 
    onMenuClick, 
    showBackButton = true,
    customAction
}) => {
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
                        <ArrowLeft size={24} strokeWidth={3} />
                    </button>
                )}
                
                <div className="flex-1 md:flex-none">
                    <div className="flex items-center gap-2 mb-0.5">
                        <h2 className="text-xl lg:text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                            {title}
                        </h2>
                    </div>
                    {subtitle && (
                        <p className="text-slate-400 text-[10px] lg:text-xs font-medium uppercase tracking-widest">
                            {subtitle}
                        </p>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
                {setSearchTerm !== undefined && (
                    <div className="relative flex-1 md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Cari data..."
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border-none rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm font-medium"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                )}
                {customAction}
            </div>
        </header>
    );
};

export default AdminHeader;
