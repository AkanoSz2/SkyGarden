import { useState } from "react";
import type { TableGreenhouseRow } from "../shared/types";
import { formatCropName, RarityColors, type Rarity } from "../shared/CropData";

type RatesPanelProps = {
    greenhouseRows: TableGreenhouseRow[];
    farmingFortune: number;
    cropFortune: Record<string, number>,
    tooltipData: Record<string, { label: string; value: string; color: string }[]>;
    overbloomData: Record<string, { label: string; value: string; color: string }[]>;
    chipData: Record<string, { label: string; value: string; color: string }[]>;
};

type Column = {
    id: string;
    name: string;
    align?: "left" | "right";
};

type Row = {
    id: string;
    name: string;
    fields: string[];
};

type TableSchema = {
    id: string;
    category: string;
    headers: Column[];
    rows: Row[];
};

type ExtraStat = {
    label: string;
    value: string;
    color: string;
};

type ProfitCostItem = {
    label: string;
    cropId: string;
    value: number;
};

type ProfitDropItem = {
    label: string;
    cropId: string;
    value: number;
    positive?: boolean;
};

type CollectionItem = {
    label: string;
    cropId: string;
    value: number;
};

type ExtraConfig = {
    tag: string;
    tagColor: string;
    tagBg: string;
    borderColor: string;
    description: string;
    stats: ExtraStat[];
    contribution: string;
    contributionColor: string;
    profitBreakdown?: {
        costs: ProfitCostItem[];
        drops: ProfitDropItem[];
    };
    collectionGains?: CollectionItem[];
    sowdustTotal?: number;
};

type SubPanelFactor = {
    label: string;
    value: string;
    color: string;
};

type SubPanelConfig = {
    note: string;
    factors: SubPanelFactor[];
    extras: ExtraConfig[];
    totalLabel: string;
    totalValue: string;
};



const SUBPANEL_CONFIG: SubPanelConfig = {
    note: "Dunno, should prob add some info about the data here",
    factors: [
        { label: "Farming Fortune", value: "3600", color: "#60a5fa" },
        { label: "Crops placed", value: "27", color: "#60a5fa" },
        { label: "Crop Effect", value: "+30%", color: "#4ade80" },
        { label: "Unique crop bonus", value: "+12%", color: "#4ade80" },
    ],
    extras: [
        {
            tag: "Collection",
            tagColor: "#fc84fa",
            tagBg: "#2d1a40",
            borderColor: "#2d1a40",
            description: "Total collection gain",
            stats: [],
            contribution: "620 crops",
            contributionColor: "#c084fc",
            collectionGains: [
                { label: "Brown Mushroom", cropId: "brown_mushroom", value: 123456 },
                { label: "Red Mushroom", cropId: "red_mushroom", value: 123456 },
                { label: "Pumpkin", cropId: "pumpkin", value: 123456 },
            ],
        },
        {
            tag: "Profit",
            tagColor: "#fff",
            tagBg: "#f6a80d",
            borderColor: "#1e3a5b",
            description: "Expected Profit",
            stats: [],
            contribution: "~320",
            contributionColor: "#60a5fa",
            profitBreakdown: {
                costs: [
                    { label: "Zombud x4", cropId: "zombud", value: 1200 },
                    { label: "Puffercloud x4", cropId: "puffercloud", value: 800 },
                ],
                drops: [
                    { label: "Brown Mushroom", cropId: "brown_mushroom", value: 12345 },
                    { label: "Red Mushroom", cropId: "red_mushroom", value: 12345 },
                    { label: "Pumpkin", cropId: "pumpkin", value: 12345 },
                    { label: "Devourer x16", cropId: "devourer", value: 1234567, positive: true },
                ],
            },
        },
        {
            tag: "Sowdust",
            tagColor: "#C8E6C9",
            tagBg: "#2E7D32",
            borderColor: "#1e3a5b",
            description: "Estimated Sowdust Gain",
            stats: [],
            contribution: "~320",
            contributionColor: "#60a5fa",
            sowdustTotal: 4800,
        },
    ],
    totalLabel: "This crop brings a total of",
    totalValue: "7,600 Pumpkin",
};

function fortuneDropsFormula(fortune: number, base: number) {
    const cropYield = 1.86;
    const chipYield = 1.66
    const totalFortune = (1 + fortune / 100);

    return (cropYield * chipYield * totalFortune * base)
}


function ItemRow({ cropId, label, value, valueColor }: { cropId: string; label: string; value: number; valueColor: string }) {
    return (
        <div
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
            <div style={{ display: "flex", alignItems: "center", gap: "7px", color: "#94a3b8", minWidth: 0 }}>
                <img
                    src={`/greenhouse/crops/${cropId}.png`}
                    alt={label}
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
                    {label}
                </span>
            </div>
            <span style={{ fontWeight: 500, color: valueColor }}>
                {value.toLocaleString()}
            </span>
        </div>
    );
}

function ColumnLabel({ children }: { children: React.ReactNode }) {
    return (
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
            {children}
        </div>
    );
}

function CollectionGains({ items }: { items: CollectionItem[] }) {
    return (
        <div style={{ padding: "8px 12px" }}>
            <ColumnLabel>Collection gain</ColumnLabel>

            {items.map(item => (
                <ItemRow
                    key={item.label}
                    cropId={item.cropId}
                    label={item.label}
                    value={item.value}
                    valueColor="#cbd5e1"
                />
            ))}
        </div>
    );
}

function SowdustGain({ total }: { total: number }) {
    return (
        <div style={{ padding: "8px 12px" }}>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "10px",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: "7px", color: "#94a3b8", minWidth: 0 }}>
                    <img
                        src="/greenhouse/misc/sowdust.png"
                        alt="Sowdust"
                        style={{
                            width: "20px",
                            height: "20px",
                            borderRadius: "3px",
                            background: "#1e293b",
                            flexShrink: 0,
                        }}
                    />
                    <span>Total sowdust gain</span>
                </div>
                <span
                    style={{
                        background: "#102a1d",
                        border: "1px solid #2E7D32",
                        borderRadius: "2px",
                        padding: "3px 12px",
                        fontSize: "13px",
                        fontWeight: 600,
                        color: "#C8E6C9",
                    }}
                >
                    {total.toLocaleString()}
                </span>
            </div>
        </div>
    );
}

function ProfitBreakdown({ costs, drops }: { costs: ProfitCostItem[]; drops: ProfitDropItem[] }) {
    const totalCost = costs.reduce((s, c) => s + c.value, 0);
    const totalProfit = drops.reduce((s, d) => s + d.value, 0);
    const total = totalProfit - totalCost;
    const isProfit = total >= 0;

    return (
        <div style={{ padding: "8px 12px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 24px" }}>
                <div>
                    <ColumnLabel>Cost</ColumnLabel>

                    {costs.map(c => (
                        <ItemRow key={c.label} cropId={c.cropId} label={c.label} value={c.value} valueColor="#ef4444" />
                    ))}
                </div>

                <div>
                    <ColumnLabel>Output</ColumnLabel>

                    {drops.map(d => (
                        <ItemRow
                            key={d.label}
                            cropId={d.cropId}
                            label={d.label}
                            value={d.value}
                            valueColor={d.positive ? "#4ade80" : "#cbd5e1"}
                        />
                    ))}
                </div>
            </div>

            <div style={{ borderTop: "1px solid #1e2535", margin: "12px 0" }} />

            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "10px",
                }}
            >
                <span style={{ fontSize: "12px", color: "#64748b" }}>
                    {isProfit ? "Net profit" : "Net loss"}
                </span>
                <span
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        background: isProfit ? "#0f2a1a" : "#2a1414",
                        border: `1px solid ${isProfit ? "#166534" : "#7f1d1d"}`,
                        borderRadius: "2px",
                        padding: "3px 12px",
                        fontSize: "13px",
                        fontWeight: 600,
                        color: isProfit ? "#4ade80" : "#ef4444",
                    }}
                >
                    {isProfit ? "+" : ""}{total.toLocaleString()}
                </span>
            </div>
        </div>
    );
}

function ExtraMenu({ config }: { config: ExtraConfig }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div
            style={{
                border: `1px solid ${config.borderColor}`,
                borderRadius: "6px",
                background: "#0e0a1a",
                marginTop: "10px",
                overflow: "hidden",
            }}
        >
            <div
                onClick={() => setIsOpen(v => !v)}
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "6px 10px",
                    borderBottom: isOpen ? `1px solid ${config.borderColor}` : "none",
                    cursor: "pointer",
                }}
            >
                <span
                    style={{
                        background: config.tagBg,
                        borderRadius: "3px",
                        padding: "1px 7px",
                        fontSize: "10px",
                        fontWeight: 700,
                        color: config.tagColor,
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                    }}
                >
                    {config.tag}
                </span>

                <span style={{ fontSize: "11px", color: "#475569", flex: 1 }}>
                    {config.description}
                </span>

                <div
                    style={{
                        color: "#475569",
                        fontSize: "10px",
                        transition: "0.2s",
                        transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                >
                    ▼
                </div>
            </div>

            {isOpen && (
                <>
                    {config.profitBreakdown ? (
                        <ProfitBreakdown
                            costs={config.profitBreakdown.costs}
                            drops={config.profitBreakdown.drops}
                        />
                    ) : config.collectionGains ? (
                        <CollectionGains items={config.collectionGains} />
                    ) : config.sowdustTotal !== undefined ? (
                        <SowdustGain total={config.sowdustTotal} />
                    ) : (
                        <>
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "1fr 1fr",
                                    padding: "8px 12px",
                                    gap: "4px 0",
                                }}
                            >
                                {config.stats.map(({ label, value, color }) => (
                                    <div
                                        key={label}
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            padding: "2px 6px 2px 0",
                                            fontSize: "12px",
                                            borderBottom: "1px solid #1a1228",
                                        }}
                                    >
                                        <span style={{ color: "#475569" }}>{label}</span>
                                        <span style={{ color, fontWeight: 500 }}>{value}</span>
                                    </div>
                                ))}
                            </div>

                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    padding: "6px 12px",
                                    borderTop: `1px solid ${config.borderColor}`,
                                    fontSize: "12px",
                                }}
                            >
                                <span style={{ color: "#475569" }}>Contribution to total</span>
                                <span style={{ color: config.contributionColor, fontWeight: 600 }}>
                                    {config.contribution}
                                </span>
                            </div>
                        </>
                    )}
                </>
            )}
        </div>
    );
}

function SubMenu({
                     config,
                     drops,
                     count,
                 }: {
    config: SubPanelConfig;
    drops: Record<string, number>;
    count: number;
}) {
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
            <div
                style={{
                    background: "#1a1a1a",
                    borderLeft: "3px solid #475569",
                    borderRadius: "0 4px 4px 0",
                    padding: "6px 10px",
                    marginBottom: "14px",
                    fontSize: "12px",
                    color: "#64748b",
                    fontStyle: "italic",
                }}
            >
                {config.note}
            </div>

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
                        Collection factors
                    </div>

                    {config.factors.map(({ label, value, color }) => (
                        <div
                            key={label}
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                padding: "4px 0",
                                fontSize: "12.5px",
                                borderBottom: "1px solid #1e2535",
                            }}
                        >
                            <span style={{ color: "#64748b" }}>{label}</span>
                            <span style={{ color, fontWeight: 500 }}>
                                {label === "Crops placed" ? count : value}
                            </span>
                        </div>
                    ))}
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
                        Drops per crop
                    </div>

                    {Object.entries(drops).length === 0 ? (
                        <div style={{ fontSize: "12px", color: "#475569", padding: "4px 0" }}>
                            No drops data.
                        </div>
                    ) : (
                        Object.entries(drops).map(([cropId, amount]) => (
                            <div
                                key={cropId}
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
                                        src={`/greenhouse/crops/${cropId}.png`}
                                        alt={formatCropName(cropId)}
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
                                        {formatCropName(cropId)}
                                    </span>
                                </div>
                                <span style={{ fontWeight: 500, color: "#cbd5e1" }}>
                                    {amount}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div style={{ borderTop: "1px solid #1e2535", margin: "12px 0" }} />

            <div
                style={{
                    fontSize: "10px",
                    fontWeight: 600,
                    color: "#334155",
                    letterSpacing: "0.07em",
                    textTransform: "uppercase",
                    marginBottom: "2px",
                }}
            >
                Extras
            </div>

            {config.extras.map((extra, i) => (
                <ExtraMenu key={i} config={extra} />
            ))}

        </div>
    );
}

function renderHeader(headers: Column[]) {
    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: `repeat(${headers.length}, 1fr)`,
                padding: "8px 12px",
                fontSize: "12px",
                color: "#94a3b8",
                border: "1px solid #334155",
            }}
        >
            {headers.map(h => (
                <div key={h.id} style={{ textAlign: h.align ?? "right" }}>
                    {h.name}
                </div>
            ))}
        </div>
    );
}

function renderGreenhouseRow(
    row: TableGreenhouseRow,
    columns: Column[],
    openRows: Set<string>,
    setOpenRows: React.Dispatch<React.SetStateAction<Set<string>>>
) {
    const isOpen = openRows.has(row.id);
    const colors = RarityColors[row.rarity as Rarity];

    const dropEntries = Object.entries(row.drops);
    const totalDrops = dropEntries.reduce((sum, [, amt]) => sum + amt, 0);
    const dropSummary = dropEntries
        .map(([cropId, amt]) => `${formatCropName(cropId)}: ${amt}`)
        .join(", ");

    const toggle = () => {
        setOpenRows(prev => {
            const next = new Set(prev);
            if (next.has(row.id)) next.delete(row.id);
            else next.add(row.id);
            return next;
        });
    };

    return (
        <>
            <div
                key={row.id}
                style={{
                    display: "grid",
                    gridTemplateColumns: `repeat(${columns.length}, 1fr)`,
                    padding: "5px 20px",
                    fontSize: "13px",
                    color: "#e2e8f0",
                    alignItems: "center",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <img
                        src={`/greenhouse/crops/${row.id}.png`}
                        style={{
                            width: "28px",
                            height: "28px",
                            borderRadius: "4px",
                            backgroundColor: colors.bg,
                            border: `1px solid ${colors.border}`,
                        }}
                    />
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <div>{formatCropName(row.id)}</div>
                        <div style={{ fontSize: "10px", color: colors.border }}>
                            {row.rarity.charAt(0).toUpperCase() + row.rarity.slice(1)}
                        </div>
                    </div>
                    <div
                        onClick={toggle}
                        style={{
                            cursor: "pointer",
                            color: "#94a3b8",
                            transition: "0.2s",
                            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                        }}
                    >
                        ▼
                    </div>
                </div>

                <div style={{ textAlign: "right" }}>{row.count}</div>
                <div style={{ textAlign: "right", fontSize: "11px", color: "#94a3b8" }}>
                    {/*{dropSummary || "—"}*/}
                    Fungi Cutter
                </div>
                <div style={{ textAlign: "right" }}>
                    {totalDrops > 0 ? (totalDrops * row.count).toLocaleString() : "—"}
                </div>
            </div>

            {isOpen && <SubMenu config={SUBPANEL_CONFIG} drops={row.drops} count={row.count} />}
        </>
    );
}

function renderStaticRow(
    tableId: string,
    row: Row,
    columns: Column[],
    openRows: Set<string>,
    setOpenRows: React.Dispatch<React.SetStateAction<Set<string>>>
) {
    const isOpen = openRows.has(row.id);

    const getImagePath = (tableId: string, rowId: string) =>
        tableId === "pests_1"
            ? `/greenhouse/pests/${rowId}.png`
            : `/greenhouse/crops/${rowId}.png`;

    const toggle = () => {
        setOpenRows(prev => {
            const next = new Set(prev);
            if (next.has(row.id)) next.delete(row.id);
            else next.add(row.id);
            return next;
        });
    };

    const fixedName = row.name.replaceAll("_", " ");

    return (
        <>
            <div
                key={row.id}
                style={{
                    display: "grid",
                    gridTemplateColumns: `repeat(${columns.length}, 1fr)`,
                    padding: "5px 20px",
                    fontSize: "13px",
                    color: "#e2e8f0",
                    alignItems: "center",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <img
                        src={getImagePath(tableId, row.id)}
                        style={{
                            width: "28px",
                            height: "28px",
                            borderRadius: "4px",
                            backgroundColor: "#334155",
                        }}
                    />
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <div>{fixedName}</div>
                        <div style={{ fontSize: "10px", color: "#64748b" }}>
                            Common crop
                        </div>
                    </div>
                    <div
                        onClick={toggle}
                        style={{
                            cursor: "pointer",
                            color: "#94a3b8",
                            transition: "0.2s",
                            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                        }}
                    >
                        ▼
                    </div>
                </div>

                {row.fields.map((v, i) => (
                    <div key={i} style={{ textAlign: "right" }}>
                        {v}
                    </div>
                ))}
            </div>

            {isOpen && <SubMenu config={SUBPANEL_CONFIG} drops={{}} count={0} />}
        </>
    );
}

const STATIC_TABLES: TableSchema[] = [
    {
        id: "farming_1",
        category: "NORMAL FARMING RATES",
        headers: [
            { id: "crop", name: "Crop", align: "left" },
            { id: "reforge", name: "Reforge", align: "right" },
            { id: "duration", name: "Duration", align: "right" },
            { id: "collection", name: "Collection", align: "right" },
        ],
        rows: [
            { id: "wild_rose", name: "Wild_Rose", fields: ["Blessed", "15m", "7,600"] },
        ],
    },
    {
        id: "pests_1",
        category: "PEST RATES",
        headers: [
            { id: "crop", name: "Crop", align: "left" },
            { id: "per_pest", name: "Crops/Pest", align: "right" },
            { id: "duration", name: "Duration", align: "right" },
            { id: "collection", name: "Collection", align: "right" },
        ],
        rows: [
            { id: "praying_mantis", name: "Praying_Mantis", fields: ["257", "20 mins", "90,000"] },
        ],
    },
];

const GREENHOUSE_HEADERS: Column[] = [
    { id: "crop", name: "Crop", align: "left" },
    { id: "amount", name: "Amount", align: "right" },
    { id: "drops", name: "Drops", align: "right" },
    { id: "collection", name: "Collection", align: "right" },
];

export function RatesPanel({ greenhouseRows }: RatesPanelProps) {
    const [openTables, setOpenTables] = useState<Set<string>>(new Set());
    const [openRows, setOpenRows] = useState<Set<string>>(new Set());

    const toggleTable = (id: string) => {
        setOpenTables(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const tableStyle = {
        width: "100%",
        backgroundColor: "#1a2332",
        border: "1px solid #334155",
        overflow: "hidden",
        fontFamily: "Arial, sans-serif",
    };

    const headerStyle = {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "2px 12px",
        cursor: "pointer",
    };

    return (
        <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={tableStyle}>
                <div onClick={() => toggleTable("greenhouse_1")} style={headerStyle}>
                    <div style={{ color: "#e2e8f0", fontSize: "14px" }}>GREENHOUSE RATES</div>
                    <div
                        style={{
                            color: "#94a3b8",
                            transform: openTables.has("greenhouse_1") ? "rotate(180deg)" : "rotate(0deg)",
                            transition: "0.2s",
                        }}
                    >
                        ▼
                    </div>
                </div>

                {openTables.has("greenhouse_1") && (
                    <div>
                        {renderHeader(GREENHOUSE_HEADERS)}
                        {greenhouseRows.length === 0 ? (
                            <div style={{ padding: "12px 20px", fontSize: "13px", color: "#475569" }}>
                                No crops placed in the greenhouse yet.
                            </div>
                        ) : (
                            greenhouseRows.map(row =>
                                renderGreenhouseRow(row, GREENHOUSE_HEADERS, openRows, setOpenRows)
                            )
                        )}
                    </div>
                )}
            </div>

            {STATIC_TABLES.map(table => {
                const isOpen = openTables.has(table.id);
                return (
                    <div key={table.id} style={tableStyle}>
                        <div onClick={() => toggleTable(table.id)} style={headerStyle}>
                            <div style={{ color: "#e2e8f0", fontSize: "14px" }}>{table.category}</div>
                            <div
                                style={{
                                    color: "#94a3b8",
                                    transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                                    transition: "0.2s",
                                }}
                            >
                                ▼
                            </div>
                        </div>

                        {isOpen && (
                            <div>
                                {renderHeader(table.headers)}
                                {table.rows.map(row =>
                                    renderStaticRow(table.id, row, table.headers, openRows, setOpenRows)
                                )}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}