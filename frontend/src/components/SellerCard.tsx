import { Seller } from '../backend';
import { Badge } from '@/components/ui/badge';
import { Phone, MapPin, Award, ChevronRight } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';

interface SellerCardProps {
  seller: Seller;
}

const statusConfig = {
  active: { label: 'Active', className: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  inactive: { label: 'Inactive', className: 'bg-gray-100 text-gray-600 border-gray-200' },
  pending: { label: 'Pending', className: 'bg-gold-100 text-gold-700 border-gold-200' },
};

export default function SellerCard({ seller }: SellerCardProps) {
  const navigate = useNavigate();
  const status = statusConfig[seller.status as keyof typeof statusConfig] || statusConfig.inactive;

  return (
    <div
      onClick={() => navigate({ to: '/sellers/$id', params: { id: seller.id } })}
      className="bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 border border-emerald-100 p-5 cursor-pointer group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white font-bold text-lg shadow-emerald flex-shrink-0">
            {seller.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-semibold text-emerald-900 text-base leading-tight group-hover:text-emerald-700 transition-colors">
              {seller.name}
            </h3>
            <Badge variant="outline" className={`text-xs mt-0.5 ${status.className}`}>
              {status.label}
            </Badge>
          </div>
        </div>
        <ChevronRight size={18} className="text-emerald-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all mt-1" />
      </div>

      {/* Details */}
      <div className="space-y-2">
        {seller.phone && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Phone size={13} className="text-emerald-500 flex-shrink-0" />
            <span className="truncate">{seller.phone}</span>
          </div>
        )}
        {seller.address && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin size={13} className="text-emerald-500 flex-shrink-0" />
            <span className="truncate">{seller.address}</span>
          </div>
        )}
        {seller.licenseNumber && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Award size={13} className="text-gold-500 flex-shrink-0" />
            <span className="truncate text-xs">License: {seller.licenseNumber}</span>
          </div>
        )}
      </div>
    </div>
  );
}
