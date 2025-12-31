'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import styles from './Modal.module.css';
import { X } from 'lucide-react';

interface Props {
    onClose: () => void;
    barberId: string;
}

export default function TomorrowScheduleModal({ onClose, barberId }: Props) {
    const [appointments, setAppointments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTomorrow = async () => {
            try {
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                tomorrow.setHours(0, 0, 0, 0);

                const dayAfter = new Date(tomorrow);
                dayAfter.setHours(23, 59, 59, 999);

                const params = new URLSearchParams({
                    barberId,
                    start: tomorrow.toISOString(),
                    end: dayAfter.toISOString()
                });

                const res = await fetch(`/api/barber/appointments?${params}`);
                if (!res.ok) throw new Error("Failed to fetch");

                const data = await res.json();

                if (data) {
                    setAppointments(data);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchTomorrow();
    }, [barberId]);

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <h3>Tomorrow's Schedule</h3>
                    <button onClick={onClose}><X size={20} /></button>
                </div>

                <div className={styles.content}>
                    {loading ? (
                        <p>Loading...</p>
                    ) : appointments.length === 0 ? (
                        <p style={{ color: '#888' }}>No appointments scheduled for tomorrow.</p>
                    ) : (
                        <div className={styles.list}>
                            {appointments.map((app: any) => (
                                <div key={app.id} className={styles.item}>
                                    <span className={styles.time}>
                                        {new Date(app.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                    <div className={styles.details}>
                                        <p className={styles.name}>
                                            {app.profiles
                                                ? `${app.profiles.first_name} ${app.profiles.last_name}`
                                                : (app.client_name || app.client_last_name)
                                                    ? `${app.client_name || ''} ${app.client_last_name || ''}`
                                                    : 'Unknown Client'}
                                        </p>
                                        <p className={styles.service}>{app.services?.name}</p>
                                    </div>
                                    <span className={styles.status} data-status={app.status}>{app.status}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
