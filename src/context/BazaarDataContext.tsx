import {createContext} from "react";
import {useGreenhouseLayoutData} from "../hooks/useGreenhouseLayoutData.ts";

const GreenhouseDataLayoutContext = createContext<ReturnType<typeof useGreenhouseLayoutData> | null>(null);


function BazaarDataContext() {
    return (
        <GreenhouseDataLayoutContext.Provider value={greenhouseDataLayout}>
            {children}
        </GreenhouseDataLayoutContext.Provider>
    );
}
}