import { useEffect, useState } from "react";
import Board from "./Board";
import { gameSubject, initGame, Promotion } from "../Game";
import { setBoard } from "../redux/board";
import { useDispatch, useSelector } from "react-redux";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import Alert from "./Alert";
import { useNavigate, useParams } from "react-router-dom";
import { auth, db } from "../firebase/firebase";
import { DocumentData } from "rxfire/firestore/interfaces";
import { PieceType } from "chess.js";
import { Member } from "./Home";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useBeforeunload } from "react-beforeunload";
import { RootState } from "../redux/store";
import { updateMembers } from "../redux/game";
import Chat from "./Chat";
import { setChat } from "../redux/chat";

const GameApp = () => {
    const dispatch = useDispatch();
    const [user, loading, error] = useAuthState(auth);
    const [alert, setAlert] = useState<string | null>(null);
    const { id } = useParams();
    const navigate = useNavigate();
    const gameState = useSelector((state: RootState) => state.game);
    const chat = useSelector((state: RootState) => state.chat);
    const [oponent, setOponent] = useState<Member | undefined>(gameState.members.find((m) => m.uid !== user?.uid));

    const searchForOponent = async () => {
        while (!oponent) {
            if (id) {
                const game = await getDoc(doc(db, "games", id));
                const gameData = await game.data();
                const op = gameData?.members.find((m: Member) => m.uid !== user?.uid);
                if (op) {
                    updateMembers([...gameState.members, op]);
                    setOponent(op);
                    break;
                }
            }
        }
    };

    useEffect(() => {
        !oponent && searchForOponent();
        if (error) {
            console.error(error);
        } else {
            if (!user?.uid) navigate("/");
            let subscribe: DocumentData;
            const init = async () => {
                await initGame(db, "games", `${id}`, user);
                if (gameSubject) {
                    subscribe = gameSubject.subscribe(
                        (
                            game:
                                | {
                                      board: ({ type: PieceType; color: "b" | "w" } | null)[][];
                                      pendingPromotion: Promotion;
                                      isGameOver: boolean;
                                      member: Member;
                                      oponent: Member;
                                      result: string | null | undefined;
                                      status: string;
                                  }
                                | undefined
                        ) => {
                            if (game) {
                                dispatch(setBoard(game.board));
                                if (game.result) {
                                    setAlert(game.result);
                                } else {
                                    setAlert(null);
                                }
                            }
                        }
                    );
                }
            };
            init();
        }
    });

    useBeforeunload(async () => {
        if (id) {
            const game = await getDoc(doc(db, "games", id));
            const gameData = await game.data();
            if (gameData?.status === "waiting") {
                await updateDoc(doc(db, "games", id), { status: "abandoned" });
                console.log("Game abandoned");
            } else if (gameData?.status === "in_progress") {
                await updateDoc(doc(db, "games", id), { status: "over" });
                chat.id &&
                    (await updateDoc(doc(db, "chats", chat.id), {
                        ...chat,
                        messages: [
                            ...chat.messages,
                            {
                                msg: `${user?.displayName} left the game :(`,
                                img: "",
                                user: { uid: user?.uid, displayName: user?.displayName },
                                createdAt: JSON.stringify(new Date())
                            }
                        ]
                    }));
                dispatch(
                    setChat({
                        ...chat,
                        messages: [
                            ...chat.messages,
                            {
                                msg: `${user?.displayName} left the game :(`,
                                img: "",
                                user: { uid: user?.uid, displayName: user?.displayName },
                                createdAt: JSON.stringify(new Date())
                            }
                        ]
                    })
                );
                console.log(gameData.gameData);
            }
        }
    });

    return (
        <div className="flex flex-row">
            <div className="flex container mx-auto min-h-screen items-center justify-center">
                <DndProvider backend={HTML5Backend}>
                    {alert && <Alert alert={alert} />}
                    {!loading && !error && gameState.id && (
                        <div>
                            <div className="flex flex-row">
                                <p className="w-max text-xl">{oponent ? oponent.displayName : "Waiting for oponent.."}</p>
                                {oponent && (
                                    <img
                                        src={`${oponent?.photoURL ? oponent.photoURL : "/icons/circle-user.svg"}`}
                                        alt=""
                                        className="w-6 rounded-full mx-2"
                                    />
                                )}
                            </div>
                            <Board />
                            <div className="flex flex-row justify-end">
                                <img src={`${user?.photoURL ? user.photoURL : "/icons/circle-user.svg"}`} alt="" className="w-6 rounded-full mx-2" />{" "}
                                <p className="w-max text-xl">{user?.displayName}</p>
                            </div>
                        </div>
                    )}
                </DndProvider>
            </div>
            <Chat />
        </div>
    );
};

export default GameApp;
