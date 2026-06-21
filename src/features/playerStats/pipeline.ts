import { getMojangPlayer } from "./services/mojang";
import { getPlayerProfiles, getProfileGarden, type SkyblockProfile } from "./services/hypixel";
import type {Item, SkyblockMember, GardenStats} from "./types";

import {
    getCurrentArmor,
    getCurrentEquipment,
    getAccessories,
    getBackpack,
    getEnderChest,
    getInventory,
    getPersonalVault,

    filterItem,
} from "./utils/inventory.ts";

import { decodeNBT} from "./utils/decode.ts";

import { getDeskYieldUpgrade, getGrowthUpgrade } from "./stats/misc.ts";
import { getFarmingLevel, getGardenLevel} from "./stats/farming.ts";
import {getGardenChips, getShards, populatePermanentFortune, } from "./stats/misc.ts";
import { getPets } from "./stats/pets.ts";
import { getCarrolynExportedCrops, getMilestones, getCropUpgrades, getPersonalBests } from "./stats/crops.ts";

import { getTotalFortune, applyHypercharge } from "./fortune/calculate.ts";

import { HYPERCHARGE } from "./data/itemData.ts";


export async function getPlayerData(name: string) {
    const uuid = await getMojangPlayer(name);
    const profiles = await getPlayerProfiles(uuid);
    return { uuid, profiles };
}

export async function getProfileData(uuid: string, profiles : any, profileName: string) {
    const profile = profiles.find(p =>
        p.cute_name.toLowerCase() === profileName.toLowerCase()
    );

    if (!profile) throw new Error(`Profile "${profileName}" not found`);

    const gardenStats = await getProfileGarden(profile.profile_id);
    const myStats = profile.members[uuid] as SkyblockMember;

    return await JsonMyData(myStats, gardenStats as GardenStats, uuid, profile);
}

export async function JsonMyData(
    myStats: SkyblockMember,
    gardenStats: GardenStats,
    uuid: string,
    profile: SkyblockProfile,
) {
    const growthUpgrade = getGrowthUpgrade(gardenStats);
    const deskYieldUpgrade = getDeskYieldUpgrade(gardenStats);

    const singleItems = [
        await getCurrentArmor(myStats),
        await getCurrentEquipment(myStats),
        await getEnderChest(myStats),
        await getInventory(myStats),
        await getPersonalVault(myStats),
        await getAccessories(myStats),
    ];

    const filteredItems: Item[] = [];
    for (const item of singleItems) {
        const decoded = await decodeNBT(item);
        for (const slot of decoded.value.i.value.value) {
            if (!slot.tag) continue;
            const fi = await filterItem(slot.tag.value, gardenStats);
            if (fi) filteredItems.push(fi);
        }
    }

    const backpacks = await getBackpack(myStats);
    for (const backpack of backpacks) {
        const decoded = await decodeNBT(backpack);
        for (const slot of decoded.value.i.value.value) {
            if (!slot.tag) continue;
            const fi = await filterItem(slot.tag.value, gardenStats);
            if (fi) filteredItems.push(fi);
        }
    }


    // pick Zorros vs Blossom/Lotus cloak — keep whichever has higher stats
    const zorrosCape = filteredItems.find((i) => i.id === "ZORROS_CAPE");
    const blossomCloak = filteredItems.find((i) => i.id === "BLOSSOM_CLOAK");
    const lotusCloak = filteredItems.find((i) => i.id === "LOTUS_CLOAK");

    let finalItems = filteredItems;

    const cloaks = [zorrosCape, blossomCloak, lotusCloak].filter(
        (c): c is Item => Boolean(c),
    );

    if (cloaks.length > 1) {
        const bestCloak = cloaks.reduce((best, current) =>
            current.fortune > best.fortune ? current : best,
        );
        finalItems = filteredItems.filter(
            (i) =>
                !["ZORROS_CAPE", "BLOSSOM_CLOAK", "LOTUS_CLOAK"].includes(i.id) ||
                i.id === bestCloak.id,
        );
    }

    const farmingLevel = await getFarmingLevel(myStats);
    const gardenLevel = await getGardenLevel(gardenStats);
    const chipStats = getGardenChips(myStats);
    const shards = await getShards(myStats);
    const pets = await getPets(myStats);
    const exportedCrops = await getCarrolynExportedCrops(myStats);
    const cropMilestones = await getMilestones(gardenStats);
    const cropUpgrades = getCropUpgrades(gardenStats);
    const permanentFortune = await populatePermanentFortune(myStats, gardenStats);
    const personalBests = await getPersonalBests(myStats);

    const hyperchargedItems = applyHypercharge(finalItems, chipStats.hypercharge);

    const fortuneResults = await getTotalFortune(
        farmingLevel,
        gardenLevel,
        chipStats,
        finalItems,
        shards,
        pets,
        exportedCrops,
        cropMilestones,
        cropUpgrades,
        personalBests,
    );

    const groupedItems = {
        armor: {
            items: hyperchargedItems
                .filter((i) => i.type === "armor")
                .map((i) => ({ id: i.id, name: i.name, fortune: i.fortune, overbloom: i.overbloom })),
        },
        equipment: {
            items: hyperchargedItems
                .filter((i) => i.type === "equipment")
                .map((i) => ({ id: i.id, name: i.name, fortune: i.fortune })),
        },
        accessories: {
            items: hyperchargedItems
                .filter((i) => i.type === "accessory")
                .map((i) => ({
                    id: i.id,
                    name: i.name,
                    fortune: i.fortune,
                    cropFortune: i.cropFortune,
                    cropName: i.cropName,
                    overbloom: i.overbloom,
                    hypercharged: HYPERCHARGE.some((k) => i.id.toLowerCase().includes(k.toLowerCase())),
                })),
        },
        tools: {
            items: hyperchargedItems
                .filter((i) => i.type === "tool")
                .map((i) => ({
                    id: i.id,
                    name: i.name,
                    fortune: i.fortune,
                    cropFortune: i.cropFortune,
                    cropName: i.cropName,
                    dedicationLevel: i.dedicationLevel,
                })),
        },
        other: {
            items: hyperchargedItems
                .filter((i) => i.type === "item")
                .map((i) => ({ id: i.id, name: i.name, fortune: i.fortune })),
        },
    };

    const outputData = {
        player: { uuid, profile: profile.cute_name },
        fortune: {
            stats: { farmingLevel, gardenLevel, chipStats, shards, pets, items: groupedItems },
            garden: { exportedCrops, cropMilestones, cropUpgrades, permanentFortune },
            breakthrough: { ...fortuneResults },
        },
        greenhouse: { deskYieldUpgrade, growthUpgrade },
    };

    console.log(`Processed data for player ${uuid} on profile ${profile.cute_name}`);
    return outputData;
}