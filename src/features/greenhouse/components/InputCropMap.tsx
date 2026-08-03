import type {MapGridProps} from "../types.ts";
import {getCrop, getMutation, RarityColors} from "../../shared";
import {formatCropName} from "../../shared/scripts/CropData.ts";

export function InputCropMap({cells, title, onCropClick, selectedCrop}: MapGridProps) {
    return (
        <div className="mb-3">
            {title && (
                <h6 className="text-white mb-2 text-uppercase fw-bold">
                    {title}
                </h6>
            )}

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(65px, 1fr))",
                    gap: "8px",
                }}
            >
                {cells.map((cell) => {
                    const mutation = getMutation(cell);
                    const rarity =
                        (mutation?.rarity || "crops") as keyof typeof RarityColors;
                    const colors = RarityColors[rarity];

                    const displayName = formatCropName(cell);
                    const ground = getMutation(cell)?.ground || getCrop(cell)?.ground;
                    return (
                        <div
                            key={cell}
                            className="border rounded hover-effect"
                            style={{
                                aspectRatio: "1 / 1",
                                display: "flex",
                                flexDirection: "column",
                                // backgroundColor: colors.bg,
                                // backgroundImage: `url(/greenhouse/ground/${ground}.png)`,
                                backgroundSize: "cover",
                                boxShadow: selectedCrop === cell
                                    ? `0 0 10px ${colors.border}, 0 0 18px ${colors.border}55`
                                    : `0 2px 6px rgba(0,0,0,0.4)`,
                                overflow: "hidden",
                            }}
                            onClick={() => onCropClick?.(cell)}
                        >
                            <div
                                style={{
                                    flex: 1,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    padding: "4px",
                                    minHeight: 0,
                                }}
                            >
                                <img
                                    src={`/greenhouse/crops/${cell}.png`}
                                    alt={displayName}
                                    style={{
                                        width: "78%",
                                        height: "78%",
                                        objectFit: "contain",
                                        imageRendering: "pixelated",
                                    }}
                                    onError={(e) => {
                                        e.currentTarget.src = "/greenhouse/crops/dead_plant.png";
                                    }}
                                />
                            </div>

                            <div
                                style={{
                                    height: "18px",
                                    flexShrink: 0,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "11px",
                                    lineHeight: "1",
                                    padding: "0 2px",
                                    color: colors.text,
                                    fontWeight: "bol",
                                    textShadow: "0 0 2px rgba(0,0,0,0.8)",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                }}
                                title={displayName}
                            >
                                {displayName}
                            </div>
                        </div>);
                })}
            </div>

            <hr className="my-3 border-secondary"/>
        </div>
    );
}
