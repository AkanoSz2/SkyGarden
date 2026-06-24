export function Footer() {
    const linkStyle = { cursor: "pointer", color: "#94a3b8" };
    const onEnter = (e: React.MouseEvent<HTMLParagraphElement>) => (e.currentTarget.style.color = "#e2e8f0");
    const onLeave = (e: React.MouseEvent<HTMLParagraphElement>) => (e.currentTarget.style.color = "#94a3b8");

    return (
        <div className="container-fluid bg-dark border-top border-secondary text-secondary">

            {/* Category headers row */}
            <div className="d-flex justify-content-center gap-5 px-4 py-2 border-bottom border-secondary">
                <div style={{ width: "160px", textAlign: "center" }}>
                    <p className="text-light fw-bold small mb-0">Legal</p>
                </div>
                <div style={{ width: "160px", textAlign: "center" }}>
                    <p className="text-light fw-bold small mb-0">Open Source</p>
                </div>
                <div style={{ width: "160px", textAlign: "center" }}>
                    <p className="text-light fw-bold small mb-0">Credits</p>
                </div>
            </div>

            {/* Links row */}
            <div className="d-flex justify-content-center gap-5 px-4 py-2">
                <div style={{ width: "160px", textAlign: "center" }}>
                    <p className="small mb-2" style={linkStyle} onMouseEnter={onEnter} onMouseLeave={onLeave}>Privacy Policy</p>
                    <p className="small mb-2" style={linkStyle} onMouseEnter={onEnter} onMouseLeave={onLeave}>Terms and Conditions</p>
                </div>
                <div style={{ width: "160px", textAlign: "center" }}>
                    <p className="small mb-2" style={linkStyle} onMouseEnter={onEnter} onMouseLeave={onLeave}>Open Source on GitHub</p>
                    <p className="small mb-2" style={linkStyle} onMouseEnter={onEnter} onMouseLeave={onLeave}>Website Credits</p>
                </div>
                <div style={{ width: "160px", textAlign: "center" }}>
                    <p className="small mb-2" style={linkStyle} onMouseEnter={onEnter} onMouseLeave={onLeave}>Made by AkanoSz2</p>
                    <p className="small mb-2" style={linkStyle} onMouseEnter={onEnter} onMouseLeave={onLeave}>Website Credits</p>
                </div>
            </div>

            <hr className="border-secondary my-0" />

            <div className="d-flex justify-content-between align-items-center px-4 py-3 small" style={{ color: "#475569" }}>
                <span>SkyGarden </span>
                <span>© {new Date().getFullYear()} AkanoSz2. All rights reserved.</span>
                <span>Not affiliated with Hypixel or Mojang.</span>
            </div>
        </div>
    );
}