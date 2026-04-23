"use client";

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { 
    Home, 
    ShoppingBag, 
    Heart, 
    Clock, 
    Settings 
} from 'lucide-react';

export default function CustomerBottomNav({ onOpenSettings }) {
    const router = useRouter();
    const pathname = usePathname();

    const navItems = [
        { icon: <Home size={20} />, label: "Beranda", href: "/" },
        { icon: <ShoppingBag size={20} />, label: "Menu", href: "/posin-cus" },
        { icon: <Heart size={20} />, label: "Favorit", href: "/favorites" },
        { icon: <Clock size={20} />, label: "Riwayat", href: "/customer-history" },
        { icon: <Settings size={20} />, label: "Pengaturan", action: onOpenSettings },
    ];

    function isActive(item) {
        if (item.action) return false;
        return pathname === item.href;
    }

    return (
        <nav className="lg:hidden fixed bottom-6 left-6 right-6 bg-slate-900/90 backdrop-blur-xl border border-white/10 px-6 py-4 flex justify-between items-center z-[100] rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
            {navItems.map((item, idx) => (
                <button
                    key={idx}
                    onClick={() => {
                        if (item.action) {
                            item.action();
                        } else {
                            router.push(item.href);
                        }
                    }}
                    className={`flex flex-col items-center gap-1 transition-all active:scale-90 ${isActive(item) ? 'text-emerald-400' : 'text-slate-400 hover:text-white'}`}
                >
                    <div className={`${isActive(item) ? 'scale-110' : ''} transition-transform`}>
                        {item.icon}
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-widest">{item.label}</span>
                </button>
            ))}
        </nav>
    );
}

