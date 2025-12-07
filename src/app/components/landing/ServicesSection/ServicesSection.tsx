import styles from './ServicesSection.module.css';

export default function ServicesSection() {
    return (
        <section id="services" className={styles.section}>
            <div className={styles.container}>
                <h1>Our Services</h1>
            </div>
            <div className={styles.mainWrapper}>
                <div className={styles.services}>
                    <div className={styles.serviceItem}>
                        <div className={styles.leftContent}>
                            <div className={styles.serviceImage}></div>
                            <div className={styles.textContent}>
                                <h3>Classic Haircut</h3>
                                <p>precise cut tailored to the client’s face shape and style.</p>
                            </div>
                        </div>
                        <div className={styles.servicePrice}>30€</div>
                    </div>
                    <div className={styles.serviceItem}>
                        <div className={styles.leftContent}>
                            <div className={styles.serviceImage}></div>
                            <div className={styles.textContent}>
                                <h3>Beard Trim & Shaping</h3>
                                <p>beard styling, contour shaving, and care with balm or oil.</p>
                            </div>
                        </div>
                        <div className={styles.servicePrice}>15€</div>
                    </div>
                    <div className={styles.serviceItem}>
                        <div className={styles.leftContent}>
                            <div className={styles.serviceImage}></div>
                            <div className={styles.textContent}>
                                <h3>Hot Towel Shave</h3>
                                <p>traditional straight-razor shave with a hot towel and facial massage.</p>
                            </div>
                        </div>
                        <div className={styles.servicePrice}>25€</div>
                    </div>
                    <div className={styles.serviceItem}>
                        <div className={styles.leftContent}>
                            <div className={styles.serviceImage}></div>
                            <div className={styles.textContent}>
                                <h3>Buzz Cut</h3>
                                <p>quick and even clipper cut with one length.</p>
                            </div>
                        </div>
                        <div className={styles.servicePrice}>20€</div>
                    </div>
                    <div className={styles.serviceItem}>
                        <div className={styles.leftContent}>
                            <div className={styles.serviceImage}></div>
                            <div className={styles.textContent}>
                                <h3>VIP Package</h3>
                                <p>haircut + beard + grooming + head massage</p>
                            </div>
                        </div>
                        <div className={styles.servicePrice}>55€</div>
                    </div>
                    <div className={styles.serviceItem}>
                        <div className={styles.leftContent}>
                            <div className={styles.serviceImage}></div>
                            <div className={styles.textContent}>
                                <h3>Camouflage/Hair or Beard Coloring</h3>
                                <p>subtle gray blending for a natural look.</p>
                            </div>
                        </div>
                        <div className={styles.servicePrice}>40€</div>
                    </div>
                </div>
                <div className={styles.rightContent}>
                    <div className={styles.rightContentImage}></div>
                </div>
            </div>
        </section>
    );
}
