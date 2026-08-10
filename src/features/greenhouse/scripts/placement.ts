import {GRID} from "../data/constants.ts";
import {getCrop, getMutation} from "../../shared";
import type {GreenhouseLayoutProps, GreenhouseTabData, PlacementEntry} from "../types.ts";
import { legendItems } from "../data/constants.ts";

let globalInstanceCounter = 0;


export function getPositions(startIndex: number, size: number): number[] {
    const row = Math.min(Math.floor(startIndex / GRID), GRID - size);
    const col = Math.min(startIndex % GRID, GRID - size);
    const positions: number[] = [];
    for (let r = 0; r < size; r++)
        for (let c = 0; c < size; c++)
            positions.push((row + r) * GRID + (col + c));
    return positions;
}

export function emptyGrid(): string[] {
    return Array.from({length: 100}, () => "empty");
}

export function syncInstanceCounter(data: GreenhouseTabData[]) {
    let maxSeen = -1;
    for (const tab of data) {
        for (const placement of tab.placements) {
            const suffix = placement.instanceId.split("#").pop();
            const n = parseInt(suffix ?? "", 10);
            if (!isNaN(n) && n > maxSeen) maxSeen = n;
        }
    }
    if (maxSeen >= globalInstanceCounter) globalInstanceCounter = maxSeen + 1;
}

export const getBaseId = (id: string) => id.split("#")[0];
export const getCropData = (id: string) => getCrop(getBaseId(id)) || getMutation(getBaseId(id));
export const getCropSize = (id: string) => getCropData(id)?.size ?? 1;


// I HATE MATRIXES
export function getSurroundingIngredients(
    posX: number,
    posY: number,
    size: number,
    gridState: string[],
    getBaseId: (id: string) => string
): { record: Record<string, number>; debugRows: { row: number; col: number; cellIndex: number; cellId: string }[] } {
    const currentIngredientsRecord: Record<string, number> = {};
    const debugRows: { row: number; col: number; cellIndex: number; cellId: string }[] = [];

    for (let col = posY - 1; col <= posY + size; col++) {
        for (let row = posX - 1; row <= posX + size; row++) {
            if (row < 0 || row >= GRID || col < 0 || col >= GRID) continue;
            if (row >= posX && row <= posX + size - 1 && col >= posY && col <= posY + size - 1) continue;

            const cellIndex = row * GRID + col;
            const cellId = gridState[cellIndex];
            debugRows.push({row, col, cellIndex, cellId});

            if (cellId === "empty") continue;
            const baseId = getBaseId(cellId);
            currentIngredientsRecord[baseId] = (currentIngredientsRecord[baseId] ?? 0) + 1;
        }
    }

    return {record: currentIngredientsRecord, debugRows};
}

// I HATE MATRIXES EVEN MORE
export function validateGrid(placements: PlacementEntry[], gridState: string[]): Map<string, boolean> {
    const validityById = new Map<string, boolean>();

    for (const placement of placements) {
        let isValid = true;

        try {
            const cropEntry = getCropData(placement.crop) || getMutation(placement.crop);
            const size = cropEntry?.size ?? 1;

            const rows = placement.positions.map(p => Math.floor(p / GRID));
            const cols = placement.positions.map(p => p % GRID);
            const posX = Math.min(...rows);
            const posY = Math.min(...cols);

            if (placement.type == "output") {
                isValid = false;
                const rawRequirements = cropEntry?.requirements ?? [];
                const requirementRecord: Record<string, number> = {};
                for (const entry of rawRequirements) {
                    const [reqCrop, reqCount] = [entry.crop, entry.count];
                    requirementRecord[reqCrop] = (requirementRecord[reqCrop] ?? 0) + (reqCount ?? 0);
                }

                const {record: currentIngredientsRecord, debugRows} =
                    getSurroundingIngredients(posX, posY, size, gridState, getBaseId);

                // console.table(debugRows);
                // console.table({required: requirementRecord, found: currentIngredientsRecord});

                isValid = Object.entries(requirementRecord).every(
                    ([crop, count]) => (currentIngredientsRecord[crop] ?? 0) >= count
                );
            }
        } catch (err) {
            console.error("validateGrid failed for placement", placement, err);
            isValid = true;
        }

        validityById.set(placement.instanceId, isValid);
    }

    return validityById;
}

export function placeCrop(
    startIndex: number,
    selectedCrop: string | undefined,
    selectedType: string | undefined,
    activeTab: number,
    setGreenhouseTabData: React.Dispatch<React.SetStateAction<GreenhouseTabData[]>>,
    placedByUser: boolean = true,
    forcePlace: boolean = false
) {

    if (!selectedCrop) return;

    const size = getCropSize(selectedCrop);
    const positions = getPositions(startIndex, size);
    const instanceId = `${selectedCrop}#${globalInstanceCounter++}`;

    const cropData = getCrop(selectedCrop);
    const hasDrops = !!cropData?.drops && Object.keys(cropData.drops).length > 0;
    const entryType = selectedType;

    setGreenhouseTabData(prev => {
        const tab = prev.find(t => t.id === activeTab);
        const currentCells = tab?.cells ?? emptyGrid();
        const currentPlacements = tab?.placements ?? [];

        const overwritten = new Set(
            positions.map(p => currentCells[p]).filter(v => v !== "empty")
        );
        const nextCells = [...currentCells];
        for (let i = 0; i < nextCells.length; i++) {
            if (overwritten.has(nextCells[i])) nextCells[i] = "empty";
        }
        for (const p of positions) nextCells[p] = instanceId;

        const newEntry: PlacementEntry = {
            instanceId,
            crop: selectedCrop,
            positions,
            type: entryType,
            valid: true,
            placedByUser: placedByUser,
            forcePlaced: forcePlace
        };



        const nextPlacements = [
            ...currentPlacements
                .filter(e => !overwritten.has(e.instanceId))
                .map(e => ({...e})),
            newEntry,
        ];

        const validityById = validateGrid(nextPlacements, nextCells);
        const finalPlacements = nextPlacements.map(p => ({
            ...p,
            valid: forcePlace && p.instanceId === instanceId
                ? true
                : validityById.get(p.instanceId) ?? true,
            type: forcePlace && p.instanceId === instanceId? "forced" : p.type,
        }));

        // console.table(finalPlacements)
        return prev.map(t =>
            t.id === activeTab ? {...t, cells: nextCells, placements: finalPlacements} : t
        );
    });
}

export function removeCrop(
    index: number,
    gridCells: string[],
    placementTypeById: Map<string, string | undefined>,
    selectedType: GreenhouseLayoutProps["selectedType"],
    activeTab: GreenhouseLayoutProps["activeTab"],
    setGreenhouseTabData: GreenhouseLayoutProps["setGreenhouseTabData"],
    forcePlace: boolean = false
) {

    const instanceId = gridCells[index];

    if (!instanceId || instanceId === "empty") return;
    let placementType = placementTypeById.get(instanceId);

    if(!forcePlace) {
        if (placementType == "intermediate" || placementType == "forced") placementType = "output";
        if (getCrop(instanceId.split("#")[0]) && selectedType !== "helper") placementType = "input";
        if (selectedType && placementType !== selectedType) return;
    }


    setGreenhouseTabData(prev => {
        const tab = prev.find(t => t.id === activeTab);
        const currentCells = tab?.cells ?? emptyGrid();
        const nextCells = currentCells.map(v => v === instanceId ? "empty" : v);

        const remainingPlacements = (tab?.placements ?? [])
            .filter(e => e.instanceId !== instanceId)
            .map(e => ({...e}));

        const validityById = validateGrid(remainingPlacements, nextCells);
        const finalPlacements = remainingPlacements.map(p => ({
            ...p,
            valid: validityById.get(p.instanceId) ?? true,
        }));

        return prev.map(t =>
            t.id === activeTab ? {...t, cells: nextCells, placements: finalPlacements} : t
        );
    });
}

export function getTypeColor(typeForColor: string | undefined, validForColor: boolean | undefined): string {
    let border;
    switch (typeForColor) {
        case "input":
            border = legendItems.input.color;
            break;
        case "forced":
            border = legendItems.forced.color;
            break;
        case "output":
            border = validForColor ? legendItems.output.color : legendItems.invalid.color;
            break;
        case "helper":
            border = legendItems.helper.color;
            break;
        case "intermediate":
            border = legendItems.intermediate.color;
            break;
        default:
            border = "#000"
            break;
    }
    return border;
}