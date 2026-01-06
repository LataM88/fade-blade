import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const adminSupabase = createAdminClient();

        const { data: allProfiles, error: profilesError } = await adminSupabase
            .from('profiles')
            .select('id, first_name, last_name, email, phone, role')
            .neq('role', 'barber');

        if (profilesError) throw profilesError;

        const { data: appointments, error: appointmentsError } = await adminSupabase
            .from('appointments')
            .select('user_id, start_time')
            .eq('barber_id', user.id)
            .order('start_time', { ascending: false });

        if (appointmentsError) throw appointmentsError;

        const clientsMap = new Map();

        allProfiles?.forEach(profile => {
            clientsMap.set(profile.id, {
                ...profile,
                last_visit: null
            });
        });

        if (appointments) {
            appointments.forEach((app: any) => {
                if (clientsMap.has(app.user_id)) {
                    const client = clientsMap.get(app.user_id);
                    if (!client.last_visit) {
                        client.last_visit = app.start_time;
                    }
                }
            });
        }

        return NextResponse.json(Array.from(clientsMap.values()));

    } catch (error) {
        console.error('Error fetching clients:', error);
        return NextResponse.json({ error: 'Failed to fetch clients' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const clientId = searchParams.get('id');

    if (!clientId) {
        return NextResponse.json({ error: 'Client ID is required' }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const adminSupabase = createAdminClient();

    try {
        const { error: appError } = await adminSupabase
            .from('appointments')
            .delete()
            .eq('user_id', clientId);

        if (appError) throw appError;

        const { error: profileError } = await adminSupabase
            .from('profiles')
            .delete()
            .eq('id', clientId);

        if (profileError) throw profileError;

        const { error: authError } = await adminSupabase.auth.admin.deleteUser(clientId);

        if (authError) {
            console.warn("Could not delete auth user (profile deleted):", authError);
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting client:', error);
        return NextResponse.json({ error: 'Failed to delete client' }, { status: 500 });
    }
}
