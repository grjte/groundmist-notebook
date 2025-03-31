import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Essay } from '../types';
import { getPublicEntries } from '../data/entries';

interface EssayContextType {
    essays: Essay[];
    loading: boolean;
    error: Error | null;
}

const EssayContext = createContext<EssayContextType | undefined>(undefined);

export function EssayProvider({ children }: { children: ReactNode }) {
    const [essays, setEssays] = useState<Essay[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchEssays = async () => {
            try {
                // TODO: add pagination
                const fetchedEssays = await getPublicEntries("rocksfall.bsky.social");
                setEssays(fetchedEssays);
            } catch (err) {
                setError(err instanceof Error ? err : new Error('Failed to fetch essays'));
            } finally {
                setLoading(false);
            }
        };
        fetchEssays();
    }, []);

    return (
        <EssayContext.Provider value={{ essays, loading, error }}>
            {children}
        </EssayContext.Provider>
    );
}

export function useEssays() {
    const context = useContext(EssayContext);
    if (context === undefined) {
        throw new Error('useEssays must be used within an EssayProvider');
    }
    return context;
} 