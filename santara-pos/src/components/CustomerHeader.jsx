"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { 
    Search, 
    ArrowLeft, 
    ShieldCheck, 
    ShoppingCart,
    MapPin,
    Settings,
    Heart,
    Clock,
    Home
} from 'lucide-react';

const CustomerHeader = ({ 
    title, 
    subtitle, 
    showBackButton = false,
    showSearch = true,
    searchTerm,
    setSearchTerm,
    cartCount = 0,
    onCartClick,
    onSettingsClick,
    customerAddress
}) => {
    const router = useRouter();

    return (
        <header className="bg-white/80 backdrop-blur-xl border-b border-white/50 px-6 py-4 lg:py-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sticky top-0 z-40 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
            <div className="flex items-center gap-4 w-full md:w-auto">
                {showBackButton && (
                    <button 
                        onClick={() => router.back()}
                        className="p-2.5 bg-slate-100 rounded-2xl text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 transition-all"
                    >
                        <ArrowLeft size={20} />
                    </button>
                )}
                <div className="flex-1 md:flex-none">
                    <div className="flex items-center gap-2 mb-0.5">
                        <img src="/santara-logo.png" alt="Logo" className="w-6 h-6 lg:w-8 lg:h-8 object-contain" />
                        <h2 className="text-xl lg:text-3xl font-black text-slate-800 tracking-tight">
                            {title || 'Santara Point'}
                        </h2>
                    </div>
                    {subtitle && (
                        <p className="text-slate-400 text-[10px] lg:text-xs font-black uppercase tracking-widest mt-0.5 opacity-70">
                            {subtitle}
                        </p>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
                {/* Desktop Navigation Links */}
                <div className="hidden lg:flex items-center gap-1 mr-4">
                    {[
                        { icon: <Home size={18} />, label: "Beranda", href: "/" },
                        { icon: <Heart size={18} />, label: "Favorit", href: "/favorites" },
                        { icon: <Clock size={18} />, label: "Riwayat", href: "/customer-history" },
                    ].map((item, idx) => (
                        <button
                            key={idx}
                            onClick={() => router.push(item.href)}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 transition-all font-bold text-sm"
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </button>
                    ))}
                </div>

                {showSearch && setSearchTerm !== undefined && (
                    <div className="relative flex-1 md:w-80 lg:w-96 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Cari Menu Berkah..."
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:bg-white focus:border-emerald-500/20 transition-all font-bold text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                )}
                
                <div className="flex items-center gap-2 lg:gap-3">
                    {onSettingsClick && (
                        <button 
                            onClick={onSettingsClick}
                            className="p-3 bg-slate-50 border border-slate-100 rounded-2xl text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all shadow-sm"
                            title="Pengaturan"
                        >
                            <Settings size={20} />
                        </button>
                    )}
                    
                    {onCartClick && (
                        <button 
                            onClick={onCartClick}
                            className="relative p-3 bg-slate-900 rounded-2xl text-white hover:bg-emerald-600 transition-all shadow-xl shadow-slate-200 group"
                        >
                            <ShoppingCart size={20} />
                            {cartCount > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-black w-6 h-6 flex items-center justify-center rounded-full border-2 border-white animate-bounce">
                                    {cartCount}
                                </span>
                            )}
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
};

export default CustomerHeader;
