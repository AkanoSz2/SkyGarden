import "bootstrap/dist/css/bootstrap.min.css";
import { Navbar, Footer } from "../components/ui";
import { useNavigate } from "react-router-dom";

export function Home() {
    const navigate = useNavigate();

    return (
        <div data-bs-theme="dark">
            <Navbar />
            <div className="w-100 bg-dark d-flex flex-column align-items-center justify-content-center gap-3" style={{ minHeight: "100vh" }}>
                <img src="/favicon.png" alt="icon" style={{ width: "25%", height: "auto", objectFit: "contain" }} />
                <p className="text-secondary" style={{ marginLeft: "50px" }}>ejoy this leek until I decide what to put here</p>
            </div>
            <Footer />
        </div>
    );
}