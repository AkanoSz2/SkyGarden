import { useEffect, useState } from "react";
import type {BazaarItem} from "../features/itemPrices/types";

export function useBazaarItemData() {
    const [items, setItems] = useState<BazaarItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        async function fetchBazaar() {
            try {
                setLoading(true);
                const res = await fetch("http://localhost:3001/bazaar");
                if (!res.ok) {
                    const body = await res.json().catch(() => null);
                    throw new Error(body?.error ?? `Request failed: ${res.status}`);
                }
                const data: BazaarItem[] = await res.json();
                if (!cancelled) setItems(data);
            } catch (e) {
                if (!cancelled) setError(e instanceof Error ? e.message : "Unknown error");
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        fetchBazaar();
        return () => {
            cancelled = true;
        };
    }, []);

    return { items, loading, error };
}