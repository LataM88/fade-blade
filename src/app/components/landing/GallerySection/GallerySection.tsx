import styles from './GallerySection.module.css';
import Button from '../../ui/Button';

export default function GallerySection() {
    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <h1>Gallery</h1>
            </div>
            <div className={styles.upperWrapper}>
                <div className={styles.upperImage1}></div>
                <div className={styles.upperImage2}></div>
                <div className={styles.upperImage3}></div>
                <div className={styles.upperImage4}></div>
            </div>
            <div className={styles.lowerWrapper}>
                <div className={styles.lowerImage1}></div>
                <div className={styles.lowerImage2}></div>
                <div className={styles.lowerImage3}></div>
                <div className={styles.lowerImage4}></div>
            </div>
            <div className={styles.btnWrapper}>
                <Button variant="gallery">See more photos</Button>
            </div>
        </section>
    );
}
