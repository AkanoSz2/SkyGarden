import {
    type ChipRarity,
    ChipRarityThresholds,
    type PetTier
} from "./progressionConstants.ts";

export const AllowedArmorPrefixes = [
    "FARM_SUIT",
    "FARM_ARMOR",
    "MELON",
    "CROPIE",
    "SQUASH",
    "FERMENTO",
    "HELIANTHUS",
];

export const ArmorSetBonus: Record<string, { fortune: number; minPieces: number }> = {
    HELIANTHUS: { fortune: 25, minPieces: 2 },
    FERMENTO: { fortune: 25, minPieces: 2 },
    SQUASH: { fortune: 20, minPieces: 2 },
    CROPIE: { fortune: 15, minPieces: 2 },
    MELON: { fortune: 10, minPieces: 2 },
};

export const AllowedEquipmentPrefixes = ["LOTUS", "BLOSSOM", "ZORROS"];
export const AllowedArmorSuffixes = ["HELMET", "CHESTPLATE", "LEGGINGS", "BOOTS"];

export const AllowedToolsPrefixes = [
    "THEORETICAL_HOE",
    "PUMPKIN_DICER",
    "MELON_DICER",
    "CACTUS_KNIFE",
    "COCO_CHOPPER",
    "FUNGI_CUTTER",
];

export const ToolIDCropMap: Record<string, string> = {
    THEORETICAL_HOE_WHEAT:     "Wheat",
    THEORETICAL_HOE_CARROT:    "Carrot",
    THEORETICAL_HOE_POTATO:    "Potato",
    THEORETICAL_HOE_WARTS:     "Nether_Wart",
    THEORETICAL_HOE_CANE:      "Sugar_Cane",
    THEORETICAL_HOE_SUNFLOWER: "Sunflower",
    THEORETICAL_HOE_MOONFLOWER:"Moonflower",
    THEORETICAL_HOE_WILD_ROSE: "Wild_Rose",
    PUMPKIN_DICER:             "Pumpkin",
    MELON_DICER:               "Melon_Slice",
    CACTUS_KNIFE:              "Cactus",
    COCOA_CHOPPER:             "Cocoa_Beans",
    FUNGI_CUTTER:              "Mushroom",
    COCO_CHOPPER:             "Cocoa_Beans",
};

export const TurboEnchantMap: Record<string, string> = {
    turbo_wheat:      "Wheat",
    turbo_carrot:     "Carrot",
    turbo_potato:     "Potato",
    turbo_pumpkin:    "Pumpkin",
    turbo_cane:       "Sugar_Cane",
    turbo_melon:      "Melon_Slice",
    turbo_cactus:     "Cactus",
    turbo_coco:       "Cocoa_Beans",
    turbo_mushrooms:  "Mushroom",
    turbo_warts:      "Nether_Wart",
    turbo_sunflower:  "Sunflower",
    turbo_moonflower: "Moonflower",
    turbo_rose:       "Wild_Rose",
};
export const AllowedItemPrefixes = ["INFINI", "SKYMART"];

export const AllowedAccessories = [
    "CROPIE_TALISMAN",
    "SQUASH_RING",
    "FERMENTO_ARTIFACT",
    "HELIANTHUS_RELIC",
    "ANITA",
    "ATMOSPHERIC",
    "POWER",
    "MAGIC_8",
];

export const ALLOWEDPETS = [
    "ROSE_DRAGON",
    "MOOSHROOM_COW",
    "MOSQUITO",
    "SLUG",
    "BEE",
    "CHICKEN",
    "ELEPHANT",
    "HEDGEHOG",
    "PIG",
    "RABBIT",
];

export const AllowedShards = ["lunar_power", "solar_power", "ultimate_dna"];


export const PetStats: Record<
    string,
    {
        baseFortune?: number;
        fortunePerLevel?: number;
        baseOverbloom?: number;
        overbloomPerLevel?: number;
        baseBpc?: number;
        bpcPerLevel?: number;
        farmingLevelFortunePerLevel?: number;
        milestoneFortunePerLevel?: number;
        sprayonatorFortunePerLevel?: number;
        symbiosisFortunePerMaxedPet?: number;
        strengthPerFortuneBase?: number;
        strengthPerFortuneMin?: number;
    }
> = {
    ROSE_DRAGON: {
        baseFortune: 20.2,
        fortunePerLevel: 0.2,
        baseOverbloom: 20.2,
        overbloomPerLevel: 0.2,
        farmingLevelFortunePerLevel: 0.015,
        milestoneFortunePerLevel: 0.00075,
        symbiosisFortunePerMaxedPet: 3,
    },
    MOOSHROOM_COW: {
        baseFortune: 11,
        fortunePerLevel: 1,
        strengthPerFortuneBase: 39.8,
        strengthPerFortuneMin: 20,
    },
    MOSQUITO: {
        baseBpc: 0.5,
        bpcPerLevel: 0.5,
    },
    SLUG: {
        sprayonatorFortunePerLevel: 1,
    },
};

export const tierPriority: Record<PetTier, number> = {
    COMMON: 0,
    UNCOMMON: 1,
    RARE: 2,
    EPIC: 3,
    LEGENDARY: 4,
    MYTHIC: 5,
};
export const Crops = [
    "Wheat",
    "Carrot",
    "Potato",
    "Pumpkin",
    "Sugar_Cane",
    "Melon",
    "Cactus",
    "Cocoa_Beans",
    "Mushroom",
    "Nether_Wart",
    "Sunflower",
    "Moonflower",
    "Wild_Rose",
];

export const CropIDMap: Record<string, { name: string; fortunePerLevel: number }> = {
    WHEAT: { name: "Wheat", fortunePerLevel: 5 },
    SUGAR_CANE: { name: "Sugar_Cane", fortunePerLevel: 5 },
    CARROT_ITEM: { name: "Carrot", fortunePerLevel: 5 },
    POTATO_ITEM: { name: "Potato", fortunePerLevel: 5 },
    PUMPKIN: { name: "Pumpkin", fortunePerLevel: 5 },
    MELON: { name: "Melon_Slice", fortunePerLevel: 5 },
    MUSHROOM_COLLECTION: { name: "Mushroom", fortunePerLevel: 5 },
    CACTUS: { name: "Cactus", fortunePerLevel: 5 },
    "INK_SACK:3": { name: "Cocoa_Beans", fortunePerLevel: 5 },
    NETHER_STALK: { name: "Nether_Wart", fortunePerLevel: 5 },
    WILD_ROSE: { name: "Wild_Rose", fortunePerLevel: 5 },
    DOUBLE_PLANT: { name: "Sunflower", fortunePerLevel: 5 },
    MOONFLOWER: { name: "Moonflower", fortunePerLevel: 5 },
};

export const CarrolynExportedCropMap: Record<string, string> = {
    EXPORTABLE_CARROTS: "Carrot",
    EXPIRED_PUMPKIN: "Pumpkin",
    SUPREME_CHOCOLATE_BAR: "Cocoa_Beans",
    FINE_FLOUR: "Wheat",
    HALF_EATEN_MUSHROOM: "Mushroom",
    WARTY: "Nether_Wart",
    PRICKLY_KISS: "Wild_Rose",
    POTTED_CACTUS: "Cactus",
};

export const ShardRarities: Record<string, "epic" | "legendary"> = {
    lunar_power: "epic",
    solar_power: "epic",
    ultimate_dna: "legendary",
};


export const ChipEffects: Record<
    string,
    {
        fortune?: number[];
        cropFortune?: number[];
        overbloom?: number[];
        hypercharge?: number[];
        bonusPestChance?: number[];
        copperBonus?: number[];
        farmingWisdom?: number[];
        toolXP?: number[];
        baseCrops?: number[];
        visitorTime?: number[];
    }
> = {
    vermin_vaporizer: { bonusPestChance: [1.5, 2.5, 5] },
    synthesis: { copperBonus: [1, 1.5, 2] },
    sowledge: { farmingWisdom: [1, 1.25, 1.5] },
    mechamind: { toolXP: [1.5, 2, 2.5] },
    hypercharge: { hypercharge: [3, 4, 5] },
    evergreen: { baseCrops: [1, 1.875, 3] },
    overdrive: { cropFortune: [2.5, 5, 7] },
    cropshot: { fortune: [1.5, 2, 5] },
    quickdraw: { visitorTime: [1.5, 2, 2.5] },
    rarefinder: { overbloom: [1, 1.875, 3] },
};

export function getChipRarity(level: number): ChipRarity {
    if (level >= ChipRarityThresholds.legendary) return "legendary";
    if (level >= ChipRarityThresholds.epic) return "epic";
    return "rare";
}

export const rarityIndex: Record<ChipRarity, number> = {
    rare: 0,
    epic: 1,
    legendary: 2,
};

export const bestiary: Record<string, [number, number]> = {
    pest_fly: [6, 250],
    pest_mosquito: [6, 250],
    pest_cricket: [6, 250],
    pest_locust: [6, 250],
    pest_rat: [6, 250],
    pest_worm: [6, 250],
    pest_mite: [6, 250],
    pest_moth: [6, 250],
    pest_firefly: [6, 250],
    pest_praying_mantis: [6, 250],
    pest_dragonfly: [6, 250],
    pest_slug: [6, 250],
    zombuddy: [6, 250],
    pest_beetle: [6, 250],
    timestalk_clone: [7, 20],
    pest_lunar_moth: [7, 100],
    pest_mouse: [7, 100],
};



export const EnchantsFortune: Record<string, number[]> = {
    dedication: [0.25, 0.75, 1, 2],
    harvesting: [0, 12.5, 25, 37.5, 50, 62.5, 75],
    cultivating: [2, 4, 6, 8, 10, 12, 14, 16, 18, 20],
    turbo: [5, 10, 15, 20, 25, 30, 35],
    pesterminator: [2, 4, 6, 8, 10, 12],
    green_thumb: [0.05,	0.1, 0.15, 0.2, 0.25],
};

export const EnchantsOverbloom: Record<string, number[]> = {
    feast: [2, 4, 6, 8, 10],
    ultimate_sunset: [1, 2, 3, 4, 5],
}

export const gems: Record<string, number[]> = {
    PERFECT:  [3, 4, 5, 6, 8, 10],
    FLAWLESS: [2, 3, 4, 5, 6, 8],
    FINE:     [1.5, 2, 3, 4, 5, 6],
    FLAWED:   [1, 1.5, 2, 2.5, 3, 4],
    ROUGH:    [0.5, 1, 1.5, 2, 2.5, 3],
};

export const HYPERCHARGE = [
    "phillip",
    "dark_cacao",
    "choco_cake",
    "atmospheric",
    "magic_8_ball",
    "crop_fever",
    "anita",
    "harvest_harbinger",
    "melon_juice",
    "celestial",
];

export const TEMP: Record<string, number> = {
    phillip: 200,
    dark_cacao: 30,
    choco_cake: 5,
    // crop_fever: 100,
    anita: 25,
    celestial: 15,
    melon_juice: 15,
    harvest_harbinger: 50,
    magic_8_ball: 25,
    atmospheric: 25,
};

export const presetData: Record<string, number> = {
    farmingLevel: 4,
    lunarPower: 5,
    solarPower: 5,
    ultimateDNA: 1,
    greenBandana: 4,
    carrolynFortune: 12,
};