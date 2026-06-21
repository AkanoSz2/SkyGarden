import { useState, useEffect } from "react";
import { getMutation, getCrop, RarityColors, formatCropName } from "../shared/CropData";

type PlacementEntry = {
    instanceId: string;
    crop: string;
    positions: number[];
};

type GreenhouseLayoutProps = {
    cells: string[];
    selectedCrop?: string;
    hoveredIndex?: number | null;
    setCells: React.Dispatch<React.SetStateAction<string[]>>;
    setHoveredIndex?: React.Dispatch<React.SetStateAction<number | null>>;
};

const GRID = 10;

function getPositions(startIndex: number, size: number): number[] {
    const row = Math.min(Math.floor(startIndex / GRID), GRID - size);
    const col = Math.min(startIndex % GRID, GRID - size);
    const positions: number[] = [];
    for (let r = 0; r < size; r++)
        for (let c = 0; c < size; c++)
            positions.push((row + r) * GRID + (col + c));
    return positions;
}

export function GreenhouseLayout({
                                     cells,
                                     selectedCrop,
                                     hoveredIndex,
                                     setCells,
                                     setHoveredIndex,
                                 }: GreenhouseLayoutProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [history, setHistory] = useState<PlacementEntry[]>([]);

    const gridCells = Array.from({ length: 100 }, (_, i) => cells[i] || "empty");

    const getBaseId = (id: string) => id.split("#")[0];
    const getCropData = (id: string) => getCrop(getBaseId(id)) || getMutation(getBaseId(id));
    const getCropSize = (id: string) => getCropData(id)?.size ?? 1;

    const placeCrop = (startIndex: number) => {
        if (!selectedCrop) return;

        const size = getCropSize(selectedCrop);
        const positions = getPositions(startIndex, size);
        const instanceId = `${selectedCrop}#${Date.now()}`;

        setCells(prev => {
            const next = [...prev];
            const toRemove = new Set(positions.map(p => next[p]).filter(v => v !== "empty"));
            for (let i = 0; i < next.length; i++)
                if (toRemove.has(next[i])) next[i] = "empty";
            for (const p of positions) next[p] = instanceId;
            return next;
        });

        setHistory(prev => {
            const overwritten = new Set(positions.map(p => gridCells[p]).filter(v => v !== "empty"));
            return [
                ...prev.filter(e => !overwritten.has(e.instanceId)),
                { instanceId, crop: selectedCrop, positions },
            ];
        });
    };

    const removeCrop = (index: number) => {
        const instanceId = gridCells[index];
        if (!instanceId || instanceId === "empty") return;
        setCells(prev => prev.map(v => v === instanceId ? "empty" : v));
        setHistory(prev => prev.filter(e => e.instanceId !== instanceId));
    };

    const handleMouseDown = (index: number, e: React.MouseEvent) => {
        if (e.button === 2) return;
        if (!selectedCrop) return;
        setIsDragging(true);
        placeCrop(index);
        setHoveredIndex?.(null);
    };

    const handleMouseEnter = (index: number) => {
        if (isDragging && selectedCrop) placeCrop(index);
        else setHoveredIndex?.(index);
    };

    const endDrag = () => { setIsDragging(false); setHoveredIndex?.(null); };

    useEffect(() => {
        window.addEventListener("mouseup", endDrag);
        return () => window.removeEventListener("mouseup", endDrag);
    }, []);

    const previewPositions = selectedCrop && hoveredIndex != null && !isDragging
        ? getPositions(hoveredIndex, getCropSize(selectedCrop))
        : [];

    return (
        <div
            className="border border-[#334155] rounded-3 p-2 shadow-2xl"
            style={{ backgroundColor: "#0f172a" }}
        >
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(10, 1fr)",
                    gap: "2px",
                    cursor: selectedCrop ? "crosshair" : "default",
                    userSelect: "none",
                    padding: "12px",
                }}
            >
                {gridCells.map((cell, index) => {
                    const isEmpty = cell === "empty";
                    const baseId = isEmpty ? null : getBaseId(cell);
                    const rarity = (baseId ? getCropData(baseId)?.rarity : null) ?? "crops";
                    const colors = RarityColors[rarity as keyof typeof RarityColors];
                    const isPreview = previewPositions.includes(index);

                    return (
                        <div
                            key={index}
                            className="ratio ratio-1x1"
                            onMouseDown={(e) => handleMouseDown(index, e)}
                            onMouseEnter={() => handleMouseEnter(index)}
                            onMouseLeave={() => { if (!isDragging) setHoveredIndex?.(null); }}
                            onContextMenu={(e) => { e.preventDefault(); removeCrop(index); }}
                        >
                            <div
                                className="border rounded overflow-hidden d-flex align-items-center justify-content-center p-1"
                                style={{
                                    borderColor: isPreview ? "#720bd6" : isEmpty ? "#475569" : colors.border,
                                    backgroundColor: isEmpty ? "#1e2937" : colors.bg,
                                    boxShadow: isPreview
                                        ? "0 0 12px #a855f760"
                                        : isEmpty ? "none" : `0 0 8px ${colors.border}60`,
                                    opacity: isPreview ? 0.9 : 1,
                                    transition: "all 0.08s ease-in-out",
                                }}
                            >
                                {(baseId || (isPreview && selectedCrop)) && (
                                    <img
                                        src={`/greenhouse/crops/${baseId ?? selectedCrop}.png`}
                                        alt={formatCropName(baseId ?? selectedCrop!)}
                                        style={{
                                            width: "100%", height: "100%",
                                            objectFit: "contain",
                                            imageRendering: "pixelated",
                                            opacity: isPreview && baseId ? 0.4 : isPreview ? 0.9 : 1,
                                        }}
                                    />
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}