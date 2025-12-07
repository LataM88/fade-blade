import styles from './HeroSection.module.css';
import Button from '../../ui/Button';

const HeroSection = () => {
    return (
        <section id="hero" className={styles.hero}>
            <div className="container">
                <h1>A style that gets the job done <br />
                    A cut that makes an impression</h1>
                <p>The best barber shop in town, delivering confidence with every cut.</p>
                <Button variant="book-appointment">Book Appointment</Button>
                <p>5+years <span className={styles.separator}>|</span> Pro Barbers <span className={styles.separator}>|</span> 5000+ clients</p>
            </div>
        </section>
    );
};

export default HeroSection;
