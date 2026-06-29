import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

type CropFortuneEntry = {
    finalFortune: number;
    baseFortune: number;
    actualCropFortune: number;
    totalCropFortune: number;
    personalBestCollection: number;
    sources: Record<string, number>;
};

type FortuneBreakdown = {
    stats: Record<string, number>;
    garden: Record<string, number>;
    breakthrough: Record<string, number>;
};

type TemporaryBonuses = Record<string, number>;

type PlayerData = {
    fortune: FortuneBreakdown;
    temporary: TemporaryBonuses;
    totalBaseFortune: number;
    cropFortune: CropFortuneEntry;
};

type GardenCustomization = {
    uniqueCrops: number;
    cropEffectYield: number;
    flasksPerDay: number;
    harvestsPerDay: number;
    loginsPerDay: number;
    priority: string;

    deskYield: number;
    growthSpeed: number;
};

type DropdownItem = {
    name: string;
    img: string;
    value: string;
};

type StoredState = {
    username: string;
    confirmedUsername: string;
    profiles: DropdownItem[];
    selectedProfile: DropdownItem | null;
    playerData: PlayerData | null;
    activeBonuses: Record<string, boolean>;
};

type GardenStoredState = {
    gardenCustomization: GardenCustomization;
};

type LeaderboardPB = Record<string, number>;
type LeaderboardGoal = Record<string, number>;

type LeaderboardData = {
    pb: LeaderboardPB | null;
    lbGoal: LeaderboardGoal | null;
    lastUpdated: number;
    cropsPests: number,
    cropsFarming: number,
    currrentlyTracking: string | null,
};

const STORAGE_KEY = "skygarden:playerData";
const GARDEN_STORAGE_KEY = "skygarden:gardenData";
const LEADERBOARD_STORAGE_KEY = "skygarden:leaderboardData";

const DEFAULT_CUSTOMIZATION: GardenCustomization = {
    uniqueCrops: 0,
    cropEffectYield: 0,
    flasksPerDay: 0,
    harvestsPerDay: 0,
    loginsPerDay: 0,
    priority: "profit",

    deskYield: 0,
    growthSpeed: 0,
};

const DEFAULT_LEADERBOARD: LeaderboardData = {
    pb: null,
    lbGoal: null,
    lastUpdated: 0,
    cropsPests: 0,
    cropsFarming: 0,
    currrentlyTracking: null,
};

function loadStored(): StoredState | null {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch (err) {
        console.error("Failed to load player data:", err);
        return null;
    }
}

function loadLeaderboardStored(): LeaderboardData | null {
    try {
        const raw = localStorage.getItem(LEADERBOARD_STORAGE_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch (err) {
        console.error("Failed to load leaderboard data:", err);
        return null;
    }
}

function saveLeaderboardStored(state: LeaderboardData) {
    try {
        localStorage.setItem(LEADERBOARD_STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
        console.error("Failed to save leaderboard data:", err);
    }
}

function saveStored(state: StoredState) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
        console.error("Failed to save player data:", err);
    }
}

function loadGardenStored(): GardenStoredState | null {
    try {
        const raw = localStorage.getItem(GARDEN_STORAGE_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch (err) {
        console.error("Failed to load garden data:", err);
        return null;
    }
}

function saveGardenStored(state: GardenStoredState) {
    try {
        localStorage.setItem(GARDEN_STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
        console.error("Failed to save garden data:", err);
    }
}

export function usePlayerData() {
    const [searchParams, setSearchParams] = useSearchParams();

    const stored = loadStored();
    const gardenStored = loadGardenStored();

    const [username, setUsername] = useState(
        searchParams.get("player") ?? stored?.username ?? ""
    );

    const [confirmedUsername, confirmUsername] = useState(
        stored?.confirmedUsername ?? ""
    );

    const [profiles, setProfiles] = useState<DropdownItem[]>(
        stored?.profiles ?? []
    );

    const [selectedProfile, setSelectedProfile] =
        useState<DropdownItem | null>(stored?.selectedProfile ?? null);

    const [playerData, setPlayerData] = useState<PlayerData | null>(
        stored?.playerData ?? null
    );

    const [activeBonuses, setActiveBonuses] = useState<Record<string, boolean>>(
        stored?.activeBonuses ?? {}
    );

    const [fetching, setFetching] = useState(false);
    const [loadingProfile, setLoadingProfile] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [gardenCustomization, setGardenCustomization] =
        useState<GardenCustomization>(
            gardenStored?.gardenCustomization ?? DEFAULT_CUSTOMIZATION
        );

    const deskYield = gardenCustomization.deskYield;
    const growthSpeed = gardenCustomization.growthSpeed;

    const setDeskYield = (value: number) =>
        setGardenCustomization(prev => ({
            ...prev,
            deskYield: value,
        }));

    const setGrowthSpeed = (value: number) =>
        setGardenCustomization(prev => ({
            ...prev,
            growthSpeed: value,
        }));

    const leaderboardStored = loadLeaderboardStored();

    const [leaderboardData, setLeaderboardData] = useState<LeaderboardData>(
        leaderboardStored ?? DEFAULT_LEADERBOARD
    );

    useEffect(() => {
        saveStored({
            username,
            confirmedUsername,
            profiles,
            selectedProfile,
            playerData,
            activeBonuses,
        });
    }, [
        username,
        confirmedUsername,
        profiles,
        selectedProfile,
        playerData,
        activeBonuses,
    ]);

    useEffect(() => {
        const handle = setTimeout(() => {
            saveGardenStored({
                gardenCustomization,
            });
        }, 300);

        return () => clearTimeout(handle);
    }, [gardenCustomization]);

    useEffect(() => {
        if (!leaderboardData) return;
        saveLeaderboardStored(leaderboardData);
    }, [leaderboardData]);

    const setTrackedCrop = (cropName: string) => {
        setLeaderboardData(prev => ({
            ...prev,
            currrentlyTracking: cropName,
        }));
    };

    const setCropGoal = (cropName: string, value: number) => {
        setLeaderboardData(prev => ({
            ...prev,
            lbGoal: {
                ...(prev.lbGoal ?? {}),
                [cropName]: value,
            },
        }));
    };

    const fetchProfiles = async (
        name = username,
        autoProfile?: string
    ) => {
        if (!name.trim()) return;

        setFetching(true);
        setProfiles([]);
        confirmUsername("");
        setSelectedProfile(null);
        setError(null);

        try {
            const res = await fetch(`/api/player/${name.trim()}`);

            if (!res.ok) {
                throw new Error((await res.json()).error);
            }

            const { profiles: names } = await res.json();

            const items: DropdownItem[] = names.map(
                ({ name }: { name: string; selected: boolean }) => ({
                    name,
                    img: "",
                    value: name,
                })
            );

            setProfiles(items);

            const toSelect =
                items.find(i => i.value === autoProfile) ??
                items.find((_, i) => names[i].selected) ??
                items[0];

            setSelectedProfile(toSelect);

            await fetchProfile(toSelect, name);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Failed to fetch");
        } finally {
            setFetching(false);
        }
    };

    const fetchProfile = async (
        item: DropdownItem,
        name = username
    ) => {
        setSelectedProfile(item);
        setLoadingProfile(true);
        setError(null);

        setSearchParams({
            player: name.trim(),
            profile: item.value,
        });

        try {
            const res = await fetch(
                `/api/player/${name.trim()}/${item.value}`
            );

            if (!res.ok) {
                throw new Error((await res.json()).error);
            }

            const data: PlayerData = await res.json();

            setPlayerData(data);

            setGardenCustomization(prev => ({
                ...prev,
                deskYield: data.greenhouse.deskYieldUpgrade,
                growthSpeed: data.greenhouse.growthUpgrade,
            }));

            const cropNames = Object.keys(data.fortune.breakthrough.cropFortune);

            setLeaderboardData(prev => ({
                pb: Object.fromEntries(
                    Object.entries(data.fortune.breakthrough.cropFortune).map(
                        ([crop, v]) => [crop, v.personalBestCollection]
                    )
                ),
                lastUpdated: Date.now(),
                lbGoal: prev.lbGoal ?? Object.fromEntries(
                    cropNames.map((crop) => [crop, 0])
                ),
                cropsPests: 0,
                cropsFarming: 0,
                currrentlyTracking:
                    prev.currrentlyTracking && cropNames.includes(prev.currrentlyTracking)
                        ? prev.currrentlyTracking
                        : cropNames[0] ?? null,
            }));

            confirmUsername(name.trim());
            setActiveBonuses({});

            console.log(
                `Fetched profile ${item.value} for player ${name.trim()}`,
                data
            );
        } catch (e) {
            setError(
                e instanceof Error
                    ? e.message
                    : "Failed to fetch profile"
            );
        } finally {
            setLoadingProfile(false);
        }
    };

    const toggleBonus = (key: string, value: boolean) => {
        setActiveBonuses(prev => ({
            ...prev,
            [key]: value,
        }));
    };

    useEffect(() => {
        const player = searchParams.get("player");
        const profile = searchParams.get("profile") ?? undefined;

        if (player && player !== confirmedUsername) {
            fetchProfiles(player, profile);
        }
    }, []);

    return {
        username,
        setUsername,

        profiles,
        selectedProfile,

        playerData,

        activeBonuses,
        toggleBonus,

        fetching,
        loadingProfile,
        error,

        fetchProfiles,
        fetchProfile,

        confirmedUsername,

        gardenCustomization,
        setGardenCustomization,

        deskYield,
        setDeskYield,

        growthSpeed,
        setGrowthSpeed,

        leaderboardData,
        setTrackedCrop,
        setCropGoal,
    };
}