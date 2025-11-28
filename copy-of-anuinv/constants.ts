import { InventoryItem, ItemCategory, Unit, Recipe } from './types';

export const MAX_PRODUCTION_SLOTS = 3;

export const INITIAL_INVENTORY: InventoryItem[] = [
  // Raw Materials
  { id: 'rm_sugar', name: 'Sugar', category: ItemCategory.RAW_MATERIAL, quantity: 500, unit: Unit.KG, minStock: 100, costPerUnit: 1.2 },
  { id: 'rm_glucose', name: 'Glucose', category: ItemCategory.RAW_MATERIAL, quantity: 300, unit: Unit.LITER, minStock: 50, costPerUnit: 2.5 },
  { id: 'rm_stick', name: 'Candy Sticks', category: ItemCategory.RAW_MATERIAL, quantity: 5000, unit: Unit.UNIT, minStock: 1000, costPerUnit: 0.05 },
  { id: 'rm_karton', name: 'Karton Box', category: ItemCategory.RAW_MATERIAL, quantity: 200, unit: Unit.UNIT, minStock: 50, costPerUnit: 0.5 },
  { id: 'rm_pbag', name: 'Plastic Bag', category: ItemCategory.RAW_MATERIAL, quantity: 1000, unit: Unit.UNIT, minStock: 200, costPerUnit: 0.1 },
  { id: 'rm_pbottle', name: 'Plastic Bottle', category: ItemCategory.RAW_MATERIAL, quantity: 500, unit: Unit.UNIT, minStock: 100, costPerUnit: 0.3 },
  { id: 'rm_cont', name: 'Container', category: ItemCategory.RAW_MATERIAL, quantity: 100, unit: Unit.UNIT, minStock: 20, costPerUnit: 5.0 },

  // Products (costPerUnit here represents Selling Price or Standard Cost)
  { id: 'p_productA', name: 'Hilwit', category: ItemCategory.PRODUCT, quantity: 50, unit: Unit.UNIT, minStock: 20, costPerUnit: 15 },
  { id: 'p_productB', name: 'Daru', category: ItemCategory.PRODUCT, quantity: 100, unit: Unit.UNIT, minStock: 50, costPerUnit: 10 },
  { id: 'p_productC', name: '(Product C)', category: ItemCategory.PRODUCT, quantity: 20, unit: Unit.UNIT, minStock: 10, costPerUnit: 12 },
  { id: 'p_productD', name: '(Product D)', category: ItemCategory.PRODUCT, quantity: 0, unit: Unit.UNIT, minStock: 15, costPerUnit: 8 },
  { id: 'p_productE', name: '(Product E)', category: ItemCategory.PRODUCT, quantity: 5, unit: Unit.UNIT, minStock: 10, costPerUnit: 20 },
];

export const RECIPES: Recipe[] = [
  {
    productId: 'p_productA', // Gummy Bears
    processTimeMinutes: 45,
    ingredients: [
      { rawMaterialId: 'rm_sugar', quantity: 0.5 },
      { rawMaterialId: 'rm_glucose', quantity: 0.2 },
      { rawMaterialId: 'rm_pbag', quantity: 1 },
    ]
  },
  {
    productId: 'p_productB', // Lollipops
    processTimeMinutes: 30,
    ingredients: [
      { rawMaterialId: 'rm_sugar', quantity: 0.3 },
      { rawMaterialId: 'rm_glucose', quantity: 0.1 },
      { rawMaterialId: 'rm_stick', quantity: 10 },
      { rawMaterialId: 'rm_pbag', quantity: 1 },
    ]
  },
  {
    productId: 'p_productC', // Soda Pops
    processTimeMinutes: 60,
    ingredients: [
      { rawMaterialId: 'rm_sugar', quantity: 0.2 },
      { rawMaterialId: 'rm_pbottle', quantity: 1 },
    ]
  },
  {
    productId: 'p_productD', // Hard Candy
    processTimeMinutes: 90,
    ingredients: [
      { rawMaterialId: 'rm_sugar', quantity: 1.0 },
      { rawMaterialId: 'rm_karton', quantity: 1 },
    ]
  },
  {
    productId: 'p_productE', // Super Sour
    processTimeMinutes: 120,
    ingredients: [
      { rawMaterialId: 'rm_sugar', quantity: 0.8 },
      { rawMaterialId: 'rm_glucose', quantity: 0.5 },
      { rawMaterialId: 'rm_cont', quantity: 1 },
    ]
  }
];