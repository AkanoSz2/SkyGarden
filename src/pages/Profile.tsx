import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import { Navbar, Footer } from "../components/ui";
import { useNavigate } from "react-router-dom";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

const cropRows = Array.from({ length: 13 }, (_, row) => ({
    id: row + 1,
    cells: [{ id: 1 }],
}));

export const TEMP: Record<string, number> = {
    phillip: 200,
    dark_cacao: 30,
    choco_cake: 5,
    anita: 25,
    celestial: 15,
    melon_juice: 15,
    harvest_harbinger: 50,
    magic_8_ball: 25,
    atmospheric: 25,
};

export const CROP_EFFECTS: Record<string, number> = {
    effect_1: 100,
    effect_2: 50,
    effect_3: 25,
    effect_4: 20,
    effect_5: 60,
};

const TAB_PANEL_MIN_HEIGHT = "450px";
const activeTempTotal = Object.values(TEMP).reduce((sum, v) => sum + v, 0);
const activeCropEffectsTotal = Object.values(CROP_EFFECTS).reduce((sum, v) => sum + v, 0);
const profiles = ["Zucchini", "Kiwi"];

function hoverOn(e: React.MouseEvent<HTMLDivElement>) {
    e.currentTarget.style.background = "rgba(40, 45, 58, 0.95)";
    e.currentTarget.style.borderColor = "rgba(75, 85, 110, 0.8)";
}

function hoverOff(e: React.MouseEvent<HTMLDivElement>) {
    e.currentTarget.style.background = "rgba(30, 34, 42, 0.95)";
    e.currentTarget.style.borderColor = "rgba(55, 65, 85, 0.6)";
}

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
    return (
        <>
            <div className="mb-3">
                <h6 className="text-uppercase fw-bold mb-1" style={{ fontSize: "13px", color: "#e5e7eb", letterSpacing: "0.5px" }}>{title}</h6>
                <p className="mb-0" style={{ fontSize: "12px", color: "rgba(160, 170, 190, 0.85)", letterSpacing: "0.2px" }}>{subtitle}</p>
            </div>
            <hr style={{ borderColor: "rgba(55, 65, 85, 0.6)" }} className="mb-3" />
        </>
    );
}

function Badge({ value }: { value: string | number }) {
    return (
        <span className="rounded-2 px-2 py-1" style={{ fontSize: "14px", fontWeight: 600, background: "rgba(234, 179, 8, 0.15)", color: "#fde047", border: "1px solid rgba(234, 179, 8, 0.4)", letterSpacing: "0.5px" }}>
            {value}
        </span>
    );
}

function InfoBadge({ label, value, icon }: { label: string; value: string | number; icon?: React.ReactNode }) {
    return (
        <div className="d-inline-flex align-items-center gap-2 rounded-3 px-3 py-2 mb-4" style={{ background: "rgba(30, 34, 42, 0.95)", border: "1px solid rgba(55, 65, 85, 0.7)" }}>
            {icon}
            <span className="text-white" style={{ fontSize: "13px", fontWeight: 500, letterSpacing: "0.3px" }}>{label}</span>
            <Badge value={value} />
        </div>
    );
}

function HoeIcon() {
    return <img src="/temp/minecraftHoe.png" alt="Hoe" style={{ width: "36px", height: "36px", objectFit: "contain" }} />;
}

function YesNoSelect() {
    return (
        <select defaultValue="No" className="rounded-2 border-0 px-2 py-1" style={{ fontSize: "12px", fontWeight: 600, background: "rgba(25, 29, 38, 0.95)", color: "#e5e7eb", border: "1px solid rgba(55, 65, 85, 0.7)", cursor: "pointer", outline: "none", flexShrink: 0 }}>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
        </select>
    );
}

function EffectRow({ label }: { label: string }) {
    return (
        <div
            className="d-flex align-items-center justify-content-between gap-2 px-3 py-2 rounded-3"
            style={{ background: "rgba(30, 34, 42, 0.95)", border: "1px solid rgba(55, 65, 85, 0.6)", transition: "background 0.15s, border-color 0.15s" }}
            onMouseEnter={hoverOn}
            onMouseLeave={hoverOff}
        >
            <span className="text-capitalize text-truncate" style={{ fontSize: "13px", fontWeight: 500, color: "rgba(200, 210, 230, 0.9)", letterSpacing: "0.2px" }}>
                {label.replace(/_/g, " ")}
            </span>
            <YesNoSelect />
        </div>
    );
}

export function SelectProfile() {
    const [selectedProfile, setSelectedProfile] = useState(profiles[0]);

    return (
        <div className="d-flex align-items-center gap-2 rounded-2 px-3 py-2" style={{ background: "rgba(20, 22, 28, 0.95)", border: "1px solid rgba(45, 50, 65, 0.8)", width: "fit-content" }}>
            <span className="fw-semibold" style={{ fontSize: "13px", color: "rgba(235, 235, 245, 0.9)" }}>Profile</span>
            <select
                value={selectedProfile}
                onChange={(e) => setSelectedProfile(e.target.value)}
                className="rounded-2 px-2 py-1"
                style={{ background: "rgba(30, 34, 42, 0.95)", color: "#e5e7eb", border: "1px solid rgba(55, 65, 85, 0.7)", outline: "none" }}
            >
                {profiles.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#fff" viewBox="0 0 16 16">
                <path d="M4.355.522a.5.5 0 0 1 .623.333l.291.956A5 5 0 0 1 8 1c1.007 0 1.946.298 2.731.811l.29-.956a.5.5 0 1 1 .957.29l-.41 1.352A5 5 0 0 1 13 6h.5a.5.5 0 0 0 .5-.5V5a.5.5 0 0 1 1 0v.5A1.5 1.5 0 0 1 13.5 7H13v1h1.5a.5.5 0 0 1 0 1H13v1h.5a1.5 1.5 0 0 1 1.5 1.5v.5a.5.5 0 1 1-1 0v-.5a.5.5 0 0 0-.5-.5H13a5 5 0 0 1-10 0h-.5a.5.5 0 0 0-.5.5v.5a.5.5 0 1 1-1 0v-.5A1.5 1.5 0 0 1 2.5 10H3V9H1.5a.5.5 0 0 1 0-1H3V7h-.5A1.5 1.5 0 0 1 1 5.5V5a.5.5 0 0 1 1 0v.5a.5.5 0 0 0 .5.5H3c0-1.364.547-2.601 1.432-3.503l-.41-1.352a.5.5 0 0 1 .333-.623M4 7v4a4 4 0 0 0 3.5 3.97V7zm4.5 0v7.97A4 4 0 0 0 12 11V7zM12 6a4 4 0 0 0-1.334-2.982A3.98 3.98 0 0 0 8 2a3.98 3.98 0 0 0-2.667 1.018A4 4 0 0 0 4 6z" />
            </svg>
        </div>
    );
}

function Sidebar({ username }: { username?: string }) {
    const wrapper = (children?: React.ReactNode) => (
        <div
            className="d-flex flex-column align-items-center justify-content-center gap-3 rounded-3 p-2"
            style={{
                width: "180px",
                minHeight: "280px",
                flexShrink: 0,
                backgroundImage: "url('https://c4.wallpaperflare.com/wallpaper/516/973/270/minecraft-cherry-blossom-hd-wallpaper-preview.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
            }}
        >
            {children}
        </div>
    );

    if (!username) return wrapper();

    return wrapper(
        <>
            <img
                src={`https://mc-api.io/render/full/${username}/java?size=256`}
                alt="Player bust"
                className="rounded-3"
                style={{ width: "90%", objectFit: "contain", imageRendering: "pixelated" }}
            />
            <span
                className="rounded-pill px-3 py-1 fw-semibold"
                style={{ fontSize: "13px", color: "#e5e7eb", letterSpacing: "0.3px", background: "rgba(18, 20, 26, 0.85)", border: "1px solid rgba(55, 65, 85, 0.7)", whiteSpace: "nowrap" }}
            >
                {username}
            </span>
        </>
    );
}

function Player() {
    const [username, setUsername] = useState("");
    const [error, setError] = useState("");

    const handleFetch = () => {
        if (!username.trim()) {
            setError("Please enter a username.");
            return;
        }
        setError("");
    };

    return (
        <div style={{ minHeight: TAB_PANEL_MIN_HEIGHT }}>
            <SectionHeader title="Player" subtitle="Fetches the data of the given username for the specific profile." />
            <div className="d-flex flex-column gap-3" style={{ maxWidth: "340px" }}>
                <div className="d-flex flex-column gap-1">
                    <span className="fw-semibold" style={{ fontSize: "12px", color: "rgba(160, 170, 190, 0.85)", letterSpacing: "0.3px" }}>Username</span>
                    <div className="d-flex gap-2">
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleFetch()}
                            placeholder="e.g. osleepyako"
                            className="rounded-2 px-3 py-2 flex-grow-1"
                            style={{ background: "rgba(25, 29, 38, 0.95)", border: `1px solid ${error ? "rgba(239, 68, 68, 0.6)" : "rgba(55, 65, 85, 0.7)"}`, color: "#e5e7eb", fontSize: "13px", outline: "none" }}
                        />
                        <button
                            onClick={handleFetch}
                            className="btn btn-sm rounded-2 fw-semibold px-3"
                            style={{ background: "rgba(234, 179, 8, 0.15)", color: "#fde047", border: "1px solid rgba(234, 179, 8, 0.4)", fontSize: "13px", whiteSpace: "nowrap" }}
                        >
                            Fetch
                        </button>
                    </div>
                </div>
                <div className="d-flex flex-column gap-1">
                    <span className="fw-semibold" style={{ fontSize: "12px", color: "rgba(160, 170, 190, 0.85)", letterSpacing: "0.3px" }}>Profile</span>
                    <SelectProfile />
                </div>
                {error && (
                    <div className="rounded-2 px-3 py-2" style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.4)", color: "#f87171", fontSize: "13px" }}>
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
}

function Fortune() {
    const totalFortune = 999 + activeTempTotal;

    return (
        <div style={{ height: TAB_PANEL_MIN_HEIGHT, overflowY: "scroll", overflowX: "hidden" }}>
            <SectionHeader title="Farming Fortune" subtitle="Breakdown of Farming Fortune gained from each crop, plus any active temporary bonuses." />
            <InfoBadge label="Base Farming Fortune" value={totalFortune} icon={<HoeIcon />} />
            <SectionHeader title="Crop Fortune" subtitle="Each crop its calculated based on the correct tool" />
            <div className="row row-cols-5 g-2 mb-4">
                {cropRows.flatMap((row) =>
                    row.cells.map((cell) => (
                        <div key={`${row.id}-${cell.id}`} className="col">
                            <div
                                className="d-flex flex-row align-items-center justify-content-evenly gap-2 p-2 rounded-3"
                                style={{ background: "rgba(30, 34, 42, 0.95)", border: "1px solid rgba(55, 65, 85, 0.6)", cursor: "pointer", transition: "background 0.15s, border-color 0.15s" }}
                                onMouseEnter={hoverOn}
                                onMouseLeave={hoverOff}
                            >
                                <img src="/temp/wheat.png" alt="Wheat" className="rounded-1" style={{ width: "36px", height: "36px", objectFit: "contain", imageRendering: "pixelated" }} />
                                <Badge value={999} />
                            </div>
                        </div>
                    ))
                )}
            </div>

            <SectionHeader title="Temporary Bonuses" subtitle="Select which temporary bonuses are active." />
            <InfoBadge label="Active Bonus Fortune" value={activeTempTotal} icon={<HoeIcon />} />
            <div className="row row-cols-3 g-2">
                {Object.entries(TEMP).map(([key]) => (
                    <div key={key} className="col">
                        <EffectRow label={key} />
                    </div>
                ))}
            </div>
        </div>
    );
}

const crops = Array.from({ length: 13 }, (_, i) => ({ id: i + 1, name: "Wheat", current: "999" }));

function Leaderboard() {
    return (
        <div style={{ minHeight: TAB_PANEL_MIN_HEIGHT }}>
            <SectionHeader title="API Leaderboard" subtitle="Most crops farmed during jacob contest." />
            <InfoBadge label="Highest Ranking" value="#1" />
            <div className="row row-cols-3 g-2">
                {crops.map((crop) => (
                    <div key={crop.id} className="col">
                        <div className="d-flex align-items-center justify-content-between gap-2 px-3 py-2 rounded-3" style={{ background: "rgba(30, 34, 42, 0.95)", border: "1px solid rgba(55, 65, 85, 0.6)" }}>
                            <div className="d-flex align-items-center gap-2">
                                <img src="/temp/wheat.png" alt={crop.name} style={{ width: "28px", height: "28px", objectFit: "contain", imageRendering: "pixelated" }} />
                                <div className="d-flex flex-column">
                                    <span className="fw-semibold" style={{ fontSize: "13px", color: "#e5e7eb", lineHeight: "1.1" }}>{crop.name}</span>
                                    <span className="fw-semibold" style={{ fontSize: "11px", color: "#fde047" }}>Current: {crop.current}</span>
                                </div>
                            </div>
                            <input
                                type="number"
                                placeholder="Target"
                                className="rounded-2 text-end"
                                style={{ width: "80px", background: "rgba(25, 29, 38, 0.95)", border: "1px solid rgba(55, 65, 85, 0.7)", padding: "4px 8px", color: "#e5e7eb", fontSize: "13px", outline: "none" }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function Greenhouse() {
    return (
        <div style={{ height: TAB_PANEL_MIN_HEIGHT, overflowY: "scroll", overflowX: "hidden" }}>
            <SectionHeader title="Greenhouse" subtitle="All the greenhouse modifiers." />

            <div className="d-flex flex-wrap gap-2 mb-4">
                <InfoBadge label="Desk Growth Speed" value={99} />
                <InfoBadge label="Desk Yield" value={99} />
                <InfoBadge label="Jake Accessory" value={99} />
            </div>

            <SectionHeader title="Custom Factors" subtitle="Enter the correct values below to estimate your result." />
            <div className="row row-cols-3 g-2 mb-4">
                {["Unique Crops", "Crop Effect Yield", "Flasks Per Day", "Login(s) Per Day", "Harvests Per Day", "Priority"].map((label) => (
                    <div key={label} className="col">
                        <div className="d-flex align-items-center justify-content-between gap-2 px-3 py-2 rounded-3" style={{ background: "rgba(30, 34, 42, 0.95)", border: "1px solid rgba(55, 65, 85, 0.6)" }}>
                            <span className="text-truncate" style={{ fontSize: "13px", fontWeight: 500, color: "rgba(200, 210, 230, 0.9)", letterSpacing: "0.2px" }}>{label}</span>
                            {label === "Priority" ? (
                                <select
                                    defaultValue="Collection"
                                    className="rounded-2 px-2 py-1"
                                    style={{
                                        fontSize: "12px",
                                        fontWeight: 600,
                                        background: "rgba(25, 29, 38, 0.95)",
                                        color: "#e5e7eb",
                                        border: "1px solid rgba(55, 65, 85, 0.7)",
                                        cursor: "pointer",
                                        outline: "none",
                                        flexShrink: 0
                                    }}
                                >
                                    <option value="Collection">Collection</option>
                                    <option value="Profit">Profit</option>
                                    <option value="Profit">Sowdust</option>

                                </select>
                            ) : (
                                <input
                                    type="number"
                                    min={0}
                                    placeholder="0"
                                    className="rounded-2 text-end"
                                    style={{ width: "70px", background: "rgba(25, 29, 38, 0.95)", border: "1px solid rgba(55, 65, 85, 0.7)", padding: "2px 6px", color: "#e5e7eb", fontSize: "13px", outline: "none" }}
                                />
                            )}
                        </div>
                    </div>
                ))}

            </div>

            <SectionHeader title="Crop Effects" subtitle="Select which crop effects are active." />
            <div className="row row-cols-3 g-2">
                {Object.entries(CROP_EFFECTS).map(([key]) => (
                    <div key={key} className="col">
                        <EffectRow label={key} />
                    </div>
                ))}
            </div>
        </div>
    );
}

function Extras() {
    return <div style={{ minHeight: TAB_PANEL_MIN_HEIGHT }} />;
}

export function Profile() {
    const navigate = useNavigate();
    return (
        <div data-bs-theme="dark">
            <Navbar />
            <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center p-3" style={{ backgroundColor: "#0a0b0f" }}>
                <div className="container rounded-3 p-4" style={{ backgroundColor: "#12151c", border: "1px solid #2d3341" }}>
                    <div className="d-flex gap-4 align-items-stretch">
                        <Sidebar username="osleepyako" />
                        <div className="flex-grow-1 min-w-0">
                            <Tabs defaultActiveKey="stats" className="mb-3">
                                <Tab eventKey="player" title="Player">
                                    <Player />
                                </Tab>
                                <Tab eventKey="stats" title="Fortune">
                                    <Fortune />
                                </Tab>
                                <Tab eventKey="gh" title="Greenhouse">
                                    <Greenhouse />
                                </Tab>
                                <Tab eventKey="leaderboard" title="Leaderboard">
                                    <Leaderboard />
                                </Tab>
                                <Tab eventKey="panels" title="Extras">
                                    <Extras />
                                </Tab>
                            </Tabs>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}