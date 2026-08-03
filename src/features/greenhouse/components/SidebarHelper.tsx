import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Button from "react-bootstrap/Button";
import { LuUpload, LuDownload, LuRefreshCw } from "react-icons/lu";

import { useEffect, useState } from "react";

import type {HelperProp} from "../types.ts";

function SideBarContent({
                            type,
                            setClearGrid,
                            setClearGridType,
                        }: {
    type: string;
    setClearGrid?: (clear: boolean) => void;
    setClearGridType?: (type: string) => void;
}) {
    return (
        <div className="d-flex flex-column gap-2 px-3 pb-3 mt-3">
            <div className="d-grid gap-2 mb-2" style={{gridTemplateColumns: "1fr 1fr", display: "grid"}}>
                <Button variant="primary" size="sm" className="d-flex align-items-center justify-content-center gap-2">
                    <LuUpload size={15}/> Export
                </Button>
                <Button variant="secondary" size="sm" className="d-flex align-items-center justify-content-center gap-2"
                        style={{background: "#2d1b4e", borderColor: "#7c3aed", color: "#c4b5fd"}}>
                    <LuDownload size={15}/> Import
                </Button>
            </div>
            <hr className="m-0 text-white"/>
            <div className="d-flex gap-2 mt-3">
                <Button variant="outline-secondary" size="sm"
                        className="d-flex align-items-center gap-2 flex-grow-1 bg-danger text-white"
                        onClick={() => {
                            setClearGridType?.(type);
                            setClearGrid?.(true);
                        }}
                >
                    <LuRefreshCw size={15}/> Clear {type}
                </Button>
            </div>
        </div>
    );
}

export function SidebarHelper({
                                  selectedType,
                                  setSelectedType,
                                  setClearGrid,
                                  setClearGridType
                              }: HelperProp) {
    const [activeKey, setActiveKey] = useState(selectedType ?? "input");

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (selectedType) setActiveKey(selectedType);
    }, [selectedType]);

    const handleSelect = (key: string | null) => {
        if (!key) return;
        setActiveKey(key);
        setSelectedType(key);
    };
    return (
        <div
            className="overflow-hidden border"
            style={{ width: "100%", backgroundColor: "#0f172a", borderColor: "#2a3044" }}
        >
            <Tabs
                activeKey={activeKey}
                onSelect={handleSelect}
                id="sidebar-tabs"
                className="mb-0"
                justify
            >
                <Tab eventKey="input" title="Input">
                    <SideBarContent type="input" setClearGrid={setClearGrid} setClearGridType={setClearGridType}/>
                </Tab>
                <Tab eventKey="helper" title="Helpers">
                    <SideBarContent type="helper" setClearGrid={setClearGrid} setClearGridType={setClearGridType}/>
                </Tab>
                <Tab eventKey="output" title="Target">
                    <SideBarContent type="output" setClearGrid={setClearGrid} setClearGridType={setClearGridType}/>
                </Tab>
            </Tabs>
        </div>
    );
}