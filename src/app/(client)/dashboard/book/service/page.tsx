'use client'
import styles from "./service.module.css";
import { supabase } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import Button from '@/app/components/ui/Button';
import Link from "next/link";
import { useBooking } from '@/app/(client)/dashboard/book/BookingContext';

interface Service {
    id: number;
    name: string;
    description: string;
    price: number;
    duration: number;
}

export default function ServicePage() {
    const [services, setServices] = useState<Service[]>([]);
    const { serviceIds, setServiceIds } = useBooking();

    useEffect(() => {
        const fetchServices = async () => {
            const { data, error } = await supabase.from('services').select('*');
            if (error) {
                console.error('Error fetching services:', error);
            } else {
                setServices(data || []);
            }
        };
        fetchServices();
    }, []);

    const toggleService = (id: number) => {
        const idStr = id.toString();
        setServiceIds(
            serviceIds.includes(idStr)
                ? serviceIds.filter(s => s !== idStr)
                : [...serviceIds, idStr]
        );
    };

    const selectedServicesList = services.filter(s => serviceIds.includes(s.id.toString()));
    const totalDuration = selectedServicesList.reduce((acc, curr) => acc + curr.duration, 0);
    const totalPrice = selectedServicesList.reduce((acc, curr) => acc + curr.price, 0);

    return (
        <div className={styles.servicesContainer}>
            <h2>Select Services</h2>
            <p>Choose one or more</p>
            <div className={styles.servicesGrid}>
                {services.map((service) => (
                    <div
                        key={service.id}
                        className={`${styles.services} ${serviceIds.includes(service.id.toString()) ? styles.selected : ''}`}
                        onClick={() => toggleService(service.id)}
                    >
                        <div className={styles.serviceContentWrapper}>
                            <div className={styles.servicePhoto}>
                                <img src="../../images/service/service-logo-white.svg" alt="service" width={38} height={28} />
                            </div>
                            <div className={styles.serviceInfo}>
                                <h3>{service.name}</h3>
                                <p>{service.description}</p>
                            </div>
                        </div>
                        <div className={styles.serviceMeta}>
                            <span className={styles.duration}>{service.duration}min</span>
                            <span className={styles.price}>{service.price}€</span>
                        </div>
                    </div>
                ))}
            </div>
            <div className={styles.btnContainer}>
                <p>Total: {totalDuration}min - {totalPrice}€</p>
                <Link
                    href={serviceIds.length === 0 ? '#' : "/dashboard/book/barber"}
                    onClick={(e) => {
                        if (serviceIds.length === 0) e.preventDefault();
                    }}
                >
                    <Button
                        variant="next"
                        disabled={serviceIds.length === 0}
                        style={{ opacity: serviceIds.length === 0 ? 0.5 : 1 }}
                    >
                        Next
                    </Button>
                </Link>
            </div>
        </div>
    );
}
