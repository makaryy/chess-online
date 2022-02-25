import { Link, Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { v4 as uuidv4 } from "uuid";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase/firebase";
import { collection, addDoc, setDoc, doc } from "firebase/firestore";
import { setGame } from "../redux/game";

export interface Member {
    color: "w" | "b";
    creator: boolean;
    displayName: string | undefined | null;
    uid: string | undefined;
    photoURL?: string | null | undefined;
    email?: string | null | undefined;
}
const Home = () => {
    const [userr, loading, error] = useAuthState(auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const startGame = async () => {
        const member: Member = {
            displayName: userr?.displayName,
            uid: userr?.uid,
            color: Math.round(Math.random()) === 0 ? "w" : "b",
            creator: true
        };
        const game = {
            status: "waiting",
            members: [member],
            id: uuidv4()
        };
        try {
            await setDoc(doc(db, "games", game.id), game);
            dispatch(setGame(game));
            navigate(`/game/${game.id}`);
        } catch (e) {
            console.error(e);
        }
    };

    const [opacity, setOpacity] = useState("opacity-0");

    if (userr?.uid)
        return (
            <div className="flex flex-col h-screen justify-center container items-center mx-auto">
                <div className="flex flex-col items-center justify-center w-full">
                    <p className="text-3xl my-16 font-medium">{`Welcome, ${userr.displayName}. Start a new game or join your friend.`}</p>
                    <button
                        className="w-96 h-12 bg-red-300 hover:border hover:border-red-400 my-1 rounded-2xl shadow-md shadow-red-300 flex items-center justify-center"
                        onClick={startGame}>
                        <img src="/icons/new-game-icon.svg" alt="google" className="w-5 h-5 mx-3" />
                        Start new Game
                    </button>
                    <button
                        className="w-96 h-12 bg-red-300 hover:border hover:border-red-400 my-1 rounded-2xl shadow-md shadow-red-300 flex items-center justify-center"
                        onClick={() => setOpacity("opacity-100")}>
                        <img src="/icons/join-icon.svg" alt="google" className="w-5 h-5 mx-3" />
                        Join existing game
                    </button>
                    <div className={`flex flex-col justify-center text-center ${opacity}`}>
                        <p className="text-2xl my-2 font-normal">Choose your oponent</p>
                        {["Andrzej", "Marek", "KOZAK NAJWIEKSZY", "ZIUTEK"].map((m) => {
                            return (
                                <div className="w-full" key={m}>
                                    {m}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );

    return (
        <div className="flex flex-col h-screen justify-center container items-center mx-auto">
            <div className="flex flex-col items-center justify-center w-full">
                <p className="text-3xl my-3 font-medium">Choose Login Option</p>
                <button className="w-96 h-12 bg-red-300 hover:border hover:border-red-400 my-1 rounded-2xl shadow-md shadow-red-300 flex items-center justify-center">
                    <img src="/icons/google-icon.svg" alt="google" className="w-5 h-5 mx-3" />
                    Google
                </button>
                <button className="w-96 h-12 bg-red-300 hover:border hover:border-red-400 my-1 rounded-2xl shadow-md shadow-red-300 flex items-center justify-center">
                    <img src="/icons/email-icon.svg" alt="email" className="w-5 h-5 mx-3" />
                    Email
                </button>
                <Link to="../login/guest">
                    <button className="w-96 h-12 bg-red-300 hover:border hover:border-red-400 my-1 rounded-2xl shadow-md shadow-red-300 flex items-center justify-center">
                        <img src="/icons/user-icon.svg" alt="guest" className="w-5 h-5 mx-3" />
                        Guest
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default Home;
