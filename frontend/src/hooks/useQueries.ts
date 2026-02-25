import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Medicine, Seller, SiteContent } from '../backend';

// ─── Medicines ───────────────────────────────────────────────────────────────

export function useGetActiveSellers() {
  const { actor, isFetching } = useActor();
  return useQuery<Seller[]>({
    queryKey: ['activeSellers'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getActiveSellers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetSeller(id: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Seller | null>({
    queryKey: ['seller', id],
    queryFn: async () => {
      if (!actor || !id) return null;
      try {
        return await actor.getSeller(id);
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useGetAllSellers() {
  const { actor, isFetching } = useActor();
  return useQuery<Seller[]>({
    queryKey: ['allSellers'],
    queryFn: async () => {
      if (!actor) return [];
      // Get active sellers and combine with all known sellers
      return actor.getActiveSellers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddSeller() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (seller: Seller) => {
      if (!actor) throw new Error('Actor not ready');
      await actor.addSeller(seller);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activeSellers'] });
      queryClient.invalidateQueries({ queryKey: ['allSellers'] });
    },
  });
}

export function useUpdateSeller() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, seller }: { id: string; seller: Seller }) => {
      if (!actor) throw new Error('Actor not ready');
      await actor.updateSeller(id, seller);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activeSellers'] });
      queryClient.invalidateQueries({ queryKey: ['allSellers'] });
      queryClient.invalidateQueries({ queryKey: ['seller'] });
    },
  });
}

export function useDeleteSeller() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not ready');
      await actor.deleteSeller(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activeSellers'] });
      queryClient.invalidateQueries({ queryKey: ['allSellers'] });
    },
  });
}

// ─── Medicines ───────────────────────────────────────────────────────────────

export function useGetMedicine(id: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Medicine | null>({
    queryKey: ['medicine', id],
    queryFn: async () => {
      if (!actor || !id) return null;
      try {
        return await actor.getMedicine(id);
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useAddMedicine() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (medicine: Medicine) => {
      if (!actor) throw new Error('Actor not ready');
      await actor.addMedicine(medicine);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medicines'] });
    },
  });
}

export function useUpdateMedicine() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, medicine }: { id: string; medicine: Medicine }) => {
      if (!actor) throw new Error('Actor not ready');
      await actor.updateMedicine(id, medicine);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medicines'] });
    },
  });
}

export function useDeleteMedicine() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not ready');
      await actor.deleteMedicine(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medicines'] });
    },
  });
}

// ─── Site Content ─────────────────────────────────────────────────────────────

export function useGetSiteContent(key: string) {
  const { actor, isFetching } = useActor();
  return useQuery<SiteContent | null>({
    queryKey: ['siteContent', key],
    queryFn: async () => {
      if (!actor || !key) return null;
      try {
        return await actor.getSiteContent(key);
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching && !!key,
  });
}

export function useUpdateSiteContent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (content: SiteContent) => {
      if (!actor) throw new Error('Actor not ready');
      await actor.updateSiteContent(content);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['siteContent', variables.key] });
    },
  });
}

// ─── Admin Login ──────────────────────────────────────────────────────────────

export function useAdminLogin() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      if (!actor) throw new Error('Actor not ready');
      return actor.adminLogin(email, password);
    },
  });
}

// ─── Medicines List (stored locally for admin) ────────────────────────────────

export function useMedicinesList() {
  const { actor, isFetching } = useActor();
  // Since backend doesn't have a getAllMedicines, we store IDs in siteContent
  return useQuery<string[]>({
    queryKey: ['medicineIds'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        const content = await actor.getSiteContent('medicine_ids');
        return content.value ? content.value.split(',').filter(Boolean) : [];
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSellerIdsList() {
  const { actor, isFetching } = useActor();
  return useQuery<string[]>({
    queryKey: ['sellerIds'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        const content = await actor.getSiteContent('seller_ids');
        return content.value ? content.value.split(',').filter(Boolean) : [];
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}
