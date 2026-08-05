import type {GeneratorItem} from "../generator/types";
import type {Rarity} from "../shared";

// layout
export type TabButtonProps = {
    tabKey: string;
    active: string;
    iconName?: string;
    setActive: (key: string) => void;
    onDelete?: () => void;
};

export type PlacementEntry = {
    instanceId: string;
    crop: string;
    positions: number[];
    type?: string;
    valid?: boolean;
    placedByUser?: boolean;
    forcePlaced: boolean;
};

export type GridCellProps = {
    index: number;
    baseId: string | null;
    isEmpty: boolean;
    isPreview: boolean;
    selectedCrop?: string | null;
    border: string;
    colors: { border: string };
    onMouseDown: (e: React.MouseEvent) => void;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
    onContextMenu: (e: React.MouseEvent) => void;
};

export type GreenhouseTabData = {
    id: number;
    cells: string[];
    placements: PlacementEntry[];
};

export type GreenhouseLayoutProps = {
    cells: string[];
    selectedCrop?: string;
    hoveredIndex?: number | null;
    setCells: React.Dispatch<React.SetStateAction<string[]>>;
    setHoveredIndex?: React.Dispatch<React.SetStateAction<number | null>>;
    greenhouseTabData: GreenhouseTabData[];
    setGreenhouseTabData: React.Dispatch<React.SetStateAction<GreenhouseTabData[]>>;
    selectedType?: string;
    activeTab: number;

    clearGrid?: boolean;
    setClearGrid?: React.Dispatch<React.SetStateAction<boolean>>;
    clearGridType?: string;

    generateTrigger?: boolean;
    setGenerateTrigger?: React.Dispatch<React.SetStateAction<boolean>>;

    generatorItems: GeneratorItem[];
    setGeneratorItems: React.Dispatch<React.SetStateAction<GeneratorItem[]>>;

    forcePlace?: boolean;
};

export type LegendItem = {
    label: string;
    color: string;
    id: string;
};

// crop input map
export type RarityItem = {
    name: string;
    img: string;
    value: "all" | Rarity;
};

export type Props = {
    selectedCrop?: string,
    setSelectedCrop: (crop?: string) => void,
    setHoveredIndex: React.Dispatch<React.SetStateAction<number | null>>,
};


export type MapGridProps = {
    cells: string[];
    title?: string;
    onCropClick?: (cropId: string) => void;
    selectedCrop?: string;
};


// sidebar
export interface HelperProp {
    selectedType: string;
    setSelectedType: (type: string) => void;
    clearGrid?: boolean;
    setClearGrid?: (clear: boolean) => void;
    clearGridType?: string;
    setClearGridType?: (type: string) => void;
    greenhouseTabData?: GreenhouseTabData[];
    setShowImportModal: (show: boolean) => void;
}

