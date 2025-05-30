import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ErrorBoundary from './component/errorboundaries/ErrorBoundary';
import Home from './pages/home/Home';
import Error from './pages/error/Error';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Navbar from './component/navbar/Navbar';
import Dashboard from './pages/dashboard/Dashboard';
import Profile from './pages/profile/Profile';

const App = () => {
  
  return (
    <BrowserRouter>
      <Navbar />
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<Error />} />
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default App;