// src/App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignInSignUp from './components/SignInSignUp';
import Dashboard from './components/Dashboard';
import Testing from './components/Testing';
import Profile from './components/Profile';
import BlogDetails from './components/pages/BlogDetails';
import Home from './components/pages/Home';
import ProfileBlogDetails from './components/pages/ProfileBlogDetails';
import EditProfile from './components/pages/EditProfile'
import AdminLogin from './components/Admin/AdminLogin';
import AdminDashboard from './components/Admin/AdminDashBoard';
import UserBlogs from './components/Admin/UserBlogs';




function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignInSignUp />} />
        <Route
          path="/dashboard"
          element={
              <Dashboard />  
          }
        />
       <Route
          path="/testing"
          element={
              <Testing />
          }
        />
       <Route
          path="/profile"
          element={
              <Profile />
          }
        />
       <Route
          path="/edit_profile"
          element={
              <EditProfile />
          }
        />
       <Route
          path="/admin-login"
          element={
              <AdminLogin />
          }
        />
       <Route
          path="/admin-Dashboard"
          element={
              <AdminDashboard />
          }
        />

        {/* <Route path="/home" element={<Home />} /> */}
        <Route path="/read/:id" element={<BlogDetails />} />
        <Route path="/read/profile/:id" element={<ProfileBlogDetails />} />
        <Route path="/user/:userId" element={<UserBlogs />} />

     
      </Routes>
      
    </Router>
  );
}

export default App;