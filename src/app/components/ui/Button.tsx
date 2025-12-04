import styles from './Button.module.css';
import React, { ButtonHTMLAttributes } from 'react';

type ButtonProps = {
    variant?: 'book-appointment' | 'secondary' | 'reservation' | 'login';
} & ButtonHTMLAttributes<HTMLButtonElement>;

const Button: React.FC<ButtonProps> = ({ children, variant = 'book-appointment', ...props }) => {
    return (
        <button className={`${styles.btn} ${styles[variant]}`} {...props}>
            {children}
        </button>
    );
};

export default Button;
