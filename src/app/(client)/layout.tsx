import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import DashboardNavbar from "../components/layout/DashboardNavbar/DashboardNavbar";

export default async function ClientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        if (profile?.role === 'barber' || profile?.role === 'admin') {
            redirect('/barber/dashboard');
        }
    }

    return (
        <>
            <DashboardNavbar />
            {children}
        </>
    );
}
