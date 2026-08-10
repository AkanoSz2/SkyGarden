import { createContext, useContext } from "react";
import { useBazaarItemData } from "../hooks/useBazaarData";

const BazaarDataContext = createContext<ReturnType<typeof useBazaarItemData> | null>(null);

export function BazaarDataProvider({ children }: { children: React.ReactNode }) {
    const bazaarData = useBazaarItemData();
    return (
        <BazaarDataContext.Provider value={bazaarData}>
            {children}
        </BazaarDataContext.Provider>

    );
}

export function useBazaarDataContext() {
    const ctx = useContext(BazaarDataContext);
    if (!ctx) throw new Error("useBazaarDataContext must be used inside BazaarDataProvider");
    return ctx;
}