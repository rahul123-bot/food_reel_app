import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/variables.css';
import '../styles/auth.css';
import { useState } from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';

export default function FoodPartnerLogin() {
  const [partnerData, setPartnerData] = useState({
    businessName: '',
    contactName: '',
    email: '',
    phone: '',
    address: '',
    password: ''
  });
  const navigate = useNavigate();
  const handleChange = (e) => {
    setPartnerData({
      ...partnerData,
      [e.target.name]: e.target.value
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response = await axios.post('https://localhost:5000/api/auth/food-partner/register', partnerData, {
        withCredentials: true
      });
      console.log('FoodPartner registered successfully:', response.data);
      if (response.data?._id) {
        localStorage.setItem('foodPartnerId', response.data._id);
      }
      navigate('/create-food');
      
    }catch (error) {
      console.error(error.response?.data || error.message);
    }
  }; 
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>FoodPartner Register</h1>
        <p className="subtitle">Register your restaurant or kitchen to start receiving orders.</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div>
            <label>Business name</label>
            <input type="text" name="businessName" placeholder="Restaurant name" value={partnerData.businessName} onChange={handleChange} />
          </div>

          <div>
            <label>Contact name</label>
            <input type="text" name="contactName" placeholder="Full name" value={partnerData.contactName} onChange={handleChange} />
          </div>

          <div>
            <label>Contact email</label>
            <input type="email" name="email" placeholder="partner@example.com" value={partnerData.email} onChange={handleChange} />
          </div>

          <div>
            <label>Phone</label>
            <input type="tel" name="phone" placeholder="+1 555 555 5555" value={partnerData.phone} onChange={handleChange} />
          </div>

          <div>
            <label>Address</label>
            <input type="text" name="address" placeholder="Street, City, ZIP" value={partnerData.address} onChange={handleChange} />
          </div>

          <div>
            <label>Password</label>
            <input type="password" name="password" placeholder="Create a password" value={partnerData.password} onChange={handleChange} />
          </div>

          <div className="auth-actions">
            <button type="submit" className="btn">Create FoodPartner account</button>
            <button type="submit"  className="btn ghost">Sign in</button>
          </div>

          <div className="footer-links small">
            <Link to="/user/register">Register as normal user</Link>
          </div>

          <div className="footer-note small">We'll review your application before activation.</div>
        </form>
      </div>
    </div>
  );
} 

