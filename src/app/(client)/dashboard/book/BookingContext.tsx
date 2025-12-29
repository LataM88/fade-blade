'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface BookingState {
    serviceIds: string[];
    barberId: string | null;
    date: Date | null;
    time: string | null;
    userDetails: {
        firstName: string;
        lastName: string;
        phone: string;
        email: string;
        note: string;
        reminders: boolean;
    };
}

interface BookingContextType extends BookingState {
    setServiceIds: (ids: string[]) => void;
    setBarberId: (id: string | null) => void;
    setDate: (date: Date | null) => void;
    setTime: (time: string | null) => void;
    setUserDetails: (details: BookingState['userDetails']) => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: ReactNode }) {
    const [serviceIds, setServiceIds] = useState<string[]>([]);
    const [barberId, setBarberId] = useState<string | null>(null);
    const [date, setDate] = useState<Date | null>(null);
    const [time, setTime] = useState<string | null>(null);
    const [userDetails, setUserDetails] = useState<BookingState['userDetails']>({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        note: '',
        reminders: false
    });

    return (
        <BookingContext.Provider value={{
            serviceIds,
            barberId,
            date,
            time,
            userDetails,
            setServiceIds,
            setBarberId,
            setDate,
            setTime,
            setUserDetails
        }}>
            {children}
        </BookingContext.Provider>
    );
}

export function useBooking() {
    const context = useContext(BookingContext);
    if (context === undefined) {
        throw new Error('useBooking must be used within a BookingProvider');
    }
    return context;
}
