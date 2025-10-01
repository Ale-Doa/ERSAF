import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Cloud, User, LogOut, Settings } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex justify-between h-14 sm:h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center space-x-1 sm:space-x-2">
              <Cloud className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
              <span className="text-base sm:text-xl font-bold text-gray-800">Weather App</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4">
            <span className="text-gray-700 text-xs sm:text-sm md:text-base hidden sm:inline">
              Ciao, <span className="font-semibold">{user?.nome}</span>
            </span>
            
            <Link
              to="/alert-settings"
              className="flex items-center space-x-0 sm:space-x-1 px-2 sm:px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition"
              title="Allerte"
            >
              <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden md:inline text-sm">Allerte</span>
            </Link>
            
            <Link
              to="/profile"
              className="flex items-center space-x-0 sm:space-x-1 px-2 sm:px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition"
              title="Profilo"
            >
              <User className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden md:inline text-sm">Profilo</span>
            </Link>
            
            <button
              onClick={handleLogout}
              className="flex items-center space-x-0 sm:space-x-1 px-2 sm:px-3 py-2 rounded-md text-red-600 hover:bg-red-50 transition"
              title="Esci"
            >
              <LogOut className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden md:inline text-sm">Esci</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
