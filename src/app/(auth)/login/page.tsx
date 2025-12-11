import styles from "./login.module.css";
import Button from "@/app/components/ui/Button";
import { Facebook, Apple, Chrome } from 'lucide-react';
import Link from "next/link";

export default function Login() {
    return (
        <section id="login" className={styles.section}>
            <div className={styles.mainContainer}>
                <div className={styles.container}>
                    <div className={styles.leftImageContainer}>
                        <div className={styles.leftImageContainerUpper}></div>
                        <div className={styles.leftImageContainerLower}></div>
                    </div>
                    <div className={styles.rightContainer}>
                        <div className={styles.rightContainerContent}>
                            <h1>Sharper Looks Ahead <br />Sign In to <span className={styles.separator}>Fade&Blade</span></h1>
                            <p>Back for Another Clean Cut</p>
                        </div>
                        <div className={styles.rightFormContainer}>
                            <form action="login">
                                <p>Email</p>
                                <input type="email" />
                                <p>Password</p>
                                <input type="password" />

                                <div className={styles.rememberMeContainer}>
                                    <input type="checkbox" id="rememberMe" />
                                    <label htmlFor="rememberMe">Remember me</label>
                                </div>

                                <div className={styles.rightFormButton}>
                                    <Button variant="sign-in">Sign In</Button>
                                </div>
                                <div className={styles.rightFormOtherSign}>
                                    <p>Or sign in with</p>
                                    <div className={styles.rightFormSocials}>
                                        <Facebook size={50} />
                                        <Apple size={50} />
                                        <Chrome size={50} />
                                    </div>
                                </div>
                                <div className={styles.rightFormActions}>
                                    <div className={styles.rightFormActionsColumn}>
                                        <p>Don't have an account?</p>
                                        <Link href="signup" className={styles.yellowLink}>Sign Up</Link>
                                    </div>
                                    <div className={styles.rightFormActionsColumn}>
                                        <p>Forgot Password?</p>
                                        <Link href="reset-password" className={styles.yellowLink}>Reset your password</Link>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section >
    );
}