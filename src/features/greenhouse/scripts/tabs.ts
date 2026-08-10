import type {GreenhouseTabData} from "../types.ts";
import {emptyGrid} from "./placement.ts";
import {GRID} from "../data/constants.ts";
import {formatCropName, getCrop} from "../../shared/scripts/CropData.ts";


export function addTab(
    tabs: string[],
    active: string,
    setTabs: React.Dispatch<React.SetStateAction<string[]>>,
    setActive: React.Dispatch<React.SetStateAction<string>>,
    setGreenhouseTabData: React.Dispatch<React.SetStateAction<GreenhouseTabData[]>>,
    maxTabs: number
) {
    if (tabs.length >= maxTabs) return;
    setTabs(prev => {
        const maxId = prev.reduce((m, k) => Math.max(m, parseInt(k, 10) || 0), 0);
        const newId = maxId + 1;
        const newKey = `${newId}`;
        const prevTabId = parseInt(active, 10);

        setActive(newKey);
        setGreenhouseTabData(prevData => {
            const sourceTab = prevData.find(t => t.id === prevTabId);

            const carriedPlacements = (() => {
                if (!sourceTab) return [];

                const carryableIds = new Set(
                    sourceTab.placements
                        .filter(p =>
                            p.type === "output" ||
                            p.type === "intermediate" ||
                            p.type == "forced" ||
                            (p.type === "input" && getCrop(p.crop.split("#")[0]))
                        )
                        .map(p => p.instanceId)
                );

                const positionsById = new Map<string, number[]>();
                sourceTab.cells.forEach((cellId, idx) => {
                    if (carryableIds.has(cellId)) {
                        const arr = positionsById.get(cellId) ?? [];
                        arr.push(idx);
                        positionsById.set(cellId, arr);
                    }
                });

                const result: typeof sourceTab.placements = [];

                for (const p of sourceTab.placements) {
                    if(p.instanceId.includes("dead_plant")) continue;
                    if (carryableIds.has(p.instanceId) && positionsById.has(p.instanceId)) {
                        result.push({
                            ...p,
                            type: "intermediate",
                            positions: positionsById.get(p.instanceId)!,
                        });
                    }
                }

                return result;
            })();

            const newCells = emptyGrid();
            for (const placement of carriedPlacements) {
                for (const pos of placement.positions) {
                    newCells[pos] = placement.instanceId;
                }
            }

            return [
                ...prevData,
                {id: newId, cells: newCells, placements: carriedPlacements},
            ];
        });
        return [...prev, newKey];
    });
};

export function deleteTab(
    key: string,
    setTabs: React.Dispatch<React.SetStateAction<string[]>>,
    setActive: React.Dispatch<React.SetStateAction<string>>,
    setGreenhouseTabData: React.Dispatch<React.SetStateAction<GreenhouseTabData[]>>,
    active: string
) {
    setTabs(prev => {
        const idx = prev.indexOf(key);
        if (idx <= 0) return prev;

        const next = prev.slice(0, idx);
        if (!next.includes(active)) {
            setActive(next[next.length - 1]);
        }
        return next;
    });

    const deletedId = parseInt(key, 10);
    setGreenhouseTabData(prev => prev.filter(t => t.id < deletedId));
};


export function syncTabsFromImport(
    data: GreenhouseTabData[],
    setTabs: React.Dispatch<React.SetStateAction<string[]>>,
    setActive: React.Dispatch<React.SetStateAction<string>>
) {
    const ids = data.map(t => t.id).sort((a, b) => a - b);
    const keys = ids.length ? ids.map(id => `${id}`) : ["1"];
    setTabs(keys);
    setActive(keys[0]);
}

export function printCropMap(tabName: string, getTabData: (id: number) => GreenhouseTabData) {
    const id = parseInt(tabName, 10);
    const tabData = getTabData(id);
    const grid = tabData.cells;

    const table: Record<string, Record<string, string>> = {};
    for (let r = 0; r < GRID; r++) {
        const rowObj: Record<string, string> = {};
        for (let c = 0; c < GRID; c++) {
            const cellId = grid[r * GRID + c];
            rowObj[(c + 1).toString()] = cellId === "empty" ? "" : cellId.split("#")[0];
        }
        table[(r + 1).toString()] = rowObj;
    }

    const placements = tabData.placements;

    placements.map(entry => {
        const rows = entry.positions.map(p => Math.floor(p / GRID));
        const cols = entry.positions.map(p => p % GRID);
        const type = entry.type;
        const valid = entry.valid
        const posY = Math.min(...rows) + 1;
        const posX = Math.min(...cols) + 1;


        return {
            cropName: formatCropName(entry.crop.split("#")[0]),
            posX,
            posY,
            type,
            valid
        };
    });
    //
    //
    // console.group(`Greenhouse — Tab ${tabName}`);
    // console.log("Crop Map:");
    // console.table(table);
    // console.log("Placement History:");
    // console.table(historyTable);
    console.groupEnd();
};

