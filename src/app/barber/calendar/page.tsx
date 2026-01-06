import Calendar from './Calendar';
import BarberSidebar from '@/app/components/layout/BarberSidebar/BarberSidebar';
import styles from './page.module.css';

export default function CalendarPage() {
    return (
        <div className={styles.container}>
            <BarberSidebar />
            <main className={styles.mainContent}>
                <Calendar />
            </main>
        </div>
    );
}
