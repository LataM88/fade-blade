import styles from './Navbar.module.css';
import Button from '../../ui/Button';

const Navbar = () => {
    return (
        <nav className={styles.navbar}>
            <div className="container">
                <div className={styles.navContainer}>
                    <div className={styles.logo}></div>
                    <div className={styles.navLinks}>
                        <div className={styles.navLinksUpper}>
                            <a href="#hero">Home</a>
                            <a href="#about">About</a>
                            <a href="#team">Our Team</a>
                            <a href="#services">Services</a>
                        </div>
                        <div className={styles.navLinksLower}>
                            <a href="#photos">Photos</a>
                            <a href="#opinions">Opinions</a>
                            <a href="#booking">How to book</a>
                            <a href="#contact">Contact</a>
                        </div>
                    </div>
                    <Button variant="sign-in">Sign In</Button>
                </div>
            </div>
        </nav>
    );
};


export default Navbar;