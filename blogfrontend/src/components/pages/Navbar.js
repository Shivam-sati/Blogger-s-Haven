import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Home, User, PenSquare, LogOut } from 'lucide-react';

const Navbar = ({ onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const auth = localStorage.getItem('isAuthenticated');
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await fetch('http://localhost:8080/api/auth/logout', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
        });
        
        if (!response.ok) throw new Error('Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('isAuthenticated');
      setIsMobileMenuOpen(false);
      navigate('/');
    }
  };

  const navItems = [
    { path: '/dashboard', label: 'Home', icon: <Home className="w-5 h-5" /> },
    { path: '/profile', label: 'Profile', icon: <User className="w-5 h-5" /> },
    { path: '/testing', label: 'Post', icon: <PenSquare className="w-5 h-5" /> },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="fixed top-4 left-4 z-50 lg:hidden">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-lg bg-white shadow-md"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <nav className={`
        fixed top-0 left-0 h-full w-72 bg-white shadow-xl z-40
        transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 transition-transform duration-300 ease-in-out
      `}>
        {/* Logo Section */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-center space-x-3">
          <span className="text-4xl text-indigo-500">✱</span>
          <span className="text-2xl font-bold text-gray-800">Blogger</span>
        </div>

        {/* Navigation Links */}
        <div className="py-6 h-[calc(100vh-160px)] overflow-y-auto">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) => `
                    flex items-center px-6 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors
                    ${isActive ? 'bg-indigo-50 text-indigo-600 border-r-4 border-indigo-600' : ''}
                  `}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </NavLink>
              </li>
            ))}

            {/* Logout Button */}
            {auth && (
              <li>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-6 py-3 text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-5 h-5 mr-3" />
                  <span className="font-medium">Logout</span>
                </button>
              </li>
            )}
          </ul>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-200 text-center text-sm text-gray-600">
          © 2024 Blogger Inc.
        </div>
      </nav>

      {/* Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Navbar;