import Button from "react-bootstrap/Button";
import Select from "react-select";

import {
    formatCropName,
    CropRarityMap,
} from "../../shared/scripts/CropData.ts";

import {
    LuArrowDownUp,
    LuRefreshCw,
    LuSparkles,
    LuTrash2,
    LuPlus,
} from "react-icons/lu";

import type {
    GeneratorItem,
    GeneratorProps,
    ItemProps,
} from  "../types.ts"


import {
    initialItems
} from "../data/constants"


function GeneratorItemContent({
                                  item,
                                  onChange,
                                  onDelete,
                              }: ItemProps) {

    const CropOptions = []
    for (const [crops] of Object.entries(CropRarityMap)) {
        for(const crop of CropRarityMap[crops]) {
            CropOptions.push({
                value: crop,
                label: formatCropName(crop),
            })
        }
    }

    return (
        <div
            className="border rounded p-3"
            style={{
                backgroundColor: "#1a2236",
                borderColor: "#2a3044",
            }}
        >
            <div className="d-flex align-items-center gap-2 mb-2">
                <img
                    src={`public/greenhouse/crops/${item.crop}.png`}
                    alt={item.crop}
                    width={40}
                    height={40}
                    className="rounded"
                    style={{
                        objectFit: "cover",
                        flexShrink: 0,
                    }}
                />

                <Select
                    options={CropOptions}
                    value={CropOptions.find(option => option.value === item.crop)}
                    onChange={(selectedOption) => {
                        if (selectedOption) {
                            onChange({
                                ...item,
                                crop: selectedOption.value,
                            });
                        }
                    }}
                    formatOptionLabel={(option) => (
                        <div className="d-flex align-items-center">
                            <img
                                src={`public/greenhouse/crops/${option.value}.png`}
                                alt={option.label}
                                width={20}
                                height={20}
                                style={{ marginRight: 8 }}
                            />
                            <span>{option.label}</span>
                        </div>
                    )}
                    styles={{
                        container: (provided) => ({
                            ...provided,
                            width: "65%",
                            flexShrink: 0,
                            overscrollBehavior: "none",
                        }),
                        control: (provided) => ({
                            ...provided,
                            backgroundColor: "#0f172a",
                            borderColor: "#2a3044",
                            color: "#e2e6f0",
                            minHeight: "38px",
                        }),
                        singleValue: (provided) => ({
                            ...provided,
                            color: "#e2e6f0",
                        }),
                        menu: (provided) => ({
                            ...provided,
                            backgroundColor: "#0f172a",
                            borderColor: "#2a3044",
                        }),
                        option: (provided, state) => ({
                            ...provided,
                            backgroundColor: state.isSelected
                                ? "#3b82f6"
                                : state.isFocused
                                    ? "#1e293b"
                                    : "#0f172a",
                            color: state.isSelected ? "#ffffff" : "#e2e6f0",
                        }),
                    }}
                />

                <Button
                    variant="outline-secondary"
                    className="d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{
                        width: 40,
                        height: 38,
                        backgroundColor: "#0f172a",
                        borderColor: "#2a3044",
                        color: "#8b93a7",
                    }}
                    onClick={onDelete}
                >
                    <LuTrash2 size={15} />
                </Button>
            </div>

            <div className="d-flex align-items-center gap-2 mb-2">
                <input
                    type="text"
                    placeholder="Amount (1 by default)"
                    defaultValue={1}
                    value={item.amount}
                    onChange={(e) =>
                        onChange({
                            ...item,
                            amount: e.target.value,
                        })
                    }
                    style={{
                        width: 100,
                        backgroundColor: "#0f172a",
                        border: "1px solid #2a3044",
                        borderRadius: 6,
                        color: "#e2e6f0",
                        padding: "0.375rem 0.75rem",
                        flex: 1,
                    }}
                />

                <Button
                    variant="outline-secondary"
                    style={{
                        backgroundColor: "#0f172a",
                        borderColor: "#2a3044",
                        color: "#8b93a7",
                    }}
                >
                    Max
                </Button>
            </div>

            <div className="d-flex align-items-center gap-2">
                <LuArrowDownUp
                    size={16}
                    className="text-white"
                />

                <span
                    style={{
                        color: "#8b93a7",
                        fontSize: "0.9rem",
                    }}
                >
                    Priority
                </span>

                <input
                    type="number"
                    value={item.priority}
                    onChange={(e) =>
                        onChange({
                            ...item,
                            priority: e.target.value,
                        })
                    }
                    style={{
                        width: 60,
                        backgroundColor: "#0f172a",
                        border: "1px solid #2a3044",
                        borderRadius: 6,
                        color: "#e2e6f0",
                        padding: "0.375rem 0.5rem",
                    }}
                />
            </div>
        </div>
    );
}


export function Generator({ items, onItemsChange, generateTrigger, setGenerateTrigger }: GeneratorProps) {
    const updateItem = (id: string, updated: GeneratorItem) => {
        onItemsChange(items.map((i) => (i.id === id ? updated : i)));
    };

    const deleteItem = (id: string) => {
        onItemsChange(items.filter((i) => i.id !== id));
    };

    const addItem = () => {
        const firstCrop = Object.values(CropRarityMap)[0][0];
        onItemsChange([
            ...items,
            {
                id: crypto.randomUUID(),
                crop: firstCrop,
                amount: 1,
                priority: `${items.length + 1}`,
            },
        ]);
    };


    const sortedList = items.sort((a, b) => b.priority - a.priority);

    return (
        <div
            className="overflow-hidden border rounded w-100 p-3"
            style={{
                backgroundColor: "#0f172a",
                borderColor: "#2a3044",
            }}
        >
            <div className="d-flex align-items-center justify-content-between mb-3">
                <p
                    className="mb-0"
                    style={{
                        color: "#8b93a7",
                        fontSize: "0.95rem",
                    }}
                >
                    Automatically generates a layout.
                </p>

                <Button
                    variant="outline-secondary"
                    size="sm"
                    className="d-flex align-items-center gap-2"
                    style={{
                        backgroundColor: "#0f172a",
                        borderColor: "#2a3044",
                        color: "#8b93a7",
                    }}
                    onClick={() => onItemsChange(initialItems)}
                >
                    <LuRefreshCw size={14} />
                    Reset
                </Button>
            </div>

            <div className="d-flex flex-column gap-3 overflow-x-hidden"
            style={{
                minHeight: "200px",
                maxHeight: "400px",
                overscrollBehavior: "none",
                overflowY: items.length > 2 ? "scroll" : "hidden",
            }}>
                {items.length === 0 && (
                    <div
                        className="d-flex align-items-center justify-content-center text-white"
                        style={{
                            height: "150px",
                            fontSize: "0.95rem",
                        }}
                    >
                        No items added yet.
                    </div>
                )}

                {sortedList.map((item) => (
                    <GeneratorItemContent
                        key={item.id}
                        item={item}
                        onChange={(updated) => updateItem(item.id, updated)}
                        onDelete={() => deleteItem(item.id)}
                    />
                ))}
            </div>

            <Button
                variant="outline-secondary"
                className="w-100 d-flex align-items-center justify-content-center gap-2 mt-3"
                style={{
                    backgroundColor: "transparent",
                    borderColor: "#2a3044",
                    color: "#8b93a7",
                }}
                onClick={addItem}
            >
                <LuPlus size={16} />
                Add item
            </Button>

            <hr className="m-0 text-white mt-3" />

            <Button
                type="button"
                className="w-100 d-flex align-items-center justify-content-center gap-2 mt-3"
                style={{ backgroundColor: "#2e9c2a", borderColor: "#3b82f6", color: "#ffffff" }}
                onClick={() => {
                    setGenerateTrigger?.(true);
                }}
            >
                <LuSparkles size={16} />
                Generate layout
            </Button>
        </div>
    );
}