import Map "mo:core/Map";
import List "mo:core/List";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Iter "mo:core/Iter";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import UserApproval "user-approval/approval";



actor {
  // Initialize access control state and mixin
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User approval state
  let approvalState = UserApproval.initState(accessControlState);

  // Data types
  type Medicine = {
    id : Text;
    name : Text;
    category : Text;
    description : Text;
    price : Nat;
    stock : Nat;
    imageUrl : Text;
    isAvailable : Bool;
  };

  type SellerAccount = {
    id : Text;
    name : Text;
    email : Text;
    passwordHash : Text;
    phone : Text;
    whatsapp : Text;
    address : Text;
    licenseNumber : Text;
    status : SellerStatus;
    joinedAt : Time.Time;
    sessionToken : ?Text;
  };

  type SellerStatus = {
    #pending;
    #active;
    #inactive;
  };

  type Customer = {
    id : Text;
    name : Text;
    email : Text;
    passwordHash : Text;
    phone : Text;
    joinedAt : Time.Time;
    sessionToken : ?Text;
  };

  type SiteContent = {
    key : Text;
    value : Text;
  };

  type ChatMessage = {
    id : Text;
    customerQuery : Text;
    botResponse : Text;
    timestamp : Time.Time;
  };

  type RegisterSellerResult = {
    #ok;
    #emailAlreadyExists;
    #internalError;
  };

  type RegisterCustomerResult = {
    #ok;
    #emailAlreadyExists;
    #internalError;
  };

  type UserProfile = {
    name : Text;
    role : Text;
  };

  // Storage
  let medicines = Map.empty<Text, Medicine>();
  let sellers = Map.empty<Text, SellerAccount>();
  let customers = Map.empty<Text, Customer>();
  let siteContents = Map.empty<Text, SiteContent>();
  let chatMessages = Map.empty<Text, ChatMessage>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // Authorization and approval functions
  public query ({ caller }) func isCallerApproved() : async Bool {
    AccessControl.hasPermission(accessControlState, caller, #admin) or UserApproval.isApproved(approvalState, caller);
  };

  public shared ({ caller }) func requestApproval() : async () {
    UserApproval.requestApproval(approvalState, caller);
  };

  public shared ({ caller }) func setApproval(user : Principal, status : UserApproval.ApprovalStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    UserApproval.setApproval(approvalState, user, status);
  };

  public query ({ caller }) func listApprovals() : async [UserApproval.UserApprovalInfo] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    UserApproval.listApprovals(approvalState);
  };

  // ── User Profile Functions (required by frontend) ──────────────────────────

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // ── Role Assignment (admin-only, guard is inside AccessControl.assignRole) ──

  public shared ({ caller }) func assignRole(user : Principal, role : AccessControl.UserRole) : async () {
    AccessControl.assignRole(accessControlState, caller, user, role);
  };

  // ── Medicines CRUD (admin-only) ────────────────────────────────────────────

  public shared ({ caller }) func addMedicine(medicine : Medicine) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add medicines");
    };
    medicines.add(medicine.id, medicine);
  };

  public query ({ caller }) func getMedicine(id : Text) : async Medicine {
    switch (medicines.get(id)) {
      case (null) { Runtime.trap("Medicine not found") };
      case (?medicine) { medicine };
    };
  };

  public shared ({ caller }) func updateMedicine(id : Text, updatedMedicine : Medicine) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update medicines");
    };
    switch (medicines.get(id)) {
      case (null) { Runtime.trap("Medicine not found") };
      case (?_) { medicines.add(id, updatedMedicine) };
    };
  };

  public shared ({ caller }) func deleteMedicine(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete medicines");
    };
    if (not medicines.containsKey(id)) {
      Runtime.trap("Medicine not found");
    };
    medicines.remove(id);
  };

  // ── Seller Registration & Authentication (public) ─────────────────────────

  public shared ({ caller }) func registerSeller(
    name : Text,
    email : Text,
    password : Text,
    phone : Text,
    whatsapp : Text,
    address : Text,
    licenseNumber : Text,
  ) : async RegisterSellerResult {
    // Check if email already exists
    for ((_, seller) in sellers.entries()) {
      if (seller.email == email) {
        return #emailAlreadyExists;
      };
    };

    let timestamp = Time.now();
    let id = timestamp.toText();

    let newSeller : SellerAccount = {
      id;
      name;
      email;
      passwordHash = password;
      phone;
      whatsapp;
      address;
      licenseNumber;
      status = #pending;
      joinedAt = timestamp;
      sessionToken = null;
    };

    sellers.add(id, newSeller);

    #ok;
  };

  public shared ({ caller }) func sellerLogin(email : Text, password : Text) : async ?Text {
    for ((id, seller) in sellers.entries()) {
      if (seller.email == email and seller.passwordHash == password) {
        switch (seller.status) {
          case (#active) {
            let token = id # Time.now().toText();
            let updatedSeller = { seller with sessionToken = ?token };
            sellers.add(id, updatedSeller);
            return ?token;
          };
          case (#pending) { Runtime.trap("Account pending approval") };
          case (#inactive) { Runtime.trap("Account is inactive") };
        };
      };
    };
    Runtime.trap("Invalid credentials");
  };

  public query ({ caller }) func getSellerByToken(token : Text) : async ?SellerAccount {
    for ((_, seller) in sellers.entries()) {
      if (seller.sessionToken == ?token) {
        return ?seller;
      };
    };
    null;
  };

  public shared ({ caller }) func logoutSeller(token : Text) : async Bool {
    for ((id, seller) in sellers.entries()) {
      if (seller.sessionToken == ?token) {
        let updatedSeller = { seller with sessionToken = null };
        sellers.add(id, updatedSeller);
        return true;
      };
    };
    false;
  };

  // ── Customer Registration & Authentication (public) ───────────────────────

  public shared ({ caller }) func registerCustomer(
    name : Text,
    email : Text,
    password : Text,
    phone : Text,
  ) : async RegisterCustomerResult {
    // Check if email already exists
    for ((_, customer) in customers.entries()) {
      if (customer.email == email) {
        return #emailAlreadyExists;
      };
    };

    let timestamp = Time.now();
    let id = timestamp.toText();

    let newCustomer : Customer = {
      id;
      name;
      email;
      passwordHash = password;
      phone;
      joinedAt = timestamp;
      sessionToken = null;
    };

    customers.add(id, newCustomer);

    #ok;
  };

  public shared ({ caller }) func customerLogin(email : Text, password : Text) : async ?Text {
    for ((id, customer) in customers.entries()) {
      if (customer.email == email and customer.passwordHash == password) {
        let token = id # Time.now().toText();
        let updatedCustomer = { customer with sessionToken = ?token };
        customers.add(id, updatedCustomer);
        return ?token;
      };
    };
    Runtime.trap("Invalid credentials");
  };

  public query ({ caller }) func getCustomerByToken(token : Text) : async ?Customer {
    for ((_, customer) in customers.entries()) {
      if (customer.sessionToken == ?token) {
        return ?customer;
      };
    };
    null;
  };

  public shared ({ caller }) func logoutCustomer(token : Text) : async Bool {
    for ((id, customer) in customers.entries()) {
      if (customer.sessionToken == ?token) {
        let updatedCustomer = { customer with sessionToken = null };
        customers.add(id, updatedCustomer);
        return true;
      };
    };
    false;
  };

  // ── Seller CRUD (admin-only) ───────────────────────────────────────────────

  public shared ({ caller }) func updateSeller(id : Text, updatedSeller : SellerAccount) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update seller accounts");
    };
    switch (sellers.get(id)) {
      case (null) { Runtime.trap("Seller not found") };
      case (?_) {
        sellers.add(id, updatedSeller);
      };
    };
  };

  public shared ({ caller }) func deleteSeller(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete seller accounts");
    };
    if (not sellers.containsKey(id)) {
      Runtime.trap("Seller not found");
    };
    sellers.remove(id);
  };

  // ── SiteContent CRUD (admin-only for writes, public for reads) ────────────

  public shared ({ caller }) func updateSiteContent(content : SiteContent) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update site content");
    };
    siteContents.add(content.key, content);
  };

  public query ({ caller }) func getSiteContent(key : Text) : async SiteContent {
    switch (siteContents.get(key)) {
      case (null) { Runtime.trap("Content not found") };
      case (?content) { content };
    };
  };

  // ── Chat Messages (admin-only for writes, public for reads) ──────────────

  public shared ({ caller }) func addChatMessage(message : ChatMessage) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add chat messages");
    };
    chatMessages.add(message.id, message);
  };

  public query ({ caller }) func getChatMessage(id : Text) : async ChatMessage {
    switch (chatMessages.get(id)) {
      case (null) { Runtime.trap("Message not found") };
      case (?message) { message };
    };
  };

  // ── Public read helpers ───────────────────────────────────────────────────

  public query ({ caller }) func getActiveSellers() : async [SellerAccount] {
    sellers.values().toArray().filter(func(seller) { seller.status == #active });
  };
};
