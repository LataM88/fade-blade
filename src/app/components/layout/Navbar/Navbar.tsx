import styles from './Navbar.module.css';

const Navbar = () => {
    return (
        <nav className={styles.navbar}>
            <div className="container">
                <div className={styles.logo}>Fade Blade</div>
            </div>
        </nav>
    );
};

export default Navbar;
