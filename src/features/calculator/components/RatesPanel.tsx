import { useState } from "react";
import {
    formatCropName,
    RarityColors,
    type Rarity,
    CropRarityMap,
    getCrop,
    getMutation
} from "../../shared/scripts/CropData.ts";


import { useGreenhouseDataLayoutContext } from "../../../context/GreenhouseDataLayoutContext.tsx";
import { usePlayerDataContext } from "../../../context/PlayerDataContext.tsx";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import Select from "react-select";
import {getBazaarPrice} from "../../itemPrices";


const GreenhouseCount = 3
const miningFortune = 2000

interface RequirementEntry {
    crop: string;
    count: number;
}

export type TableGreenhouseRow = {
    id: string;
    count: number;
    rarity: string;
    drops: Record<string, number>;
    sowdust: number | 0;
    requirements: Record<string, RequirementEntry>};

type CollectionItem = {
    label: string;
    cropId: string;
    value: number;
};

function changeScale(value: number, fromScale: string, toScale: string): number {
    const ScalesDict: Record<string, number> = {
        "": 1,
        "K": 1_000,
        "M": 1_000_000,
    };

    const fromMultiplier = ScalesDict[fromScale] ?? 1;
    const toMultiplier = ScalesDict[toScale] ?? 1;

    return (value * fromMultiplier) / toMultiplier;
}

function formatScaled(value: number): string {
    const abs = Math.abs(value);

    if (abs >= 1_000_000) {
        return `${changeScale(value, "", "M").toFixed(2)}M`;
    }
    if (abs >= 1_000) {
        return `${changeScale(value, "", "K").toFixed(1)}K`;
    }
    return value.toString();
}


function fortuneDropsFormula(userData: ReturnType<typeof usePlayerDataContext>, crop: string,  base: number, placedCrops: number, cropName?: string): number {
    const gardenCustomization = userData?.gardenCustomization ?? {};
    const {cropEffectYield, uniqueCrops, deskYield} = gardenCustomization;

    let actualYieldValue = 0;
    if (deskYield < 9)  actualYieldValue = 2 * deskYield;
    if( deskYield >= 9) actualYieldValue += 4;


    const tracking = userData.leaderboardData.currrentlyTracking
    const chipLevel = userData.playerData.fortune.stats.chipStats["evergreen"]

    const baseFortune = userData.playerData.fortune.breakthrough["totalBaseFortune"]
    const baseFortuneAndTool = userData.playerData.fortune.breakthrough["cropFortune"][tracking]["finalFortune"]
    const targettedCropFortune = userData.playerData.fortune.breakthrough["cropFortune"][tracking]["actualCropFortune"]

    const tools = userData?.playerData.fortune.stats.items["tools"].items;
    const correctTool = tools?.find(tool => tool.cropName.toLowerCase() === tracking.toLowerCase()) ?? null;

    let fortune = baseFortuneAndTool;

    if( crop.toLowerCase() === tracking.toLowerCase()) fortune = targettedCropFortune;

    let result = (
        (1 + ( 3 * uniqueCrops + actualYieldValue + actualYieldValue  + chipLevel) / 100) *
        (1 + chipLevel / 100) *
        (1 + fortune / 100) *
        base * placedCrops
    )
    if(cropName === "chloronite") result  = base * placedCrops * (miningFortune / 500)

    return Math.trunc(result  * GreenhouseCount)
}


function CropInfoRow({ label, value}: { label: string; value: string}) {
    return (
        <div
            key={label}
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "4px 0",
                fontSize: "12.5px",
                borderBottom: "1px solid #1e2535",
                gap: "10px",
            }}
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "7px",
                    color: "#94a3b8",
                    minWidth: 0,
                }}
            >
                <img
                    src={`/greenhouse/crops/${label}.png`}
                    alt={formatCropName(label)}
                    style={{
                        width: "20px",
                        height: "20px",
                        borderRadius: "3px",
                        background: "#1e293b",
                        flexShrink: 0,
                    }}
                />
                <span
                    style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                    }}
                >
                    {formatCropName(label)}
                </span>
            </div>
            <span style={{fontWeight: 500, color: "#cbd5e1"}}>
            {value}
            </span>
        </div>
    )
}

function CropInfo({
                      toolName,
                      itemName,
                      rarity,
                      count,
                  }: {
    toolName: string;
    itemName: string;
    rarity: string;
    count: number;
}) {
    return (
        <div
            className="d-flex align-items-center gap-3 rounded-3"
            style={{
                border: "1px solid #2d3d52",
                borderRadius: "6px",
                background: "#111b29",
                padding: "14px 18px",
                margin: "0 12px 10px",
                color: "#e2e8f0",
                fontFamily: "system-ui, sans-serif",
            }}
        >
            {/* Icon */}
            <img
                src={`/greenhouse/crops/${itemName}.png`}
                alt={itemName}
                width={36}
                height={36}
                className="flex-shrink-0"
                style={{ objectFit: "contain", imageRendering: "pixelated" }}
                onError={(e) => {
                    e.currentTarget.src = "/greenhouse/crops/dead_plant.png";
                }}
            />

            {/* Name / rarity / tool */}
            <div className="flex-grow-1 min-w-0">
                <div className="d-flex align-items-center gap-2">
                    <span className="fw-semibold text-capitalize text-truncate">
                        {itemName}
                    </span>
                    <span
                        className="badge rounded-pill fw-bold"
                        style={{
                            background: "rgba(242, 153, 74, 0.15)",
                            color: "#f2994a",
                            fontSize: "11px",
                        }}
                    >
                        {rarity.toUpperCase()}
                    </span>
                </div>

                <div className="d-flex align-items-center gap-2 small mt-1" style={{ color: "#8b98a9" }}>
                    <span>Recommended Tool:</span>
                    <span
                        className="badge rounded-pill fw-semibold"
                        style={{
                            background: "#1e2b3d",
                            border: "1px solid #3a4b63",
                            color: "#cbd5e1",
                            fontSize: "12px",
                        }}
                    >
                        {toolName.replace(/_/g, " ").toUpperCase()}
                    </span>
                </div>
            </div>

            {/* Count */}
            <div
                className="d-flex align-items-center justify-content-center rounded-3 flex-shrink-0 fw-semibold"
                style={{
                    width: "50px",
                    height: "40px",
                    background: "#1e2b3d",
                    border: "1px solid #3a4b63",
                    color: "#cbd5e1",
                    fontSize: "16px",
                }}
            >
                {count}
            </div>
        </div>
    );
}

function CollectionGain({items, placedMutations, cropName}: { items: CollectionItem[], placedMutations: number, cropName?: string }) {

    const userData = usePlayerDataContext();

    return (
        <div
            style={{
                border: "1px solid #2d3d52",
                borderRadius: "6px",
                background: "#111b29",
                padding: "14px 18px",
                margin: "0 12px 10px",
                color: "#e2e8f0",
                fontFamily: "system-ui, sans-serif",
            }}
        >
            <SectionPill title={"Collection"} description={"Total collection gain"} color={"#ae1873"}/>
            {items.length === 0 ? (
                <div style={{fontSize: "12px", color: "#475569", padding: "4px 0"}}>
                    No collection gain data.
                </div>
            ) : (
                Object.entries(items).map(([cropId, amount]) => {
                    const rawValue = fortuneDropsFormula(userData, cropId, amount, placedMutations, cropName);
                    return (
                        <CropInfoRow
                            key={cropId}
                            label={cropId}
                            value={formatScaled(rawValue)}
                        />
                    );
                })
            )}
        </div>
    )
}

function SowdustGain({sowdustPer, amount }: {sowdustPer: number, amount: number }) {
    return (
        <div
            style={{
                border: "1px solid #2d3d52",
                borderRadius: "6px",
                background: "#111b29",
                padding: "14px 18px",
                margin: "0 12px 10px",
                color: "#e2e8f0",
                fontFamily: "system-ui, sans-serif",
            }}
        >

            <SectionPill title={"Sowdust"} description={"Total Sowdust gained"} color={"#15702e"}/>
            <div style={{ fontSize: "12px", color: "#cbd5e1", padding: "4px 0" }}>
                <CropInfoRow label={"dead_plant"} value={sowdustPer * amount}/>
            </div>
        </div>
    )
}

function ProfitGain({
                        cropName,
                        drops,
                        requirements,
                        count,
                    }: {
    cropName: string;
    drops: Record<string, number>;
    requirements: Record<string, number>;
    count: number;
}) {
    const requirementEntries = Object.entries(
        requirements as unknown as Record<string, { crop: string; count: number }>
    );
    const dropEntries = Object.entries(drops);

    const totalCost = requirementEntries.reduce((sum, [, { count }]) => sum + count, 0);
    const totalOutput = dropEntries.reduce((sum, [, amount]) => sum + amount, 0);
    const netProfit = totalOutput - totalCost;
    const isProfit = netProfit >= 0;
    return (
        <div
            style={{
                border: "1px solid #2d3d52",
                borderRadius: "6px",
                background: "#111b29",
                padding: "14px 18px",
                margin: "0 12px 10px",
                color: "#e2e8f0",
                fontFamily: "system-ui, sans-serif",
            }}
        >
            <SectionPill title={"Profit"} description={"Total profit gain"} color={"#15702e"} />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 24px" }}>
                <div>
                    <div
                        style={{
                            fontSize: "10px",
                            fontWeight: 600,
                            color: "#334155",
                            letterSpacing: "0.07em",
                            textTransform: "uppercase",
                            marginBottom: "6px",
                        }}
                    >
                        Cost
                    </div>

                    {requirementEntries.length === 0 ? (
                        CropRarityMap["crops"].includes(cropName) ? (
                            <div style={{ fontSize: "12px", color: "#475569", padding: "4px 0" }}>
                                <CropInfoRow key={cropName} label={cropName} value={count.toString()} />
                            </div>
                        ) : (
                            <div style={{ fontSize: "12px", color: "#475569", padding: "4px 0" }}>
                                No requirements data.
                            </div>
                        )
                    ) : (
                        requirementEntries.map(([key, { crop, count }]) => (
                            <CropInfoRow key={key} label={crop} value={count.toString()} />
                        ))
                    )}
                </div>
                <div>
                    <div
                        style={{
                            fontSize: "10px",
                            fontWeight: 600,
                            color: "#334155",
                            letterSpacing: "0.07em",
                            textTransform: "uppercase",
                            marginBottom: "6px",
                        }}
                    >
                        Crops
                    </div>

                    {dropEntries.length === 0 ? (
                        <div style={{ fontSize: "12px", color: "#475569", padding: "4px 0" }}>
                            No drops data.
                        </div>
                    ) : (
                        dropEntries.map(([cropId, amount]) => (
                            <CropInfoRow key={cropId} label={cropId} value={amount.toString()} />
                        ))
                    )}
                </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 24px", marginTop: "10px" }}>
                <div>
                    <div
                        style={{
                            fontSize: "10px",
                            fontWeight: 600,
                            color: "#334155",
                            letterSpacing: "0.07em",
                            textTransform: "uppercase",
                            marginBottom: "6px",
                        }}
                    >
                        Mutation
                    </div>
                    <CropInfoRow key={cropName} label={cropName} value={count.toString()} />
                </div>
                <div>
                    <div
                        style={{
                            fontSize: "10px",
                            fontWeight: 600,
                            color: "#334155",
                            letterSpacing: "0.07em",
                            textTransform: "uppercase",
                            marginBottom: "6px",
                        }}
                    >
                        RNGS
                    </div>
                    <CropInfoRow key={"fermento"} label={"fermento"} value={count.toString()} />
                </div>
            </div>

            <div className="border-top" style={{ borderColor: "#1e2535 !important", margin: "14px 0 10px" }} />

            <div className="d-flex align-items-center justify-content-between">
                <span style={{ fontSize: "12px", color: "#64748b" }}>
                    {isProfit ? "Net profit" : "Net loss"}
                </span>
                <span
                    className="border rounded-1 px-2 py-1 fw-semibold"
                    style={{
                        backgroundColor: isProfit ? "#0f2a1a" : "#2a1414",
                        borderColor: isProfit ? "#166534" : "#7f1d1d",
                        color: isProfit ? "#4ade80" : "#ef4444",
                        fontSize: "13px",
                    }}
                >
                    {isProfit ? "+" : ""}{netProfit.toLocaleString()}
                </span>
            </div>
        </div>
    );
}

function SectionPill({title, description, color}: { title: string; description: string, color: string }) {
    return (
        <>
            <div
                className="border rounded-1 px-2 py-1 text-bold text-white text-uppercase mb-2"
                style={{
                    width: "fit-content",
                    backgroundColor: color,
                    fontWeight: 600,
                    fontSize: "12px",
                }}
            >
                {title}
            </div>
            <div
                style={{
                    fontSize: "10px",
                    fontWeight: 600,
                    color: "#334155",
                    letterSpacing: "0.07em",
                    textTransform: "uppercase",
                    marginBottom: "6px",
                }}
            >
                {description}
            </div>
        </>
    )
}

function GreenhouseTableRow({
                                row,
                                isSelected,
                                onSelect,
                            }: {
    row: TableGreenhouseRow;
    isSelected: boolean;
    onSelect: (id: string) => void;
}) {
    const colors = RarityColors[row.rarity as Rarity];

    return (
        <div
            className="border rounded hover-effect"
            style={{
                aspectRatio: "1 / 1",
                display: "flex",
                flexDirection: "column",
                backgroundSize: "cover",
                boxShadow: isSelected
                    ? `0 0 10px ${colors.border}, 0 0 18px ${colors.border}55`
                    : null,
                overflow: "hidden",
            }}
            onClick={() => onSelect(row.id)}
        >
            <div
                style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "4px",
                    minHeight: 0,
                }}
            >
                <img
                    src={`/greenhouse/crops/${row.id}.png`}
                    alt={row.id}
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        imageRendering: "pixelated",
                    }}
                    onError={(e) => {
                        e.currentTarget.src = "/greenhouse/crops/dead_plant.png";
                    }}
                />
            </div>
        </div>
    );
}

function RatesCropsTable({
                             rows,
                             selectedId,
                             onSelectRow,
                         }: {
    rows: TableGreenhouseRow[];
    selectedId: string | null;
    onSelectRow: (id: string) => void;
}) {
    return (
        <div
            style={{
                height: "35%",
                backgroundColor: "#0a0f1a",
                border: "1px solid #1e2535",
                display: "flex",
                flexDirection: "column",
            }}
            className="w-100 border border-gray-700 rounded-lg"
        >
            <SectionHeader title={"crops"} description={"Select a crop to view its rates"} />

            {rows.length === 0 ? (
                <div
                    style={{
                        padding: "16px",
                        textAlign: "center",
                        color: "#475569",
                        fontSize: "13px",
                    }}
                >
                    No crops placed  yet.
                </div>
            ) : (
                <>
                    <div
                        style={{
                            padding: "0 16px 16px",
                            overflowY: rows.length < 10 ? "hidden" : "auto",
                            flex: 1,
                            minHeight: 0,
                            maxHeight: "60px",
                        }}
                    >
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fill, minmax(50px, 1fr))",
                                gap: "8px",
                            }}
                        >
                            {rows.map(row => (
                                <GreenhouseTableRow
                                    key={row.id}
                                    row={row}
                                    isSelected={selectedId === row.id}
                                    onSelect={onSelectRow}
                                />
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}


function PillTabs({
                      tabs,
                      activeKey,
                      onChange,
                  }: {
    tabs: { key: string; title: string }[];
    activeKey: string;
    onChange: (key: string) => void;
}) {
    return (
        <div
            style={{
                display: "inline-flex",
                backgroundColor: "#0a0f1a",
                border: "1px solid #1e2535",
                borderRadius: "8px",
                padding: "3px",
                gap: "2px",
            }}
        >
            {tabs.map((tab) => {
                const isActive = tab.key === activeKey;
                return (
                    <button
                        key={tab.key}
                        onClick={() => onChange(tab.key)}
                        style={{
                            border: "none",
                            outline: "none",
                            cursor: "pointer",
                            padding: "6px 16px",
                            fontSize: "12.5px",
                            fontWeight: 600,
                            borderRadius: "6px",
                            backgroundColor: isActive ? "#1e2535" : "transparent",
                            color: isActive ? "#e2e8f0" : "#64748b",
                            transition: "background-color 0.15s ease, color 0.15s ease",
                        }}
                    >
                        {tab.title}
                    </button>
                );
            })}
        </div>
    );
}

function RatesCropBreakdown({ row }: { row: TableGreenhouseRow | null }) {
    const tabData = [
        { key: "day", title: "Per day" },
        { key: "total", title: "Total" },
    ];
    const [activeTab, setActiveTab] = useState("day");

    const userData = usePlayerDataContext();
    const tracking = userData?.leaderboardData.currrentlyTracking ?? null;
    const tools = userData?.playerData.fortune.stats.items["tools"].items;
    const correctTool = tools?.find(tool => tool.cropName.toLowerCase() === tracking.toLowerCase()) ?? null;

    return (
        <div
            style={{ height: "100%", backgroundColor: "#010f1a" }}
            className="w-100 border border-gray-700 rounded-lg p-4 overflow-y-auto"
        >
            {row ? (
                <>
                    <div className="d-flex justify-content-end mb-3">
                        <PillTabs tabs={tabData} activeKey={activeTab} onChange={setActiveTab} />
                    </div>
                    <CropInfo  itemName={row.id} rarity={row.rarity} toolName={correctTool.id} count={row.count}  />
                    <SowdustGain sowdustPer={row.sowdust} amount={row.count} />
                    <CollectionGain items={row.drops} placedMutations={row.count} cropName={row.id} />
                    <ProfitGain cropName={row.id} drops={row.drops} requirements={row.requirements} count={row.count} />
                </>
            ) : (
                <div style={{ padding: "40px 16px", textAlign: "center", color: "#475569", fontSize: "13px" }}>
                    Select a crop to view its rates
            </div>
            )}
        </div>
    );
}

export function RatesPanel() {
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const greenhouseTotals = useGreenhouseDataLayoutContext();
    let greenhouseRows: TableGreenhouseRow[] = Object.values(greenhouseTotals).map(data => ({
        id: data.id,
        count: data.count,
        rarity: data.rarity,
        drops: data.drops,
        requirements: data.requirements,
    }));

    const selectedRow = greenhouseRows.find(r => r.id === selectedId) ?? null;



    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                height: "600px",
                width: "100%",
            }}
        >
            <RatesCropsTable
                rows={greenhouseRows}
                selectedId={selectedId}
                onSelectRow={setSelectedId}
            />

            <RatesCropBreakdown row={selectedRow} />
        </div>
    );
}

function CropDropdown({ selectedCrop, onSelectCrop }: {
    selectedCrop: string | null;
    onSelectCrop: (crop: string) => void;
}) {
    const dropdownOptions = [];
    Object.keys(CropRarityMap["crops"]).forEach(entry => {
        const cropEntry = CropRarityMap["crops"][entry];
        if (cropEntry === "dead_plant" || cropEntry === "fire" || cropEntry === "fermento") return;
        dropdownOptions.push(cropEntry);
    });

    const options = dropdownOptions.map(crop => ({
        value: crop,
        label: formatCropName(crop),
    }));

    return (
        <Select
            options={options}
            value={options.find(option => option.value === selectedCrop) ?? null}
            onChange={(selectedOption) => {
                if (selectedOption) {
                    onSelectCrop(selectedOption.value);
                }
            }}
            formatOptionLabel={(option) => (
                <div className="d-flex align-items-center">
                    <img
                        src={`/greenhouse/crops/${option.value}.png`}
                        alt={option.label}
                        width={20}
                        height={20}
                        style={{ marginRight: 8 }}
                    />
                    <span>{option.label}</span>
                </div>
            )}
            placeholder="Select crops..."
            className="mt-2"
            styles={{
                container: (provided) => ({
                    ...provided,
                    width: "90%",
                    flexShrink: 0,
                    overscrollBehavior: "none",
                }),
                control: (provided) => ({
                    ...provided,
                    backgroundColor: "#0f172a",
                    borderColor: "#2a3044",
                    color: "#e2e6f0",
                    minHeight: "38px",
                }),
                singleValue: (provided) => ({
                    ...provided,
                    color: "#e2e6f0",
                }),
                menu: (provided) => ({
                    ...provided,
                    backgroundColor: "#0f172a",
                    borderColor: "#2a3044",
                }),
                option: (provided, state) => ({
                    ...provided,
                    backgroundColor: state.isSelected
                        ? "#3b82f6"
                        : state.isFocused
                            ? "#1e293b"
                            : "#0f172a",
                    color: state.isSelected ? "#ffffff" : "#e2e6f0",
                }),
            }}
        />
    );
}


function CropFilterItem({
                            name,
                            drops,
                            requirements
}: {
    name: string;
    drops: number
    requirements?: string
}) {

    return (
        <div
            className="d-flex align-items-center gap-2 p-2 mx-2 mb-1 rounded-3"
            style={{ cursor: "pointer", transition: "background-color 0.15s, border-color 0.15s" }}
        >
            <img
                src={`/greenhouse/crops/${name}.png`}
                alt={formatCropName(name)}
                className="rounded-2 flex-shrink-0"
                style={{
                    width: "34px",
                    height: "34px",
                    backgroundColor: "#1e293b",
                }}
            />
            <div className="d-flex flex-column flex-grow-1 min-w-0">
                <span className="text-light fw-semibold text-truncate" style={{fontSize: "15.5px"}}>
                    {formatCropName(name)}
                </span>
                <span className="text-light" style={{fontSize: "12px"}}>
                    {requirements}
                </span>
            </div>
            <div>

            </div>
            <span className="text-secondary" style={{fontSize: "14px"}}>
                {drops}
            </span>
        </div>
    );
}

function FilteredCropsTable({ selectedCrop }: { selectedCrop: string | null }) {
    let cropsList = [];

    if (selectedCrop) {
        for (const key in CropRarityMap) {
            for (const entry in CropRarityMap[key]) {
                const cropEntry = CropRarityMap[key][entry];

                if (cropEntry === "dead_plant" || cropEntry === "fire" || cropEntry === "fermento") continue;

                const source = key === "crops" ? getCrop(cropEntry) : getMutation(cropEntry);
                const cropDrops = source?.drops ?? {};
                const requirementsRaw = source?.requirements ?? {};
                let requirementsText = "";
                for(const entry in requirementsRaw) {
                    const requirement = requirementsRaw[entry];
                    const cropName = requirement.crop.replace(/_/g, " ");
                    const capitalized = cropName.charAt(0).toUpperCase() + cropName.slice(1);

                    requirementsText += `${requirement.count}x ${capitalized} `;                }

                if (selectedCrop in cropDrops) {
                    cropsList.push({
                        id: cropEntry,
                        drops: cropDrops[selectedCrop],
                        requirements: source?.requirements ? requirementsText : cropEntry.replace(/_/g, " "),
                    });
                }
            }
        }

        cropsList.sort((a, b) => b.drops - a.drops);
    }

    return (
        <div
            style={{
                height: "100%",
                width: "100%",
                backgroundColor: "#0a0f1a",
                border: "1px solid #1e2535",
                overflowY: "auto",
            }}
            className="border border-gray-700 rounded-lg"
        >
            {!selectedCrop ? (
                <div style={{ padding: "40px 16px", textAlign: "center", color: "#475569", fontSize: "13px" }}>
                    Select a crop to filter the crops table
                </div>
            ) : (
                <>
                    <div
                        style={{
                            padding: "0 16px 8px",
                            fontSize: "11px",
                            fontWeight: 600,
                            color: "#475569",
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                            marginTop: "6px",
                        }}
                    >
                        Crops that drop {formatCropName(selectedCrop)}
                    </div>
                    {cropsList.length === 0 ? (
                        <div style={{ padding: "40px 16px", textAlign: "center", color: "#475569", fontSize: "13px" }}>
                            No crops placed that drop {formatCropName(selectedCrop)}.
                        </div>
                    ) : (
                        cropsList.map(crop => (
                            <CropFilterItem key={crop.id} name={crop.id} drops={crop.drops} requirements={crop.requirements} />
                        ))
                    )}
                </>
            )}
        </div>
    );
}

export function CropFilterHelper() {
    const [selectedCrop, setSelectedCrop] = useState<string | null>(null);

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                height: "600px",
                width: "100%",
            }}
        >
            <div
                style={{
                    height: "100%",
                    backgroundColor: "#0a0f1a",
                    border: "1px solid #1e2535",
                    display: "flex",
                    flexDirection: "column",
                    minHeight: 0,
                }}
                className="border border-gray-700 rounded-3 w-100"
            >

                <SectionHeader title={"FILTER"} description={"Choose a crop to see what mutations are able to drop it"}/>

                <div
                    className="d-flex flex-column align-items-center justify-content-center gap-2"
                    style={{ flexShrink: 0 }}
                >
                    <CropDropdown
                        selectedCrop={selectedCrop}
                        onSelectCrop={(crop) => setSelectedCrop(crop)}
                    />
                </div>

                <div
                    className="d-flex flex-column align-items-center justify-content-center gap-2 mt-3"
                    style={{ flex: 1, minHeight: 0, width: "100%" }}
                >
                    <FilteredCropsTable selectedCrop={selectedCrop} />
                </div>
            </div>
        </div>
    );
}

export function TotalCollection(){
    const [selectedCrop, setSelectedCrop] = useState<string | null>(null);

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                height: "600px",
                width: "100%",
            }}
        >
            <div
                style={{height: "100%", backgroundColor: "#0a0f1a", border: "1px solid #1e2535"}}
                className="border border-gray-700 overflow-y-auto w-100"
            >
                <SectionHeader title={"collection"} description={"total collection gain"}/>
                <div className="d-flex flex-column align-items-center justify-content-center gap-2">
                    <CropDropdown
                        selectedCrop={selectedCrop}
                        onSelectCrop={(crop) => setSelectedCrop(crop)}
                    />
                </div>
                <div
                    className="d-flex flex-column align-items-center justify-content-center gap-2 mt-3"
                    style={{flex: 1, minHeight: 0, width: "100%"}}
                >
                    <FilteredTotalCollection selectedCrop={selectedCrop}/>
                </div>
            </div>
        </div>
    )
}

function FilteredTotalCollection({ selectedCrop }: { selectedCrop: string | null }) {
    let cropsList = [];

    const greenhouseTotals = useGreenhouseDataLayoutContext();
    const userData = usePlayerDataContext();
    let greenhouseRows: TableGreenhouseRow[] = Object.values(greenhouseTotals).map(data => ({
        id: data.id,
        count: data.count,
        rarity: data.rarity,
        drops: data.drops,
        requirements: data.requirements,
    }));

    if (selectedCrop) {
        for (const key in greenhouseRows) {
            const row = greenhouseRows[key];
            const cropDrops = row.drops;
            if (selectedCrop in cropDrops) {
                cropsList.push({
                    id: row.id,
                    drops: cropDrops[selectedCrop],
                });
            }
        }

        cropsList.sort((a, b) => b.drops - a.drops);
    }

    const cropsWithValue = cropsList.map(crop => ({
        ...crop,
        value: fortuneDropsFormula(
            userData,
            crop.id,
            crop.drops,
            greenhouseRows.find(r => r.id === crop.id)?.count || 0
        ),
    }));

    const total = cropsWithValue.reduce((sum, c) => sum + c.value, 0);

    return (
        <div
            style={{
                height: "100%",
                width: "100%",
                backgroundColor: "#0a0f1a",
                borderTop: "1px solid #1e2535",
                overflowY: "auto",
            }}
        >
            {!selectedCrop ? (
                <div style={{ padding: "40px 16px", textAlign: "center", color: "#475569", fontSize: "13px" }}>
                    Select a crop to check the total collection gained
                </div>
            ) : (
                <>
                    <div
                        style={{
                            padding: "0 16px 8px",
                            fontSize: "11px",
                            fontWeight: 600,
                            color: "#475569",
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                            marginTop: "6px",
                        }}
                    >
                        Crops that drop {formatCropName(selectedCrop)}
                    </div>
                    {cropsWithValue.length === 0 ? (
                        <div style={{ padding: "40px 16px", textAlign: "center", color: "#475569", fontSize: "13px" }}>
                            No crops found that drop {formatCropName(selectedCrop)}.
                        </div>
                    ) : (
                        <>
                            {cropsWithValue.map(crop => (
                                <CropFilterItem
                                    key={crop.id}
                                    name={crop.id}
                                    drops={crop.value}
                                />
                            ))}

                            <div
                                className="border-top"
                                style={{ borderColor: "#1e2535 !important", margin: "10px 16px" }}
                            />

                            <div
                                className="d-flex align-items-center justify-content-between"
                                style={{ padding: "4px 16px 16px" }}
                            >
                                <span style={{ fontSize: "12px", color: "#64748b" }}>
                                    Total {formatCropName(selectedCrop)}
                                </span>
                                <span
                                    className="border rounded-1 px-2 py-1 fw-semibold"
                                    style={{
                                        backgroundColor: "#0f2a1a",
                                        borderColor: "#166534",
                                        color: "#4ade80",
                                        fontSize: "13px",
                                    }}
                                >
                                    {formatScaled(total)}
                                </span>
                            </div>
                        </>
                    )}
                </>
            )}
        </div>
    );
}


function SectionHeader({ title, description }: { title: string, description: string }) {
    return (
        <div style={{padding: "16px 16px 12px"}} className="border-bottom-1 border border-white mb-3">
            <div style={{fontSize: "13px", fontWeight: 700, color: "#e2e8f0", letterSpacing: "0.05em", textTransform: "uppercase"}}>
                {title}
            </div>
            <div style={{fontSize: "12px", color: "#64748b", marginTop: "2px", textTransform: "capitalize"}}>
                {description}
            </div>
        </div>
    )
}