'use client'
import styles from "./dashboard.module.css";
import { supabase } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { Calendar, TrendingUp, Layers, UserStar } from 'lucide-react';
import Button from '@/app/components/ui/Button';
import { format, isAfter, isBefore, parseISO, startOfMonth } from "date-fns";
import Link from "next/link";

interface BarberProfile {
    id: string;
    first_name: string;
    role: string;
}

interface Service {
    id: number;
    name: string;
    price: number;
}

interface Appointment {
    id: number;
    start_time: string;
    end_time: string;
    status: string;
    barber_id: string;
    service_id: number;
    profiles: BarberProfile;
    services: Service;
}

interface BarberStats {
    id: string;
    name: string;
    role: string;
    visits: number;
    photo: string;
}

export default function Dashboard() {
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(true);

    const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
    const [pastAppointments, setPastAppointments] = useState<Appointment[]>([]);
    const [barberCounts, setBarberCounts] = useState<Record<string, number>>({});
    const [nextAppointment, setNextAppointment] = useState<Appointment | null>(null);
    const [visitsThisMonth, setVisitsThisMonth] = useState(0);
    const [totalVisits, setTotalVisits] = useState(0);
    const [topBarberName, setTopBarberName] = useState('None');
    const [topBarberVisits, setTopBarberVisits] = useState(0);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;

                const { data: profile } = await supabase
                    .from('profiles')
                    .select('first_name')
                    .eq('id', user.id)
                    .single();

                if (profile) {
                    setName(profile.first_name || 'Guest');
                }

                const { data: appointmentsData, error: apptError } = await supabase
                    .from('appointments')
                    .select(`
                        *,
                        profiles:barber_id (id, first_name, role),
                        services:service_id (name, price)
                    `)
                    .eq('user_id', user.id)
                    .order('start_time', { ascending: true });

                if (apptError) {
                    console.error('Error fetching appointments:', apptError);
                    return;
                }

                const allAppointments = (appointmentsData as any[]) || [];
                const now = new Date();

                const upcoming = allAppointments.filter(app => isAfter(parseISO(app.start_time), now));
                const past = allAppointments.filter(app => isBefore(parseISO(app.start_time), now)).reverse();

                setUpcomingAppointments(upcoming);
                setPastAppointments(past);

                setNextAppointment(upcoming.length > 0 ? upcoming[0] : null);

                const completedVisits = past;
                setTotalVisits(completedVisits.length);

                const startOfCurrentMonth = startOfMonth(now);
                const thisMonthVisits = completedVisits.filter(app =>
                    isAfter(parseISO(app.start_time), startOfCurrentMonth)
                ).length;
                setVisitsThisMonth(thisMonthVisits);

                const counts: Record<string, number> = {};
                completedVisits.forEach((app: any) => {
                    const name = app.profiles?.first_name;
                    if (name) {
                        const key = name.toLowerCase();
                        counts[key] = (counts[key] || 0) + 1;
                    }
                });

                setBarberCounts(counts);

                let maxVisits = 0;
                let topName = 'None';

                for (const [key, count] of Object.entries(counts)) {
                    if (count > maxVisits) {
                        maxVisits = count;
                        topName = key.charAt(0).toUpperCase() + key.slice(1);
                    }
                }

                if (maxVisits > 0) {
                    setTopBarberName(topName);
                    setTopBarberVisits(maxVisits);
                } else {
                    setTopBarberName("None");
                    setTopBarberVisits(0);
                }

            } catch (error) {
                console.error('Unexpected error:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const formatPrice = (price: number) => `$${price}`;
    const formatDate = (dateString: string) => format(parseISO(dateString), 'MMM d, yyyy');
    const formatTime = (dateString: string) => format(parseISO(dateString), 'h:mm a');
    const getDaysUntil = (dateString: string) => {
        const date = parseISO(dateString);
        const now = new Date();
        const diffTime = date.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? `In ${diffDays} days` : 'Today';
    };

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
                            {nextAppointment ? (
                                <p>{formatDate(nextAppointment.start_time)}<br /><span className={styles.separator}>{formatTime(nextAppointment.start_time)}</span></p>
                            ) : (
                                <p>No upcoming<br /><span className={styles.separator}>appointments</span></p>
                            )}
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
                            <p>{visitsThisMonth} visits<br /><span className={styles.separator}>+1 from last month</span></p>
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
                            <p>{totalVisits} visits<br /><span className={styles.separator}>We appreciate you!</span></p>
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
                            <p>{topBarberName}<br /><span className={styles.separator}>{topBarberVisits} visits</span></p>
                        </div>
                    </div>
                </div>

                <div className={styles.containerAppointments}>
                    <div className={styles.appointmentsHeader}>
                        <h2>Upcoming Appointments</h2>
                        <Link href="/dashboard/book"><Button variant="new-appointment">Book New Appointment</Button></Link>
                    </div>
                    <div className={styles.appointmentsCards}>
                        {upcomingAppointments.length === 0 ? (
                            <div style={{ padding: '20px', color: 'var(--text-white-75)' }}>No upcoming appointments found.</div>
                        ) : (
                            upcomingAppointments.slice(0, 3).map((apt) => (
                                <div key={apt.id} className={styles.appointmentCard}>
                                    <div className={styles.cardHeader}>
                                        <div className={styles.appointmentIcon}>
                                            <img
                                                src={`/images/barbers/barber-${apt.profiles?.first_name.toLowerCase()}.png`}
                                                alt={apt.profiles?.first_name}
                                                onError={(e) => (e.currentTarget.src = '/images/barbers/barber-max.png')}
                                            />
                                            <div className={styles.appointmentBarberInfo}>
                                                <h3>{apt.profiles?.first_name || 'Barber'}</h3>
                                                <p>{apt.services?.name || 'Service'}</p>
                                            </div>
                                        </div>
                                        <div className={`${styles.statusBadge} ${apt.status === 'pending' ? styles.pending : ''}`}>
                                            {apt.status === 'pending' ? 'Pending' : 'Confirmed'}
                                        </div>
                                    </div>
                                    <div className={styles.cardDetails}>
                                        <div className={styles.detailItem}>
                                            <Calendar size={20} color="var(--text-white-75)" />
                                            <span>{formatDate(apt.start_time)}</span>
                                        </div>
                                        <div className={styles.detailItem}>
                                            <TrendingUp size={20} color="var(--text-white-75)" />
                                            <span>{formatTime(apt.start_time)}</span>
                                        </div>
                                        <div className={styles.detailItem}>
                                            <span>{formatPrice(apt.services?.price || 0)}</span>
                                        </div>
                                    </div>
                                    <div className={styles.cardCountdown}>
                                        <div className={styles.timeLeft}>{getDaysUntil(apt.start_time)}</div>
                                    </div>
                                </div>
                            ))
                        )}
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
                        </div>
                        {pastAppointments.length === 0 ? (
                            <div className={styles.tableRow} style={{ justifyContent: 'center', color: 'var(--text-white-50)' }}>No previous visits.</div>
                        ) : (
                            pastAppointments.slice(0, 5).map((apt) => (
                                <div key={apt.id} className={styles.tableRow}>
                                    <span>{formatDate(apt.start_time)}</span>
                                    <span>{apt.profiles?.first_name}</span>
                                    <span>{apt.services?.name}</span>
                                    <span>{formatPrice(apt.services?.price || 0)}</span>
                                </div>
                            ))
                        )}
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
                            <p className={styles.visitCount}>{barberCounts.max} visits with you</p>
                            <Link href={`/dashboard/book/service`}><Button variant="new-appointment">Book now</Button></Link>
                        </div>
                        <div className={styles.favoriteCard}>
                            <img src="/images/barbers/barber-kevin.png" alt="Kevin" className={styles.barberAvatar} />
                            <h3>Kevin</h3>
                            <p>Founder & Barber</p>
                            <div className={styles.rating}>★ 4.9</div>
                            <p className={styles.visitCount}>{barberCounts.kevin} visits with you</p>
                            <Link href={`/dashboard/book/service`}><Button variant="new-appointment">Book now</Button></Link>
                        </div>
                        <div className={styles.favoriteCard}>
                            <img src="/images/barbers/barber-jake.png" alt="Jake" className={styles.barberAvatar} />
                            <h3>Jake</h3>
                            <p>Founder & Barber</p>
                            <div className={styles.rating}>★ 4.9</div>
                            <p className={styles.visitCount}>{barberCounts.jake} visits with you</p>
                            <Link href={`/dashboard/book/service`}><Button variant="new-appointment">Book now</Button></Link>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
