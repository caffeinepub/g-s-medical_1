import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface UserApprovalInfo {
    status: ApprovalStatus;
    principal: Principal;
}
export interface Customer {
    id: string;
    name: string;
    joinedAt: Time;
    email: string;
    sessionToken?: string;
    passwordHash: string;
    phone: string;
}
export type Time = bigint;
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
    timestamp: Time;
    botResponse: string;
    customerQuery: string;
}
export interface SiteContent {
    key: string;
    value: string;
}
export interface SellerAccount {
    id: string;
    status: SellerStatus;
    name: string;
    joinedAt: Time;
    whatsapp: string;
    email: string;
    address: string;
    sessionToken?: string;
    licenseNumber: string;
    passwordHash: string;
    phone: string;
}
export interface UserProfile {
    name: string;
    role: string;
}
export enum ApprovalStatus {
    pending = "pending",
    approved = "approved",
    rejected = "rejected"
}
export enum RegisterCustomerResult {
    ok = "ok",
    emailAlreadyExists = "emailAlreadyExists",
    internalError = "internalError"
}
export enum SellerStatus {
    active = "active",
    pending = "pending",
    inactive = "inactive"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addChatMessage(message: ChatMessage): Promise<void>;
    addMedicine(medicine: Medicine): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    assignRole(user: Principal, role: UserRole): Promise<void>;
    customerLogin(email: string, password: string): Promise<string | null>;
    deleteMedicine(id: string): Promise<void>;
    deleteSeller(id: string): Promise<void>;
    getActiveSellers(): Promise<Array<SellerAccount>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getChatMessage(id: string): Promise<ChatMessage>;
    getCustomerByToken(token: string): Promise<Customer | null>;
    getMedicine(id: string): Promise<Medicine>;
    getSellerByToken(token: string): Promise<SellerAccount | null>;
    getSiteContent(key: string): Promise<SiteContent>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    isCallerApproved(): Promise<boolean>;
    listApprovals(): Promise<Array<UserApprovalInfo>>;
    logoutCustomer(token: string): Promise<boolean>;
    logoutSeller(token: string): Promise<boolean>;
    registerCustomer(name: string, email: string, password: string, phone: string): Promise<RegisterCustomerResult>;
    registerSeller(name: string, email: string, password: string, phone: string, whatsapp: string, address: string, licenseNumber: string): Promise<RegisterSellerResult>;
    requestApproval(): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    sellerLogin(email: string, password: string): Promise<string | null>;
    setApproval(user: Principal, status: ApprovalStatus): Promise<void>;
    updateMedicine(id: string, updatedMedicine: Medicine): Promise<void>;
    updateSeller(id: string, updatedSeller: SellerAccount): Promise<void>;
    updateSiteContent(content: SiteContent): Promise<void>;
}
