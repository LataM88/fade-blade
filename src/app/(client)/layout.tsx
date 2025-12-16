import DashboardNavbar from "../components/layout/DashboardNavbar/DashboardNavbar";

export default function ClientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <DashboardNavbar />
            {children}
        </>
    );
}
