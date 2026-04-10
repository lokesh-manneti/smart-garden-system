import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Sprout, Mail, Lock, ArrowRight, User } from 'lucide-react';

export default function Login() {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [marketingConsent, setMarketingConsent] = useState(true);
  const [loading, setLoading] = useState(false);

  const { login, register } = useContext(AuthContext);
  const navigate = useNavigate();

  const getPasswordStrength = (pw) => {
    if (!pw) return 0;
    let strength = 0;
    if (pw.length >= 8) strength++;
    if (/\d/.test(pw)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(pw)) strength++;
    return strength;
  };

  const pwdStrength = getPasswordStrength(password);
  const strengthLabels = ['Weak', 'Weak', 'Medium', 'Strong'];
  const strengthColors = ['bg-gray-300', 'bg-red-400', 'bg-amber-400', 'bg-garden-500'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLoginMode) {
        await login(email, password);
        toast.success("Welcome back to your garden!");
        navigate('/dashboard');
      } else {
        await register(email, password, firstName, lastName, marketingConsent);
        toast.success("Account created! Please log in.");
        setIsLoginMode(true);
        setPassword('');
      }
    } catch (error) {
      const errorMsg = error.response?.data?.detail || "Something went wrong.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden surface-floor">
      {/* Background orbs */}
      <div className="absolute top-20 right-[20%] w-72 h-72 rounded-full bg-garden-200/25 blur-3xl animate-pulse-soft" />
      <div className="absolute bottom-20 left-[10%] w-96 h-96 rounded-full bg-teal-200/15 blur-3xl animate-pulse-soft" style={{ animationDelay: '1s' }} />

      {/* Card */}
      <div className="relative w-full max-w-md mx-4 animate-fade-in-up">
        <div className="glass rounded-4xl shadow-ambient p-8 sm:p-10 ghost-border">

          {/* Logo & Header */}
          <div className="flex flex-col items-center mb-8">
            <div className="botanical-gradient p-3.5 rounded-2xl shadow-lg mb-5">
              <Sprout className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-botanical-primary tracking-editorial">
              {isLoginMode ? 'Welcome back' : 'Create your garden'}
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              {isLoginMode ? 'Sign in to manage your plants' : 'Start your digital gardening journey'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLoginMode && (
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">First Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text" required={!isLoginMode}
                      className="input-premium !pl-10 text-sm" placeholder="Jane"
                      value={firstName} onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">Last Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text" required={!isLoginMode}
                      className="input-premium !pl-10 text-sm" placeholder="Doe"
                      value={lastName} onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email" required
                  className="input-premium !pl-10 text-sm" placeholder="gardener@example.com"
                  value={email} onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="password" required
                  className="input-premium !pl-10 text-sm" placeholder="••••••••"
                  value={password} onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {!isLoginMode && password && (
                <div className="mt-2.5">
                  <div className="flex gap-1.5 mb-1.5">
                    {[1, 2, 3].map((level) => (
                      <div key={level} className={`h-1.5 w-full rounded-full transition-colors duration-300 ${pwdStrength >= level ? strengthColors[pwdStrength] : 'bg-gray-200'}`} />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 font-medium text-right">
                    Strength: <span className={pwdStrength === 3 ? 'text-garden-600' : 'text-gray-600'}>{strengthLabels[pwdStrength]}</span>
                  </p>
                </div>
              )}
            </div>

            {!isLoginMode && (
              <label className="flex items-start gap-2.5 mt-2 cursor-pointer group">
                <div className="relative flex items-center pt-0.5">
                  <input type="checkbox" className="sr-only" checked={marketingConsent} onChange={(e) => setMarketingConsent(e.target.checked)} />
                  <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${marketingConsent ? 'bg-botanical-primary border-botanical-primary' : 'border-gray-300 group-hover:border-botanical-primary/60'}`}>
                    <svg className={`w-3 h-3 text-white transition-opacity ${marketingConsent ? 'opacity-100' : 'opacity-0'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  </div>
                </div>
                <span className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors">I agree to receive Daily Garden Digest emails and tips.</span>
              </label>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full !py-3 !text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {isLoginMode ? 'Sign In' : 'Create Account'}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200/60" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white/70 px-3 text-gray-400 font-medium">or</span>
            </div>
          </div>

          {/* Toggle Mode */}
          <button
            type="button"
            onClick={() => setIsLoginMode(!isLoginMode)}
            className="w-full text-center text-sm text-gray-500 hover:text-botanical-primary font-medium transition-colors py-2"
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