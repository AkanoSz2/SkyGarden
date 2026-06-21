import { createContext, useContext } from "react";
import { usePlayerData } from "../hooks/usePlayerData";

const PlayerDataContext = createContext<ReturnType<typeof usePlayerData> | null>(null);

export function PlayerDataProvider({ children }: { children: React.ReactNode }) {
    const playerData = usePlayerData();
    return (
        <PlayerDataContext.Provider value={playerData}>
            {children}
        </PlayerDataContext.Provider>
    );
}

export function usePlayerDataContext() {
    const ctx = useContext(PlayerDataContext);
    if (!ctx) throw new Error("usePlayerDataContext must be used inside PlayerDataProvider");
    return ctx;
}