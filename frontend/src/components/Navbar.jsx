import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Cloud, User, LogOut } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <Cloud className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-800">Weather App</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">
              Ciao, <span className="font-semibold">{user?.nome}</span>
            </span>
            
            <Link
              to="/profile"
              className="flex items-center space-x-1 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition"
            >
              <User className="h-5 w-5" />
              <span>Profilo</span>
            </Link>
            
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 px-3 py-2 rounded-md text-red-600 hover:bg-red-50 transition"
            >
              <LogOut className="h-5 w-5" />
              <span>Esci</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
