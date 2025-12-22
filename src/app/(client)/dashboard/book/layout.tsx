'use client';

import styles from './layout.module.css';
import { usePathname } from 'next/navigation';

export default function BookLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const isActive = (path: string) => pathname?.includes(path);

    const steps = [
        { num: 1, label: 'Service', path: 'service' },
        { num: 2, label: 'Stylist', path: 'barber' },
        { num: 3, label: 'Date & Time', path: 'date' },
        { num: 4, label: 'Details', path: 'details' },
        { num: 5, label: 'Confirm', path: 'review' },
    ];

    return (
        <section className={styles.section}>
            <div className={styles.mainContainer}>
                <div className={styles.container}>
                    <h2 className={styles.header}>Book an Appointment</h2>
                    <div className={styles.stepsContainer}>
                        {steps.map((step) => (
                            <div
                                key={step.num}
                                className={`${styles.stepItem} ${isActive(step.path) ? styles.active : ''}`}
                            >
                                <div className={styles.stepNumber}>
                                    {step.num}
                                </div>
                                <span>{step.label}</span>
                            </div>
                        ))}
                    </div>
                    {children}
                </div>
            </div>
        </section>
    );
}
