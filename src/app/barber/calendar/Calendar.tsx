"use client";

import React, { useState, useEffect } from 'react';
import { startOfWeek, endOfWeek, addDays, format, addWeeks, subWeeks, isSameDay, getHours, set } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './Calendar.module.css';
import { getBarberAppointments } from '@/app/actions/barber';

const HOURS = [
    "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM",
    "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM"
];

const HOUR_VALUES = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18];

interface Appointment {
    id: string;
    start_time: string;
    end_time: string;
    status: string;
    client_name?: string;
    client_last_name?: string;
    services?: {
        name: string;
        duration: number;
    } | {
        name: string;
        duration: number;
    }[];
    profiles?: {
        first_name: string;
        last_name: string;
    } | {
        first_name: string;
        last_name: string;
    }[];
}

export default function Calendar() {
    const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(false);

    const nextWeek = () => setCurrentWeekStart(addWeeks(currentWeekStart, 1));
    const prevWeek = () => setCurrentWeekStart(subWeeks(currentWeekStart, 1));

    const days = Array.from({ length: 7 }).map((_, i) => addDays(currentWeekStart, i));
    const weekEnd = endOfWeek(currentWeekStart, { weekStartsOn: 1 });

    useEffect(() => {
        const fetchAppointments = async () => {
            setLoading(true);
            const start = currentWeekStart.toISOString();
            const end = weekEnd.toISOString();

            const { data, error } = await getBarberAppointments(start, end);

            if (data) {
                // console.log('Fetched appointments:', data); 
                setAppointments(data as unknown as Appointment[]);
            } else if (error) {
                console.error(error);
            }
            setLoading(false);
        };

        fetchAppointments();
    }, [currentWeekStart]);

    const getStatusForSlot = (day: Date, hourString: string, hourValue: number) => {
        // Sunday is closed
        if (day.getDay() === 0) return { type: 'closed' };


        // Check for appointments
        const appointment = appointments.find(app => {
            const appStart = new Date(app.start_time);
            return isSameDay(appStart, day) && getHours(appStart) === hourValue;
        });

        if (appointment) {
            let serviceName = '';
            let serviceDuration = '';

            if (appointment.services) {
                const serviceData = Array.isArray(appointment.services) ? appointment.services[0] : appointment.services;
                if (serviceData) {
                    serviceName = serviceData.name;
                    serviceDuration = serviceData.duration ? `${serviceData.duration}min` : '';
                }
            }

            let clientName = 'Client';
            if (appointment.client_name) {
                clientName = `${appointment.client_name} ${appointment.client_last_name || ''}`;
            } else if (appointment.profiles) {
                if (Array.isArray(appointment.profiles)) {
                    clientName = `${appointment.profiles[0]?.first_name || ''} ${appointment.profiles[0]?.last_name || ''}`;
                } else {
                    clientName = `${appointment.profiles.first_name || ''} ${appointment.profiles.last_name || ''}`;
                }
            }

            return {
                type: 'appointment',
                clientName: clientName.trim() || 'Client',
                service: serviceName,
                duration: serviceDuration
            };
        }

        return null; // Free slot
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.titleSection}>
                    <h2>Appointments Calendar</h2>
                    <div className={styles.dateRange}>
                        {format(currentWeekStart, 'EEEE, MMMM d, yyyy')} <br />
                        {format(currentWeekStart, 'dd.MM')} - {format(weekEnd, 'dd.MM')}
                    </div>
                </div>
                <div className={styles.controls}>
                    <button onClick={prevWeek} className={styles.navButton}>
                        <ChevronLeft size={24} />
                    </button>
                    <span className="body-regular" style={{ color: 'var(--white)' }}>View next weeks</span>
                    <button onClick={nextWeek} className={styles.navButton}>
                        <ChevronRight size={24} />
                    </button>
                </div>
            </div>

            <div className={styles.calendarGrid}>
                {/* Header Row */}
                <div className={styles.headerCell}>Time</div>
                {days.map((day, i) => (
                    <div key={i} className={styles.headerCell}>
                        {format(day, 'EEE')}
                    </div>
                ))}

                {/* Time Slots */}
                {HOURS.map((hour, hourIndex) => (
                    <React.Fragment key={hour}>
                        <div className={styles.timeCell}>{hour}</div>
                        {days.map((day, dayIndex) => {
                            const status = getStatusForSlot(day, hour, HOUR_VALUES[hourIndex]);

                            return (
                                <div key={`${dayIndex}-${hourIndex}`} className={styles.slotCell}>
                                    {status?.type === 'appointment' && (
                                        <div className={styles.appointmentCard}>
                                            <span>{status.clientName}</span>
                                            <span>{status.service}</span>
                                            <span>{status.duration}</span>
                                        </div>
                                    )}
                                    {status?.type === 'break' && (
                                        <div className={styles.breakCard}>Break</div>
                                    )}
                                    {status?.type === 'closed' && (
                                        <div className={styles.closedCard}>Closed</div>
                                    )}
                                </div>
                            );
                        })}
                    </React.Fragment>
                ))}
            </div>

            <div className={styles.statusLegend}>
                <div className={styles.legendItem}>
                    <div className={`${styles.dot} ${styles.dotCompleted}`}></div>
                    <span>Completed</span>
                </div>
                <div className={styles.legendItem}>
                    <div className={`${styles.dot} ${styles.dotComing}`}></div>
                    <span>Coming</span>
                </div>
                <div className={styles.legendItem}>
                    <div className={`${styles.dot} ${styles.dotBreak}`}></div>
                    <span>Break</span>
                </div>
                <div className={styles.legendItem}>
                    <div className={`${styles.dot} ${styles.dotClosed}`}></div>
                    <span>Closed</span>
                </div>
            </div>
        </div>
    );
}
