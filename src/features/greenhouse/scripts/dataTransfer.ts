import type {GreenhouseTabData} from "../types.ts";

export function exportData(data: GreenhouseTabData[]) {
    const jsonData = JSON.stringify(data, null, 2);

    navigator.clipboard.writeText(jsonData);
}

export function importData(raw: string): GreenhouseTabData[] | null {
    try {
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return null;
        return parsed as GreenhouseTabData[];
    } catch {
        return null;
    }
}