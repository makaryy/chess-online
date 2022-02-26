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
import { setGame } from "../redux/game";

const GameApp = () => {
    const dispatch = useDispatch();
    const [user, loading, error] = useAuthState(auth);
    const [alert, setAlert] = useState<string | null>(null);
    const { id } = useParams();
    const navigate = useNavigate();
    const gameState = useSelector((state: RootState) => state.game);
    useEffect(() => {
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

                                // id && dispatch(setGame({ id, members: [game.member, game.oponent], status: game.status }));
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
            return () => {
                subscribe && subscribe.unsubscribe();
            };
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
                console.log(gameData.gameData);
            }
        }
    });

    return (
        <div className="flex container mx-auto h-screen items-center justify-center">
            <DndProvider backend={HTML5Backend}>
                {alert && <Alert alert={alert} />}
                {!loading && !error && gameState.id && <Board />}
            </DndProvider>
        </div>
    );
};

export default GameApp;
