import { useEffect,useState } from "react";
import axios from "axios";
import {Navigate} from "react-router-dom";

const ProtectedRoute = ({children,allowedRole,redirectTo="/user/login"})=>{
    const[loading,setLoading]=useState(true);
    const[user,setUser]=useState(null);
    
  useEffect(()=>{
         axios.get("http://localhost:5000/api/auth/me",{
              withCredentials: true,
    })
      .then(res => {
        setUser(res.data.user);
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
