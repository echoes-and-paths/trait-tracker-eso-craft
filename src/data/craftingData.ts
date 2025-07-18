// ESO Crafting Research Data
export interface CraftingItem {
  name: string;
  traits: string[];
}

export interface CraftingSection {
  name: string;
  items: CraftingItem[];
  traits: string[];
}

export const CRAFTING_DATA: Record<string, CraftingSection> = {
  blacksmithing: {
    name: "Blacksmithing",
    traits: [
      "Powered", "Charged", "Precise", "Infused", "Defending", "Training", "Sharpened", "Decisive", "Sturdy"
    ],
    items: [
      { name: "Sword", traits: [] },
      { name: "Axe", traits: [] },
      { name: "Mace", traits: [] },
      { name: "Dagger", traits: [] },
      { name: "Greatsword", traits: [] },
      { name: "Battle Axe", traits: [] },
      { name: "Maul", traits: [] },
      { name: "Heavy Helm", traits: [] },
      { name: "Heavy Armor", traits: [] },
      { name: "Heavy Pants", traits: [] },
      { name: "Heavy Gloves", traits: [] },
      { name: "Heavy Boots", traits: [] },
      { name: "Heavy Shoulders", traits: [] },
      { name: "Heavy Belt", traits: [] }
    ]
  },
  clothing: {
    name: "Clothing", 
    traits: [
      "Divines", "Infused", "Nirnhoned", "Sturdy", "Training", "Impenetrable", "Reinforced", "Well-Fitted", "Invigorating"
    ],
    items: [
      { name: "Light Robe", traits: [] },
      { name: "Light Hat", traits: [] },
      { name: "Light Pants", traits: [] },
      { name: "Light Gloves", traits: [] },
      { name: "Light Shoes", traits: [] },
      { name: "Light Shoulders", traits: [] },
      { name: "Light Belt", traits: [] },
      { name: "Medium Jacket", traits: [] },
      { name: "Medium Helmet", traits: [] },
      { name: "Medium Pants", traits: [] },
      { name: "Medium Gloves", traits: [] },
      { name: "Medium Boots", traits: [] },
      { name: "Medium Shoulders", traits: [] },
      { name: "Medium Belt", traits: [] }
    ]
  },
  woodworking: {
    name: "Woodworking",
    traits: [
      "Powered", "Charged", "Precise", "Infused", "Defending", "Training", "Sharpened", "Decisive", "Nirnhoned"
    ],
    items: [
      { name: "Bow", traits: [] },
      { name: "Fire Staff", traits: [] },
      { name: "Frost Staff", traits: [] },
      { name: "Lightning Staff", traits: [] },
      { name: "Restoration Staff", traits: [] },
      { name: "Shield", traits: [] }
    ]
  },
  jewelry: {
    name: "Jewelry Crafting",
    traits: [
      "Arcane", "Healthy", "Robust", "Triune", "Infused", "Protective", "Swift", "Harmony", "Bloodthirsty"
    ],
    items: [
      { name: "Ring", traits: [] },
      { name: "Necklace", traits: [] }
    ]
  }
};

export const getAllTraits = (): string[] => {
  const allTraits = new Set<string>();
  Object.values(CRAFTING_DATA).forEach(section => {
    section.traits.forEach(trait => allTraits.add(trait));
  });
  return Array.from(allTraits);
};