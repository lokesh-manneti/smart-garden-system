import { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Leaf, CalendarDays, Bug, Lightbulb } from 'lucide-react';

export default function Navbar() {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation(); // To highlight the active tab

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Helper to highlight active links
  const isActive = (path) => location.pathname === path ? "text-garden-600 border-b-2 border-garden-600" : "text-gray-600 hover:text-garden-600";

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo Section */}
          <Link to="/" className="flex items-center space-x-2 mr-8">
            <div className="bg-garden-100 p-2 rounded-lg">
              <Leaf className="w-6 h-6 text-garden-600" />
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight hidden sm:block">Smart Garden</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex-1 flex items-center space-x-6">
            {isAuthenticated && (
              <>
                <Link to="/dashboard" className={`flex items-center h-16 font-medium transition-colors ${isActive('/dashboard')}`}>
                  <Leaf className="w-4 h-4 mr-2" /> Garden
                </Link>
                <Link to="/schedule" className={`flex items-center h-16 font-medium transition-colors ${isActive('/schedule')}`}>
                  <CalendarDays className="w-4 h-4 mr-2" /> Schedule
                </Link>
                <Link to="/doctor" className={`flex items-center h-16 font-medium transition-colors ${isActive('/doctor')}`}>
                  <Bug className="w-4 h-4 mr-2" /> Plant Doctor
                </Link>
                <Link to="/tips" className={`flex items-center h-16 font-medium transition-colors ${isActive('/tips')}`}>
                  <Lightbulb className="w-4 h-4 mr-2" /> Tips
                </Link>
              </>
            )}
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <button 
                onClick={handleLogout}
                className="bg-red-50 text-red-600 px-4 py-2 rounded-lg font-medium hover:bg-red-100 transition-colors text-sm"
              >
                Sign Out
              </button>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-garden-600 font-medium transition-colors">Sign In</Link>
                <Link to="/login" className="bg-garden-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-garden-700 transition-colors shadow-sm">Get Started</Link>
              </>
            )}
          </div>
          
        </div>
      </div>
    </nav>
  );
}