export type UserRole = "Admin" | "Logistics";

export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  name: string;
}

export interface Equipment {
  id: string;
  sku: string;
  name: string;
  armorClass: string;
  stockLevel: number;
  unitPrice: number;
  reorderPoint: number;
  category: "Ballistic Vest" | "Vehicle Plating" | "Tactical Helmet" | "Shield" | "Other";
  supplierId: string;
  warehouseId: string;
}

export interface Transaction {
  id: string;
  type: "IN" | "OUT";
  quantity: number;
  equipmentId: string;
  userId: string;
  timestamp: any; // Firestore Timestamp
  note: string;
}

export interface Warehouse {
  id: string;
  name: string;
  location: string;
  capacity: number;
}

export interface Supplier {
  id: string;
  name: string;
  contact: string;
  email: string;
  address: string;
}
