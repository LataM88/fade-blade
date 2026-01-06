'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import styles from './clients.module.css';
import { Trash2, Search } from 'lucide-react';
import ConfirmationModal from '@/app/components/modals/ConfirmationModal';

interface Client {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    last_visit: string | null;
}

export default function BarberClientsPage() {
    const [clients, setClients] = useState<Client[]>([]);
    const [filteredClients, setFilteredClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [clientToDelete, setClientToDelete] = useState<string | null>(null);

    useEffect(() => {
        fetchClients();
    }, []);

    useEffect(() => {
        if (!searchTerm) {
            setFilteredClients(clients);
        } else {
            const lowerTerm = searchTerm.toLowerCase();
            const filtered = clients.filter(client =>
                (client.first_name?.toLowerCase() || '').includes(lowerTerm) ||
                (client.last_name?.toLowerCase() || '').includes(lowerTerm)
            );
            setFilteredClients(filtered);
        }
    }, [searchTerm, clients]);

    const fetchClients = async () => {
        try {
            const res = await fetch('/api/barber/clients');
            if (res.ok) {
                const data = await res.json();
                setClients(data);
                setFilteredClients(data);
            } else {
                console.error("Failed to fetch clients");
            }
        } catch (error) {
            console.error("Error fetching clients:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = (clientId: string) => {
        setClientToDelete(clientId);
    };

    const confirmDelete = async () => {
        if (!clientToDelete) return;

        try {
            const res = await fetch(`/api/barber/clients?id=${clientToDelete}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                setClients(prev => prev.map(c => c.id === clientToDelete ? { ...c, last_visit: null } : c));
                setFilteredClients(prev => prev.map(c => c.id === clientToDelete ? { ...c, last_visit: null } : c));
            } else {
                alert('Failed to delete client');
            }
        } catch (error) {
            console.error('Error deleting client:', error);
            alert('Error deleting client');
        } finally {
            setClientToDelete(null);
        }
    };

    if (loading) return <div className={styles.container}>Loading clients...</div>;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>My Clients</h1>
                    <p className={styles.subtitle}>Manage your client base</p>
                </div>
                <div className={styles.searchContainer}>
                    <Search size={20} color="var(--primary-yellow)" />
                    <input
                        type="text"
                        placeholder="Search by name..."
                        className={styles.searchInput}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className={styles.tableContainer}>
                <div className={styles.tableHeaderRow}>
                    <span>Name</span>
                    <span>Email</span>
                    <span>Phone</span>
                    <span>Last Visit</span>
                    <span>Actions</span>
                </div>

                {filteredClients.map((client) => (
                    <div key={client.id} className={styles.tableRow}>
                        <span className={styles.clientName} data-label="Name">{client.first_name} {client.last_name}</span>
                        <span className={styles.clientInfo} data-label="Email">{client.email}</span>
                        <span className={styles.clientInfo} data-label="Phone">{client.phone || '-'}</span>
                        <span className={styles.clientInfo} data-label="Last Visit">
                            {client.last_visit ? new Date(client.last_visit).toLocaleDateString() : 'Never'}
                        </span>
                        <div className={styles.actions} data-label="Actions">
                            <button
                                className={`${styles.iconBtn} ${styles.deleteBtn}`}
                                onClick={() => handleDeleteClick(client.id)}
                                title="Delete Client"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {clientToDelete && (
                <ConfirmationModal
                    title="Remove Client"
                    message="Are you sure you want to permanently delete this client? This will remove their account and all data. This process cannot be undone."
                    onClose={() => setClientToDelete(null)}
                    onConfirm={confirmDelete}
                />
            )}
        </div>
    );
}
