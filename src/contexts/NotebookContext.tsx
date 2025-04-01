import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Essay } from '../types';
import { getPublicEntries } from '../data/entries';
import { useProfile } from './ProfileContext';

interface NotebookContextType {
    essays: Essay[];
    loading: boolean;
    error: Error | null;
}

const NotebookContext = createContext<NotebookContextType | undefined>(undefined);

export function NotebookProvider({ children }: { children: ReactNode }) {
    const { loading: profileLoading, profile, pdsUrl } = useProfile();
    const [essays, setEssays] = useState<Essay[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchEssays = async () => {
            if (!profile || !pdsUrl) {
                setError(new Error('DID and pdsUrl are required to load notebook content'));
                setLoading(false);
                return;
            }

            try {
                const fetchedEssays = await getPublicEntries(profile.did, pdsUrl);
                setEssays(fetchedEssays);
            } catch (err) {
                setError(err instanceof Error ? err : new Error('Failed to fetch essays'));
            } finally {
                setLoading(false);
            }
        };

        setLoading(true);
        if (!profileLoading) {
            fetchEssays();
        }
    }, [profileLoading]);

    return (
        <NotebookContext.Provider value={{
            essays,
            loading,
            error,
        }}>
            {children}
        </NotebookContext.Provider>
    );
}

export function useNotebook() {
    const context = useContext(NotebookContext);
    if (context === undefined) {
        throw new Error('useNotebook must be used within a NotebookProvider');
    }
    return context;
} 