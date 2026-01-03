import { useState } from 'react';
import styles from './Modal.module.css';

interface Service {
    id: number;
    name: string;
    price: number;
}

interface EditPriceModalProps {
    service: Service;
    onClose: () => void;
    onSave: (newPrice: number) => void;
}

export default function EditPriceModal({ service, onClose, onSave }: EditPriceModalProps) {
    const [price, setPrice] = useState(service.price);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(Number(price));
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <h3>Edit Price - {service.name}</h3>
                    <button onClick={onClose}>&times;</button>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.field}>
                        <label>Price (€)</label>
                        <input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(Number(e.target.value))}
                            min="0"
                            step="1"
                            required
                        />
                    </div>

                    <div className={styles.actions}>
                        <button type="button" onClick={onClose} className={styles.backBtn}>
                            Cancel
                        </button>
                        <button type="submit" className={styles.submitBtn}>
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
