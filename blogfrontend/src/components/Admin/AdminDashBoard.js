
import { useState, useEffect } from "react";
import Navbar from '../pages/Navbar';
import UserDetails from "../pages/UserDetails";

const AdminDashboard = () => {
    return (
      
        <div className="d-flex">
          <Navbar /> 
          <UserDetails/>
        </div>
    );
  };
  
  export default AdminDashboard;
  