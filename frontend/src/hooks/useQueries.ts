import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Medicine, SellerAccount, SiteContent, Customer, RegisterCustomerResult } from '../backend';

// ─── Sellers (public) ─────────────────────────────────────────────────────────

export function useGetActiveSellers() {
  const { actor, isFetching } = useActor();
  return useQuery<SellerAccount[]>({
    queryKey: ['activeSellers'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getActiveSellers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllSellers() {
  const { actor, isFetching } = useActor();
  return useQuery<SellerAccount[]>({
    queryKey: ['allSellers'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getActiveSellers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetSeller(id: string) {
  const { actor, isFetching } = useActor();
  return useQuery<SellerAccount | null>({
    queryKey: ['seller', id],
    queryFn: async () => {
      if (!actor || !id) return null;
      try {
        return await actor.getSellerByToken(id);
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useAddSeller() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (seller: SellerAccount) => {
      if (!actor) throw new Error('Actor not ready');
      await actor.updateSeller(seller.id, seller);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activeSellers'] });
      queryClient.invalidateQueries({ queryKey: ['allSellers'] });
      queryClient.invalidateQueries({ queryKey: ['sellerIds'] });
    },
  });
}

export function useUpdateSeller() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, seller }: { id: string; seller: SellerAccount }) => {
      if (!actor) throw new Error('Actor not ready');
      await actor.updateSeller(id, seller);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activeSellers'] });
      queryClient.invalidateQueries({ queryKey: ['allSellers'] });
      queryClient.invalidateQueries({ queryKey: ['seller'] });
      queryClient.invalidateQueries({ queryKey: ['sellerIds'] });
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
      queryClient.invalidateQueries({ queryKey: ['sellerIds'] });
    },
  });
}

// ─── Seller Auth ──────────────────────────────────────────────────────────────

export function useRegisterSeller() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      email: string;
      password: string;
      phone: string;
      whatsapp: string;
      address: string;
      licenseNumber: string;
    }) => {
      if (!actor) throw new Error('Actor not ready');
      const result = await actor.registerSeller(
        data.name,
        data.email,
        data.password,
        data.phone,
        data.whatsapp,
        data.address,
        data.licenseNumber
      );
      return result;
    },
  });
}

export function useSellerLogin() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      if (!actor) throw new Error('Actor not ready');
      const token = await actor.sellerLogin(email, password);
      return token;
    },
  });
}

export function useLogoutSeller() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (token: string) => {
      if (!actor) throw new Error('Actor not ready');
      return actor.logoutSeller(token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sellerProfile'] });
    },
  });
}

export function useGetSellerByToken(token: string | null) {
  const { actor, isFetching } = useActor();
  return useQuery<SellerAccount | null>({
    queryKey: ['sellerProfile', token],
    queryFn: async () => {
      if (!actor || !token) return null;
      try {
        return await actor.getSellerByToken(token);
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching && !!token,
  });
}

// ─── Customer Auth ────────────────────────────────────────────────────────────

export function useRegisterCustomer() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      email: string;
      password: string;
      phone: string;
    }): Promise<RegisterCustomerResult> => {
      if (!actor) throw new Error('Actor not ready');
      return actor.registerCustomer(data.name, data.email, data.password, data.phone);
    },
  });
}

export function useCustomerLogin() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      if (!actor) throw new Error('Actor not ready');
      const token = await actor.customerLogin(email, password);
      return token;
    },
  });
}

export function useLogoutCustomer() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (token: string) => {
      if (!actor) throw new Error('Actor not ready');
      return actor.logoutCustomer(token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customerProfile'] });
    },
  });
}

export function useGetCustomerByToken(token: string | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Customer | null>({
    queryKey: ['customerProfile', token],
    queryFn: async () => {
      if (!actor || !token) return null;
      try {
        return await actor.getCustomerByToken(token);
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching && !!token,
  });
}

// ─── Medicines ────────────────────────────────────────────────────────────────

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
      return actor.isCallerAdmin();
    },
  });
}

// ─── Medicines List (stored locally for admin) ────────────────────────────────

export function useMedicinesList() {
  const { actor, isFetching } = useActor();
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
