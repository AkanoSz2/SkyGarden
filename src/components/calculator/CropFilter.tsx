import { type Rarity } from "../shared/CropData";
import { StyledDropdown, type DropdownItem } from "../ui/StyledDropdown";

type CropFilterProps = {
    search: string;
    onSearchChange: (value: string) => void;
    selectedRarity: "all" | Rarity;
    onRarityChange: (rarity: "all" | Rarity) => void;
};

const RARITIES: ("all" | Rarity)[] = [
    "all",
    "crops",
    "common",
    "uncommon",
    "rare",
    "epic",
    "legendary"
];


const rarityItems: DropdownItem[] = RARITIES.map(r => ({
    name: r === "all" ? "All Rarities" : r,
    img: "/greenhouse/crops/dead_plant" // I should prob swap later with somehting nicher
}));

export function CropFilter({
                               search,
                               onSearchChange,
                               selectedRarity,
                               onRarityChange,
                           }: CropFilterProps) {

    const selectedItem: DropdownItem =
        rarityItems.find(i =>
            selectedRarity === "all"
                ? i.name === "All Rarities"
                : i.name === selectedRarity
        ) ?? rarityItems[0];

    const handleChange = (item: DropdownItem) => {
        const value = item.name === "All Rarities"
            ? "all"
            : item.name;

        onRarityChange(value as "all" | Rarity);
    };

    return (
        <nav className="navbar p-3 shadow-sm bg-body-tertiary">
            <div className="d-flex w-100 gap-2">

                {/* Search */}
                <div className="flex-grow-1">
                    <input
                        className="form-control form-control-sm"
                        placeholder="Search crops..."
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>

                <StyledDropdown
                    items={rarityItems}
                    value={selectedItem}
                    onChange={handleChange}
                />

            </div>
        </nav>
    );
}