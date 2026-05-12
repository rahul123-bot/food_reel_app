import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/variables.css';
import '../styles/auth.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function LoginUser() {
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''        
  });
  const navigate = useNavigate();
  const handleChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response = await axios.post('http://localhost:5000/api/auth/user/login', loginData , {
        withCredentials: true
      });
      console.log('User logged in successfully:', response.data);
     

      navigate('/home');
      
    } catch (error) {
      console.error(error.response?.data || error.message);
    }
  };



  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Sign in</h1>
        <p className="subtitle">Welcome back — sign in to continue.</p>

        <form className="auth-form"onSubmit={handleSubmit}>
          <div>
            <label>Email</label>
            <input type="email" name="email" placeholder="you@example.com" onChange={handleChange} />
          </div>

          <div>
            <label>Password</label>
            <input type="password" name="password" placeholder="Your password" onChange={handleChange} />
          </div>

          <div className="auth-actions">
            <button type="submit" className="btn">Sign in</button>
            <button type="button" className="btn ghost">Create account</button>
          </div>

          <div className="footer-links small">
            <Link to="/user/register">Register as normal user</Link>
            <span className="sep">•</span>
            <Link to="/food-partner/register">Register as food partner</Link>
          </div>

          <div className="footer-note small">Forgot password? Contact support.</div>
        </form>
      </div>
    </div>
  );
}
