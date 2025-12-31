import { createAdminClient } from '@/lib/supabase/admin';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { phone, firstName, lastName, existingEmail, appointmentData } = await request.json();
        const supabase = createAdminClient();

        if (appointmentData) {
            const { data: service, error: serviceError } = await supabase
                .from('services')
                .select('duration')
                .eq('id', appointmentData.service_id)
                .single();

            if (serviceError || !service) {
                return NextResponse.json({ error: "Invalid Service for appointment" }, { status: 400 });
            }

            const startTime = new Date(appointmentData.start_time);
            const endTime = new Date(startTime.getTime() + service.duration * 60000);

            const { data: conflicts } = await supabase
                .from('appointments')
                .select('id')
                .eq('barber_id', appointmentData.barber_id)
                .neq('status', 'cancelled')
                .lt('start_time', endTime.toISOString())
                .gt('end_time', startTime.toISOString());

            if (conflicts && conflicts.length > 0) {
                return NextResponse.json({ error: "Termin jest już zajęty!" }, { status: 409 });
            }

            const { error: appointmentError } = await supabase
                .from('appointments')
                .insert({
                    ...appointmentData,
                    end_time: endTime.toISOString(),
                    user_id: null,
                    client_name: firstName,
                    client_last_name: lastName,
                    client_phone: phone,
                    client_email: existingEmail || null
                });

            if (appointmentError) {
                return NextResponse.json({ error: "Failed to create appointment: " + appointmentError.message }, { status: 500 });
            }
        } else {
            return NextResponse.json({ error: "Appointment data is required for telephone bookings." }, { status: 400 });
        }

        return NextResponse.json({ success: true });

    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
