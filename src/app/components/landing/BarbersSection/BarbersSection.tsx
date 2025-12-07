import styles from './BarbersSection.module.css';
import Button from '../../ui/Button';

export default function BarbersSection() {
    return (
        <section id="team" className={styles.section}>
            <div className={styles.container}>
                <h1>Our Barbers</h1>
            </div>
            <div className={styles.barbers}>
                <div className={styles.barberImgage1}>
                    <div className={styles.hoverOverlay}>
                        <h3>Founder & Master Barber</h3>
                        <p>combines passion, experience and precision in every detail.</p>
                        <Button variant="portfolio">Portfolio</Button>
                    </div>
                    <div className={styles.barberInfo1}>
                        <h2>Max</h2>
                        <p>Founder & Barber</p>
                    </div>
                </div>
                <div className={styles.barberImgage2}>
                    <div className={styles.hoverOverlay}>
                        <h3>Founder & Master Barber</h3>
                        <p>combines passion, experience and precision in every detail.</p>
                        <Button variant="portfolio">Portfolio</Button>
                    </div>
                    <div className={styles.barberInfo2}>
                        <h2>Kevin</h2>
                        <p>Founder & Barber</p>
                    </div>
                </div>
                <div className={styles.barberImgage3}>
                    <div className={styles.hoverOverlay}>
                        <h3>Founder & Master Barber</h3>
                        <p>combines passion, experience and precision in every detail.</p>
                        <Button variant="portfolio">Portfolio</Button>
                    </div>
                    <div className={styles.barberInfo3}>
                        <h2>Jake</h2>
                        <p>Founder & Barber</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
