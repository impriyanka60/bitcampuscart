import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import p from '../components/bit.avif';
import logo from '../components/download.jpg'
import { FaEnvelope, FaLock } from 'react-icons/fa';

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('http://localhost:5000/api/users/login', form);
      if (res.data && res.data.token) {
        localStorage.setItem('token', res.data.token);
        alert('Login Successful');
        navigate('/');
      } else {
        setError('Login failed: No token received');
      }
    } catch (err) {
      const message =
        err.response?.data?.message || 'Login failed. Please try again.';
      setError(message);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="left-side">
        <img src={p} alt="Campus" className="login-image" />
      </div>
      <div className="right-side">
        <div className="login-box">
          <img src={logo} alt="Logo" className="bit-logo" />
          <h1>Welcome to <span>BIT Camp-Cart</span></h1>
          <p className="tagline">Your Campus Marketplace</p>

          {error && <p className="error">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <FaEnvelope className="icon" />
              <input
                type="email"
                placeholder="College Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div className="input-group">
              <FaLock className="icon" />
              <input
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>
            <button type="submit">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
