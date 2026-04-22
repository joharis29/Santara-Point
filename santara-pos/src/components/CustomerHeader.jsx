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
        <header className="bg-white/95 backdrop-blur-xl border-b border-slate-100 px-6 py-3 lg:py-4 flex flex-col lg:flex-row justify-between items-center gap-4 sticky top-0 z-40 shadow-sm">
            {/* Left: Logo & Title */}
            <div className="flex items-center gap-4 w-full lg:w-auto shrink-0">
                {showBackButton && (
                    <button 
                        onClick={() => router.back()}
                        className="p-2.5 bg-slate-50 rounded-2xl text-slate-500 hover:bg-emerald-50 hover:text-emerald-600 transition-all border border-slate-100"
                    >
                        <ArrowLeft size={18} />
                    </button>
                )}
                <div className="flex items-center gap-3">
                    <div className="bg-emerald-600 p-1.5 rounded-xl shadow-lg shadow-emerald-200">
                        <img src="/santara-logo.png" alt="Logo" className="w-5 h-5 lg:w-6 lg:h-6 object-contain brightness-0 invert" />
                    </div>
                    <div>
                        <h2 className="text-lg lg:text-xl font-black text-slate-800 tracking-tighter leading-tight">
                            {title || 'Santara Point'}
                        </h2>
                        {subtitle && (
                            <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.15em] opacity-80 truncate max-w-[150px]">
                                {subtitle}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Center: Desktop Navigation */}
            <nav className="hidden lg:flex items-center bg-slate-50/50 p-1 rounded-2xl border border-slate-100">
                {[
                    { icon: <Home size={16} />, label: "Beranda", href: "/" },
                    { icon: <Heart size={16} />, label: "Favorit", href: "/favorites" },
                    { icon: <Clock size={16} />, label: "Riwayat", href: "/customer-history" },
                ].map((item, idx) => {
                    const isActive = typeof window !== 'undefined' && window.location.pathname === item.href;
                    return (
                        <button
                            key={idx}
                            onClick={() => router.push(item.href)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-bold text-xs ${isActive ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </button>
                    );
                })}
            </nav>

            {/* Right: Search & Actions */}
            <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-end">
                {showSearch && setSearchTerm !== undefined && (
                    <div className="relative flex-1 md:w-64 lg:w-72 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={16} />
                        <input
                            type="text"
                            placeholder="Cari Menu..."
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:bg-white focus:border-emerald-500/20 transition-all font-bold text-xs"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                )}
                
                <div className="flex items-center gap-2">
                    {onSettingsClick && (
                        <button 
                            onClick={onSettingsClick}
                            className="p-2.5 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all shadow-sm"
                            title="Pengaturan"
                        >
                            <Settings size={18} />
                        </button>
                    )}
                    
                    {onCartClick && (
                        <button 
                            onClick={onCartClick}
                            className="relative p-2.5 bg-slate-900 rounded-xl text-white hover:bg-emerald-600 transition-all shadow-lg shadow-slate-200 group"
                        >
                            <ShoppingCart size={18} />
                            {cartCount > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
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
