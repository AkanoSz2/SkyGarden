

export type RequirementEntry = {
    crop: string;
    amount: number;
    size: number
};

export type RequirementMap = {
    id: string;
    crop: string;
    amount: number;
    size: number;
    posX: number;
    posY: number;
}


export type Side = "top" | "bottom" | "left" | "right";

export interface SideCell {
    row: number;
    col: number;
    cellIndex: number;
    cellId: string;
    itsValid: boolean;
}


export interface IngredientComparison {
    current: number;
    required: number;
    satisfied: boolean;
}

export type GeneratorItem = {
    id: string;
    crop: string;
    amount: number;
    priority: number;
};

export interface GeneratorItemExpanded extends GeneratorItem {
    type: string;
    size: number;
    hasRequirements: boolean;
    requirements?: RequirementEntry[] | null;
    totalSpaceNeeded?: number
    totalWidthNeeded?: number;
    totalHeightNeeded?: number;
    itsCompact: boolean,
    biggestIngredientSize : number;
    RequirementMap?: RequirementMap;

}
export type ItemProps = {
    item: GeneratorItem;
    onChange: (item: { id: string; crop: string; amount: number; priority: number }) => void;
    onDelete: () => void;
};

export type GeneratorProps = {
    items: GeneratorItem[];
    onItemsChange: (items: GeneratorItem[]) => void;
    generateTrigger?: boolean;
    setGenerateTrigger?: React.Dispatch<React.SetStateAction<boolean>>;
};




export interface MutationCandidate {
    baseGrid: string[];
    row: number;
    col: number;
}

export interface PlacedGeneratorItem{
        crop: string;
        positions: number[];
        type: "output" | "intermediate";
        instanceId: string;
        ingredients: RequirementMap[] | null;
}

export interface PlacedGeneratorItems{
    crop: string;
    entries: PlacedGeneratorItem[];
}

// RULES
export type GeneratorConfig = {
    // Layout
    lazyLayout: boolean;        // minimize placement complexity
    attemptLink: boolean;       // shared ingredients
    costWise: boolean;          // expensive ingredients pulled toward center

    // Placement geometry
    targetDirection: "centroid" | "down-right";
    clusterByPriority: boolean; // keep consecutive priority-id items spatially near each other
    fillOrder: "row-major" | "column-major" | "random";

    // Conflicts
    collisionPolicy: "displace" | "reroll" | "backtrack";
    retryBudget: number;        // max attempts before forcing a placement

    // Value/weighting (feeds costWise)
    frequencyWeight: boolean;   // factor in how many recipes use an ingredient
    valuePriority: "cost" | "frequency" | "blend";

    // Readability
    spacingMin: number;         // min gap between unrelated recipe clusters
    densityCap: number;         // max % of grid allowed to fill

    // Variance
    seedVariance: boolean;
};

export const defaultGeneratorConfig: GeneratorConfig = {
    lazyLayout: false,
    attemptLink: true,
    costWise: false,
    targetDirection: "centroid",
    clusterByPriority: false,
    fillOrder: "row-major",
    collisionPolicy: "displace",
    retryBudget: 50,
    frequencyWeight: false,
    valuePriority: "cost",
    spacingMin: 1,
    densityCap: 0.8,
    seedVariance: true,
};