import { Medicine } from '../backend';
import { Badge } from '@/components/ui/badge';
import { Pill, Package, Tag, IndianRupee } from 'lucide-react';

interface MedicineCardProps {
  medicine: Medicine;
}

export default function MedicineCard({ medicine }: MedicineCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 overflow-hidden border border-emerald-100 group">
      {/* Image */}
      <div className="relative h-44 bg-gradient-to-br from-emerald-50 to-emerald-100 overflow-hidden">
        {medicine.imageUrl ? (
          <img
            src={medicine.imageUrl}
            alt={medicine.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : null}
        <div className={`absolute inset-0 flex items-center justify-center ${medicine.imageUrl ? 'opacity-0' : 'opacity-100'}`}>
          <div className="w-16 h-16 bg-emerald-200 rounded-full flex items-center justify-center">
            <Pill size={32} className="text-emerald-600" />
          </div>
        </div>
        {/* Availability badge */}
        <div className="absolute top-3 right-3">
          <Badge
            variant={medicine.isAvailable ? 'default' : 'secondary'}
            className={medicine.isAvailable
              ? 'bg-emerald-600 text-white text-xs'
              : 'bg-gray-400 text-white text-xs'
            }
          >
            {medicine.isAvailable ? '✓ Available' : 'Out of Stock'}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-display font-semibold text-emerald-900 text-base leading-tight line-clamp-2">
            {medicine.name}
          </h3>
        </div>

        <div className="flex items-center gap-1.5 mb-2">
          <Tag size={12} className="text-gold-600 flex-shrink-0" />
          <span className="text-xs text-gold-700 font-medium bg-gold-100 px-2 py-0.5 rounded-full">
            {medicine.category}
          </span>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
          {medicine.description}
        </p>

        <div className="flex items-center justify-between pt-3 border-t border-emerald-50">
          <div className="flex items-center gap-1">
            <IndianRupee size={14} className="text-emerald-700" />
            <span className="font-bold text-emerald-800 text-lg">
              {Number(medicine.price).toLocaleString('en-IN')}
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Package size={12} />
            <span>Stock: {Number(medicine.stock)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
