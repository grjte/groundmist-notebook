import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import EssayList from './components/EssayList';
import EssayView from './components/EssayView';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<EssayList />} />
          <Route path="essay/:id" element={<EssayView />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
