'use client'
import styles from "./dashboard.module.css";
import { supabase } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

export default function Dashboard() {
    const [name, setName] = useState('');

    useEffect(() => {
        async function fetchData() {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;

                const { data: profile, error } = await supabase
                    .from('profiles')
                    .select('first_name')
                    .eq('id', user.id)
                    .single();

                if (error) {
                    console.error('Error fetching profile:', error);
                    return;
                }

                if (profile) {
                    setName(profile.first_name || 'Guest');
                }
            } catch (error) {
                console.error('Unexpected error:', error);
            }
        }
        fetchData();
    }, []);

    return (
        <section id="dashboard" className={styles.section}>
            <div className={styles.mainContainer}>
                <div className={styles.container}>
                    <h1>Hello {name}</h1>
                </div>
            </div>
        </section>
    );
}
