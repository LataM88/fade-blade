import { createAdminClient } from '@/lib/supabase/admin';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const barberId = searchParams.get('barberId');
    const date = searchParams.get('date');

    if (!barberId || !date) {
        return NextResponse.json({ error: "Missing required params" }, { status: 400 });
    }

    try {
        const supabase = createAdminClient();

        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const { data, error } = await supabase
            .from('appointments')
            .select('start_time, end_time')
            .eq('barber_id', barberId)
            .neq('status', 'cancelled')
            .gte('start_time', startOfDay.toISOString())
            .lte('start_time', endOfDay.toISOString());

        if (error) throw error;

        return NextResponse.json(data || []);

    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
