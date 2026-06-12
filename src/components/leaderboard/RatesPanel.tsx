import { useState } from "react";

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

type CropDrop = {
    id: string;
    name: string;
    drops: number;
};

type ExtraStat = {
    label: string;
    value: string;
    color: string;
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

const STATIC_DROPS: CropDrop[] = [
    { id: "pumpkin", name: "Pumpkin", drops: 100 },
    { id: "wheat", name: "Wheat", drops: 50 },
    { id: "wild_rose", name: "Wild Rose", drops: 72 },
    { id: "dead_plant", name: "Dead Plant", drops: 38 },
];

const SUBPANEL_CONFIG: SubPanelConfig = {
    note: "Dunno, should prob add some info about the data here",
    factors: [
        { label: "Farming Fortune", value: "850", color: "#60a5fa" },
        { label: "Crops placed", value: "27", color: "#60a5fa" },
        { label: "Cycles (drops)", value: "300", color: "#60a5fa" },
        { label: "Crop Effect", value: "+30%", color: "#4ade80" },
        { label: "Unique crop bonus", value: "+12%", color: "#4ade80" },
    ],
    extras: [
        {
            tag: "Fever",
            tagColor: "#c084fc",
            tagBg: "#2d1a40",
            borderColor: "#2d1a40",
            description: "Figure it out",
            stats: [
                { label: "Drop amount", value: "300", color: "#c084fc" },
                { label: "FF applies", value: "No", color: "#ef4444" },
                { label: "Trigger", value: "Per session", color: "#c084fc" },
                { label: "Stackable", value: "No", color: "#ef4444" },
            ],
            contribution: "620 crops",
            contributionColor: "#c084fc",
        },
        {
            tag: "Flasks",
            tagColor: "#60a5fa",
            tagBg: "#1e3a5b",
            borderColor: "#1e3a5b",
            description: "20% spawn chance across TBA spawns",
            stats: [
                { label: "Spawn chance", value: "20%", color: "#60a5fa" },
                { label: "Total spawns", value: "48", color: "#60a5fa" },
                { label: "Expected spawns", value: "~9.6", color: "#60a5fa" },
                { label: "Drop amount", value: "900", color: "#60a5fa" },
            ],
            contribution: "~320",
            contributionColor: "#60a5fa",
        },
        {
            tag: "Between Cycles",
            tagColor: "#fbbf24",
            tagBg: "#3a2a00",
            borderColor: "#3a2a00",
            description: "20% spawn chance across TBA spawns",
            stats: [
                { label: "Spawn chance", value: "20%", color: "#fbbf24" },
                { label: "Total spawns", value: "120", color: "#fbbf24" },
                { label: "Expected spawns", value: "~24", color: "#fbbf24" },
                { label: "Drop amount", value: "20", color: "#fbbf24" },
            ],
            contribution: "~900",
            contributionColor: "#fbbf24",
        },
    ],
    totalLabel: "This crop brings a total of",
    totalValue: "7,600 Pumpkin",
};

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
        </div>
    );
}

function SubMenu({ config }: { config: SubPanelConfig }) {
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
                            <span style={{ color, fontWeight: 500 }}>{value}</span>
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

                    {STATIC_DROPS.map(crop => (
                        <div
                            key={crop.id}
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
                                    src={`/greenhouse/crops/${crop.id}.png`}
                                    alt={crop.name}
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
                                    {crop.name}
                                </span>
                            </div>
                            <span style={{ fontWeight: 500, color: "#cbd5e1" }}>
                                {crop.drops}
                            </span>
                        </div>
                    ))}
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

            <div style={{ borderTop: "1px solid #1e2535", margin: "12px 0" }} />

            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                <span style={{ fontSize: "12px", color: "#64748b" }}>{config.totalLabel}</span>
                <span
                    style={{
                        background: "#0f2a1a",
                        border: "1px solid #166534",
                        borderRadius: "20px",
                        padding: "3px 12px",
                        fontSize: "13px",
                        fontWeight: 600,
                        color: "#4ade80",
                    }}
                >
                    {config.totalValue}
                </span>
            </div>
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

function renderRow(
    tableId: string,
    row: Row,
    columns: Column[],
    openRows: Set<string>,
    setOpenRows: React.Dispatch<React.SetStateAction<Set<string>>>
) {
    const isOpen = openRows.has(row.id);

    function getImagePath(tableId: string, rowId: string) {
        if (tableId === "pests_1") {
            return `/greenhouse/pests/${rowId}.png`;
        }

        return `/greenhouse/crops/${rowId}.png`;
    }


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

            {isOpen && <SubMenu config={SUBPANEL_CONFIG} />}
        </>
    );
}

const TABLES: TableSchema[] = [
    {
        id: "greenhouse_1",
        category: "GREENHOUSE RATES",
        headers: [
            { id: "crop", name: "Crop", align: "left" },
            { id: "amount", name: "Amount", align: "right" },
            { id: "drops", name: "Drops", align: "right" },
            { id: "collection", name: "Collection", align: "right" },
        ],
        rows: [
            { id: "dead_plant", name: "Dead_Plant", fields: ["27", "300", "7,600"] },
            { id: "wild_rose", name: "Wild_Rose", fields: ["42", "300", "7,600"] },
            { id: "devourer", name: "Devourer", fields: ["13", "300", "7,600"] },
        ],
    },
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

export function RatesPanel() {
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

    return (
        <div style={{ display: "flex", flexDirection: "column"}}>
            {TABLES.map(table => {
                const isOpen = openTables.has(table.id);

                return (
                    <div
                        key={table.id}
                        style={{
                            width: "100%",
                            backgroundColor: "#1a2332",
                            border: "1px solid #334155",
                            overflow: "hidden",
                            fontFamily: "Arial, sans-serif",
                        }}
                    >
                        <div
                            onClick={() => toggleTable(table.id)}
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                padding: "2px 12px",
                                cursor: "pointer",
                            }}
                        >
                            <div style={{ color: "#e2e8f0", fontSize: "14px" }}>
                                {table.category}
                            </div>

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
                                    renderRow(table.id, row, table.headers, openRows, setOpenRows)
                                )}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}