// ESO Crafting Research Data
export interface CraftingItem {
  name: string;
  traits: string[];
}

export interface CraftingSubsection {
  name: string;
  items: CraftingItem[];
  traits: string[];
}

export interface CraftingSection {
  name: string;
  subsections: CraftingSubsection[];
}

// Define trait sets
const WEAPON_TRAITS = ["Charged", "Defending", "Infused", "Nirnhoned", "Powered", "Precise", "Sharpened", "Training", "Decisive"];
const ARMOR_TRAITS = ["Divines", "Invigorating", "Impenetrable", "Infused", "Nirnhoned", "Reinforced", "Sturdy", "Training", "Well-Fitted"];
const JEWELRY_TRAITS = ["Arcane", "Bloodthirsty", "Harmony", "Healthy", "Infused", "Protective", "Robust", "Swift", "Triune"];

export const CRAFTING_DATA: Record<string, CraftingSection> = {
  blacksmithing: {
    name: "Blacksmithing",
    subsections: [
      {
        name: "Weapons",
        traits: WEAPON_TRAITS,
        items: [
          { name: "Sword", traits: [] },
          { name: "Axe", traits: [] },
          { name: "Mace", traits: [] },
          { name: "Dagger", traits: [] },
          { name: "Greatsword", traits: [] },
          { name: "Battle Axe", traits: [] },
          { name: "Maul", traits: [] }
        ]
      },
      {
        name: "Heavy Armor",
        traits: ARMOR_TRAITS,
        items: [
          { name: "Cuirasses", traits: [] },
          { name: "Greaves", traits: [] },
          { name: "Pauldrons", traits: [] },
          { name: "Helms", traits: [] },
          { name: "Sabatons", traits: [] },
          { name: "Gauntlets", traits: [] },
          { name: "Girdles", traits: [] }
        ]
      }
    ]
  },
  clothing: {
    name: "Clothing",
    subsections: [
      {
        name: "Light Armor",
        traits: ARMOR_TRAITS,
        items: [
          { name: "Robes", traits: [] },
          { name: "Jerkins", traits: [] },
          { name: "Hats", traits: [] },
          { name: "Epaulets", traits: [] },
          { name: "Breeches", traits: [] },
          { name: "Shoes", traits: [] },
          { name: "Gloves", traits: [] },
          { name: "Sash", traits: [] }
        ]
      },
      {
        name: "Medium Armor",
        traits: ARMOR_TRAITS,
        items: [
          { name: "Jacks", traits: [] },
          { name: "Guards", traits: [] },
          { name: "Helmets", traits: [] },
          { name: "Arm Cops", traits: [] },
          { name: "Boots", traits: [] },
          { name: "Bracers", traits: [] },
          { name: "Belts", traits: [] }
        ]
      }
    ]
  },
  woodworking: {
    name: "Woodworking",
    subsections: [
      {
        name: "Weapons",
        traits: WEAPON_TRAITS,
        items: [
          { name: "Bow", traits: [] },
          { name: "Fire Staff", traits: [] },
          { name: "Frost Staff", traits: [] },
          { name: "Lightning Staff", traits: [] },
          { name: "Restoration Staff", traits: [] }
        ]
      },
      {
        name: "Shields",
        traits: ARMOR_TRAITS,
        items: [
          { name: "Shield", traits: [] }
        ]
      }
    ]
  },
  jewelry: {
    name: "Jewelry Crafting",
    subsections: [
      {
        name: "Jewelry",
        traits: JEWELRY_TRAITS,
        items: [
          { name: "Ring", traits: [] },
          { name: "Necklace", traits: [] }
        ]
      }
    ]
  }
};

export const getAllTraits = (): string[] => {
  const allTraits = new Set<string>();
  Object.values(CRAFTING_DATA).forEach(section => {
    section.subsections.forEach(subsection => {
      subsection.traits.forEach(trait => allTraits.add(trait));
    });
  });
  return Array.from(allTraits);
};