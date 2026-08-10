export type TableGreenhouseRow = {
    id: string;
    count: number;
    rarity: string;
    drops: Record<string, number>;
};

export const CropMultipliers: Record<string, number> = {
    wheat: 1,
    carrot: 3.5,
    potato: 3,
    pumpkin: 0.85,
    sugar_cane: 2,
    melon_slice: 4,
    cactus: 1.5,
    cocoa_beans: 2,
    mushroom: 0.95,
    nether_wart: 3,
    moonflower: 2,
    sunflower: 2,
    wild_rose: 2,
}