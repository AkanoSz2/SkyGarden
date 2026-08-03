import {TabIcons} from "../data/constants.ts";
import {LuX} from "react-icons/lu";
import type {TabButtonProps} from "../types.ts";
import {IoAddOutline} from "react-icons/io5";

export function RenderIcons({iconName}: { iconName?: string }) {
    const found = TabIcons.find(i => i.name === iconName);
    const IconComponent = found?.icon ?? LuX;

    return <IconComponent />;
}

export function TabButton({tabKey, active, setActive, onDelete, iconName}: TabButtonProps) {
    const isActive = active === tabKey;

    return (
        <button
            onClick={() => setActive(tabKey)}
            className={`btn btn-sm rounded-top-3 rounded-bottom-0 border-bottom-0 px-3 py-2 d-flex align-items-center gap-2 ${
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
            {onDelete && (
                <span
                    role="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete();
                    }}
                    className="text-secondary"
                    style={{fontSize: "13px", lineHeight: 1}}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#f87171")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "")}
                    title="Delete tab and all after it"
                >
                    <RenderIcons iconName={iconName}/>
                </span>
            )}
            {iconName == "final" && (
                <span
                    style={{fontSize: "13px", lineHeight: 1}}
                    title="Final tab"
                >
                    <RenderIcons iconName={iconName}/>
                </span>
            )}
        </button>
    );
}

export function AddTabButton({onClick}: { onClick: () => void }) {
    return (
        <button
            className="btn btn-sm btn-link text-secondary align-self-center ms-1 fs-5 text-decoration-none"
            onClick={onClick}
        >
            <IoAddOutline/>
        </button>
    );
}
