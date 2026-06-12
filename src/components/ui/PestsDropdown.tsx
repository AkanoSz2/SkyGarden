import { useState } from "react";
import { StyledDropdown } from "./StyledDropdown.tsx";

const pests = [
    { name: "Beetle", img: "/greenhouse/pests/beetle.png" },
    { name: "Cricket", img: "/greenhouse/pests/cricket.png" },
    { name: "Dragonfly", img: "/greenhouse/pests/dragonfly.png" },
    { name: "Earthworm", img: "/greenhouse/pests/earthworm.png" },
    { name: "Fly", img: "/greenhouse/pests/fly.png" },
    { name: "Locust", img: "/greenhouse/pests/locust.png" },
    { name: "Mite", img: "/greenhouse/pests/mite.png" },
    { name: "Mosquito", img: "/greenhouse/pests/mosquito.png" },
    { name: "Moth", img: "/greenhouse/pests/moth.png" },
    { name: "Praying Mantis", img: "/greenhouse/pests/praying_mantis.png" },
    { name: "Rat", img: "/greenhouse/pests/rat.png" },
    { name: "Slug", img: "/greenhouse/pests/slug.png" }
];

export function PestDropdown() {
    const [selected, setSelected] = useState(pests[9]);

    return (
        <StyledDropdown
            items={pests}
            value={selected}
            onChange={(item) => setSelected(item)}
        />
    );
}