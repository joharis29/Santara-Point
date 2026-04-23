"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

const OrderTrackingContext = createContext(null);


export function useOrderTracking() {
    return useContext(OrderTrackingContext);
}

export function OrderTrackingProvider({ children }) {
    const [activeTxId, setActiveTxId] = useState(null);

    // Sync with auth - Clear local tracking ID on logout
    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_OUT') {
                setActiveTxId(null);
                localStorage.removeItem('santaraActiveTxId');
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    // Initial sync
    useEffect(() => {
        const checkAuthAndSync = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            const storedId = localStorage.getItem('santaraActiveTxId');
            
            if (session && storedId) {
                setActiveTxId(storedId);
            } else if (!session) {
                setActiveTxId(null);
            }
        };
        checkAuthAndSync();
    }, []);

    function startTracking(id) {
        localStorage.setItem('santaraActiveTxId', id);
        setActiveTxId(id);
    }

    function stopTracking() {
        localStorage.removeItem('santaraActiveTxId');
        setActiveTxId(null);
    }

    return (
        <OrderTrackingContext.Provider value={{ activeTxId, startTracking, stopTracking }}>
            {children}
        </OrderTrackingContext.Provider>
    );
}

