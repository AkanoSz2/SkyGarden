import type { SkyblockMember, SkyblockProfile } from "../types";

export interface ProfilesResponse {
    success: boolean;
    profiles: SkyblockProfile[] | null;
}

export async function hypixelFetch<T>(url: string, errLabel: string): Promise<T> {
    const res = await fetch(url, {
        headers: { "API-Key": process.env.VITE_HYPIXEL_API_KEY ?? "" },
    });
    if (!res.ok) throw new Error(`${errLabel} error: ${res.status}`);
    return res.json() as Promise<T>;
}

function parseMember(raw: Record<string, unknown>): SkyblockMember {
    return {
        inventory: raw.inventory as SkyblockMember["inventory"],
        SKILL_FARMING: (raw.player_data as any)?.experience?.SKILL_FARMING ?? 0,
        leveling: raw.leveling as SkyblockMember["leveling"],
        jacobs_contest: raw.jacobs_contest as SkyblockMember["jacobs_contest"],
        personal_bests: (raw.jacobs_contest as any)?.personal_bests,
        garden_player_data: raw.garden_player_data as SkyblockMember["garden_player_data"],
        player_stats: raw.player_stats as SkyblockMember["player_stats"],
        player_data: raw.player_data as SkyblockMember["player_data"],
        attributes: raw.attributes as SkyblockMember["attributes"],
        pets_data: raw.pets_data as SkyblockMember["pets_data"],
        pets: raw.pets as SkyblockMember["pets"],
    };
}

export async function getPlayerProfiles(uuid: string): Promise<SkyblockProfile[]> {
    const { profiles } = await hypixelFetch<ProfilesResponse>(
        `https://api.hypixel.net/v2/skyblock/profiles?uuid=${uuid}`,
        "Hypixel API",
    );
    const raw = profiles ?? [];
    console.log(raw);
    return raw.map(p => ({
        ...p,
        members: Object.fromEntries(
            Object.entries(p.members).map(([id, member]) => [
                id,
                parseMember(member as Record<string, unknown>),
            ])
        ),
    }));
}

export async function getProfileGarden(profileId: string) {
    const cleanId = profileId.replace(/-/g, '');
    return hypixelFetch(
        `https://api.hypixel.net/v2/skyblock/garden?profile=${cleanId}`,
        "Garden API",
    );
}