import { useState, useMemo } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { InputCrops, GreenhouseLayout, Stats } from "../components";
import { Navbar, Footer } from "../components/ui";
import { RatesPanel } from "../components/leaderboard";
import { getMutation } from "../components/shared";
import type { TableGreenhouseRow } from "../components/shared/types";
import { PlayerDataProvider } from "../context/PlayerDataContext";

export function Leaderboard() {
    const [selectedCrop, setSelectedCrop] = useState<string | undefined>();
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [cells, setCells] = useState<string[]>(Array(100).fill("empty"));

    const handleSelectCrop = (crop?: string) => {
        setSelectedCrop(prev => prev === crop ? undefined : crop);
    };

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
            const rarity = mutation?.rarity ?? "crops";
            const drops = mutation?.drops ?? {};
            return { id, count, rarity, drops };
        });
    }, [cells]);

    return (
        <PlayerDataProvider>
            <div data-bs-theme="dark">
                <Navbar />
                <div className="w-100 bg-dark py-4" style={{ minHeight: "100vh" }}>
                    <div className="mx-auto d-flex gap-2 mb-5 justify-content-evenly align-items-start flex-nowrap"
                         style={{ width: "100%", maxWidth: "100%", padding: "0 20px", userSelect: "none" }}>
                        <div style={{ width: "20%", flexShrink: 0 }}>
                            <Stats />
                        </div>
                        <div style={{ width: "40%", flexShrink: 0, position: "relative" }}>
                            <GreenhouseLayout
                                cells={cells}
                                selectedCrop={selectedCrop}
                                hoveredIndex={hoveredIndex}
                                setCells={setCells}
                                setHoveredIndex={setHoveredIndex}
                            />
                        </div>
                        <div style={{ width: "30%", flexShrink: 0 }}>
                            <InputCrops
                                selectedCrop={selectedCrop}
                                setSelectedCrop={handleSelectCrop}
                                setHoverCropedIndex={setHoveredIndex}
                            />
                        </div>
                    </div>
                    <div className="mx-auto d-flex flex-column justify-content-center"
                         style={{ width: "100%", padding: "0 40px", gap: "12px" }}>
                        <RatesPanel greenhouseRows={greenhouseRows} />
                    </div>
                </div>
                <Footer />
            </div>
        </PlayerDataProvider>
    );
}