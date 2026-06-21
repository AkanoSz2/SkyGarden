import "bootstrap/dist/css/bootstrap.min.css";
import { Navbar, Footer } from "../components/ui";
import { useNavigate } from "react-router-dom";

export function NotFound() {
    const navigate = useNavigate();

    return (
        <div data-bs-theme="dark">
            <Navbar />
            <div className="w-100 bg-dark d-flex flex-column align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
                <h1 className="text-light fw-bold" style={{ fontSize: "4rem" }}>404</h1>
                <p className="text-secondary mb-4">This page doesn't exist.</p>
                <button
                    className="btn btn-sm btn-outline-secondary text-light"
                    onClick={() => navigate("/leaderboard")}
                >
                    Go back home
                </button>
            </div>
            <Footer />
        </div>
    );
}