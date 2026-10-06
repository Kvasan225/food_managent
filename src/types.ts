export type Category = 
  | 'vegetables'
  | 'fruits'
  | 'grains_carbs'
  | 'dals_pulses'
  | 'dairy_liquids'
  | 'spices_oils'
  | 'canned_pantry'
  | 'proteins_meat'
  | 'other';

export type Perishability = 'high' | 'medium' | 'low';

export interface Ingredient {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: Category;
  perishability: Perishability; // high = 1-2 days, medium = 3-5 days, low = pantry staple
  tanglishName?: string;
  notes?: string;
}

export interface Household {
  adults: number;
  children: number;
  notes?: string;
}

export type MealSlot = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface MealSlotPreferences {
  breakfastStyles: string[]; // multi-select array (e.g. ['tiffin', 'porridge'])
  breakfastCustom?: string;  // custom combo for breakfast (e.g. "Idli + Sambar" or "Poori + Potato")
  lunchStyles: string[];     // multi-select array (e.g. ['rice_meals', 'variety_rice'])
  lunchCustom?: string;      // custom combo for lunch (e.g. "Sadam + Rasam + Urulaikilangu")
  dinnerStyles: string[];    // multi-select array (e.g. ['chapati', 'dosa', 'rice_only_nonveg'])
  dinnerCustom?: string;     // custom combo for dinner (e.g. "Chapati with Kurma, Biriyani on weekend")
  snackStyles?: string[];    // multi-select array (e.g. ['sundal', 'tea_snacks'])
  snackCustom?: string;     // custom combo for snack (e.g. "Sundal + Filter Coffee")
  customNotes?: string;

  // Backward-compatibility accessors
  breakfastStyle?: string;
  lunchStyle?: string;
  dinnerStyle?: string;
}

export interface PantryPreset {
  id: string;
  label: string;
  dietCategory: 'veg' | 'non_veg' | 'sattvic';
  dietLabel: string; // e.g. "Pure Veg 🟢" or "Non-Veg & Eggs 🔴"
  householdSize: string; // e.g. "Family (4 members)" or "Bachelor / Room (1-2)"
  description: string;
  typicalDishes?: string; // e.g. "Sambar, Rasam, Night Chapatis, Poriyal"
  keyStaples?: string; // e.g. "Ponni Rice, Atta, Toor Dal, Tomatoes, Onions"
  budgetStretchDays?: string; // e.g. "4-5 Days stretch"
  defaultSlotPrefs?: Partial<MealSlotPreferences>;
  defaultDietary?: string;
  items: Omit<Ingredient, 'id'>[];
}

export interface IngredientUsage {
  name: string;
  amountUsed: string; // Exact physical quantity (e.g. "150g", "2 pcs", "1/2 cup", "1 tbsp"), NEVER vague percentages
  tanglishName?: string;
  rationNote?: string;
}

export interface Meal {
  slot: MealSlot;
  recipeName: string;
  tanglishRecipeName?: string;
  description: string;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  difficulty: 'easy' | 'medium' | 'hard';
  servings: number;
  ingredientsUsed: IngredientUsage[];
  instructions: string[];
  stretchTip?: string;
  emergencySubstitution?: string;
  isCooked?: boolean;
}

export interface DayPlan {
  dayNumber: number;
  theme: string;
  dailyInventoryStatus?: string;
  meals: Meal[];
}

export interface InventoryBurnDownItem {
  ingredientName: string;
  initialQty: string;
  remainingQty: string;
  depletionDay: number | null;
  status: 'surplus' | 'fully_depleted' | 'critical_buffer';
}

export interface MealPlanResult {
  chefRationingStrategy: string;
  days: DayPlan[];
  inventoryBurnDown: InventoryBurnDownItem[];
  survivalHacks: string[];
  nextMonthGroceryBridge: string[];
}

export type StretchMode = 'strict_zero_spend' | 'balanced_stretch' | 'batch_cook';

