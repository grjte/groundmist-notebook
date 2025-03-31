import { Link } from 'react-router-dom';
import { useEssays } from '../contexts/EssayContext';

export default function EssayList() {
    const { essays, loading, error } = useEssays();

    if (loading) {
        return <div>Loading essays...</div>;
    }

    if (error) {
        return <div>Error loading essays: {error.message}</div>;
    }

    return (
        <div className="w-full space-y-8">
            {essays.map((essay) => (
                <article key={essay.id} className="w-full border-b border-gray-200 pb-8">
                    <Link to={`/essay/${essay.id}`} className="group block w-full">
                        <h2 className="text-2xl font-serif font-bold text-gray-900 group-hover:text-gray-700 mb-2">
                            {essay.title}
                        </h2>
                        <div className="text-sm text-gray-500 mb-4">
                            {new Date(essay.date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </div>
                        <p className="text-gray-600 leading-relaxed">
                            {essay.preview}
                        </p>
                        <div className="mt-4 text-sm font-medium text-gray-700 group-hover:text-gray-900">
                            Read more →
                        </div>
                    </Link>
                </article>
            ))}
        </div>
    );
} 