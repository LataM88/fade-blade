'use client';

import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import styles from './date.module.css';
import Button from '@/app/components/ui/Button';
import Link from 'next/link';
import { useBooking } from '@/app/(client)/dashboard/book/BookingContext';
import { format } from 'date-fns';
import { supabase } from "@/lib/supabase/client";

export default function DatePage() {
    const { date, setDate, time, setTime, barberId } = useBooking();
    const [selectedDate, setSelectedDate] = useState<Date>(date || new Date());
    const [bookedSlots, setBookedSlots] = useState<string[]>([]);

    const allTimeSlots = [
        "8:00 AM", "9:00 AM", "10:00 AM",
        "11:00 AM", "12:00 PM", "1:00 PM",
        "2:00 PM", "3:00 PM", "4:00 PM",
        "5:00 PM", "6:00 PM"
    ];

    const isSaturday = selectedDate.getDay() === 6;
    const timeSlots = isSaturday
        ? allTimeSlots.filter(t => {
            const index = allTimeSlots.indexOf(t);
            return index <= 7;
        })
        : allTimeSlots;

    useEffect(() => {
        const fetchAvailability = async () => {
            if (!barberId) return;

            const startOfDay = new Date(selectedDate);
            startOfDay.setHours(0, 0, 0, 0);

            const endOfDay = new Date(selectedDate);
            endOfDay.setHours(23, 59, 59, 999);

            const { data, error } = await supabase
                .from('appointments')
                .select('start_time')
                .eq('barber_id', barberId)
                .gte('start_time', startOfDay.toISOString())
                .lte('start_time', endOfDay.toISOString());

            if (error) {
                console.error('Error fetching availability:', error);
            } else {
                if (data) {
                    const booked = data.map(app => {
                        const date = new Date(app.start_time);
                        return format(date, 'h:mm a');
                    });
                    setBookedSlots(booked);
                }
            }
        };

        fetchAvailability();
    }, [selectedDate, barberId]);

    const handleDateChange = (value: any) => {
        const newDate = value as Date;
        setSelectedDate(newDate);
        setDate(newDate);
        setTime(null);
    };

    const handleTimeSelect = (slot: string) => {
        setTime(slot);
    };

    return (
        <section id="date">
            <div className={styles.content}>
                <h2>Select date & time</h2>
                <div className={styles.selectionContainer}>
                    <div className={styles.calendarContainer}>
                        <div className={styles.monthLabel}>
                            {format(selectedDate, 'MMMM yyyy')}
                        </div>
                        <Calendar
                            onChange={handleDateChange}
                            value={selectedDate}
                            className={styles.reactCalendar}
                            tileClassName={styles.calendarTile}
                            minDate={new Date()}
                            tileDisabled={({ date }) => date.getDay() === 0} // 0 is Sunday
                        />
                    </div>
                    <div className={styles.slotsContainer}>
                        <h3>Available time slots</h3>
                        <div className={styles.slotsGrid}>
                            {timeSlots.map((slot) => {
                                const isBooked = bookedSlots.includes(slot);
                                return (
                                    <button
                                        key={slot}
                                        disabled={isBooked}
                                        className={`${styles.timeSlot} ${time === slot ? styles.selectedSlot : ''} ${isBooked ? styles.booked : ''}`}
                                        onClick={() => !isBooked && handleTimeSelect(slot)}
                                    >
                                        {slot}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className={styles.btnContainers}>
                    <Link href="/dashboard/book/barber"><Button variant="back">Back</Button></Link>
                    <Link
                        href={!date || !time ? '#' : "/dashboard/book/details"}
                        onClick={(e) => {
                            if (!date || !time) e.preventDefault();
                        }}
                    >
                        <Button
                            variant="next"
                            disabled={!date || !time}
                            style={{ opacity: (!date || !time) ? 0.5 : 1 }}
                        >
                            Next
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
