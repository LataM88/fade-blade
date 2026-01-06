'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import styles from './DashboardNavbar.module.css';
import { createBrowserClient } from '@supabase/ssr';
import { LogOut } from 'lucide-react';

export default function DashboardNavbar() {
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const isActive = (path: string) => {
        if (path === '/dashboard') {
            return pathname === '/dashboard';
        }
        return pathname.startsWith(path);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/');
        router.refresh();
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
                <button
                    onClick={handleLogout}
                    className={styles.logoutBtn}
                    title="Log Out"
                >
                    <LogOut size={20} />
                </button>
            </div>
        </nav>
    );
}
