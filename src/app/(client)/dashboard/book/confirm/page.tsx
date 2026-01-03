'use client';

import { useEffect, useState } from 'react';
import styles from './confirm.module.css';
import { useBooking } from '@/app/(client)/dashboard/book/BookingContext';
import Button from '@/app/components/ui/Button';
import Link from 'next/link';
import { supabase } from "@/lib/supabase/client";
import { format, addMinutes, parse } from 'date-fns';

interface Service {
    id: number;
    name: string;
    price: number;
    duration: number;
}

interface Barber {
    id: string;
    first_name: string;
}

export default function ConfirmPage() {
    const {
        serviceIds,
        barberId,
        date,
        time,
        userDetails
    } = useBooking();

    const [services, setServices] = useState<Service[]>([]);
    const [barber, setBarber] = useState<Barber | null>(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const fetchDetails = async () => {
            if (serviceIds.length > 0) {
                const { data: servicesData } = await supabase
                    .from('services')
                    .select('*')
                    .in('id', serviceIds);
                if (servicesData) setServices(servicesData);
            }

            if (barberId) {
                const { data: barberData } = await supabase
                    .from('profiles')
                    .select('id, first_name')
                    .eq('id', barberId)
                    .single();
                if (barberData) setBarber(barberData);
            }
        };

        fetchDetails();
    }, [serviceIds, barberId]);

    const totalPrice = services.reduce((acc, curr) => acc + curr.price, 0);
    const totalDuration = services.reduce((acc, curr) => acc + curr.duration, 0);

    const handleConfirm = async () => {
        if (!date || !time || !barberId) return;
        setLoading(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("No user logged in");

            const currentStartTime = parse(time, 'h:mm a', date);

            const res = await fetch('/api/appointments/book', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: user.id,
                    barber_id: barberId,
                    service_ids: serviceIds,
                    start_time: currentStartTime.toISOString(),
                    note: userDetails.note
                })
            });

            const data = await res.json();

            if (!res.ok) {
                if (res.status === 409) {
                    alert("Ten termin został właśnie zajęty. Proszę wybrać inny.");
                    return;
                }
                throw new Error(data.error || "Booking failed");
            }

            setSuccess(true);
        } catch (error: any) {
            console.error('Booking failed:', error);
            alert(error.message || 'Booking failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className={styles.content} style={{ flexDirection: 'column', alignItems: 'center', textAlign: 'center', color: 'white' }}>
                <div className={styles.successMessage}>
                    <h2>Booking Received!</h2>
                    <p>Your appointment is pending confirmation by the barber.</p>
                </div>
                <Link href="/dashboard"><Button variant="book-appointment">Go to Dashboard</Button></Link>
            </div>
        );
    }

    return (
        <section id="confirm">
            <div className={styles.content}>
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <div className={styles.barberInfo}>
                            <div className={styles.photoWrapper}>
                                <img
                                    src={`/images/barbers/barber-${barber?.first_name.toLowerCase()}.png`}
                                    alt={barber?.first_name}
                                    width={64}
                                    height={64}
                                    onError={(e) => (e.currentTarget.src = '/images/barbers/barber-max.png')}
                                />
                            </div>
                            <div className={styles.barberDetails}>
                                <h2>{barber?.first_name || 'Barber'}</h2>
                                <p>Barber</p>
                            </div>
                        </div>
                        <div className={styles.dateTime}>
                            <span className={styles.date}>{date ? format(date, 'MMM d, yyyy') : ''}</span>
                            <span className={styles.time}>{time}</span>
                        </div>
                    </div>

                    <div className={styles.cardBody}>
                        <div className={styles.servicesList}>
                            <h4 style={{ marginBottom: '12px', color: '#aaa', fontSize: '14px' }}>Services</h4>
                            {services.map(s => (
                                <div key={s.id} className={styles.serviceItem}>
                                    <span>{s.name}</span>
                                    <span className={styles.price}>{s.price}€</span>
                                </div>
                            ))}
                            <div style={{ marginTop: '8px', fontSize: '14px', color: '#aaa' }}>
                                {totalDuration} min
                            </div>
                        </div>

                        <div className={styles.totalRow}>
                            <span>Total</span>
                            <span>{totalPrice}€</span>
                        </div>

                        <div className={styles.contactInfo}>
                            <div className={styles.userContact}>
                                <h4>Contact information</h4>
                                <p>{userDetails.firstName} {userDetails.lastName}</p>
                                <p>{userDetails.phone}</p>
                                <p>{userDetails.email}</p>
                            </div>
                            <div className={styles.salonLocation}>
                                <h4>Salon location</h4>
                                <p>Warszawa, Drawska 99</p>
                                <p>+48 111 222 333</p>
                                <p>fdbarber@gmail.com</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.btnContainer} style={{ maxWidth: '600px', margin: '0 auto', width: '100%', marginTop: '32px' }}>
                <Link href="/dashboard/book/details"><Button variant="back">Back</Button></Link>
                <Button variant="confirm" onClick={handleConfirm} disabled={loading}>
                    {loading ? 'Booking...' : 'Confirm booking'}
                </Button>
            </div>
        </section>
    );
}
