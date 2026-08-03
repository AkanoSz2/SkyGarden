import type {GreenhouseTabData} from "../types.ts";
import {placeCrop} from "./placement.ts";

export function handleMouseDown(
    index: number,
    e: React.MouseEvent,
    selectedCrop: string | undefined,
    selectedType: string | undefined,
    activeTab: number,
    setGreenhouseTabData: React.Dispatch<React.SetStateAction<GreenhouseTabData[]>>,
    setHoveredIndex?: React.Dispatch<React.SetStateAction<number | null>>,
    setIsDragging?: React.Dispatch<React.SetStateAction<boolean>>
) {
    if (e.button === 2) return;
    if (!selectedCrop) return;
    setIsDragging?.(true);
    placeCrop(index, selectedCrop, selectedType, activeTab, setGreenhouseTabData);
    setHoveredIndex?.(null);
};

export function handleMouseEnter(
    index: number,
    selectedCrop: string | undefined,
    selectedType: string | undefined,
    activeTab: number,
    setGreenhouseTabData: React.Dispatch<React.SetStateAction<GreenhouseTabData[]>>,
    setHoveredIndex?: React.Dispatch<React.SetStateAction<number | null>>,
    isDragging?: boolean
) {
    if (isDragging && selectedCrop) placeCrop(index, selectedCrop, selectedType, activeTab, setGreenhouseTabData);
    else setHoveredIndex?.(index);
};

export function endDrag(
    setIsDragging?: React.Dispatch<React.SetStateAction<boolean>>,
    setHoveredIndex?: React.Dispatch<React.SetStateAction<number | null>>
) {
    setIsDragging?.(false);
    setHoveredIndex?.(null);
};