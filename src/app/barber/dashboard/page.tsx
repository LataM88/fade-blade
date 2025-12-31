'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import { Clock, CalendarCheck, DollarSign, Timer, Users, Plus, Trash2, Calendar, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import AddReservationModal from '@/app/components/modals/AddReservationModal';
import TomorrowScheduleModal from '@/app/components/modals/TomorrowScheduleModal';
import ConfirmationModal from '@/app/components/modals/ConfirmationModal';

interface Appointment {
    id: string;
    start_time: string;
    end_time: string;
    status: string;
    client_name?: string;
    client_last_name?: string;
    client_phone?: string;
    client_email?: string;
    profiles: {
        first_name: string;
        last_name: string;
        email: string;
    } | null;
    services: {
        name: string;
        price: number;
        duration: number;
    } | null;
}

export default function BarberDashboard() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [stats, setStats] = useState({
        todayCount: 0,
        revenue: 0,
        weekClients: 0,
        completed: 0,
        pending: 0
    });
    const [nextAppointment, setNextAppointment] = useState<Appointment | null>(null);
    const [user, setUser] = useState<any>(null);
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    const [showAddModal, setShowAddModal] = useState(false);
    const [showTomorrowModal, setShowTomorrowModal] = useState(false);
    const [deleteMode, setDeleteMode] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) {
                    router.push('/login');
                    return;
                }

                const { data: profile, error: profileError } = await supabase
                    .from('profiles')
                    .select('first_name, role')
                    .eq('id', user.id)
                    .single();

                if (profileError) console.error("Profile fetch error:", profileError);

                if (profile?.role !== 'barber' && profile?.role !== 'admin') {
                    router.push('/');
                    return;
                }

                setUser({ ...user, profile });

                const now = new Date();
                const startOfDay = new Date(now);
                startOfDay.setHours(0, 0, 0, 0);

                const endOfDay = new Date(now);
                endOfDay.setHours(23, 59, 59, 999);

                const startOfWeek = new Date(now);
                const day = startOfWeek.getDay() || 7;
                if (day !== 1) startOfWeek.setHours(-24 * (day - 1));
                startOfWeek.setHours(0, 0, 0, 0);

                const todayParams = new URLSearchParams({
                    barberId: user.id,
                    start: startOfDay.toISOString(),
                    end: endOfDay.toISOString()
                });
                const todayRes = await fetch(`/api/barber/appointments?${todayParams}`, { cache: 'no-store' });
                if (!todayRes.ok) throw new Error("Failed to fetch schedule");
                const todayAppointments = await todayRes.json();

                let todayFormatted: Appointment[] = [];

                if (todayAppointments) {
                    todayFormatted = (todayAppointments as any[]).map(app => ({
                        id: app.id,
                        start_time: app.start_time,
                        end_time: app.end_time || new Date(new Date(app.start_time).getTime() + (app.services?.duration || 30) * 60000).toISOString(),
                        status: app.status,
                        client_name: app.client_name,
                        client_last_name: app.client_last_name,
                        client_phone: app.client_phone,
                        client_email: app.client_email,
                        profiles: Array.isArray(app.profiles) ? app.profiles[0] : app.profiles,
                        services: Array.isArray(app.services) ? app.services[0] : app.services
                    }));
                    setAppointments(todayFormatted);
                }

                const weekParams = new URLSearchParams({
                    barberId: user.id,
                    start: startOfWeek.toISOString()
                });
                const weekRes = await fetch(`/api/barber/appointments?${weekParams}`, { cache: 'no-store' });
                if (!weekRes.ok) throw new Error("Failed to fetch stats");
                const weekAppointments = await weekRes.json();

                const dailyRevenue = todayFormatted.reduce((sum, app) => sum + (app.services?.price || 0), 0);

                let weekClientsCount = 0;
                if (weekAppointments) {
                    const uniqueClientsThisWeek = new Set(weekAppointments.map((a: any) => a.user_id));
                    weekClientsCount = uniqueClientsThisWeek.size;
                }

                const upcoming = todayFormatted.find(a => new Date(a.start_time) > now && a.status !== 'cancelled');
                setNextAppointment(upcoming || null);

                const completedCount = todayFormatted.filter(a => a.status === 'completed').length;
                const pendingCount = todayFormatted.filter(a => a.status === 'pending').length;

                setStats({
                    todayCount: todayFormatted.length,
                    revenue: dailyRevenue,
                    weekClients: weekClientsCount,
                    completed: completedCount,
                    pending: pendingCount
                });

            } catch (error) {
                console.error("Dashboard fetch error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [router]);

    const refreshData = () => {
        window.location.reload();
    };

    const handleDelete = (id: string) => {
        setItemToDelete(id);
        setShowConfirmModal(true);
    };

    const confirmDelete = async () => {
        if (!itemToDelete) return;

        await fetch(`/api/barber/appointments?id=${itemToDelete}`, { method: 'DELETE' });

        setAppointments(appointments.filter(a => a.id !== itemToDelete));
        setShowConfirmModal(false);
        setItemToDelete(null);
    };

    if (loading) return <div style={{ padding: '2rem' }}>Loading dashboard...</div>;
    if (!user) return null;

    const formatTime = (isoString: string) => {
        return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div>
            <header className={styles.topHeader}>
                <div className={styles.adminInfo}>
                    <h2 className={styles.adminName}>{user?.profile?.first_name || 'Barber'}</h2>
                    <p className={styles.adminRole}>Barber</p>
                </div>
            </header>

            <div className={styles.container}>
                <div className={styles.heroCard}>
                    <div className={styles.heroContent}>
                        <h2>Next Appointment</h2>
                        {nextAppointment ? (
                            <>
                                <h1>
                                    {formatTime(nextAppointment.start_time)} - {
                                        nextAppointment.profiles
                                            ? `${nextAppointment.profiles.first_name} ${nextAppointment.profiles.last_name}`
                                            : `${nextAppointment.client_name || ''} ${nextAppointment.client_last_name || ''}`
                                    }
                                </h1>
                                <p>{nextAppointment.services?.name}</p>
                            </>
                        ) : (
                            <h1>No upcoming appointments today</h1>
                        )}
                    </div>
                    <Clock className={styles.clockIcon} />
                </div>

                <div className={styles.statsGrid}>
                    <div className={styles.statCard}>
                        <div className={`${styles.statIconWrapper} ${styles.iconBlue}`}>
                            <CalendarCheck size={20} />
                        </div>
                        <p className={styles.statTitle}>Today's Appointments</p>
                        <p className={styles.statValue}>{stats.todayCount}</p>
                        <p className={styles.statSub}>All dates used today</p>
                    </div>
                    <div className={styles.statCard}>
                        <div className={`${styles.statIconWrapper} ${styles.iconGreen}`}>
                            <DollarSign size={20} />
                        </div>
                        <p className={styles.statTitle}>Daily Revenue</p>
                        <p className={styles.statValue}>{stats.revenue}€</p>
                        <p className={styles.statSub}>Same as yesterday</p>
                    </div>
                    <div className={styles.statCard}>
                        <div className={`${styles.statIconWrapper} ${styles.iconOrange}`}>
                            <Timer size={20} />
                        </div>
                        <p className={styles.statTitle}>Time Utilization</p>
                        <p className={styles.statValue}>87%</p>
                        <p className={styles.statSub}>Above target (80%)</p>
                    </div>
                    <div className={styles.statCard}>
                        <div className={`${styles.statIconWrapper} ${styles.iconPurple}`}>
                            <Users size={20} />
                        </div>
                        <p className={styles.statTitle}>All Clients</p>
                        <p className={styles.statValue}>{stats.weekClients}</p>
                        <p className={styles.statSub}>This week</p>
                    </div>
                </div>

                <div className={styles.mainGrid}>
                    <div>
                        <div className={styles.sectionHeader}>
                            <h3 className={styles.sectionTitle}>Today's Schedule</h3>
                            <a href="/barber/dashboard/appointments" className={styles.viewAll}>
                                View all <ChevronRight size={16} />
                            </a>
                        </div>
                        <div className={styles.scheduleList}>
                            {appointments.length === 0 ? (
                                <p style={{ color: '#666' }}>No appointments scheduled for today.</p>
                            ) : (
                                appointments.map(app => (
                                    <div key={app.id} className={styles.scheduleItem}>
                                        <div className={styles.timeSlot}>
                                            <span className={styles.timeStart}>{formatTime(app.start_time)}</span>
                                            <span className={styles.timeEnd}>{formatTime(app.end_time)}</span>
                                        </div>

                                        <div className={styles.clientInfo} style={{ flex: 1 }}>
                                            <h4>
                                                {app.profiles
                                                    ? `${app.profiles.first_name || ''} ${app.profiles.last_name || ''}`
                                                    : (app.client_name || app.client_last_name)
                                                        ? `${app.client_name || ''} ${app.client_last_name || ''}`
                                                        : 'Unknown Client'}
                                            </h4>
                                            <p>{app.services?.name}</p>
                                        </div>

                                        {deleteMode && (
                                            <button
                                                onClick={() => handleDelete(app.id)}
                                                style={{ background: 'none', border: 'none', color: '#ff5252', cursor: 'pointer' }}
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div>
                        <div className={styles.sectionHeader}>
                            <h3 className={styles.sectionTitle}>Quick Actions</h3>
                        </div>
                        <div className={styles.quickActions}>
                            <button
                                onClick={() => setShowAddModal(true)}
                                className={`${styles.actionBtn} ${styles.primaryBtn}`}
                            >
                                <Plus size={20} />
                                Add a telephone reservation
                            </button>
                            <button
                                onClick={() => setDeleteMode(!deleteMode)}
                                className={`${styles.actionBtn} ${styles.secondaryBtn}`}
                                style={{ borderColor: deleteMode ? '#ff5252' : undefined, color: deleteMode ? '#ff5252' : undefined }}
                            >
                                <Trash2 size={20} />
                                {deleteMode ? 'Cancel Delete Mode' : 'Delete reservation'}
                            </button>
                            <button
                                onClick={() => setShowTomorrowModal(true)}
                                className={`${styles.actionBtn} ${styles.secondaryBtn}`}
                            >
                                <Calendar size={20} />
                                Tomorrow's Schedule
                            </button>
                        </div>

                        <div className={styles.summaryCard}>
                            <div className={styles.sectionHeader}>
                                <h3 className={styles.sectionTitle} style={{ fontSize: '1rem' }}>Today's Summary</h3>
                            </div>
                            <div className={styles.summaryRow}>
                                <span>Completed</span>
                                <span>{stats.completed}</span>
                            </div>
                            <div className={styles.summaryRow}>
                                <span>In Progress</span>
                                <span>{stats.pending}</span>
                            </div>
                            <div className={styles.summaryRow}>
                                <span>Coming Today</span>
                                <span>{appointments.length - stats.completed}</span>
                            </div>
                            <div className={`${styles.summaryRow} ${styles.total}`}>
                                <span>Revenue</span>
                                <span>{stats.revenue}€</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {showAddModal && <AddReservationModal onClose={() => setShowAddModal(false)} onSuccess={refreshData} barberId={user.id} />}
            {showTomorrowModal && <TomorrowScheduleModal onClose={() => setShowTomorrowModal(false)} barberId={user.id} />}
            {showConfirmModal && (
                <ConfirmationModal
                    onClose={() => setShowConfirmModal(false)}
                    onConfirm={confirmDelete}
                    title="Delete Reservation"
                    message="Are you sure you want to remove this appointment from your schedule? This action cannot be undone."
                />
            )}
        </div>
    );
}
