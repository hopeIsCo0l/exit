export enum ItemCategory {
  RAW_MATERIAL = 'RAW_MATERIAL',
  PRODUCT = 'PRODUCT'
}

export enum Unit {
  KG = 'kg',
  UNIT = 'units',
  LITER = 'L'
}

export interface InventoryItem {
  id: string;
  name: string;
  category: ItemCategory;
  quantity: number;
  unit: Unit;
  minStock: number;
  costPerUnit: number; // Cost for raw, Price for product
  image?: string;
}

export interface Recipe {
  productId: string;
  processTimeMinutes: number; 
  ingredients: {
    rawMaterialId: string;
    quantity: number;
  }[];
}

export interface Transaction {
  id: string;
  timestamp: number;
  type: 'RESTOCK' | 'PRODUCTION_START' | 'PRODUCTION_FINISH' | 'ADJUSTMENT';
  details: string;
  amount?: number;
  batchId?: string;
  cost?: number;
  performedBy?: string; // Added to track who did what
}

export type BatchStatus = 'QUEUED' | 'PROCESSING' | 'COMPLETED';

export interface Batch {
  id: string;
  productId: string;
  quantity: number;
  startTime: number;
  estimatedCost: number;
  status: BatchStatus;
}

export type UserRole = 'ADMIN' | 'FACTORY_MANAGER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}
