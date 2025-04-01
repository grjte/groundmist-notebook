import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import EssayList from './components/EssayList';
import EssayView from './components/EssayView';
import { ProfileProvider } from './contexts/ProfileContext';
import { NotebookProvider } from './contexts/NotebookContext';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Welcome = () => {
  const [handle, setHandle] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (handle) {
      const cleanHandle = handle.replace('@', '');
      navigate(`/${cleanHandle}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-5 text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to Groundmist Notebook</h1>
      <p className="text-lg mb-8">
        A local-first content editor is available at{' '}
        <a
          href="https://editor.groundmist.xyz"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 underline"
        >
          editor.groundmist.xyz.
        </a>
        <br />
        Use it to create your own private notes and publish them to your PDS.
      </p>

      <div className="max-w-md w-full px-4">
        <h2 className="text-xl font-semibold mb-4">Read the public notebooks of atproto users.</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
            placeholder="Enter Bluesky handle or DID"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Search
          </button>
        </form>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/:handleOrDid/*" element={
          <ProfileProvider>
            <NotebookProvider>
              <Routes>
                <Route element={<Layout />}>
                  <Route index element={<EssayList />} />
                  <Route path="essay/:id" element={<EssayView />} />
                </Route>
              </Routes>
            </NotebookProvider>
          </ProfileProvider>
        } />
      </Routes>
    </Router>
  );
}

export default App;