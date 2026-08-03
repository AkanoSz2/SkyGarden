import type {GridCellProps} from "../types.ts";
import {formatCropName} from "../../shared/scripts/CropData.ts";

export function GridCell({
                             baseId,
                             isEmpty,
                             isPreview,
                             selectedCrop,
                             border,
                             colors,
                             onMouseDown,
                             onMouseEnter,
                             onMouseLeave,
                             onContextMenu,
                         }: GridCellProps) {
    return (
        <div
            className="ratio ratio-1x1"
            onMouseDown={onMouseDown}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onContextMenu={onContextMenu}
        >
            <div
                className="border border-1 rounded overflow-hidden d-flex align-items-center justify-content-center p-1"
                style={{
                    borderColor: isPreview ? "#720bd6" : isEmpty ? "#475569" : border,
                    backgroundColor: isPreview ? "#720bd6" : isEmpty ? "#00000000" : border,
                    boxShadow: isPreview
                        ? "0 0 12px #a855f760"
                        : isEmpty ? "none" : `0 0 8px ${colors.border}60`,
                    opacity: isPreview ? 0.9 : 1,
                    transition: "all 0.08s ease-in-out",
                }}
            >
                {(baseId || (isPreview && selectedCrop)) && (
                    <img
                        src={`/greenhouse/crops/${baseId ?? selectedCrop}.png`}
                        alt={formatCropName(baseId ?? selectedCrop!)}
                        style={{
                            width: "100%", height: "100%",
                            objectFit: "contain",
                            imageRendering: "pixelated",
                            opacity: isPreview && baseId ? 0.4 : isPreview ? 0.9 : 1,
                        }}
                    />
                )}
            </div>
        </div>
    );
}