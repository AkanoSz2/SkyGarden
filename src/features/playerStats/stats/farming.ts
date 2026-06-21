import {GardenLevels, Levels} from "../data/progressionConstants.ts";
import type {SkyblockMember, GardenStats} from "../types.ts";

export async function getFarmingLevel(myStats: SkyblockMember) {
    const farmingXP = myStats.SKILL_FARMING;
    let level = 0;
    for (const [, xp] of Object.entries(Levels)) {
        if (farmingXP > Levels[60]) {
            level = 60;
            break;
        } else if (farmingXP >= (xp as number)) level++;
        else break;
    }
    return level;
}

export async function getGardenLevel(myStats: GardenStats) {
    const gardenXp : number = myStats.garden.garden_experience;
    if (gardenXp >= GardenLevels[GardenLevels.length - 1])
        return GardenLevels.length;
    let level = 0;
    for (let i = 0; i < GardenLevels.length; i++) {
        if (gardenXp >= GardenLevels[i]) level = i + 1;
        else break;
    }
    return level;
}
