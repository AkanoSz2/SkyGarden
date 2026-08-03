import {legendItems} from "../data/constants.ts";

export function Legend() {
    return (
        <div className="d-flex gap-3 flex-wrap">
            {Object.values(legendItems).map(item => (
                <div key={item.id} className="d-flex align-items-center gap-1 text-white fs-6">
                    <div
                        style={{
                            width: "15px",
                            height: "15px",
                            backgroundColor: item.color,
                            borderRadius: "4px",
                        }}
                    />
                    <span>{item.label}</span>
                </div>
            ))}
        </div>
    );
}
