import Link from 'next/link';
import Image from 'next/image';
import styles from './DashboardNavbar.module.css';

export default function DashboardNavbar() {
    return (
        <nav className={styles.navbar}>
            <div className={styles.logoContainer}>
                <Link href="/dashboard">
                    <Image src="/images/logo.svg" alt="Fade & Blade Logo" width={80} height={80} className={styles.logo} />
                </Link>
            </div>
            <div className={styles.navLinks}>
                <Link href="/dashboard" className={styles.activeLink}>
                    Dashboard
                </Link>
                <Link href="/dashboard/book" className={styles.navLink}>
                    Book Appointment
                </Link>
                <Link href="/dashboard/profile" className={styles.navLink}>
                    Profile
                </Link>
            </div>
        </nav>
    );
}
