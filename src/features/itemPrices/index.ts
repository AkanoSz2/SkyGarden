import { initializeCropData, CropRarityMap } from "../shared/scripts/CropData.ts";
import { getBazaarItems } from "./services/bazaar.ts";
import type { BazaarProduct, BazaarItem } from "./types.ts";
import {CropBazaarIdMap, ExtraItems} from "./data/extraItems.ts"

async function filterBazaarItems(items: Record<string, BazaarProduct>): Promise<Record<string, BazaarItem>> {
    const cropIds = Object.values(CropRarityMap).flat();
    const CropBazaarIds = Object.values(CropBazaarIdMap).flat();

    const allIds = [...cropIds, ...CropBazaarIds, ...ExtraItems].map(id => id.toLowerCase());

    const filteredItems: Record<string, BazaarItem> = {};
    for (const [id, product] of Object.entries(items)) {
        if (allIds.includes(id.toLowerCase())) {
            filteredItems[id] = {
                productId: product.quick_status.productId,
                buyPrice: product.quick_status.buyPrice,
                sellPrice: product.quick_status.sellPrice,
                buyOrder: product.quick_status.buyVolume,
                sellOrder: product.quick_status.sellVolume,
            };
        }
    }
    return filteredItems;
}

export async function getBazaarPrice(): Promise<Record<string, BazaarItem>> {
    await initializeCropData();
    const { products } = await getBazaarItems();
    return filterBazaarItems(products);
}