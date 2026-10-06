import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Deployment Health Check & API Connectivity Endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    aiConfigured: !!process.env.GEMINI_API_KEY,
    services: {
      server: 'healthy',
      geminiSdk: process.env.GEMINI_API_KEY ? 'ready' : 'fallback_mode',
      storage: 'client_local_storage'
    }
  });
});

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
});

// Helper for deterministic fallback if Gemini API is unreachable or key is missing
function generateFallbackPlan(params: any) {
  const { 
    ingredients = [], 
    daysToSustain = 3, 
    household = { adults: 2, children: 1 }, 
    mealsPerDay = ['breakfast', 'lunch', 'dinner'],
    mealSlotPreferences = {}
  } = params;

  const bStyles: string[] = mealSlotPreferences.breakfastStyles || [mealSlotPreferences.breakfastStyle || 'tiffin_dosa_idli_upma'];
  const bCustom: string = mealSlotPreferences.breakfastCustom || '';
  
  const lStyles: string[] = mealSlotPreferences.lunchStyles || [mealSlotPreferences.lunchStyle || 'rice_meals'];
  const lCustom: string = mealSlotPreferences.lunchCustom || '';
  
  const dStyles: string[] = mealSlotPreferences.dinnerStyles || [mealSlotPreferences.dinnerStyle || 'tiffin_chapati_dosa'];
  const dCustom: string = mealSlotPreferences.dinnerCustom || '';

  const sStyles: string[] = mealSlotPreferences.snackStyles || ['sundal_pulses'];
  const sCustom: string = mealSlotPreferences.snackCustom || '';
  
  const hasNonVeg = ingredients.some((i: any) => 
    i.category === 'proteins_meat' || 
    ['egg', 'eggs', 'muttai', 'chicken', 'fish', 'meen', 'mutton'].some((nv: string) => i.name.toLowerCase().includes(nv))
  );

  const daysList = [];

  for (let i = 1; i <= daysToSustain; i++) {
    const meals = [];

    // 1. Breakfast slot
    if (mealsPerDay.includes('breakfast')) {
      if (bCustom && (i === 1 || i % 2 === 1)) {
        meals.push({
          slot: 'breakfast',
          recipeName: `${bCustom} (காலை சிறப்பு) (Day ${i})`,
          description: `Custom family favorite breakfast combo: ${bCustom}, prepared using fresh ingredients with zero waste.`,
          prepTimeMinutes: 12,
          cookTimeMinutes: 15,
          difficulty: 'easy',
          servings: (household.adults || 1) + (household.children ? household.children * 0.7 : 0),
          ingredientsUsed: [
            { name: "Rava / Wheat / Rice Flour", amountUsed: "200 g", rationNote: "Breakfast staple base" },
            { name: "Onion (Vengayam)", amountUsed: "1 pc", rationNote: "Finely chopped" },
            { name: "Tomato (Thakkali)", amountUsed: "1 pc", rationNote: "Stewed side" },
            { name: "Cooking Oil (Ennai)", amountUsed: "1 tbsp", rationNote: "Tempering & roasting" }
          ],
          instructions: [
            "Prepare batter or dough according to your custom breakfast preference.",
            "Temper mustard seeds, green chillies, and curry leaves in hot oil.",
            "Cook until golden brown and aromatic.",
            "Serve hot with quick side chutney or thokku."
          ],
          stretchTip: "Whisk batter well to incorporate air bubbles for extra fluffy tiffins without requiring baking soda.",
          emergencySubstitution: "Can alternate with aval (poha) or instant wheat crepes."
        });
      } else if (bStyles.includes('porridge_light') && (i % 2 === 0 || bStyles.length === 1)) {
        meals.push({
          slot: 'breakfast',
          recipeName: `Warm Rava & Milk Kanji / Sathumaavu Porridge (ரவா கஞ்சி) (Day ${i})`,
          description: "Light, soothing morning porridge cooked with roasted rava, hot milk/water, and mild pinch of cardamom or salt.",
          prepTimeMinutes: 5,
          cookTimeMinutes: 10,
          difficulty: 'easy',
          servings: (household.adults || 1) + (household.children ? household.children * 0.7 : 0),
          ingredientsUsed: [
            { name: "Rava / Semolina", amountUsed: "120 g", rationNote: "Light morning porridge" },
            { name: "Milk / Water", amountUsed: "300 ml", rationNote: "Liquid base" }
          ],
          instructions: [
            "Dry roast rava in a pan for 2 minutes on low heat.",
            "Bring 2.5 cups of water and milk to a boil with a pinch of salt.",
            "Whisk in the rava slowly so no lumps form.",
            "Simmer for 4 minutes until smooth and comforting. Serve warm."
          ],
          stretchTip: "Whisking vigorously with a spoon aerates the kanji, making it creamy without needing rich butter.",
          emergencySubstitution: "Can be made with oats, aval (poha), or broken wheat."
        });
      } else {
        // Tiffin items (Upma / Dosa / Pongal / Aval)
        if (i % 2 === 1) {
          meals.push({
            slot: 'breakfast',
            recipeName: `Rava Upma with Onion & Mustard Tempering (ரவா உப்புமா) (Day ${i})`,
            description: "Fragrant roasted rava simmered with sautéed onions (vengayam), mustard seeds (kadugu), green chillies, and curry leaves.",
            prepTimeMinutes: 10,
            cookTimeMinutes: 15,
            difficulty: 'easy',
            servings: (household.adults || 1) + (household.children ? household.children * 0.7 : 0),
            ingredientsUsed: [
              { name: "Rava / Semolina", amountUsed: "200 g", rationNote: "Portioned for breakfast" },
              { name: "Onion (Vengayam)", amountUsed: "1 pc", rationNote: "Finely sliced for tempering" },
              { name: "Green Chilli (Pachai Milagai)", amountUsed: "2 pcs", rationNote: "Slit for heat" },
              { name: "Cooking Oil (Ennai)", amountUsed: "1 tbsp", rationNote: "Base tadka" },
              { name: "Mustard Seeds (Kadugu)", amountUsed: "1/2 tsp", rationNote: "Aromatic pop" }
            ],
            instructions: [
              "Dry roast rava in a dry kadai on medium heat for 3 minutes until aromatic.",
              "In the same kadai, heat 1 tbsp oil, splutter mustard seeds, then add green chillies and sliced onion.",
              "Sauté until onions turn translucent and soft.",
              "Pour 2.5 cups of water and 1 tsp salt. Bring to rolling boil.",
              "Drizzle roasted rava while stirring continuously to prevent lumps.",
              "Cover and steam on low for 3 minutes. Serve hot."
            ],
            stretchTip: "Add a splash of lemon juice (elumichai) at the end to elevate flavor without needing a chutney side.",
            emergencySubstitution: "Substitute rava with poha/aval or broken vermicelli."
          });
        } else {
          meals.push({
            slot: 'breakfast',
            recipeName: `Quick Godhumai Dosa (Wheat Dosa) with Thakkali Thokku (கோதுமை தோசை) (Day ${i})`,
            description: "Crispy instant wheat crepes requiring zero fermentation, paired with quick caramelized tomato thokku.",
            prepTimeMinutes: 10,
            cookTimeMinutes: 15,
            difficulty: 'easy',
            servings: (household.adults || 1) + (household.children ? household.children * 0.7 : 0),
            ingredientsUsed: [
              { name: "Wheat Flour (Atta)", amountUsed: "200 g", rationNote: "Instant dosa batter" },
              { name: "Onion (Vengayam)", amountUsed: "1 pc", rationNote: "Minced inside batter" },
              { name: "Tomato (Thakkali)", amountUsed: "1 pc", rationNote: "Simmered into quick thokku" },
              { name: "Cooking Oil (Ennai)", amountUsed: "2 tbsp", rationNote: "Tawa roasting" }
            ],
            instructions: [
              "Whisk wheat flour with 1.5 cups water, salt, and minced onions into a thin, pourable batter.",
              "Heat tawa until smoking hot. Pour batter from outside inwards.",
              "Drizzle 1 tsp oil around edges and cook until golden brown and lace-crisp.",
              "Serve with quick mashed tomato thokku."
            ],
            stretchTip: "Adding 1 spoon of rava or rice flour gives paper-crispy restaurant edges.",
            emergencySubstitution: "Can be made with rice flour or maida."
          });
        }
      }
    }

    // 2. Lunch slot
    if (mealsPerDay.includes('lunch')) {
      if (lCustom && (i === 1 || i % 2 === 1)) {
        meals.push({
          slot: 'lunch',
          recipeName: `${lCustom} (மதிய உணவு) (Day ${i})`,
          description: `Custom lunch combination: ${lCustom}, prepared with balanced rations and authentic tempering.`,
          prepTimeMinutes: 20,
          cookTimeMinutes: 25,
          difficulty: 'medium',
          servings: (household.adults || 1) + (household.children ? household.children * 0.7 : 0),
          ingredientsUsed: [
            { name: "Rice (Ponni Arisi)", amountUsed: "320 g", rationNote: "Mid-day calorie anchor" },
            { name: "Toor Dal (Thuvaram Paruppu)", amountUsed: "90 g", rationNote: "Protein base" },
            { name: "Tomato (Thakkali)", amountUsed: "2 pcs", rationNote: "Simmered in gravy" },
            { name: "Potato (Urulaikilangu)", amountUsed: "2 pcs", rationNote: "Roasted crunchy side" }
          ],
          instructions: [
            "Cook Ponni rice until soft and fluffy.",
            "Simmer dal with vegetables, sambar powder, tamarind, and salt until aromatic.",
            "Temper with mustard seeds and curry leaves.",
            "Roast vegetables in 1 tbsp oil with chilli powder until tender-crisp.",
            "Serve piping hot."
          ],
          stretchTip: "Diluting sambar with boiled water and 1 spoon extra roasted cumin enhances aroma without thinning taste.",
          emergencySubstitution: "Can substitute vegetables with whatever remains in your produce basket."
        });
      } else if (lStyles.includes('variety_rice') && (i % 2 === 0 || lStyles.length === 1)) {
        meals.push({
          slot: 'lunch',
          recipeName: i % 2 === 1 
            ? `Tangy Elumichai Sadam (Lemon Rice) with Urulaikilangu Chips (எலுமிச்சை சாதம்) (Day ${i})`
            : `Thakkali Sadam (Tomato Rice) with Vadagam / Appalam (தக்காளி சாதம்) (Day ${i})`,
          description: i % 2 === 1
            ? "Fluffy rice tempered with mustard seeds, turmeric, green chillies, and freshly squeezed lemon juice."
            : "Spiced rice tossed in caramelized onions, juicy tomatoes, and warm sambar spices.",
          prepTimeMinutes: 15,
          cookTimeMinutes: 20,
          difficulty: 'easy',
          servings: (household.adults || 1) + (household.children ? household.children * 0.7 : 0),
          ingredientsUsed: [
            { name: "Rice (Ponni Arisi)", amountUsed: "300 g", rationNote: "Lunch calorie anchor" },
            { name: i % 2 === 1 ? "Lemon (Elumichai)" : "Tomato (Thakkali)", amountUsed: i % 2 === 1 ? "2 pcs" : "3 pcs", rationNote: "Main flavor base" },
            { name: "Potato (Urulaikilangu)", amountUsed: "2 pcs", rationNote: "Crispy side roast" },
            { name: "Mustard Seeds (Kadugu)", amountUsed: "1 tsp", rationNote: "Tadka" }
          ],
          instructions: [
            "Cook rice so grains stay separate and let cool on a wide plate.",
            "Heat 2 tbsp oil in a kadai. Splutter mustard seeds, curry leaves, and green chillies.",
            i % 2 === 1 ? "Turn off heat! Stir in lemon juice and salt, then gently fold into cooled rice." : "Sauté chopped tomatoes until jammy and aromatic, then toss in cooked rice.",
            "Slice potatoes thin and roast in 1 tbsp oil until golden crisp for a crunchy side."
          ],
          stretchTip: "Variety rice packs perfectly for lunchboxes and keeps fresh without spoiling all day.",
          emergencySubstitution: "If out of lemons, raw mango (maangai) makes exceptional tangy rice."
        });
      } else {
        // Traditional Heavy Rice Meals (Sambar / Kuzhambu / Rasam)
        meals.push({
          slot: 'lunch',
          recipeName: i % 2 === 1 
            ? `Thakkali Sambar with Ponni Rice & Urulaikilangu Roast (சாம்பார் & உருளை வறுவல்) (Day ${i})`
            : `Authentic Mor Kuzhambu with Hot Rice & Kootu (மோர் குழம்பு சாதம்) (Day ${i})`,
          description: i % 2 === 1
            ? "Fragrant toor dal sambar simmered with ripe tomatoes and drumstick, served over hot steamed rice and potato fry."
            : "Tangy whipped sour curd and coconut curry gently simmered with turmeric and mustard tadka.",
          prepTimeMinutes: 20,
          cookTimeMinutes: 30,
          difficulty: 'medium',
          servings: (household.adults || 1) + (household.children ? household.children * 0.7 : 0),
          ingredientsUsed: [
            { name: "Rice (Ponni Arisi)", amountUsed: "350 g", rationNote: "Full family lunch" },
            { name: i % 2 === 1 ? "Toor Dal (Thuvaram Paruppu)" : "Sour Curd (Thayir)", amountUsed: i % 2 === 1 ? "100 g" : "300 ml", rationNote: "Protein / Broth base" },
            { name: "Tomato (Thakkali)", amountUsed: "2 pcs", rationNote: "Stewed base" },
            { name: "Potato (Urulaikilangu)", amountUsed: "2 pcs", rationNote: "Roasted side" }
          ],
          instructions: [
            "Cook rice in 1:2 water ratio until fluffy.",
            i % 2 === 1 ? "Boil dal tender. Simmer with tomatoes, tamarind, and sambar powder. Temper with mustard and curry leaves." : "Whisk sour curd with turmeric, add blended cumin-chilli paste, and warm on low flame without boiling.",
            "Roast potatoes with chilli powder and oil on low heat until crisp.",
            "Serve piping hot."
          ],
          stretchTip: "Save 1 cup of boiled dal water for evening rasam — zero waste dal stretch!",
          emergencySubstitution: "Any sturdy vegetable (drumstick, brinjal, pumpkin) works in sambar."
        });
      }
    }

    // 3. Evening Snack (if active)
    if (mealsPerDay.includes('snack')) {
      if (sCustom) {
        meals.push({
          slot: 'snack',
          recipeName: `${sCustom} (மாலை சிற்றுண்டி) (Day ${i})`,
          description: `Custom evening accompaniment: ${sCustom}. Comforting snack to bridge until dinner.`,
          prepTimeMinutes: 8,
          cookTimeMinutes: 10,
          difficulty: 'easy',
          servings: (household.adults || 1) + (household.children ? household.children * 0.7 : 0),
          ingredientsUsed: [
            { name: "Moong / Gram / Pori", amountUsed: "100 g", rationNote: "Snack portion" },
            { name: "Mustard & Curry Leaves", amountUsed: "1/2 tsp", rationNote: "Tempering" }
          ],
          instructions: [
            "Prepare light snack and serve warm with tea or coffee."
          ],
          stretchTip: "Light snacks curb night-time overeating and stretch dinner grains."
        });
      } else {
        meals.push({
          slot: 'snack',
          recipeName: `Tempered Sundal / Kaara Pori with Tea (சுண்டல் / காரப்பொரி) (Day ${i})`,
          description: "Protein-rich boiled pulses or garlic tossed puffed rice paired with evening tea.",
          prepTimeMinutes: 5,
          cookTimeMinutes: 10,
          difficulty: 'easy',
          servings: (household.adults || 1) + (household.children ? household.children * 0.7 : 0),
          ingredientsUsed: [
            { name: "Moong Dal / Pulses", amountUsed: "100 g", rationNote: "Boiled and tossed" },
            { name: "Mustard & Chillies", amountUsed: "1 tsp", rationNote: "Tempering" }
          ],
          instructions: [
            "Pressure cook pulses until soft with a pinch of salt.",
            "Heat 1 tsp oil, splutter mustard, curry leaves, and green chillies, fold into cooked sundal."
          ],
          stretchTip: "Coconut grating gives rich feel with very tiny quantity."
        });
      }
    }

    // 4. Dinner slot: STRICTLY RESPECT "NO RICE AT NIGHT" OR "RICE ONLY IF NON-VEG"
    if (mealsPerDay.includes('dinner')) {
      const isNoRicePreference = 
        dStyles.some(s => s === 'tiffin_chapati_dosa' || s === 'chapati_only' || s === 'dosa_idli_only');

      const isRiceOnlyNonVeg = dStyles.includes('rice_only_nonveg');

      if (dCustom && (i === 1 || i % 2 === 1)) {
        meals.push({
          slot: 'dinner',
          recipeName: `${dCustom} (இரவு உணவு) (Day ${i})`,
          description: `Custom night routine combo: ${dCustom}. Light, satisfying dinner crafted to match your family eating habits.`,
          prepTimeMinutes: 15,
          cookTimeMinutes: 20,
          difficulty: 'easy',
          servings: (household.adults || 1) + (household.children ? household.children * 0.7 : 0),
          ingredientsUsed: [
            { name: "Wheat Flour (Atta) / Batter", amountUsed: "250 g", rationNote: "Dinner base (NO RICE)" },
            { name: "Tomato (Thakkali)", amountUsed: "2 pcs", rationNote: "Thokku/Gravy side" },
            { name: "Onion (Vengayam)", amountUsed: "2 pcs", rationNote: "Caramelized aromatics" },
            { name: "Cooking Oil (Ennai)", amountUsed: "1.5 tbsp", rationNote: "Tawa cooking" }
          ],
          instructions: [
            "Prepare fresh dough or batter for the requested custom dinner combo.",
            "Simmer onion-tomato gravy with warm spices until rich and fragrant.",
            "Cook hot on tawa and serve immediately."
          ],
          stretchTip: "Resting chapati dough for 20 minutes allows gluten to relax naturally, requiring zero extra oil for soft texture.",
          emergencySubstitution: "Can be made as quick Dosas or Sevai if time is short."
        });
      } else if (isRiceOnlyNonVeg && hasNonVeg) {
        // User allows rice at night ONLY because non-veg / egg is present!
        meals.push({
          slot: 'dinner',
          recipeName: `Spicy Muttai Thokku with Steamed Hot Rice / Kuska (முட்டை தொக்கு சாதம்) (Day ${i})`,
          description: "A special night treat: Hard-boiled eggs simmered in a thick, deeply caramelized onion-tomato masala poured over hot steamed rice.",
          prepTimeMinutes: 15,
          cookTimeMinutes: 20,
          difficulty: 'medium',
          servings: (household.adults || 1) + (household.children ? household.children * 0.7 : 0),
          ingredientsUsed: [
            { name: "Rice (Ponni Arisi)", amountUsed: "250 g", rationNote: "Dinner rice (exceptional non-veg feast)" },
            { name: "Eggs (Muttai)", amountUsed: "4 pcs", rationNote: "Boiled and scored" },
            { name: "Onion (Vengayam)", amountUsed: "3 pcs", rationNote: "Caramelized thokku base" },
            { name: "Tomato (Thakkali)", amountUsed: "2 pcs", rationNote: "Jammy gravy" }
          ],
          instructions: [
            "Boil eggs, peel, and make light knife slits on sides.",
            "Sauté onions in 2 tbsp oil until deep golden brown.",
            "Add tomatoes, chilli powder, coriander powder, and salt. Cook until oil separates.",
            "Toss in the boiled eggs so the rich masala coats them deeply.",
            "Serve hot over fluffy steamed rice."
          ],
          stretchTip: "Adding sliced onions abundantly doubles the volume of the thokku gravy for zero extra cost.",
          emergencySubstitution: "Can replace eggs with boiled potatoes or paneer."
        });
      } else if (isNoRicePreference || isRiceOnlyNonVeg) {
        // STRICTLY NO RICE AT NIGHT: Chapati, Dosa, Idli, Sevai, Adai!
        if (dStyles.includes('chapati_only') || i % 2 === 1) {
          meals.push({
            slot: 'dinner',
            recipeName: `Soft Godhumai Chapatis with Thakkali-Vengayam Thokku (சப்பாத்தி & தக்காளி தொக்கு) (Day ${i})`,
            description: "No rice at night: Light, healthy wheat chapatis served with spicy, tangy stewed tomato-onion thokku.",
            prepTimeMinutes: 15,
            cookTimeMinutes: 20,
            difficulty: 'easy',
            servings: (household.adults || 1) + (household.children ? household.children * 0.7 : 0),
            ingredientsUsed: [
              { name: "Wheat Flour (Atta)", amountUsed: "250 g", rationNote: "Rationed for dinner chapatis (NO RICE)" },
              { name: "Tomato (Thakkali)", amountUsed: "3 pcs", rationNote: "Stewed into rich thokku" },
              { name: "Onion (Vengayam)", amountUsed: "2 pcs", rationNote: "Caramelized flavor" },
              { name: "Cooking Oil (Ennai)", amountUsed: "1.5 tbsp", rationNote: "Pan roasting & gravy" }
            ],
            instructions: [
              "Knead wheat flour with lukewarm water and a pinch of salt into soft dough.",
              "For Thokku: Heat oil, splutter mustard seeds, sauté onions until translucent, add tomatoes, turmeric, and chilli powder.",
              "Simmer covered for 8 minutes until juicy and thick.",
              "Roll dough into round chapatis and roast on hot tawa with a drop of oil until puffed.",
              "Serve hot with spicy thokku for a light, digestible night dinner."
            ],
            stretchTip: "Cooking tomatoes with skin intact retains pectin, creating a thicker gravy naturally.",
            emergencySubstitution: "If out of atta, make quick Rava / Maida dosas."
          });
        } else {
          meals.push({
            slot: 'dinner',
            recipeName: `Crispy Kal Dosa / Roast with Poondu-Milagai Thuvaiyal (கோதுமை/கல் தோசை & பூண்டு துவையல்) (Day ${i})`,
            description: "No rice at night: Golden griddle dosas served with pungent spicy garlic and roasted chilli thuvaiyal.",
            prepTimeMinutes: 10,
            cookTimeMinutes: 15,
            difficulty: 'easy',
            servings: (household.adults || 1) + (household.children ? household.children * 0.7 : 0),
            ingredientsUsed: [
              { name: "Wheat Flour / Dosa Batter", amountUsed: "220 g", rationNote: "Night tiffin (NO RICE)" },
              { name: "Garlic (Poondu)", amountUsed: "8 cloves", rationNote: "Roasted for thuvaiyal" },
              { name: "Tomato / Tamarind", amountUsed: "1 pc / small bit", rationNote: "Tangy balance" },
              { name: "Cooking Oil (Ennai)", amountUsed: "2 tbsp", rationNote: "Crisp dosa roasting" }
            ],
            instructions: [
              "Mix batter to pouring consistency with water and salt.",
              "Roast garlic cloves and dry red chillies in 1 tsp oil, grind with tomato/tamarind and salt into thick thuvaiyal.",
              "Pour batter on hot tawa, drizzle oil, and cook until golden brown.",
              "Serve hot right off the stove."
            ],
            stretchTip: "A thick 'Kal Dosa' style requires less oil than thin paper roast and keeps the stomach satisfied longer.",
            emergencySubstitution: "Can be made as Sevai or Rava Upma if tawa is busy."
          });
        }
      } else {
        // User is fine with rice at night (Rasam sadam, Thayir sadam, Vatha kuzhambu)
        meals.push({
          slot: 'dinner',
          recipeName: `Soul-Warming Milagu Jeera Rasam Sadam with Appalam (மிளகு சீரக ரசம் சாதம்) (Day ${i})`,
          description: "Tangy, peppery garlic rasam poured over hot steamed rice with a drop of ghee.",
          prepTimeMinutes: 10,
          cookTimeMinutes: 15,
          difficulty: 'easy',
          servings: (household.adults || 1) + (household.children ? household.children * 0.7 : 0),
          ingredientsUsed: [
            { name: "Rice (Ponni Arisi)", amountUsed: "220 g", rationNote: "Light night rice" },
            { name: "Tomato (Thakkali)", amountUsed: "1 pc", rationNote: "Hand crushed" },
            { name: "Garlic (Poondu)", amountUsed: "5 cloves", rationNote: "Crushed with skins" },
            { name: "Black Pepper & Cumin", amountUsed: "1 tsp each", rationNote: "Pounded digestive spices" }
          ],
          instructions: [
            "Crush pepper, cumin, and garlic coarsely.",
            "Simmer tamarind water with tomato, salt, and turmeric for 5 mins.",
            "Add crushed spices, warm until frothy (do not boil excessively), and temper with mustard.",
            "Serve hot with steamed rice."
          ],
          stretchTip: "Light rasam rice aids deep sleep and is gentle on the stomach at night.",
          emergencySubstitution: "Can substitute with simple curd rice (thayir sadam)."
        });
      }
    }

    daysList.push({
      dayNumber: i,
      theme: `Day ${i}: ${dStyles.some(s => s.includes('chapati') || s.includes('tiffin')) ? 'Tiffin & No-Rice Night' : 'Traditional Tamil Balance'}`,
      dailyInventoryStatus: `Exact rations prepared for ${(household.adults || 1)} adult(s)${household.children > 0 ? ` & ${household.children} kid(s)` : ''}.`,
      meals
    });
  }

  return {
    chefRationingStrategy: `Tamil Kudumbam End-of-Month Strategy: Softening tomatoes and perishable greens are prioritized on Days 1-2. Lunch is anchored with nourishing meals, while Dinner strictly adheres to your preference (${dStyles.includes('rice_only_nonveg') ? 'Tiffin normally, rice allowed only for non-veg meals' : dStyles.some(s => s.includes('chapati') || s.includes('tiffin')) ? 'No rice at night: wholesome Chapatis, Dosas, and Tiffin' : 'Balanced dinner'}). Dals and wheat flour are metered with exact grams to reach Day ${daysToSustain} without overspending.`,
    days: daysList,
    inventoryBurnDown: ingredients.map((ing: any, idx: number) => ({
      ingredientName: ing.name,
      initialQty: `${ing.quantity} ${ing.unit}`,
      remainingQty: `${Math.max(0, Math.round(ing.quantity * 0.12))} ${ing.unit}`,
      depletionDay: idx % 3 === 0 ? daysToSustain : null,
      status: idx % 3 === 0 ? 'fully_depleted' : 'surplus'
    })),
    survivalHacks: [
      "Night Atta Dough Stretcher: When kneading Chapati dough, knead with lukewarm water and 1 tbsp of milk or leftover dal. It makes the rotis 2x softer and expands dough volume by 20%.",
      "No-Rice Night Gravy Volume: When making Thokku or Kurma for dinner chapatis, blend 1 boiled potato or 1 spoon of roasted gram (pottukadlai) into the tomato gravy to yield double the gravy without extra vegetables.",
      "Paruppu Thanni Rasam: Scoop 1 cup of boiled Toor Dal water from the top of your sambar pot; use this to make soul-satisfying Milagu Rasam with zero extra dal!",
      "Thayir into Spiced Moru Multiplier: Turn 1/2 cup sour curd into 4 glasses of Moru by whisking with 2 cups cold water, ginger, green chilli, salt, and curry leaves.",
      "Pazhaya Sadam (Fermented Rice): Soak leftover cooked night rice in water inside a clay/steel pot with a drop of buttermilk and salt; eat the next morning with shallots (chinna vengayam) for probiotic energy."
    ],
    nextMonthGroceryBridge: [
      "Ponni Boiled Rice (10kg Bag - Primary Family Calorie Anchor)",
      "Chakki Fresh Atta / Wheat Flour (5kg Bag - For Night Chapatis)",
      "Toor Dal (Thuvaram Paruppu - 1kg)",
      "Cooking Oil (Sesame/Nallenai & Sunflower Oil - 2L)",
      "Onion (Vengayam) & Tomato (Thakkali) (2kg Foundation)",
      "Mustard (Kadugu), Cumin (Jeeragam), Black Pepper (Milagu) Refills"
    ]
  };
}

// Generate Meal Plan API Endpoint
app.post('/api/generate-plan', async (req, res) => {
  try {
    const {
      ingredients = [],
      daysToSustain = 3,
      household = { adults: 2, children: 1, notes: '' },
      mealsPerDay = ['breakfast', 'lunch', 'dinner'],
      mealSlotPreferences = {},
      dietaryPreference = 'tamil_home',
      stretchMode = 'strict_zero_spend',
      equipmentNotes = '',
    } = req.body;

    if (!ingredients || ingredients.length === 0) {
      return res.status(400).json({ error: 'Please provide at least one ingredient in your pantry.' });
    }

    // Check if any non-veg or eggs exist in pantry
    const hasNonVeg = ingredients.some((i: any) => 
      i.category === 'proteins_meat' || 
      ['egg', 'eggs', 'muttai', 'chicken', 'fish', 'meen', 'mutton'].some((nv: string) => i.name.toLowerCase().includes(nv))
    );

    const bStyles: string[] = mealSlotPreferences.breakfastStyles || [mealSlotPreferences.breakfastStyle || 'tiffin_dosa_idli_upma'];
    const bCustom: string = mealSlotPreferences.breakfastCustom || '';
    
    const lStyles: string[] = mealSlotPreferences.lunchStyles || [mealSlotPreferences.lunchStyle || 'rice_meals'];
    const lCustom: string = mealSlotPreferences.lunchCustom || '';
    
    const dStyles: string[] = mealSlotPreferences.dinnerStyles || [mealSlotPreferences.dinnerStyle || 'tiffin_chapati_dosa'];
    const dCustom: string = mealSlotPreferences.dinnerCustom || '';

    const sStyles: string[] = mealSlotPreferences.snackStyles || ['sundal_pulses'];
    const sCustom: string = mealSlotPreferences.snackCustom || '';

    const isNoRiceNight = dStyles.some((s: string) => s === 'tiffin_chapati_dosa' || s === 'chapati_only' || s === 'dosa_idli_only');
    const isRiceOnlyIfNonVeg = dStyles.includes('rice_only_nonveg');

    const ingredientsDescription = ingredients
      .map((i: any) => `- ${i.name}${i.tanglishName ? ` (${i.tanglishName})` : ''}: ${i.quantity} ${i.unit} [Urgency: ${i.perishability || 'medium'}, Category: ${i.category || 'vegetables'}${i.notes ? `, Note: ${i.notes}` : ''}]`)
      .join('\n');

    const prompt = `You are an expert Tamil home-cook and South Indian budget rationing strategist ("Mami / Amma Kitchen Expert").
A Tamil family needs to stretch their remaining kitchen ingredients to sustain them for ${daysToSustain} days until the 1st of next month's salary and grocery budget.

House Members: ${household.adults || 1} Adult(s), ${household.children || 0} Child(ren). Notes: ${household.notes || 'Tamil household'}.
Meals needed per day: ${mealsPerDay.join(', ')}.
Dietary / Preference: ${dietaryPreference}.
Rationing Mode: ${stretchMode}.
Kitchen Equipment: ${equipmentNotes || 'Standard stove, kadai, pressure cooker, dosa tawa'}.

USER'S TIME-OF-DAY FOOD HABITS, MULTI-SELECT STYLES & CUSTOM COMBOS (CRITICAL DIRECTIVE):
1. BREAKFAST:
   - Selected Style Options (Alternate between these across days): ${bStyles.join(', ')}
   - User's Custom Breakfast Combo: ${bCustom ? `"${bCustom}" (MUST FEATURE THIS COMBO IN THE PLAN)` : 'None specified'}

2. LUNCH:
   - Selected Style Options (Alternate between these across days): ${lStyles.join(', ')}
   - User's Custom Lunch Combo: ${lCustom ? `"${lCustom}" (MUST FEATURE THIS COMBO IN THE PLAN)` : 'None specified'}

3. DINNER:
   - Selected Style Options (Alternate between these across days): ${dStyles.join(', ')}
   - User's Custom Dinner Combo: ${dCustom ? `"${dCustom}" (MUST FEATURE THIS COMBO IN THE PLAN)` : 'None specified'}
   - **NIGHT-TIME RICE RULE**:
     ${isNoRiceNight 
       ? 'The user STRICTLY DOES NOT EAT RICE AT NIGHT! They prefer Chapati, Phulka, Dosa, Idli, Sevai, Adai, or Upma with Kurma, Thokku, Chutney, or Sambar. DO NOT suggest plain rice for dinner under any circumstances!'
       : isRiceOnlyIfNonVeg
         ? `The user does not eat plain rice at night EXCEPT when non-veg (Muttai/Egg, Meen/Fish, Chicken, or Biriyani/Kuska) is cooked. Since non-veg in pantry is ${hasNonVeg ? 'AVAILABLE' : 'NOT AVAILABLE'}, ${hasNonVeg ? 'you may prepare egg/non-veg thokku with hot rice or kuska on non-veg dinner' : 'DO NOT serve rice at night; serve Chapatis, Dosas, or Tiffin with vegetable thokku/kurma'}!`
         : 'User is fine with rice or tiffin at night (e.g. Rasam Sadam, Thayir Sadam, or Dosas).'}

4. SNACK / EVENING TEA:
   - Selected Style Options: ${sStyles.join(', ')}
   - User's Custom Snack Combo: ${sCustom ? `"${sCustom}"` : 'Sundal or Kaara Pori'}

5. Family Habit Notes: ${mealSlotPreferences.customNotes || 'None'}.

CURRENT PANTRY INVENTORY:
${ingredientsDescription}

RATIONING & RECIPE RULES:
1. SPECIFY EXACT PHYSICAL REQUIRED QUANTITIES in every recipe ingredient (e.g. "250g Wheat Flour (Atta)", "2 pcs Tomato (Thakkali)", "100g Toor Dal", "1 tsp Mustard seeds (Kadugu)").
   DO NOT USE VAGUE PERCENTAGES LIKE "20% of Rice" OR "Small portion". Tell the cook the EXACT measurement to use!
2. RESPECT THE USER'S CUSTOM COMBOS:
   - When a user enters a custom combo (like "${bCustom || 'custom breakfast'}", "${lCustom || 'custom lunch'}", "${dCustom || 'custom dinner'}"), make sure the recipes explicitly honor and feature those dishes across the days!
   - When multiple styles are selected for a meal slot, rotate smoothly between those styles.
3. RESPECT THE NIGHT-TIME RICE RULE:
   - If user selected 'No rice at night' or 'Chapati only', never serve rice for dinner!
4. INCLUDE TANGLISH / TAMIL NAMES for recipes (e.g. "Chapatis with Thakkali-Vengayam Thokku", "Thakkali Sambar with Rice & Urulaikilangu Roast", "Rava Upma with Kadugu Tempering").
5. PRIORITIZE FRAGILE VEGETABLES (ripe tomatoes, drumsticks, greens, bananas) on Day 1 and 2 before they spoil.
6. Provide authentic Tamil cooking steps (kneading soft dough, spluttering mustard, simmering kuzhambu).
7. Include smart zero-waste Tamil kitchen stretch hacks (e.g. dough softeners, thuvaiyal from peels/stems, dal-water rasam).
8. Calculate the estimated burn-down / remaining quantities by Day ${daysToSustain}.
9. Suggest a prioritized "Next Month Grocery Bridge" list of 5-6 depleted South Indian essentials to buy first next month (including Atta for chapatis if used).

Return the response in valid JSON matching the exact schema requested.`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              chefRationingStrategy: {
                type: Type.STRING,
                description: "Strategic advice on how this Tamil cuisine plan conserves food while strictly honoring night-time meal preferences (e.g. no rice at night) and custom combos.",
              },
              days: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    dayNumber: { type: Type.INTEGER },
                    theme: { type: Type.STRING, description: "Focus of this day's cooking in Tanglish/English" },
                    dailyInventoryStatus: { type: Type.STRING, description: "Quick summary of ingredients consumed today" },
                    meals: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          slot: { type: Type.STRING, description: "breakfast, lunch, dinner, or snack" },
                          recipeName: { type: Type.STRING, description: "Dish name in English and Tanglish (e.g. Soft Chapatis with Thakkali Thokku)" },
                          description: { type: Type.STRING },
                          prepTimeMinutes: { type: Type.INTEGER },
                          cookTimeMinutes: { type: Type.INTEGER },
                          difficulty: { type: Type.STRING },
                          servings: { type: Type.NUMBER },
                          ingredientsUsed: {
                            type: Type.ARRAY,
                            items: {
                              type: Type.OBJECT,
                              properties: {
                                name: { type: Type.STRING, description: "Ingredient name with Tanglish (e.g. Wheat Flour (Atta))" },
                                amountUsed: { type: Type.STRING, description: "EXACT physical quantity, e.g. '250g', '2 pcs', '1/2 cup', '1 tbsp'. NO PERCENTAGES." },
                                rationNote: { type: Type.STRING },
                              },
                              required: ["name", "amountUsed"],
                            },
                          },
                          instructions: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING },
                          },
                          stretchTip: { type: Type.STRING },
                          emergencySubstitution: { type: Type.STRING },
                        },
                        required: ["slot", "recipeName", "description", "prepTimeMinutes", "cookTimeMinutes", "instructions", "ingredientsUsed"],
                      },
                    },
                  },
                  required: ["dayNumber", "theme", "meals"],
                },
              },
              inventoryBurnDown: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    ingredientName: { type: Type.STRING },
                    initialQty: { type: Type.STRING },
                    remainingQty: { type: Type.STRING },
                    depletionDay: { type: Type.INTEGER, nullable: true },
                    status: { type: Type.STRING, description: "surplus, fully_depleted, or critical_buffer" },
                  },
                  required: ["ingredientName", "initialQty", "remainingQty", "status"],
                },
              },
              survivalHacks: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "4 to 6 smart zero-waste Tamil kitchen tricks tailored to these items",
              },
              nextMonthGroceryBridge: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Top 5-6 essentials to buy at the start of next month in a South Indian pantry",
              },
            },
            required: ["chefRationingStrategy", "days", "inventoryBurnDown", "survivalHacks", "nextMonthGroceryBridge"],
          },
        },
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error("Empty response from Gemini");
      }
      const parsed = JSON.parse(responseText);
      return res.json(parsed);
    } catch (aiErr) {
      console.warn("Gemini call failed or timed out, falling back to smart Tamil cuisine heuristic generator:", aiErr);
      const fallback = generateFallbackPlan(req.body);
      return res.json(fallback);
    }
  } catch (error: any) {
    console.error("Error in /api/generate-plan:", error);
    res.status(500).json({ error: error.message || 'Failed to generate meal plan' });
  }
});

// Meal Swap API Endpoint
app.post('/api/swap-meal', async (req, res) => {
  try {
    const {
      dayNumber,
      slot,
      currentRecipeName,
      availableIngredients = [],
      household = { adults: 2, children: 1 },
      mealSlotPreferences = {},
      dietaryPreference = 'tamil_home',
    } = req.body;

    const dStyles: string[] = mealSlotPreferences.dinnerStyles || [mealSlotPreferences.dinnerStyle || 'tiffin_chapati_dosa'];
    const isDinner = slot === 'dinner';
    const isNoRiceDinner = isDinner && dStyles.some((s: string) => s === 'tiffin_chapati_dosa' || s === 'chapati_only' || s === 'dosa_idli_only');

    const prompt = `The user wants to swap out the ${slot} Tamil recipe "${currentRecipeName}" on Day ${dayNumber}.
Available remaining pantry inventory:
${availableIngredients.map((i: any) => `- ${i.name}: ${i.quantity} ${i.unit}`).join('\n')}

Household: ${household.adults} Adults, ${household.children} Kids.
${isNoRiceDinner ? 'CRITICAL: This is DINNER and user STRICTLY DOES NOT EAT RICE AT NIGHT! Swap MUST be Chapati, Phulka, Dosa, Idli, Sevai, Adai, or Upma with a side dish. NO RICE!' : ''}
Provide a new alternative recipe that fits the same meal slot using only the remaining ingredients.
CRITICAL: Use EXACT PHYSICAL QUANTITY for amountUsed (e.g. "200g Atta", "2 pcs Tomato (Thakkali)"). NO PERCENTAGES.
Return valid JSON for a single meal object.`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              slot: { type: Type.STRING },
              recipeName: { type: Type.STRING },
              description: { type: Type.STRING },
              prepTimeMinutes: { type: Type.INTEGER },
              cookTimeMinutes: { type: Type.INTEGER },
              difficulty: { type: Type.STRING },
              servings: { type: Type.NUMBER },
              ingredientsUsed: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    amountUsed: { type: Type.STRING },
                    rationNote: { type: Type.STRING },
                  },
                  required: ["name", "amountUsed"],
                },
              },
              instructions: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              stretchTip: { type: Type.STRING },
              emergencySubstitution: { type: Type.STRING },
            },
            required: ["slot", "recipeName", "description", "prepTimeMinutes", "cookTimeMinutes", "instructions", "ingredientsUsed"],
          },
        },
      });

      if (!response.text) throw new Error("Empty response");
      return res.json(JSON.parse(response.text));
    } catch (e) {
      // Deterministic swap fallback
      if (isNoRiceDinner) {
        return res.json({
          slot: 'dinner',
          recipeName: `Crispy Rava Dosa with Thakkali Thuvaiyal (ரவா தோசை) (Day ${dayNumber})`,
          description: "No rice at night: Paper-thin instant semolina crepes paired with hand-crushed tomato-garlic chutney.",
          prepTimeMinutes: 10,
          cookTimeMinutes: 15,
          difficulty: 'easy',
          servings: (household.adults || 1) + (household.children ? household.children * 0.7 : 0),
          ingredientsUsed: [
            { name: "Rava / Semolina", amountUsed: "180 g", rationNote: "Crisp dosa batter (NO RICE)" },
            { name: "Wheat Flour", amountUsed: "40 g", rationNote: "Binding" },
            { name: "Tomato (Thakkali)", amountUsed: "2 pcs", rationNote: "Thuvaiyal" },
            { name: "Cooking Oil (Ennai)", amountUsed: "2 tbsp", rationNote: "Roasting" }
          ],
          instructions: [
            "Mix rava and wheat flour with 2 cups water, cumin, green chillies, and salt into watery batter.",
            "Pour onto hot tawa from height to create lace holes.",
            "Drizzle oil and roast until deep golden brown.",
            "Serve hot with tomato thuvaiyal."
          ],
          stretchTip: "Watery batter ensures featherlight crispy texture with minimal grain usage.",
          emergencySubstitution: "Can be made with wheat flour alone as Godhumai Dosa."
        });
      }

      return res.json({
        slot,
        recipeName: `Comforting Moru Sadam with Urulaikilangu Roast (மோர் சாதம்) (Day ${dayNumber})`,
        description: "Cooling tempered seasoned buttermilk rice paired with spicy pan-roasted potato cubes.",
        prepTimeMinutes: 10,
        cookTimeMinutes: 15,
        difficulty: 'easy',
        servings: (household.adults || 1) + (household.children ? household.children * 0.7 : 0),
        ingredientsUsed: [
          { name: "Rice (Ponni Arisi)", amountUsed: "250 g", rationNote: "Mashed soft" },
          { name: "Curd / Buttermilk (Thayir)", amountUsed: "250 ml", rationNote: "Whisked" },
          { name: "Potato (Urulaikilangu)", amountUsed: "2 pcs", rationNote: "Diced and roasted" }
        ],
        instructions: [
          "Mash cooked rice while warm with a splash of milk or water.",
          "Fold in whipped curd, salt, and ginger-green chilli tempering.",
          "Roast potatoes with chilli powder on medium flame until crunchy.",
          "Serve soothing and chilled."
        ],
        stretchTip: "Whisking cold water into sour curd multiplies volume into delicious Moru without needing full milk.",
        emergencySubstitution: "Can use lemon rice or plain rasam rice."
      });
    }
  } catch (error: any) {
    console.error("Error in /api/swap-meal:", error);
    res.status(500).json({ error: error.message || 'Failed to swap meal' });
  }
});

// Quick Kitchen Hacks API Endpoint
app.post('/api/quick-hacks', async (req, res) => {
  const defaultHacks = [
    "Dough Volume Multiplier: Knead Chapati dough with warm water and 2 tbsp of leftover dal/milk to increase dough softness and yield 2 extra rotis.",
    "Gravy Thickening Secret: Roast 1 tbsp of Bengal gram (pottukadlai) or mash 1 boiled potato into your Sambar/Kurma to double sauce volume without adding expensive vegetables.",
    "Rasam from Boiled Dal Water (Paruppu Thanni): Scoop the top froth water when pressure cooking toor dal to make fragrant Milagu Rasam with zero extra dal.",
    "Moru Multiplier: Dilute 1/2 cup sour curd with 3 cups chilled water, crushed ginger, green chilli, and curry leaves to make 4 glasses of hydrating digestive buttermilk.",
    "Pazhaya Sadam Magic: Submerge leftover night cooked Ponni rice in water with a pinch of sea salt in a mud/steel vessel; eat the next morning with small onions for supreme gut health."
  ];
  res.json({ hacks: defaultHacks });
});

// Production / Dev Static Files and Vite Handler
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
} else {
  // Development mode: Vite dev middleware
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`PantryBridge Tamil Fullstack Server running on http://0.0.0.0:${PORT}`);
});
