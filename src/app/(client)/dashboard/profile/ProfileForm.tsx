'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { updateProfile, updatePassword } from '@/app/actions/profile';
import styles from './profile.module.css';
import Button from '@/app/components/ui/Button';

const formSchema = z.object({
    phone: z.string().min(9, { message: "Phone number is required (min 9 digits)" }),
    newPassword: z.string().optional().refine(val => !val || val.length >= 6, {
        message: "Password must be at least 6 characters"
    }),
});

type FormData = z.infer<typeof formSchema>;

interface ProfileFormProps {
    user: {
        id: string;
        email?: string;
        first_name?: string;
        last_name?: string;
        phone?: string;
    } | null;
}

export default function ProfileForm({ user }: ProfileFormProps) {
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            phone: user?.phone || '',
            newPassword: '',
        }
    });

    const onSubmit = async (data: FormData) => {
        setIsSubmitting(true);
        setMessage(null);

        try {
            const formData = new FormData();
            formData.append('phone', data.phone);

            const profileRes = await updateProfile(null, formData);
            if (profileRes?.error) {
                setMessage({ type: 'error', text: profileRes.error });
                setIsSubmitting(false);
                return;
            }

            if (data.newPassword) {
                const passFormData = new FormData();
                passFormData.append('password', data.newPassword);
                const passRes = await updatePassword(null, passFormData);
                if (passRes?.error) {
                    setMessage({ type: 'error', text: `Phone saved, but password failed: ${passRes.error}` });
                    setIsSubmitting(false);
                    return;
                }
            }

            setMessage({ type: 'success', text: "Profile updated successfully!" });
        } catch (e) {
            setMessage({ type: 'error', text: "An unexpected error occurred." });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!user) {
        return <div>Loading profile...</div>;
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            <div className={styles.sectionHeader}>
                <h3>Personal Information</h3>
            </div>

            <div className={styles.row}>
                <div className={styles.field}>
                    <label>First name</label>
                    <input
                        type="text"
                        value={user.first_name || ''}
                        disabled
                        className={styles.inputDisabled}
                    />
                </div>
                <div className={styles.field}>
                    <label>Last name</label>
                    <input
                        type="text"
                        value={user.last_name || ''}
                        disabled
                        className={styles.inputDisabled}
                    />
                </div>
            </div>

            <div className={styles.row}>
                <div className={styles.field}>
                    <label>Phone number</label>
                    <input
                        type="tel"
                        {...register('phone')}
                        className={errors.phone ? styles.inputError : ''}
                    />
                    {errors.phone && <span className={styles.errorMsg}>{errors.phone.message}</span>}
                </div>
                <div className={styles.field}>
                    <label>Email address</label>
                    <input
                        type="email"
                        value={user.email || ''}
                        disabled
                        className={styles.inputDisabled}
                    />
                </div>
            </div>


            <div className={styles.row}>
                <div className={styles.field}>
                    <label>Password</label>
                    <input
                        type="password"
                        value="********"
                        disabled
                        className={styles.inputDisabled}
                    />
                </div>
                <div className={styles.field}>
                    <label>New password</label>
                    <input
                        type="password"
                        {...register('newPassword')}
                        placeholder="Enter new password to change"
                        className={errors.newPassword ? styles.inputError : ''}
                    />
                    {errors.newPassword && <span className={styles.errorMsg}>{errors.newPassword.message}</span>}
                </div>
            </div>

            {message && (
                <div className={`${styles.message} ${message.type === 'error' ? styles.messageError : styles.messageSuccess}`}>
                    {message.text}
                </div>
            )}

            <div className={styles.buttonContainer}>
                <Button variant="sign-up" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : 'Save changes'}
                </Button>
            </div>
        </form>
    );
}
