'use client';

import { useEffect, useState } from 'react';
import styles from './details.module.css';
import { useBooking } from '@/app/(client)/dashboard/book/BookingContext';
import Button from '@/app/components/ui/Button';
import Link from 'next/link';
import { supabase } from "@/lib/supabase/client";
import { format } from 'date-fns';

interface Service {
    id: number;
    name: string;
    description: string;
    price: number;
    duration: number;
}

interface Barber {
    id: string;
    first_name: string;
}

export default function DetailsPage() {
    const {
        serviceIds,
        barberId,
        date,
        time,
        userDetails,
        setUserDetails
    } = useBooking();

    const [services, setServices] = useState<Service[]>([]);
    const [barber, setBarber] = useState<Barber | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setUserDetails({ ...userDetails, [name]: value });
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserDetails({ ...userDetails, reminders: e.target.checked });
    };

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

    return (
        <section id="details">
            <div className={styles.content}>
                <div className={styles.formContainer}>
                    <h2 className={styles.detailsHeader}>Contact Details & Notes</h2>

                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>First name</label>
                            <input
                                type="text"
                                name="firstName"
                                value={userDetails.firstName}
                                onChange={handleInputChange}
                                className={styles.input}
                                placeholder=""
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Last name</label>
                            <input
                                type="text"
                                name="lastName"
                                value={userDetails.lastName}
                                onChange={handleInputChange}
                                className={styles.input}
                                placeholder=""
                            />
                        </div>
                    </div>

                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Phone number</label>
                            <input
                                type="tel"
                                name="phone"
                                value={userDetails.phone}
                                onChange={handleInputChange}
                                className={styles.input}
                                placeholder=""
                            />
                        </div>
                    </div>

                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Email addres</label>
                            <input
                                type="email"
                                name="email"
                                value={userDetails.email}
                                onChange={handleInputChange}
                                className={styles.input}
                                placeholder=""
                            />
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Additional note for barber</label>
                        <textarea
                            name="note"
                            value={userDetails.note}
                            onChange={handleInputChange}
                            className={`${styles.input} ${styles.textarea}`}
                            placeholder=""
                        />
                    </div>

                    <label className={styles.checkboxContainer}>
                        <input
                            type="checkbox"
                            name="reminders"
                            checked={userDetails.reminders}
                            onChange={handleCheckboxChange}
                            className={styles.checkbox}
                        />
                        <div className={styles.checkboxLabel}>
                            <span className={styles.checkboxTitle}>Send me appointment reminders</span>
                            <span className={styles.checkboxDesc}>Receive SMS and email reminders 24 hours before appointment</span>
                        </div>
                    </label>

                    <div className={styles.detailsBtnContainer}>
                        <Link href="/dashboard/book/date"><Button variant="back">Back</Button></Link>
                        <Link
                            href={!userDetails.firstName || !userDetails.lastName || !userDetails.phone || !userDetails.email ? '#' : "/dashboard/book/confirm"}
                            onClick={(e) => {
                                if (!userDetails.firstName || !userDetails.lastName || !userDetails.phone || !userDetails.email) {
                                    e.preventDefault();
                                    alert('Please fill in all required fields');
                                }
                            }}
                        >
                            <Button
                                variant="review"
                                disabled={!userDetails.firstName || !userDetails.lastName || !userDetails.phone || !userDetails.email}
                                style={{ opacity: (!userDetails.firstName || !userDetails.lastName || !userDetails.phone || !userDetails.email) ? 0.5 : 1 }}
                            >
                                Review booking
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className={styles.summaryContainer}>
                    <h3 className={styles.summaryHeader}>Booking Summary</h3>

                    <div className={styles.summaryRow}>
                        <div style={{ flex: 1 }}>
                            <div className={styles.summaryLabel}>Services</div>
                            {services.map(s => (
                                <div key={s.id} className={styles.serviceItem}>
                                    <span className={styles.summaryValue}>{s.name}</span>
                                    <span>{s.price}€</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={styles.summaryRow}>
                        <div>
                            <div className={styles.summaryLabel}>Stylist</div>
                            <div className={styles.summaryValue}>{barber?.first_name || 'Any Barber'}</div>
                        </div>
                    </div>

                    <div className={styles.summaryRow}>
                        <div>
                            <div className={styles.summaryLabel}>Date & Time</div>
                            <div className={styles.summaryValue}>
                                {date ? format(date, 'MMM d, yyyy') : 'No Date'}
                            </div>
                            <div className={styles.summaryValue}>{time || 'No Time'}</div>
                        </div>
                    </div>

                    <div className={styles.totalRow}>
                        <div>Total</div>
                        <div>{totalPrice}€</div>
                    </div>

                    <div className={styles.summaryRow} style={{ border: 'none', marginTop: '8px' }}>
                        <div className={styles.summaryLabel}>Duration: {totalDuration} min</div>
                    </div>
                </div>
            </div>
        </section>
    );
}
