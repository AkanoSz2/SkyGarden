import {CropMilestonesRawData, PersonalBestThresholds} from "../data/progressionConstants.ts";
import {CropIDMap} from "../data/itemData.ts";

import type {SkyblockMember, GardenStats} from "../types.ts";


const CarrolynExported: Record<string, boolean> = {
    EXPORTABLE_CARROTS: false,
    EXPIRED_PUMPKIN: false,
    FINE_FLOUR: false,
    SUPREME_CHOCOLATE_BAR: false,
    HALF_EATEN_MUSHROOM: false,
    WARTY: false,
    PRICKLY_KISS: false,
    POTTED_CACTUS: false,
};

export async function getCarrolynExportedCrops(myStats: SkyblockMember) {
    const exportedEntry: string[] = myStats.leveling?.completed_tasks ?? [];
    for (const crop of Object.keys(CarrolynExported)) {
        CarrolynExported[crop] =
            exportedEntry.includes(`CARROLYN_EXPORT_CROP_${crop.toUpperCase()}`);
    }
    return CarrolynExported;
}
export async function getMilestones(myStats: GardenStats) {
    const collected = myStats.garden.resources_collected;
    const milestones: Record<string, number> = {};
    let totalMilestonesCountPerProfile = 0;

    for (const [cropID, cropInfo] of Object.entries(CropIDMap)) {
        const totalCollected = collected[cropID] ?? 0;
        const threshold = CropMilestonesRawData[cropInfo.name];
        let milestoneCount = 0;
        const maxMilestone = 46;
        let totalRequired = 0;

        for (const [, required] of Object.entries(threshold)) {
            totalRequired += required as number;
            if (totalCollected >= totalRequired) milestoneCount++;
            else break;
        }

        const overflow = Object.entries(threshold).at(-1);
        const overflowAmount = overflow ? Number(overflow[1]) : 0;

        while (milestoneCount < maxMilestone) {
            if (totalCollected >= totalRequired + overflowAmount) {
                milestoneCount++;
                totalRequired += overflowAmount;
            } else break;
        }

        milestones[cropInfo.name] = milestoneCount;
        totalMilestonesCountPerProfile += milestoneCount;
    }

    return { milestones, totalMilestonesCountPerProfile };
}

export function getCropUpgrades(
    gardenStats: GardenStats,
): Record<string, { level: number; fortune: number }> {
    const raw = gardenStats.garden.crop_upgrade_levels;
    const crops: Record<string, { level: number; fortune: number }> = {};
    for (const [id, level] of Object.entries(raw)) {
        const crop = CropIDMap[id];
        if (!crop) continue;
        crops[crop.name] = {
            level: level as number,
            fortune: (level as number) * crop.fortunePerLevel,
        };
    }
    return crops;
}

export function getPersonalBests(myStats: SkyblockMember): Record<string, number> {
    const unlocked = myStats.jacobs_contest?.perks?.personal_bests ?? 0;
    const personalBests: Record<string, number> = myStats.personal_bests ?? {};
    const result: Record<string, number> = {};
    const resultRaw: Record<string, number> = {};

    if (!unlocked) return result;

    for (const [cropID, [min, max]] of Object.entries(PersonalBestThresholds)) {
        const best = personalBests[cropID] ?? 0;
        if (best < min) continue;
        const cropName = CropIDMap[cropID]?.name;
        if (!cropName) continue;
        result[cropName] =
            Math.round(Math.min((best / max) * 100, 100) * 100) / 100;
        resultRaw[cropName] = Number((best / 1000 / 1000).toFixed(2));    }

    return [result, resultRaw];
}