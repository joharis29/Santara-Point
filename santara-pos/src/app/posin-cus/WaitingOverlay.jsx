import React, { useState, useEffect } from 'react';
import { Clock, ChefHat, CheckCircle2, ChevronRight, Receipt, XCircle } from 'lucide-react';

export default function WaitingOverlay({ isOpen, onClose, customerName, totalAmount, transactionId }) {
    // states: 'KONFIRMASI' -> 'DISIAPKAN' -> 'SELESAI'
    const [status, setStatus] = useState('KONFIRMASI');
    const [waitSeconds, setWaitSeconds] = useState(0);

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

        const poll = setInterval(() => {
            const history = JSON.parse(localStorage.getItem('santaraTransactionHistory') || '[]');
            const t = history.find(x => x.id === transactionId);
            if (t && t.status) {
                if (t.status === 'Menunggu') setStatus('KONFIRMASI');
                if (t.status === 'Diproses') setStatus('DISIAPKAN');
                if (t.status === 'Selesai') setStatus('SELESAI');
                if (t.status === 'Ditolak') setStatus('DITOLAK');
            }
        }, 1000); // Polling setiap 1 detik untuk live update mock DB

        return () => clearInterval(poll);
    }, [isOpen, transactionId]);

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
            <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl overflow-hidden flex flex-col">

                {/* Header Profile */}
                <div className="bg-slate-50 p-6 border-b border-slate-100 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-3">
                        <Receipt size={32} />
                    </div>
                    <h2 className="text-xl font-black text-slate-800">Pelacakan Pesanan</h2>
                    <p className="text-sm text-slate-500 font-medium">Bpk/Ibu {customerName}</p>
                    <p className="text-xs font-bold text-emerald-600 mt-1">Total tagihan: Rp {totalAmount?.toLocaleString('en-US')}</p>
                    {transactionId && (
                        <span className="mt-2 bg-white border border-slate-200 px-3 py-1 text-[10px] rounded-full font-mono text-slate-400">ID: {transactionId}</span>
                    )}
                </div>

                {/* Tracking Flow */}
                <div className="p-8 flex-1">
                    {status === 'DITOLAK' ? (
                        <div className="flex flex-col items-center justify-center h-full text-center py-4">
                            <div className="w-20 h-20 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-4">
                                <XCircle size={40} />
                            </div>
                            <h3 className="text-xl font-black text-slate-800 mb-2">Pesanan Ditolak</h3>
                            <p className="text-sm text-slate-500">Mohon maaf, pesanan Anda telah ditolak / dibatalkan oleh pihak toko. Silakan buat pesanan baru atau hubungi staf kasir.</p>
                        </div>
                    ) : (
                        <div className="relative border-l-2 border-slate-200 ml-4 space-y-10 py-2">

                            {/* Step 1: Konfirmasi */}
                            <div className="relative pl-8">
                                <div className={`absolute -left-[17px] top-1 w-8 h-8 rounded-full flex items-center justify-center border-4 border-white transition-colors duration-500 ${status === 'KONFIRMASI' ? 'bg-amber-500 shadow-lg shadow-amber-200' : 'bg-emerald-500'
                                    }`}>
                                    {status === 'KONFIRMASI' ? <Clock size={14} className="text-white" /> : <CheckCircle2 size={16} className="text-white" />}
                                </div>
                                <h3 className={`font-bold ${status === 'KONFIRMASI' ? 'text-amber-600' : 'text-slate-800'}`}>
                                    Menunggu Dapur Menerima
                                </h3>
                                <p className="text-xs text-slate-500 mt-1">Sistem kami terhubung langsung dengan layar dapur dan sedang menunggu pesanan ini disetujui staf.</p>
                            </div>

                            {/* Step 2: Dapur */}
                            <div className="relative pl-8">
                                <div className={`absolute -left-[17px] top-1 w-8 h-8 rounded-full flex items-center justify-center border-4 border-white transition-colors duration-500 ${status === 'KONFIRMASI' ? 'bg-slate-200' : status === 'DISIAPKAN' ? 'bg-blue-500 shadow-lg shadow-blue-200' : 'bg-emerald-500'
                                    }`}>
                                    {status === 'SELESAI' ? <CheckCircle2 size={16} className="text-white" /> : <ChefHat size={14} className={status === 'KONFIRMASI' ? 'text-slate-400' : 'text-white'} />}
                                </div>
                                <h3 className={`font-bold ${status === 'KONFIRMASI' ? 'text-slate-400' : status === 'DISIAPKAN' ? 'text-blue-600' : 'text-slate-800'}`}>
                                    Makanan Sedang Disiapkan
                                </h3>
                                <p className={`text-xs mt-1 ${status === 'KONFIRMASI' ? 'text-slate-300' : 'text-slate-500'}`}>
                                    Pesanan Anda sudah masuk di Papan Kanban Dapur! Koki kami sedang meracik pesanan Anda.
                                </p>
                            </div>

                            {/* Step 3: Selesai */}
                            <div className="relative pl-8">
                                <div className={`absolute -left-[17px] top-1 w-8 h-8 rounded-full flex items-center justify-center border-4 border-white transition-colors duration-500 ${status === 'SELESAI' ? 'bg-emerald-500 shadow-lg shadow-emerald-200' : 'bg-slate-200'
                                    }`}>
                                    <CheckCircle2 size={16} className={status === 'SELESAI' ? 'text-white' : 'text-slate-400'} />
                                </div>
                                <h3 className={`font-bold ${status === 'SELESAI' ? 'text-emerald-600 text-lg' : 'text-slate-400'}`}>
                                    Pesanan Siap Disajikan
                                </h3>
                                <p className={`text-xs mt-1 ${status === 'SELESAI' ? 'text-emerald-700/70' : 'text-slate-300'}`}>
                                    Pesanan telah ditandai Selesai oleh staf! Silakan ambil di kasir.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Controls */}
                <div className="p-6 bg-slate-50 border-t border-slate-100 flex flex-col gap-3">
                    {/* Waktu Menunggu visual */}
                    <div className="flex items-center justify-center mb-2 gap-2 text-xs text-slate-500 font-medium">
                        <Clock size={14} /> Waktu Menunggu: <span className="font-mono bg-white px-2 py-0.5 rounded border border-slate-200">{formatTime(waitSeconds)}</span>
                    </div>

                    <button
                        onClick={(status === 'SELESAI' || status === 'DITOLAK') ? onClose : undefined}
                        disabled={status !== 'SELESAI' && status !== 'DITOLAK'}
                        className={`w-full py-4 rounded-xl font-bold transition flex items-center justify-center gap-2 ${
                            status === 'SELESAI' ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-200' :
                            status === 'DITOLAK' ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-200' :
                            'bg-slate-200 text-slate-400 cursor-not-allowed'
                        }`}
                    >
                        {status === 'SELESAI' ? 'Tutup & Selesai' : status === 'DITOLAK' ? 'Pesanan Dibatalkan - Tutup' : 'Sedang Sinkronisasi dengan Dapur...'}
                        {(status === 'SELESAI' || status === 'DITOLAK') && <ChevronRight size={18} />}
                    </button>
                    {(status !== 'SELESAI' && status !== 'DITOLAK') && (
                        <p className="text-[9px] text-center text-slate-400 italic">Harap tunggu kasir mengklik Proses di layar Antreannya.</p>
                    )}
                </div>

            </div>
        </div>
    );
}
