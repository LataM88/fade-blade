'use client';
import { useState } from 'react';
import styles from './ContactSection.module.css';
import { MapPin, Phone, Mail } from 'lucide-react';
import Image from 'next/image';
import Button from '../../ui/Button';
import Input from '../../ui/Input';

export default function ContactSection() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setStatus('success');
                setFormData({ name: '', email: '', phone: '', message: '' });
                setTimeout(() => setStatus('idle'), 5000);
            } else {
                setStatus('error');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            setStatus('error');
        }
    };
    return (
        <section id="contact" className={styles.section}>
            <div className={styles.container}>
                <h1>Get in Touch</h1>
                <div className={styles.cardsContainer}>
                    <div className={`${styles.card} ${styles.formCard}`}>
                        <h2>Ask us a question</h2>
                        <form className={styles.form} onSubmit={handleSubmit}>
                            <Input
                                type="text"
                                name="name"
                                placeholder="Name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />

                            <Input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />

                            <Input
                                type="tel"
                                name="phone"
                                placeholder="Phone"
                                value={formData.phone}
                                onChange={handleChange}
                            />
                            <div className={styles.inputGroup}>
                                <textarea
                                    name="message"
                                    placeholder="Write a message"
                                    className={styles.textarea}
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                ></textarea>
                            </div>
                            <div className={styles.buttonContainer}>
                                <Button type="submit" variant="contact" disabled={status === 'loading'}>
                                    {status === 'loading' ? 'Sending...' : 'Send message'}
                                </Button>
                                {status === 'success' && <p style={{ color: 'green', marginTop: '0.5rem' }}>Message sent successfully!</p>}
                                {status === 'error' && <p style={{ color: 'red', marginTop: '0.5rem' }}>Failed to send message.</p>}
                            </div>
                        </form>
                    </div>

                    <div className={styles.card}>
                        <h2>Contact details</h2>
                        <div className={styles.detailsContent}>
                            <div className={styles.detailsInfo}>
                                <div className={styles.contactRow}>
                                    <MapPin className={styles.icon} />
                                    <span>Warszawa, Drawska 99</span>
                                </div>
                                <div className={styles.contactRow}>
                                    <Phone className={styles.icon} />
                                    <span>+48 111 222 333</span>
                                </div>
                                <div className={styles.contactRow}>
                                    <Mail className={styles.icon} />
                                    <span>fdbarber@gmail.com</span>
                                </div>

                                <div className={styles.hoursSection}>
                                    <h3>Opening hours</h3>
                                    <div className={styles.hoursTable}>
                                        <div className={styles.hourRow}><span>Mon:</span> <span>8:00-18:00</span></div>
                                        <div className={styles.hourRow}><span>Tue:</span> <span>8:00-18:00</span></div>
                                        <div className={styles.hourRow}><span>Wed:</span> <span>8:00-18:00</span></div>
                                        <div className={styles.hourRow}><span>Thu:</span> <span>8:00-18:00</span></div>
                                        <div className={styles.hourRow}><span>Fri:</span> <span>8:00-18:00</span></div>
                                        <div className={styles.hourRow}><span>Sat:</span> <span>8:00-15:00</span></div>
                                        <div className={styles.hourRow}><span>Sun:</span> <span>Closed</span></div>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.mapContainer}>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
