"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import WaitingOverlay from '@/app/posin-cus/WaitingOverlay';
import { Clock, ChevronRight } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

const OrderTrackingContext = createContext();

export const useOrderTracking = () => useContext(OrderTrackingContext);

export const OrderTrackingProvider = ({ children }) => {
    const [activeTxId, setActiveTxId] = useState(null);
    const [isOverlayOpen, setIsOverlayOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [txData, setTxData] = useState({ customerName: '', totalAmount: 0 });

    // Listen to Auth State - Clear tracking on logout
    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_OUT') {
                setActiveTxId(null);
                setIsOverlayOpen(false);
                setIsMinimized(false);
                localStorage.removeItem('santaraActiveTxId');
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    // Sync with localStorage
    useEffect(() => {
        const checkAuthAndSync = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            const storedId = localStorage.getItem('santaraActiveTxId');
            
            if (session && storedId) {
                setActiveTxId(storedId);
                setIsMinimized(true);
            } else if (!session) {
                // If no session, make sure tracking is cleared
                setActiveTxId(null);
                setIsMinimized(false);
            }
        };

        checkAuthAndSync();

        // Listen for changes (e.g., from other pages or same page)
        const handleStorage = () => {
            const newId = localStorage.getItem('santaraActiveTxId');
            if (newId !== activeTxId) {
                setActiveTxId(newId);
                if (newId) setIsMinimized(true);
            }
        };

        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, [activeTxId]);

    const startTracking = (id, customerName, totalAmount) => {
        localStorage.setItem('santaraActiveTxId', id);
        setActiveTxId(id);
        setTxData({ customerName, totalAmount });
        setIsOverlayOpen(true);
        setIsMinimized(false);
    };

    const stopTracking = () => {
        localStorage.removeItem('santaraActiveTxId');
        setActiveTxId(null);
        setIsOverlayOpen(false);
        setIsMinimized(false);
    };

    return (
        <OrderTrackingContext.Provider value={{ activeTxId, startTracking, stopTracking, setIsOverlayOpen, setIsMinimized }}>
            {children}
            
            {/* Global Waiting Overlay */}
            {activeTxId && (
                <WaitingOverlay 
                    isOpen={isOverlayOpen}
                    onClose={() => {
                        setIsOverlayOpen(false);
                        setIsMinimized(true);
                    }}
                    transactionId={activeTxId}
                    customerName={txData.customerName}
                    totalAmount={txData.totalAmount}
                    // Add a prop to tell WaitingOverlay to NOT stop tracking on close, 
                    // but just hide the modal.
                    isGlobal={true} 
                />
            )}

            {/* Minimized Floating Tracker */}
            {activeTxId && isMinimized && !isOverlayOpen && (
                <div 
                    onClick={() => setIsOverlayOpen(true)}
                    className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[60] w-[90%] max-w-xs bg-emerald-600 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center justify-between cursor-pointer animate-in slide-in-from-bottom-10 duration-500 hover:bg-emerald-700 active:scale-95 transition-all border border-white/20 backdrop-blur-md"
                >
                    <div className="flex items-center gap-3">
                        <div className="bg-white/20 p-2 rounded-xl animate-pulse">
                            <Clock size={18} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-80 leading-none">Pesanan Diproses</p>
                            <p className="text-xs font-bold truncate max-w-[120px]">ID: {activeTxId}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1 font-black text-[10px] uppercase tracking-widest">
                        Pantau <ChevronRight size={14} />
                    </div>
                </div>
            )}
        </OrderTrackingContext.Provider>
    );
};
