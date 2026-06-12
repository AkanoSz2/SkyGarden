import { useState } from "react";

const tabs = ["Leaderboard", "Profits", "Mutations", "Pests"];

export function Navbar() {
    const [active, setActive] = useState("Add");

    return (
        <nav className="navbar navbar-expand-lg bg-dark border-bottom border-secondary">
            <div
                className="container-fluid"
                style={{
                    padding: "0 40px"
            }}
            >
                <a
                    href="#"
                    className="navbar-brand d-flex align-items-center"
                >
                    <img
                        src="/favicon.png"
                        alt="logo"
                        style={{
                            width: "44px",
                            height: "44px",
                            borderRadius: "10px",
                            objectFit: "cover"
                        }}
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

                {/* TABS */}
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto gap-2">

                        {tabs.map((tab) => {
                            const isActive = active === tab;

                            return (
                                <li key={tab} className="nav-item">
                                    <button
                                        onClick={() => setActive(tab)}
                                        className="nav-link text-light position-relative"
                                        style={{
                                            border: "none",
                                            background: "transparent",
                                        }}
                                    >
                                        {tab}

                                        {/* ACTIVE INDICATOR */}
                                        {isActive && (
                                            <span
                                                style={{
                                                    position: "absolute",
                                                    bottom: "0px",
                                                    left: "10%",
                                                    width: "80%",
                                                    height: "3px",
                                                    backgroundColor: "#22c55e",
                                                    borderRadius: "4px",
                                                }}
                                            />
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