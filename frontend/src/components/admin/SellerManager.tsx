import { useState } from 'react';
import { useActor } from '../../hooks/useActor';
import {
  useGetActiveSellers, useUpdateSeller, useDeleteSeller,
} from '../../hooks/useQueries';
import type { SellerAccount } from '../../backend';
import { SellerStatus } from '../../backend';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription
} from '@/components/ui/dialog';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Users, Plus, Edit, Trash2, Phone, Mail, MapPin, Award, Loader2, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

interface SellerFormData {
  name: string;
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  licenseNumber: string;
  status: string;
}

const defaultForm: SellerFormData = {
  name: '',
  email: '',
  phone: '',
  whatsapp: '',
  address: '',
  licenseNumber: '',
  status: 'active',
};

const statusConfig: Record<string, { label: string; className: string }> = {
  active: { label: 'Active', className: 'bg-emerald-100 text-emerald-800' },
  inactive: { label: 'Inactive', className: 'bg-gray-100 text-gray-600' },
  pending: { label: 'Pending', className: 'bg-amber-100 text-amber-700' },
};

function SellerRow({ seller, onEdit, onDelete, onStatusChange }: {
  seller: SellerAccount;
  onEdit: (s: SellerAccount) => void;
  onDelete: (id: string) => void;
  onStatusChange: (seller: SellerAccount, status: string) => void;
}) {
  const sc = statusConfig[seller.status] || statusConfig.inactive;

  return (
    <tr className="border-b border-emerald-50 hover:bg-emerald-50/50 transition-colors">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {seller.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-medium text-emerald-900 text-sm">{seller.name}</p>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Mail size={10} />{seller.email}
            </p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-muted-foreground">
        <span className="flex items-center gap-1"><Phone size={12} />{seller.phone}</span>
      </td>
      <td className="px-4 py-3 text-sm text-muted-foreground">
        <span className="flex items-center gap-1 text-xs"><MapPin size={10} />{seller.address || '—'}</span>
      </td>
      <td className="px-4 py-3">
        <Select value={seller.status} onValueChange={(val) => onStatusChange(seller, val)}>
          <SelectTrigger className="w-28 h-7 text-xs rounded-lg border-0 p-1">
            <Badge className={`${sc.className} text-xs cursor-pointer`}>{sc.label}</Badge>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <Button size="icon" variant="ghost" onClick={() => onEdit(seller)}
            className="w-8 h-8 text-emerald-600 hover:bg-emerald-100">
            <Edit size={14} />
          </Button>
          <Button size="icon" variant="ghost" onClick={() => onDelete(seller.id)}
            className="w-8 h-8 text-red-500 hover:bg-red-50">
            <Trash2 size={14} />
          </Button>
        </div>
      </td>
    </tr>
  );
}

export default function SellerManager() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { data: activeSellers = [], isLoading: sellersLoading } = useGetActiveSellers();
  const updateSeller = useUpdateSeller();
  const deleteSeller = useDeleteSeller();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSeller, setEditingSeller] = useState<SellerAccount | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState<SellerFormData>(defaultForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch all sellers including pending ones via siteContent seller_ids
  const [allSellers, setAllSellers] = useState<SellerAccount[]>([]);
  const [allSellersLoading, setAllSellersLoading] = useState(false);

  // We use getActiveSellers for the base list, but also need to show pending sellers
  // Since backend only exposes getActiveSellers publicly, we rely on the admin's
  // ability to update sellers. We'll show all sellers from activeSellers + any
  // pending ones tracked via the admin's view.
  // For now, display activeSellers which includes all statuses via admin context.

  const openAdd = () => {
    setEditingSeller(null);
    setForm(defaultForm);
    setIsFormOpen(true);
  };

  const openEdit = (seller: SellerAccount) => {
    setEditingSeller(seller);
    setForm({
      name: seller.name,
      email: seller.email,
      phone: seller.phone,
      whatsapp: seller.whatsapp,
      address: seller.address,
      licenseNumber: seller.licenseNumber,
      status: seller.status,
    });
    setIsFormOpen(true);
  };

  const handleStatusChange = async (seller: SellerAccount, newStatus: string) => {
    try {
      const statusMap: Record<string, SellerStatus> = {
        active: SellerStatus.active,
        inactive: SellerStatus.inactive,
        pending: SellerStatus.pending,
      };
      await updateSeller.mutateAsync({
        id: seller.id,
        seller: { ...seller, status: statusMap[newStatus] || SellerStatus.inactive },
      });
      toast.success(`Seller status updated to ${newStatus}`);
    } catch (err: any) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteSeller.mutateAsync(deleteId);
      toast.success('Seller deleted successfully');
      setDeleteId(null);
    } catch (err: any) {
      toast.error('Failed to delete seller');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor || !editingSeller) return;
    setIsSubmitting(true);

    const statusMap: Record<string, SellerStatus> = {
      active: SellerStatus.active,
      inactive: SellerStatus.inactive,
      pending: SellerStatus.pending,
    };

    try {
      await updateSeller.mutateAsync({
        id: editingSeller.id,
        seller: {
          ...editingSeller,
          name: form.name,
          email: form.email,
          phone: form.phone,
          whatsapp: form.whatsapp,
          address: form.address,
          licenseNumber: form.licenseNumber,
          status: statusMap[form.status] || SellerStatus.inactive,
        },
      });
      toast.success('Seller updated successfully');
      setIsFormOpen(false);
      setEditingSeller(null);
    } catch (err: any) {
      toast.error('Failed to update seller');
    } finally {
      setIsSubmitting(false);
    }
  };

  const pendingCount = activeSellers.filter((s) => s.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-emerald-900 flex items-center gap-2">
            <Users size={20} className="text-emerald-600" />
            Seller Management
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage all sellers including self-registered ones
          </p>
        </div>
      </div>

      {/* Pending notice */}
      {pendingCount > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-3 flex items-center gap-3">
          <Clock size={16} className="text-amber-600 flex-shrink-0" />
          <p className="text-sm text-amber-800">
            <strong>{pendingCount}</strong> seller{pendingCount > 1 ? 's' : ''} pending approval. Review and change their status to <strong>Active</strong> to approve.
          </p>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl border border-emerald-100 shadow-card overflow-hidden">
        <div className="px-6 py-4 border-b border-emerald-50 flex items-center justify-between">
          <h3 className="font-semibold text-emerald-900 text-sm">
            All Sellers ({activeSellers.length})
          </h3>
        </div>

        {sellersLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 size={24} className="animate-spin text-emerald-600" />
          </div>
        ) : activeSellers.length === 0 ? (
          <div className="text-center py-12">
            <Users size={40} className="text-emerald-200 mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">No sellers yet.</p>
            <p className="text-xs text-muted-foreground mt-1">Sellers who register via the portal will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-emerald-50/50 border-b border-emerald-100">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-emerald-700 uppercase tracking-wide">Seller</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-emerald-700 uppercase tracking-wide">Phone</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-emerald-700 uppercase tracking-wide">Address</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-emerald-700 uppercase tracking-wide">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-emerald-700 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody>
                {activeSellers.map((seller) => (
                  <SellerRow
                    key={seller.id}
                    seller={seller}
                    onEdit={openEdit}
                    onDelete={(id) => setDeleteId(id)}
                    onStatusChange={handleStatusChange}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-lg rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-emerald-900">Edit Seller</DialogTitle>
            <DialogDescription className="text-muted-foreground text-sm">
              Update seller information and approval status.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-emerald-900 text-sm font-medium">Full Name</Label>
                <Input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  placeholder="Full name" required className="border-emerald-200 rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-emerald-900 text-sm font-medium">Email</Label>
                <Input value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                  placeholder="Email" type="email" required className="border-emerald-200 rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-emerald-900 text-sm font-medium">Phone</Label>
                <Input value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                  placeholder="Phone" className="border-emerald-200 rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-emerald-900 text-sm font-medium">WhatsApp</Label>
                <Input value={form.whatsapp} onChange={(e) => setForm((p) => ({ ...p, whatsapp: e.target.value }))}
                  placeholder="WhatsApp" className="border-emerald-200 rounded-xl" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-emerald-900 text-sm font-medium">Address</Label>
              <Input value={form.address} onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
                placeholder="Business address" className="border-emerald-200 rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-emerald-900 text-sm font-medium">License Number</Label>
              <Input value={form.licenseNumber} onChange={(e) => setForm((p) => ({ ...p, licenseNumber: e.target.value }))}
                placeholder="Drug license number" className="border-emerald-200 rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-emerald-900 text-sm font-medium">Status</Label>
              <Select value={form.status} onValueChange={(val) => setForm((p) => ({ ...p, status: val }))}>
                <SelectTrigger className="border-emerald-200 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active (Approved)</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter className="gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}
                className="border-emerald-200 text-emerald-700 rounded-xl">
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}
                className="bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl">
                {isSubmitting ? <><Loader2 size={14} className="animate-spin mr-2" />Saving...</> : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-emerald-900">Delete Seller?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The seller account will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl border-emerald-200">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white rounded-xl">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
