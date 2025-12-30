'use client';
import styles from './barber.module.css';
import { supabase } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import Button from '@/app/components/ui/Button';
import Link from "next/link";
import { useBooking } from '@/app/(client)/dashboard/book/BookingContext';

interface Barber {
    id: string;
    first_name: string;
}

export default function BarberPage() {
    const [barbers, setBarbers] = useState<Barber[]>([]);
    const [visitCounts, setVisitCounts] = useState<Record<string, number>>({});
    const { barberId, setBarberId } = useBooking();

    useEffect(() => {
        const fetchData = async () => {
            const { data: { user } } = await supabase.auth.getUser();

            const { data: barbersData, error: barbersError } = await supabase
                .from('profiles')
                .select('id, first_name')
                .eq('role', 'barber');

            if (barbersError) {
                console.error('Error fetching barbers:', barbersError);
            } else {
                setBarbers(barbersData || []);
            }

            if (user) {
                const now = new Date().toISOString();
                const { data: appointments, error: apptError } = await supabase
                    .from('appointments')
                    .select('barber_id')
                    .eq('user_id', user.id)
                    .lt('start_time', now);

                if (!apptError && appointments) {
                    const counts: Record<string, number> = {};
                    appointments.forEach((app: any) => {
                        if (app.barber_id) {
                            counts[app.barber_id] = (counts[app.barber_id] || 0) + 1;
                        }
                    });
                    setVisitCounts(counts);
                }
            }
        }
        fetchData();
    }, []);

    const handleSelect = (id: string) => {
        setBarberId(id === barberId ? null : id);
    };

    const getBarberImage = (name: string) => {
        if (!name) return "/images/barbers/barber-max.png";
        const n = name.toLowerCase();
        if (n.includes('max')) return "/images/barbers/barber-max.png";
        if (n.includes('kevin')) return "/images/barbers/barber-kevin.png";
        if (n.includes('jake')) return "/images/barbers/barber-jake.png";
        return "/images/barbers/barber-max.png";
    };

    return (
        <section id='barber'>
            <div className={styles.content}>
                <h2>Select Barber</h2>
                <div className={styles.barbersCard}>
                    {barbers.map((barber) => (
                        <div
                            key={barber.id}
                            className={`${styles.barberCard} ${barberId === barber.id ? styles.selected : ''}`}
                            onClick={() => handleSelect(barber.id)}
                        >
                            <div className={styles.barberCardPhoto}>
                                <img
                                    src={getBarberImage(barber.first_name)}
                                    alt={barber.first_name}
                                />
                            </div>
                            <div className={styles.barberCardInfo}>
                                <h3>{barber.first_name}</h3>
                                <p>Master Barber</p>
                                <p>⭐ 4.9</p>
                                <p>{visitCounts[barber.id] || 0} visits with you</p>
                                <Link href={`/barber/${barber.first_name.toLowerCase()}`} onClick={(e) => e.stopPropagation()}>
                                    <Button variant="portfolio">Portfolio</Button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
                <div className={styles.btnContainer}>
                    <p>Total: 60min - 35€</p>
                    <div className={styles.btnContainers}>
                        <Link href="/dashboard/book/service"><Button variant="back">Back</Button></Link>
                        <Link
                            href={!barberId ? '#' : "/dashboard/book/date"}
                            onClick={(e) => {
                                if (!barberId) e.preventDefault();
                            }}
                        >
                            <Button
                                variant="next"
                                disabled={!barberId}
                                style={{ opacity: !barberId ? 0.5 : 1 }}
                            >
                                Next
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
