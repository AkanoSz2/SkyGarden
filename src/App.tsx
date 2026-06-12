import { useState } from "react";

import "bootstrap/dist/css/bootstrap.min.css";
import { InputCrops, GreenhouseLayout, Stats } from "./components/calculator";

import { Navbar, Footer } from "./components/ui";
import {RatesPanel} from "./components/leaderboard";

function App() {
    const [selectedCrop, setSelectedCrop] = useState<string | undefined>();
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [cells, setCells] = useState<string[]>(Array(100).fill("empty"));

    return (
        <div data-bs-theme="dark">
            <Navbar />

            <div className="w-100 bg-dark py-4" style={{ minHeight: "100vh" }}>
                <div
                    className="mx-auto d-flex gap-2 mb-5 justify-content-evenly align-items-start flex-nowrap"
                    style={{
                        width: "100%",
                        maxWidth: "100%",
                        padding: "0 20px",
                        userSelect: "none",
                    }}
                >
                    {/* Stats */}
                    <div style={{ width: "20%", flexShrink: 0 }}>
                        <Stats />
                    </div>

                    {/* Greenhouse */}
                    <div style={{ width: "40%", flexShrink: 0,  position: "relative" }}>
                        <GreenhouseLayout
                            cells={cells}
                            selectedCrop={selectedCrop}
                            hoveredIndex={hoveredIndex}
                            setCells={setCells}
                            setHoveredIndex={setHoveredIndex}
                        />
                        {/*<GreenhouseLayoutOverlay />*/}
                    </div>

                    {/* InputCrops */}
                    <div style={{ width: "30%", flexShrink: 0 }}>
                        <InputCrops
                            selectedCrop={selectedCrop}
                            setSelectedCrop={setSelectedCrop}
                            setHoverCropedIndex={setHoveredIndex}
                        />
                    </div>
                </div>

                {/* TABLE SECTION */}
                <div
                    className="mx-auto d-flex flex-column justify-content-center"
                    style={{
                        width: "100%",
                        padding: "0 40px",
                        gap: "12px",
                    }}
                >
                    <RatesPanel />
                </div>
            </div>
            <Footer />
        </div>

    );
}
export default App;