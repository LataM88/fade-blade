import Image, { StaticImageData } from "next/image";
import styles from './BarberProfile.module.css';
import Button from "../ui/Button";

interface BarberProfileProps {
    barber: {
        name: string;
        name2: string;
        photo: StaticImageData;
        description: string;
    }
}

export default function BarberProfile({ barber }: BarberProfileProps) {
    return (
        <section id='barber-profile' className={styles.barberProfile}>
            <div className={styles.container}>
                <img src="/images/logo.svg" alt="" height={80} width={90} />
            </div>
            <div className={styles.barberHead}>
                <div className={styles.leftPhoto}>
                    <Image src={barber.photo} alt={barber.name} />
                </div>
                <div className={styles.rightContent}>
                    <div className={styles.barberName}>{barber.name}</div>
                    <div className={styles.barberDescription}>{barber.description}</div>
                </div>
            </div>
            <div className={styles.barberInfoContainer}>
                <h2>More information about {barber.name2}</h2>
                <div className={styles.barberInfo}>
                    <div className={styles.bioInfo}>
                        <div className={styles.bioInfoHeader}>
                            <h2>Bio & Experience</h2>
                        </div>
                        <p>32 years old, owner and dedicated <br /> master barber</p>
                        <p>More than a decade of professional <br /> experience in top barbershops in Kraków <br /> and Warsaw</p>
                        <p>Participant and finalist in national barber <br /> competitions</p>
                        <p>Completed advanced training in classic <br /> barbering, modern fades, and beard care</p>
                        <p>Mentor to younger barbers; leads <br /> workshops and training sessions</p>
                    </div>
                    <div className={styles.specializationInfo}>
                        <h2>Specializations</h2>
                        <div className={styles.specializationList}>
                            <img src="../../images/service/service-logo.svg" alt="logo" />
                            <p>Skin Fade Expert</p>
                        </div>
                        <div className={styles.specializationList}>
                            <img src="../../images/service/service-logo.svg" alt="logo" />
                            <p>Beard Shaping & Grooming Pro</p>
                        </div>
                        <div className={styles.specializationList}>
                            <img src="../../images/service/service-logo.svg" alt="logo" />
                            <p>Classic Cuts - Pompadour, Undercut</p>
                        </div>
                        <div className={styles.specializationList}>
                            <img src="../../images/service/service-logo.svg" alt="logo" />
                            <p>Hot Towel Shave</p>
                        </div>
                        <div className={styles.specializationList}>
                            <img src="../../images/service/service-logo.svg" alt="logo" />
                            <p>Personal Styling & Consultation</p>
                        </div>
                        <div className={styles.specializationList}>
                            <img src="../../images/service/service-logo.svg" alt="logo" />
                            <p>Hairstyle for face shape</p>
                        </div>
                    </div>
                    <div className={styles.opinionInfo}>
                        <h2>Opinions</h2>
                        <div className={styles.opinionGrade}>
                            <span>4.9</span>
                            <div className={styles.Stars}>
                                {[...Array(5)].map((_, index) => (
                                    <img key={index} src="../../images/star.svg" alt="stars" />
                                ))}
                            </div>
                            <p>(532)</p>
                        </div>
                        <div className={styles.opinionList}>
                            <div className={styles.opinionItem}>
                                <img src="../../images/profile.png" alt="profile" />
                                <p>Best fade in town - <br />precision is unmatched.</p>
                            </div>
                            <div className={styles.opinionItem}>
                                <img src="../../images/profile.png" alt="profile" />
                                <p>Max really knows style and <br />always gives great advice</p>
                            </div>
                            <div className={styles.opinionItem}>
                                <img src="../../images/profile.png" alt="profile" />
                                <p>Professional,freindly, and skilled. <br />I always come back</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.barberWork}>
                    <h2>Max's Masterpieces</h2>
                    <div className={styles.barberWorkList}>
                        <div className={styles.barberWorkItem}>
                            <img src="../../images/gallery/haircut1.jpg" alt="haircut" />
                        </div>
                        <div className={styles.barberWorkItem}>
                            <img src="../../images/gallery/haircut4.jpg" alt="haircut" />
                        </div>
                        <div className={styles.barberWorkItem}>
                            <img src="../../images/gallery/haircut5.jpg" alt="haircut" />
                        </div>
                    </div>
                    <div className={styles.barberWorkButton}>
                        <Button variant='barber-work'>See all work</Button>
                    </div>
                </div>
                <div className={styles.barberAppointment}>
                    <h2>Meet Max</h2>
                    <div className={styles.rightSection}>
                        <div className={styles.rightSectionContent}>
                            <div className={styles.rightHead}>
                                <h3>Book appointment</h3>
                                <p>Click on an avaible date,<br />select a time, <br />and book your appointment </p>
                            </div>
                            <Button variant='barber-appointment'>Start Booking Now</Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}