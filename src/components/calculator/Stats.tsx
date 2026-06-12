import { useState } from "react";
import { PestDropdown } from "../ui";
import { StyledDropdown, StyledDropdownNumber } from "../ui/";

type DropdownItem = {
    name: string;
    img: string;
    value: string;
};

export function Stats() {
    const [activeTab, setActiveTab] = useState<"Temporary" | "Greenhouse" | "Pests">("Temporary");

    // Greenhouse
    const [unique, setUniqueCrops] = useState(12);
    const [cropEffect, setCropEffect] = useState<DropdownItem>({
        name: "30",
        img: "",
        value: "30"
    });
    const [flasks, setFlasks] = useState<DropdownItem>({
        name: "No",
        img: "",
        value: "No"
    });
    const [betweenCycles, setBetweenCycles] = useState<DropdownItem>({
        name: "No",
        img: "",
        value: "No"
    });

    // Temporary
    const yesNoItems: DropdownItem[] = [
        { name: "Yes", img: "", value: "Yes" },
        { name: "No", img: "", value: "No" }
    ];

    const [tempStats, setTempStats] = useState({
        pestsTurnIn: yesNoItems[1],
        consumable: yesNoItems[1],
        filter: yesNoItems[1],
        eightBall: yesNoItems[1]
    });

    const updateTempStat = (key: keyof typeof tempStats, item: DropdownItem) => {
        setTempStats(prev => ({ ...prev, [key]: item }));
    };

    // Pests
    const [vacuumFF, setVacuumFF] = useState(333);
    const [bpc, setBpc] = useState(0);
    const [pet, setPet] = useState<DropdownItem>({
        name: "Slug",
        img: "",
        value: "Slug"
    });

    const petItems: DropdownItem[] = [
        { name: "Slug", img: "", value: "Slug" },
        { name: "Mosquito", img: "", value: "Mosquito" }
    ];

    const cropEffectItems: DropdownItem[] = [0, 20, 30].map(v => ({
        name: String(v),
        img: "",
        value: String(v)
    }));

    const tabs = ["Temporary", "Greenhouse", "Pests"] as const;

    return (
        <div
            className="border border-[#334155] d-flex flex-column rounded-3 overflow-hidden"
            style={{
                width: "100%",
                height: "320px",
                backgroundColor: "#0f172a"
            }}
        >
            <h5 className="text-center mt-3 mb-2 text-light fw-bold">Stats</h5>

            <ul className="nav nav-tabs border-bottom border-[#334155] bg-[#0f172a] px-1">
                {tabs.map((tab) => (
                    <li className="nav-item flex-fill" key={tab}>
                        <button
                            className={`nav-link text-light py-2 px-1 small fw-medium border-0 border-bottom border-3 w-100 ${
                                activeTab === tab
                                    ? "active border-white text-white"
                                    : "border-transparent text-[#94a3b8]"
                            }`}
                            style={{
                                background: "transparent",
                                borderRadius: "0",
                                fontSize: "0.85rem"
                            }}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </button>
                    </li>
                ))}
            </ul>

            <div className="flex-grow-1 p-3 overflow-auto" style={{ minHeight: 0 }}>
                {activeTab === "Temporary" && (
                    <div className="row g-2 mx-0">
                        <div className="col-6 px-1">
                            <label className="form-label text-light small mb-1">Pests Turn in</label>
                            <StyledDropdown
                                items={yesNoItems}
                                value={tempStats.pestsTurnIn}
                                onChange={(item) => updateTempStat("pestsTurnIn", item)}
                            />
                        </div>

                        <div className="col-6 px-1">
                            <label className="form-label text-light small mb-1">Consumable</label>
                            <StyledDropdown
                                items={yesNoItems}
                                value={tempStats.consumable}
                                onChange={(item) => updateTempStat("consumable", item)}
                            />
                        </div>

                        <div className="col-6 px-1">
                            <label className="form-label text-light small mb-1">Filter</label>
                            <StyledDropdown
                                items={yesNoItems}
                                value={tempStats.filter}
                                onChange={(item) => updateTempStat("filter", item)}
                            />
                        </div>

                        <div className="col-6 px-1">
                            <label className="form-label text-light small mb-1">8 Ball</label>
                            <StyledDropdown
                                items={yesNoItems}
                                value={tempStats.eightBall}
                                onChange={(item) => updateTempStat("eightBall", item)}
                            />
                        </div>
                    </div>
                )}

                {activeTab === "Greenhouse" && (
                    <div className="row g-2 mx-0">
                        <div className="col-6 px-1">
                            <label className="form-label text-light small mb-1">Unique Crops</label>
                            <StyledDropdownNumber min={1} max={12} value={unique} onChange={setUniqueCrops} />
                        </div>

                        <div className="col-6 px-1">
                            <label className="form-label text-light small mb-1">Crop Effect</label>
                            <StyledDropdown
                                items={cropEffectItems}
                                value={cropEffect}
                                onChange={setCropEffect}
                            />
                        </div>

                        <div className="col-6 px-1">
                            <label className="form-label text-light small mb-1">Flasks</label>
                            <StyledDropdown items={yesNoItems} value={flasks} onChange={setFlasks} />
                        </div>

                        <div className="col-6 px-1">
                            <label className="form-label text-light small mb-1">Between Cycles</label>
                            <StyledDropdown
                                items={yesNoItems}
                                value={betweenCycles}
                                onChange={setBetweenCycles}
                            />
                        </div>
                    </div>
                )}

                {activeTab === "Pests" && (
                    <div className="row g-2 mx-0">
                        <div className="col-6 px-1">
                            <label className="form-label text-light small mb-1">Vacuum FF</label>
                            <input
                                type="number"
                                className="form-control form-control-sm bg-dark text-light border-secondary"
                                value={vacuumFF}
                                onChange={(e) => setVacuumFF(Number(e.target.value))}
                            />
                        </div>

                        <div className="col-6 px-1">
                            <label className="form-label text-light small mb-1">BPC</label>
                            <input
                                type="number"
                                className="form-control form-control-sm bg-dark text-light border-secondary"
                                value={bpc}
                                onChange={(e) => setBpc(Number(e.target.value))}
                            />
                        </div>

                        <div className="col-12 px-1">
                            <label className="form-label text-light small mb-1">Pet</label>
                            <StyledDropdown
                                items={petItems}
                                value={pet}
                                onChange={setPet}
                            />
                        </div>

                        <div className="col-12 px-1">
                            <label className="form-label text-light small mb-1">Chosen Pest</label>
                            <PestDropdown />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}