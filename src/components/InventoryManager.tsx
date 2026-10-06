import React, { useState } from 'react';
import { Ingredient, Category, Perishability } from '../types';
import { PANTRY_PRESETS, COMMON_STAPLE_QUICK_ADDS, CATEGORY_LABELS } from '../data/presets';
import { formatIngredientName, getTanglishName } from '../data/tanglishDictionary';
import { 
  Plus, 
  Trash2, 
  AlertTriangle, 
  FileText, 
  Search, 
  Minus,
  Sparkles
} from 'lucide-react';

interface InventoryManagerProps {
  ingredients: Ingredient[];
  onAddIngredient: (item: Omit<Ingredient, 'id'>) => void;
  onUpdateIngredient: (id: string, updates: Partial<Ingredient>) => void;
  onRemoveIngredient: (id: string) => void;
  onLoadPreset: (presetId: string) => void;
  onClearAll: () => void;
  isTanglish: boolean;
}

export const InventoryManager: React.FC<InventoryManagerProps> = ({
  ingredients,
  onAddIngredient,
  onUpdateIngredient,
  onRemoveIngredient,
  onLoadPreset,
  onClearAll,
  isTanglish,
}) => {
  // New Item Form State
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState<number>(1);
  const [unit, setUnit] = useState('pcs');
  const [category, setCategory] = useState<Category>('vegetables');
  const [perishability, setPerishability] = useState<Perishability>('medium');
  const [notes, setNotes] = useState('');
  const [isAddingOpen, setIsAddingOpen] = useState(false);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showPresetsDetail, setShowPresetsDetail] = useState(false);
  
  // Quick paste text modal state
  const [showPasteModal, setShowPasteModal] = useState(false);
  const [pastedText, setPastedText] = useState('');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const trimmed = name.trim();
    const tanglish = getTanglishName(trimmed);

    onAddIngredient({
      name: trimmed,
      tanglishName: tanglish || undefined,
      quantity: Number(quantity) || 1,
      unit: unit.trim() || 'pcs',
      category,
      perishability,
      notes: notes.trim() || undefined,
    });

    setName('');
    setQuantity(1);
    setNotes('');
  };

  const handleQuickAdd = (item: typeof COMMON_STAPLE_QUICK_ADDS[0]) => {
    const existing = ingredients.find(
      i => i.name.toLowerCase() === item.name.toLowerCase() ||
           (i.tanglishName && i.tanglishName.toLowerCase() === item.tanglishName.toLowerCase())
    );

    if (existing) {
      onUpdateIngredient(existing.id, { quantity: existing.quantity + item.defaultQty });
    } else {
      onAddIngredient({
        name: item.name,
        tanglishName: item.tanglishName,
        quantity: item.defaultQty,
        unit: item.unit,
        category: item.category,
        perishability: item.perishability,
      });
    }
  };

  const handleParsePastedText = () => {
    if (!pastedText.trim()) return;

    const lines = pastedText.split(/[\n,]+/).map(s => s.trim()).filter(Boolean);
    lines.forEach(line => {
      const match = line.match(/^([\d.]+)\s*([a-zA-Z]*)\s+(.+)$/);
      if (match) {
        const qty = parseFloat(match[1]) || 1;
        const u = match[2] || 'pcs';
        const rawName = match[3];
        const tanglish = getTanglishName(rawName);
        onAddIngredient({
          name: rawName,
          tanglishName: tanglish || undefined,
          quantity: qty,
          unit: u || 'pcs',
          category: 'vegetables',
          perishability: 'medium'
        });
      } else {
        const tanglish = getTanglishName(line);
        onAddIngredient({
          name: line,
          tanglishName: tanglish || undefined,
          quantity: 1,
          unit: 'pcs',
          category: 'vegetables',
          perishability: 'medium'
        });
      }
    });

    setPastedText('');
    setShowPasteModal(false);
  };

  const filteredIngredients = ingredients.filter(item => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      item.name.toLowerCase().includes(searchLower) ||
      (item.tanglishName && item.tanglishName.toLowerCase().includes(searchLower));
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const highPerishabilityCount = ingredients.filter(i => i.perishability === 'high').length;

  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 shadow-sm p-4 sm:p-6 mb-8">
      
      {/* Top Banner & Preset Selector */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-5 border-b border-stone-100">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-serif text-stone-900 font-semibold tracking-tight">
              1. Kitchen Pantry Inventory {isTanglish ? '(சமையலறை பொருட்கள்)' : ''}
            </h2>
            <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-full bg-stone-100 text-stone-700">
              {ingredients.length} items
            </span>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            List available vegetables (kaaigari), fruits (pazhangal), dals (paruppu), grains (arisi), and spices so the chef can ration them precisely.
          </p>
        </div>

        {/* Preset Profiles with Veg/Non-Veg & Family Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowPresetsDetail(prev => !prev)}
            className={`text-xs px-2.5 py-1.5 rounded-lg font-semibold transition-all cursor-pointer border flex items-center gap-1.5 shadow-3xs ${
              showPresetsDetail
                ? 'bg-amber-600 text-white border-amber-700'
                : 'bg-amber-50 hover:bg-amber-100 text-amber-950 border-amber-300'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Quick Resets & Blueprints</span>
            <span className="text-[10px] px-1 py-0.2 rounded bg-amber-200/60 text-amber-950 font-bold">
              Veg / Non-Veg
            </span>
          </button>

          {PANTRY_PRESETS.map(preset => (
            <button
              key={preset.id}
              onClick={() => onLoadPreset(preset.id)}
              className="text-xs px-2.5 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200/90 text-stone-800 font-medium transition-all cursor-pointer border border-stone-200/80 flex items-center gap-1.5 shadow-3xs hover:border-stone-300"
              title={preset.description}
            >
              <span>{preset.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
                preset.dietCategory === 'veg' 
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                  : preset.dietCategory === 'non_veg'
                    ? 'bg-rose-100 text-rose-800 border border-rose-200'
                    : 'bg-amber-100 text-amber-800 border border-amber-200'
              }`}>
                {preset.dietLabel}
              </span>
            </button>
          ))}
          <button
            onClick={() => setShowPasteModal(true)}
            className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium border border-stone-200 transition-colors cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-stone-600" />
            <span>Paste List</span>
          </button>
          <button
            onClick={onClearAll}
            className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg bg-stone-50 hover:bg-rose-50 text-stone-500 hover:text-rose-700 font-medium border border-stone-200 hover:border-rose-300 transition-colors cursor-pointer"
            title="Clear all pantry items"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* EXPANDABLE QUICK RESETS & KITCHEN BLUEPRINTS PANEL */}
      {showPresetsDetail && (
        <div className="mt-4 p-4 rounded-xl bg-amber-50/70 border border-amber-300 shadow-xs transition-all">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Quick Kitchen Resets & Tamil Pantry Blueprints (முன்அமைப்புகள்)</span>
              </h3>
              <p className="text-xs text-stone-600 mt-0.5">
                1-click reset your inventory and automatic time-of-day habits for Veg, Non-Veg, Bachelor, or Sattvic kitchens:
              </p>
            </div>
            <button
              onClick={() => setShowPresetsDetail(false)}
              className="text-xs text-stone-500 hover:text-stone-800 underline cursor-pointer"
            >
              Close
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {PANTRY_PRESETS.map(preset => (
              <div
                key={preset.id}
                className="bg-white p-3.5 rounded-xl border border-stone-200/90 shadow-2xs flex flex-col justify-between hover:border-amber-400 transition-all"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div>
                      <h4 className="text-xs font-bold text-stone-900">{preset.label}</h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] text-stone-500">{preset.householdSize}</span>
                        {preset.budgetStretchDays && (
                          <span className="text-[10px] text-amber-800 font-medium bg-amber-100/80 px-1.5 py-0.2 rounded">
                            {preset.budgetStretchDays}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase shrink-0 border ${
                      preset.dietCategory === 'veg' 
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300' 
                        : preset.dietCategory === 'non_veg'
                          ? 'bg-rose-100 text-rose-800 border-rose-300'
                          : 'bg-amber-100 text-amber-800 border-amber-300'
                    }`}>
                      {preset.dietLabel}
                    </span>
                  </div>

                  <p className="text-xs text-stone-600 mb-2 leading-relaxed">
                    {preset.description}
                  </p>

                  {preset.keyStaples && (
                    <div className="text-[11px] text-stone-700 bg-stone-50 p-2 rounded-lg border border-stone-100 mb-2">
                      <strong className="font-semibold text-stone-900">Key Staples: </strong>
                      <span>{preset.keyStaples}</span>
                    </div>
                  )}

                  {preset.typicalDishes && (
                    <div className="text-[11px] text-stone-600 mb-3">
                      <strong className="font-semibold text-stone-800">Typical Meals: </strong>
                      <span>{preset.typicalDishes}</span>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onLoadPreset(preset.id);
                    setShowPresetsDetail(false);
                  }}
                  className="w-full py-1.5 px-3 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-medium text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-3xs"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Reset & Load This Blueprint ({preset.items.length} items)</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Perishable Urgency Alert */}
      {highPerishabilityCount > 0 && (
        <div className="mt-4 p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl flex items-start gap-2.5 text-xs text-amber-900">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <strong className="font-semibold text-amber-950">
              {highPerishabilityCount} fragile item{highPerishabilityCount > 1 ? 's' : ''} detected (e.g. softening Thakkali, ripe Vazhaipazham, Keerai, or Thayir):
            </strong>{' '}
            These will be prioritized by the chef on Days 1 and 2 to eliminate food spoilage!
          </div>
        </div>
      )}

      {/* Quick Add Staple Bar with Tanglish labels */}
      <div className="mt-4 pt-1">
        <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
          <span className="font-medium text-stone-600">Quick-tap South Indian staples (Vegetables, Fruits, Dals, Spices):</span>
          <span className="text-stone-400">Tap to add</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {COMMON_STAPLE_QUICK_ADDS.map(staple => {
            const displayName = isTanglish 
              ? `${staple.name} (${staple.tanglishName})` 
              : staple.name;

            return (
              <button
                key={staple.name}
                onClick={() => handleQuickAdd(staple)}
                className="text-xs px-2.5 py-1 rounded-md bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200/80 hover:border-stone-300 transition-all flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3 text-stone-400" />
                <span>{displayName}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search and Category Filter */}
      <div className="mt-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Category Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none text-xs">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-stone-900 text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            All Items ({ingredients.length})
          </button>
          {Object.entries(CATEGORY_LABELS).map(([key, value]) => {
            const count = ingredients.filter(i => i.category === key).length;
            if (count === 0 && selectedCategory !== key) return null;
            const tabLabel = isTanglish ? value.tanglish : value.label;

            return (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`px-2.5 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === key
                    ? 'bg-stone-900 text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {tabLabel} {count > 0 && `(${count})`}
              </button>
            );
          })}
        </div>

        {/* Search Input & Add Toggle */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-48">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={isTanglish ? "Search (e.g. Thakkali, Arisi)..." : "Search items..."}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-stone-50 border border-stone-200 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-400"
            />
          </div>
          <button
            onClick={() => setIsAddingOpen(!isAddingOpen)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
              isAddingOpen 
                ? 'bg-stone-200 text-stone-800' 
                : 'bg-amber-600 hover:bg-amber-700 text-white'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isAddingOpen ? 'Close Form' : 'Add Item'}</span>
          </button>
        </div>
      </div>

      {/* Collapsible Add Item Form */}
      {isAddingOpen && (
        <form onSubmit={handleAddSubmit} className="mt-4 p-4 rounded-xl bg-amber-50/40 border border-amber-200/60 animate-in fade-in duration-150">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-3">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Item Name (English or Tanglish) *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Tomato / Thakkali, Rice / Arisi, Lemon / Elumichai"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3 py-1.5 bg-white rounded-lg border border-stone-300 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Quantity *
              </label>
              <input
                type="number"
                step="any"
                min="0.1"
                required
                value={quantity}
                onChange={e => setQuantity(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-1.5 bg-white rounded-lg border border-stone-300 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Unit *
              </label>
              <select
                value={unit}
                onChange={e => setUnit(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white rounded-lg border border-stone-300 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                <option value="pcs">pcs (pieces)</option>
                <option value="g">g (grams)</option>
                <option value="kg">kg (kilograms)</option>
                <option value="ml">ml (milliliters)</option>
                <option value="cups">cups</option>
                <option value="tbsp">tbsp</option>
                <option value="tsp">tsp</option>
                <option value="head">head / bulb</option>
                <option value="bunch">bunch / kothu</option>
                <option value="cloves">cloves (pal)</option>
                <option value="cans">cans</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as Category)}
                className="w-full px-2.5 py-1.5 bg-white rounded-lg border border-stone-300 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                <option value="vegetables">Vegetables (காய்கறி)</option>
                <option value="fruits">Fruits (பழங்கள்)</option>
                <option value="grains_carbs">Grains & Carbs (அரிசி/ரவா)</option>
                <option value="dals_pulses">Dals & Pulses (பருப்பு)</option>
                <option value="dairy_liquids">Dairy & Liquids (பால்/தயிர்)</option>
                <option value="spices_oils">Spices & Oils (எண்ணெய்/மசாலா)</option>
                <option value="canned_pantry">Pantry Staples (அப்பளம்/வத்தல்)</option>
                <option value="proteins_meat">Eggs & Proteins (முட்டை)</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Perishability
              </label>
              <select
                value={perishability}
                onChange={e => setPerishability(e.target.value as Perishability)}
                className="w-full px-2.5 py-1.5 bg-white rounded-lg border border-stone-300 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                <option value="high">High (1-2 days / wilting)</option>
                <option value="medium">Medium (3-5 days)</option>
                <option value="low">Low (Shelf-stable)</option>
              </select>
            </div>
          </div>

          <div className="mt-3 flex flex-col sm:flex-row items-center justify-between gap-3">
            <input
              type="text"
              placeholder="Optional notes (e.g. 'Ripe bananas', 'Sour curd for Mor Kuzhambu')"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full sm:w-2/3 px-3 py-1.5 bg-white rounded-lg border border-stone-300 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
            <button
              type="submit"
              className="w-full sm:w-auto px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-medium cursor-pointer transition-colors"
            >
              Confirm Add
            </button>
          </div>
        </form>
      )}

      {/* Inventory Grid / Table */}
      <div className="mt-4">
        {filteredIngredients.length === 0 ? (
          <div className="text-center py-12 px-4 border-2 border-dashed border-stone-200 rounded-xl bg-stone-50/50">
            <p className="text-sm font-medium text-stone-600">No ingredients match your filter.</p>
            <p className="text-xs text-stone-400 mt-1">
              Add some items above or choose one of our quick Tamil kitchen presets like "Tamil Kudumbam End-of-Month"!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
            {filteredIngredients.map(item => {
              const catInfo = CATEGORY_LABELS[item.category] || CATEGORY_LABELS.other;
              
              // Handle Tanglish formatted display
              const displayName = isTanglish 
                ? (item.tanglishName ? `${item.name} (${item.tanglishName})` : formatIngredientName(item.name, true))
                : item.name;

              return (
                <div
                  key={item.id}
                  className="p-3 rounded-xl border border-stone-200/80 bg-white hover:border-stone-300 transition-all flex flex-col justify-between shadow-2xs group"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-semibold text-stone-900 leading-snug">
                        {displayName}
                      </span>
                      <button
                        onClick={() => onRemoveIngredient(item.id)}
                        className="opacity-0 group-hover:opacity-100 text-stone-400 hover:text-rose-600 transition-opacity p-0.5 cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Metadata line */}
                    <div className="flex items-center gap-1.5 text-[11px] text-stone-500 mt-1">
                      <span>{isTanglish ? catInfo.tanglish : catInfo.label}</span>
                      <span aria-hidden="true">·</span>
                      <span className={
                        item.perishability === 'high' 
                          ? 'text-amber-700 font-medium' 
                          : item.perishability === 'medium' 
                            ? 'text-stone-600' 
                            : 'text-stone-400'
                      }>
                        {item.perishability === 'high' ? '⚠️ Use in 1-2d' : item.perishability === 'medium' ? 'Use in 3-5d' : 'Staple'}
                      </span>
                    </div>

                    {item.notes && (
                      <p className="text-[11px] text-stone-400 italic mt-1 line-clamp-1">
                        "{item.notes}"
                      </p>
                    )}
                  </div>

                  {/* Quantity controls */}
                  <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between">
                    <span className="text-xs font-mono font-medium text-stone-700 tabular-nums">
                      {item.quantity} {item.unit}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onUpdateIngredient(item.id, { quantity: Math.max(0.5, item.quantity - (item.unit === 'g' || item.unit === 'ml' ? 50 : 1)) })}
                        className="w-5 h-5 rounded flex items-center justify-center bg-stone-100 hover:bg-stone-200 text-stone-600 cursor-pointer"
                        title="Decrease"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => onUpdateIngredient(item.id, { quantity: item.quantity + (item.unit === 'g' || item.unit === 'ml' ? 50 : 1) })}
                        className="w-5 h-5 rounded flex items-center justify-center bg-stone-100 hover:bg-stone-200 text-stone-600 cursor-pointer"
                        title="Increase"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer helper */}
      <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-400">
        <span>Tip: Keep basic tadka spices (Kadugu, Jeeragam, Puli, Karuveppilai) entered for authentic flavor calculations.</span>
        {ingredients.length > 0 && (
          <button
            onClick={onClearAll}
            className="text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
          >
            Clear All Items
          </button>
        )}
      </div>

      {/* Paste Modal */}
      {showPasteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-stone-200 animate-in zoom-in-95 duration-150">
            <h3 className="text-base font-semibold text-stone-900 mb-1">
              Quick Paste Ingredients List
            </h3>
            <p className="text-xs text-stone-500 mb-3">
              Paste in English or Tanglish (e.g., "500g Arisi, 4 pcs Thakkali, 2 pcs Urulaikilangu, 100g Thuvaram Paruppu").
            </p>
            <textarea
              rows={5}
              value={pastedText}
              onChange={e => setPastedText(e.target.value)}
              placeholder="500g Ponni Arisi&#10;4 pcs Thakkali&#10;3 pcs Urulaikilangu&#10;2 pcs Elumichai&#10;100g Thuvaram Paruppu"
              className="w-full p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs font-mono text-stone-800 focus:outline-none focus:ring-1 focus:ring-stone-400"
            />
            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                onClick={() => setShowPasteModal(false)}
                className="px-3 py-1.5 text-xs text-stone-600 hover:text-stone-900 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleParsePastedText}
                className="px-4 py-1.5 bg-stone-900 hover:bg-black text-white text-xs font-medium rounded-lg cursor-pointer"
              >
                Import Items
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
