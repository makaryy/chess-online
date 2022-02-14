import React, { useEffect, useState } from "react";
import Board from "./components/Board";
import { BoardType, gameSubject } from "./Game";
import { setBoard } from "./redux/board";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./redux/store";

function App() {
    const dispatch = useDispatch();
    useEffect(() => {
        const subscribe = gameSubject.subscribe((game) => dispatch(setBoard(game.board)));
        return () => subscribe.unsubscribe();
    }, []);
    return (
        <div className="container mx-auto h-screen items-center justify-center">
            <Board />
        </div>
    );
}

export default App;
