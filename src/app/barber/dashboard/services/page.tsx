'use client';

import { useEffect, useState } from 'react';
import styles from './services.module.css';
import { Pencil, Trash2, ToggleRight } from 'lucide-react';
import EditPriceModal from '@/app/components/modals/EditPriceModal';

interface Service {
    id: number;
    name: string;
    duration: number;
    price: number;
}

export default function ServicesPage() {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingService, setEditingService] = useState<Service | null>(null);

    const fetchServices = async () => {
        try {
            const res = await fetch('/api/barber/services');
            if (res.ok) {
                const data = await res.json();
                setServices(data);
            }
        } catch (error) {
            console.error("Failed to fetch services", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    const handleEditClick = (service: Service) => {
        setEditingService(service);
    };

    const handleSavePrice = async (newPrice: number) => {
        if (!editingService) return;

        try {
            const res = await fetch(`/api/barber/services?id=${editingService.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ price: newPrice })
            });

            if (!res.ok) throw new Error("Failed to update");

            setServices(prev => prev.map(s =>
                s.id === editingService.id ? { ...s, price: newPrice } : s
            ));
            setEditingService(null);
        } catch (error) {
            console.error("Update error:", error);
            alert("Failed to update price");
        }
    };

    if (loading) return <div className={styles.container}>Loading services...</div>;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Service Management</h1>
                    <p className={styles.subtitle}>Manage services and pricing</p>
                </div>
            </div>

            <div className={styles.tableContainer}>
                <div className={styles.tableHeaderRow}>
                    <span>Service name</span>
                    <span>Duration</span>
                    <span>Price</span>
                    <span>Available barbers</span>
                    <span>Status</span>
                    <span>Actions</span>
                </div>

                {services.map(service => (
                    <div key={service.id} className={styles.tableRow}>
                        <span className={styles.serviceName}>{service.name}</span>
                        <span>{service.duration} min</span>
                        <span>{service.price}€</span>
                        <div className={styles.barberList}>
                            <span>Max</span>
                            <span>Kevin</span>
                            <span>Jake</span>
                        </div>
                        <div className={styles.statusActive}>
                            <ToggleRight size={24} className={styles.toggleIcon} />
                            Active
                        </div>
                        <div className={styles.actions}>
                            <button
                                className={`${styles.iconBtn} ${styles.editBtn}`}
                                onClick={() => handleEditClick(service)}
                                title="Edit Price"
                            >
                                <Pencil size={18} />
                            </button>
                            <button className={`${styles.iconBtn} ${styles.deleteBtn}`} title="Delete (Disabled)">
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {editingService && (
                <EditPriceModal
                    service={editingService}
                    onClose={() => setEditingService(null)}
                    onSave={handleSavePrice}
                />
            )}
        </div>
    );
}
