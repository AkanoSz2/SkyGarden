import {createContext, useContext} from "react";
import {useGreenhouseLayoutData} from "../hooks/useGreenhouseLayoutData.ts";

const GreenhouseDataLayoutContext = createContext<ReturnType<typeof useGreenhouseLayoutData> | null>(null);

export function GreenhouseDataLayoutProvider({children, greenhouseTabData}: {children: React.ReactNode, greenhouseTabData: any}) {
    const greenhouseDataLayout = useGreenhouseLayoutData(greenhouseTabData);
    return (
        <GreenhouseDataLayoutContext.Provider value={greenhouseDataLayout}>
            {children}
        </GreenhouseDataLayoutContext.Provider>
    );
}
export function useGreenhouseDataLayoutContext() {
    const ctx = useContext(GreenhouseDataLayoutContext);
    if (!ctx) throw new Error("useGreenhouseDataLayoutContext must be used inside GreenhouseDataLayoutProvider");
    return ctx;
}