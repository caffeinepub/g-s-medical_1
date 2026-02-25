import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetSeller } from '../hooks/useQueries';
import Navigation from '../components/Navigation';
import ChatWidget from '../components/ChatWidget';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Phone, MapPin, Award, Mail, ArrowLeft, Calendar, CheckCircle, AlertCircle, Heart } from 'lucide-react';
import { SiWhatsapp } from 'react-icons/si';

const statusConfig = {
  active: { label: 'Active Partner', className: 'bg-emerald-100 text-emerald-800 border-emerald-300', icon: CheckCircle },
  inactive: { label: 'Inactive', className: 'bg-gray-100 text-gray-600 border-gray-300', icon: AlertCircle },
  pending: { label: 'Pending Approval', className: 'bg-amber-100 text-amber-700 border-amber-300', icon: AlertCircle },
};

export default function SellerDetailPage() {
  // Route is registered directly under rootRoute so its ID is '/sellers/$id'
  const { id } = useParams({ from: '/sellers/$id' });
  const navigate = useNavigate();
  const { data: seller, isLoading } = useGetSeller(id);

  const currentYear = new Date().getFullYear();
  const appId = encodeURIComponent(window.location.hostname || 'gs-medical');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-emerald-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 pt-28 pb-16">
          <Skeleton className="h-8 w-32 mb-8" />
          <div className="bg-white rounded-3xl shadow-card p-8">
            <div className="flex items-center gap-6 mb-8">
              <Skeleton className="w-24 h-24 rounded-full" />
              <div className="space-y-3">
                <Skeleton className="h-7 w-48" />
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-5 w-24" />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-16 rounded-xl" />
              ))}
            </div>
          </div>
        </div>
        <ChatWidget />
      </div>
    );
  }

  if (!seller || seller.status !== 'active') {
    return (
      <div className="min-h-screen bg-emerald-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 pt-28 pb-16 text-center">
          <div className="bg-white rounded-3xl shadow-card p-12">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={36} className="text-emerald-500" />
            </div>
            <h2 className="font-display text-2xl font-bold text-emerald-900 mb-2">Seller Not Found</h2>
            <p className="text-muted-foreground mb-6">
              This seller profile is not available or is currently inactive.
            </p>
            <Button
              onClick={() => navigate({ to: '/' })}
              className="bg-emerald-700 hover:bg-emerald-800 text-white rounded-full px-6"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to Home
            </Button>
          </div>
        </div>
        <ChatWidget />
      </div>
    );
  }

  const status = statusConfig[seller.status as keyof typeof statusConfig] || statusConfig.inactive;
  const StatusIcon = status.icon;
  const joinedDate = seller.joinedAt
    ? new Date(Number(seller.joinedAt) / 1_000_000).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 pt-28 pb-16">
        {/* Back button */}
        <button
          onClick={() => navigate({ to: '/' })}
          className="flex items-center gap-2 text-emerald-700 hover:text-emerald-900 transition-colors mb-6 group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Sellers</span>
        </button>

        {/* Main card */}
        <div className="bg-white rounded-3xl shadow-card overflow-hidden border border-emerald-100">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-700 to-emerald-800 p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gold-400/10 rounded-full translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-white/20 border-4 border-white/30 flex items-center justify-center text-4xl font-bold shadow-lg flex-shrink-0">
                {seller.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="font-display text-2xl md:text-3xl font-bold mb-2">{seller.name}</h1>
                <Badge variant="outline" className={`${status.className} flex items-center gap-1 w-fit`}>
                  <StatusIcon size={12} />
                  {status.label}
                </Badge>
                {joinedDate && (
                  <p className="text-emerald-200 text-sm mt-2 flex items-center gap-1.5">
                    <Calendar size={13} />
                    Member since {joinedDate}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="p-8">
            <h2 className="font-semibold text-emerald-900 text-lg mb-4">Contact Information</h2>
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {seller.phone && (
                <a
                  href={`tel:${seller.phone}`}
                  className="flex items-center gap-3 p-4 bg-emerald-50 rounded-xl border border-emerald-100 hover:bg-emerald-100 transition-colors group"
                >
                  <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone size={18} className="text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="font-semibold text-emerald-800 group-hover:text-emerald-900">{seller.phone}</p>
                  </div>
                </a>
              )}

              {seller.whatsapp && (
                <a
                  href={`https://wa.me/${seller.whatsapp.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 bg-green-50 rounded-xl border border-green-100 hover:bg-green-100 transition-colors group"
                >
                  <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <SiWhatsapp size={18} className="text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">WhatsApp</p>
                    <p className="font-semibold text-green-800 group-hover:text-green-900">{seller.whatsapp}</p>
                  </div>
                </a>
              )}

              {seller.email && (
                <a
                  href={`mailto:${seller.email}`}
                  className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100 hover:bg-blue-100 transition-colors group"
                >
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail size={18} className="text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="font-semibold text-blue-800 group-hover:text-blue-900 truncate">{seller.email}</p>
                  </div>
                </a>
              )}

              {seller.address && (
                <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-xl border border-amber-100">
                  <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin size={18} className="text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Address</p>
                    <p className="font-semibold text-amber-800">{seller.address}</p>
                  </div>
                </div>
              )}
            </div>

            {/* License */}
            {seller.licenseNumber && (
              <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl p-4 border border-emerald-200 flex items-center gap-3">
                <div className="w-10 h-10 bg-gold-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Award size={18} className="text-white" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">License Number</p>
                  <p className="font-bold text-emerald-900">{seller.licenseNumber}</p>
                  <p className="text-xs text-emerald-600 mt-0.5">✓ Verified & Licensed Medical Distributor</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-emerald-900 text-white py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-emerald-400">
          <p>© {currentYear} G&S MEDICAL. All rights reserved.</p>
          <p className="flex items-center justify-center gap-1 mt-1">
            Built with{' '}
            <Heart size={14} className="text-red-400 fill-red-400 mx-0.5" />{' '}
            using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold-400 hover:text-gold-300 transition-colors font-medium"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>

      {/* Chat widget for this page */}
      <ChatWidget />
    </div>
  );
}
