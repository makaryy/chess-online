import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase/firebase";
import { collection, query, where, getDocs, setDoc, doc, DocumentData } from "firebase/firestore";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { setGame } from "../redux/game";
import Loading from "./Loading";
import GameApp from "./GameApp";

export interface Member {
    color: "w" | "b";
    creator: boolean;
    displayName: string | undefined | null;
    uid: string | undefined;
    photoURL?: string | null | undefined;
    email?: string | null | undefined;
}

const Home = () => {
    const [user, loading] = useAuthState(auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [games, setGames] = useState<DocumentData[] | undefined>(undefined);

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
            id: uuidv4(),
            chatId: uuidv4()
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

    const googleLogin = async () => {
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="flex flex-col h-screen justify-center container items-center mx-auto">
            {loading && <Loading />}
            {user?.uid && (
                <div className="flex flex-col items-center justify-center w-full">
                    <div className="absolute top-8 right-8">
                        <button onClick={async () => await signOut(auth)}>SIGN OUT</button>
                    </div>
                    <p className="text-3xl my-16 font-medium text-center">{`Welcome, ${user.displayName}. Start a new game or join your friend.`}</p>
                    <button
                        className="w-96 h-12 p-2 m-3 border border-black rounded-xl hover:shadow-md hover:shadow-black flex items-center justify-center"
                        onClick={startGame}>
                        <img src="/icons/new-game-icon.svg" alt="google" className="w-5 h-5 mx-3" />
                        Start new Game
                    </button>
                    <button
                        className="w-96 h-12 p-2 m-3 border border-black rounded-xl hover:shadow-md hover:shadow-black flex items-center justify-center"
                        onClick={async () => {
                            await getGames();
                        }}>
                        <img src="/icons/join-icon.svg" alt="google" className="w-5 h-5 mx-3" />
                        Join existing game
                    </button>
                    <div className="flex flex-col justify-center text-center">
                        {games &&
                            (games.length > 0 ? (
                                <div>
                                    {games.map((g) => {
                                        return (
                                            <div className="w-full text-black" key={g.id}>
                                                {g.members[0].uid !== user.uid ? (
                                                    <>
                                                        <p className="text-xl my-2 font-normal">Choose your oponent</p>
                                                        <div
                                                            className="flex flex-row w-full mx-auto my-1 justify-center cursor-pointer"
                                                            onClick={() => {
                                                                const oponent = g.members.find((m: Member) => m.uid !== user.uid);
                                                                const color = oponent.color === "w" ? "b" : "w";
                                                                const newUser: Member = {
                                                                    uid: user.uid,
                                                                    color,
                                                                    creator: false,
                                                                    displayName: user.displayName
                                                                };
                                                                dispatch(
                                                                    setGame({
                                                                        id: g.id,
                                                                        members: [...g.members, newUser],
                                                                        status: "in_progress",
                                                                        chatId: g.chatId
                                                                    })
                                                                );
                                                                navigate(`game/${g.id}`);
                                                            }}>
                                                            <img
                                                                src={g.members[0].photoURL ? g.members[0].photoURL : "/icons/circle-user.svg"}
                                                                alt=""
                                                                className="w-6 h-6 rounded-full mx-3"
                                                            />
                                                            <span>{g.members[0].displayName}</span>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div>
                                                        <p className="text-xl my-2 font-normal">
                                                            You have started a game before <br />
                                                            <span
                                                                className="underline cursor-pointer"
                                                                onClick={() => {
                                                                    dispatch(
                                                                        setGame({ id: g.id, members: g.members, status: g.status, chatId: g.chatId })
                                                                    );
                                                                    navigate(`/game/${g.id}`);
                                                                }}>
                                                                Rejoin
                                                            </span>
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div>
                                    <p className="text-xl my-2 font-normal">
                                        There is currently no game you could join <br />{" "}
                                        <span className="underline cursor-pointer" onClick={startGame}>
                                            Start new game instead
                                        </span>
                                    </p>
                                </div>
                            ))}
                    </div>
                </div>
            )}
            {!user?.uid && !loading && (
                <div className="flex flex-col items-center justify-center w-full">
                    <p className="text-3xl my-3 font-medium">Choose Login Option</p>

                    <button
                        onClick={googleLogin}
                        className="w-96 h-12 p-2 m-3 border border-black rounded-xl hover:shadow-md hover:shadow-black flex items-center justify-center">
                        <img src="/icons/google-icon.svg" alt="google" className="w-5 h-5 mx-3" />
                        Google
                    </button>

                    <Link to="../login/email">
                        <button className="w-96 h-12 p-2 m-3 border border-black rounded-xl hover:shadow-md hover:shadow-black flex items-center justify-center">
                            <img src="/icons/email-icon.svg" alt="email" className="w-5 h-5 mx-3" />
                            Email
                        </button>
                    </Link>
                    <Link to="../login/guest">
                        <button className="w-96 h-12 p-2 m-3 border border-black rounded-xl hover:shadow-md hover:shadow-black flex items-center justify-center">
                            <img src="/icons/user-icon.svg" alt="guest" className="w-5 h-5 mx-3" />
                            Guest
                        </button>
                    </Link>
                </div>
            )}
        </div>
    );
};

export default Home;
