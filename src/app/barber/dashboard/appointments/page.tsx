'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import styles from './appointments.module.css';
import { Trash2, ChevronRight, Check } from 'lucide-react';
import ConfirmationModal from '@/app/components/modals/ConfirmationModal';
import Link from 'next/link';

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
        email: string;
        phone_number?: string;
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
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<string | null>(null);

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


                formattedAppointments.sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());

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
    }, []);

    const handleDeleteClick = (id: string) => {
        setItemToDelete(id);
        setShowConfirmModal(true);
    };

    const confirmDelete = async () => {
        if (!itemToDelete) return;

        try {
            const res = await fetch(`/api/barber/appointments?id=${itemToDelete}`, { method: 'DELETE' });
            if (!res.ok) throw new Error("Failed to delete");

            setAppointments(prev => prev.filter(app => app.id !== itemToDelete));
            setShowConfirmModal(false);
            setItemToDelete(null);
        } catch (error) {
            console.error("Delete error:", error);
            alert("Failed to delete appointment");
        }
    };

    const handleConfirm = async (id: string) => {
        try {
            const res = await fetch(`/api/barber/appointments?id=${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'confirmed' })
            });

            if (!res.ok) throw new Error("Failed to confirm");

            setAppointments(prev => prev.map(app =>
                app.id === id ? { ...app, status: 'confirmed' } : app
            ));
        } catch (error) {
            console.error("Confirm error:", error);
            alert("Failed to confirm appointment");
        }
    };

    const filteredAppointments = appointments.filter(app => {
        const now = new Date();
        const appDate = new Date(app.start_time);

        if (filter === 'all') {
            return appDate >= now;
        }

        if (filter === 'completed') {
            return app.status === 'completed' || (app.status === 'confirmed' && appDate < now);
        }

        if (filter === 'cancelled') {
            return app.status === 'cancelled';
        }

        if (filter === 'confirmed') {
            return app.status === 'confirmed' && appDate >= now;
        }

        return app.status === filter && appDate >= now;
    });

    const getStatusClass = (status: string) => {
        switch (status) {
            case 'confirmed': return styles.statusConfirmed;
            case 'cancelled': return styles.statusCancelled;
            case 'pending': return styles.statusPending;
            default: return '';
        }
    };

    const formatDateTime = (dateStr: string) => {
        const date = new Date(dateStr);
        return {
            date: date.toLocaleDateString(),
            time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
    };

    if (loading) return <div className={styles.container}>Loading appointments...</div>;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.topRow}>
                    <div>
                        <h1 className={styles.title}>All Appointments</h1>
                        <p className={styles.subtitle}>Manage and track all bookings</p>
                    </div>
                    <Link href="/barber/calendar" className={styles.viewNext}>
                        View next weeks <ChevronRight size={16} />
                    </Link>
                </div>
            </div>

            <div className={styles.tabs}>
                {['all', 'pending', 'confirmed', 'cancelled', 'completed'].map((f) => (
                    <button
                        key={f}
                        className={`${styles.tab} ${filter === f ? styles.activeTab : ''}`}
                        onClick={() => setFilter(f)}
                    >
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                ))}
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Date&Time</th>
                            <th>Client</th>
                            <th>Service</th>
                            <th>Status</th>
                            <th>Duration</th>
                            <th>Price</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAppointments.map((app) => {
                            const { date, time } = formatDateTime(app.start_time);
                            const clientName = app.profiles
                                ? `${app.profiles.first_name} ${app.profiles.last_name}`
                                : (app.client_name || app.client_last_name)
                                    ? `${app.client_name || ''} ${app.client_last_name || ''}`.trim()
                                    : 'Unknown';

                            const clientContact = app.profiles?.phone_number || app.client_phone || app.profiles?.email || app.client_email || 'No contact info';

                            return (
                                <tr key={app.id}>
                                    <td>
                                        <div style={{ fontWeight: 'bold' }}>{date}</div>
                                        <div style={{ color: 'var(--text-white-75)', fontSize: '0.9rem' }}>{time}</div>
                                    </td>
                                    <td className={styles.clientCell}>
                                        <span className={styles.clientName}>{clientName}</span>
                                        <span className={styles.clientContact}>{clientContact}</span>
                                    </td>
                                    <td>{app.services?.name || '-'}</td>
                                    <td>
                                        <span className={`${styles.statusBadge} ${getStatusClass(app.status)}`}>
                                            {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                                        </span>
                                    </td>
                                    <td>{app.services?.duration ? `${app.services.duration} min` : '-'}</td>
                                    <td>{app.services?.price ? `${app.services.price}€` : '-'}</td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            {app.status === 'pending' && (
                                                <button
                                                    className={styles.confirmBtn}
                                                    onClick={() => handleConfirm(app.id)}
                                                    title="Confirm Appointment"
                                                >
                                                    <Check size={18} />
                                                </button>
                                            )}
                                            <button
                                                className={styles.deleteBtn}
                                                onClick={() => handleDeleteClick(app.id)}
                                                title="Delete Appointment"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                        {filteredAppointments.length === 0 && (
                            <tr>
                                <td colSpan={7} style={{ textAlign: 'center', color: '#888' }}>
                                    No appointments found for this filter.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {showConfirmModal && (
                <ConfirmationModal
                    onClose={() => setShowConfirmModal(false)}
                    onConfirm={confirmDelete}
                    title="Delete Appointment"
                    message="Are you sure you want to delete this appointment? This action cannot be undone."
                />
            )}
        </div>
    );
}
