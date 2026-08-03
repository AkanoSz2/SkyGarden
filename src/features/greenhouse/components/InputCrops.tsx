import {useState, useEffect} from "react";
import {
    CropRarityMap,
    initializeCropData,
    type Rarity,

    formatCropName
} from "../../shared/scripts/CropData.ts";

import type {
    RarityItem,
    Props,
} from "../types.ts";

import {InputCropMap} from "./InputCropMap.tsx";


export function InputCrops({
                               selectedCrop,
                               setSelectedCrop,
                           }: Props) {

    const [search, setSearch] = useState("");
    const [selectedRarity, setSelectedRarity] = useState<"all" | Rarity>("all");

    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        initializeCropData()
            .then(() => setIsLoaded(true))
            .catch((err) => {
                console.error(err);
                setError("Failed to load crop data");
            });
    }, []);

    if (error) {
        return <div className="alert alert-danger p-2 m-2">Error: {error}</div>;
    }

    if (!isLoaded) {
        return (
            <div
                className="d-flex align-items-center justify-content-center text-white"
                style={{
                    backgroundColor: "#0f172a",
                    height: "100%",
                    minHeight: "550px",
                    width: "100%",
                }}
            >
                Loading crops...
            </div>
        );
    }

    const rarityItems: RarityItem[] = (["all", ...Object.keys(CropRarityMap)] as ("all" | Rarity)[])
        .map((r) => ({
            name: r.charAt(0).toUpperCase() + r.slice(1),
            img: "",
            value: r
        }));

    const normalizedSearch = search.trim().toLowerCase();

    const matchesSearch = (id: string) => {
        if (!normalizedSearch) return true;
        return (
            id.toLowerCase().includes(normalizedSearch) ||
            formatCropName(id).toLowerCase().includes(normalizedSearch)
        );
    };

    const baseSections = selectedRarity === "all"
        ? Object.entries(CropRarityMap).map(([key, value]) => ({
            title: key,
            data: value,
        }))
        : [{
            title: selectedRarity,
            data: CropRarityMap[selectedRarity],
        }];

    const filteredSections = baseSections
        .map(section => ({
            ...section,
            data: section.data.filter(matchesSearch),
        }))
        .filter(section => section.data.length > 0);

    return (
        <div
            className="d-flex flex-column border border-[#334155] overflow-hidden"
            style={{
                width: "100%",
                height: "750px",
                minHeight: 0,
                backgroundColor: "#0f172a",
                overscrollBehavior: "none",
            }}
        >
            <div className="p-3 border-bottom border-[#334155]">
                <div className="d-flex align-items-center gap-2">
                    <input
                        type="text"
                        className="form-control bg-[#1e2937] border-0 text-light"
                        placeholder="Search..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <select
                        className="form-select bg-[#1e2937] border-0 text-light"
                        style={{width: "170px"}}
                        value={selectedRarity}
                        onChange={(e) => setSelectedRarity(e.target.value as "all" | Rarity)}
                    >
                        {rarityItems.map((item) => (
                            <option key={item.value} value={item.value}>
                                {item.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="flex-grow-1 overflow-auto p-2" style={{minHeight: 0}}>
                {filteredSections.map((section) => (
                    <div key={section.title}>
                        <InputCropMap
                            title={section.title}
                            cells={section.data}
                            onCropClick={setSelectedCrop}
                            selectedCrop={selectedCrop}
                        />
                    </div>
                ))}

                {search && filteredSections.length === 0 && (
                    <div className="text-center text-muted py-5">
                        No crops found for <strong>"{search}"</strong>
                    </div>
                )}
            </div>
        </div>
    );
}