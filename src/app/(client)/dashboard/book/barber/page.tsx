'use client';
import styles from './barber.module.css';
import { supabase } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import Button from '@/app/components/ui/Button';
import Link from "next/link";

interface Barber {
    id: string;
    first_name: string;
}

export default function BarberPage() {
    const [barbers, setBarbers] = useState<Barber[]>([]);
    const [selectedBarber, setSelectedBarber] = useState<string | null>(null);

    useEffect(() => {
        const fetchBarbers = async () => {
            const { data, error } = await supabase
                .from('profiles')
                .select('id, first_name')
                .eq('role', 'barber');
            if (error) {
                console.error('Error fetching barbers:', error);
            } else {
                setBarbers(data || []);
            }
        }
        fetchBarbers();
    }, []);

    const handleSelect = (id: string) => {
        setSelectedBarber(id === selectedBarber ? null : id);
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
                            className={`${styles.barberCard} ${selectedBarber === barber.id ? styles.selected : ''}`}
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
                                <p>30 visits with you</p>
                                <Button variant="portfolio">Portfolio</Button>
                            </div>
                        </div>
                    ))}
                </div>
                <div className={styles.btnContainer}>
                    <p>Total: 60min - 35€</p>
                    <div className={styles.btnContainers}>
                        <Link href="/dashboard/book/service"><Button variant="back">Back</Button></Link>
                        <Link href="/dashboard/book/date"><Button variant="next">Next</Button></Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
