import { useState } from "react";
import { PestDropdown } from "../ui";
import { StyledDropdown, StyledDropdownNumber } from "../ui/";
import { PLANT_TOOLS } from "../shared/constants";

import { getProfileData } from "../../features/playerStats";

type PlayerData = Awaited<ReturnType<typeof getProfileData>>;

type DropdownItem = {
    name: string;
    img: string;
    value: string;
};

type StatValue = DropdownItem | number | string;

type FieldDef =
    | { key: string; label: string; type: "dropdown"; items: DropdownItem[]; colSpan?: 6 | 12 }
    | { key: string; label: string; type: "number-dropdown"; min: number; max: number; colSpan?: 6 | 12 }
    | { key: string; label: string; type: "number-input"; colSpan?: 6 | 12 }
    | { key: string; label: string; type: "custom"; component: React.ComponentType; colSpan?: 6 | 12 };

const yesNoItems: DropdownItem[] = [
    { name: "Yes", img: "", value: "Yes" },
    { name: "No", img: "", value: "No" }
];

const petItems: DropdownItem[] = [
    { name: "Slug", img: "", value: "Slug" },
    { name: "Mosquito", img: "", value: "Mosquito" }
];

const cropEffectItems: DropdownItem[] = [0, 20, 30].map(v => ({
    name: String(v),
    img: "",
    value: String(v)
}));


const toolItems: DropdownItem[] = Object.entries(PLANT_TOOLS).map(([key, tool]) => ({
    name: tool.name,
    img: tool.icon,
    value: key
}));

const TABS = ["Temporary", "Greenhouse", "Pests"] as const;
type Tab = typeof TABS[number];


const TEMPORARY_FIELDS: FieldDef[] = [
    { key: "pestsTurnIn", label: "Pests Turn in", type: "dropdown", items: yesNoItems },
    { key: "consumable", label: "Consumable", type: "dropdown", items: yesNoItems },
    { key: "filter", label: "Filter", type: "dropdown", items: yesNoItems },
    { key: "eightBall", label: "8 Ball", type: "dropdown", items: yesNoItems },
    { key: "tool", label: "Tool", type: "dropdown", items: toolItems, colSpan: 12 }
];

const TEMPORARY_DEFAULTS: Record<string, StatValue> = {
    pestsTurnIn: yesNoItems[1],
    consumable: yesNoItems[1],
    filter: yesNoItems[1],
    eightBall: yesNoItems[1],
    tool: toolItems[0]
};

function TemporaryTab({
                          values,
                          onChange
                      }: {
    values: Record<string, StatValue>;
    onChange: (key: string, value: StatValue) => void;
}) {
    return (
        <div className="row g-2 mx-0">
            {TEMPORARY_FIELDS.map((field) => (
                <div className={`col-${field.colSpan ?? 6} px-1`} key={field.key}>
                    <label className="form-label text-light small mb-1">{field.label}</label>
                    {renderField(field, values[field.key], (v) => onChange(field.key, v))}
                </div>
            ))}
        </div>
    );
}


const GREENHOUSE_FIELDS: FieldDef[] = [
    { key: "unique", label: "Unique Crops", type: "number-dropdown", min: 1, max: 12 },
    { key: "cropEffect", label: "Crop Effect", type: "dropdown", items: cropEffectItems },
    { key: "flasks", label: "Flasks", type: "dropdown", items: yesNoItems },
    { key: "betweenCycles", label: "Between Cycles", type: "dropdown", items: yesNoItems }
];

const GREENHOUSE_DEFAULTS: Record<string, StatValue> = {
    unique: 12,
    cropEffect: { name: "30", img: "", value: "30" },
    flasks: yesNoItems[1],
    betweenCycles: yesNoItems[1]
};

function GreenhouseTab({
                           values,
                           onChange
                       }: {
    values: Record<string, StatValue>;
    onChange: (key: string, value: StatValue) => void;
}) {
    return (
        <div className="row g-2 mx-0">
            {GREENHOUSE_FIELDS.map((field) => (
                <div className={`col-${field.colSpan ?? 6} px-1`} key={field.key}>
                    <label className="form-label text-light small mb-1">{field.label}</label>
                    {renderField(field, values[field.key], (v) => onChange(field.key, v))}
                </div>
            ))}
        </div>
    );
}


const PESTS_FIELDS: FieldDef[] = [
    { key: "vacuumFF", label: "Vacuum FF", type: "number-input" },
    { key: "bpc", label: "BPC", type: "number-input" },
    { key: "pet", label: "Pet", type: "dropdown", items: petItems, colSpan: 12 },
    { key: "chosenPest", label: "Chosen Pest", type: "custom", component: PestDropdown, colSpan: 12 }
];

const PESTS_DEFAULTS: Record<string, StatValue> = {
    vacuumFF: 333,
    bpc: 0,
    pet: petItems[0],
    chosenPest: { name: "", img: "", value: "" }
};

function PestsTab({
                      values,
                      onChange
                  }: {
    values: Record<string, StatValue>;
    onChange: (key: string, value: StatValue) => void;
}) {
    return (
        <div className="row g-2 mx-0">
            {PESTS_FIELDS.map((field) => (
                <div className={`col-${field.colSpan ?? 6} px-1`} key={field.key}>
                    <label className="form-label text-light small mb-1">{field.label}</label>
                    {renderField(field, values[field.key], (v) => onChange(field.key, v))}
                </div>
            ))}
        </div>
    );
}


function renderField(
    field: FieldDef,
    value: StatValue,
    onChange: (value: StatValue) => void
) {
    switch (field.type) {
        case "dropdown":
            return (
                <StyledDropdown
                    items={field.items}
                    value={value as DropdownItem}
                    onChange={onChange}
                    forceDirection="down"
                />
            );
        case "number-dropdown":
            return (
                <StyledDropdownNumber
                    min={field.min}
                    max={field.max}
                    value={value as number}
                    onChange={onChange}
                    forceDirection="down"
                />
            );
        case "number-input":
            return (
                <input
                    type="number"
                    className="form-control form-control-sm bg-dark text-light border-secondary"
                    value={value as number}
                    onChange={(e) => onChange(Number(e.target.value))}
                />
            );
        case "custom": {
            const Component = field.component;
            return <Component />;
        }
    }
}

const DEFAULT_VALUES: Record<Tab, Record<string, StatValue>> = {
    Temporary: TEMPORARY_DEFAULTS,
    Greenhouse: GREENHOUSE_DEFAULTS,
    Pests: PESTS_DEFAULTS
};

function StatsPanel() {
    const [activeTab, setActiveTab] = useState<Tab>("Temporary");
    const [values, setValues] = useState<Record<Tab, Record<string, StatValue>>>(DEFAULT_VALUES);

    const updateValue = (tab: Tab, key: string, value: StatValue) => {
        setValues(prev => ({
            ...prev,
            [tab]: { ...prev[tab], [key]: value }
        }));
    };

    const tabValues = values[activeTab];
    const onTabChange = (key: string, value: StatValue) => updateValue(activeTab, key, value);

    return (
        <div
            className="border border-[#334155] d-flex flex-column rounded-3 overflow-hidden"
            style={{ width: "100%", height: "360px", backgroundColor: "#0f172a" }}
        >
            <h5 className="text-center mt-3 mb-2 text-light fw-bold">Stats</h5>

            <ul className="nav nav-tabs border-bottom border-[#334155] bg-[#0f172a] px-1">
                {TABS.map((tab) => (
                    <li className="nav-item flex-fill" key={tab}>
                        <button
                            className={`nav-link text-light py-2 px-1 small fw-medium border-0 border-bottom border-3 w-100 ${
                                activeTab === tab
                                    ? "active border-white text-white"
                                    : "border-transparent text-[#94a3b8]"
                            }`}
                            style={{ background: "transparent", borderRadius: "0", fontSize: "0.85rem" }}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </button>
                    </li>
                ))}
            </ul>

            <div className="flex-grow-1 p-3 overflow-auto" style={{ minHeight: 0 }}>
                {activeTab === "Temporary" && (
                    <TemporaryTab values={tabValues} onChange={onTabChange} />
                )}
                {activeTab === "Greenhouse" && (
                    <GreenhouseTab values={tabValues} onChange={onTabChange} />
                )}
                {activeTab === "Pests" && (
                    <PestsTab values={tabValues} onChange={onTabChange} />
                )}
            </div>
        </div>
    );
}


import { usePlayerDataContext } from "../../context/PlayerDataContext";

function PlayerPanel() {
    const { username, setUsername, profiles, selectedProfile, fetching, loadingProfile, error, fetchProfiles, fetchProfile } = usePlayerDataContext();

    return (
        <div className="border border-[#334155] d-flex flex-column rounded-3 overflow-hidden"
             style={{ width: "100%", backgroundColor: "#0f172a" }}>
            <h5 className="text-center mt-3 mb-2 text-light fw-bold">Player</h5>
            <div className="px-3 pb-3 d-flex flex-column gap-2">
                <div>
                    <label className="form-label text-light small mb-1">Username</label>
                    <div className="d-flex gap-2">
                        <input
                            type="text"
                            className="form-control form-control-sm bg-dark text-light border-secondary"
                            placeholder="Enter username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && fetchProfiles()}
                        />
                        <button
                            className="btn btn-sm btn-outline-secondary text-light flex-shrink-0"
                            style={{ minWidth: "60px" }}
                            disabled={!username.trim() || fetching}
                            onClick={() => fetchProfiles()}
                        >
                            {fetching ? <span className="spinner-border spinner-border-sm" /> : profiles.length ? "Refetch" : "Fetch"}
                        </button>
                    </div>
                    {error && <div className="text-danger small mt-1">{error}</div>}
                </div>
                {profiles.length > 0 && selectedProfile && (
                    <div>
                        <label className="form-label text-light small mb-1">
                            Profile {loadingProfile && <span className="spinner-border spinner-border-sm ms-1" />}
                        </label>
                        <StyledDropdown
                            items={profiles}
                            value={selectedProfile}
                            onChange={(v) => fetchProfile(v as DropdownItem)}
                            forceDirection="down"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}



export function Stats() {
    const [playerData, setPlayerData] = useState<PlayerData | null>(null);

    return (
        <div className="d-flex flex-column gap-3" style={{ width: "100%" }}>
            <PlayerPanel onData={setPlayerData} />
            <StatsPanel />
        </div>
    );
}