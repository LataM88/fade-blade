'use client'
import styles from "./service.module.css";
import { supabase } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import Button from '@/app/components/ui/Button';
import Link from "next/link";

interface Service {
    id: number;
    name: string;
    description: string;
    price: number;
    duration: number;
}

export default function ServicePage() {
    const [services, setServices] = useState<Service[]>([]);
    const [selectedServices, setSelectedServices] = useState<Service[]>([]);

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

    const toggleService = (service: Service) => {
        setSelectedServices((prev) => {
            const exists = prev.find((s) => s.id === service.id);
            if (exists) {
                return prev.filter((s) => s.id !== service.id);
            } else {
                return [...prev, service];
            }
        });
    };

    const totalDuration = selectedServices.reduce((acc, curr) => acc + curr.duration, 0);
    const totalPrice = selectedServices.reduce((acc, curr) => acc + curr.price, 0);

    return (
        <div className={styles.servicesContainer}>
            <h2>Select Services</h2>
            <p>Choose one or more</p>
            <div className={styles.servicesGrid}>
                {services.map((service) => (
                    <div
                        key={service.id}
                        className={`${styles.services} ${selectedServices.find(s => s.id === service.id) ? styles.selected : ''}`}
                        onClick={() => toggleService(service)}
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
                <Link href="/dashboard/book/barber"><Button variant="next">Next</Button></Link>
            </div>
        </div>
    );
}
