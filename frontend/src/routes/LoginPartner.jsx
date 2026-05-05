import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/variables.css';
import '../styles/auth.css';
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginPartner() {
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
      let response = await axios.post('http://localhost:5000/api/auth/food-partner/login', loginData, {
        withCredentials: true
      });
      console.log('FoodPartner logged in successfully:', response.data);
      if (response.data?.foodPartner?._id) {
        localStorage.setItem('foodPartnerId', response.data.foodPartner._id);
      }
      navigate('/create-food');
    } catch (error) {
      console.error(error.response?.data || error.message);
    }
  };
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>FoodPartner Login</h1>
        <p className="subtitle">Access your partner dashboard and manage orders.</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div>
            <label>Email</label>
            <input type="email" name="email" placeholder="partner@example.com" value={loginData.email} onChange={handleChange} />
          </div>

          <div>
            <label>Password</label>
            <input type="password" name="password" placeholder="Your password" value={loginData.password} onChange={handleChange}  />
          </div>

          <div className="auth-actions">
            <button type="submit" className="btn">Sign in</button>
            <button type="button" className="btn ghost">Apply</button>
          </div>

          <div className="footer-links small">
            <Link to="/user/register">Register as normal user</Link>
            <span className="sep">•</span>
            <Link to="/food-partner/register">Register as food partner</Link>
          </div>

          <div className="footer-note small">Need help? Reach out to FoodPartner support.</div>
        </form>
      </div>
    </div>
  );
}
