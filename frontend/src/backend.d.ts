import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Medicine {
    id: string;
    name: string;
    isAvailable: boolean;
    description: string;
    stock: bigint;
    imageUrl: string;
    category: string;
    price: bigint;
}
export interface ChatMessage {
    id: string;
    timestamp: bigint;
    botResponse: string;
    customerQuery: string;
}
export interface SiteContent {
    key: string;
    value: string;
}
export interface Seller {
    id: string;
    status: string;
    name: string;
    joinedAt: bigint;
    whatsapp: string;
    email: string;
    address: string;
    licenseNumber: string;
    phone: string;
}
export interface backendInterface {
    addChatMessage(message: ChatMessage): Promise<void>;
    addMedicine(medicine: Medicine): Promise<void>;
    addSeller(seller: Seller): Promise<void>;
    adminLogin(email: string, password: string): Promise<boolean>;
    deleteMedicine(id: string): Promise<void>;
    deleteSeller(id: string): Promise<void>;
    getActiveSellers(): Promise<Array<Seller>>;
    getChatMessage(id: string): Promise<ChatMessage>;
    getMedicine(id: string): Promise<Medicine>;
    getSeller(id: string): Promise<Seller>;
    getSiteContent(key: string): Promise<SiteContent>;
    updateMedicine(id: string, updatedMedicine: Medicine): Promise<void>;
    updateSeller(id: string, updatedSeller: Seller): Promise<void>;
    updateSiteContent(content: SiteContent): Promise<void>;
}
