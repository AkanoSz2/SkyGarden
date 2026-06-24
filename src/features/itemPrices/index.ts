import { initializeCropData, CropRarityMap } from "../../components/shared/CropData";
import { getBazaarItems } from "../itemPrices/services/bazaar.ts";
import type { BazaarProduct, BazaarItem } from "../itemPrices/types.ts";
import { CropBazaarIdMap } from "./data/extraItems.ts";

async function filterBazaarItems(items: Record<string, BazaarProduct>): Promise<Record<string, BazaarItem>> {
    const cropIds = Object.values(CropRarityMap).flat();
    const extraIds = Object.values(CropBazaarIdMap).flat();
    const allIds = [...cropIds, ...extraIds].map(id => id.toLowerCase());

    const filteredItems: Record<string, BazaarItem> = {};
    for (const [id, product] of Object.entries(items)) {
        if (allIds.includes(id.toLowerCase())) {
            filteredItems[id] = {
                productId: product.quick_status.productId,
                buyPrice: product.quick_status.buyPrice,
                sellPrice: product.quick_status.sellPrice,
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