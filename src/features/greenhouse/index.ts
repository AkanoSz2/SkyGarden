// Components
export { GreenhouseLayout } from "./components/GridLayout";
export { GreenhouseGrid } from "./components/GreenhouseGrid";
export { GridCell } from "./components/GridCell";
export { TabButton, AddTabButton } from "./components/TabButton";
export { Legend } from "./components/Legend";

export { placeCrop, removeCrop, validateGrid, getCropSize } from "./scripts/placement";
export { addTab, deleteTab, printCropMap } from "./scripts/tabs";

// Types
export type {
    GreenhouseTabData,
    PlacementEntry,
    GreenhouseLayoutProps,
    GridCellProps,
    TabButtonProps,
} from "./types";

// Data
export { legendItems, GRID } from "./data/constants";