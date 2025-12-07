import styles from './ReviewsSection.module.css';

export default function ReviewsSection() {
    return (
        <section id="opinions" className={styles.section}>
            <div className={styles.container}>
                <h1>What are they saying about us?</h1>
            </div>
            <div className={styles.wrapper}>
                <div className={styles.content}>
                    <div className={styles.reviews}>
                        <div className={styles.review}>
                            <h4>Franklin.S</h4>
                            <p>Excellent work, it's hard to <br /> imagine a better result.</p>
                            <div className={styles.reviewFooter}>
                                <div className={styles.reviewImage}></div>
                                <div className={styles.stars}>
                                    {[...Array(5)].map((_, i) => (
                                        <img key={i} src="/images/star.svg" alt="star" className={styles.star} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.content}>
                    <div className={styles.reviews}>
                        <div className={styles.review}>
                            <h4>Franklin.S</h4>
                            <p>Excellent work, it's hard to <br /> imagine a better result.</p>
                            <div className={styles.reviewFooter}>
                                <div className={styles.reviewImage}></div>
                                <div className={styles.stars}>
                                    {[...Array(5)].map((_, i) => (
                                        <img key={i} src="/images/star.svg" alt="star" className={styles.star} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.content}>
                    <div className={styles.reviews}>
                        <div className={styles.review}>
                            <h4>Franklin.S</h4>
                            <p>Excellent work, it's hard to <br /> imagine a better result.</p>
                            <div className={styles.reviewFooter}>
                                <div className={styles.reviewImage}></div>
                                <div className={styles.stars}>
                                    {[...Array(5)].map((_, i) => (
                                        <img key={i} src="/images/star.svg" alt="star" className={styles.star} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
