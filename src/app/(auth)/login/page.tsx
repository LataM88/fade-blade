'use client'
import styles from "./login.module.css";
import Button from "@/app/components/ui/Button";
import Input from "@/app/components/ui/Input";
import { Facebook, Apple, Chrome } from 'lucide-react';
import Link from "next/link";
import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInSchema, SignInFormData } from "@/lib/validations/auth";

export default function Login() {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SignInFormData>({
        resolver: zodResolver(signInSchema),
    });

    const [globalError, setGlobalError] = useState('');

    const onSubmit = async (data: SignInFormData) => {
        setGlobalError('');

        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email: data.email,
            password: data.password,
        });

        if (authError) {
            setGlobalError(authError.message);
            return;
        }

        const userId = authData.user?.id;
        if (userId) {
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('is_active, role')
                .eq('id', userId)
                .single();

            if (profile) {
                if (profile.is_active === false) {
                    await supabase.auth.signOut();
                    setGlobalError('Your account is not activated. Please check your email.');
                    return;
                }

                if (profile.role === 'barber') {
                    router.push('/barber/dashboard');
                    return;
                }
            }
        }

        router.push('/dashboard');
    }

    return (
        <section id="login" className={styles.section}>
            <div className={styles.mainContainer}>
                <div className={styles.container}>
                    <div className={styles.leftImageContainer}>
                        <div className={styles.leftImageContainerUpper}></div>
                        <div className={styles.leftImageContainerLower}></div>
                    </div>
                    <div className={styles.rightContainer}>
                        <div className={styles.rightContainerContent}>
                            <h1>Sharper Looks Ahead <br />Sign In to <span className={styles.separator}>Fade&Blade</span></h1>
                            <p>Back for Another Clean Cut</p>
                        </div>
                        <div className={styles.rightFormContainer}>
                            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                                <Input
                                    label="Email"
                                    type="email"
                                    {...register("email")}
                                    error={errors.email?.message}
                                />

                                <Input
                                    label="Password"
                                    type="password"
                                    {...register("password")}
                                    error={errors.password?.message}
                                />

                                <div className={styles.rememberMeContainer}>
                                    <input type="checkbox" id="rememberMe" />
                                    <label htmlFor="rememberMe">Remember me</label>
                                </div>

                                <div className={styles.rightFormButton}>
                                    {globalError && <p style={{ color: 'red', marginBottom: '10px' }}>{globalError}</p>}
                                    <Button
                                        variant="sign-in"
                                        type="submit"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'In Process...' : 'Sign In'}
                                    </Button>
                                </div>
                                <div className={styles.rightFormOtherSign}>

                                </div>
                                <div className={styles.rightFormActions}>
                                    <div className={styles.rightFormActionsColumn}>
                                        <p>Don&apos;t have an account?</p>
                                        <Link href="signup" className={styles.yellowLink}>Sign Up</Link>
                                    </div>
                                    <div className={styles.rightFormActionsColumn}>
                                        <p>Forgot Password?</p>
                                        <Link href="reset-password" className={styles.yellowLink}>Reset your password</Link>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section >
    );
}