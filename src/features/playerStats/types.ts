import type {PetTier} from "./data/progressionConstants.ts";

export type Item = {
    id: string;
    name: string;
    fortune: number;
    cropFortune: number | null;
    cropName: string | null;
    overbloom: number;
    type: "vacuum" | "tool" | "accessory" | "armor" | "equipment" | "item";
    dedicationLevel?: number;
    extraCropFortune?: Record<string, number>;
};



// Shape of a single NBT-decoded item tag, as read from the inventory bytes.
export interface NBTItemTag {
    ExtraAttributes?: {
        value: {
            id?: { value: string };
            levelable_lvl?: { value: string };
            enchantments?: {
                value: Record<string, { value: number }>;
            };
            [key: string]: unknown;
        };
    };
    display?: {
        value: {
            Name?: { value: string };
            Lore?: { value: { value: string[] } };
        };
    };
    [key: string]: unknown;
}

export type Pet = {
    type: string;
    tier: PetTier;
    level: number;
    active: boolean;
    exp: number;
    heldItem: string | null;
};

export interface SkyblockProfile {
    profile_id: string;
    cute_name: string;
    members: Record<string, unknown>;
    [key: string]: unknown;
}

export interface SkyblockMember {
    inventory: {
        inv_armor: { data: string };
        equipment_contents: { data: string };
        inv_contents: { data: string };
        personal_vault_contents: { data: string };
        ender_chest_contents: { data: string };
        bag_contents: {
            talisman_bag: { data: string };
            [key: string]: { data: string };
        };
        backpack_contents: Record<string, { data: string } | undefined>;
        [key: string]: unknown;
    };
    SKILL_FARMING: number;
    leveling?: {
        completed_tasks?: string[];
        [key: string]: unknown;
    };
    personal_bests?: Record<string, number>;
    jacobs_contest?: { perks?: { personal_bests?: number } };
    garden_player_data: {
        analyzed_greenhouse_crops: string[];
    };
    player_stats: {
        kills: Record<string, number>;
    };
    player_data: {
        garden_chips: Record<string, number>;
    };
    attributes: {
        stacks: Record<string, number>;
    };
    pets_data?: {
        pets: Array<{
            type: string;
            tier: string;
            exp: number;
            active: boolean;
            heldItem: string | null;
        }>;
    };
    pets?: Array<{
        type: string;
        tier: string;
        exp: number;
        active: boolean;
        heldItem: string | null;
    }>;
    [key: string]: unknown;
}

export interface GardenStats {
    garden: {
        resources_collected: Record<string, number>;
        crop_upgrade_levels: Record<string, number>;
        garden_experience: number;
        unlocked_plots_ids: string[];
        garden_upgrades: {
            GROWTH_SPEED: number;
            YIELD: number;
        };
        commission_data: {
            unique_npcs_served: number;
        };
        [key: string]: unknown;
    };
    [key: string]: unknown;
}