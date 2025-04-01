import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useParams } from 'react-router-dom';
import { getPdsUrl, getProfile } from '../data/entries';

interface Profile {
    displayName?: string;
    handle: string;
    avatar?: string;
    did: string;
}

interface ProfileContextType {
    handleOrDid: string;
    profile: Profile | null;
    loading: boolean;
    error: Error | null;
    pdsUrl: string | null;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
    const { handleOrDid } = useParams();
    const [pdsUrl, setPdsUrl] = useState<string | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!handleOrDid) {
                setError(new Error('No handle or DID provided'));
                setLoading(false);
                return;
            }

            try {
                const profile = await getProfile(handleOrDid);
                setProfile(profile);
                const pdsUrl = await getPdsUrl(profile.did);
                setPdsUrl(pdsUrl);
            } catch (err) {
                setError(err instanceof Error ? err : new Error('Failed to fetch profile'));
            } finally {
                setLoading(false);
            }
        };

        setLoading(true);
        fetchProfile();
    }, [handleOrDid]);

    return (
        <ProfileContext.Provider value={{
            handleOrDid: handleOrDid || '',
            profile,
            loading,
            error,
            pdsUrl
        }}>
            {children}
        </ProfileContext.Provider>
    );
}

export function useProfile() {
    const context = useContext(ProfileContext);
    if (context === undefined) {
        throw new Error('useProfile must be used within a ProfileProvider');
    }
    return context;
} 