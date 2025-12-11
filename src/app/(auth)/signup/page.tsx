import styles from "./signup.module.css";
import Button from "@/app/components/ui/Button";
import Link from "next/link";

export default function Signup() {
    return (
        <section id="signup" className={styles.section}>
            <div className={styles.mainContainer}>
                <div className={styles.container}>
                    <h1>Become Part of the <br /><span className={styles.separator}>Fade&Blade</span>Crew</h1>
                    <p>Create your account and book your next cut in seconds</p>
                    <div className={styles.leftFormContainer}>
                        <form action="signup">
                            <p>Name</p>
                            <input type="text" />
                            <p>Second name</p>
                            <input type="text" />
                            <p>Email</p>
                            <input type="email" />
                            <p>Password</p>
                            <input type="password" />
                            <p>Phone number</p>
                            <input type="tel" />
                        </form>
                    </div>
                    <div className={styles.leftFormButton}>
                        <Button variant="sign-up">Sign Up</Button>
                    </div>
                    <div className={styles.leftFormAlready}>
                        <p>Already have an account? <span><Link href="login">Sign In</Link></span></p>
                    </div>
                </div>
                <div className={styles.rightFormContainer}>
                    <img src="../images/about/about-photo1.jpg" alt="bg-signup" />
                    <img src="../images/about/about-photo2.jpg" alt="bg-signup" />
                </div>
            </div>
        </section>
    );
}