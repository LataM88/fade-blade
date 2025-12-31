'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';

interface Client {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    last_visit: string;
}

export default function BarberClientsPage() {
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchClients = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data: appointments } = await supabase
                .from('appointments')
                .select(`
                    start_time,
                    user_id,
                    profiles:user_id (
                        id,
                        first_name,
                        last_name,
                        email,
                        phone
                    )
                `)
                .eq('barber_id', user.id)
                .order('start_time', { ascending: false });

            if (appointments) {
                const uniqueClientsMap = new Map();

                appointments.forEach((app: any) => {
                    const profile = Array.isArray(app.profiles) ? app.profiles[0] : app.profiles;
                    if (profile && !uniqueClientsMap.has(profile.id)) {
                        uniqueClientsMap.set(profile.id, {
                            ...profile,
                            last_visit: app.start_time
                        });
                    }
                });

                setClients(Array.from(uniqueClientsMap.values()));
            }
            setLoading(false);
        };

        fetchClients();
    }, []);

    if (loading) return <div style={{ padding: '2rem' }}>Loading clients...</div>;

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '2rem', color: '#d4af37' }}>My Clients</h1>

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                    <thead>
                        <tr style={{ background: '#252525', textAlign: 'left' }}>
                            <th style={{ padding: '1rem', borderBottom: '1px solid #333' }}>Name</th>
                            <th style={{ padding: '1rem', borderBottom: '1px solid #333' }}>Email</th>
                            <th style={{ padding: '1rem', borderBottom: '1px solid #333' }}>Phone</th>
                            <th style={{ padding: '1rem', borderBottom: '1px solid #333' }}>Last Visit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clients.map((client) => (
                            <tr key={client.id} style={{ borderBottom: '1px solid #333' }}>
                                <td style={{ padding: '1rem' }}>{client.first_name} {client.last_name}</td>
                                <td style={{ padding: '1rem', color: '#888' }}>{client.email}</td>
                                <td style={{ padding: '1rem', color: '#888' }}>{client.phone || '-'}</td>
                                <td style={{ padding: '1rem', color: '#888' }}>
                                    {new Date(client.last_visit).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
