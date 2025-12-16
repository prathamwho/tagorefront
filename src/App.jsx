// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Discover from './pages/Discover';
// import Profile from './pages/Profile';
// import PaperView from './pages/PaperView'; // We are about to create this

// function App() {
//   return (
//     <Router>
//       <Routes>
//         {/* The Landing/Home Page */}
//         <Route path="/" element={<Discover />} />
        
//         {/* The User Profile Dashboard */}
//         <Route path="/profile" element={<Profile />} />
        
//         {/* The Dynamic Project Details Page */}
//         <Route path="/project/:id" element={<PaperView />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Discover from './pages/Discover';
import Profile from './pages/Profile';
import PaperView from './pages/PaperView';
import FundProject from './pages/FundProject'; 
import WorkspaceSearch from './pages/WorkspaceSearch';
import ProjectWorkspace from './pages/ProjectWorkspace';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Discover />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/project/:id" element={<PaperView />} />
        <Route path="/workspace" element={<WorkspaceSearch />} />
        <Route path="/workspace/ide" element={<ProjectWorkspace />} />
        
        {/* The Payment Page */}
        <Route path="/fund/:id" element={<FundProject />} />
      </Routes>
    </Router>
  );
}

export default App;