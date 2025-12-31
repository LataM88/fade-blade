import Calendar from './Calendar';
import BarberSidebar from '@/app/components/layout/BarberSidebar/BarberSidebar';

export default function CalendarPage() {
    return (
        <div style={{ width: '100%', minHeight: '100vh', backgroundColor: 'var(--brown-secondary)' }}>
            <BarberSidebar />
            <div style={{ marginLeft: '250px', padding: '20px', minHeight: '100vh' }}>
                <Calendar />
            </div>
        </div>
    );
}
