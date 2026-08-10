import {type GreenhouseTabData} from '../features/greenhouse';
import {getCropData} from "../features/greenhouse/scripts/placement.ts";
import {getCrop, getMutation} from "../features/shared";

type GreenhouseLayoutData = {
    id: string;
    count: number;
    rarity: string;
    drops: Record<string, number>;
    sowdust: number;
    requirements: Record<string, number>;

}

export function useGreenhouseLayoutData(greenhouseTabData: GreenhouseTabData[]){
    const totals: Record<string, GreenhouseLayoutData> = {};

    for(const entry in greenhouseTabData) {
        for (const placement of greenhouseTabData[entry].placements) {
            const cropName = placement.crop.split("#")[0];
            if (
                placement.type !== "output" && placement.type !== "forced"
                // placement.type !== "intermediate"
            ) continue;
            if (placement.valid === false) continue;

            if (!totals[cropName]) {
                totals[cropName] = {
                    id: cropName,
                    count: 0,
                    rarity: getCropData(cropName)?.rarity ?? getMutation(cropName)?.rarity ?? "common",
                    drops: {},
                    sowdust: 0,
                    requirements: {},
                };
            }


            const placementSize = getCropData(cropName)?.size ?? getMutation(cropName)?.size ?? {width: 1, height: 1};
            const count = placement.positions.length / (placementSize ** 2);
            const drops = getCrop(cropName)?.drops ?? getMutation(cropName)?.drops ?? {};
            const sowdust = getCropData(cropName)?.sowdust ?? getMutation(cropName)?.sowdust ?? 0;

            totals[cropName].count += count;
            totals[cropName].drops = {...totals[cropName].drops, ...drops};
            totals[cropName].sowdust = 0;
            totals[cropName].requirements = {
                ...totals[cropName].requirements, ...getCropData(cropName)?.requirements ?? getMutation(cropName)?.requirements ?? {}
            }
            totals[cropName].sowdust = sowdust;
        }
    }
    return totals;
}