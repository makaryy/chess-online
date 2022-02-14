import Piece from "./Piece";
import { BoardPieceType } from "../Game";
import { useEffect, useState } from "react";

interface SquareProps {
    piece: BoardPieceType;
    index: number;
}

function Square({ piece, index }: SquareProps) {
    const x = index % 8;
    const y = Math.abs(Math.floor(index / 8) - 7);
    const squareColor = (x + y) % 2 === 0 ? "bg-gray-600" : "bg-neutral-300";
    return <div className={`w-full h-full justify-center items-center ${squareColor}`}>{piece && <Piece piece={piece} />}</div>;
}

export default Square;
