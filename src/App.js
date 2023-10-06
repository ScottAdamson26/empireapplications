import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Hero from './components/Hero';
import MainBody from './components/MainBody';
import JobApplicationPage from './components/JobApplicationPage';
import AdminPage from './components/AdminPage';


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<><Hero /><MainBody /></>} />
          <Route path="/apply/:jobTitle" element={<JobApplicationPage />} />
          <Route path="/admin" element={<AdminPage/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
