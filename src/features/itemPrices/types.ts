export interface BazaarItems {
    success: boolean;
    lastUpdated: number;
    products: Record<string, BazaarProduct>;
}

export interface BazaarProduct {
    product_id: string;
    quick_status: {
        productId: string;
        buyPrice: number;
        buyVolume: number;
        sellPrice: number;
        sellVolume: number;
    };
}

export interface BazaarItem {
    productId: string;
    buyPrice: number;
    sellPrice: number;
}