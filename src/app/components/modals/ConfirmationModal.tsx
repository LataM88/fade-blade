import styles from './Modal.module.css';

interface ConfirmationModalProps {
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message?: string;
}

export default function ConfirmationModal({ onClose, onConfirm, title = "Confirm Action", message = "Are you sure?" }: ConfirmationModalProps) {
    return (
        <div className={styles.overlay}>
            <div className={styles.modal} style={{ maxWidth: '400px', textAlign: 'center' }}>
                <h2 className={styles.title}>{title}</h2>
                <p style={{ marginBottom: '20px', color: '#ccc' }}>{message}</p>

                <div className={styles.actions} style={{ justifyContent: 'center', marginTop: '1rem', }}>
                    <button onClick={onClose} className={styles.cancelBtn}>
                        Cancel
                    </button>
                    <button onClick={onConfirm} className={styles.submitBtn} style={{ background: 'white', color: '#d32f2f', border: 'none' }}>
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}
