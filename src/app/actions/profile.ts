'use server'

import { createClient } from "@/lib/supabase/server";
import { z } from "zod";
import { phoneValidation, passwordValidation } from "@/lib/validations/auth";

const profileSchema = z.object({
    phone: phoneValidation,
});

const passwordSchema = z.object({
    password: passwordValidation,
});

export async function updateProfile(prevState: any, formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Not authenticated" };
    }

    const rawData = {
        phone: formData.get('phone') as string,
    };

    const validatedFields = profileSchema.safeParse(rawData);

    if (!validatedFields.success) {
        return { error: validatedFields.error.flatten().fieldErrors.phone?.[0] || "Invalid input" };
    }

    const { error } = await supabase
        .from('profiles')
        .update({ phone: validatedFields.data.phone })
        .eq('id', user.id);

    if (error) {
        return { error: error.message };
    }

    return { success: "Profile updated successfully" };
}

export async function updatePassword(prevState: any, formData: FormData) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { error: "Not authenticated" };
    }

    const rawData = {
        password: formData.get('password') as string,
    };

    const validatedFields = passwordSchema.safeParse(rawData);

    if (!validatedFields.success) {
        return { error: validatedFields.error.flatten().fieldErrors.password?.[0] || "Invalid password" };
    }

    const { error } = await supabase.auth.updateUser({
        password: validatedFields.data.password
    });

    if (error) {
        return { error: error.message };
    }

    return { success: "Password updated successfully" };
}
