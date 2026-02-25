import Map "mo:core/Map";
import Array "mo:core/Array";
import List "mo:core/List";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";

actor {
  // Data Models
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

  type Seller = {
    id : Text;
    name : Text;
    email : Text;
    phone : Text;
    whatsapp : Text;
    address : Text;
    licenseNumber : Text;
    status : Text;
    joinedAt : Nat;
  };

  type SiteContent = {
    key : Text;
    value : Text;
  };

  type ChatMessage = {
    id : Text;
    customerQuery : Text;
    botResponse : Text;
    timestamp : Nat;
  };

  // Storage
  let medicines = Map.empty<Text, Medicine>();
  let sellers = Map.empty<Text, Seller>();
  let siteContents = Map.empty<Text, SiteContent>();
  let chatMessages = Map.empty<Text, ChatMessage>();

  // Admin Credentials
  let adminEmail = "gauravsaswade2009@gmail.com";
  let adminPassword = "p1love2g";
  var isAdmin : Bool = false;

  // Medicines CRUD
  public shared ({ caller }) func addMedicine(medicine : Medicine) : async () {
    if (not isAdmin) { Runtime.trap("Unauthorized") };
    medicines.add(medicine.id, medicine);
  };

  public query ({ caller }) func getMedicine(id : Text) : async Medicine {
    switch (medicines.get(id)) {
      case (null) { Runtime.trap("Medicine not found") };
      case (?medicine) { medicine };
    };
  };

  public shared ({ caller }) func updateMedicine(id : Text, updatedMedicine : Medicine) : async () {
    if (not isAdmin) { Runtime.trap("Unauthorized") };
    switch (medicines.get(id)) {
      case (null) { Runtime.trap("Medicine not found") };
      case (?_) {
        medicines.add(id, updatedMedicine);
      };
    };
  };

  public shared ({ caller }) func deleteMedicine(id : Text) : async () {
    if (not isAdmin) { Runtime.trap("Unauthorized") };
    if (not medicines.containsKey(id)) { Runtime.trap("Medicine not found") };
    medicines.remove(id);
  };

  // Sellers CRUD
  public shared ({ caller }) func addSeller(seller : Seller) : async () {
    if (not isAdmin) { Runtime.trap("Unauthorized") };
    sellers.add(seller.id, seller);
  };

  public query ({ caller }) func getSeller(id : Text) : async Seller {
    switch (sellers.get(id)) {
      case (null) { Runtime.trap("Seller not found") };
      case (?seller) { seller };
    };
  };

  public shared ({ caller }) func updateSeller(id : Text, updatedSeller : Seller) : async () {
    if (not isAdmin) { Runtime.trap("Unauthorized") };
    switch (sellers.get(id)) {
      case (null) { Runtime.trap("Seller not found") };
      case (?_) {
        sellers.add(id, updatedSeller);
      };
    };
  };

  public shared ({ caller }) func deleteSeller(id : Text) : async () {
    if (not isAdmin) { Runtime.trap("Unauthorized") };
    if (not sellers.containsKey(id)) {
      Runtime.trap("Seller not found");
    };
    sellers.remove(id);
  };

  // SiteContent CRUD
  public shared ({ caller }) func updateSiteContent(content : SiteContent) : async () {
    if (not isAdmin) { Runtime.trap("Unauthorized") };
    siteContents.add(content.key, content);
  };

  public query ({ caller }) func getSiteContent(key : Text) : async SiteContent {
    switch (siteContents.get(key)) {
      case (null) { Runtime.trap("Content not found") };
      case (?content) { content };
    };
  };

  // Admin Login
  public shared ({ caller }) func adminLogin(email : Text, password : Text) : async Bool {
    if (email == adminEmail and password == adminPassword) {
      isAdmin := true;
      true;
    } else {
      false;
    };
  };

  // ChatMessages (for completeness, in case public chat is needed)
  public shared ({ caller }) func addChatMessage(message : ChatMessage) : async () {
    chatMessages.add(message.id, message);
  };

  public query ({ caller }) func getChatMessage(id : Text) : async ChatMessage {
    switch (chatMessages.get(id)) {
      case (null) { Runtime.trap("Message not found") };
      case (?message) { message };
    };
  };

  // Helper to get all active sellers
  public query ({ caller }) func getActiveSellers() : async [Seller] {
    let active = List.empty<Seller>();
    for ((_, seller) in sellers.entries()) {
      if (seller.status == "active") {
        active.add(seller);
      };
    };
    active.toArray();
  };
};
