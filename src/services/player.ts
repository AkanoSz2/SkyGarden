const funniKey = import.meta.env.HYPIXEL_API_KEY;

export async function getPlayerProfiles(uuid: string) {
    const res = await fetch(
        `https://api.hypixel.net/v2/skyblock/profiles?uuid=${uuid}`,
        {
            headers: { "API-Key": funniKey },
        },
    );
    if (!res.ok) throw new Error(`Hypixel API error: ${res.status}`);
    const { profiles } = await res.json();
    return profiles;
}

export async function getSkyblockProfile(uuid: string) {
    const res = await fetch(
        `https://api.hypixel.net/v2/skyblock/profiles?uuid=${uuid}`,
        {
            headers: { "API-Key": funniKey },
        },
    );
    if (!res.ok) throw new Error(`Hypixel API error: ${res.status}`);
    const { profiles } = await res.json();
    return profiles;
}

export async function getProfileGarden(profileId: string) {
    const res = await fetch(
        `https://api.hypixel.net/v2/skyblock/garden?profile=${profileId}`,
        {
            headers: { "API-Key": funniKey },
        },
    );
    if (!res.ok) throw new Error(`Garden API error: ${res.status}`);
    return res.json();
}