import React, { useEffect } from 'react'
import '../../styles/Profile.css';
import { Link, useParams } from "react-router-dom";
import axios from "axios"
import { useState } from 'react';
const Profile = () => {
  const{id}=useParams();
  const [profiles,setProfiles]=useState(null)
  const [videos,setVideos]=useState([]);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState('');
  useEffect(()=>{
    let isMounted = true;

    axios.get(`https://localhost:5000/api/food-partner/${id}`)
    .then(res=>{
      if (!isMounted) return;
      setProfiles(res.data.foodPartner)
      setVideos(res.data.foodPartner?.foodItems || [])
    })
    .catch((err) => {
      if (!isMounted) return;
      setProfiles(null);
      setVideos([]);
      setError(err.response?.data?.message || 'Food partner profile not found');
    })
    .finally(() => {
      if (isMounted) {
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  },[id])

  if (loading) {
    return (
      <div className="profile-root">
        <div className="profile-header card">
          Loading store profile...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-root">
        <div className="profile-header card">
          <div className="profile-info">
            <h2 className="business-name">Store unavailable</h2>
            <p>{error}</p>
            <Link to="/home" className="address">Back to home</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-root">
      <header className="profile-header card">
       
          <img className="profile-avatar" src='https://images.unsplash.com/photo-1772927253232-91fb2e5c30b0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDM3fHRvd0paRnNrcEdnfHxlbnwwfHx8fHw%3D' alt=''/>
      
        <div className="profile-info">
          <h2 className="business-name">{profiles?.businessName}</h2>
          <button className="address">{profiles?.address}</button>
        </div>
      </header>

      <section className="profile-stats">
        <div className="stat card">
          <div className="label">{profiles?.totalMeals}</div>
          <div className="value">43</div>
        </div>
        <div className="stat card">
          <div className="label">{profiles?.customerServe}</div>
          <div className="value">15K</div>
        </div>
      </section>

      <section className="videos-grid">
  {videos.map((v,index) => (
    <div key={v.id||index} className="video-tile">
      <video
        className="video-media"
        src={v.video}
        muted
        loop
        playsInline
        onMouseEnter={(e) => e.target.play()}
        onMouseLeave={(e) => {
          e.target.pause();
          e.target.currentTime = 0;
        }}
      />
    </div>
  ))}
</section>
    </div>
  )
}

export default Profile
