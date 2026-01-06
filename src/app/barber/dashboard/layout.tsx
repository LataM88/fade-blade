import BarberSidebar from "@/app/components/layout/BarberSidebar/BarberSidebar";
import styles from './layout.module.css';

export default function BarberDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className={styles.container}>
            <BarberSidebar />
            <main className={styles.mainContent}>
                {children}
            </main>
        </div>
    );
}
