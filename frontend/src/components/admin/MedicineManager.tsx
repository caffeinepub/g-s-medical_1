import { useState } from 'react';
import { useActor } from '../../hooks/useActor';
import { useAddMedicine, useUpdateMedicine, useDeleteMedicine, useMedicinesList, useGetMedicine } from '../../hooks/useQueries';
import type { Medicine } from '../../backend';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription
} from '@/components/ui/dialog';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Pill, Plus, Edit, Trash2, Package, IndianRupee, Tag, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

interface MedicineFormData {
  name: string;
  category: string;
  description: string;
  price: string;
  stock: string;
  imageUrl: string;
  isAvailable: boolean;
}

const defaultForm: MedicineFormData = {
  name: '',
  category: '',
  description: '',
  price: '',
  stock: '',
  imageUrl: '',
  isAvailable: true,
};

function generateId() {
  return `med_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

// Individual medicine row that fetches its own data
function MedicineRow({ id, onEdit, onDelete }: { id: string; onEdit: (m: Medicine) => void; onDelete: (id: string) => void }) {
  const { data: medicine, isLoading } = useGetMedicine(id);

  if (isLoading) {
    return (
      <tr className="border-b border-emerald-50">
        <td colSpan={6} className="px-4 py-3 text-center text-sm text-muted-foreground">
          <Loader2 size={14} className="animate-spin inline mr-2" />Loading...
        </td>
      </tr>
    );
  }

  if (!medicine) return null;

  return (
    <tr className="border-b border-emerald-50 hover:bg-emerald-50/50 transition-colors">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Pill size={16} className="text-emerald-600" />
          </div>
          <div>
            <p className="font-medium text-emerald-900 text-sm">{medicine.name}</p>
            <p className="text-xs text-muted-foreground line-clamp-1">{medicine.description}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <Badge variant="outline" className="text-xs text-emerald-600 border-emerald-200 bg-emerald-50">
          <Tag size={10} className="mr-1" />{medicine.category}
        </Badge>
      </td>
      <td className="px-4 py-3 text-sm font-semibold text-emerald-800">
        <span className="flex items-center gap-0.5">
          <IndianRupee size={12} />{Number(medicine.price).toLocaleString('en-IN')}
        </span>
      </td>
      <td className="px-4 py-3 text-sm text-muted-foreground">
        <span className="flex items-center gap-1">
          <Package size={12} />{Number(medicine.stock)}
        </span>
      </td>
      <td className="px-4 py-3">
        <Badge className={medicine.isAvailable ? 'bg-emerald-100 text-emerald-800 text-xs' : 'bg-gray-100 text-gray-600 text-xs'}>
          {medicine.isAvailable ? '✓ Available' : 'Out of Stock'}
        </Badge>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <Button size="icon" variant="ghost" onClick={() => onEdit(medicine)}
            className="w-8 h-8 text-emerald-600 hover:bg-emerald-100">
            <Edit size={14} />
          </Button>
          <Button size="icon" variant="ghost" onClick={() => onDelete(medicine.id)}
            className="w-8 h-8 text-red-500 hover:bg-red-50">
            <Trash2 size={14} />
          </Button>
        </div>
      </td>
    </tr>
  );
}

export default function MedicineManager() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { data: medicineIds = [], isLoading: idsLoading } = useMedicinesList();
  const addMedicine = useAddMedicine();
  const updateMedicine = useUpdateMedicine();
  const deleteMedicine = useDeleteMedicine();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState<MedicineFormData>(defaultForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openAdd = () => {
    setEditingMedicine(null);
    setForm(defaultForm);
    setIsFormOpen(true);
  };

  const openEdit = (medicine: Medicine) => {
    setEditingMedicine(medicine);
    setForm({
      name: medicine.name,
      category: medicine.category,
      description: medicine.description,
      price: Number(medicine.price).toString(),
      stock: Number(medicine.stock).toString(),
      imageUrl: medicine.imageUrl,
      isAvailable: medicine.isAvailable,
    });
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.category.trim() || !form.price) {
      toast.error('Please fill in all required fields.');
      return;
    }
    setIsSubmitting(true);
    try {
      if (editingMedicine) {
        const updated: Medicine = {
          ...editingMedicine,
          name: form.name.trim(),
          category: form.category.trim(),
          description: form.description.trim(),
          price: BigInt(Math.round(parseFloat(form.price) || 0)),
          stock: BigInt(Math.round(parseFloat(form.stock) || 0)),
          imageUrl: form.imageUrl.trim(),
          isAvailable: form.isAvailable,
        };
        await updateMedicine.mutateAsync({ id: editingMedicine.id, medicine: updated });
        toast.success('Medicine updated successfully!');
      } else {
        const newId = generateId();
        const newMedicine: Medicine = {
          id: newId,
          name: form.name.trim(),
          category: form.category.trim(),
          description: form.description.trim(),
          price: BigInt(Math.round(parseFloat(form.price) || 0)),
          stock: BigInt(Math.round(parseFloat(form.stock) || 0)),
          imageUrl: form.imageUrl.trim(),
          isAvailable: form.isAvailable,
        };
        await addMedicine.mutateAsync(newMedicine);
        // Store ID list in siteContent
        const newIds = [...medicineIds, newId].join(',');
        if (actor) {
          await actor.updateSiteContent({ key: 'medicine_ids', value: newIds });
          queryClient.invalidateQueries({ queryKey: ['medicineIds'] });
        }
        toast.success('Medicine added successfully!');
      }
      setIsFormOpen(false);
    } catch (err) {
      toast.error('Operation failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteMedicine.mutateAsync(deleteId);
      // Remove from ID list
      const newIds = medicineIds.filter((id) => id !== deleteId).join(',');
      if (actor) {
        await actor.updateSiteContent({ key: 'medicine_ids', value: newIds });
        queryClient.invalidateQueries({ queryKey: ['medicineIds'] });
      }
      toast.success('Medicine deleted successfully!');
    } catch {
      toast.error('Failed to delete medicine.');
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-emerald-900">Medicine Manager</h2>
          <p className="text-sm text-muted-foreground">Add, edit, and manage your medicine inventory</p>
        </div>
        <Button onClick={openAdd} className="bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl">
          <Plus size={16} className="mr-2" />
          Add Medicine
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-emerald-100 shadow-card overflow-hidden">
        {idsLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 size={24} className="animate-spin text-emerald-600 mr-3" />
            <span className="text-muted-foreground">Loading medicines...</span>
          </div>
        ) : medicineIds.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Pill size={28} className="text-emerald-500" />
            </div>
            <h3 className="font-semibold text-emerald-900 mb-2">No Medicines Yet</h3>
            <p className="text-muted-foreground text-sm mb-4">Start by adding your first medicine to the inventory.</p>
            <Button onClick={openAdd} className="bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl">
              <Plus size={16} className="mr-2" />Add First Medicine
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-emerald-50 border-b border-emerald-100">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-emerald-700 uppercase tracking-wider">Medicine</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-emerald-700 uppercase tracking-wider">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-emerald-700 uppercase tracking-wider">Price</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-emerald-700 uppercase tracking-wider">Stock</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-emerald-700 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-emerald-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {medicineIds.map((id) => (
                  <MedicineRow key={id} id={id} onEdit={openEdit} onDelete={setDeleteId} />
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
              {editingMedicine ? 'Edit Medicine' : 'Add New Medicine'}
            </DialogTitle>
            <DialogDescription>
              {editingMedicine ? 'Update the medicine details below.' : 'Fill in the details to add a new medicine.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-1.5">
                <Label htmlFor="name">Medicine Name *</Label>
                <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Paracetamol 500mg" required className="rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="category">Category *</Label>
                <Input id="category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                  placeholder="e.g. Analgesic" required className="rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="price">Price (₹) *</Label>
                <Input id="price" type="number" min="0" value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="0" required className="rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="stock">Stock Quantity</Label>
                <Input id="stock" type="number" min="0" value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  placeholder="0" className="rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input id="imageUrl" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  placeholder="https://..." className="rounded-xl" />
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Brief description of the medicine..." rows={3} className="rounded-xl resize-none" />
              </div>
              <div className="col-span-2 flex items-center justify-between p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                <div>
                  <Label htmlFor="available" className="font-medium text-emerald-900">Available for Sale</Label>
                  <p className="text-xs text-muted-foreground">Toggle to mark as in stock or out of stock</p>
                </div>
                <Switch id="available" checked={form.isAvailable}
                  onCheckedChange={(checked) => setForm({ ...form, isAvailable: checked })} />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)} className="rounded-xl">
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl">
                {isSubmitting ? <><Loader2 size={14} className="animate-spin mr-2" />Saving...</> : (editingMedicine ? 'Update Medicine' : 'Add Medicine')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Medicine</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this medicine? This action cannot be undone.
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
