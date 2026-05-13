import { useEffect,useState } from "react";
import {Navigate} from "react-router-dom";
import api from "../lib/api";

const ProtectedRoute = ({children,allowedRole,redirectTo="/user/login"})=>{
    const[loading,setLoading]=useState(true);
    const[user,setUser]=useState(null);
    
  useEffect(()=>{
         api.get("/api/auth/me")
      .then(res => {
        setUser(res.data.user);
        if (res.data?.token) {
          if (res.data.user?.role === 'foodPartner') {
            localStorage.setItem('foodPartnerToken', res.data.token);
          } else {
            localStorage.setItem('userToken', res.data.token);
          }
        }
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => setLoading(false));
      
  }, []);
  if (loading) return <p>Checking auth...</p>;
  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }
  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to={redirectTo} replace />;
  }
    return children;
}
export default ProtectedRoute
