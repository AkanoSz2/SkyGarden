export type TableGreenhouseRow = {
    id: string;
    count: number;
    rarity: string;
    drops: Record<string, number>;
};