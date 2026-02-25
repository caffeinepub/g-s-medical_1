import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useRegisterCustomer } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Eye, EyeOff, Lock, Mail, User, Phone,
  HeartPulse, CheckCircle, Loader2, UserPlus
} from 'lucide-react';

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
}

const defaultForm: FormData = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  phone: '',
};

export default function CustomerSignUpPage() {
  const navigate = useNavigate();
  const registerCustomer = useRegisterCustomer();

  const [form, setForm] = useState<FormData>(defaultForm);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [serverError, setServerError] = useState('');

  const update = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
    setServerError('');
  };

  const validate = (): boolean => {
    const newErrors: Partial<FormData> = {};
    if (!form.name.trim()) newErrors.name = 'Full name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Invalid email address';
    if (!form.password) newErrors.password = 'Password is required';
    else if (form.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (!form.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!form.phone.trim()) newErrors.phone = 'Phone number is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;

    try {
      const result = await registerCustomer.mutateAsync({
        name: form.name,
        email: form.email,
        password: form.password,
        phone: form.phone,
      });

      if (result === 'ok') {
        navigate({ to: '/customer/login', search: { registered: 'true' } as any });
      } else if (result === 'emailAlreadyExists') {
        setServerError('An account with this email already exists. Please login instead.');
      } else {
        setServerError('Registration failed. Please try again.');
      }
    } catch (err: any) {
      setServerError(err?.message || 'Registration failed. Please try again.');
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
          <p className="text-emerald-300 text-sm">Create Your Customer Account</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden animate-fade-up" style={{ animationDelay: '0.1s' }}>
          {/* Card header */}
          <div className="bg-gradient-to-r from-emerald-700 to-emerald-800 px-8 py-5 flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <UserPlus size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-white font-semibold text-lg">Customer Sign Up</h2>
              <p className="text-emerald-200 text-xs">Join G&S MEDICAL today</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="px-8 py-7 space-y-5">
            {serverError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                <Lock size={14} className="flex-shrink-0" />
                {serverError}
              </div>
            )}

            {/* Full Name */}
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-emerald-900 font-medium text-sm">Full Name *</Label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500" />
                <Input
                  id="name"
                  value={form.name}
                  onChange={update('name')}
                  placeholder="Your full name"
                  className={`pl-9 border-emerald-200 focus:border-emerald-500 rounded-xl ${errors.name ? 'border-red-400' : ''}`}
                />
              </div>
              {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-emerald-900 font-medium text-sm">Email Address *</Label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500" />
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={update('email')}
                  placeholder="you@example.com"
                  className={`pl-9 border-emerald-200 focus:border-emerald-500 rounded-xl ${errors.email ? 'border-red-400' : ''}`}
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <Label htmlFor="phone" className="text-emerald-900 font-medium text-sm">Phone Number *</Label>
              <div className="relative">
                <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500" />
                <Input
                  id="phone"
                  value={form.phone}
                  onChange={update('phone')}
                  placeholder="+91 XXXXX XXXXX"
                  className={`pl-9 border-emerald-200 focus:border-emerald-500 rounded-xl ${errors.phone ? 'border-red-400' : ''}`}
                />
              </div>
              {errors.phone && <p className="text-red-500 text-xs">{errors.phone}</p>}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-emerald-900 font-medium text-sm">Password *</Label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={update('password')}
                  placeholder="Min. 6 characters"
                  className={`pl-9 pr-10 border-emerald-200 focus:border-emerald-500 rounded-xl ${errors.password ? 'border-red-400' : ''}`}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-400 hover:text-emerald-600">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword" className="text-emerald-900 font-medium text-sm">Confirm Password *</Label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={form.confirmPassword}
                  onChange={update('confirmPassword')}
                  placeholder="Repeat your password"
                  className={`pl-9 pr-10 border-emerald-200 focus:border-emerald-500 rounded-xl ${errors.confirmPassword ? 'border-red-400' : ''}`}
                />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-400 hover:text-emerald-600">
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-xs">{errors.confirmPassword}</p>}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={registerCustomer.isPending}
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl py-2.5 font-semibold"
            >
              {registerCustomer.isPending ? (
                <span className="flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin" />
                  Creating Account...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <UserPlus size={16} />
                  Create Account
                </span>
              )}
            </Button>

            <div className="text-center pt-1 space-y-2">
              <p className="text-sm text-muted-foreground">
                Already have an account?{' '}
                <button type="button" onClick={() => navigate({ to: '/customer/login' })}
                  className="text-emerald-600 hover:text-emerald-800 font-medium transition-colors">
                  Sign In
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
          © {new Date().getFullYear()} G&S MEDICAL. Your Health, Our Priority.
        </p>
      </div>
    </div>
  );
}
