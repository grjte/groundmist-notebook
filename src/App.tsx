import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import EssayList from './components/EssayList';
import EssayView from './components/EssayView';
import { EssayProvider } from './contexts/EssayContext';

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/:handleOrDid/*" element={
            <EssayProvider>
              <Routes>
                <Route index element={<EssayList />} />
                <Route path="essay/:id" element={<EssayView />} />
              </Routes>
            </EssayProvider>
          } />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
