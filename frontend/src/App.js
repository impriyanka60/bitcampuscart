import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PostItem from './pages/PostItem';
import MyListings from './pages/MyListings';
import MessMenu from './pages/MessMenu';
import BusSchedule from './pages/BusSchedule';
import NetworkSetup from './pages/NetworkSetup';
import Complaints from './pages/Complaints';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/post" element={<PostItem />} />
          <Route path="/my-listings" element={<MyListings />} />
          <Route path="/mess" element={<MessMenu />} />
          <Route path="/bus" element={<BusSchedule />} />
          <Route path="/network" element={<NetworkSetup />} />
          <Route path="/complaints" element={<Complaints />} />





        </Routes>
      </div>
    </Router>
  );
}

export default App;
