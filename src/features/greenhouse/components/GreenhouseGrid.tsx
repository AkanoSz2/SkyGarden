import { GridCell } from "./GridCell";
import {
    getPositions,
    getCropSize,
    getBaseId,
    getCropData,
    removeCrop,
    getTypeColor,
    placeCrop,
    emptyGrid,
} from "../scripts/placement";

import { handleMouseDown, handleMouseEnter, endDrag } from "../scripts/interactions";
import { RarityColors } from "../../shared";
import type { GreenhouseLayoutProps } from "../types";

import {GRID} from "../data/constants.ts";

import { useState, useEffect } from "react";
import { startGenerating } from "../../generator/scripts/constraints.ts";

export function GreenhouseGrid({
                                   cells,
                                   selectedCrop,
                                   hoveredIndex,
                                   setHoveredIndex,
                                   greenhouseTabData,
                                   setGreenhouseTabData,
                                   selectedType,
                                   activeTab,
                                   generateTrigger,
                                   setGenerateTrigger,
                                   generatorItems,
                                   forcePlace
                               }: GreenhouseLayoutProps) {
    const [isDragging, setIsDragging] = useState(false);

    const gridCells = Array.from({length: 100}, (_, i) => cells[i] || "empty");

    useEffect(() => {
        const handler = () => endDrag(setIsDragging, setHoveredIndex);
        window.addEventListener("mouseup", handler);
        return () => window.removeEventListener("mouseup", handler);
    }, []);

    const previewPositions = selectedCrop && hoveredIndex != null && !isDragging
        ? getPositions(hoveredIndex, getCropSize(selectedCrop))
        : [];

    const activeTabPlacements = greenhouseTabData.find(t => t.id === activeTab)?.placements ?? [];

    const placementTypeById = new Map<string, string | undefined>(
        activeTabPlacements.map(p => [p.instanceId, p.type])
    );
    const placementValidById = new Map<string, boolean | undefined>(
        activeTabPlacements.map(p => [p.instanceId, p.valid])
    );

    useEffect(() => {
        if (!generateTrigger) return;
        setGenerateTrigger?.(false);


        const { placements } = startGenerating(generatorItems, gridCells);

        // console.log(greenhouseTabData[activeTab - 1])
        const originalPlacements = greenhouseTabData[activeTab - 1]?.placements ?? [];

        // console.log("hi", gridCells)
        setGreenhouseTabData(prev =>
            prev.map(tab =>
                tab.id === activeTab ? { ...tab,
                    cells: gridCells,
                    placements: originalPlacements
            } : tab
            )
        );


        placements.forEach(({ crop, row, col, type, linkedto }) => {
            const startIndex = row * GRID + col;
            if (!crop || !type) return;

            if (gridCells[startIndex] !== "empty") {
                const cellValue = gridCells[startIndex];
                const previousType = originalPlacements.find(p => p.instanceId === cellValue)?.type;

                const previousForcedPlace = greenhouseTabData[activeTab - 1]?.placements.find(p => p.instanceId === cellValue)?.forcePlaced;
                // console.log("previousForcedPlace", previousForcedPlace, "previousType", previousType, "type", type)

                if ((previousType === "output" || previousType === "intermediate" || previousForcedPlace) && type === "input") {
                    placeCrop(startIndex, crop, "forced", activeTab, setGreenhouseTabData, false);
                    return;
                }
            }
            placeCrop(startIndex, crop, type, activeTab, setGreenhouseTabData, false);
        });

        // console.table(greenhouseTabData[0].placements)
    }, [generateTrigger, generatorItems, gridCells, activeTab, setGenerateTrigger, setGreenhouseTabData]);

    return (
        <div
            className="rounded-3 p-2 shadow-2xl"
            style={{backgroundColor: "#0f172a"}}
        >
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(10, 1fr)",
                    gap: "5px",
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

                    const typeForColor = isEmpty ? selectedType : placementTypeById.get(cell);
                    const validForColor = isEmpty ? true : placementValidById.get(cell) ?? true;

                    const border = getTypeColor(typeForColor, validForColor);

                    return (
                        <GridCell
                            index={index}
                            baseId={baseId}
                            isEmpty={isEmpty}
                            isPreview={isPreview}
                            selectedCrop={selectedCrop}
                            border={border}
                            colors={colors}
                            onMouseDown={(e) => handleMouseDown(
                                index, e, selectedCrop, selectedType,
                                activeTab, setGreenhouseTabData, setHoveredIndex,
                                setIsDragging, forcePlace)}
                            onMouseEnter={() => handleMouseEnter(index, selectedCrop, selectedType, activeTab, setGreenhouseTabData,
                                setHoveredIndex, isDragging, forcePlace)}
                            onMouseLeave={() => {
                                if (!isDragging) setHoveredIndex?.(null);
                            }}
                            onContextMenu={(e) => {
                                e.preventDefault();
                                removeCrop(index, gridCells, placementTypeById, selectedType, activeTab, setGreenhouseTabData, forcePlace);
                            }}
                        />
                    );
                })}
            </div>
        </div>
    );
}