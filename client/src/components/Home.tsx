import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase/firebase";
import { collection, query, where, getDocs, setDoc, doc, DocumentData } from "firebase/firestore";
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
    const [user, loading, error] = useAuthState(auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [games, setGames] = useState<DocumentData[]>([]);

    const startGame = async () => {
        const member: Member = {
            displayName: user?.displayName,
            uid: user?.uid,
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

    const getGames = async () => {
        let tempGames: DocumentData[] = [];

        const q = query(collection(db, "games"), where("status", "==", "waiting"));

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            tempGames.push(doc.data());
        });
        setGames(tempGames);
    };

    const [opacity, setOpacity] = useState("opacity-100");

    if (loading) {
        <div className="flex flex-col h-screen justify-center container items-center mx-auto">Loading...</div>;
    } else if (user?.uid)
        return (
            <div className="flex flex-col h-screen justify-center container items-center mx-auto">
                <div className="flex flex-col items-center justify-center w-full">
                    <p className="text-3xl my-16 font-medium">{`Welcome, ${user.displayName}. Start a new game or join your friend.`}</p>
                    <button
                        className="w-96 h-12 bg-red-300 hover:border hover:border-red-400 my-1 rounded-2xl shadow-md shadow-red-300 flex items-center justify-center"
                        onClick={startGame}>
                        <img src="/icons/new-game-icon.svg" alt="google" className="w-5 h-5 mx-3" />
                        Start new Game
                    </button>
                    <button
                        className="w-96 h-12 bg-red-300 hover:border hover:border-red-400 my-1 rounded-2xl shadow-md shadow-red-300 flex items-center justify-center"
                        onClick={async () => {
                            await getGames();
                        }}>
                        <img src="/icons/join-icon.svg" alt="google" className="w-5 h-5 mx-3" />
                        Join existing game
                    </button>
                    <div className={`flex flex-col justify-center text-center ${opacity}`}>
                        <p className="text-2xl my-2 font-normal">Choose your oponent</p>
                        {games &&
                            games.map((g) => {
                                return (
                                    <div
                                        className="w-full text-black cursor-pointer"
                                        key={g.id}
                                        onClick={() => {
                                            const oponent = g.members.find((m: Member) => m.uid !== user.uid);
                                            const color = oponent.color === "w" ? "b" : "w";
                                            const newUser: Member = {
                                                uid: user.uid,
                                                color,
                                                creator: false,
                                                displayName: user.displayName
                                            };
                                            dispatch(setGame({ id: g.id, members: [...g.members, newUser], status: "in_progress" }));
                                            navigate(`game/${g.id}`);
                                        }}>
                                        {g.id}
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
