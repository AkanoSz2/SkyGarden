import "bootstrap/dist/css/bootstrap.min.css";
import { Navbar, Footer } from "../components/ui";
import {useState} from "react";

import {GreenhouseLayout} from "../features/greenhouse";

import {InputCrops} from "../features/greenhouse/components/InputCrops.tsx";
import {SidebarHelper} from "../features/greenhouse/components/SidebarHelper.tsx";
import {Generator} from "../features/generator/components/Generator.tsx";
import {PlayerDataProvider} from "../context/PlayerDataContext.tsx";

import {CropFilterHelper, RatesPanel, TotalCollection} from "../features/calculator/components/RatesPanel.tsx";
import {type GeneratorItem} from "../features/generator/types.ts";
import {emptyGrid} from "../features/greenhouse/scripts/placement.ts";

import {GreenhouseDataLayoutProvider} from "../context/GreenhouseDataLayoutContext.tsx";

import {type GreenhouseTabData} from "../features/greenhouse";

export function Greenhouse() {

    const [selectedType, setSelectedType] = useState<string>("input");
    const [selectedCrop, setSelectedCrop] = useState<string | undefined>();
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [clearGrid, setClearGrid] = useState<boolean>(false);
    const [clearGridType, setClearGridType] = useState<string | undefined>();

    const [generateTrigger, setGenerateTrigger] = useState<boolean>(false);
    const [generatorItems, setGeneratorItems] = useState<GeneratorItem[]>([]);

    const [greenhouseTabData, setGreenhouseTabData] = useState<GreenhouseTabData[]>([
        {id: 1, cells: emptyGrid(), placements: []},
    ]);


    const handleSelectCrop = (crop?: string) =>
        setSelectedCrop(prev => prev === crop ? undefined : crop);

    return (
        <PlayerDataProvider>
            <GreenhouseDataLayoutProvider greenhouseTabData={greenhouseTabData}>
                <div data-bs-theme="dark" className="bg-dark">
                    <Navbar/>
                    <div
                        className="mx-auto d-flex gap-2 mb-5 justify-content-evenly align-items-start flex-nowrap"
                        style={{padding: "10px 20px", userSelect: "none"}}
                    >
                        <div
                            style={{width: "20%", flexShrink: 0, marginTop: "40px"}}
                            className="d-flex flex-column gap-3"
                        >
                            <SidebarHelper
                                selectedType={selectedType}
                                setSelectedType={setSelectedType}
                                clearGrid={clearGrid}
                                setClearGrid={setClearGrid}
                                clearGridType={clearGridType}
                                setClearGridType={setClearGridType}
                            />
                            <Generator
                                items={generatorItems}
                                onItemsChange={setGeneratorItems}
                                generateTrigger={generateTrigger}
                                setGenerateTrigger={setGenerateTrigger}
                            />
                        </div>
                        <div style={{width: "40%", flexShrink: 0}}>
                            <GreenhouseLayout
                                selectedCrop={selectedCrop}
                                hoveredIndex={hoveredIndex}
                                setHoveredIndex={setHoveredIndex}
                                selectedType={selectedType}
                                clearGrid={clearGrid}
                                setClearGrid={setClearGrid}
                                clearGridType={clearGridType}

                                generateTrigger={generateTrigger}
                                setGenerateTrigger={setGenerateTrigger}
                                generatorItems={generatorItems}
                                setGeneratorItems={setGeneratorItems}

                                greenhouseTabData={greenhouseTabData}
                                setGreenhouseTabData={setGreenhouseTabData}
                            />
                        </div>
                        <div style={{width: "30%", flexShrink: 0, marginTop: "40px"}}>
                            <InputCrops
                                selectedCrop={selectedCrop}
                                setSelectedCrop={handleSelectCrop}
                                setHoveredIndex={function (): void {
                                    throw new Error("Function not implemented.");
                                }}/>
                        </div>
                    </div>
                    <div
                        className="mx-auto d-flex gap-2 mb-5 justify-content-evenly align-items-start flex-nowrap"
                        style={{padding: "10px 20px", userSelect: "none"}}
                    >
                        <div
                            style={{width: "20%", flexShrink: 0}}
                            className="d-flex flex-column gap-3"
                        >
                            <CropFilterHelper/>
                        </div>
                        <div style={{width: "40%", flexShrink: 0}}>
                            <RatesPanel
                                selectedCrop={selectedCrop}
                                setSelectedCrop={handleSelectCrop}
                                hoveredIndex={hoveredIndex}
                                setHoveredIndex={setHoveredIndex}
                            />
                        </div>
                        <div style={{width: "30%", flexShrink: 0}}>
                            <TotalCollection
                            />
                        </div>
                    </div>
                    <Footer/>
                </div>
            </GreenhouseDataLayoutProvider>
        </PlayerDataProvider>
    );
}