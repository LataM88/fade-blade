"use client";

import styles from "../reset-password.module.css";
import Button from "@/app/components/ui/Button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signUpSchema } from "@/lib/validations/auth";

const updatePasswordSchema = z.object({
    password: signUpSchema.shape.password,
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

type UpdatePasswordFormData = z.infer<typeof updatePasswordSchema>;

export default function UpdatePassword() {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<UpdatePasswordFormData>({
        resolver: zodResolver(updatePasswordSchema),
    });

    const [message, setMessage] = useState("");
    const [globalError, setGlobalError] = useState("");
    const router = useRouter();

    const onSubmit = async (data: UpdatePasswordFormData) => {
        setMessage("");
        setGlobalError("");

        try {
            const res = await fetch("/api/auth/update-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password: data.password }),
            });

            const resData = await res.json();

            if (!res.ok) {
                throw new Error(resData.message || "Something went wrong");
            }

            setMessage("Password updated successfully. Redirecting...");
            setTimeout(() => {
                router.push("/login");
            }, 2000);
        } catch (err: any) {
            setGlobalError(err.message);
        }
    };

    return (
        <section id="update-password" className={styles.section}>
            <div className={styles.container}>
                <h1>Update your <span className={styles.separator}>password</span></h1>
                <div className={styles.formContainer}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <p>New Password</p>
                        <input
                            type="password"
                            placeholder="Enter new password"
                            {...register("password")}
                        />
                        {errors.password && <p style={{ color: "red", fontSize: "0.8rem", marginTop: "4px" }}>{errors.password.message}</p>}

                        <p>Confirm Password</p>
                        <input
                            type="password"
                            placeholder="Confirm new password"
                            {...register("confirmPassword")}
                        />
                        {errors.confirmPassword && <p style={{ color: "red", fontSize: "0.8rem", marginTop: "4px" }}>{errors.confirmPassword.message}</p>}

                        {message && <p style={{ color: "#FFB52B" }} className={styles.success}>{message}</p>}
                        {globalError && <p style={{ color: "red" }} className={styles.error}>{globalError}</p>}

                        <Button variant="reset-password" disabled={isSubmitting}>
                            {isSubmitting ? "Updating..." : "Update Password"}
                        </Button>
                    </form>
                </div>
            </div>
        </section>
    );
}
