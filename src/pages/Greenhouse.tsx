import "bootstrap/dist/css/bootstrap.min.css";
import { Navbar, Footer } from "../components/ui";
import { useMemo, useState } from "react";

import { GreenhouseLayout } from "../features/greenhouse/components/GridLayout.tsx";
import { InputCrops } from "../features/greenhouse/components/InputCrops.tsx";
import { SidebarHelper} from "../features/greenhouse/components/SidebarHelper.tsx";
import { MutationStatus} from "../features/greenhouse/components/MutationStatus.tsx";

import type { TableGreenhouseRow } from "../components/shared/types.ts";
import { getMutation } from "../components/shared";

export function Greenhouse() {
    const [cells, setCells] = useState<string[]>(Array(100).fill("empty"));
    const [selectedCrop, setSelectedCrop] = useState<string | undefined>();
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    const handleSelectCrop = (crop?: string) =>
        setSelectedCrop(prev => prev === crop ? undefined : crop);

    const greenhouseRows: TableGreenhouseRow[] = useMemo(() => {
        const seen = new Set<string>();
        const counts: Record<string, number> = {};
        for (const cell of cells) {
            if (cell === "empty" || seen.has(cell)) continue;
            seen.add(cell);
            const baseId = cell.split("#")[0];
            counts[baseId] = (counts[baseId] ?? 0) + 1;
        }
        return Object.entries(counts).map(([id, count]) => {
            const mutation = getMutation(id);
            return { id, count, rarity: mutation?.rarity ?? "crops", drops: mutation?.drops ?? {} };
        });
    }, [cells]);

    return (
        <div data-bs-theme="dark" className="bg-dark">
            <Navbar />
            <div
                className="mx-auto d-flex gap-2 mb-5 justify-content-evenly align-items-start flex-nowrap"
                style={{padding: "10px 20px", userSelect: "none"}}
            >
                <div
                    style={{width: "20%", flexShrink: 0, marginTop: "40px"}}
                    className="d-flex flex-column gap-3"
                >
                    <SidebarHelper/>
                    <MutationStatus />
                </div>
                <div style={{width: "40%", flexShrink: 0}}>
                    <GreenhouseLayout
                        cells={cells}
                        setCells={setCells}
                        selectedCrop={selectedCrop}
                        hoveredIndex={hoveredIndex}
                        setHoveredIndex={setHoveredIndex}
                    />
                </div>
                <div style={{width: "30%", flexShrink: 0, marginTop: "40px"}}>
                    <InputCrops
                        selectedCrop={selectedCrop}
                        setSelectedCrop={handleSelectCrop}
                        setHoverCropedIndex={setHoveredIndex}
                    />
                </div>
            </div>
            <Footer/>
        </div>
    );
}