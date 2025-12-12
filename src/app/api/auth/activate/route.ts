import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { token } = body;

        if (!token) {
            return NextResponse.json(
                { message: 'Token is required' },
                { status: 400 }
            );
        }

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !supabaseServiceRoleKey) {
            console.error("Missing Supabase environment variables");
            return NextResponse.json(
                { message: 'Server configuration error' },
                { status: 500 }
            );
        }

        const supabaseAdmin = createClient(
            supabaseUrl,
            supabaseServiceRoleKey,
            {
                auth: {
                    autoRefreshToken: false,
                    persistSession: false,
                },
            }
        );

        const { data: profile, error: fetchError } = await supabaseAdmin
            .from('profiles')
            .select('id, activation_expires_at')
            .eq('activation_token', token)
            .single();

        if (fetchError || !profile) {
            return NextResponse.json(
                { message: 'Invalid or expired activation token' },
                { status: 400 }
            );
        }

        if (new Date(profile.activation_expires_at) < new Date()) {
            return NextResponse.json(
                { message: 'Activation token has expired' },
                { status: 400 }
            );
        }

        const { error: updateError } = await supabaseAdmin
            .from('profiles')
            .update({
                is_active: true,
                activation_token: null,
            })
            .eq('id', profile.id);

        if (updateError) {
            console.error("Activation update error:", updateError);
            return NextResponse.json(
                { message: 'Failed to activate account' },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { message: 'Account activated successfully' },
            { status: 200 }
        );

    } catch (error) {
        console.error("Activation error:", error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}
