'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import styles from './DashboardNavbar.module.css';

export default function DashboardNavbar() {
    const pathname = usePathname();

    const isActive = (path: string) => {
        if (path === '/dashboard') {
            return pathname === '/dashboard';
        }
        return pathname.startsWith(path);
    };

    return (
        <nav className={styles.navbar}>
            <div className={styles.logoContainer}>
                <Link href="/dashboard">
                    <Image src="/images/logo.svg" alt="Fade & Blade Logo" width={80} height={80} className={styles.logo} />
                </Link>
            </div>
            <div className={styles.navLinks}>
                <Link
                    href="/dashboard"
                    className={isActive('/dashboard') ? styles.activeLink : styles.navLink}
                >
                    Dashboard
                </Link>
                <Link
                    href="/dashboard/book"
                    className={isActive('/dashboard/book') ? styles.activeLink : styles.bookBtn}
                >
                    Book Appointment
                </Link>
                <Link
                    href="/dashboard/profile"
                    className={isActive('/dashboard/profile') ? styles.activeLink : styles.navLink}
                >
                    Profile
                </Link>
            </div>
        </nav>
    );
}
