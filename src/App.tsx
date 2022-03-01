import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import GameApp from "./components/GameApp";
import GuestLogin from "./components/GuestLogin";
import EmailLogin from "./components/EmailLogin";
import Home from "./components/Home";

const App = () => {
    return (
        <div>
            <Router>
                <Routes>
                    <Route path="/" element={<Home />}></Route>
                    <Route path="/login/guest" element={<GuestLogin />}></Route>
                    <Route path="/login/email" element={<EmailLogin />}></Route>
                    <Route path="/game/:id" element={<GameApp />}></Route>
                </Routes>
            </Router>
        </div>
    );
};

export default App;
