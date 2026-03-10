import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Leaf } from 'lucide-react';

export default function Login() {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const { login, register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLoginMode) {
        await login(email, password);
        toast.success("Welcome back to your garden!");
        navigate('/dashboard'); // Redirect to dashboard on success
      } else {
        await register(email, password);
        toast.success("Account created! Please log in.");
        setIsLoginMode(true); // Switch back to login mode
        setPassword(''); // Clear password for security
      }
    } catch (error) {
      // Extract the error message from our FastAPI backend
      const errorMsg = error.response?.data?.detail || "Something went wrong.";
      toast.error(errorMsg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-garden-50 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        
        {/* Logo and Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-garden-100 p-3 rounded-full mb-4">
            <Leaf className="w-8 h-8 text-garden-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            {isLoginMode ? 'Sign in to your garden' : 'Create your digital garden'}
          </h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-garden-500 focus:border-garden-500 outline-none transition-all"
              placeholder="gardener@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-garden-500 focus:border-garden-500 outline-none transition-all"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-garden-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-garden-700 transition-colors"
          >
            {isLoginMode ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setIsLoginMode(!isLoginMode)}
            className="text-sm text-garden-600 hover:text-garden-800 font-medium transition-colors"
          >
            {isLoginMode 
              ? "Don't have an account? Sign up" 
              : "Already have an account? Sign in"}
          </button>
        </div>

      </div>
    </div>
  );
}