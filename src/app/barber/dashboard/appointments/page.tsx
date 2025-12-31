'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import Button from '@/app/components/ui/Button';

interface Appointment {
    id: string;
    start_time: string;
    status: string;
    client_name?: string;
    client_last_name?: string;
    client_phone?: string;
    client_email?: string;
    profiles: {
        first_name: string;
        last_name: string;
    } | null;
    services: {
        name: string;
        price: number;
        duration: number;
    } | null;
}



export default function BarberAppointmentsPage() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    const fetchAppointments = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        try {
            const res = await fetch(`/api/barber/appointments?barberId=${user.id}`);
            if (!res.ok) throw new Error("Failed to fetch");

            const data = await res.json();

            let formattedAppointments: Appointment[] = [];

            if (data) {
                formattedAppointments = (data as any[]).map(app => ({
                    id: app.id,
                    start_time: app.start_time,
                    status: app.status,
                    client_name: app.client_name,
                    client_last_name: app.client_last_name,
                    client_phone: app.client_phone,
                    client_email: app.client_email,
                    profiles: Array.isArray(app.profiles) ? app.profiles[0] : app.profiles,
                    services: Array.isArray(app.services) ? app.services[0] : app.services
                }));

                if (filter !== 'all') {
                    formattedAppointments = formattedAppointments.filter(app => app.status === filter);
                }

                formattedAppointments.sort((a, b) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime());

                setAppointments(formattedAppointments);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, [filter]);

    const updateStatus = async (id: string, newStatus: string) => {
        await supabase
            .from('appointments')
            .update({ status: newStatus })
            .eq('id', id);

        setAppointments(appointments.map(app =>
            app.id === id ? { ...app, status: newStatus } : app
        ));
    };

    if (loading) return <div style={{ padding: '2rem' }}>Loading appointments...</div>;

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', color: '#d4af37' }}>Appointments</h1>
                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    style={{ padding: '0.5rem', borderRadius: '4px', background: '#333', color: '#fff', border: '1px solid #555' }}
                >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {appointments.map((app) => (
                    <div key={app.id} style={{
                        background: '#252525',
                        padding: '1.5rem',
                        borderRadius: '8px',
                        border: '1px solid #333'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <div>
                                <p style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#fff' }}>
                                    {new Date(app.start_time).toLocaleDateString()} at {new Date(app.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                                <p style={{ color: '#aaa', marginTop: '0.25rem' }}>
                                    Client: {app.profiles
                                        ? `${app.profiles.first_name} ${app.profiles.last_name}`
                                        : (app.client_name || app.client_last_name)
                                            ? `${app.client_name || ''} ${app.client_last_name || ''}`
                                            : 'Unknown Client'}
                                </p>
                                <p style={{ color: '#aaa' }}>
                                    Service: {app.services?.name} (${app.services?.price}) - {app.services?.duration} min
                                </p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <span style={{
                                    padding: '0.4rem 1rem',
                                    borderRadius: '20px',
                                    fontSize: '0.9rem',
                                    background:
                                        app.status === 'confirmed' ? 'rgba(76, 175, 80, 0.2)' :
                                            app.status === 'cancelled' ? 'rgba(244, 67, 54, 0.2)' :
                                                app.status === 'completed' ? 'rgba(33, 150, 243, 0.2)' :
                                                    'rgba(212, 175, 55, 0.2)',
                                    color:
                                        app.status === 'confirmed' ? '#4CAF50' :
                                            app.status === 'cancelled' ? '#f44336' :
                                                app.status === 'completed' ? '#2196F3' :
                                                    '#d4af37',
                                    border: `1px solid ${app.status === 'confirmed' ? '#4CAF50' :
                                        app.status === 'cancelled' ? '#f44336' :
                                            app.status === 'completed' ? '#2196F3' :
                                                '#d4af37'
                                        }`
                                }}>
                                    {app.status.toUpperCase()}
                                </span>
                            </div>
                        </div>

                        {app.status === 'pending' && (
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #333' }}>
                                <button
                                    onClick={() => updateStatus(app.id, 'confirmed')}
                                    style={{
                                        padding: '0.5rem 1.5rem',
                                        background: '#4CAF50',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    Confirm
                                </button>
                                <button
                                    onClick={() => updateStatus(app.id, 'rejected')}
                                    style={{
                                        padding: '0.5rem 1.5rem',
                                        background: 'transparent',
                                        color: '#f44336',
                                        border: '1px solid #f44336',
                                        borderRadius: '4px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Reject
                                </button>
                            </div>
                        )}

                        {app.status === 'confirmed' && (
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #333' }}>
                                <button
                                    onClick={() => updateStatus(app.id, 'completed')}
                                    style={{
                                        padding: '0.5rem 1.5rem',
                                        background: '#2196F3',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    Mark Completed
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
