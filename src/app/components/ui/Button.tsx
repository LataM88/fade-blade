import styles from './Button.module.css';
import React, { ButtonHTMLAttributes } from 'react';

type ButtonProps = {
    variant?: 'book-appointment' | 'portfolio' | 'gallery' | 'booking-cta' | 'contact' | 'sign-in' | 'barber-work' | 'barber-appointment';
} & ButtonHTMLAttributes<HTMLButtonElement>;

const Button: React.FC<ButtonProps> = ({ children, variant = 'book-appointment', ...props }) => {
    return (
        <button className={`${styles.btn} ${styles[variant]}`} {...props}>
            {children}
        </button>
    );
};

export default Button;
