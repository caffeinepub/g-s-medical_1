import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useSellerAuth } from '../hooks/useSellerAuth';
import { useGetSellerByToken, useLogoutSeller } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  LogOut, User, Mail, Phone, MapPin, Award, Store,
  HeartPulse, Clock, CheckCircle, XCircle, Loader2
} from 'lucide-react';

const statusConfig = {
  active: { label: 'Active', icon: CheckCircle, className: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  pending: { label: 'Pending Approval', icon: Clock, className: 'bg-amber-100 text-amber-800 border-amber-200' },
  inactive: { label: 'Inactive', icon: XCircle, className: 'bg-gray-100 text-gray-600 border-gray-200' },
};

export default function SellerDashboard() {
  const navigate = useNavigate();
  const { sellerToken, isAuthenticated, logout } = useSellerAuth();
  const logoutSeller = useLogoutSeller();
  const { data: seller, isLoading } = useGetSellerByToken(sellerToken);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: '/seller/login' });
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = async () => {
    if (sellerToken) {
      try {
        await logoutSeller.mutateAsync(sellerToken);
      } catch {
        // ignore backend error, still logout locally
      }
    }
    logout();
    navigate({ to: '/seller/login' });
  };

  if (!isAuthenticated) return null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-emerald-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={32} className="animate-spin text-emerald-600" />
          <p className="text-emerald-700 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!seller) {
    return (
      <div className="min-h-screen bg-emerald-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <XCircle size={48} className="text-red-400 mx-auto mb-4" />
          <h2 className="font-display text-xl font-bold text-emerald-900 mb-2">Session Expired</h2>
          <p className="text-muted-foreground mb-6">Your session has expired. Please log in again.</p>
          <Button onClick={() => { logout(); navigate({ to: '/seller/login' }); }}
            className="bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl">
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  const sc = statusConfig[seller.status as keyof typeof statusConfig] || statusConfig.inactive;
  const StatusIcon = sc.icon;

  return (
    <div className="min-h-screen bg-emerald-50">
      {/* Header */}
      <header className="bg-white border-b border-emerald-100 shadow-sm sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/assets/generated/gs-medical-logo.dim_512x512.png"
              alt="G&S Medical"
              className="w-9 h-9 rounded-full border-2 border-gold-400"
            />
            <div>
              <p className="font-display font-bold text-emerald-900 text-sm leading-none">G&S MEDICAL</p>
              <p className="text-xs text-emerald-600">Seller Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate({ to: '/' })}
              className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-600 hover:text-emerald-800 transition-colors">
              <HeartPulse size={13} />
              View Website
            </button>
            <Button
              onClick={handleLogout}
              disabled={logoutSeller.isPending}
              variant="outline"
              size="sm"
              className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg text-xs"
            >
              {logoutSeller.isPending ? (
                <Loader2 size={13} className="animate-spin mr-1.5" />
              ) : (
                <LogOut size={13} className="mr-1.5" />
              )}
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Welcome banner */}
        <div className="bg-gradient-to-r from-emerald-700 to-emerald-800 rounded-2xl p-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10 flex items-start justify-between">
            <div>
              <h2 className="font-display text-2xl font-bold mb-1">Welcome, {seller.name}! 👋</h2>
              <p className="text-emerald-200 text-sm">Manage your seller profile on G&S MEDICAL.</p>
            </div>
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold ${sc.className}`}>
              <StatusIcon size={12} />
              {sc.label}
            </div>
          </div>
        </div>

        {/* Status notice for pending */}
        {seller.status === 'pending' && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 flex items-start gap-3">
            <Clock size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-800 text-sm">Account Pending Approval</p>
              <p className="text-amber-700 text-xs mt-0.5">
                Your account is currently under review by our admin team. You'll be notified once approved.
              </p>
            </div>
          </div>
        )}

        {/* Profile details */}
        <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-emerald-50 flex items-center gap-2">
            <Store size={16} className="text-emerald-600" />
            <h3 className="font-semibold text-emerald-900">Seller Profile</h3>
          </div>
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              { icon: User, label: 'Full Name', value: seller.name },
              { icon: Mail, label: 'Email Address', value: seller.email },
              { icon: Phone, label: 'Phone Number', value: seller.phone },
              { icon: Phone, label: 'WhatsApp', value: seller.whatsapp },
              { icon: Award, label: 'License Number', value: seller.licenseNumber },
              { icon: MapPin, label: 'Business Address', value: seller.address },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-3 p-3 bg-emerald-50/50 rounded-xl">
                <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon size={14} className="text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="text-sm font-medium text-emerald-900 mt-0.5">{value || '—'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Account status card */}
        <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-6">
          <h3 className="font-semibold text-emerald-900 mb-4 flex items-center gap-2">
            <CheckCircle size={16} className="text-emerald-600" />
            Account Status
          </h3>
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold ${sc.className}`}>
              <StatusIcon size={14} />
              {sc.label}
            </div>
            <p className="text-sm text-muted-foreground">
              {seller.status === 'active' && 'Your account is active and visible on the platform.'}
              {seller.status === 'pending' && 'Awaiting admin review and approval.'}
              {seller.status === 'inactive' && 'Your account is currently inactive. Contact support.'}
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-emerald-100 bg-white mt-8 py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} G&S MEDICAL. Built with ❤️ using{' '}
        <a
          href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-emerald-600 hover:underline"
        >
          caffeine.ai
        </a>
      </footer>
    </div>
  );
}
