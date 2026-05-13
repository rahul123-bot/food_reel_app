import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/variables.css';
import '../styles/auth.css';
import { useState } from 'react';
import {useNavigate} from 'react-router-dom';
import api from '../lib/api';

export default function RegisterUser() {
  const [userData, setUserData] = useState({
    fullname: '',
    email: '',
    phone: '',
    address: '',
    password: ''        
  });
  const navigate = useNavigate();
  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value
    });
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      let response = await api.post('/api/auth/user/register', userData);
      console.log('User registered successfully:', response.data);
      if (response.data?.token) {
        localStorage.setItem('userToken', response.data.token);
      }
      navigate('/home');
    } catch (error) {
      console.error(error.response?.data||error.message);
    }
    
  };
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Create an account</h1>
        <p className="subtitle">Register as a user to order food quickly.</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div>
            <label>Full name</label>
            <input type="text" name="fullname" placeholder="Your name" value={userData.fullname}  onChange={handleChange} />
          </div>

          <div>
            <label>Email</label>
            <input type="email" name="email" placeholder="you@example.com" value={userData.email}  onChange={handleChange} />
          </div>

          <div>
            <label>Phone</label>
            <input type="tel" name="phone" placeholder="+1 555 555 5555" value={userData.phone} onChange={handleChange} />
          </div>

          <div>
            <label>Address</label>
            <input type="text" name="address" placeholder="Street, City, ZIP" value={userData.address}  onChange={handleChange} />
          </div>

          <div>
            <label>Password</label>
            <input type="password" name="password" placeholder="Choose a password" value={userData.password} onChange={handleChange} />
          </div>

          <div className="auth-actions">
            <button type="submit" className="btn" >Sign up</button>
            <button type="submit"  className="btn ghost">Sign in</button>
          </div>

          <div className="footer-links small">
            <Link to="/food-partner/register">Register as food partner</Link>
          </div>

          <div className="footer-note small">By continuing you agree to our terms and privacy.</div>
        </form>
      </div>
    </div>
  );
}
