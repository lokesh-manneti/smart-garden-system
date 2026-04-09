import { useState, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Leaf, CalendarDays, Bug, Lightbulb, LogOut, Sprout, Settings } from 'lucide-react';
import SettingsModal from './SettingsModal';

export default function Navbar() {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLink = (path, icon, label) => {
    const active = location.pathname === path;
    return (
      <Link
        to={path}
        className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
          active
            ? 'bg-garden-600/10 text-garden-700'
            : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100/60'
        }`}
      >
        {icon}
        <span className="hidden sm:inline">{label}</span>
      </Link>
    );
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="bg-gradient-to-br from-garden-500 to-teal-600 p-2 rounded-xl shadow-sm group-hover:shadow-md transition-all duration-200">
              <Sprout className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900 tracking-tight hidden sm:block">
              Smart<span className="text-garden-600">Garden</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-1">
            {isAuthenticated && (
              <>
                {navLink('/dashboard', <Leaf className="w-4 h-4" />, 'Garden')}
                {navLink('/schedule',  <CalendarDays className="w-4 h-4" />, 'Schedule')}
                {navLink('/doctor',    <Bug className="w-4 h-4" />, 'Doctor')}
                {navLink('/tips',      <Lightbulb className="w-4 h-4" />, 'Tips')}
              </>
            )}
          </div>

          {/* Auth */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <button 
                  onClick={() => setIsSettingsOpen(true)}
                  className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-all"
                  title="Settings"
                >
                  <Settings className="w-5 h-5" />
                </button>
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors">Sign In</Link>
                <Link to="/login" className="btn-primary text-sm !px-5 !py-2">Get Started</Link>
              </>
            )}
          </div>
          
        </div>
      </div>
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </nav>
  );
}