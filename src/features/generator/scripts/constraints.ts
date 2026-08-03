import {getCrop, getMutation} from "../../shared";

import type {
    GeneratorItem,
    GeneratorItemExpanded,
    IngredientComparison,
    MutationCandidate,
    RequirementEntry,
    Side,
    SideCell
} from "../types"

import {GRID} from "../../greenhouse";


export function getSideCells(
    posX: number,
    posY: number,
    size: number,
    gridState: string[]
): Record<Side, SideCell[]> {
    const sides: Record<Side, SideCell[]> = {
        top: [],
        bottom: [],
        left: [],
        right: [],
    };

    const pushIfInBounds = (side: Side, row: number, col: number) => {
        if (row < 0 || row >= GRID || col < 0 || col >= GRID) return;
        const cellIndex = row * GRID + col;
        const cellId = gridState[cellIndex];
        if (!cellId) return;
        sides[side].push({ row, col, cellIndex, cellId, itsValid: false });
    };

    for (let i = 0; i < size; i++) {
        pushIfInBounds("top", posX - 1, posY + i);
        pushIfInBounds("bottom", posX + size, posY + i);
        pushIfInBounds("left", posX + i, posY - 1);
        pushIfInBounds("right", posX + i, posY + size);
    }

    return sides;
}

function placeItemWithBigSize(itemEntry: { crop: string; size: number }, posX: number, posY: number, currentTable: string[]): string[] {
    const newTable = [...currentTable];
    for (let r = 0; r < itemEntry.size; r++) {
        for (let c = 0; c < itemEntry.size; c++) {
            newTable[(posX + r) * GRID + (posY + c)] = itemEntry.crop;
        }
    }
    return newTable;
}

function findAllIngredientPositions(
    ingredient: RequirementEntry,
    table: string[]
): { posX: number; posY: number }[] {
    const positions: { posX: number; posY: number }[] = [];
    table.forEach((cell, index) => {
        if (cell.split("#")[0] === ingredient.crop) {
            positions.push({ posX: Math.floor(index / GRID), posY: index % GRID });
        }
        // console.log(`Checking cell at index ${index}: ${cell}, looking for ${ingredient.crop}`);
    });
    return positions;
}

function findAllTargetsPositions(
    target: string,
    table: string[],
    size: number
) : { posX: number; posY: number }[] {
    const positions: { posX: number; posY: number }[] = [];
    table.forEach((cell, index) => {
        if (cell.split("#")[0] === target) {
            for(let r = 0; r < size; r++) {
                for(let c = 0; c < size; c++) {
                    const checkIndex = (Math.floor(index / GRID) + r) * GRID + (index % GRID + c);
                    if(checkIndex >= table.length || table[checkIndex].split("#")[0] !== target) {
                        return;
                    }
                }
            }
            const posX = Math.floor(index / GRID);
            const posY = index % GRID;
            positions.push({ posX, posY });
            index += size - 1;
        }
    });

    return positions;
}


function blockFits(row: number, col: number, size: number, grid: string[]): boolean {
    if (row < 0 || col < 0 || row + size > GRID || col + size > GRID) return false;
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            if (grid[(row + r) * GRID + (col + c)] !== "empty") return false;
        }
    }
    return true;
}

function findAllFreeRegions(size: number, grid: string[]): { row: number; col: number }[] {
    const regions: { row: number; col: number }[] = [];
    for (let row = 0; row + size <= GRID; row++) {
        for (let col = 0; col + size <= GRID; col++) {
            if (blockFits(row, col, size, grid)) {
                regions.push({ row, col });
            }
        }
    }
    return regions;
}


function findFittingCorner(
    row: number,
    col: number,
    cropSize: number,
    grid: string[]
): { row: number; col: number } | null {
    const d = cropSize - 1;
    const candidates = [
        { row, col },                 // ring cell = top-left     -> grows down-right
        { row, col: col - d },        // ring cell = top-right    -> grows down-left
        { row: row - d, col },        // ring cell = bottom-left  -> grows up-right
        { row: row - d, col: col - d }, // ring cell = bottom-right -> grows up-left
    ];

    for (const cand of candidates) {
        if (blockFits(cand.row, cand.col, cropSize, grid)) {
            return cand;
        }
    }
    return null;
}

function placeIngredients(
    posX: number,
    posY: number,
    size: number,
    gridState: string[],
    requirements: RequirementEntry[],
    itemEntry: GeneratorItemExpanded
): {
    isValid: boolean;
    grid: string[];
    debugRows: { row: number; col: number; cellIndex: number; cellId: string }[];
    comparisonTable: Record<string, IngredientComparison>
    ingredientPlacement: PlacedItem[];
} {

    const comparisonTable: Record<string, IngredientComparison> = {};
    const ingredientPlacement: PlacedItem[] = [];

    const minRow = posX - 1;
    const maxRow = posX + size;
    const minCol = posY - 1;
    const maxCol = posY + size;

    const debugRows: { row: number; col: number; cellIndex: number; cellId: string }[] = [];
    const currentIngredientsRecord: Record<string, number> = {};
    const requirementRecord: Record<string, number> = {};

    for (const entry of requirements) {
        requirementRecord[entry.crop] = (requirementRecord[entry.crop] ?? 0) + (entry.amount ?? 0);
    }

    let isValid = true;

    // already exisitng ingredients
    for (let row = minRow; row <= maxRow; row++) {
        for (let col = minCol; col <= maxCol; col++) {
            const isRingRow = row === minRow || row === maxRow;
            const isRingCol = col === minCol || col === maxCol;
            if (!isRingRow && !isRingCol) continue;

            if (row < 0 || row >= GRID || col < 0 || col >= GRID) continue;

            const cellIndex = row * GRID + col;
            const cellId = gridState[cellIndex];
            debugRows.push({ row, col, cellIndex, cellId });

            if (cellId === "empty") continue;

            const baseId = cellId.split("#")[0];

            if (baseId in requirementRecord) {
                currentIngredientsRecord[baseId] = (currentIngredientsRecord[baseId] ?? 0) + 1;

                const existingSize = requirements.find(r => r.crop === baseId)?.size ?? 1;

                ingredientPlacement.push({
                    crop: baseId,
                    row,
                    col,
                    size: existingSize,
                    placedByUser: false,
                    type: "input"
                });
            } else if (baseId !== itemEntry.crop) {
                isValid = false;
            }
        }
    }

    const grid = [...gridState];

    const sortedCrops = Object.keys(requirementRecord).sort((a, b) => {
        const sizeA = requirements.find(r => r.crop === a)?.size ?? 1;
        const sizeB = requirements.find(r => r.crop === b)?.size ?? 1;
        return sizeB - sizeA;
    });

    for (let row = minRow; row <= maxRow; row++) {
        for (let col = minCol; col <= maxCol; col++) {
            const isRingRow = row === minRow || row === maxRow;
            const isRingCol = col === minCol || col === maxCol;
            if (!isRingRow && !isRingCol) continue;

            if (row < 0 || row >= GRID || col < 0 || col >= GRID) continue;

            const cellIndex = row * GRID + col;
            const cellId = grid[cellIndex];
            debugRows.push({ row, col, cellIndex, cellId });

            if (cellId !== "empty") continue;

            for (const crop of sortedCrops) {
                const required = requirementRecord[crop] ?? 0;
                const current = currentIngredientsRecord[crop] ?? 0;
                if (required <= 0 || current >= required) continue;

                const cropSize = requirements.find(req => req.crop === crop)?.size ?? 1;

                if (cropSize > 1) {
                    const anchor = findFittingCorner(row, col, cropSize, grid);
                    if (!anchor) continue;

                    const placedBlock = placeItemWithBigSize(
                        { size: cropSize, crop },
                        anchor.row,
                        anchor.col,
                        grid
                    );
                    const temporaryIngredientRecord: Record<string, number> = {};
                    for (let row1 = minRow; row1 <= maxRow; row1++) {
                        for (let col1 = minCol; col1 <= maxCol; col1++) {
                            const isRingRow1 = row1 === minRow || row1 === maxRow;
                            const isRingCol1 = col1 === minCol || col1 === maxCol;
                            if (!isRingRow1 && !isRingCol1) continue;
                            if (row1 < 0 || row1 >= GRID || col1 < 0 || col1 >= GRID) continue;

                            const idx = row1 * GRID + col1;
                            const baseId = placedBlock[idx]?.split("#")[0];
                            if (baseId in requirementRecord) {
                                temporaryIngredientRecord[baseId] = (temporaryIngredientRecord[baseId] ?? 0) + 1;

                            }
                        }
                    }

                    ingredientPlacement.push({ crop, row: anchor.row, col: anchor.col, size: cropSize, placedByUser: false, type: "input" });

                    const mergedCount = Math.max(
                        currentIngredientsRecord[crop] ?? 0,
                        temporaryIngredientRecord[crop] ?? 0
                    );

                    placedBlock.forEach((val, idx) => { grid[idx] = val; });
                    currentIngredientsRecord[crop] = mergedCount;

                    comparisonTable[crop] = {
                        current: mergedCount,
                        required,
                        satisfied: mergedCount >= required,
                    };

                    break;
                }

                grid[cellIndex] = crop;
                currentIngredientsRecord[crop] = current + 1;
                ingredientPlacement.push({ crop, row, col, size: 1, placedByUser: false, type: "input" });
                comparisonTable[crop] = {
                    current: current + 1,
                    required,
                    satisfied: (current + 1) >= required,
                };
                break;
            }
        }
    }

    const allCrops = new Set([...Object.keys(requirementRecord), ...Object.keys(currentIngredientsRecord)]);

    for (const crop of allCrops) {
        const required = requirementRecord[crop] ?? 0;
        const current = currentIngredientsRecord[crop] ?? 0;
        comparisonTable[crop] = {
            current,
            required,
            satisfied: current >= required,
        };
        if (required > 0 && current < required) {
            isValid = false;
        }
    }

    // console.table(comparisonTable);

    return { isValid, grid, debugRows, comparisonTable, ingredientPlacement };
}


function collectMutationCandidates(
    grid: string[],
    itemEntry: GeneratorItemExpanded,
    biggest: RequirementEntry
): MutationCandidate[] {
    const candidates: MutationCandidate[] = [];
    const seen = new Set<string>();

    const addCandidate = (baseGrid: string[], row: number, col: number, bucket: string) => {
        const key = `${bucket}:${row},${col}`;
        if (seen.has(key)) return;
        if (!blockFits(row, col, itemEntry.size, baseGrid)) return;
        seen.add(key);
        candidates.push({ baseGrid, row, col });
    };

    const existingPositions = findAllIngredientPositions(biggest, grid);
    for (const { posX, posY } of existingPositions) {
        const sides = getSideCells(posX, posY, biggest.size, grid);
        for (const key in sides) {
            for (const cell of sides[key as Side]) {
                addCandidate(grid, cell.row, cell.col, "reuse");
            }
        }
    }

    const freshRegions = findAllFreeRegions(biggest.size, grid);
    for (const region of freshRegions) {
        const gridWithFreshBlock = placeItemWithBigSize(
            { crop: biggest.crop, size: biggest.size },
            region.row,
            region.col,
            grid
        );
        const sides = getSideCells(region.row, region.col, biggest.size, gridWithFreshBlock);
        for (const key in sides) {
            for (const cell of sides[key as Side]) {
                addCandidate(gridWithFreshBlock, cell.row, cell.col, `fresh:${region.row},${region.col}`);
            }
        }
    }

    return candidates;
}

export interface PlacedItem {
    crop: string;
    row: number;
    col: number;
    size: number;
    placedByUser: boolean;
    linkedto?: string[];
    type: "input" | "output" | "intermediate";
}

function placeMutation(
    itemEntry: GeneratorItemExpanded,
    currentTable: string[],
    placements: PlacedItem[]
): string[] {
    let grid = [...currentTable];
    let placedCount = 0;
    let placedExisting = 0;

    const requirements = [...(itemEntry.requirements ?? [])].sort((a, b) => b.size - a.size);

    if (requirements.length === 0) {
        while (placedCount < itemEntry.amount) {
            const spots = findAllFreeRegions(itemEntry.size, grid);
            if (spots.length === 0) break;
            grid = placeItemWithBigSize(itemEntry, spots[0].row, spots[0].col, grid);
            placedCount++;
        }
        if (placedCount < itemEntry.amount) {
            console.log(`Could not place all instances of ${itemEntry.crop}. Placed ${placedCount} out of ${itemEntry.amount}.`);
        }
        return grid;
    }

    const biggest = requirements[0];

    const existingTargets = findAllTargetsPositions(itemEntry.crop, grid, itemEntry.size);
    // console.log(`Existing targets for ${itemEntry.crop}:`, existingTargets.length, "of", itemEntry.amount);
    // console.table(existingTargets);

    while(placedExisting < existingTargets.length && placedCount < itemEntry.amount) {
        const target = existingTargets[placedExisting];
        const gridWithMutation = placeItemWithBigSize(itemEntry, target.posX, target.posY, grid);

        const { grid: gridAfterIngredients, isValid, ingredientPlacement } = placeIngredients(
            target.posX,
            target.posY,
            itemEntry.size,
            gridWithMutation,
            requirements,
            itemEntry
        );

        if (isValid) {
            grid = gridAfterIngredients;
            placedCount++;
            placements.push({
                crop: itemEntry.crop,
                row: target.posX,
                col: target.posY,
                size: itemEntry.size,
                placedByUser: false,
                type: "output"
            });
            placements.push(
                ...ingredientPlacement.map((item): PlacedItem => ({
                    ...item,
                    linkedto: [`${itemEntry.crop}#${target.posX}${target.posY}`]
                    ,
                }))
            );
        } else {
            console.log(`Could not place ingredients for ${itemEntry.crop} at existing position (${target.posX}, ${target.posY}).`);
        }
        placedExisting++;
    }

    while (placedCount < itemEntry.amount) {
        const candidates = collectMutationCandidates(grid, itemEntry, biggest);

        let committed = false;
        for (const candidate of candidates) {
            const gridWithMutation = placeItemWithBigSize(itemEntry, candidate.row, candidate.col, candidate.baseGrid);


            const { grid: gridAfterIngredients, isValid, ingredientPlacement } = placeIngredients(
                candidate.row,
                candidate.col,
                itemEntry.size,
                gridWithMutation,
                requirements,
                itemEntry
            );

            if (isValid) {
                grid = gridAfterIngredients;
                placedCount++;
                committed = true;
                placements.push({
                    crop: itemEntry.crop,
                    row: candidate.row,
                    col: candidate.col,
                    size: itemEntry.size,
                    placedByUser: false,
                    type: "output"
                })
                placements.push(
                    ...ingredientPlacement.map((item): PlacedItem => ({
                        ...item,
                        linkedto: [`${itemEntry.crop}#${candidate.row}${candidate.col}`],
                    }))
                );
                break;
            }

        }

        if (!committed) {
            console.log(`Could not find a valid spot for ${itemEntry.crop}. Placed ${placedCount} out of ${itemEntry.amount}.`);
            break;
        }
    }

    if (placedCount < itemEntry.amount) {
        console.log(`Could not place all instances of ${itemEntry.crop}. Placed ${placedCount} out of ${itemEntry.amount}.`);
    }

    return grid;
}

function placeCrop(
    itemEntry: GeneratorItemExpanded,
    currentTable: string[],
    placements: PlacedItem[]
): string[] {
    let newTable = [...currentTable];
    let placedCount = 0;

    while (placedCount < itemEntry.amount) {
        const spots = findAllFreeRegions(itemEntry.size, newTable);
        if (spots.length === 0) break;
        newTable = placeItemWithBigSize(itemEntry, spots[0].row, spots[0].col, newTable);
        placements.push({
            crop: itemEntry.crop,
            row: spots[0].row,
            col: spots[0].col,
            size: itemEntry.size,
            placedByUser: false,
            type: "output",
        });
        placedCount++;
    }

    if (placedCount < itemEntry.amount) {
        console.log(`Could not place all instances of ${itemEntry.crop}. Placed ${placedCount} out of ${itemEntry.amount}.`);
    }

    return newTable;
}

function possibleSpawns(
    itemEntry: GeneratorItemExpanded,
    currentTable: string[],
    placements: PlacedItem[]
): string[] {
    const newTable = [...currentTable];
    if (itemEntry.type === "crop") return placeCrop(itemEntry, newTable, placements);
    if (itemEntry.type === "mutation") return placeMutation(itemEntry, newTable, placements);
    return newTable;
}

function checkConstraintsRules(
    newData: GeneratorItemExpanded[],
    tabData: string[],
    placements: PlacedItem[]
): string[] {
    for (const entry of newData) {
        tabData = possibleSpawns(entry, tabData, placements);
    }
    return tabData;
}
function logGridAsRows(tabData: string[]) {
    const rows: string[][] = [];
    for (let i = 0; i < tabData.length; i += GRID) {
        rows.push(tabData.slice(i, i + GRID));
    }
    // console.table(rows);
}

function expandItemData(initialItems: GeneratorItem[]): GeneratorItemExpanded[] {
    return initialItems.map((item) => {
        const cropData = getCrop(item.crop) || getMutation(item.crop);
        const rawRequirements = cropData?.requirements ?? null;

        const defaultSpace = 1;


        const requirements: RequirementEntry[] | null = rawRequirements
            ? rawRequirements.map((entry) => {
                const reqCropData = getCrop(entry.crop) || getMutation(entry.crop);
                return {
                    crop: entry.crop,
                    amount: entry.count,
                    size: reqCropData?.size ?? 1,
                };
            })
            : null;

        const totalSpaceNeeded = requirements
            ? requirements.reduce(
                (accumulator, currentValue) => accumulator + (currentValue.size) * currentValue.amount,
                defaultSpace,
            )
            : 1;


        let itsCompact = true;
        const currentSize = requirements ? requirements[0].size : 1;

        const biggestIngredientSize = requirements
            ? Math.max(...requirements.map(r => r.size))
            : 1;

        if (requirements) {
            for (let i = 1; i < requirements.length; i++) {
                const entry = requirements[i];
                if (entry.size !== currentSize) {
                    itsCompact = false;
                    break;
                }
            }
        }

        return {
            ...item,
            type: (!!requirements && requirements.length > 0) ? "mutation" : "crop",
            size: cropData?.size ?? 1,
            hasRequirements: !!requirements && requirements.length > 0,
            ...(requirements ? { requirements } : {}),
            totalSpaceNeeded,
            itsCompact: itsCompact,
            biggestIngredientSize: biggestIngredientSize
        };
    });
}

export function startGenerating(
    initialItems: GeneratorItem[],
    tabData: string[]
): {
    grid: string[];
    placements: PlacedItem[]
} {
    const placements: PlacedItem[] = [];
    const newData = expandItemData(initialItems);
    newData.sort((a, b) => b.priority - a.priority);
    const grid = checkConstraintsRules(newData, tabData, placements);

    return { grid, placements };
}