import styles from "./profile.module.css";
import ProfileForm from "./ProfileForm";
import { getUserProfile } from "@/app/actions/user";

export default async function Profile() {
    const user = await getUserProfile();

    return (
        <section id="profile">
            <div className={styles.profileContainer}>
                <h2>My profile</h2>
                <div className={styles.profileContent}>
                    {/* Accessing user profile logic here */}
                    <ProfileForm user={user} />
                </div>
            </div>
        </section>
    );
}
