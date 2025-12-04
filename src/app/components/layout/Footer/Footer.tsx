import styles from './Footer.module.css';

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className="container">
                <p>&copy; {new Date().getFullYear()} Fade Blade. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
