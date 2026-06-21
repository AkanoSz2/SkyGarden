import {bestiaryBrackets, ShardThresholds} from "../data/progressionConstants.ts";
import {AllowedShards, bestiary, ChipEffects, getChipRarity, rarityIndex, ShardRarities} from "../data/itemData.ts";
import type {SkyblockMember, GardenStats} from "../types.ts";


function getChipStats(chips: Record<string, number>) {
    const totals = {
        fortune: 0,
        cropFortune: 0,
        overbloom: 0,
        hypercharge: 0,
        evergreen: 0,
    };
    for (const [id, level] of Object.entries(chips)) {
        const effect = ChipEffects[id];
        if (!effect || level <= 0) continue;
        const idx = rarityIndex[getChipRarity(level)];
        if (effect.fortune) totals.fortune += effect.fortune[idx] * level;
        if (effect.cropFortune)
            totals.cropFortune += effect.cropFortune[idx] * level;
        if (effect.overbloom) totals.overbloom += effect.overbloom[idx] * level;
        if (effect.hypercharge)
            totals.hypercharge += effect.hypercharge[idx] * level;
        if (effect.baseCrops) totals.evergreen += effect.baseCrops[idx] * level;
    }
    return totals;
}

export const permanentFortune: Record<string, number> = {
    community_center: 40,
    truffles: 5,
    flask: 5,
    DNA: 0,
    plots: 0,
    anita: 60,
    pests: 0,
};

export function getDNATalisman(myStats: SkyblockMember): number {
    const discovered =
        myStats.garden_player_data.analyzed_greenhouse_crops.length;
    const LEVELS = [0, 5, 10, 15, 20, 30, 40];
    return (
        LEVELS.reduce(
            (lvl, threshold, index) => (discovered >= threshold ? index : lvl),
            0,
        ) * 5
    );
}

export function getBestiaryLevel(
    kills: number,
    bracketNumber: number,
    maxKills: number,
): number {
    const brackets = bestiaryBrackets;
    let level = 0;

    const cappedKills = Math.min(kills, maxKills);

    for (let tier = 15; tier >= 1; tier--) {
        const row = brackets[tier];
        const threshold = row[bracketNumber];

        if (threshold !== undefined && cappedKills >= threshold) {
            level = tier;
            break;
        }

        level += 1;
    }
    return level;
}

export function getBestiaryKills(myStats: SkyblockMember): number {
    const kills = myStats.player_stats.kills;
    let total = 0;

    for (const mob of Object.keys(bestiary)) {
        const killsMob = kills[mob] ?? 0;
        const [bracketCol, maxKills] = bestiary[mob];

        total += getBestiaryLevel(killsMob, bracketCol - 1, maxKills);
    }
    return total * 0.4;
}


export function getPlots(myStats: GardenStats): number {
    return myStats.garden.unlocked_plots_ids.length * 3;
}


export async function populatePermanentFortune(myStats: SkyblockMember, gardenStats: GardenStats) {
    permanentFortune.DNA = getDNATalisman(myStats);
    permanentFortune.plots = getPlots(gardenStats);
    permanentFortune.pests = Math.round(getBestiaryKills(myStats) * 100) / 100;
}

function getShardLevel(
    shardsConsumed: number,
    rarity: "epic" | "legendary",
): number {
    const thresholds = ShardThresholds[rarity];
    let level = 0;
    for (let i = 1; i < thresholds.length; i++) {
        if (shardsConsumed >= thresholds[i]) level = i;
        else break;
    }
    return level;
}

export async function getShards(myStats: SkyblockMember) {
    const stacks = myStats.attributes.stacks;
    const shards: Record<string, number> = {};
    for (const id of AllowedShards) {
        shards[id] = getShardLevel(stacks[id], ShardRarities[id]);
    }
    return shards;
}


export function getGardenChips(myStats: SkyblockMember) {
    const chips: Record<string, number> = {};
    for (const [key, value] of Object.entries(myStats.player_data.garden_chips)) {
        chips[key] = value as number;
    }
    return getChipStats(chips);
}


export function getGrowthUpgrade(myStats: GardenStats) {
    return myStats.garden.garden_upgrades.GROWTH_SPEED;
}

export function getDeskYieldUpgrade(myStats: GardenStats) {
    return myStats.garden.garden_upgrades.YIELD;
}

export async function applyDedication(dedicationLevel: number, milestone: number) {
    const multipliers: Record<number, number> = { 1: 0.5, 2: 0.75, 3: 1, 4: 2 };
    return milestone * (multipliers[dedicationLevel] ?? 0);
}