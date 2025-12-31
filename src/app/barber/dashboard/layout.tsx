import BarberSidebar from "@/app/components/layout/BarberSidebar/BarberSidebar";

export default function BarberDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div style={{ display: 'flex' }}>
            <BarberSidebar />
            <main style={{
                flex: 1,
                marginLeft: '250px',
                minHeight: '100vh',
                backgroundColor: '#121212',
                color: '#fff'
            }}>
                {children}
            </main>
        </div>
    );
}
