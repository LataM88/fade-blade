'use server'

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function getBarberAppointments(start: string, end: string) {
    const supabase = await createClient();
    const adminSupabase = await createAdminClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Not authenticated" };
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    if (!profile || (profile.role !== 'barber' && profile.role !== 'admin')) {
        return { error: "Unauthorized" };
    }

    const { data, error } = await adminSupabase
        .from('appointments')
        .select(`
            id,
            start_time,
            end_time,
            status,
            client_name,
            client_last_name,
            services:service_id (name, duration),
            profiles:profiles!appointments_user_id_fkey (first_name, last_name)
        `)
        .eq('barber_id', user.id)
        .gte('start_time', start)
        .lte('start_time', end)
        .neq('status', 'cancelled');

    if (error) {
        console.error("Error fetching appointments:", error);
        return { error: error.message };
    }

    return { data };
}
