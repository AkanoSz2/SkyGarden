
let cachedData: any = null;
let isInitialized = false;

export async function loadCropData(): Promise<any> {
    if (cachedData) return cachedData;

    // Node.js (server)
    if (typeof window === 'undefined') {
        const { readFileSync } = await import('fs');
        const { join } = await import('path');
        const filePath = join(process.cwd(), 'public', 'greenhouse', 'data.json');
        cachedData = JSON.parse(readFileSync(filePath, 'utf-8'));
        return cachedData;
    }

    // Browser (client)
    const response = await fetch('/greenhouse/data.json');
    if (!response.ok) throw new Error(`Failed to load crop data: ${response.statusText}`);
    cachedData = await response.json();
    return cachedData;
}

// Types
export type Crop = string;
export type Mutation = string;
export type Rarity =
    | "crops"
    | "common"
    | "uncommon"
    | "rare"
    | "epic"
    | "legendary";

export const CropRarityMap: Record<Rarity, string[]> = {
    crops: [],
    common: [],
    uncommon: [],
    rare: [],
    epic: [],
    legendary: [],
};

export const RarityColors: Record<Rarity, { border: string; text: string; bg: string }> = {
    crops:     { border: "#6c757d", text: "#ffffff", bg: "#343a40" },
    common:    { border: "#28a745", text: "#ffffff", bg: "#1e3a2f" },
    uncommon:  { border: "#17a2b8", text: "#ffffff", bg: "#1e3a40" },
    rare:      { border: "#0d6efd", text: "#ffffff", bg: "#1e2a4d" },
    epic:      { border: "#6f42c1", text: "#ffffff", bg: "#2a1e3d" },
    legendary: { border: "#ffc107", text: "#edd141", bg: "#3d2e1e" },
};

export function formatCropName(id: string): string {
    return id
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

export async function initializeCropData() {
    if (isInitialized) return cachedData;

    const data = await loadCropData();

    Object.keys(CropRarityMap).forEach(key => {
        CropRarityMap[key as Rarity] = [];
    });

    // mutations 
    for (const [key, mutation] of Object.entries(data.mutations)) {
        const rarity = (mutation as any).rarity as Exclude<Rarity, "crops">;
        CropRarityMap[rarity].push(key);
    }

    // crops
    for (const key of Object.keys(data.crops)) {
        CropRarityMap.crops.push(key);
    }

    isInitialized = true;
    return data;
}

export function getCrop(id: Crop) {
    if (!cachedData) throw new Error("Crop data not loaded yet. Call initializeCropData() first.");
    return cachedData.crops[id];
}

export function getMutation(id: Mutation) {
    if (!cachedData) throw new Error("Crop data not loaded yet. Call initializeCropData() first.");
    return cachedData.mutations[id];
}


export async function getEffects(){
    const response = await fetch('/greenhouse/data.json');
    console.log(response["effects"])
}
