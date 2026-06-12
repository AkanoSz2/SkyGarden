export function CropList() {
    const crops = [
        {
            id: 1,
            name: "Dead Plant",
            icon: "/greenhouse/crops/dead_plant.png",
            drops: {},
            stage: 1,
            mutations: 0,
        },
        {
            id: 2,
            name: "Wheat",
            icon: "/greenhouse/crops/wheat.png",
            drops: { wheat: 2 },
            stage: 3,
            mutations: 1,
        },
        {
            id: 3,
            name: "Carrot",
            icon: "/greenhouse/crops/carrot.png",
            drops: { carrot: 1 },
            stage: 5,
            mutations: 2,
        },
        {
            id: 4,
            name: "Thunderling",
            icon: "/greenhouse/crops/thunderling.png",
            drops: {
                cactus: 900,
                melon: 2400,
                wild_rose: 2400,
            },
            stage: 1,
            mutations: 0,
        },
    ];
    return (
        <div className="h-100 border border-secondary">
            <table className="table table-striped align-middle border border-secondary mb-0">
                <thead className="table-dark">
                <tr>
                    <th
                        colSpan={6}
                        className="text-center py-3 fs-5 fw-bold"
                        style={{
                            backgroundColor: "#111",
                            borderBottom: "2px solid #444",
                        }}
                    >
                        Crop List
                    </th>
                </tr>

                <tr>
                    <th>Icon</th>
                    <th>Name</th>
                    <th>Drops</th>
                    <th style={{ width: "100px" }}>Stage</th>
                    <th style={{ width: "120px" }}>Mutations</th>
                    <th style={{ width: "50px" }}></th>
                </tr>
                </thead>

                <tbody>
                {crops.map((crop) => (
                    <tr key={crop.id}>
                        {/* ICON */}
                        <td>
                            <img
                                src={crop.icon}
                                alt={crop.name}
                                width={40}
                                height={40}
                                style={{
                                    objectFit: "contain",
                                    imageRendering: "pixelated",
                                }}
                            />
                        </td>

                        {/* NAME */}
                        <td>{crop.name}</td>

                        {/* DROPS */}
                        <td>
                            <div style={{ fontSize: "11px", lineHeight: "1.2" }}>
                                {Object.keys(crop.drops).length === 0 ? (
                                    <span style={{ color: "#888" }}>Nothing</span>
                                ) : (
                                    Object.entries(crop.drops).map(([key, value]) => (
                                        <div key={key}>
                                            {key}: {value}
                                        </div>
                                    ))
                                )}
                            </div>
                        </td>

                        {/* STAGE */}
                        <td>
                            <select
                                className="form-select form-select-sm"
                                style={{ width: "80px" }}
                                defaultValue={crop.stage}
                            >
                                {[...Array(10)].map((_, i) => (
                                    <option key={i + 1} value={i + 1}>
                                        {i + 1 === 10 ? "MAX" : i + 1}
                                    </option>
                                ))}
                            </select>
                        </td>

                        {/* MUTATIONS */}
                        <td>
                            <input
                                type="number"
                                className="form-control form-control-sm"
                                style={{ width: "70px" }}
                                defaultValue={crop.mutations}
                            />
                        </td>

                        {/* DELETE */}
                        <td className="text-end">
                            <button
                                className="btn btn-sm"
                                style={{
                                    background: "none",
                                    border: "none",
                                    color: "#888",
                                    cursor: "pointer",
                                }}
                            >
                                <i className="fas fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {/*<div className="d-flex justify-content-center mt-3">*/}
            {/*    /!*<button*!/*/}
            {/*    /!*    className="btn btn-sm mb-2"*!/*/}
            {/*    /!*    style={{*!/*/}
            {/*    /!*        backgroundColor: "#000",*!/*/}
            {/*    /!*        color: "#fff",*!/*/}
            {/*    /!*        padding: "6px 16px",*!/*/}
            {/*    /!*        borderRadius: "6px",*!/*/}
            {/*    /!*        border: "none",*!/*/}
            {/*    /!*    }}*!/*/}
            {/*    /!*>*!/*/}
            {/*    /!*    + Add Mutation*!/*/}
            {/*    /!*</button>*!/*/}
            {/*</div>*/}
        </div>
    );
}