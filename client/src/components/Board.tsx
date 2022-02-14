import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BoardType, BoardRowType, gameSubject, BoardPieceType } from "../Game";
import { setBoard } from "../redux/board";
import { RootState } from "../redux/store";
import Square from "./Square";

function Board() {
    // const dispatch = useDispatch();
    // useEffect(() => {
    //     const subscribe = gameSubject.subscribe((game) => dispatch(setBoard(game.board)));
    //     return () => subscribe.unsubscribe();
    // }, []);
    const board = useSelector((state: RootState) => state.board.board);
    return (
        <div className="w-[800px] h-[800px] grid grid-cols-8 grid-rows-8 mx-auto justify-center items-center">
            {board.flat().map((piece: BoardPieceType, i: number) => {
                return <Square piece={piece} key={i} index={i} />;
            })}
        </div>
    );
}

export default Board;
