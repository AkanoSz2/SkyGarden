import type { BazaarItems } from "../types.ts";
import { hypixelFetch } from "../../playerStats/services/hypixel.ts";

export async function getBazaarItems(): Promise<BazaarItems> {
    const data = await hypixelFetch<BazaarItems>(
        `https://api.hypixel.net/v2/skyblock/bazaar`,
        "Hypixel Bazaar API",
    );

    return data;
}