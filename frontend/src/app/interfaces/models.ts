export interface Product {
  id: number;
  ean_gtin: string;
  sku_plu: string;
  name: string;
  description: string;
  image_url: string;
  price_delivery: number;
  price_pickup: number;
  net_weight_g: number;
  net_volume_l: number;
  gross_weight_g: number;
  alcohol_volume: number;
  caffeine_mg: number;
  deposit_amount: number;
  category?: Category;
  manufacturer?: Manufacturer;
  ingredients?: Ingredient[];
  nutrition_info: NutritionInfo | null;
}

export interface Category {
  id: number;
  name: string;
}

export interface Manufacturer {
  id: number;
  name: string;
  address: string;
  country: string;
}

export interface Ingredient {
  id: number;
  name: string;
}

export interface NutritionInfo {
  id: number;
  energy_kcal: number;
  protein_g: number;
  fat_g: number;
  saturated_fat_g: number;
  carbohydrates_g: number;
  sugar_g: number;
  fiber_g: number;
  sodium_mg: number;
}
