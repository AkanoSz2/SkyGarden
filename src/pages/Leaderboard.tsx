import { useState, useMemo } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Navbar, Footer } from "../components/ui";
import { getMutation } from "../features/shared";
import type { TableGreenhouseRow } from "../features/shared/types.ts";
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
                <Footer />
            </div>
        </PlayerDataProvider>
    );
}