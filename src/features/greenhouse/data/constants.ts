import {LuTrophy, LuX} from "react-icons/lu";
import type {IconType} from "react-icons";
import type {LegendItem} from "../types.ts";


export const GRID = 10;

export const TabIcons: { name: string; icon: IconType }[] = [
    {name: "final", icon: LuTrophy},
    {name: "delete", icon: LuX},
];

export const legendItems: Record<string, LegendItem> = {
    helper: {label: "Helper", color: "#db2777", id: "helper"},
    input: {label: "Ingredient", color: "#d97706", id: "input"},
    output: {label: "Output", color: "#16a34a", id: "output"},
    intermediate: {label: "Intermediate", color: "#8b5cf6", id: "intermediate"},
    invalid: {label: "Invalid", color: "#dc2626", id: "invalid"},
    forced: {label: "Forced", color: "#0d3bb1", id: "forced"},
};
