import styles from './Footer.module.css';
import { Facebook, Instagram, Youtube } from 'lucide-react';
import Link from 'next/link';

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.footerContent}>
                <div className={styles.footerContentLeft}>
                    <img src="/images/logo.svg" alt="" height={80} width={90} />
                    <p>Premium barbershop in the <br /> heart of downtown, <br /> Quality cuts, real <br /> conversations, zero BS</p>
                    <p>Social Links</p>
                    <div className={styles.footerContentLeftSocialLinks}>
                        <Facebook size={47} />
                        <Instagram size={47} />
                        <Youtube size={47} />
                    </div>
                </div>
                <div className={styles.footerContentLeftCenter}>
                    <div className={styles.footerContentLeftCenterHead}>
                        <p>Quick Links:</p>
                    </div>
                    <div className={styles.footerContentLeftCenterLinks}>
                        <Link href="#home">Home</Link>
                        <Link href="#services">Services</Link>
                        <Link href="#photos">Gallery</Link>
                        <Link href="#team">Barbers</Link>
                        <Link href="#contact">Contact</Link>
                    </div>
                </div>
                <div className={styles.footerContentRightCenter}>
                    <div className={styles.footerContentRightCenterHead}>
                        <p>Services:</p>
                    </div>
                    <div className={styles.footerContentRightCenterLinks}>
                        <p>Classic Haircut</p>
                        <p>Beard Trim</p>
                        <p>Hot Towel Shave</p>
                        <p>Buzz Cut</p>
                        <p>VIP Package</p>
                        <p>Hair/Beard Coloring</p>
                        <Link href="#services">View All Services</Link>
                    </div>
                </div>
                <div className={styles.footerContentRight}>
                    <div className={styles.footerContentRightHead}>
                        <p>Contact Info:</p>
                    </div>
                    <div className={styles.footerContentRightLinks}>
                        <p>Address: Warsaw,Drawska 99</p>
                        <p>Phone: +48 111 222 333</p>
                        <p>Email: fdbarber@gmail.com</p>
                        <div className={styles.footerContentRightHours}>
                            <p>Hours:</p>
                            <ul className={styles.hoursList}>
                                <li>Mon-Fri: 8:00 - 6:00 PM</li>
                                <li>Sat-Sun: 9:00 - 3:00 PM</li>
                                <li>Sun: Closed</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container">
                <p style={{ color: 'var(--primary-yellow)' }}>&copy; {new Date().getFullYear()} Fade Blade. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
