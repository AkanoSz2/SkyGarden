const tabs = ["Leaderboard", "Profits", "Mutations", "Pests"];

export function Footer() {
    return (
        <div className="container-fluid bg-dark border-top border-secondary text-secondary py-2">

            <div className="text-center text-light small fw-semibold">
                Made by AkanoSz2
            </div>

            <hr className="border-secondary my-2" />

            <div className="d-flex justify-content-center gap-4 small">
                {tabs.map(tab => (
                    <span
                        key={tab}
                        className="text-secondary"
                        style={{ cursor: "pointer" }}
                        onMouseEnter={(e) =>
                            (e.currentTarget.style.color = "#e2e8f0")
                        }
                        onMouseLeave={(e) =>
                            (e.currentTarget.style.color = "#94a3b8")
                        }
                    >
                        {tab}
                    </span>
                ))}
            </div>
        </div>
    );
}