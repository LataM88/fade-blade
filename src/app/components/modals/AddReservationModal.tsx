'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import styles from './Modal.module.css';
import { X } from 'lucide-react';

interface Props {
    onClose: () => void;
    onSuccess: () => void;
    barberId: string;
}

export default function AddReservationModal({ onClose, onSuccess, barberId }: Props) {
    const [step, setStep] = useState(1);
    const [phone, setPhone] = useState('');
    const [existingUser, setExistingUser] = useState<any>(null);
    const [newUser, setNewUser] = useState({ firstName: '', lastName: '', email: '' });
    const [services, setServices] = useState<any[]>([]);
    const [booking, setBooking] = useState({ serviceId: '', date: '', time: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchServices = async () => {
            const { data } = await supabase.from('services').select('*');
            if (data) setServices(data);
        };
        fetchServices();
    }, []);

    const checkUser = async () => {
        setLoading(true);
        setError('');
        setStep(2);
        setLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            let userId = existingUser?.id;

            const startTime = new Date(`${booking.date}T${booking.time}`);
            const service = services.find(s => s.id === booking.serviceId);
            const duration = service?.duration || 30;
            const endTime = new Date(startTime.getTime() + duration * 60000);

            if (!userId) {
                const response = await fetch('/api/barber/create-client', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        phone: phone,
                        firstName: newUser.firstName,
                        lastName: newUser.lastName,
                        existingEmail: newUser.email,
                        appointmentData: {
                            barber_id: barberId,
                            service_id: booking.serviceId,
                            start_time: startTime.toISOString(),
                            end_time: endTime.toISOString(),
                            status: 'confirmed',
                            notes: 'Telephone Reservation'
                        }
                    })
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || "Failed to create client/appointment");
                }

                userId = data.userId;
            } else {

            }

            onSuccess();
            onClose();

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <h3>Add Telephone Reservation</h3>
                    <button onClick={onClose}><X size={20} /></button>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    {step === 1 && (
                        <>
                            <div className={styles.field}>
                                <label>Client Phone</label>
                                <input
                                    type="text"
                                    value={phone}
                                    onChange={e => setPhone(e.target.value)}
                                    placeholder="123456789"
                                    required
                                />
                            </div>
                            <button type="button" onClick={checkUser} className={styles.submitBtn}>Next</button>
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <div className={styles.row}>
                                <div className={styles.field}>
                                    <label>First Name</label>
                                    <input
                                        type="text"
                                        value={newUser.firstName}
                                        onChange={e => setNewUser({ ...newUser, firstName: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className={styles.field}>
                                    <label>Last Name</label>
                                    <input
                                        type="text"
                                        value={newUser.lastName}
                                        onChange={e => setNewUser({ ...newUser, lastName: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div className={styles.field}>
                                <label>Email (Optional)</label>
                                <input
                                    type="email"
                                    value={newUser.email}
                                    onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                                    placeholder="For confirmation (optional)"
                                />
                            </div>

                            <div className={styles.field}>
                                <label>Service</label>
                                <select
                                    value={booking.serviceId}
                                    onChange={e => setBooking({ ...booking, serviceId: e.target.value })}
                                    required
                                >
                                    <option value="">Select Service</option>
                                    {services.map(s => (
                                        <option key={s.id} value={s.id}>{s.name} ({s.duration}m - ${s.price})</option>
                                    ))}
                                </select>
                            </div>

                            <div className={styles.row}>
                                <div className={styles.field}>
                                    <label>Date</label>
                                    <input
                                        type="date"
                                        value={booking.date}
                                        onChange={e => setBooking({ ...booking, date: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className={styles.field}>
                                    <label>Time</label>
                                    <input
                                        type="time"
                                        value={booking.time}
                                        onChange={e => setBooking({ ...booking, time: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            {error && <p className={styles.error}>{error}</p>}

                            <div className={styles.actions}>
                                <button type="button" onClick={() => setStep(1)} className={styles.backBtn}>Back</button>
                                <button type="submit" disabled={loading} className={styles.submitBtn}>
                                    {loading ? 'Booking...' : 'Confirm Book'}
                                </button>
                            </div>
                        </>
                    )}
                </form>
            </div>
        </div>
    );
}
