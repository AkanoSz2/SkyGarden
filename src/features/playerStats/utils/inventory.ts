import {
    AllowedAccessories,
    AllowedArmorPrefixes,
    AllowedArmorSuffixes,
    AllowedEquipmentPrefixes,
    AllowedItemPrefixes,
    AllowedToolsPrefixes,
    EnchantsFortune,
    EnchantsOverbloom,
    ToolIDCropMap,
    TurboEnchantMap
} from "../data/itemData.ts";
import type {GardenStats, Item, NBTItemTag, SkyblockMember} from "../types.ts";


function getGreenthumbFortune(
    myStats: GardenStats,
    greenThumbLevel: number,
    equipmentPieces: number,
): number {
    const uniqueVisitors = myStats.garden.commission_data.unique_npcs_served;
    return uniqueVisitors * equipmentPieces * greenThumbLevel;
}

export async function getCurrentArmor(myStats: SkyblockMember) {
    return myStats.inventory.inv_armor.data;
}
export async function getCurrentEquipment(myStats: SkyblockMember) {
    return myStats.inventory.equipment_contents.data;
}
export async function getInventory(myStats: SkyblockMember) {
    return myStats.inventory.inv_contents.data;
}
export async function getPersonalVault(myStats: SkyblockMember) {
    return myStats.inventory.personal_vault_contents.data;
}
export async function getEnderChest(myStats: SkyblockMember) {
    return myStats.inventory.ender_chest_contents.data;
}
export async function getAccessories(myStats: SkyblockMember) {
    return myStats.inventory.bag_contents.talisman_bag.data;
}

export async function getBackpack(myStats: SkyblockMember) {
    const backpacks: string[] = [];
    const contents = myStats.inventory.backpack_contents;
    for (const key of Object.keys(contents)) {
        const data = contents[key]?.data;
        if (data) backpacks.push(data);
    }
    return backpacks;
}



function getItemStats(item: NBTItemTag, myStats: GardenStats) {
    const stripCodes = (s: string) => s.replace(/§[0-9a-fk-or]/g, "");

    let fortune;
    let cropFortune = 0;
    let overbloom = 0;
    const extraCropFortune: Record<string, number> = {};

    const itemID = item.ExtraAttributes?.value?.id?.value;
    const lore: string[] = item.display?.value?.Lore?.value?.value ?? [];
    const enchants = item.ExtraAttributes?.value?.enchantments?.value ?? {};
    const itemLevel = parseInt(item.ExtraAttributes?.value?.levelable_lvl?.value ?? "0");

    const cropName = Object.entries(ToolIDCropMap).find(([k]) => itemID?.startsWith(k))?.[1] ?? null;

    const fortuneLine = lore.map(stripCodes).find(l => l.startsWith("Farming Fortune:"));
    fortune = fortuneLine ? parseFloat(fortuneLine.match(/\+(\d+\.?\d*)/)?.[1] ?? "0") : 0;

    cropFortune += itemLevel * 4;

    for (const [ench, level] of Object.entries(enchants)) {
        const ench_level = level.value ?? 0;

        if (ench.startsWith("turbo_")) {
            const value = EnchantsFortune.turbo[ench_level - 1]
            const enchCrop = TurboEnchantMap[ench];
            if (enchCrop === cropName) {
                cropFortune += value;
            }
            else{
                extraCropFortune[enchCrop] = value;
            }
        }

        if (ench === "feast" || ench === "ultimate_sunset") {
            overbloom += EnchantsOverbloom[ench]?.[ench_level - 1] ?? 0;
            continue;
        }

        if (ench === "green_thumb") {
            const greenThumbLevel = EnchantsFortune[ench]?.[ench_level - 1];
            fortune +=  getGreenthumbFortune(myStats, greenThumbLevel, 1)
        }

    }

    return { fortune, overbloom, cropFortune, cropName, extraCropFortune };
}

export async function filterItem(item: NBTItemTag, myStats: GardenStats): Promise<Item | undefined> {
    const itemID = item.ExtraAttributes?.value?.id?.value;
    if (!itemID) {
        // console.warn("Item missing ID:", item);
        return;
    }

    const isTalisman = AllowedAccessories.some((p) => itemID.startsWith(p));
    const isArmor =
        !isTalisman &&
        AllowedArmorPrefixes.some((p) => itemID.startsWith(p)) &&
        AllowedArmorSuffixes.some((s) => itemID.endsWith(s));
    const isEquipment =
        !isTalisman && AllowedEquipmentPrefixes.some((p) => itemID.startsWith(p));
    const isTool = AllowedToolsPrefixes.some((p) => itemID.startsWith(p));
    const isAllowedItem = AllowedItemPrefixes.some((p) => itemID.startsWith(p));

    if (!(isArmor || isEquipment || isTool || isAllowedItem || isTalisman))
        return;


    // console.log("Checking item:", itemID, {
    //     isTalisman: AllowedAccessories.some((p) => itemID?.startsWith(p)),
    //     isArmor: AllowedArmorPrefixes.some((p) => itemID?.startsWith(p)) && AllowedArmorSuffixes.some((s) => itemID?.endsWith(s)),
    //     isEquipment: AllowedEquipmentPrefixes.some((p) => itemID?.startsWith(p)),
    //     isTool: AllowedToolsPrefixes.some((p) => itemID?.startsWith(p)),
    // });


    const stats = await getItemStats(item, myStats);
    const name = item.display!.value!.Name!.value;

    if (isTalisman)
        return {
            type: "accessory",
            id: itemID,
            name,
            fortune: stats.fortune,
            cropFortune: stats.cropFortune,
            cropName: stats.cropName,
            overbloom: stats.overbloom,
        };
    if (isArmor) {
        return {
            type: "armor",
            id: itemID,
            name,
            fortune: stats.fortune,
            cropFortune: null,
            cropName: null,
            overbloom: stats.overbloom,
        };
    }
    if (isEquipment)
        return {
            type: "equipment",
            id: itemID,
            name,
            fortune: itemID === "ZORROS_CAPE" ? stats.fortune * 2 : stats.fortune,
            cropFortune: null,
            cropName: null,
            overbloom: 0,
        };
    if (isTool) {
        return {
            type: "tool",
            id: itemID,
            name,
            fortune: stats.fortune,
            cropFortune: stats.cropFortune,
            cropName: stats.cropName,
            dedicationLevel:
                item.ExtraAttributes?.value?.enchantments?.value?.dedication?.value ??
                0,
            overbloom: stats.overbloom,
            extraCropFortune: stats.extraCropFortune,
        };
    }
    if (isAllowedItem)
        return {
            type: "item",
            id: itemID,
            name,
            fortune: stats.fortune,
            cropFortune: null,
            cropName: null,
            overbloom: 0,
        };
}