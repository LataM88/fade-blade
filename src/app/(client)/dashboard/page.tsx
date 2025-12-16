'use client'
import styles from "./dashboard.module.css";
import { supabase } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { Calendar, TrendingUp, Layers, UserStar } from 'lucide-react';
import Button from '@/app/components/ui/Button';

export default function Dashboard() {
    const [name, setName] = useState('');
    const [barber, setBarber] = useState('');

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

                const { data: barbers, error: barberError } = await supabase
                    .from('profiles')
                    .select('first_name')
                    .eq('role', 'barber')
                    .limit(1);
                if (barbers && barbers.length > 0) {
                    setBarber(barbers[0].first_name);
                } else {
                    setBarber('No barber found');
                }

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
                    <h2>Welcome back {name} !</h2>
                    <p>Ready for your next transformation?</p>
                </div>
                <div className={styles.containerInfo}>
                    <div className={styles.infoCard}>
                        <div className={styles.infoIcon}>
                            <Calendar color="var(--primary-yellow)" size={34} />
                        </div>
                        <div className={styles.infoText}>
                            <p>Next Appointment</p>
                        </div>
                        <div className={styles.infoDate}>
                            <p>Dec 7, 2025<br /><span className={styles.separator}>3:00 PM</span></p>
                        </div>
                    </div>
                    <div className={styles.infoCard}>
                        <div className={styles.infoIcon}>
                            <TrendingUp color="var(--primary-yellow)" size={34} />
                        </div>
                        <div className={styles.infoText}>
                            <p>Visit This Month</p>
                        </div>
                        <div className={styles.infoDate}>
                            <p>3 visits<br /><span className={styles.separator}>+1 from last month</span></p>
                        </div>
                    </div>
                    <div className={styles.infoCard}>
                        <div className={styles.infoIcon}>
                            <Layers color="var(--primary-yellow)" size={34} />
                        </div>
                        <div className={styles.infoText}>
                            <p>Total Visits</p>
                        </div>
                        <div className={styles.infoDate}>
                            <p>35 visits<br /><span className={styles.separator}>22% more than others</span></p>
                        </div>
                    </div>
                    <div className={styles.infoCard}>
                        <div className={styles.infoIcon}>
                            <UserStar color="var(--primary-yellow)" size={34} />
                        </div>
                        <div className={styles.infoText}>
                            <p>Favorite Stylist</p>
                        </div>
                        <div className={styles.infoDate}>
                            <p>{barber}<br /><span className={styles.separator}>30 visits</span></p>
                        </div>
                    </div>
                </div>

                <div className={styles.containerAppointments}>
                    <div className={styles.appointmentsHeader}>
                        <h2>Upcoming Appointments</h2>
                        <Button variant="new-appointment">Book New Appointment</Button>
                    </div>
                    <div className={styles.appointmentsCards}>
                        <div className={styles.appointmentCard}>
                            <div className={styles.cardHeader}>
                                <div className={styles.appointmentIcon}>
                                    <img src="/images/barbers/barber-max.png" alt="Max" />
                                    <div className={styles.appointmentBarberInfo}>
                                        <h3>Max</h3>
                                        <p>Classic haircut</p>
                                    </div>
                                </div>
                                <div className={styles.statusBadge}>Confirmed</div>
                            </div>
                            <div className={styles.cardDetails}>
                                <div className={styles.detailItem}>
                                    <Calendar size={20} color="var(--text-white-75)" />
                                    <span>Dec 7, 2025</span>
                                </div>
                                <div className={styles.detailItem}>
                                    <TrendingUp size={20} color="var(--text-white-75)" /> {/* Clock icon placeholder */}
                                    <span>3:00 PM</span>
                                </div>
                                <div className={styles.detailItem}>
                                    <span>$ 30 $</span>
                                </div>
                            </div>
                            <div className={styles.cardCountdown}>
                                <div className={styles.timeLeft}>In 7 days</div>
                                <Button variant="reset-password" className={styles.cancelButton}>X</Button>
                            </div>
                        </div>

                        <div className={styles.appointmentCard}>
                            <div className={styles.cardHeader}>
                                <div className={styles.appointmentIcon}>
                                    <img src="/images/barbers/barber-kevin.png" alt="Kevin" />
                                    <div className={styles.appointmentBarberInfo}>
                                        <h3>Kevin</h3>
                                        <p>VIP Package</p>
                                    </div>
                                </div>
                                <div className={`${styles.statusBadge} ${styles.pending}`}>Pending</div>
                            </div>
                            <div className={styles.cardDetails}>
                                <div className={styles.detailItem}>
                                    <Calendar size={20} color="var(--text-white-75)" />
                                    <span>Dec 21, 2025</span>
                                </div>
                                <div className={styles.detailItem}>
                                    <TrendingUp size={20} color="var(--text-white-75)" />
                                    <span>3:00 PM</span>
                                </div>
                                <div className={styles.detailItem}>
                                    <span>$ 55 $</span>
                                </div>
                            </div>
                            <div className={styles.cardCountdown}>
                                <div className={styles.timeLeft}>In 21 days</div>
                                <Button variant="reset-password" className={styles.cancelButton}>X</Button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.containerHistory}>
                    <h2>Previous visits</h2>
                    <div className={styles.historyTable}>
                        <div className={styles.tableHeader}>
                            <span>Date</span>
                            <span>Barber</span>
                            <span>Service</span>
                            <span>Price</span>
                            <span>Actions</span>
                        </div>
                        <div className={styles.tableRow}>
                            <span>Nov 18, 2025</span>
                            <span>Max</span>
                            <span>Classic haircut</span>
                            <span>$30</span>
                            <div className={styles.actions}>
                                <Button variant="sign-in">↻</Button>
                                <Button variant="sign-in">★</Button>
                            </div>
                        </div>
                        <div className={styles.tableRow}>
                            <span>Oct 15, 2025</span>
                            <span>Kevin</span>
                            <span>VIP Package</span>
                            <span>$55</span>
                            <div className={styles.actions}>
                                <Button variant="sign-in">↻</Button>
                                <Button variant="sign-in">★</Button>
                            </div>
                        </div>
                        <div className={styles.tableRow}>
                            <span>Sep 11, 2025</span>
                            <span>Jake</span>
                            <span>Hot towel shave</span>
                            <span>$25</span>
                            <div className={styles.actions}>
                                <Button variant="sign-in">↻</Button>
                                <Button variant="sign-in">★</Button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.containerFavorites}>
                    <h2>Your favorite barbers</h2>
                    <div className={styles.favoritesCards}>
                        <div className={styles.favoriteCard}>
                            <img src="/images/barbers/barber-max.png" alt="Max" className={styles.barberAvatar} />
                            <h3>Max</h3>
                            <p>Founder & Barber</p>
                            <div className={styles.rating}>★ 4.9</div>
                            <p className={styles.visitCount}>30 visits with you</p>
                            <Button variant="new-appointment">Book now</Button>
                        </div>
                        <div className={styles.favoriteCard}>
                            <img src="/images/barbers/barber-kevin.png" alt="Kevin" className={styles.barberAvatar} />
                            <h3>Kevin</h3>
                            <p>Founder & Barber</p>
                            <div className={styles.rating}>★ 4.9</div>
                            <p className={styles.visitCount}>3 visits with you</p>
                            <Button variant="new-appointment">Book now</Button>
                        </div>
                        <div className={styles.favoriteCard}>
                            <img src="/images/barbers/barber-jake.png" alt="Jake" className={styles.barberAvatar} />
                            <h3>Jake</h3>
                            <p>Founder & Barber</p>
                            <div className={styles.rating}>★ 4.9</div>
                            <p className={styles.visitCount}>2 visits with you</p>
                            <Button variant="new-appointment">Book now</Button>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
