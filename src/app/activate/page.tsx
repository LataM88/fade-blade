'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Button from '@/app/components/ui/Button';

function ActivationContent() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!token) {
            setStatus('error');
            setMessage('No activation token provided.');
            return;
        }

        const activateAccount = async () => {
            try {
                const response = await fetch('/api/auth/activate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token }),
                });

                const data = await response.json();

                if (response.ok) {
                    setStatus('success');
                    setMessage('Your account has been successfully activated!');
                } else {
                    setStatus('error');
                    setMessage(data.message || 'Failed to activate account.');
                }
            } catch (error) {
                setStatus('error');
                setMessage('An error occurred during activation.');
            }
        };

        activateAccount();
    }, [token]);

    return (
        <div style={{ textAlign: 'center', color: 'white', padding: '40px' }}>
            {status === 'loading' && <h2>Activating your account...</h2>}
            {status === 'success' && (
                <>
                    <h2 style={{ color: '#FFB52B', marginBottom: '20px' }}>Activation Successful!</h2>
                    <p style={{ marginBottom: '30px' }}>{message}</p>
                    <Link href="/login">
                        <Button variant="sign-in">Go to Login</Button>
                    </Link>
                </>
            )}
            {status === 'error' && (
                <>
                    <h2 style={{ color: 'red', marginBottom: '20px' }}>Activation Failed</h2>
                    <p style={{ marginBottom: '30px' }}>{message}</p>
                    <Link href="/signup">
                        <Button variant="sign-up">Go to Signup</Button>
                    </Link>
                </>
            )}
        </div>
    );
}

export default function ActivatePage() {
    return (
        <section style={{ backgroundColor: '#1B1311', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Suspense fallback={<p style={{ color: 'white' }}>Loading...</p>}>
                <ActivationContent />
            </Suspense>
        </section>
    );
}
