import { Ingredient, PantryPreset } from '../types';

export const PANTRY_PRESETS: PantryPreset[] = [
  {
    id: 'tamil_kudumbam_lean',
    label: 'Tamil Kudumbam End-of-Month (Pure Veg)',
    dietCategory: 'veg',
    dietLabel: 'Pure Veg 🟢 (சைவம்)',
    householdSize: 'Family of 4',
    budgetStretchDays: '4-5 Days Budget Stretch',
    typicalDishes: 'Sambar Sadam, Milagu Rasam, Urulaikilangu Roast, Night Godhumai Chapatis & Dosas with Thokku',
    keyStaples: 'Ponni Rice (1.5kg), Atta (600g), Toor Dal, Tomatoes, Onions, Potatoes, Curd',
    defaultDietary: 'traditional_veg',
    defaultSlotPrefs: {
      breakfastStyles: ['tiffin_dosa_idli_upma'],
      breakfastCustom: 'Dosa, Idli, or Rava Upma with Chutney',
      lunchStyles: ['rice_meals'],
      lunchCustom: 'Steamed Rice with Sambar / Rasam & Poriyal',
      dinnerStyles: ['tiffin_chapati_dosa', 'dosa_idli_only'],
      dinnerCustom: 'Chappati with Kurma or Dosa with Thokku (NO RICE)',
      customNotes: 'Pure veg: strictly no rice at night, chappati or dosa preferred',
      breakfastStyle: 'tiffin_dosa_idli_upma',
      lunchStyle: 'rice_meals',
      dinnerStyle: 'tiffin_chapati_dosa'
    },
    description: 'Traditional South Indian vegetarian lean pantry: Ponni rice, Atta for dinner, Thuvaram paruppu, Vengayam, Thakkali, Urulaikilangu, Puli, and spices.',
    items: [
      { name: 'Rice', quantity: 1500, unit: 'g', category: 'grains_carbs', perishability: 'low', tanglishName: 'Ponni Arisi' },
      { name: 'Wheat Flour', quantity: 600, unit: 'g', category: 'grains_carbs', perishability: 'low', notes: 'For dinner Chappatis / Rotis', tanglishName: 'Godhumai Maavu / Atta' },
      { name: 'Rava', quantity: 300, unit: 'g', category: 'grains_carbs', perishability: 'low', notes: 'For breakfast upma / tiffin', tanglishName: 'Rava / Sooji' },
      { name: 'Toor Dal', quantity: 350, unit: 'g', category: 'dals_pulses', perishability: 'low', tanglishName: 'Thuvaram Paruppu' },
      { name: 'Moong Dal', quantity: 200, unit: 'g', category: 'dals_pulses', perishability: 'low', tanglishName: 'Paasi Paruppu' },
      { name: 'Tomato', quantity: 6, unit: 'pcs', category: 'vegetables', perishability: 'high', notes: 'Softening - use for Rasam/Thokku in 2 days', tanglishName: 'Thakkali' },
      { name: 'Onion', quantity: 5, unit: 'pcs', category: 'vegetables', perishability: 'medium', tanglishName: 'Vengayam' },
      { name: 'Potato', quantity: 4, unit: 'pcs', category: 'vegetables', perishability: 'medium', tanglishName: 'Urulaikilangu' },
      { name: 'Drumstick', quantity: 2, unit: 'pcs', category: 'vegetables', perishability: 'high', notes: 'Fresh murungakkai', tanglishName: 'Murungakkai' },
      { name: 'Green Chilli', quantity: 8, unit: 'pcs', category: 'vegetables', perishability: 'medium', tanglishName: 'Pachai Milagai' },
      { name: 'Curry Leaves', quantity: 1, unit: 'bunch', category: 'vegetables', perishability: 'high', notes: 'Karuveppilai', tanglishName: 'Karuveppilai' },
      { name: 'Garlic', quantity: 1, unit: 'head', category: 'vegetables', perishability: 'low', tanglishName: 'Poondu' },
      { name: 'Lemon', quantity: 3, unit: 'pcs', category: 'fruits', perishability: 'medium', notes: 'For Lemon rice & Rasam', tanglishName: 'Elumichai' },
      { name: 'Banana', quantity: 4, unit: 'pcs', category: 'fruits', perishability: 'high', notes: 'Ripe poovan / robusta', tanglishName: 'Vazhaipazham' },
      { name: 'Cooking Oil', quantity: 300, unit: 'ml', category: 'spices_oils', perishability: 'low', tanglishName: 'Samayal Ennai' },
      { name: 'Mustard Seeds', quantity: 50, unit: 'g', category: 'spices_oils', perishability: 'low', tanglishName: 'Kadugu' },
      { name: 'Cumin Seeds', quantity: 50, unit: 'g', category: 'spices_oils', perishability: 'low', tanglishName: 'Jeeragam' },
      { name: 'Black Pepper', quantity: 40, unit: 'g', category: 'spices_oils', perishability: 'low', tanglishName: 'Milagu' },
      { name: 'Tamarind', quantity: 100, unit: 'g', category: 'spices_oils', perishability: 'low', tanglishName: 'Puli' },
      { name: 'Sambar Powder', quantity: 80, unit: 'g', category: 'spices_oils', perishability: 'low', tanglishName: 'Sambar Podi' },
      { name: 'Turmeric Powder', quantity: 30, unit: 'g', category: 'spices_oils', perishability: 'low', tanglishName: 'Manjal Thool' },
      { name: 'Curd', quantity: 400, unit: 'ml', category: 'dairy_liquids', perishability: 'high', notes: 'Slightly sour - ideal for Mor Kuzhambu/Moru', tanglishName: 'Thayir' },
    ]
  },
  {
    id: 'tamil_nonveg_family',
    label: 'Tamil Non-Veg & Eggs Family Pantry',
    dietCategory: 'non_veg',
    dietLabel: 'Non-Veg & Eggs 🔴 (அசைவம்)',
    householdSize: 'Family of 3-4',
    budgetStretchDays: '3-4 Days Weekend & Weekday Stretch',
    typicalDishes: 'Muttai Thokku with Night Kuska/Rice, Chicken Kuzhambu, Chapatis with Egg Podimas, Rasam Sadam',
    keyStaples: 'Ponni Rice (1.2kg), Atta (500g), Farm Eggs (10 pcs), Chicken/Meen (500g), Tomatoes, Spices',
    defaultDietary: 'egg_inclusive',
    defaultSlotPrefs: {
      breakfastStyles: ['tiffin_dosa_idli_upma'],
      breakfastCustom: 'Dosa or Idli with Podi or Bread Omelette',
      lunchStyles: ['rice_meals', 'variety_rice'],
      lunchCustom: 'Rice with Kozhi/Meen Kuzhambu or Muttai Thokku',
      dinnerStyles: ['tiffin_chapati_dosa', 'rice_only_nonveg'],
      dinnerCustom: 'Chappati normally; Rice / Biriyani only when Muttai or Chicken is cooked',
      customNotes: 'No rice at night, except when non-veg or biriyani/kuska is prepared',
      breakfastStyle: 'tiffin_dosa_idli_upma',
      lunchStyle: 'rice_meals',
      dinnerStyle: 'rice_only_nonveg'
    },
    description: 'Includes farm eggs, fresh chicken/fish options, biriyani spices, Ponni rice, Atta for night chapatis, and gravies.',
    items: [
      { name: 'Rice', quantity: 1200, unit: 'g', category: 'grains_carbs', perishability: 'low', tanglishName: 'Ponni Arisi' },
      { name: 'Wheat Flour', quantity: 500, unit: 'g', category: 'grains_carbs', perishability: 'low', notes: 'For dinner rotis/chapatis', tanglishName: 'Godhumai Maavu / Atta' },
      { name: 'Eggs', quantity: 10, unit: 'pcs', category: 'proteins_meat', perishability: 'medium', notes: 'Muttai for Thokku, Omelette & Curry', tanglishName: 'Muttai' },
      { name: 'Chicken / Meen', quantity: 500, unit: 'g', category: 'proteins_meat', perishability: 'high', notes: 'For gravy or weekend biriyani', tanglishName: 'Kozhi / Meen' },
      { name: 'Onion', quantity: 6, unit: 'pcs', category: 'vegetables', perishability: 'medium', tanglishName: 'Vengayam' },
      { name: 'Tomato', quantity: 6, unit: 'pcs', category: 'vegetables', perishability: 'high', tanglishName: 'Thakkali' },
      { name: 'Potato', quantity: 3, unit: 'pcs', category: 'vegetables', perishability: 'medium', tanglishName: 'Urulaikilangu' },
      { name: 'Ginger & Garlic', quantity: 100, unit: 'g', category: 'vegetables', perishability: 'medium', tanglishName: 'Inji Poondu Paste' },
      { name: 'Green Chilli', quantity: 8, unit: 'pcs', category: 'vegetables', perishability: 'medium', tanglishName: 'Pachai Milagai' },
      { name: 'Curry Leaves', quantity: 1, unit: 'bunch', category: 'vegetables', perishability: 'high', tanglishName: 'Karuveppilai' },
      { name: 'Cooking Oil', quantity: 350, unit: 'ml', category: 'spices_oils', perishability: 'low', tanglishName: 'Samayal Ennai' },
      { name: 'Chilli Powder', quantity: 60, unit: 'g', category: 'spices_oils', perishability: 'low', tanglishName: 'Milagai Thool' },
      { name: 'Coriander Powder', quantity: 60, unit: 'g', category: 'spices_oils', perishability: 'low', tanglishName: 'Malli Thool' },
      { name: 'Garam Masala', quantity: 40, unit: 'g', category: 'spices_oils', perishability: 'low', tanglishName: 'Kari Masala Podi' },
      { name: 'Lemon', quantity: 2, unit: 'pcs', category: 'fruits', perishability: 'medium', tanglishName: 'Elumichai' },
      { name: 'Banana', quantity: 3, unit: 'pcs', category: 'fruits', perishability: 'high', tanglishName: 'Vazhaipazham' },
    ]
  },
  {
    id: 'chennai_bachelor_room',
    label: 'Bachelor Chennai Room Kit (Eggs & Quick Cook)',
    dietCategory: 'non_veg',
    dietLabel: 'Eggs & Quick Cook 🟡 (முட்டை & டிபன்)',
    householdSize: 'Bachelor / Room (1-2)',
    budgetStretchDays: '3-4 Days Quick Batch Cooking',
    typicalDishes: 'Muttai Podimas, Egg Thokku Sadam, Instant Godhumai Dosa, Rava Upma, Maggi Egg scramble',
    keyStaples: 'Arisi (800g), Wheat Atta (400g), Muttai (8 pcs), Rava, Onions, Tomatoes, Green Chillies',
    defaultDietary: 'egg_inclusive',
    defaultSlotPrefs: {
      breakfastStyles: ['tiffin_dosa_idli_upma'],
      breakfastCustom: 'Rava Upma with Green Chilli or Bread Omelette',
      lunchStyles: ['rice_meals', 'variety_rice'],
      lunchCustom: 'Egg Thokku with Ponni Sadam or Lemon Rice',
      dinnerStyles: ['tiffin_chapati_dosa'],
      dinnerCustom: 'Instant Wheat Dosa or Chapati with Muttai Podimas',
      customNotes: 'Quick bachelor cooking, fast single-pan meals, eggs preferred',
      breakfastStyle: 'tiffin_dosa_idli_upma',
      lunchStyle: 'rice_meals',
      dinnerStyle: 'tiffin_chapati_dosa'
    },
    description: 'Fast, budget-friendly room pantry: Ponni rice, Eggs (Muttai), Semiya, Rava, Thakkali, Vengayam, and Maggi.',
    items: [
      { name: 'Rice', quantity: 800, unit: 'g', category: 'grains_carbs', perishability: 'low', tanglishName: 'Arisi' },
      { name: 'Wheat Flour / Atta', quantity: 400, unit: 'g', category: 'grains_carbs', perishability: 'low', tanglishName: 'Atta / Godhumai' },
      { name: 'Eggs', quantity: 8, unit: 'pcs', category: 'proteins_meat', perishability: 'medium', tanglishName: 'Muttai' },
      { name: 'Onion', quantity: 4, unit: 'pcs', category: 'vegetables', perishability: 'medium', tanglishName: 'Vengayam' },
      { name: 'Tomato', quantity: 4, unit: 'pcs', category: 'vegetables', perishability: 'high', tanglishName: 'Thakkali' },
      { name: 'Green Chilli', quantity: 6, unit: 'pcs', category: 'vegetables', perishability: 'medium', tanglishName: 'Pachai Milagai' },
      { name: 'Rava', quantity: 400, unit: 'g', category: 'grains_carbs', perishability: 'low', tanglishName: 'Rava / Sooji' },
      { name: 'Cooking Oil', quantity: 200, unit: 'ml', category: 'spices_oils', perishability: 'low', tanglishName: 'Ennai' },
      { name: 'Mustard Seeds', quantity: 30, unit: 'g', category: 'spices_oils', perishability: 'low', tanglishName: 'Kadugu' },
      { name: 'Chilli Powder', quantity: 40, unit: 'g', category: 'spices_oils', perishability: 'low', tanglishName: 'Milagai Thool' },
      { name: 'Garlic', quantity: 1, unit: 'head', category: 'vegetables', perishability: 'low', tanglishName: 'Poondu' },
      { name: 'Banana', quantity: 3, unit: 'pcs', category: 'fruits', perishability: 'high', tanglishName: 'Vazhaipazham' },
    ]
  },
  {
    id: 'mami_traditional_veg',
    label: 'Traditional Tamil Brahmin / Veg Mami Kitchen',
    dietCategory: 'sattvic',
    dietLabel: 'Sattvic Pure Veg 🟢 (சைவம் / நெய்)',
    householdSize: 'Family (2-4)',
    budgetStretchDays: '4-5 Days Sattvic Kitchen Stretch',
    typicalDishes: 'Kathirikkai Kootu, Thakkali Rasam with Nei, Vazhaikkai Poriyal, Night Phulka with Moong Dal, Mor Kuzhambu',
    keyStaples: 'Sona Masoori Arisi (1.2kg), Atta, Thuvaram & Paasi Paruppu, Thengai, Perungayam, Nei, Curd',
    defaultDietary: 'no_onion_garlic',
    defaultSlotPrefs: {
      breakfastStyles: ['tiffin_dosa_idli_upma', 'porridge_light'],
      breakfastCustom: 'Ven Pongal with Gothsu or Rava Kanji',
      lunchStyles: ['rice_meals'],
      lunchCustom: 'Arisi Sadam + Sambar / Rasam + Thengai Poriyal',
      dinnerStyles: ['tiffin_chapati_dosa', 'chapati_only'],
      dinnerCustom: 'Godhumai Phulka with Paasi Paruppu Kootu (NO RICE)',
      customNotes: 'Strictly Sattvic vegetarian, no onion or garlic, wholesome night phulkas',
      breakfastStyle: 'tiffin_dosa_idli_upma',
      lunchStyle: 'rice_meals',
      dinnerStyle: 'chapati_only'
    },
    description: 'Sattvic vegetarian pantry: Arisi, Thuvaram/Paasi Paruppu, Thengai, Perungayam, Nei, Moru, Kathirikkai, and Vazhaikkai.',
    items: [
      { name: 'Rice', quantity: 1200, unit: 'g', category: 'grains_carbs', perishability: 'low', tanglishName: 'Sona Masoori Arisi' },
      { name: 'Wheat Flour', quantity: 500, unit: 'g', category: 'grains_carbs', perishability: 'low', tanglishName: 'Godhumai Maavu' },
      { name: 'Toor Dal', quantity: 300, unit: 'g', category: 'dals_pulses', perishability: 'low', tanglishName: 'Thuvaram Paruppu' },
      { name: 'Moong Dal', quantity: 250, unit: 'g', category: 'dals_pulses', perishability: 'low', tanglishName: 'Paasi Paruppu' },
      { name: 'Brinjal', quantity: 5, unit: 'pcs', category: 'vegetables', perishability: 'medium', tanglishName: 'Kathirikkai' },
      { name: 'Raw Plantain', quantity: 2, unit: 'pcs', category: 'vegetables', perishability: 'medium', tanglishName: 'Vazhaikkai' },
      { name: 'Tomato', quantity: 5, unit: 'pcs', category: 'vegetables', perishability: 'high', tanglishName: 'Thakkali' },
      { name: 'Coconut', quantity: 0.5, unit: 'pcs', category: 'vegetables', perishability: 'medium', notes: 'Grated for Poriyal/Kootu', tanglishName: 'Thengai' },
      { name: 'Tamarind', quantity: 80, unit: 'g', category: 'spices_oils', perishability: 'low', tanglishName: 'Puli' },
      { name: 'Asafoetida', quantity: 20, unit: 'g', category: 'spices_oils', perishability: 'low', tanglishName: 'Perungayam / Hing' },
      { name: 'Ghee', quantity: 100, unit: 'ml', category: 'dairy_liquids', perishability: 'low', tanglishName: 'Nei' },
      { name: 'Curd', quantity: 500, unit: 'ml', category: 'dairy_liquids', perishability: 'high', tanglishName: 'Thayir' },
      { name: 'Lemon', quantity: 2, unit: 'pcs', category: 'fruits', perishability: 'medium', tanglishName: 'Elumichai' },
      { name: 'Raw Mango', quantity: 1, unit: 'pcs', category: 'fruits', perishability: 'medium', tanglishName: 'Maangai' },
    ]
  }
];

export const COMMON_STAPLE_QUICK_ADDS: Array<{ 
  name: string; 
  tanglishName: string;
  defaultQty: number; 
  unit: string; 
  category: Ingredient['category']; 
  perishability: Ingredient['perishability'] 
}> = [
  // Vegetables (Kaygari)
  { name: 'Tomato', tanglishName: 'Thakkali', defaultQty: 4, unit: 'pcs', category: 'vegetables', perishability: 'high' },
  { name: 'Onion', tanglishName: 'Vengayam', defaultQty: 4, unit: 'pcs', category: 'vegetables', perishability: 'medium' },
  { name: 'Potato', tanglishName: 'Urulaikilangu', defaultQty: 3, unit: 'pcs', category: 'vegetables', perishability: 'medium' },
  { name: 'Drumstick', tanglishName: 'Murungakkai', defaultQty: 2, unit: 'pcs', category: 'vegetables', perishability: 'high' },
  { name: 'Brinjal', tanglishName: 'Kathirikkai', defaultQty: 4, unit: 'pcs', category: 'vegetables', perishability: 'medium' },
  { name: 'Ladies Finger', tanglishName: 'Vendakkai', defaultQty: 250, unit: 'g', category: 'vegetables', perishability: 'high' },
  { name: 'Carrot', tanglishName: 'Carrot', defaultQty: 3, unit: 'pcs', category: 'vegetables', perishability: 'medium' },
  { name: 'Cabbage', tanglishName: 'Muttakose', defaultQty: 0.5, unit: 'head', category: 'vegetables', perishability: 'medium' },
  { name: 'Curry Leaves', tanglishName: 'Karuveppilai', defaultQty: 1, unit: 'bunch', category: 'vegetables', perishability: 'high' },
  { name: 'Coriander', tanglishName: 'Kothamalli', defaultQty: 1, unit: 'bunch', category: 'vegetables', perishability: 'high' },
  { name: 'Garlic', tanglishName: 'Poondu', defaultQty: 1, unit: 'head', category: 'vegetables', perishability: 'low' },
  { name: 'Ginger', tanglishName: 'Inji', defaultQty: 50, unit: 'g', category: 'vegetables', perishability: 'medium' },
  { name: 'Green Chilli', tanglishName: 'Pachai Milagai', defaultQty: 6, unit: 'pcs', category: 'vegetables', perishability: 'medium' },

  // Fruits (Pazhangal)
  { name: 'Lemon', tanglishName: 'Elumichai', defaultQty: 2, unit: 'pcs', category: 'fruits', perishability: 'medium' },
  { name: 'Banana', tanglishName: 'Vazhaipazham', defaultQty: 4, unit: 'pcs', category: 'fruits', perishability: 'high' },
  { name: 'Raw Plantain', tanglishName: 'Vazhaikkai', defaultQty: 2, unit: 'pcs', category: 'vegetables', perishability: 'medium' },
  { name: 'Raw Mango', tanglishName: 'Maangai', defaultQty: 1, unit: 'pcs', category: 'fruits', perishability: 'medium' },
  { name: 'Apple', tanglishName: 'Apple', defaultQty: 2, unit: 'pcs', category: 'fruits', perishability: 'medium' },
  { name: 'Papaya', tanglishName: 'Pappali', defaultQty: 0.5, unit: 'pcs', category: 'fruits', perishability: 'high' },

  // Grains & Flours
  { name: 'Rice', tanglishName: 'Ponni Arisi', defaultQty: 1000, unit: 'g', category: 'grains_carbs', perishability: 'low' },
  { name: 'Wheat Flour', tanglishName: 'Godhumai Maavu / Atta', defaultQty: 500, unit: 'g', category: 'grains_carbs', perishability: 'low' },
  { name: 'Rava', tanglishName: 'Rava / Sooji', defaultQty: 400, unit: 'g', category: 'grains_carbs', perishability: 'low' },
  { name: 'Aval', tanglishName: 'Poha / Aval', defaultQty: 250, unit: 'g', category: 'grains_carbs', perishability: 'low' },
  { name: 'Vermicelli', tanglishName: 'Semiya', defaultQty: 200, unit: 'g', category: 'grains_carbs', perishability: 'low' },

  // Dals & Pulses
  { name: 'Toor Dal', tanglishName: 'Thuvaram Paruppu', defaultQty: 300, unit: 'g', category: 'dals_pulses', perishability: 'low' },
  { name: 'Moong Dal', tanglishName: 'Paasi Paruppu', defaultQty: 200, unit: 'g', category: 'dals_pulses', perishability: 'low' },
  { name: 'Urad Dal', tanglishName: 'Ulundham Paruppu', defaultQty: 200, unit: 'g', category: 'dals_pulses', perishability: 'low' },
  { name: 'Chana Dal', tanglishName: 'Kadalai Paruppu', defaultQty: 150, unit: 'g', category: 'dals_pulses', perishability: 'low' },
  { name: 'Chickpeas', tanglishName: 'Kondakadalai / Sundal', defaultQty: 250, unit: 'g', category: 'dals_pulses', perishability: 'low' },

  // Dairy & Liquids
  { name: 'Curd', tanglishName: 'Thayir', defaultQty: 500, unit: 'ml', category: 'dairy_liquids', perishability: 'high' },
  { name: 'Milk', tanglishName: 'Paal', defaultQty: 500, unit: 'ml', category: 'dairy_liquids', perishability: 'high' },
  { name: 'Ghee', tanglishName: 'Nei', defaultQty: 100, unit: 'ml', category: 'dairy_liquids', perishability: 'low' },
  { name: 'Cooking Oil', tanglishName: 'Samayal Ennai', defaultQty: 250, unit: 'ml', category: 'spices_oils', perishability: 'low' },

  // Spices & Condiments
  { name: 'Mustard Seeds', tanglishName: 'Kadugu', defaultQty: 50, unit: 'g', category: 'spices_oils', perishability: 'low' },
  { name: 'Cumin Seeds', tanglishName: 'Jeeragam', defaultQty: 50, unit: 'g', category: 'spices_oils', perishability: 'low' },
  { name: 'Black Pepper', tanglishName: 'Milagu', defaultQty: 40, unit: 'g', category: 'spices_oils', perishability: 'low' },
  { name: 'Tamarind', tanglishName: 'Puli', defaultQty: 100, unit: 'g', category: 'spices_oils', perishability: 'low' },
  { name: 'Sambar Powder', tanglishName: 'Sambar Podi', defaultQty: 60, unit: 'g', category: 'spices_oils', perishability: 'low' },
  { name: 'Asafoetida', tanglishName: 'Perungayam / Hing', defaultQty: 20, unit: 'g', category: 'spices_oils', perishability: 'low' },
  
  // Non-Veg / Proteins
  { name: 'Eggs', tanglishName: 'Muttai', defaultQty: 6, unit: 'pcs', category: 'proteins_meat', perishability: 'medium' },
  { name: 'Chicken', tanglishName: 'Kozhi Kari', defaultQty: 500, unit: 'g', category: 'proteins_meat', perishability: 'high' },
  { name: 'Fish', tanglishName: 'Meen', defaultQty: 500, unit: 'g', category: 'proteins_meat', perishability: 'high' },
];

export const CATEGORY_LABELS: Record<string, { label: string; tanglish: string; color: string }> = {
  vegetables: { label: 'Vegetables', tanglish: 'Kaaigari (காய்கறி)', color: 'bg-emerald-100/70 text-emerald-800' },
  fruits: { label: 'Fruits', tanglish: 'Pazhangal (பழங்கள்)', color: 'bg-rose-100/70 text-rose-800' },
  grains_carbs: { label: 'Grains & Carbs', tanglish: 'Arisi & Maavu', color: 'bg-amber-100/70 text-amber-800' },
  dals_pulses: { label: 'Dals & Pulses', tanglish: 'Paruppu Vagaigal', color: 'bg-yellow-100/70 text-yellow-900' },
  dairy_liquids: { label: 'Dairy & Liquids', tanglish: 'Paal & Thayir', color: 'bg-blue-100/70 text-blue-800' },
  spices_oils: { label: 'Spices & Oils', tanglish: 'Masala & Ennai', color: 'bg-purple-100/70 text-purple-800' },
  canned_pantry: { label: 'Pantry & Canned', tanglish: 'Appalam & Vathal', color: 'bg-orange-100/70 text-orange-800' },
  proteins_meat: { label: 'Eggs & Non-Veg', tanglish: 'Muttai & Kari', color: 'bg-red-100/70 text-red-800' },
  other: { label: 'Other Items', tanglish: 'Matravai', color: 'bg-stone-100 text-stone-800' },
};
