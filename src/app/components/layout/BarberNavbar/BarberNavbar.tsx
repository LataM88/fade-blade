'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import styles from './BarberNavbar.module.css';

export default function BarberNavbar() {
    const pathname = usePathname();

    const isActive = (path: string) => {
        if (path === '/barber/dashboard') {
            return pathname === '/barber/dashboard';
        }
        return pathname.startsWith(path);
    };

    return (
        <nav className={styles.navbar}>
            <div className={styles.logoContainer}>
                <Link href="/barber/dashboard">
                    <Image src="/images/logo.svg" alt="Fade & Blade Logo" width={80} height={80} className={styles.logo} />
                </Link>
            </div>
            <div className={styles.navLinks}>
                <Link
                    href="/barber/dashboard"
                    className={isActive('/barber/dashboard') ? styles.activeLink : styles.navLink}
                >
                    Dashboard
                </Link>
                <Link
                    href="/barber/dashboard/clients"
                    className={isActive('/barber/dashboard/clients') ? styles.activeLink : styles.navLink}
                >
                    Clients
                </Link>
                <Link
                    href="/barber/dashboard/appointments"
                    className={isActive('/barber/dashboard/appointments') ? styles.activeLink : styles.navLink}
                >
                    Appointments
                </Link>
            </div>
        </nav>
    );
}
