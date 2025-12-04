import styles from './AboutSection.module.css';

export default function AboutSection() {
    return (
        <section className={styles.about}>
            <div className={styles.container}>
                <h1>About Us</h1>
            </div>
            <div className={styles.aboutContent}>
                <div className={`${styles.aboutImage} ${styles.aboutImage1}`}></div>
                <div className={`${styles.aboutImage} ${styles.aboutImage2}`}></div>
                <div className={`${styles.aboutImage} ${styles.aboutImage3}`}></div>
            </div>
            <div className={styles.aboutText}>
                <div className={`${styles.aboutDescription} ${styles.aboutDescription1}`}>
                    <h3>Our Story</h3>
                    <p>Started in 2018 by three <br />friends who ditched corporate <br /> life for clippers. We began <br /> small, grew organically, and <br /> built a loyal community. Today <br /> we're a team of 6 barbers <br /> who've served over 5,000 <br /> clients and counting.</p>
                </div>
                <div className={`${styles.aboutDescription} ${styles.aboutDescription2}`}>
                    <h3>What Sets Us Apart</h3>
                    <p>No gimmicks, just solid work and real <br /> conversations. We invest in continuous <br /> training and premium tools because <br /> your time and trust matter. Book online, <br /> show up on time, leave looking sharp - <br /> that's the experience every single time.</p>
                </div>
                <div className={`${styles.aboutDescription} ${styles.aboutDescription3}`}>
                    <h3>Our Skills & Experience</h3>
                    <p>Every barber brings years of <br /> hands-on experience and <br /> specialized training. From <br /> classic cuts to modern fades, <br /> beard sculpting to hot towel <br /> shaves - we've mastered the <br /> craft. We stay current with <br /> techniques while respecting <br /> timeless barbering traditions.</p>
                </div>
            </div>
        </section>
    );
}
