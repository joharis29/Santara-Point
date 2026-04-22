"use client";
import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

// Versi Ultra-Stable untuk debugging initialization error
export default function LoginPage() {
    return (
        <Suspense fallback={
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyCenter: 'center', backgroundColor: '#064e3b', color: 'white' }}>
                <p>Memuat Halaman Login...</p>
            </div>
        }>
            <LoginContentBody />
        </Suspense>
    );
}

function LoginContentBody() {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        // Cek parameter pesan sukses dari registrasi atau reset password
        const msg = searchParams.get('message');
        if (msg === 'confirmed') {
            alert('Selamat! Akun Anda telah terkonfirmasi. Silakan masuk.');
            router.replace('/login');
        }
    }, [searchParams, router]);

    async function handleLogin(e) {
        e.preventDefault();
        if (isSubmitting) return;

        if (!email || !password) {
            alert('Silakan masukkan email dan kata sandi.');
            return;
        }

        setIsSubmitting(true);
        try {
            const { data: { user }, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) {
                alert(`Gagal Masuk: ${error.message}`);
                setIsSubmitting(false);
                return;
            }

            // Penentuan Role
            let role = 'Customer';
            if (email.toLowerCase() === 'santarapoint@gmail.com') {
                role = 'Administrator';
            } else {
                const storedSettings = localStorage.getItem('santaraStoreSettings');
                if (storedSettings) {
                    const settings = JSON.parse(storedSettings);
                    const authorizedUser = settings.authorizedUsers?.find(u => u.contact === email);
                    if (authorizedUser) role = authorizedUser.role;
                }
            }

            // Simpan data ke localStorage
            const meta = user.user_metadata || {};
            localStorage.setItem('currentUserRole', role);
            localStorage.setItem('registeredEmail', email);
            localStorage.setItem('customerName', `${meta.first_name || ''} ${meta.last_name || ''}`.trim() || 'Sobat Santara');

            // Redirect
            if (role === 'Administrator') router.push('/posin-adm');
            else if (role === 'Operator') router.push('/posin-cas');
            else router.push('/posin-cus');

        } catch (err) {
            console.error("Login Error:", err);
            alert("Terjadi kesalahan sistem.");
            setIsSubmitting(false);
        }
    }

    return (
        <div style={{ 
            minHeight: '100vh', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            padding: '20px',
            backgroundColor: '#064e3b',
            backgroundImage: "url('/bg-food.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative'
        }}>
            <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(6, 78, 59, 0.7)', backdropFilter: 'blur(4px)' }}></div>
            
            <div style={{ 
                position: 'relative', 
                zIndex: 10, 
                maxWidth: '400px', 
                width: '100%', 
                backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                borderRadius: '20px', 
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                overflow: 'hidden'
            }}>
                <div style={{ backgroundColor: '#047857', padding: '40px 20px', textAlign: 'center', color: 'white' }}>
                    <div style={{ backgroundColor: 'white', padding: '10px', borderRadius: '50%', display: 'inline-block', marginBottom: '15px' }}>
                        <img src="/santara-logo.png" alt="Logo" style={{ width: '60px', height: '60px', objectFit: 'contain' }} />
                    </div>
                    <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 'bold' }}>MASUK</h1>
                    <p style={{ fontSize: '10px', opacity: 0.7, marginTop: '5px' }}>V2.0.1 - STABLE DEPLOY</p>
                </div>

                <div style={{ padding: '30px' }}>
                    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#374151' }}>Email</label>
                            <input 
                                type="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #d1d5db', outline: 'none', fontWeight: 'bold' }}
                                placeholder="nama@email.com"
                                required
                            />
                        </div>

                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>Kata Sandi</label>
                                <button type="button" onClick={() => router.push('/forgot-password')} style={{ fontSize: '12px', color: '#059669', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Lupa Sandi?</button>
                            </div>
                            <div style={{ position: 'relative' }}>
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #d1d5db', outline: 'none', fontWeight: 'bold' }}
                                    placeholder="••••••••"
                                    required
                                />
                                <button 
                                    type="button" 
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'none', cursor: 'pointer', color: '#9ca3af', fontWeight: 'bold' }}
                                >
                                    {showPassword ? 'HIDUP' : 'LIHAT'}
                                </button>
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={isSubmitting}
                            style={{ 
                                width: '100%', 
                                padding: '14px', 
                                borderRadius: '10px', 
                                border: 'none', 
                                backgroundColor: '#059669', 
                                color: 'white', 
                                fontWeight: 'bold', 
                                fontSize: '16px', 
                                cursor: 'pointer',
                                marginTop: '10px',
                                opacity: isSubmitting ? 0.7 : 1
                            }}
                        >
                            {isSubmitting ? 'Memproses...' : 'Masuk Sekarang'}
                        </button>
                    </form>

                    <div style={{ marginTop: '25px', textAlign: 'center', fontSize: '14px', color: '#6b7280' }}>
                        Belum punya akun? <button onClick={() => router.push('/register')} style={{ color: '#059669', fontWeight: 'bold', border: 'none', background: 'none', cursor: 'pointer' }}>Daftar Disini</button>
                    </div>
                </div>
            </div>
        </div>
    );
}