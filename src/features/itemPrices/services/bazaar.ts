import type { BazaarItems } from "../types.ts";

export async function getBazaarItems(): Promise<BazaarItems> {
    const res = await fetch("https://api.hypixel.net/skyblock/bazaar");

    if (!res.ok) {
        throw new Error(`Hypixel Bazaar API error: ${res.status}`);
    }

    return await res.json() as Promise<BazaarItems>;
}