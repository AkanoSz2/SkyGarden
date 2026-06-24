import { useLocation, useNavigate } from "react-router-dom";

const tabs = [
    // { label: "Dev", path: "/dev" },
    { label: "Leaderboard", path: "/leaderboard" },
    { label: "Profits", path: "/profits" },
    { label: "Mutations", path: "/mutations" },
    { label: "GH", path: "/gh" },
    { label: "Stats", path: "/profile" },
];

export function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();

    return (
        <nav className="navbar navbar-expand-lg bg-dark border-bottom border-secondary">
            <div className="container-fluid" style={{ padding: "0 40px" }}>
                <a href="/" className="navbar-brand d-flex align-items-center">
                    <img
                        src="/favicon.png"
                        alt="logo"
                        style={{ width: "44px", height: "44px", borderRadius: "10px", objectFit: "cover" }}
                    />
                </a>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto gap-2">
                        {tabs.map((tab) => {
                            const isActive = location.pathname === tab.path;
                            return (
                                <li key={tab.label} className="nav-item">
                                    <button
                                        onClick={() => navigate(tab.path)}
                                        className="nav-link text-light position-relative"
                                        style={{ border: "none", background: "transparent" }}
                                    >
                                        {tab.label}
                                        {isActive && (
                                            <span style={{
                                                position: "absolute",
                                                bottom: "0px",
                                                left: "10%",
                                                width: "80%",
                                                height: "3px",
                                                backgroundColor: "#22c55e",
                                                borderRadius: "4px",
                                            }} />
                                        )}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        </nav>
    );
}