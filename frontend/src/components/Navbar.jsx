import { useState, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Leaf, CalendarDays, Activity, Lightbulb, LogOut, Sprout, Settings } from 'lucide-react';
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

  const navItems = [
    { path: '/dashboard', icon: Leaf,         label: 'Garden' },
    { path: '/schedule',  icon: CalendarDays, label: 'Schedule' },
    { path: '/doctor',    icon: Activity,     label: 'Doctor' },
    { path: '/tips',      icon: Lightbulb,    label: 'Tips' },
  ];

  return (
    <>
      <nav className="sticky top-0 z-50 glass ghost-border border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="botanical-gradient p-2 rounded-xl shadow-sm group-hover:shadow-md transition-all duration-200">
                <Sprout className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-botanical-on-surface tracking-editorial hidden sm:block">
                Smart<span className="text-botanical-primary">Garden</span>
              </span>
            </Link>

            {/* Navigation Links */}
            <div className="flex items-center gap-1">
              {isAuthenticated && navItems.map(({ path, icon: Icon, label }) => {
                const active = location.pathname === path;
                return (
                  <Link
                    key={path}
                    to={path}
                    className={`relative flex flex-col items-center gap-0.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      active
                        ? 'text-botanical-primary'
                        : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100/60'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline text-xs">{label}</span>
                    {/* Active dot indicator */}
                    {active && (
                      <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-botanical-primary" />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Auth Controls */}
            <div className="flex items-center gap-2">
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
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-all duration-200"
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
      </nav>
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </>
  );
}