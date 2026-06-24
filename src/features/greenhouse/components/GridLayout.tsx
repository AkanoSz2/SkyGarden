import { useState } from "react";

type GreenhouseLayoutProps = {
    cells: string[];
    setCells: React.Dispatch<React.SetStateAction<string[]>>;
};

type TabButtonProps = {
    tabKey: string;
    active: string;
    setActive: (key: string) => void;
};


type GridDataCells = {
    ingredients: string[];
    targets: string[]
}

type TabGridData = {
    id : string;
    cells: GridDataCells
}


function TabButton({ tabKey, active, setActive }: TabButtonProps) {
    const isActive = active === tabKey;
    return (
        <button
            onClick={() => setActive(tabKey)}
            className={`btn btn-sm rounded-top-3 rounded-bottom-0 border-bottom-0 px-3 py-2 ${
                isActive ? "border border-secondary-subtle text-light" : "border border-secondary text-secondary"
            }`}
            style={{
                fontSize: "13px",
                backgroundColor: isActive ? "#0f172a" : "#0a0f1a",
                position: "relative",
                bottom: 0,
                transition: "all 0.1s ease",
            }}
        >
            {tabKey}
        </button>
    );
}

function AddTabButton({ onClick }: { onClick: () => void }) {
    return (
        <button
            className="btn btn-sm btn-link text-secondary align-self-center ms-1 fs-5 text-decoration-none"
            onClick={onClick}
        >
            +
        </button>
    );
}

function GreenhousGrid({ cells, setCells }: GreenhouseLayoutProps) {
    const gridCells = Array.from({ length: 100 }, (_, i) => cells[i] || "empty");

    return (
        <div className="border-0" style={{ backgroundColor: "#0f172a" }}>
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(10, 1fr)",
                    gap: "2px",
                    padding: "12px",
                }}
            >
                {gridCells.map((cell, index) => {
                    const isEmpty = cell === "empty";
                    return (
                        <div key={index} className="ratio ratio-1x1">
                            <div
                                className="border rounded overflow-hidden d-flex align-items-center justify-content-center p-1"
                                style={{
                                    borderColor: isEmpty ? "#475569" : "#334155",
                                    backgroundColor: isEmpty ? "#1e2937" : "#0f172a",
                                }}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
export function GreenhouseLayout({ cells, setCells }: GreenhouseLayoutProps) {
    const [tabs, setTabs] = useState(["1"]);
    const [active, setActive] = useState("1");
    const maxTabs = 5;

    const addTab = () => {
        if (tabs.length >= maxTabs) return;
        const newKey = `${tabs.length + 1}`;
        setTabs(prev => [...prev, newKey]);
        setActive(newKey);
    };

    return (
        <div>
            <div className="d-flex align-items-end gap-1 border-bottom border-secondary "
                 style={{ height: "40px"}}
            >
                {tabs.map(key => (
                    <TabButton key={key} tabKey={key} active={active} setActive={setActive} />
                ))}
                {tabs.length < maxTabs && <AddTabButton onClick={addTab} />}
            </div>

            <div className="border border-top-0 border-secondary-subtle" style={{ backgroundColor: "#0f172a" }}>
                {tabs.map(key => active === key && (
                    <GreenhousGrid key={key} cells={cells} setCells={setCells} />
                ))}
            </div>
        </div>
    );
}