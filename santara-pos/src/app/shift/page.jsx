"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Store, Clock, User, CheckCircle2 } from 'lucide-react';

export default function ShiftPage() {
    const router = useRouter();
    const [activeShift, setActiveShift] = useState('');

    const shiftSchedules = [
        { id: 1, name: 'Zaid', shift: 'Pagi', time: '08:00 - 15:00', role: 'Kasir Utama' },
        { id: 2, name: 'Budi', shift: 'Siang', time: '15:00 - 22:00', role: 'Kasir Utama' },
        { id: 3, name: 'Siti', shift: 'Pagi', time: '08:00 - 15:00', role: 'Kasir Cadangan' },
        { id: 4, name: 'Andi', shift: 'Siang', time: '15:00 - 22:00', role: 'Kasir Cadangan' }
    ];

    useEffect(() => {
        const stored = localStorage.getItem('activeCashierShift');
        if (stored) {
            setActiveShift(stored);
        } else {
            setActiveShift('Pagi (Zaid)');
        }
    }, []);

    const handleClockIn = (name, shift) => {
        const newShiftStr = `${shift} (${name})`;
        setActiveShift(newShiftStr);
        localStorage.setItem('activeCashierShift', newShiftStr);
    };

    return (
        <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
            {/* Sidebar Navigasi */}
            <aside className="w-20 lg:w-24 bg-slate-900 flex flex-col items-center py-8 gap-10 shadow-2xl z-20 relative">
                <div className="bg-emerald-500 p-3 rounded-2xl shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                    <Store className="text-white" size={24} />
                </div>

                <nav className="flex-1 flex flex-col gap-6">
                    <button 
                        onClick={() => router.push('/posin-cas')}
                        className="p-4 text-emerald-400 hover:text-white hover:bg-slate-800 rounded-2xl transition-all shadow-sm"
                        title="Kembali"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <button className="p-4 bg-emerald-500/20 text-emerald-400 rounded-2xl transition-all shadow-sm border border-emerald-500/30" title="Manajemen Shift">
                        <Clock size={24} />
                    </button>
                </nav>
            </aside>

            {/* Konten Utama */}
            <main className="flex-1 flex flex-col overflow-hidden relative">
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#10b981 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
                
                <header className="px-8 py-8 lg:px-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 relative z-10 border-b border-slate-200/50 bg-white shadow-sm">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                                <User size={12} /> Akses Karyawan
                            </span>
                        </div>
                        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Sistem Shift Kasir</h1>
                    </div>
                </header>

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
            </main>
        </div>
    );
}
