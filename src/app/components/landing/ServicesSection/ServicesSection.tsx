import styles from './ServicesSection.module.css';

export default function ServicesSection() {
    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <h1>Our Services</h1>
            </div>
            <div className={styles.services}>
                <div className={styles.service1}>
                    <h3>Classic Haircut</h3>
                    <p>precise cut tailored to the client’s face shape and style.</p>
                </div>
                <div className={styles.service2}>
                    <h3>Beard Trim & Shaping</h3>
                    <p>beard styling, contour shaving, and care with balm or oil.</p>
                </div>
                <div className={styles.service3}>
                    <h3>Hot Towel Shave</h3>
                    <p>traditional straight-razor shave with a hot towel and facial massage.</p>
                </div>
                <div className={styles.service4}>
                    <h3>Buzz Cut</h3>
                    <p>quick and even clipper cut with one length.</p>
                </div>
                <div className={styles.service5}>
                    <h3>VIP Package</h3>
                    <p>haircut + beard + grooming + head massage</p>
                </div>
                <div className={styles.service6}>
                    <h3>Camouflage/Hair or Beard Coloring</h3>
                    <p>subtle gray blending for a natural look.</p>
                </div>
            </div>
        </section>
    );
}
