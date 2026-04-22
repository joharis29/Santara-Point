"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

const OrderTrackingContext = createContext();

export const useOrderTracking = () => useContext(OrderTrackingContext);

export const OrderTrackingProvider = ({ children }) => {
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

    const startTracking = (id) => {
        localStorage.setItem('santaraActiveTxId', id);
        setActiveTxId(id);
    };

    const stopTracking = () => {
        localStorage.removeItem('santaraActiveTxId');
        setActiveTxId(null);
    };

    return (
        <OrderTrackingContext.Provider value={{ activeTxId, startTracking, stopTracking }}>
            {children}
        </OrderTrackingContext.Provider>
    );
};
