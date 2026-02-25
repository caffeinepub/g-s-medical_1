import { useGetActiveSellers } from '../hooks/useQueries';
import SellerCard from './SellerCard';
import AnimatedSection from './AnimatedSection';
import { Skeleton } from '@/components/ui/skeleton';
import { Users } from 'lucide-react';

export default function SellersSection() {
  const { data: sellers, isLoading } = useGetActiveSellers();

  return (
    <section id="sellers" className="section-padding bg-gradient-to-b from-white to-emerald-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection animation="fade-up" className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            <Users size={14} />
            Our Network
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-emerald-900 mb-4">
            Trusted Seller Partners
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            G&S MEDICAL works with verified and licensed medical distributors across the region to ensure you get genuine medicines.
          </p>
        </AnimatedSection>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 border border-emerald-100">
                <div className="flex items-center gap-3 mb-4">
                  <Skeleton className="w-12 h-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
                <Skeleton className="h-3 w-full mb-2" />
                <Skeleton className="h-3 w-3/4" />
              </div>
            ))}
          </div>
        ) : sellers && sellers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sellers.map((seller, index) => (
              <AnimatedSection key={seller.id} animation="fade-up" delay={index * 100}>
                <SellerCard seller={seller} />
              </AnimatedSection>
            ))}
          </div>
        ) : (
          <AnimatedSection animation="fade-in" className="text-center py-16">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users size={36} className="text-emerald-500" />
            </div>
            <h3 className="text-xl font-semibold text-emerald-800 mb-2">Seller Network Coming Soon</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              We're onboarding verified medical distributors. Contact us to become a seller partner!
            </p>
          </AnimatedSection>
        )}
      </div>
    </section>
  );
}
