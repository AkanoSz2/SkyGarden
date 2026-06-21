import { Routes, Route } from "react-router-dom";

import {Leaderboard} from "./pages/Leaderboard.tsx";
import { Dev } from "./pages/debug.tsx";
import { NotFound } from "./pages/NotFound404.tsx";
import { Home } from "./pages/Home.tsx";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/dev" element={<Dev />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}

export default App;