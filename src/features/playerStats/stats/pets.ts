import {ALLOWEDPETS, PetStats, tierPriority, presetData} from "../data/itemData.ts";
import {PetLevelXP, type PetTier} from "../data/progressionConstants.ts";
import type {SkyblockMember, Pet} from "../types.ts";


export async function getPets(myStats: SkyblockMember): Promise<Pet[]> {
    const rawPets = myStats.pets_data?.pets ?? myStats.pets ?? [];
    const filtered = rawPets.filter((p) => ALLOWEDPETS.includes(p.type));
    const highestByType: Record<string, typeof rawPets[number]> = {};
    for (const p of filtered) {
        const existing = highestByType[p.type];
        if (
            !existing ||
            tierPriority[p.tier as PetTier] > tierPriority[existing.tier as PetTier]
        ) {
            highestByType[p.type] = p;
        }
    }
    return Object.values(highestByType).map((p) => ({
        type: p.type,
        tier: p.tier as PetTier,
        level: getPetLevel(p.exp, p.tier as PetTier, p.type),
        exp: p.exp,
        active: p.active,
        heldItem: p.heldItem,
    }));
}

function getPetLevel(exp: number, tier: PetTier, type: string): number {
    const thresholds = PetLevelXP[tier];
    if (!thresholds?.length) return 1;
    const isDragon = type.includes("DRAGON");
    const maxLevel =
        tier === "LEGENDARY" || tier === "MYTHIC" ? (isDragon ? 200 : 100) : 100;
    let level = 1;
    if (isDragon && exp > 25353230) {
        level = 100;
        let cumulative = 25353230;
        for (const q of [0, 5555]) {
            cumulative += q;
            if (exp >= cumulative) level++;
            else return level;
        }
        while (level < maxLevel) {
            cumulative += 1886700;
            if (exp >= cumulative) level++;
            else break;
        }
        return Math.min(level, maxLevel);
    }
    for (let i = 1; i < thresholds.length; i++) {
        if (exp >= thresholds[i]) level = i + 1;
        else break;
    }
    return Math.min(level, maxLevel);
}

export function getNormalPet(
    pets: Pet[],
    gardenLevel: number,
    type: string,
): { fortune: number; overbloom: number } {
    const pet = pets.find((p) => p.type === type);
    const config = PetStats[type];
    if (!pet || !config?.baseFortune || !config?.fortunePerLevel)
        return { fortune: 0, overbloom: 0 };
    const fortune = config.baseFortune + (pet.level - 1) * config.fortunePerLevel;
    const greenBandanaBonus =
        pet.heldItem === "GREEN_BANDANA"
            ? presetData.greenBandana * gardenLevel
            : 0;
    return { fortune: fortune + greenBandanaBonus, overbloom: 0 };
}

export function getRoseDragon(
    milestones: number,
    farmingLevel: number,
    gardenLevel: number,
    pets: Pet[],
): { fortune: number; overbloom: number } {
    const config = PetStats.ROSE_DRAGON;
    const pet = pets.find((p) => p.type === "ROSE_DRAGON");
    if (!pet) return { fortune: 0, overbloom: 0 };
    const fortune =
        (config.baseFortune ?? 0) +
        (pet.level - 101) * (config.fortunePerLevel ?? 0);
    const overbloom =
        (config.baseOverbloom ?? 0) +
        (pet.level - 101) * (config.overbloomPerLevel ?? 0);
    const gardenPower =
        farmingLevel * ((config.farmingLevelFortunePerLevel ?? 0) * pet.level);
    const rosyScales =
        milestones * ((config.milestoneFortunePerLevel ?? 0) * pet.level);
    const greenBandanaBonus =
        pet.heldItem === "GREEN_BANDANA"
            ? presetData.greenBandana * gardenLevel
            : 0;
    const symbiosis =
        pet.level === 200
            ? (pets.length - 1) * (config.symbiosisFortunePerMaxedPet ?? 0)
            : 0;
    return {
        fortune: fortune + gardenPower + rosyScales + greenBandanaBonus + symbiosis,
        overbloom,
    };
}
