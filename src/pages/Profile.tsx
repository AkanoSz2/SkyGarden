import "bootstrap/dist/css/bootstrap.min.css";
import {useEffect, useRef, useState} from "react";
import { Navbar, Footer } from "../components/ui";
import { useNavigate } from "react-router-dom";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

import { usePlayerDataContext } from "../context/PlayerDataContext";
import {string} from "prismarine-nbt";

const cropRows = Array.from({ length: 13 }, (_, row) => ({
    id: row + 1,
    cells: [{ id: 1 }],
}));

export const CROP_EFFECTS: Record<string, number> = {
    effect_1: 100,
    effect_2: 50,
    effect_3: 25,
    effect_4: 20,
    effect_5: 60,
};

const TAB_PANEL_MIN_HEIGHT = "450px";

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

function YesNoSelect({ value, onChange }: { value: boolean; onChange: (value: boolean) => void }) {
    return (
        <select
            value={value ? "Yes" : "No"}
            onChange={(e) => onChange(e.target.value === "Yes")}
            className="rounded-2 border-0 px-2 py-1"
            style={{ fontSize: "12px", fontWeight: 600, background: "rgba(25, 29, 38, 0.95)", color: "#e5e7eb", border: "1px solid rgba(55, 65, 85, 0.7)", cursor: "pointer", outline: "none", flexShrink: 0 }}
        >
            <option value="Yes">Yes</option>
            <option value="No">No</option>
        </select>
    );
}

function EffectRow({ label, value, onChange }: { label: string; value: boolean; onChange: (value: boolean) => void }) {
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
            <YesNoSelect value={value} onChange={onChange} />
        </div>
    );
}

type DropdownItem = { name: string; img: string; value: string };

const CROP_IMAGE_OVERRIDES: Record<string, string> = {
    Mushroom: "red_mushroom",
    Melon_Slice: "melon",
};

function getCropImageName(cropName: string): string {
    return CROP_IMAGE_OVERRIDES[cropName] ?? cropName.toLowerCase();
}

export function SelectProfile({ profiles, selectedProfile, onSelect }: {
    profiles: DropdownItem[];
    selectedProfile: DropdownItem | null;
    onSelect: (item: DropdownItem) => void;
}) {
    if (!profiles.length) return null;

    return (
        <div className="d-flex align-items-center gap-2 rounded-2 px-3 py-2" style={{ background: "rgba(20, 22, 28, 0.95)", border: "1px solid rgba(45, 50, 65, 0.8)", width: "fit-content" }}>
            <span className="fw-semibold" style={{ fontSize: "13px", color: "rgba(235, 235, 245, 0.9)" }}>Profile</span>
            <select
                value={selectedProfile?.value ?? ""}
                onChange={(e) => {
                    const item = profiles.find(p => p.value === e.target.value);
                    if (item) onSelect(item);
                }}
                className="rounded-2 px-2 py-1"
                style={{ background: "rgba(30, 34, 42, 0.95)", color: "#e5e7eb", border: "1px solid rgba(55, 65, 85, 0.7)", outline: "none" }}
            >
                {profiles.map((p) => <option key={p.value} value={p.value}>{p.name}</option>)}
            </select>
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
                backgroundImage: "url(/temp/profileBackground.jpg)",
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
                className="rounded px-3 py-1 fw-semibold"
                style={{ fontSize: "13px", color: "#e5e7eb", letterSpacing: "0.3px", background: "rgba(18, 20, 26, 0.85)", border: "1px solid rgba(55, 65, 85, 0.7)", whiteSpace: "nowrap" }}
            >
                {username}
            </span>
        </>
    );
}

function BugIcon({ size = 16 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 2l1.5 1.5" />
            <path d="M14.5 3.5L16 2" />
            <path d="M9 7.13V6a3 3 0 1 1 6 0v1.13" />
            <path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6Z" />
            <path d="M6 13H2" />
            <path d="M6 17l-3 1" />
            <path d="M18 13h4" />
            <path d="M18 17l3 1" />
            <path d="M9 20v-3" />
            <path d="M15 20v-3" />
        </svg>
    );
}

function UsernameInput({ username, setUsername, fetching, error, onFetch, showDebug, onToggleDebug }) {
    return (
        <div className="d-flex flex-column gap-1">
            <span
                className="fw-semibold"
                style={{ fontSize: "12px", color: "rgba(160, 170, 190, 0.85)", letterSpacing: "0.3px" }}
            >
                Username
            </span>
            <div className="d-flex gap-2">
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && onFetch()}
                    placeholder="e.g. osleepyako"
                    className="rounded-2 px-3 py-2 flex-grow-1"
                    style={{
                        background: "rgba(25, 29, 38, 0.95)",
                        border: `1px solid ${error ? "rgba(239, 68, 68, 0.6)" : "rgba(55, 65, 85, 0.7)"}`,
                        color: "#e5e7eb",
                        fontSize: "13px",
                        outline: "none"
                    }}
                />
                <button
                    onClick={onFetch}
                    disabled={!username.trim() || fetching}
                    className="btn btn-sm rounded-2 fw-semibold px-3"
                    style={{
                        background: "rgba(234, 179, 8, 0.15)",
                        color: "#fde047",
                        border: "1px solid rgba(234, 179, 8, 0.4)",
                        fontSize: "13px",
                        whiteSpace: "nowrap"
                    }}
                >
                    {fetching ? "Fetching..." : "Fetch"}
                </button>
                <button
                    type="button"
                    onClick={onToggleDebug}
                    title={showDebug ? "Hide raw data" : "Show raw data"}
                    className={`btn btn-sm rounded-2 d-inline-flex align-items-center justify-content-center ${showDebug ? "btn-warning" : "btn-outline-secondary"}`}
                    style={{ flexShrink: 0 }}
                >
                    <BugIcon />
                </button>
            </div>
        </div>
    );
}

function ErrorMessage({ error }) {
    if (!error) return null;

    return (
        <div
            className="rounded-2 px-3 py-2"
            style={{
                background: "rgba(239, 68, 68, 0.1)",
                border: "1px solid rgba(239, 68, 68, 0.4)",
                color: "#f87171",
                fontSize: "13px"
            }}
        >
            {error}
        </div>
    );
}


function PlayerDataViewer({ playerData, visible }) {
    if (!playerData || !visible) return null;

    return (
        <pre
            className="rounded-2 p-3 mb-0"
            style={{
                background: "rgba(10, 11, 15, 0.95)",
                border: "1px solid rgba(55, 65, 85, 0.7)",
                color: "#a5d6ff",
                fontSize: "11px",
                maxHeight: "300px",
                overflow: "auto",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word"
            }}
        >
            {JSON.stringify(playerData, null, 2)}
        </pre>
    );
}

function ProfileGuide() {
    const [dismissed, setDismissed] = useState(false);

    if (dismissed) return null;

    return (
        <div
            className="alert alert-secondary alert-dismissible d-flex flex-column gap-1 px-3 py-2 mb-0"
            style={{ fontSize: "12px", lineHeight: 1.4 }}
            role="alert"
        >
            <div className="d-flex align-items-center justify-content-between gap-2">
                <span className="fw-semibold text-uppercase">how to use?</span>
                <button
                    type="button"
                    className="btn-close"
                    style={{ fontSize: "10px" }}
                    aria-label="Dismiss guide"
                    onClick={() => setDismissed(true)}
                ></button>
            </div>
            <span>Input an username above</span>
        </div>
    );
}

function PlayerSearchPanel({ username, setUsername, fetching, error, profiles, selectedProfile, fetchProfiles, fetchProfile, showDebug, onToggleDebug }) {
    return (
        <div className="col-6 d-flex flex-column gap-2">
            <UsernameInput
                username={username}
                setUsername={setUsername}
                fetching={fetching}
                error={error}
                onFetch={fetchProfiles}
                showDebug={showDebug}
                onToggleDebug={onToggleDebug}
            />

            {profiles.length > 0 && username && (
                <SelectProfile profiles={profiles} selectedProfile={selectedProfile} onSelect={fetchProfile} />
            )}

            {/*<ProfileGuide />*/}
            <ErrorMessage error={error} />
        </div>
    );
}

function Player() {
    const {
        username,
        setUsername,
        playerData,
        fetching,
        error,
        profiles,
        selectedProfile,
        fetchProfiles,
        fetchProfile
    } = usePlayerDataContext();

    const [showDebug, setShowDebug] = useState(false);

    return (
        <div style={{ minHeight: TAB_PANEL_MIN_HEIGHT }}>
            <SectionHeader title="Player" subtitle="Fetches the data of the given username for the specific profile." />
            <div className="row g-3">
                <PlayerSearchPanel
                    username={username}
                    setUsername={setUsername}
                    fetching={fetching}
                    error={error}
                    profiles={profiles}
                    selectedProfile={selectedProfile}
                    fetchProfiles={fetchProfiles}
                    fetchProfile={fetchProfile}
                    showDebug={showDebug}
                    onToggleDebug={() => setShowDebug((v) => !v)}
                />

                <div className="col-6">
                    <PlayerDataViewer playerData={playerData} visible={showDebug} />
                </div>
            </div>
        </div>
    );
}

function PlayerToolTip(){
    return (
        <div style={{ minHeight: TAB_PANEL_MIN_HEIGHT }}
             className="d-flex align-items-center justify-content-center text-center">
                <span style={{ fontSize: "13px", color: "rgba(160, 170, 190, 0.85)" }}>
                    Fetch a player to see fortune data.
                </span>
        </div>
    );
}

function Fortune() {
    const { playerData, activeBonuses, toggleBonus } = usePlayerDataContext();

    if (!playerData) return <PlayerToolTip />;

    const fortuneEntry = playerData.fortune.breakthrough;
    const baseFortune = fortuneEntry.fortune.total;
    const TEMP = fortuneEntry.temporary.sources;

    const greenhouseEntry = playerData?.greenhouse;
    console.log("Greenhouse Entry:", greenhouseEntry);

    const activeTempTotal = Object.entries(TEMP)
        .filter(([key]) => activeBonuses[key] ?? true)
        .reduce((sum, [, v]) => sum + v, 0);

    const totalFortune = baseFortune + activeTempTotal;

    return (
        <div style={{ height: TAB_PANEL_MIN_HEIGHT, overflowY: "scroll", overflowX: "hidden" }}>
            <SectionHeader title="Farming Fortune" subtitle="Breakdown of Farming Fortune gained from each crop, plus any active temporary bonuses." />
            <InfoBadge label="Base Farming Fortune" value={totalFortune} icon={<HoeIcon />} />
            <SectionHeader title="Crop Fortune" subtitle="Each crop its calculated based on the correct tool" />
            <CropFortune />
            <SectionHeader title="Temporary Bonuses" subtitle="Select which temporary bonuses are active." />
            <InfoBadge label="Active Bonus Fortune" value={activeTempTotal} icon={<HoeIcon />} />
            <TemporaryFortune
                sources={TEMP}
                activeBonuses={activeBonuses}
                onToggle={toggleBonus}
            />
        </div>
    );
}

function CropFortune(){
    const {playerData} = usePlayerDataContext();

    const CropFortuneMap = []
    for (const [key, value] of Object.entries(playerData.fortune.breakthrough.cropFortune)) {
        CropFortuneMap.push({name: key, value: value.totalCropFortune});
    }
    return (
        <div className="row row-cols-5 g-2 mb-4">
            {CropFortuneMap.map((crop) => (
                <div key={crop.name} className="col">
                    <div
                        className="d-flex flex-row align-items-center justify-content-between gap-2 py-2 px-3 rounded-3"
                        style={{
                            background: "rgba(30, 34, 42, 0.95)",
                            border: "1px solid rgba(55, 65, 85, 0.6)",
                            cursor: "pointer",
                            transition: "background 0.15s, border-color 0.15s"
                        }}
                        onMouseEnter={hoverOn}
                        onMouseLeave={hoverOff}
                    >
                        <img
                            src={`/greenhouse/crops/${getCropImageName(crop.name)}.png`}
                            alt={crop.name} className="rounded-1"
                            style={{width: "36px", height: "36px", objectFit: "contain", imageRendering: "pixelated"}}/>
                        <Badge value={crop.value}/>
                    </div>
                </div>
            ))}
        </div>
    )
}

function TemporaryFortune({sources, activeBonuses, onToggle}: {
    sources: Record<string, number>;
    activeBonuses: Record<string, boolean>;
    onToggle: (key: string, value: boolean) => void; }) {
    return (
        <div className="row row-cols-3 g-2">
            {Object.entries(sources).map(([key]) => (
                <div key={key} className="col">
                    <EffectRow
                        label={key}
                        value={activeBonuses[key] ?? true}
                        onChange={(v) => onToggle(key, v)}
                    />
                </div>
            ))}
        </div>
    );
}

const crops = Array.from({ length: 13 }, (_, i) => ({ id: i + 1, name: "Wheat", current: "999" }));

const extraCrops = [
    { id: 1, name: "Normal Crops", current: "999" },
    { id: 2, name: "Pest Farming", current: "999" },
];


type LeaderboardCropEntry = {
    name: string;
    pb: number;
    lbGoal: number;
};

function CropIconDropdown({ options, value, onChange }: {
    options: string[];
    value: string;
    onChange: (value: string) => void;
}) {
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) return;
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [open]);

    return (
        <div ref={containerRef} className="position-relative d-inline-block">
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                title={value.replace(/_/g, " ")}
                className="d-inline-flex align-items-center justify-content-center rounded-2 border-0"
                style={{
                    width: "36px",
                    height: "36px",
                    background: "rgba(234, 179, 8, 0.15)",
                    border: "1px solid rgba(234, 179, 8, 0.4)",
                    cursor: "pointer",
                    padding: 0
                }}
            >
                <img
                    src={`/greenhouse/crops/${getCropImageName(value)}.png`}
                    alt={value}
                    className="rounded-1"
                    style={{ width: "24px", height: "24px", objectFit: "contain", imageRendering: "pixelated" }}
                />
            </button>

            {open && (
                <div
                    className="position-absolute rounded-2 p-2"
                    style={{
                        top: "calc(100% + 4px)",
                        left: 0,
                        zIndex: 20,
                        display: "grid",
                        gridTemplateColumns: "repeat(5, 1fr)",
                        gap: "6px",
                        background: "#1e2229",
                        border: "1px solid rgba(55, 65, 85, 0.7)",
                        boxShadow: "0 8px 20px rgba(0,0,0,0.4)",
                        width: "max-content"
                    }}
                >
                    {options.map((name) => (
                        <button
                            key={name}
                            type="button"
                            title={name.replace(/_/g, " ")}
                            onClick={() => {
                                onChange(name);
                                setOpen(false);
                            }}
                            className="d-inline-flex align-items-center justify-content-center rounded-2 border-0"
                            style={{
                                width: "36px",
                                height: "36px",
                                padding: 0,
                                cursor: "pointer",
                                background: name === value ? "rgba(234, 179, 8, 0.2)" : "transparent",
                                border: name === value ? "1px solid rgba(234, 179, 8, 0.5)" : "1px solid transparent"
                            }}
                            onMouseEnter={(e) => { if (name !== value) e.currentTarget.style.background = "rgba(55, 65, 85, 0.4)"; }}
                            onMouseLeave={(e) => { if (name !== value) e.currentTarget.style.background = "transparent"; }}
                        >
                            <img
                                src={`/greenhouse/crops/${getCropImageName(name)}.png`}
                                alt={name}
                                className="rounded-1"
                                style={{ width: "24px", height: "24px", objectFit: "contain", imageRendering: "pixelated" }}
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

function LeaderboardCurrentTarget() {
    const { leaderboardData, setTrackedCrop } = usePlayerDataContext();
    const cropNames = Object.keys(leaderboardData?.pb ?? {});
    const trackedCrop = leaderboardData?.currrentlyTracking;

    if (!cropNames.length) {
        return <InfoBadge label="Currently Tracking" value="#1" icon={<HoeIcon />} />;
    }

    const currentValue = trackedCrop && cropNames.includes(trackedCrop) ? trackedCrop : cropNames[0];

    return (
        <div className="d-inline-flex align-items-center gap-2 rounded-3 px-3 py-2 mb-4" style={{ background: "rgba(30, 34, 42, 0.95)", border: "1px solid rgba(55, 65, 85, 0.7)" }}>
            <span className="text-white" style={{ fontSize: "13px", fontWeight: 500, letterSpacing: "0.3px" }}>Currently Tracking</span>
            <CropIconDropdown options={cropNames} value={currentValue} onChange={setTrackedCrop} />
        </div>
    );
}

function LoadLeaderboardData() {
    const { leaderboardData, setCropGoal } = usePlayerDataContext();
    const pb = leaderboardData?.pb ?? {};
    const lbGoal = leaderboardData?.lbGoal ?? {};

    const leaderboardCrops: LeaderboardCropEntry[] = Object.entries(pb).map(
        ([name, pbValue]) => ({
            name,
            pb: pbValue as number,
            lbGoal: lbGoal[name] ?? 0,
        })
    );

    const handleGoalChange = (cropName: string, rawValue: string) => {
        const numericValue = rawValue === "" ? 0 : Number(rawValue);
        setCropGoal(cropName, numericValue);
    };

    return (
        <div className="row row-cols-3 g-2 mb-4">
            {leaderboardCrops.map((crop) => (
                <div key={crop.name} className="col">
                    <div className="d-flex align-items-center justify-content-between gap-2 px-3 py-2 rounded-3"
                         style={{background: "rgba(30, 34, 42, 0.95)", border: "1px solid rgba(55, 65, 85, 0.6)"}}>
                        <div className="d-flex align-items-center gap-2">
                            <img
                                src={`/greenhouse/crops/${getCropImageName(crop.name)}.png`}
                                style={{
                                    width: "28px",
                                    height: "28px",
                                    objectFit: "contain",
                                    imageRendering: "pixelated"
                                }}/>
                            <div className="d-flex flex-column">
                                <span className="fw-semibold"
                                      style={{fontSize: "13px", color: "#e5e7eb", lineHeight: "1.1"}}>{crop.name}</span>
                                <span className="fw-semibold"
                                      style={{fontSize: "11px", color: "#fde047"}}>Current: {crop.pb} M</span>
                            </div>
                        </div>
                        <div className="position-relative" style={{width: "80px"}}>
                            <input
                                type="number"
                                placeholder="Target"
                                value={crop.lbGoal || ""}
                                onChange={(e) => handleGoalChange(crop.name, e.target.value)}
                                className="rounded-2 text-end"
                                style={{
                                    width: "100%",
                                    background: "rgba(25, 29, 38, 0.95)",
                                    border: "1px solid rgba(55, 65, 85, 0.7)",
                                    padding: "4px 22px 4px 8px",
                                    color: "#e5e7eb",
                                    fontSize: "12px",
                                    outline: "none",
                                    textAlign:"left"
                                }}
                            />
                            <span
                                className="position-absolute"
                                style={{
                                    right: "8px",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    color: "#9ca3af",
                                    fontSize: "12px",
                                    pointerEvents: "none"
                                }}
                            >
                                M
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

function LeaderboardExtra() {
    return (
        <div className="row row-cols-3 g-2">
            {extraCrops.map((crop) => (
                <div key={crop.id} className="col">
                    <div className="d-flex align-items-center justify-content-between gap-2 px-3 py-2 rounded-3"
                         style={{background: "rgba(30, 34, 42, 0.95)", border: "1px solid rgba(55, 65, 85, 0.6)"}}>
                        <div className="d-flex align-items-center gap-2">
                            <img src="/temp/wheat.png" alt={crop.name} style={{
                                width: "28px",
                                height: "28px",
                                objectFit: "contain",
                                imageRendering: "pixelated"
                            }}/>
                            <div className="d-flex flex-column">
                                    <span className="fw-semibold" style={{
                                        fontSize: "13px",
                                        color: "#e5e7eb",
                                        lineHeight: "1.1"
                                    }}>{crop.name}</span>
                                <span className="fw-semibold"
                                      style={{fontSize: "11px", color: "#fde047"}}>Current: {crop.current}</span>
                            </div>
                        </div>
                        <input
                            type="number"
                            placeholder="Target"
                            className="rounded-2 text-end"
                            style={{
                                width: "80px",
                                background: "rgba(25, 29, 38, 0.95)",
                                border: "1px solid rgba(55, 65, 85, 0.7)",
                                padding: "4px 8px",
                                color: "#e5e7eb",
                                fontSize: "13px",
                                outline: "none"
                            }}
                        />
                    </div>
                </div>
            ))}
        </div>
    )
}

function Leaderboard() {
    const {username, confirmedUsername, playerData} = usePlayerDataContext();

    return (
        <div style={{height: TAB_PANEL_MIN_HEIGHT, overflowY: "scroll", overflowX: "hidden"}}>
            <SectionHeader title="API Leaderboard" subtitle="Most crops farmed during jacob contest."/>
            <LeaderboardCurrentTarget/>
            <LoadLeaderboardData/>
            {/*<SectionHeader title="Extra Crops"  subtitle="Extra crops that influence the leaderboard placement attempts"/>*/}
            {/*<LeaderboardExtra/>*/}
        </div>
    );
}

function GreenhousePills() {
    const {gardenCustomization} = usePlayerDataContext();
    let {growthSpeed, deskYield} = gardenCustomization;

    growthSpeed = (growthSpeed === 9) ? 50 : growthSpeed * 5;
    deskYield = (deskYield === 9) ? 20 : deskYield * 2;


    return (
        <div className="d-flex flex-wrap gap-2 mb-4">
            <InfoBadge label="Desk Growth Speed" value={growthSpeed + "%"}/>
            <InfoBadge label="Desk Yield" value={deskYield + "%"}/>
        </div>
    )
}

function CustomFactors() {
    const {gardenCustomization, setGardenCustomization} = usePlayerDataContext();

    const [crops, setCrops] = useState(gardenCustomization.uniqueCrops);
    const [cropEffectYield, setCropEffectYield] = useState(gardenCustomization.cropEffectYield);
    const [flasksPerDay, setFlasksPerDay] = useState(gardenCustomization.flasksPerDay);
    const [loginsPerDay, setLoginsPerDay] = useState(gardenCustomization.loginsPerDay);
    const [harvestsPerDay, setHarvestsPerDay] = useState(gardenCustomization.harvestsPerDay);
    const [priority, setPriority] = useState(gardenCustomization.priority ?? "Profit");

    useEffect(() => {
        setGardenCustomization((prev) => ({
            ...prev,
            uniqueCrops: crops,
            cropEffectYield,
            flasksPerDay,
            loginsPerDay,
            harvestsPerDay,
            priority,
        }));
    }, [crops, cropEffectYield, flasksPerDay, loginsPerDay, harvestsPerDay, priority]);

    const fieldMap: Record<string, [number, (v: number) => void]> = {
        "Unique Crops": [crops, setCrops],
        "Crop Effect Yield": [cropEffectYield, setCropEffectYield],
        "Flasks Per Day": [flasksPerDay, setFlasksPerDay],
        "Login(s) Per Day": [loginsPerDay, setLoginsPerDay],
        "Harvests Per Day": [harvestsPerDay, setHarvestsPerDay],
    };

    return (
        <div className="row row-cols-3 g-2 mb-4">
            {["Unique Crops", "Crop Effect Yield", "Flasks Per Day", "Login(s) Per Day", "Harvests Per Day", "Priority"].map((label) => (
                <div key={label} className="col">
                    <div className="d-flex align-items-center justify-content-between gap-2 px-3 py-2 rounded-3"
                         style={{background: "rgba(30, 34, 42, 0.95)", border: "1px solid rgba(55, 65, 85, 0.6)"}}>
                        <span className="text-truncate" style={{fontSize: "13px", fontWeight: 500, color: "rgba(200, 210, 230, 0.9)", letterSpacing: "0.2px"}}>
                            {label}
                        </span>
                        {label === "Priority" ? (
                            <select
                                value={priority}
                                onChange={(e) => setPriority(e.target.value)}
                                className="rounded-2 px-2 py-1"
                                style={{fontSize: "12px", fontWeight: 600, background: "rgba(25, 29, 38, 0.95)", color: "#e5e7eb", border: "1px solid rgba(55, 65, 85, 0.7)", cursor: "pointer", outline: "none", flexShrink: 0}}
                            >
                                <option value="Collection">Collection</option>
                                <option value="Profit">Profit</option>
                                <option value="Sowdust">Sowdust</option>
                                <option value="PB">Personal Bests</option>
                            </select>
                        ) : (
                            <input
                                type="number"
                                min={0}
                                placeholder="0"
                                value={fieldMap[label][0]}
                                onChange={(e) => fieldMap[label][1](Number(e.target.value))}
                                className="rounded-2 text-end"
                                style={{width: "70px", background: "rgba(25, 29, 38, 0.95)", border: "1px solid rgba(55, 65, 85, 0.7)", padding: "2px 6px", color: "#e5e7eb", fontSize: "13px", outline: "none"}}
                            />
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}

function CropEffects(){
    return (
        <div className="row row-cols-3 g-2">
            {Object.entries(CROP_EFFECTS).map(([key]) => (
                <div key={key} className="col">
                    <EffectRow label={key}/>
                </div>
            ))}
        </div>
    )
}

function Greenhouse() {
    return (
        <div style={{height: TAB_PANEL_MIN_HEIGHT, overflowX: "hidden"}}>
            <SectionHeader title="Greenhouse" subtitle="All the greenhouse modifiers."/>
            <GreenhousePills/>
            <SectionHeader title="Custom Factors" subtitle="Enter the correct values below to estimate your result."/>
            <CustomFactors />
        </div>
    );
}

function Extras() {
    return <div style={{minHeight: TAB_PANEL_MIN_HEIGHT}}>
        <SectionHeader title="Extra Section" subtitle="Coming soon :)."/>
    </div>
}

export function Profile() {
    const navigate = useNavigate();
    const { username, confirmedUsername, playerData } = usePlayerDataContext();

    const profileTabs = [
        { key: "player", title: "Player", component: <Player /> },
        { key: "stats", title: "Fortune", component: <Fortune /> },
        { key: "gh", title: "Greenhouse", component: <Greenhouse /> },
        { key: "leaderboard", title: "Leaderboard", component: <Leaderboard /> },
        // { key: "panels", title: "Extras", component: <Extras /> },
    ];

    return (
        <div data-bs-theme="dark">
            <Navbar />
            <div
                className="min-vh-100 d-flex flex-column align-items-center justify-content-center p-3"
                style={{ backgroundColor: "#0a0b0f" }}
            >
                <div
                    className="container rounded-3 p-4"
                    style={{ backgroundColor: "#12151c", border: "1px solid #2d3341" }}
                >
                    <div className="d-flex gap-4 align-items-stretch">
                        <Sidebar username={playerData ? confirmedUsername : undefined} />

                        <div className="flex-grow-1 min-w-0">
                            <Tabs defaultActiveKey="player" className="mb-3">
                                {profileTabs.map((tab) => (
                                    <Tab
                                        key={tab.key}
                                        eventKey={tab.key}
                                        title={tab.title}
                                    >
                                        {tab.component}
                                    </Tab>
                                ))}
                            </Tabs>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}