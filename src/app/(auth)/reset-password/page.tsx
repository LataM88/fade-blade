"use client";

import styles from "./reset-password.module.css";
import Button from "@/app/components/ui/Button";
import Input from "@/app/components/ui/Input";
import { useState } from "react";

export default function ResetPassword() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        setError("");

        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;

        try {
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Something went wrong");
            }

            setMessage(data.message);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section id="reset-password" className={styles.section}>
            <div className={styles.container}>
                <h1>Reset your <span className={styles.separator}>password</span></h1>
                <div className={styles.formContainer}>
                    <form onSubmit={handleSubmit}>
                        <Input
                            label="Email"
                            name="email"
                            type="email"
                            required
                            placeholder="Enter your email"
                        />

                        {message && <p style={{ color: "#FFB52B" }} className={styles.success}>{message}</p>}
                        {error && <p style={{ color: "red" }} className={styles.error}>{error}</p>}

                        <Button variant="reset-password" disabled={loading}>
                            {loading ? "Sending..." : "Reset your password"}
                        </Button>
                    </form>
                </div>
            </div>
        </section>
    );
}