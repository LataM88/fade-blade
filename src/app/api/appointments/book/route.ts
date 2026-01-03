import { createAdminClient } from '@/lib/supabase/admin';
import { NextResponse } from 'next/server';
import { addMinutes, parseISO } from 'date-fns';

export async function POST(request: Request) {
    try {
        const { user_id, barber_id, service_ids, start_time, note } = await request.json();

        if (!user_id || !barber_id || !service_ids || !service_ids.length || !start_time) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const supabase = createAdminClient();

        // 1. Fetch Services to calculate duration
        const { data: services, error: serviceError } = await supabase
            .from('services')
            .select('*')
            .in('id', service_ids);

        if (serviceError || !services) {
            return NextResponse.json({ error: "Invalid services" }, { status: 400 });
        }

        // Reorder services to match input order if necessary, or just sum duration?
        // Usually we want to book them in order.
        // Let's create the timeline.

        let blockStartTime = parseISO(start_time);
        let currentStartTime = blockStartTime;
        let totalDuration = 0;

        const appointmentsToInsert = [];

        // We need to map service_ids to service objects in order
        for (const sId of service_ids) {
            const service = services.find(s => s.id === sId);
            if (!service) continue;

            const duration = service.duration;
            const endTime = addMinutes(currentStartTime, duration);

            appointmentsToInsert.push({
                user_id,
                barber_id,
                service_id: sId,
                start_time: currentStartTime.toISOString(),
                end_time: endTime.toISOString(),
                status: 'pending',
                notes: note || ''
            });

            currentStartTime = endTime;
            totalDuration += duration;
        }

        const blockEndTime = currentStartTime;

        // 2. OVERLAP CHECK
        // Check if ANY appointment exists in the total block range [start, end)
        // Overlap Logic: (StartA < EndB) AND (EndA > StartB)
        // We check for existing appointments (A) against our new block (B)

        const { data: conflicts, error: conflictError } = await supabase
            .from('appointments')
            .select('id')
            .eq('barber_id', barber_id)
            .neq('status', 'cancelled')
            .lt('start_time', blockEndTime.toISOString())
            .gt('end_time', blockStartTime.toISOString());

        if (conflictError) {
            throw conflictError;
        }

        if (conflicts && conflicts.length > 0) {
            return NextResponse.json({ error: "Selected time slot is no longer available." }, { status: 409 });
        }

        // 3. Insert Appointments
        // Ideally strict transaction, but Supabase API doesn't expose easy multi-table transactions via JS client comfortably without RPC.
        // We will insert specific items.

        const { error: insertError } = await supabase
            .from('appointments')
            .insert(appointmentsToInsert);

        if (insertError) {
            throw insertError;
        }

        return NextResponse.json({ success: true });

    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
