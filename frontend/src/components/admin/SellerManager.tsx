import { useState } from 'react';
import { useActor } from '../../hooks/useActor';
import {
  useGetActiveSellers, useAddSeller, useUpdateSeller, useDeleteSeller,
  useSellerIdsList, useGetSeller
} from '../../hooks/useQueries';
import type { Seller } from '../../backend';
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
import { Users, Plus, Edit, Trash2, Phone, Mail, MapPin, Award, Loader2 } from 'lucide-react';
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

function generateId() {
  return `seller_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  active: { label: 'Active', className: 'bg-emerald-100 text-emerald-800' },
  inactive: { label: 'Inactive', className: 'bg-gray-100 text-gray-600' },
  pending: { label: 'Pending', className: 'bg-amber-100 text-amber-700' },
};

function SellerRow({ id, onEdit, onDelete, onStatusChange }: {
  id: string;
  onEdit: (s: Seller) => void;
  onDelete: (id: string) => void;
  onStatusChange: (seller: Seller, status: string) => void;
}) {
  const { data: seller, isLoading } = useGetSeller(id);

  if (isLoading) {
    return (
      <tr className="border-b border-emerald-50">
        <td colSpan={5} className="px-4 py-3 text-center text-sm text-muted-foreground">
          <Loader2 size={14} className="animate-spin inline mr-2" />Loading...
        </td>
      </tr>
    );
  }

  if (!seller) return null;

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
  const { data: sellerIds = [], isLoading: idsLoading } = useSellerIdsList();
  const addSeller = useAddSeller();
  const updateSeller = useUpdateSeller();
  const deleteSeller = useDeleteSeller();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSeller, setEditingSeller] = useState<Seller | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState<SellerFormData>(defaultForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openAdd = () => {
    setEditingSeller(null);
    setForm(defaultForm);
    setIsFormOpen(true);
  };

  const openEdit = (seller: Seller) => {
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

  const handleStatusChange = async (seller: Seller, newStatus: string) => {
    try {
      await updateSeller.mutateAsync({ id: seller.id, seller: { ...seller, status: newStatus } });
      toast.success(`Seller status updated to ${newStatus}`);
    } catch {
      toast.error('Failed to update seller status.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) {
      toast.error('Please fill in all required fields.');
      return;
    }
    setIsSubmitting(true);
    try {
      if (editingSeller) {
        const updated: Seller = {
          ...editingSeller,
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          whatsapp: form.whatsapp.trim(),
          address: form.address.trim(),
          licenseNumber: form.licenseNumber.trim(),
          status: form.status,
        };
        await updateSeller.mutateAsync({ id: editingSeller.id, seller: updated });
        toast.success('Seller updated successfully!');
      } else {
        const newId = generateId();
        const newSeller: Seller = {
          id: newId,
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          whatsapp: form.whatsapp.trim(),
          address: form.address.trim(),
          licenseNumber: form.licenseNumber.trim(),
          status: form.status,
          joinedAt: BigInt(Date.now() * 1_000_000),
        };
        await addSeller.mutateAsync(newSeller);
        // Store ID list
        const newIds = [...sellerIds, newId].join(',');
        if (actor) {
          await actor.updateSiteContent({ key: 'seller_ids', value: newIds });
          queryClient.invalidateQueries({ queryKey: ['sellerIds'] });
        }
        toast.success('Seller added successfully!');
      }
      setIsFormOpen(false);
    } catch {
      toast.error('Operation failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteSeller.mutateAsync(deleteId);
      const newIds = sellerIds.filter((id) => id !== deleteId).join(',');
      if (actor) {
        await actor.updateSiteContent({ key: 'seller_ids', value: newIds });
        queryClient.invalidateQueries({ queryKey: ['sellerIds'] });
      }
      toast.success('Seller deleted successfully!');
    } catch {
      toast.error('Failed to delete seller.');
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-emerald-900">Seller Manager</h2>
          <p className="text-sm text-muted-foreground">Manage your seller network and their profiles</p>
        </div>
        <Button onClick={openAdd} className="bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl">
          <Plus size={16} className="mr-2" />
          Add Seller
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-emerald-100 shadow-card overflow-hidden">
        {idsLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 size={24} className="animate-spin text-emerald-600 mr-3" />
            <span className="text-muted-foreground">Loading sellers...</span>
          </div>
        ) : sellerIds.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users size={28} className="text-emerald-500" />
            </div>
            <h3 className="font-semibold text-emerald-900 mb-2">No Sellers Yet</h3>
            <p className="text-muted-foreground text-sm mb-4">Start by adding your first seller to the network.</p>
            <Button onClick={openAdd} className="bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl">
              <Plus size={16} className="mr-2" />Add First Seller
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-emerald-50 border-b border-emerald-100">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-emerald-700 uppercase tracking-wider">Seller</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-emerald-700 uppercase tracking-wider">Phone</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-emerald-700 uppercase tracking-wider">Address</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-emerald-700 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-emerald-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sellerIds.map((id) => (
                  <SellerRow
                    key={id}
                    id={id}
                    onEdit={openEdit}
                    onDelete={setDeleteId}
                    onStatusChange={handleStatusChange}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-emerald-900">
              {editingSeller ? 'Edit Seller' : 'Add New Seller'}
            </DialogTitle>
            <DialogDescription>
              {editingSeller ? 'Update the seller details below.' : 'Fill in the details to add a new seller.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-1.5">
                <Label htmlFor="sname">Seller Name *</Label>
                <Input id="sname" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Business or person name" required className="rounded-xl" />
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label htmlFor="semail">Email *</Label>
                <Input id="semail" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="seller@example.com" required className="rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="sphone">Phone *</Label>
                <Input id="sphone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+91 XXXXXXXXXX" required className="rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="swhatsapp">WhatsApp</Label>
                <Input id="swhatsapp" value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                  placeholder="+91 XXXXXXXXXX" className="rounded-xl" />
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label htmlFor="saddress">Address</Label>
                <Input id="saddress" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })}
                  placeholder="Full address" className="rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="slicense">License Number</Label>
                <Input id="slicense" value={form.licenseNumber} onChange={(e) => setForm({ ...form, licenseNumber: e.target.value })}
                  placeholder="License #" className="rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="sstatus">Status</Label>
                <Select value={form.status} onValueChange={(val) => setForm({ ...form, status: val })}>
                  <SelectTrigger id="sstatus" className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)} className="rounded-xl">
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl">
                {isSubmitting ? <><Loader2 size={14} className="animate-spin mr-2" />Saving...</> : (editingSeller ? 'Update Seller' : 'Add Seller')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Seller</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this seller? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700 rounded-xl">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
