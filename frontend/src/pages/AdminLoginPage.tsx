import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAuth } from '../hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Lock, Mail, ShieldCheck, HeartPulse } from 'lucide-react';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // If already authenticated, redirect to dashboard
  if (isAuthenticated) {
    navigate({ to: '/admin/dashboard' });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate a brief loading state for UX
    await new Promise((resolve) => setTimeout(resolve, 600));

    const success = login(email, password);
    if (success) {
      navigate({ to: '/admin/dashboard' });
    } else {
      setError('Invalid email or password. Please try again.');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-700/30 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-gold-400/10 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl" />
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-emerald-600/20 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl" />

      {/* Medical cross decoration */}
      <div className="absolute top-10 right-10 opacity-5 text-white">
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-24 bg-white rounded-sm" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-6 bg-white rounded-sm" />
          </div>
        </div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo & Title */}
        <div className="text-center mb-8 animate-fade-up">
          <div className="inline-block mb-4">
            <div className="w-20 h-20 mx-auto rounded-full overflow-hidden border-4 border-gold-400 shadow-gold-hover">
              <img
                src="/assets/generated/gs-medical-logo.dim_512x512.png"
                alt="G&S Medical Logo"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <h1 className="font-display text-3xl font-bold text-white mb-1">G&S MEDICAL</h1>
          <p className="text-emerald-300 text-sm">Admin Dashboard</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden animate-fade-up" style={{ animationDelay: '0.1s' }}>
          {/* Card header */}
          <div className="bg-gradient-to-r from-emerald-700 to-emerald-800 px-8 py-5 flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <ShieldCheck size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-white font-semibold text-lg">Admin Login</h2>
              <p className="text-emerald-200 text-xs">Secure access to your dashboard</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-8 py-7 space-y-5">
            {/* Error message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                <Lock size={14} className="flex-shrink-0" />
                {error}
              </div>
            )}

            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-emerald-900 font-medium text-sm">
                Email Address
              </Label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  required
                  className="pl-9 border-emerald-200 focus:border-emerald-500 focus:ring-emerald-400 rounded-xl"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-emerald-900 font-medium text-sm">
                Password
              </Label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="pl-9 pr-10 border-emerald-200 focus:border-emerald-500 focus:ring-emerald-400 rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-400 hover:text-emerald-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl py-2.5 font-semibold transition-all duration-200 shadow-emerald hover:shadow-emerald-hover"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <ShieldCheck size={16} />
                  Sign In to Dashboard
                </span>
              )}
            </Button>

            {/* Back to site */}
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => navigate({ to: '/' })}
                className="text-sm text-emerald-600 hover:text-emerald-800 transition-colors flex items-center gap-1 mx-auto"
              >
                <HeartPulse size={13} />
                Back to G&S MEDICAL Website
              </button>
            </div>
          </form>
        </div>

        <p className="text-center text-emerald-400 text-xs mt-6">
          © {new Date().getFullYear()} G&S MEDICAL. Secure Admin Portal.
        </p>
      </div>
    </div>
  );
}
