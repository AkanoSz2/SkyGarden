import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Button from "react-bootstrap/Button";


const ExportIcon = () => (
    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
        <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
    </svg>
);
const ImportIcon = () => (
    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
        <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
);
const RefreshIcon = () => (
    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <polyline points="1 4 1 10 7 10"/>
        <path d="M3.51 15a9 9 0 1 0 .49-3.08"/>
    </svg>
);

function SideBarContent({ type }: { type: string }) {
    return (
        <div className="d-flex flex-column gap-2 px-3 pb-3 mt-3">
            <div className="d-grid gap-2 mb-2" style={{gridTemplateColumns: "1fr 1fr", display: "grid"}}>
                <Button variant="primary" size="sm" className="d-flex align-items-center justify-content-center gap-2">
                    <ExportIcon/> Export
                </Button>
                <Button variant="secondary" size="sm" className="d-flex align-items-center justify-content-center gap-2"
                        style={{background: "#2d1b4e", borderColor: "#7c3aed", color: "#c4b5fd"}}>
                    <ImportIcon/> Import
                </Button>
            </div>
            <hr className="m-0 text-white"/>
            <div className="d-flex gap-2 mt-3">
                <Button variant="outline-secondary" size="sm"
                        className="d-flex align-items-center gap-2 flex-grow-1 bg-danger text-white">
                    <RefreshIcon/> Clear {type}
                </Button>
            </div>
        </div>
    );
}

export function SidebarHelper() {
    return (
        <div
            className="overflow-hidden border"
            style={{ width: "100%", backgroundColor: "#0f172a", borderColor: "#2a3044" }}
        >
            <Tabs defaultActiveKey="input" id="sidebar-tabs" className="mb-0" justify>
                <Tab eventKey="input" title="Input">
                    <SideBarContent type="input" />
                </Tab>
                <Tab eventKey="output" title="Output">
                    <SideBarContent type="output" />
                </Tab>
            </Tabs>
        </div>
    );
}