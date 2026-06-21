import {ArmorSetBonus, CarrolynExportedCropMap, presetData, HYPERCHARGE, TEMP} from "../data/itemData.ts";

import type {Item, Pet} from "../types";

import { permanentFortune, applyDedication } from "../stats/misc.ts";
import { getRoseDragon, getNormalPet} from "../stats/pets.ts";

type CropFortuneEntry = {
    finalFortune: number;
    totalCropFortune: number;
    actualCropFortune: number;
    baseFortune: number;
    sources: Record<string, number>;
};

type FortuneResult = {
    fortune: {
        total: number;
        sources: Record<string, number>;
    };
    temporary: {
        total: number;
        sources: Record<string, number>;
    };
    totalBaseFortune: number;
    cropFortune: Record<string, CropFortuneEntry>;
};

export function applyHypercharge(items: Item[], hyperchargeChip: number): Item[] {
    const multiplier = 1 + hyperchargeChip / 100;
    return items.map((item) => {
        const isHyperchargeable = HYPERCHARGE.some((k) =>
            item.id.toLowerCase().includes(k.toLowerCase()),
        );
        if (!isHyperchargeable) return item;
        return {
            ...item,
            fortune: item.fortune * multiplier,
            cropFortune: item.cropFortune
                ? item.cropFortune * multiplier
                : item.cropFortune,
        };
    });
}

function getTempFortune(hyperchargeChip: number): {
    total: number;
    sources: Record<string, number>;
} {
    const multiplier = 1 + hyperchargeChip / 100;
    const sources: Record<string, number> = {};
    for (const [key, value] of Object.entries(TEMP)) {
        const isHyperchargeable = HYPERCHARGE.some((k) => key === k);
        sources[key] = isHyperchargeable ? value * multiplier : value;
    }

    const total = Object.values(sources).reduce((sum, v) => sum + v, 0);
    return { total, sources };
}


export function getFortuneFromItems(items: Item[]) {
    const cropFortune: Record<string, number> = {};
    for (const item of items) {
        if (item.cropFortune && item.cropName) {
            cropFortune[item.cropName] =
                (cropFortune[item.cropName] ?? 0) + item.cropFortune;
        }
    }
    const sum = (type: string) =>
        items.filter((i) => i.type === type).reduce((t, i) => t + i.fortune, 0);
    return {
        fortuneByType: {
            armorAndEquipment: sum("armor") + sum("equipment"),
            accessory: sum("accessory"),
        },
        cropFortune,
    };
}

export async function getTotalFortune(
    farmingLevel: number,
    gardenLevel: number,
    chipStats: {
        fortune: number;
        cropFortune: number;
        overbloom: number;
        hypercharge: number;
    },
    items: Item[],
    shards: Record<string, number>,
    pets: Pet[],
    exportedCrops: Record<string, boolean>,
    cropMilestones: {
        milestones: Record<string, number>;
        totalMilestonesCountPerProfile: number;
    },
    cropUpgrades: Record<string, { level: number; fortune: number }>,
    personalBests: Record<string, number>,
): Promise<FortuneResult> {
    const levelFortune = farmingLevel * presetData.farmingLevel;
    const hyperchargedItems = applyHypercharge(items, chipStats.hypercharge);
    const res = getFortuneFromItems(hyperchargedItems);
    const armor = hyperchargedItems.filter((i) => i.type === "armor");
    const tools = hyperchargedItems.filter((i) => i.type === "tool");

    const totalFortuneConsumables = Object.values(permanentFortune).reduce(
        (t, v) => t + v,
        0,
    );
    const tempFortune = getTempFortune(chipStats.hypercharge);

    const armorSetCounts: Record<string, number> = {};
    for (const piece of armor) {
        const prefix = Object.keys(ArmorSetBonus).find((p) =>
            piece.id.startsWith(p),
        );
        if (prefix) armorSetCounts[prefix] = (armorSetCounts[prefix] ?? 0) + 1;
    }
    let armorSetFortune = 0;
    for (const [prefix, count] of Object.entries(armorSetCounts)) {
        const bonus = ArmorSetBonus[prefix];
        if (count >= bonus.minPieces)
            armorSetFortune += bonus.fortune * (count - 1);
    }

    for (const [exportKey, cropName] of Object.entries(CarrolynExportedCropMap)) {
        if (exportedCrops[exportKey]) {
            res.cropFortune[cropName] =
                (res.cropFortune[cropName] ?? 0)
        }
    }

    const petFortune = pets.some((p) => p.type === "ROSE_DRAGON")
        ? getRoseDragon(
            cropMilestones.totalMilestonesCountPerProfile,
            farmingLevel,
            gardenLevel,
            pets,
        )
        : getNormalPet(pets, gardenLevel, "MOOSHROOM_COW");

    let shardFortune = 0;
    if (shards.lunar_power === shards.solar_power)
        shardFortune = presetData.lunarPower * shards.lunar_power;
    shardFortune += presetData.ultimateDNA * shards.ultimate_dna;

    const tempAccessoryFortune = hyperchargedItems
        .filter(
            (i) =>
                i.type === "accessory" &&
                HYPERCHARGE.some((k) => i.id.toLowerCase().includes(k.toLowerCase())),
        )
        .reduce((t, i) => t + i.fortune, 0);

    const accesoryFortune = res.fortuneByType.accessory - tempAccessoryFortune;

    const baseFortune =
        levelFortune +
        res.fortuneByType.armorAndEquipment +
        armorSetFortune +
        accesoryFortune +
        chipStats.fortune +
        shardFortune +
        petFortune.fortune +
        totalFortuneConsumables;

    const cropFortune: Record<
        string,
        {
            finalFortune: number,
            totalCropFortune: number,
            actualCropFortune: number,
            baseFortune: number
            sources: Record<string, number>;
            extraCropFortune?: Record<string, number>;
        }
    > = {};

    await Promise.all(
        tools.map(async (tool) => {
            if (!tool.cropName) return;

            const toolCropFortune = res.cropFortune[tool.cropName] ?? 0;
            const cropUpgrade = cropUpgrades[tool.cropName]?.fortune ?? 0;
            const dedicationFortune = await applyDedication(
                tool.dedicationLevel ?? 0,
                cropMilestones.milestones[tool.cropName] ?? 0,
            );
            const carrolynFortune = exportedCrops[
            Object.keys(CarrolynExportedCropMap).find(
                (k) => CarrolynExportedCropMap[k] === tool.cropName,
            ) ?? ""
                ]
                ? presetData.carrolynFortune
                : 0;
            const personalBestFortune = personalBests[tool.cropName] ?? 0;


            const totalCropFortune = toolCropFortune + cropUpgrade + carrolynFortune + personalBestFortune + dedicationFortune;
            const totalContest = baseFortune + tool.fortune + totalCropFortune;

            const totalTempContest = totalContest + tempFortune.total;
            const actualCropFortune = totalTempContest + totalCropFortune

            cropFortune[tool.cropName] = {
                finalFortune: (totalContest + tempFortune.total),
                baseFortune: totalContest,
                actualCropFortune: actualCropFortune,
                totalCropFortune: totalCropFortune,
                sources: {
                    base: baseFortune,
                    baseTemp: tempFortune.total,
                    toolFortune: tool.fortune,
                    toolCropFortune: toolCropFortune,
                    cropUpgrade,
                    carrolyn: carrolynFortune,
                    chips: chipStats.cropFortune,
                    dedication: dedicationFortune,
                    personalBests: personalBestFortune,
                },
            };
        }),
    );

    return {
        fortune: {
            total: baseFortune,
            sources: {
                farmingLevel: levelFortune,
                armorAndEquipment:  res.fortuneByType.armorAndEquipment + armorSetFortune,
                accessories: accesoryFortune,
                chips: chipStats.fortune,
                shards: shardFortune,
                pet: petFortune.fortune,
                consumables: totalFortuneConsumables,
            },
        },
        temporary: tempFortune,
        totalBaseFortune: tempFortune.total + baseFortune,
        cropFortune,
    };
}

