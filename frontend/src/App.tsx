import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignupPage from './pages/Signup';
import LoginPage from './pages/Login';
import HomePage from './pages/Home';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
      </Routes>
    </Router>
  );
};

export default App;