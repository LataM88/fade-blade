import styles from "./reset-password.module.css";
import Button from "@/app/components/ui/Button";

export default function ResetPassword() {
    return (
        <section id="reset-password" className={styles.section}>
            <div className={styles.container}>
                <h1>Reset your <span className={styles.separator}>password</span></h1>
                <div className={styles.formContainer}>
                    <form action="reset">
                        <p>Email</p>
                        <input type="email" />
                        <Button variant="reset-password">Reset your password</Button>
                    </form>
                </div>
            </div>
        </section>
    );
}