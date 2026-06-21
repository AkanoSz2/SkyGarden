import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

type DropdownItem = { name: string; img: string; value: string; };

export function usePlayerData() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [username, setUsername] = useState(searchParams.get("player") ?? "");
    const [profiles, setProfiles] = useState<DropdownItem[]>([]);
    const [selectedProfile, setSelectedProfile] = useState<DropdownItem | null>(null);
    const [playerData, setPlayerData] = useState<any>(null);
    const [fetching, setFetching] = useState(false);
    const [loadingProfile, setLoadingProfile] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchProfiles = async (name = username, autoProfile?: string) => {
        if (!name.trim()) return;
        setFetching(true);
        setProfiles([]);
        setSelectedProfile(null);
        setError(null);
        try {
            const res = await fetch(`/api/player/${name.trim()}`);
            if (!res.ok) throw new Error((await res.json()).error);
            const { profiles: names } = await res.json();
            const items: DropdownItem[] = names.map(({ name, selected }: { name: string; selected: boolean }) => ({ name, img: "", value: name }));
            setProfiles(items);
            const toSelect = items.find(i => i.value === autoProfile) ?? items.find((_, i) => names[i].selected) ?? items[0];
            setSelectedProfile(toSelect);
            await fetchProfile(toSelect, name);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Failed to fetch");
        } finally {
            setFetching(false);
        }
    };

    const fetchProfile = async (item: DropdownItem, name = username) => {
        setSelectedProfile(item);
        setLoadingProfile(true);
        setError(null);
        setSearchParams({ player: name.trim(), profile: item.value });
        try {
            const res = await fetch(`/api/player/${name.trim()}/${item.value}`);
            if (!res.ok) throw new Error((await res.json()).error);
            const data = await res.json();
            setPlayerData(data);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Failed to fetch profile");
        } finally {
            setLoadingProfile(false);
        }
    };

    useEffect(() => {
        const player = searchParams.get("player");
        const profile = searchParams.get("profile") ?? undefined;
        if (player) fetchProfiles(player, profile);
    }, []);

    return {
        username, setUsername,
        profiles, selectedProfile,
        playerData,
        fetching, loadingProfile, error,
        fetchProfiles, fetchProfile
    };
}