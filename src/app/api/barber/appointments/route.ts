import { createAdminClient } from '@/lib/supabase/admin';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const barberId = searchParams.get('barberId');
        const start = searchParams.get('start');
        const end = searchParams.get('end');

        if (!barberId) {
            return NextResponse.json({ error: 'Barber ID required' }, { status: 400 });
        }

        const supabase = createAdminClient();

        let query = supabase
            .from('appointments')
            .select(`
                id,
                start_time,
                end_time,
                status,
                user_id,
                client_name,
                client_last_name,
                client_phone,
                client_email,
                profiles:user_id (first_name, last_name, email),
                services:service_id (name, price, duration)
            `)
            .eq('barber_id', barberId)
            .order('start_time', { ascending: true });

        if (start) query = query.gte('start_time', start);
        if (end) query = query.lte('start_time', end);

        const { data, error } = await query;

        if (error) throw error;

        return NextResponse.json(data);

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Appointment ID required' }, { status: 400 });
        }

        const supabase = createAdminClient();
        const { error } = await supabase.from('appointments').delete().eq('id', id);

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        const body = await request.json();

        if (!id) {
            return NextResponse.json({ error: 'Appointment ID required' }, { status: 400 });
        }

        const supabase = createAdminClient();
        const { error } = await supabase
            .from('appointments')
            .update(body)
            .eq('id', id);

        if (error) throw error;

        return NextResponse.json({ success: true });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
