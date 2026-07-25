import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
// import Login from './pages/Login';
// import Signup from './pages/Signup';
// import Dashboard from './pages/Dashboard';
// import CreateRoadmap from './pages/CreateRoadmap';
// import RoadmapDetail from './pages/RoadmapDetail';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        {/* <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/roadmaps/new" element={<CreateRoadmap />} />
        <Route path="/roadmaps/:id" element={<RoadmapDetail />} /> */}
      </Routes>
    </>
  );
}

export default App;