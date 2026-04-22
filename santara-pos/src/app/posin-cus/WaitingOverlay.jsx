"use client";

import React, { useState, useEffect } from 'react';
import { Clock, ChefHat, CheckCircle2, ChevronRight, Receipt, XCircle, Download } from 'lucide-react';
import { generateReceiptPDF } from '@/lib/receiptPdf';
import { supabase } from '@/lib/supabaseClient';

export default function WaitingOverlay({ isOpen, onClose, customerName, totalAmount, transactionId }) {
    // states: 'KONFIRMASI' -> 'DISIAPKAN' -> 'SELESAI'
    const [status, setStatus] = useState('KONFIRMASI');
    const [waitSeconds, setWaitSeconds] = useState(0);
    const [displayAmount, setDisplayAmount] = useState(totalAmount || 0);
    const [dbItems, setDbItems] = useState([]);

    // Stopwatch Visual
    useEffect(() => {
        if (!isOpen) {
            setWaitSeconds(0);
            return;
        }
        const timer = setInterval(() => setWaitSeconds(prev => prev + 1), 1000);
        return () => clearInterval(timer);
    }, [isOpen]);

    // DB Polling
    useEffect(() => {
        if (!isOpen || !transactionId) return;

        setStatus('KONFIRMASI'); // reset

        const poll = setInterval(async () => {
            try {
                // Priority 1: Supabase for cross-device sync
                const { data, error } = await supabase
                    .from('transactions')
                    .select('status, total_amount, items')
                    .eq('id', transactionId)
                    .single();

                if (error) throw error;

                if (data) {
                    if (data.status === 'Menunggu') setStatus('KONFIRMASI');
                    if (data.status === 'Diproses') setStatus('DISIAPKAN');
                    if (data.status === 'Selesai') setStatus('SELESAI');
                    if (data.status === 'Ditolak') setStatus('DITOLAK');

                    if (data.total_amount) setDisplayAmount(data.total_amount);
                    if (data.items) setDbItems(data.items);
                }
            } catch (err) {
                // Fallback to localstorage
                const history = JSON.parse(localStorage.getItem('santaraTransactionHistory') || '[]');
                const t = history.find(x => x.id === transactionId);
                if (t) {
                    if (t.status === 'Menunggu') setStatus('KONFIRMASI');
                    if (t.status === 'Diproses') setStatus('DISIAPKAN');
                    if (t.status === 'Selesai') setStatus('SELESAI');
                    if (t.status === 'Ditolak') setStatus('DITOLAK');

                    if (t.totalAmount || t.total_amount) setDisplayAmount(t.totalAmount || t.total_amount);
                }
            }
        }, 2000);

        return () => clearInterval(poll);
    }, [isOpen, transactionId]);

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xl transition-all duration-500">
            <div className="bg-white rounded-[2rem] w-full max-w-md shadow-[0_0_50px_-12px_rgba(0,0,0,0.25)] overflow-hidden flex flex-col max-h-[95vh]">
                <div className="overflow-y-auto flex-1 flex flex-col">
                    {/* Header Profile */}
                    <div className="bg-slate-50 p-6 border-b border-slate-100 flex flex-col items-center justify-center text-center sticky top-0 z-10 backdrop-blur-md bg-white/80">
                        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-3 shadow-inner">
                            <Receipt size={32} />
                        </div>
                        <h2 className="text-xl font-black text-slate-800">Pelacakan Pesanan</h2>
                        <p className="text-sm text-slate-500 font-medium">Bpk/Ibu {customerName}</p>
                        <div className="mt-2 bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-100">
                            <p className="text-xs font-black text-emerald-700">Total Tagihan: Rp {displayAmount?.toLocaleString('id-ID')}</p>
                        </div>
                        {transactionId && (
                            <span className="mt-2 bg-white border border-slate-200 px-3 py-1 text-[10px] rounded-full font-mono text-slate-400">ID: {transactionId}</span>
                        )}
                    </div>

                    {/* Tracking Flow */}
                    <div className="p-8">
                        {status === 'DITOLAK' ? (
                            <div className="flex flex-col items-center justify-center h-full text-center py-4">
                                <div className="w-20 h-20 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-4">
                                    <XCircle size={40} />
                                </div>
                                <h3 className="text-xl font-black text-slate-800 mb-2">Pesanan Ditolak</h3>
                                <p className="text-sm text-slate-500">Mohon maaf, pesanan Anda telah ditolak / dibatalkan oleh pihak toko. Silakan buat pesanan baru atau hubungi staf kasir.</p>
                            </div>
                        ) : status === 'SELESAI' ? (
                            <div className="flex flex-col items-center justify-center text-center py-6 animate-in zoom-in duration-500">
                                <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-emerald-100 ring-8 ring-emerald-50">
                                    <CheckCircle2 size={48} strokeWidth={3} />
                                </div>
                                <h3 className="text-2xl font-black text-slate-800 mb-2 tracking-tight">Pesanan Selesai!</h3>
                                <p className="text-sm text-slate-500 mb-6 font-medium">Hidangan Anda telah siap. Terima kasih telah memesan di Santara Point.</p>

                                <div className="w-full bg-slate-50 rounded-3xl p-6 border border-slate-100">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Pembayaran</p>
                                    <p className="text-3xl font-black text-emerald-600 tracking-tighter">Rp {displayAmount?.toLocaleString('id-ID')}</p>

                                    <div className="mt-4 pt-4 border-t border-slate-200 flex flex-col gap-2">
                                        {dbItems.map((item, idx) => (
                                            <div key={idx} className="flex justify-between text-xs font-bold text-slate-500">
                                                <span>{item.name} x{item.quantity}</span>
                                                <span>Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="relative border-l-2 border-slate-200 ml-4 space-y-10 py-2">
                                {/* Flow steps ... */}
                                {/* Step 1: Konfirmasi */}
                                <div className="relative pl-8">
                                    <div className={`absolute -left-[17px] top-1 w-8 h-8 rounded-full flex items-center justify-center border-4 border-white transition-colors duration-500 ${status === 'KONFIRMASI' ? 'bg-amber-500 shadow-lg shadow-amber-200' : 'bg-emerald-500'
                                        }`}>
                                        {status === 'KONFIRMASI' ? <Clock size={14} className="text-white" /> : <CheckCircle2 size={16} className="text-white" />}
                                    </div>
                                    <h3 className={`font-bold transition-all ${status === 'KONFIRMASI' ? 'text-amber-600' : 'text-slate-800'}`}>
                                        Menunggu Dapur Menerima
                                    </h3>
                                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">Sistem kami terhubung langsung dengan layar dapur dan sedang menunggu pesanan ini disetujui staf.</p>
                                </div>

                                {/* Step 2: Dapur */}
                                <div className="relative pl-8">
                                    <div className={`absolute -left-[17px] top-1 w-8 h-8 rounded-full flex items-center justify-center border-4 border-white transition-colors duration-500 ${status === 'KONFIRMASI' ? 'bg-slate-200' : status === 'DISIAPKAN' ? 'bg-blue-500 shadow-lg shadow-blue-200' : 'bg-emerald-500'
                                        }`}>
                                        {status === 'DISIAPKAN' ? <ChefHat size={14} className="text-white" /> : status === 'KONFIRMASI' ? <ChefHat size={14} className="text-slate-400" /> : <CheckCircle2 size={16} className="text-white" />}
                                    </div>
                                    <h3 className={`font-bold transition-all ${status === 'KONFIRMASI' ? 'text-slate-400' : status === 'DISIAPKAN' ? 'text-blue-600' : 'text-slate-800'}`}>
                                        Makanan Sedang Disiapkan
                                    </h3>
                                    <p className={`text-xs mt-1 leading-relaxed ${status === 'KONFIRMASI' ? 'text-slate-300' : 'text-slate-500'}`}>
                                        Pesanan Anda sudah masuk di Papan Kanban Dapur! Koki kami sedang meracik pesanan Anda.
                                    </p>
                                </div>

                                {/* Step 3: Selesai */}
                                <div className="relative pl-8">
                                    <div className={`absolute -left-[17px] top-1 w-8 h-8 rounded-full flex items-center justify-center border-4 border-white transition-colors duration-500 bg-slate-200`}>
                                        <CheckCircle2 size={16} className="text-slate-400" />
                                    </div>
                                    <h3 className={`font-bold transition-all text-slate-400`}>
                                        Pesanan Siap Disajikan
                                    </h3>
                                    <p className={`text-xs mt-1 leading-relaxed text-slate-300`}>
                                        Pesanan telah ditandai Selesai oleh staf! Mohon tunggu hidangan sampai di tempat tujuan Anda.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer Controls */}
                    <div className="p-6 bg-slate-50 border-t border-slate-100 flex flex-col gap-3 sticky bottom-0 z-10 backdrop-blur-md bg-slate-50/90">
                        {/* Waktu Menunggu visual */}
                        <div className="flex items-center justify-center mb-2 gap-2 text-xs text-slate-500 font-medium">
                            <Clock size={14} /> Waktu Menunggu: <span className="font-mono bg-white px-2 py-0.5 rounded border border-slate-200">{formatTime(waitSeconds)}</span>
                        </div>

                        <button
                            onClick={(status === 'SELESAI' || status === 'DITOLAK') ? onClose : undefined}
                            disabled={status !== 'SELESAI' && status !== 'DITOLAK'}
                            className={`w-full py-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 ${status === 'SELESAI' ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-200 active:scale-95' :
                                status === 'DITOLAK' ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-200 active:scale-95' :
                                    'bg-slate-200 text-slate-400 cursor-not-allowed'
                                }`}
                        >
                            {status === 'SELESAI' ? 'Tutup & Selesai' : status === 'DITOLAK' ? 'Pesanan Dibatalkan - Tutup' : 'Sedang Sinkronisasi dengan Dapur...'}
                            {(status === 'SELESAI' || status === 'DITOLAK') && <ChevronRight size={18} />}
                        </button>

                        {transactionId && (
                            <button
                                onClick={() => {
                                    try {
                                        const history = JSON.parse(localStorage.getItem('santaraTransactionHistory') || '[]');
                                        const t = history.find(x => x.id === transactionId);
                                        const settings = JSON.parse(localStorage.getItem('santaraStoreSettings') || '{}');
                                        if (t) {
                                            generateReceiptPDF(t, settings);
                                        } else {
                                            alert('Data transaksi tidak ditemukan di memori lokal.');
                                        }
                                    } catch (err) {
                                        console.error(err);
                                        alert('Gagal mendownload PDF: ' + err.message);
                                    }
                                }}
                                className="w-full py-3 rounded-xl font-bold bg-white border-2 border-emerald-500 text-emerald-600 transition-all hover:bg-emerald-50 flex items-center justify-center gap-2 active:scale-95"
                            >
                                <Download size={18} /> Unduh Struk (PDF)
                            </button>
                        )}

                        {(status !== 'SELESAI' && status !== 'DITOLAK') && (
                            <p className="text-[9px] text-center text-slate-400 italic">Harap tunggu kasir mengklik &quot;Selesai&quot; di layar kasir.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
