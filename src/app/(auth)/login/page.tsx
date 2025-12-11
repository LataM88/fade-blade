'use client'
import styles from "./login.module.css";
import Button from "@/app/components/ui/Button";
import { Facebook, Apple, Chrome } from 'lucide-react';
import Link from "next/link";
import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setError('');
        setLoading(true);

        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (authError) {
            setLoading(false);
            setError(authError.message);
            return;
        }

        setLoading(false);
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
                            <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
                                <p>Email</p>
                                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                                <p>Password</p>
                                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

                                <div className={styles.rememberMeContainer}>
                                    <input type="checkbox" id="rememberMe" />
                                    <label htmlFor="rememberMe">Remember me</label>
                                </div>

                                <div className={styles.rightFormButton}>
                                    {error && <p style={{ color: 'red' }}>{error}</p>}
                                    <Button
                                        variant="sign-in"
                                        onClick={handleLogin}
                                        disabled={loading}
                                    >
                                        Sign In
                                    </Button>
                                </div>
                                <div className={styles.rightFormOtherSign}>
                                    <p>Or sign in with</p>
                                    <div className={styles.rightFormSocials}>
                                        <Facebook size={50} />
                                        <Apple size={50} />
                                        <Chrome size={50} />
                                    </div>
                                </div>
                                <div className={styles.rightFormActions}>
                                    <div className={styles.rightFormActionsColumn}>
                                        <p>Don't have an account?</p>
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