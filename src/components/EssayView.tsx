import { useParams, Navigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { essays } from '../data/essays';

export default function EssayView() {
    const { id } = useParams();
    const essay = essays.find(e => e.id === id);

    if (!essay) {
        return <Navigate to="/" replace />;
    }

    return (
        <article className="w-full max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">
                    {essay.title}
                </h1>
                <div className="text-gray-500">
                    {new Date(essay.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}
                </div>
            </div>

            <div className="prose prose-slate lg:prose-lg max-w-none text-gray-900">
                <div className="markdown-content">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {essay.content}
                    </ReactMarkdown>
                </div>
            </div>
        </article>
    );
} 