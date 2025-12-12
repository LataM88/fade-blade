'use client'
import styles from "./signup.module.css";
import Button from "@/app/components/ui/Button";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema, SignUpFormData } from "@/lib/validations/auth";

export default function Signup() {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SignUpFormData>({
        resolver: zodResolver(signUpSchema),
    });

    const [globalError, setGlobalError] = useState('');
    const [success, setSuccess] = useState('');

    const onSubmit = async (data: SignUpFormData) => {
        setGlobalError('');
        setSuccess('');

        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: data.email,
            password: data.password,
        });

        if (authError) {
            setGlobalError(authError.message);
            return;
        }

        const userId = authData.user?.id;
        if (!userId) {
            setGlobalError("Nie udało się pobrać ID użytkownika");
            return;
        }

        const activationToken = crypto.randomUUID();
        const activationExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

        const { error: profileError } = await supabase.from('profiles').insert({
            id: userId,
            email: data.email,
            first_name: data.name,
            last_name: data.secondName,
            phone: data.phoneNumber,
            is_active: false,
            activation_token: activationToken,
            activation_expires_at: activationExpiresAt,
        });

        if (profileError) {
            console.error("Profile insert error:", profileError);
            setGlobalError(profileError.message);
            return;
        }

        try {
            const response = await fetch('/api/auth/send-activation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: data.name,
                    email: data.email,
                    token: activationToken,
                }),
            });

            if (!response.ok) {
                console.error("Failed to send activation email");
            }
        } catch (error) {
            console.error("Error sending activation email:", error);
        }

        setSuccess("Konto utworzone! Sprawdź email, aby aktywować konto.");
    };

    return (
        <section id="signup" className={styles.section}>
            <div className={styles.mainContainer}>
                <div className={styles.container}>
                    <h1>
                        Become Part of the <br />
                        <span className={styles.separator}>Fade&Blade</span>Crew</h1>
                    <p>Create your account and book your next cut in seconds</p>
                    <div className={styles.leftFormContainer}>
                        <form onSubmit={handleSubmit(onSubmit)} noValidate>
                            <p>Name</p>
                            <input type="text" {...register("name")} />
                            {errors.name && <p style={{ color: 'red', fontSize: '0.8rem', marginTop: '4px' }}>{errors.name.message}</p>}

                            <p>Second name</p>
                            <input type="text" {...register("secondName")} />
                            {errors.secondName && <p style={{ color: 'red', fontSize: '0.8rem', marginTop: '4px' }}>{errors.secondName.message}</p>}

                            <p>Email</p>
                            <input type="email" {...register("email")} />
                            {errors.email && <p style={{ color: 'red', fontSize: '0.8rem', marginTop: '4px' }}>{errors.email.message}</p>}

                            <p>Password</p>
                            <input type="password" {...register("password")} />
                            {errors.password && <p style={{ color: 'red', fontSize: '0.8rem', marginTop: '4px' }}>{errors.password.message}</p>}

                            <p>Phone number</p>
                            <input type="tel" {...register("phoneNumber")} />
                            {errors.phoneNumber && <p style={{ color: 'red', fontSize: '0.8rem', marginTop: '4px' }}>{errors.phoneNumber.message}</p>}

                            {globalError && <p style={{ color: 'red', marginTop: '10px' }}>{globalError}</p>}
                            {success && <p style={{ color: '#FFB52B', marginTop: '10px' }}>{success}</p>}

                            <div className={styles.leftFormButton}>
                                <Button
                                    variant="sign-up"
                                    type="submit"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'In Process...' : 'Sign Up'}
                                </Button>
                            </div>
                        </form>
                    </div>

                    <div className={styles.leftFormAlready}>
                        <p>
                            Already have an account? <span><Link href="/login">Sign In</Link></span>
                        </p>
                    </div>
                </div>
                <div className={styles.rightFormContainer}>
                    <img src="../images/about/about-photo1.jpg" alt="bg-signup" />
                    <img src="../images/about/about-photo2.jpg" alt="bg-signup" />
                </div>
            </div>
        </section>
    );
}