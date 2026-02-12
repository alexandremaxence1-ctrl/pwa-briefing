import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Desk } from './pages/Desk';
import { MissionEditor } from './components/mission/MissionEditor';
import { MissionViewer } from './components/mission/MissionViewer';
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Desk />} />
        <Route path="/mission/:id" element={<MissionEditor />} />
        <Route path="/view/:id" element={<MissionViewer />} />
      </Routes>
    </Router>
  )
}

export default App
