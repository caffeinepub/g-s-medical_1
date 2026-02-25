import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useSellerLogin } from '../hooks/useQueries';
import { useSellerAuth } from '../hooks/useSellerAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Lock, Mail, HeartPulse, Store, Loader2 } from 'lucide-react';

export default function SellerLoginPage() {
  const navigate = useNavigate();
  const sellerLogin = useSellerLogin();
  const { login, isAuthenticated } = useSellerAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  if (isAuthenticated) {
    navigate({ to: '/seller/dashboard' });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please enter your email and password.');
      return;
    }

    try {
      const token = await sellerLogin.mutateAsync({ email, password });
      if (token) {
        login(token);
        navigate({ to: '/seller/dashboard' });
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } catch (err: any) {
      const msg = err?.message || '';
      if (msg.includes('pending')) {
        setError('Your account is pending admin approval. Please wait for approval before logging in.');
      } else if (msg.includes('inactive')) {
        setError('Your account has been deactivated. Please contact support.');
      } else {
        setError('Invalid email or password. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-900 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-700/30 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-gold-400/10 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl" />

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-up">
          <div className="inline-block mb-4">
            <div className="w-20 h-20 mx-auto rounded-full overflow-hidden border-4 border-gold-400 shadow-lg">
              <img
                src="/assets/generated/gs-medical-logo.dim_512x512.png"
                alt="G&S Medical Logo"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <h1 className="font-display text-3xl font-bold text-white mb-1">G&S MEDICAL</h1>
          <p className="text-emerald-300 text-sm">Seller Portal</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden animate-fade-up" style={{ animationDelay: '0.1s' }}>
          {/* Card header */}
          <div className="bg-gradient-to-r from-emerald-700 to-emerald-800 px-8 py-5 flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Store size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-white font-semibold text-lg">Seller Login</h2>
              <p className="text-emerald-200 text-xs">Access your seller dashboard</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="px-8 py-7 space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                <Lock size={14} className="flex-shrink-0" />
                {error}
              </div>
            )}

            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-emerald-900 font-medium text-sm">Email Address</Label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }}
                  placeholder="seller@example.com"
                  required
                  className="pl-9 border-emerald-200 focus:border-emerald-500 rounded-xl"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-emerald-900 font-medium text-sm">Password</Label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  placeholder="Enter your password"
                  required
                  className="pl-9 pr-10 border-emerald-200 focus:border-emerald-500 rounded-xl"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-400 hover:text-emerald-600 transition-colors">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={sellerLogin.isPending}
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl py-2.5 font-semibold"
            >
              {sellerLogin.isPending ? (
                <span className="flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin" />
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Store size={16} />
                  Sign In to Dashboard
                </span>
              )}
            </Button>

            <div className="text-center pt-1 space-y-2">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{' '}
                <button type="button" onClick={() => navigate({ to: '/seller/signup' })}
                  className="text-emerald-600 hover:text-emerald-800 font-medium transition-colors">
                  Register as Seller
                </button>
              </p>
              <button type="button" onClick={() => navigate({ to: '/' })}
                className="text-xs text-emerald-500 hover:text-emerald-700 flex items-center gap-1 mx-auto transition-colors">
                <HeartPulse size={12} />
                Back to G&S MEDICAL Website
              </button>
            </div>
          </form>
        </div>

        <p className="text-center text-emerald-400 text-xs mt-6">
          © {new Date().getFullYear()} G&S MEDICAL. Seller Portal.
        </p>
      </div>
    </div>
  );
}
