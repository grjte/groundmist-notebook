import { useParams, Link } from 'react-router-dom';
import { useProfile } from '../contexts/ProfileContext';

export default function Header() {
    const { handleOrDid } = useParams();
    const { profile } = useProfile();

    return (
        <header className="w-full border-b border-gray-200">
            <div className="container mx-auto px-4 py-6 flex items-center gap-4">
                {profile?.avatar && (
                    <img
                        src={profile.avatar}
                        alt={profile.handle}
                        className="w-10 h-10 rounded-full"
                    />
                )}
                {!profile?.avatar && (
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500 text-lg">
                            {profile?.handle?.[0]?.toUpperCase()}
                        </span>
                    </div>
                )}
                <div className="flex flex-col">
                    <Link
                        to={`/${handleOrDid}`}
                        className="text-2xl font-serif font-bold text-blue-500 hover:text-blue-600"
                    >
                        {profile?.displayName || profile?.handle || 'Loading...'}
                    </Link>
                    <a
                        href={`https://bsky.app/profile/${profile?.handle}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-gray-500 hover:text-gray-700 no-underline visited:text-gray-500"
                    >
                        @{profile?.handle}
                    </a>
                </div>
            </div>
        </header>
    );
} 