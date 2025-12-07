import styles from './ContactSection.module.css';
import { MapPin, Phone, Mail } from 'lucide-react';
import Image from 'next/image';
import Button from '../../ui/Button';

export default function ContactSection() {
    return (
        <section id="contact" className={styles.section}>
            <div className={styles.container}>
                <h1>Get in Touch</h1>
                <div className={styles.cardsContainer}>
                    <div className={`${styles.card} ${styles.formCard}`}>
                        <h2>Ask us a question</h2>
                        <form className={styles.form}>
                            <div className={styles.inputGroup}>
                                <input type="text" placeholder="Name" className={styles.input} />
                            </div>
                            <div className={styles.inputGroup}>
                                <input type="email" placeholder="Email" className={styles.input} />
                            </div>
                            <div className={styles.inputGroup}>
                                <input type="tel" placeholder="Phone" className={styles.input} />
                            </div>
                            <div className={styles.inputGroup}>
                                <textarea placeholder="Write a message" className={styles.textarea}></textarea>
                            </div>
                            <div className={styles.buttonContainer}>
                                <Button type="submit" variant="contact">Send message</Button>
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
