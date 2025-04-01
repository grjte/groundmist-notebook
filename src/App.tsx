import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import EssayList from './components/EssayList';
import EssayView from './components/EssayView';
import { ProfileProvider } from './contexts/ProfileContext';
import { NotebookProvider } from './contexts/NotebookContext';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/rocksfall.bsky.social" replace />} />

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
