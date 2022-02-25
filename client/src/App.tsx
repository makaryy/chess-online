import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import GameApp from "./components/GameApp";
import GuestLogin from "./components/GuestLogin";
import Home from "./components/Home";
import { auth } from "./firebase/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDispatch } from "react-redux";

const App = () => {
    const dispatch = useDispatch();

    return (
        <div>
            <Router>
                <Routes>
                    <Route path="/home" element={<Home />}></Route>
                    <Route path="/login/guest" element={<GuestLogin />}></Route>
                    <Route path="/" element={<Home />}></Route>
                    <Route path="/game/:id" element={<GameApp />}></Route>
                </Routes>
            </Router>
        </div>
    );
};

export default App;
