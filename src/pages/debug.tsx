import "bootstrap/dist/css/bootstrap.min.css";
import { Navbar, Footer } from "../components/ui";
import { usePlayerData } from "../hooks/usePlayerData";

export function Dev() {
    const {
        username, setUsername,
        profiles, selectedProfile,
        playerData,
        fetching, loadingProfile, error,
        fetchProfiles, fetchProfile
    } = usePlayerData();

    return (
        <div data-bs-theme="dark">
            <Navbar />
            <div className="w-100 bg-dark py-4" style={{ minHeight: "100vh" }}>
                <div className="mx-auto d-flex flex-column gap-3" style={{ width: "100%", padding: "0 40px" }}>
                    <div
                        className="border rounded-3 p-3 d-flex gap-2 align-items-center"
                        style={{borderColor: "#334155", backgroundColor: "#0f172a"}}
                    >
                        <input
                            className="form-control form-control-sm bg-dark text-light border-secondary"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            placeholder="Username"
                            onKeyDown={e => e.key === "Enter" && fetchProfiles()}
                        />
                        {profiles.length > 0 && selectedProfile && (
                            <select
                                className="form-select form-select-sm bg-dark text-light border-secondary"
                                value={selectedProfile.value}
                                onChange={e => {
                                    const item = profiles.find(p => p.value === e.target.value);
                                    if (item) fetchProfile(item);
                                }}
                            >
                                {profiles.map(p => (
                                    <option key={p.value} value={p.value}>{p.name}</option>
                                ))}
                            </select>
                        )}
                        <button
                            className="btn btn-sm btn-outline-secondary text-light flex-shrink-0"
                            style={{minWidth: "60px"}}
                            onClick={() => fetchProfiles()}
                            disabled={fetching || !username.trim()}
                        >
                            {fetching || loadingProfile ?
                                <span className="spinner-border spinner-border-sm"/> : "Fetch"}
                        </button>
                    </div>

                    {error && <div className="text-danger small">{error}</div>}

                        {playerData && (
                            <div
                                className="border rounded-3 p-3"
                                style={{ borderColor: "#334155", backgroundColor: "#0f172a" }}
                            >
                                <p className="text-light fw-semibold mb-2">
                                    Fancy player data
                                    (not so fancy)
                                </p>
                                <pre className="text-light m-0" style={{ fontSize: "12px", overflow: "auto" }}>
                                {JSON.stringify(playerData, null, 2)}
                            </pre>
                        </div>
                        )}
                </div>
            </div>
            <Footer />
        </div>
    );
}