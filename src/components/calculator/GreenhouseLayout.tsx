import { useState, useEffect } from "react";
import {
    getMutation,
    getCrop,
    RarityColors,
    formatCropName,
} from "../shared/CropData";

type GreenhouseLayoutProps = {
    cells: string[];
    selectedCrop?: string;
    hoveredIndex?: number | null;
    setCells: React.Dispatch<React.SetStateAction<string[]>>;
    setHoveredIndex?: React.Dispatch<React.SetStateAction<number | null>>;
};

export function GreenhouseLayout({
                                     cells,
                                     selectedCrop,
                                     hoveredIndex,
                                     setCells,
                                     setHoveredIndex,
                                 }: GreenhouseLayoutProps) {

    const [isDragging, setIsDragging] = useState(false);
    const [placementCounter, setPlacementCounter] = useState(0);

    const [placementHistory, setPlacementHistory] = useState<Array<{
        instanceId: string;
        crop: string;
        startIndex: number;
        positions: number[];
        timestamp: string;
    }>>([]);

    const gridCells = Array.from({ length: 100 }, (_, index) => cells[index] || "empty");

    const getBaseId = (id: string) => id?.split("#")[0];

    const getCropData = (id: string) => {
        if (!id || id === "empty") return null;
        return getCrop(getBaseId(id)) || getMutation(getBaseId(id));
    };

    const getCropSize = (cropId: string): number => {
        const data = getCropData(cropId);
        return data?.size || 1;
    };

    const getOccupiedPositions = (startIndex: number, size: number): number[] => {
        const GRID = 10;
        const startRow = Math.floor(startIndex / GRID);
        const startCol = startIndex % GRID;

        const build = (row: number, col: number) => {
            const positions: number[] = [];
            for (let r = 0; r < size; r++) {
                for (let c = 0; c < size; c++) {
                    positions.push((row + r) * GRID + (col + c));
                }
            }
            return positions;
        };

        const fits = (row: number, col: number) =>
            row >= 0 &&
            col >= 0 &&
            row + size <= GRID &&
            col + size <= GRID;

        let best: number[] = [];
        let bestDistance = Infinity;

        for (let dr = -size; dr <= size; dr++) {
            for (let dc = -size; dc <= size; dc++) {
                const newRow = startRow + dr;
                const newCol = startCol + dc;

                if (!fits(newRow, newCol)) continue;

                const positions = build(newRow, newCol);
                const distance = Math.sqrt(dr * dr + dc * dc);

                if (distance < bestDistance) {
                    bestDistance = distance;
                    best = positions;
                }
            }
        }

        return best;
    };
    const formatPositions = (positions: number[]): string => {
        if (positions.length === 0) return "[]";
        return `[${positions.sort((a, b) => a - b).join(", ")}]`;
    };

    const printFullHistory = () => {
        console.log("Active Crops");

        if (placementHistory.length === 0) {
            console.log("No placements yet.");
            return;
        }

        placementHistory.forEach((entry, i) => {
            const cropName = formatCropName(entry.crop);
            const size = getCropSize(entry.crop);
            const sizeLog = size > 1 ? `(${size}x${size})` : "";

            console.log(
                `#${i + 1} | ${cropName} ${sizeLog} | Start: ${entry.startIndex} | Positions: ${formatPositions(entry.positions)} | ${entry.timestamp}`
            );
        });
    };

    const placeCrop = (startIndex: number) => {
        if (!selectedCrop) return;

        const size = getCropSize(selectedCrop);
        const positions = getOccupiedPositions(startIndex, size);

        if (positions.length === 0) return;

        const instanceId = `${selectedCrop}#${placementCounter + 1}`;

        setPlacementCounter(prev => prev + 1);

        setCells(prev => {
            const updatedCells = [...prev];

            const overlapping = new Set<string>();

            for (const pos of positions) {
                if (updatedCells[pos] !== "empty") {
                    overlapping.add(updatedCells[pos]);
                }
            }

            if (overlapping.size > 0) {
                for (let i = 0; i < updatedCells.length; i++) {
                    if (overlapping.has(updatedCells[i])) {
                        updatedCells[i] = "empty";
                    }
                }
            }

            for (const pos of positions) {
                updatedCells[pos] = instanceId;
            }

            return updatedCells;
        });

        setPlacementHistory(currentHistory => {
            let filteredHistory = [...currentHistory];

            const overlapping = new Set<string>();

            for (const pos of positions) {
                if (gridCells[pos] !== "empty") {
                    overlapping.add(gridCells[pos]);
                }
            }

            filteredHistory = filteredHistory.filter(entry =>
                !overlapping.has(entry.instanceId)
            );

            return [
                ...filteredHistory,
                {
                    instanceId,
                    crop: selectedCrop,
                    startIndex,
                    positions: [...positions],
                    timestamp: new Date().toISOString(),
                },
            ];
        });
    };

    const handleMouseDown = (index: number) => {
        if (!selectedCrop) return;
        setIsDragging(true);
        placeCrop(index);
        setHoveredIndex?.(null);
    };

    const handleMouseEnter = (index: number) => {
        if (!selectedCrop) return;

        if (isDragging) {
            placeCrop(index);
        } else if (setHoveredIndex) {
            setHoveredIndex(index);
        }
    };

    const handleMouseLeave = () => {
        if (!isDragging && setHoveredIndex) {
            setHoveredIndex(null);
        }
    };

    const endDrag = () => {
        setIsDragging(false);
        setHoveredIndex?.(null);
    };

    useEffect(() => {
        window.addEventListener("mouseup", endDrag);
        return () => window.removeEventListener("mouseup", endDrag);
    }, []);

    const getPreviewPositions = (): number[] => {
        if (!selectedCrop || hoveredIndex === null || isDragging) return [];
        const size = getCropSize(selectedCrop);

        return getOccupiedPositions(hoveredIndex, size);
    };

    const previewPositions = getPreviewPositions();

    useEffect(() => {
        if (!selectedCrop) return;
        const size = getCropSize(selectedCrop);
        console.log(`Selected: ${formatCropName(selectedCrop)} | Size: ${size}x${size}`);
    }, [selectedCrop]);

    useEffect(() => {
        printFullHistory();
    }, [placementHistory]);

    return (
        <div>
            <div
                className="border border-[#334155] rounded-3 p-2 d-flex flex-column shadow-2xl"
                style={{ backgroundColor: "#0f172a", width: "100%", height: "auto" }}
            >
                <div className="flex-grow-1 d-flex align-items-center justify-content-center p-3 bg-[#0f172a] rounded-2">
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(10, 1fr)",
                            gap: "2px",
                            width: "100%",
                            height: "100%",
                            cursor: selectedCrop ? "crosshair" : "default",
                            userSelect: "none",
                        }}
                    >
                        {gridCells.map((cell, index) => {
                            const isEmpty = cell === "empty";
                            const cropData = !isEmpty ? getCropData(cell) : null;

                            const rarity = cropData?.rarity || "crops";
                            const colors = RarityColors[rarity as keyof typeof RarityColors];

                            const isPreviewCell = previewPositions.includes(index);

                            const baseId = isEmpty ? null : getBaseId(cell);

                            const showPreview = isPreviewCell && selectedCrop;

                            const displayName =
                                baseId ? formatCropName(baseId) : "";

                            return (
                                <div
                                    key={index}
                                    className="ratio ratio-1x1"
                                    onMouseDown={() => handleMouseDown(index)}
                                    onMouseEnter={() => handleMouseEnter(index)}
                                    onMouseLeave={handleMouseLeave}
                                >
                                    <div
                                        className="border rounded overflow-hidden d-flex flex-column p-1 hover-effect"
                                        style={{
                                            borderColor: isPreviewCell
                                                ? "#720bd6"
                                                : isEmpty
                                                    ? "#475569"
                                                    : colors.border,

                                            backgroundColor:
                                                isEmpty
                                                    ? "#1e2937"
                                                    : colors.bg,

                                            boxShadow: isPreviewCell
                                                ? "0 0 12px #a855f760"
                                                : isEmpty
                                                    ? "none"
                                                    : `0 0 8px ${colors.border}60`,

                                            opacity: isPreviewCell ? 0.9 : 1,
                                            transition: "all 0.08s ease-in-out",
                                        }}
                                    >
                                        <div className="flex-grow-1 d-flex align-items-center justify-content-center p-1">
                                            {baseId ? (
                                                <img
                                                    src={`/greenhouse/crops/${baseId}.png`}
                                                    alt={displayName}
                                                    style={{
                                                        width: "100%",
                                                        height: "100%",
                                                        objectFit: "contain",
                                                        imageRendering: "pixelated",
                                                        opacity: showPreview ? 0.4 : 1,
                                                    }}
                                                />
                                            ) : showPreview ? (
                                                <img
                                                    src={`/greenhouse/crops/${selectedCrop}.png`}
                                                    alt={formatCropName(selectedCrop)}
                                                    style={{
                                                        width: "100%",
                                                        height: "100%",
                                                        objectFit: "contain",
                                                        imageRendering: "pixelated",
                                                        opacity: 0.9,
                                                    }}
                                                />
                                            ) : (
                                                <div style={{ color: "#475569", fontSize: "22px", opacity: 0.4 }} />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}