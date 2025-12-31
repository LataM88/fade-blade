'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import styles from './BarberSidebar.module.css';
import { LayoutDashboard, Calendar, CalendarDays, Scissors, Users, Settings, LogOut } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';

export default function BarberSidebar() {
    const pathname = usePathname();
    const router = useRouter();

    const isActive = (path: string) => pathname === path;

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/login');
    };

    return (
        <aside className={styles.sidebar}>
            <div className={styles.header}>
                <Image src="/images/logo.svg" alt="Logo" width={40} height={40} />
                <div>
                    <h1 className={styles.logoName}>Fade&Blade</h1>
                    <p className={styles.logoSub}>Admin panel</p>
                </div>
            </div>

            <nav className={styles.nav}>
                <Link href="/barber/dashboard" className={`${styles.navItem} ${isActive('/barber/dashboard') ? styles.active : ''}`}>
                    <LayoutDashboard className={styles.navIcon} />
                    Dashboard
                </Link>
                <Link href="/barber/dashboard/calendar" className={`${styles.navItem} ${isActive('/barber/dashboard/calendar') ? styles.active : ''}`}>
                    <Calendar className={styles.navIcon} />
                    Calendar
                </Link>
                <Link href="/barber/dashboard/appointments" className={`${styles.navItem} ${isActive('/barber/dashboard/appointments') ? styles.active : ''}`}>
                    <CalendarDays className={styles.navIcon} />
                    Appointments
                </Link>
                <Link href="/barber/dashboard/services" className={`${styles.navItem} ${isActive('/barber/dashboard/services') ? styles.active : ''}`}>
                    <Scissors className={styles.navIcon} />
                    Services
                </Link>
                <Link href="/barber/dashboard/clients" className={`${styles.navItem} ${isActive('/barber/dashboard/clients') ? styles.active : ''}`}>
                    <Users className={styles.navIcon} />
                    Clients
                </Link>
                <Link href="/barber/dashboard/settings" className={`${styles.navItem} ${isActive('/barber/dashboard/settings') ? styles.active : ''}`}>
                    <Settings className={styles.navIcon} />
                    Settings
                </Link>
            </nav>

            <div className={styles.logoutContainer}>
                <button onClick={handleLogout} className={styles.logoutBtn}>
                    <LogOut size={20} />
                    Logout
                </button>
            </div>
        </aside>
    );
}
