export interface Ingredient {
  name: string;
}

export interface NutritionInfo {
  energy_kcal: number;
  protein_g: number;
  fat_g: number;
  saturated_fat_g: number;
  carbohydrates_g: number;
  sugar_g: number;
  fiber_g: number;
  sodium_mg: number;
}

export interface Manufacturer {
  manufacturer_id: number;
  name: string;
  address: string;
  country: string;
}

export interface Category {
  category_id: number;
  name: string;
}

export interface Product {
  product_id: number;
  ean_gtin: string;
  sku_plu?: string;
  name: string;
  description?: string;
  image_url?: string;
  price_delivery: number;
  price_pickup: number;
  net_weight_g?: number;
  net_volume_l?: number;
  gross_weight_g?: number;
  alcohol_volume?: number;
  caffeine_mg?: number;
  deposit_amount?: number;
  ingredients: Ingredient[]; // 🛠️ Cambiado a array de strings
  nutritionInfo?: NutritionInfo;
  category_id: number;  // 🔥 Cambiado de `category` a `category_id` (número entero)
  category_name: string;
  manufacturer: Manufacturer;
}
