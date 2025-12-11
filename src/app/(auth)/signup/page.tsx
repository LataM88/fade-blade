'use client'
import styles from "./signup.module.css";
import Button from "@/app/components/ui/Button";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { useState } from "react";

export default function Signup() {
    const [name, setName] = useState('');
    const [secondName, setSecondName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignup = async () => {
        setError('');
        setSuccess('');
        setLoading(true);

        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
        });

        if (authError) {
            setLoading(false);
            setError(authError.message);
            return;
        }

        const userId = authData.user?.id;
        if (!userId) {
            setLoading(false);
            setError("Nie udało się pobrać ID użytkownika");
            return;
        }

        const { error: profileError } = await supabase.from('profiles').insert({
            id: userId,
            email: email,
            first_name: name,
            last_name: secondName,
            phone: phoneNumber,
        });

        if (profileError) {
            console.error("Profile insert error:", profileError);
            setLoading(false);
            setError(profileError.message);
            return;
        }

        setLoading(false);
        setSuccess("Konto zostało utworzone pomyślnie!");
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
                        <form onSubmit={(e) => { e.preventDefault(); handleSignup(); }}>
                            <p>Name</p>
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                            <p>Second name</p>
                            <input type="text" value={secondName} onChange={(e) => setSecondName(e.target.value)} />
                            <p>Email</p>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                            <p>Password</p>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                            <p>Phone number</p>
                            <input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />

                            {error && <p style={{ color: 'red' }}>{error}</p>}
                            {success && <p style={{ color: '#FFB52B' }}>{success}</p>}

                            <div className={styles.leftFormButton}>
                                <Button
                                    variant="sign-up"
                                    onClick={handleSignup}
                                    disabled={loading}
                                >
                                    {loading ? 'In Process...' : 'Sign Up'}
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