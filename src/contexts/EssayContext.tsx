import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useParams } from 'react-router-dom';
import { Essay } from '../types';
import { getPublicEntries } from '../data/entries';

interface EssayContextType {
    essays: Essay[];
    loading: boolean;
    error: Error | null;
    handleOrDid: string;
}

const EssayContext = createContext<EssayContextType | undefined>(undefined);

export function EssayProvider({ children }: { children: ReactNode }) {
    const { handleOrDid } = useParams();
    const [essays, setEssays] = useState<Essay[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchEssays = async () => {
            if (!handleOrDid) {
                setError(new Error('No handle or DID provided'));
                setLoading(false);
                return;
            }

            try {
                const fetchedEssays = await getPublicEntries(handleOrDid);
                setEssays(fetchedEssays);
            } catch (err) {
                setError(err instanceof Error ? err : new Error('Failed to fetch essays'));
            } finally {
                setLoading(false);
            }
        };

        setLoading(true);
        fetchEssays();
    }, [handleOrDid]);

    return (
        <EssayContext.Provider value={{ essays, loading, error, handleOrDid: handleOrDid || '' }}>
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