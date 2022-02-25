import { useEffect, useState } from "react";
import Board from "./Board";
import { chess, Game, gameSubject, initGame, Promotion } from "../Game";
import { setBoard } from "../redux/board";
import { useDispatch, useSelector } from "react-redux";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import Alert from "./Alert";
import { useNavigate, useParams } from "react-router-dom";
import { auth, db } from "../firebase/firebase";
import { RootState } from "../redux/store";
import { DocumentData } from "rxfire/firestore/interfaces";
import { PieceType } from "chess.js";
import { Member } from "./Home";
import { useAuthState } from "react-firebase-hooks/auth";

const GameApp = () => {
    const dispatch = useDispatch();
    const [userr, loading, error] = useAuthState(auth);
    const [alert, setAlert] = useState<string | null>(null);
    const { id } = useParams();
    const navigate = useNavigate();
    const board = useSelector((state: RootState) => state.board.board);
    useEffect(() => {
        if (loading) {
            console.log("Game Loading...");
        } else if (error) {
            console.error(error);
        } else {
            if (!userr?.uid) navigate("/home");
            let subscribe: DocumentData;
            const init = async () => {
                await initGame(db, "games", `${id}`, userr);
                if (gameSubject) {
                    subscribe = gameSubject.subscribe(
                        (
                            game:
                                | {
                                      board: ({ type: PieceType; color: "b" | "w" } | null)[][];
                                      pendingPromotion: Promotion;
                                      isGameOver: boolean;
                                      position: "b" | "w";
                                      member: Member;
                                      oponent: Member;
                                      result: string | null | undefined;
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
            return () => subscribe && subscribe.unsubscribe();
        }
    });

    return (
        <div className="flex container mx-auto h-screen items-center justify-center">
            <DndProvider backend={HTML5Backend}>
                {alert && <Alert alert={alert} />}
                {!loading && !error && <Board />}
            </DndProvider>
        </div>
    );
};

export default GameApp;
