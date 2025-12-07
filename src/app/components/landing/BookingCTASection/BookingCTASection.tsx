import styles from './BookingCTASection.module.css';
import Button from '../../ui/Button';

export default function BookingCTASection() {
    return (
        <section id="booking" className={styles.section}>
            <div className={styles.container}>
                <h1>Your Path to the Perfect Cut</h1>
                <div className={styles.content}>
                    <div className={styles.contentHeader}>
                        <h2>Book Your Appointment in 4 Easy Steps</h2>
                        <div className={styles.contentSteps}>
                            <div className={styles.contentStep1}><p>1.Create account or login</p></div>
                            <div className={styles.contentStep2}><p>2.Choose Your Service & Barber</p></div>
                            <div className={styles.contentStep3}><p>3.Pick Your Perfect Time</p></div>
                            <div className={styles.contentStep4}><p>4.Confirm & Relax</p></div>
                        </div>
                        <div className={styles.contentButton}>
                            <Button variant="booking-cta">Book Appointment</Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
