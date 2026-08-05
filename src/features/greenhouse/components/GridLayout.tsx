import {useEffect, useState} from "react";

import type {
    GreenhouseLayoutProps,
} from "../types.ts";

import {
    emptyGrid,
} from "../scripts/placement.ts";

import {
    addTab,
    deleteTab,
    printCropMap
} from "../scripts/tabs.ts";


import {TabButton, AddTabButton} from "./TabButton.tsx";

import {GreenhouseGrid} from "./GreenhouseGrid.tsx";
import {Legend} from "./Legend.tsx";

import { ImHammer2 } from "react-icons/im";


export function GreenhouseLayout({
                                     selectedCrop,
                                     hoveredIndex,
                                     setHoveredIndex,
                                     selectedType,
                                     clearGrid,
                                     setClearGrid,
                                     clearGridType,
                                     generateTrigger,
                                     setGenerateTrigger,
                                     generatorItems,
                                     setGeneratorItems,
                                     greenhouseTabData,
                                     setGreenhouseTabData,
                                     tabs: tabsProp,
                                     setTabs: setTabsProp,
                                     active: activeProp,
                                     setActive: setActiveProp,
                                 }: Omit<GreenhouseLayoutProps, "cells" | "setCells" | "activeTab"> & {
    tabs?: string[];
    setTabs?: React.Dispatch<React.SetStateAction<string[]>>;
    active?: string;
    setActive?: React.Dispatch<React.SetStateAction<string>>;
}) {
    const maxTabs = 10;

    // Fallback local state in case a parent hasn't wired these up yet —
    // keeps the component from crashing on tabs.map() with undefined.
    const [localTabs, setLocalTabs] = useState<string[]>(["1"]);
    const [localActive, setLocalActive] = useState("1");

    const tabs = tabsProp ?? localTabs;
    const setTabs = setTabsProp ?? setLocalTabs;
    const active = activeProp ?? localActive;
    const setActive = setActiveProp ?? setLocalActive;

    const [forcePlace, setForcePlace] = useState(false);

    const getTabData = (id: number) => {
        return greenhouseTabData.find(t => t.id === id) ?? {id, cells: emptyGrid(), placements: []};
    };

    const activeTabId = parseInt(active, 10);

    useEffect(() => {
        if (!clearGrid || !clearGridType) return;

        setGreenhouseTabData(prev =>
            prev.map(t => {
                if (t.id !== activeTabId) return t;

                if (clearGridType === "output" || clearGridType === "intermediate") {
                    const removedIds = new Set(
                        t.placements.filter(p => p.type === "output" || p.type === "intermediate").map(p => p.instanceId)
                    );
                    if (removedIds.size === 0) return t;

                    return {
                        ...t,
                        cells: t.cells.map(c => (removedIds.has(c) ? "empty" : c)),
                        placements: t.placements.filter(p => !removedIds.has(p.instanceId)),
                    };
                }
                const removedIds = new Set(
                    t.placements.filter(p => p.type === clearGridType).map(p => p.instanceId)
                );
                if (removedIds.size === 0) return t;

                return {
                    ...t,
                    cells: t.cells.map(c => (removedIds.has(c) ? "empty" : c)),
                    placements: t.placements.filter(p => !removedIds.has(p.instanceId)),
                };
            })
        );

        setClearGrid?.(false);
    }, [clearGrid, clearGridType, activeTabId, setClearGrid]);

    return (
        <div>
            <div
                className="d-flex align-items-end border-bottom border-secondary"
                style={{height: "40px"}}
            >
                <div className="d-flex align-items-end gap-1">
                    {tabs.map((key, i) => (
                        <TabButton
                            key={key}
                            tabKey={key}
                            active={active}
                            iconName={"delete"}
                            setActive={setActive}
                            onDelete={i === 0 ? undefined : () => deleteTab(key, setTabs, setActive, setGreenhouseTabData, active)}
                        />
                    ))}

                    {tabs.length < maxTabs &&
                        <AddTabButton
                            onClick={() => addTab(tabs, active, setTabs, setActive, setGreenhouseTabData, maxTabs)}
                        />
                    }
                </div>

                <div className="d-flex align-items-end gap-1 ms-auto">
                    {/*<button*/}
                    {/*    className="btn btn-sm btn-outline-secondary"*/}
                    {/*    onClick={() => printCropMap(active, getTabData)}*/}
                    {/*>*/}
                    {/*    Print Map*/}
                    {/*</button>*/}

                    <button
                        onClick={() => setForcePlace(prev => !prev)}
                        aria-pressed={forcePlace}
                        title="Force placement"
                        style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "8px",
                            border: forcePlace ? "1px solid #3b6df0" : "1px solid #232a3d",
                            background: forcePlace ? "rgba(2,20,43,0.14)" : "#131826",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                        }}
                    >
                        <ImHammer2
                            size={18}
                            style={{transition: "color 0.2s ease", color: "6b7280"}}
                        />
                    </button>
                </div>
            </div>

            <div className="border border-top-0 border-secondary-subtle" style={{backgroundColor: "#0f172a"}}>
                {tabs.map(key => {
                    const tabId = parseInt(key, 10);
                    const tabData = getTabData(tabId);
                    return active === key && (
                        <GreenhouseGrid
                            key={key}
                            cells={tabData.cells}
                            selectedCrop={selectedCrop}
                            hoveredIndex={hoveredIndex}
                            setHoveredIndex={setHoveredIndex}

                            greenhouseTabData={greenhouseTabData}
                            setGreenhouseTabData={setGreenhouseTabData}
                            selectedType={selectedType}
                            activeTab={tabId}
                            clearGrid={clearGrid}
                            setClearGrid={setClearGrid}
                            clearGridType={clearGridType}
                            generateTrigger={generateTrigger}
                            setGenerateTrigger={setGenerateTrigger}
                            generatorItems={generatorItems}
                            setGeneratorItems={setGeneratorItems}
                            forcePlace={forcePlace}
                            setCells={function (): void {
                                throw new Error("Function not implemented.");
                            }}
                        />
                    );
                })}
                <div className="d-flex flex-wrap gap-3 items-center justify-content-center mb-3">
                    <Legend/>
                </div>
            </div>
        </div>
    );
}