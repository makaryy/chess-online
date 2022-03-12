import Piece from "./Piece";
import { BoardPieceType, chess, gameSubject, handleMove, Promotion } from "../Game";
import { useDrop } from "react-dnd";
import { PieceType, Square } from "chess.js";
import { useEffect, useState } from "react";
import Promote from "./Promote";
import { Member } from "./Home";
import { DocumentData } from "firebase/firestore";

interface SquareProps {
    piece: BoardPieceType;
    i: number;
    position: Square;
}
interface Item {
    type: Square;
    id: Square;
    position: string;
    color: "w" | "b";
}

const findSquareColor = (i: number) => {
    const x = i % 8;
    const y = Math.abs(Math.floor(i / 8) - 7);
    const color = (x + y) % 2 === 0 ? "gray-600" : "neutral-300";
    return color;
};

const BoardSquare = ({ piece, i, position }: SquareProps) => {
    const [promotion, setPromotion] = useState<Promotion | null>(null);
    const [{ isOver, canDrop }, drop] = useDrop({
        accept: "piece",
        drop: (item: Item) => {
            const fromPosition = item.position as Square;
            handleMove(fromPosition, position);
        },
        canDrop: (item) => {
            const moves = chess.moves({ square: item.position, verbose: true });
            const squares = moves.map((m) => m.to);
            if (squares.find((s) => s === position)) return true;
            return false;
        },
        collect: (monitor) => {
            return {
                isOver: !!monitor.isOver(),
                canDrop: !!monitor.canDrop()
            };
        }
    });

    useEffect(() => {
        let subscribe: DocumentData;
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
                          }
                        | undefined
                ) => {
                    if (game) {
                        game.pendingPromotion && game.pendingPromotion.to === position ? setPromotion(game.pendingPromotion) : setPromotion(null);
                    }
                }
            );
        }
    }, [position]);

    const squareColor = findSquareColor(i);

    return (
        <div
            className={`w-full h-full justify-center items-center ${isOver ? "bg-opacity-50 bg-yellow-300" : `bg-${squareColor}`}
            ${canDrop ? "border-2 border-neutral-800 shadow-inner shadow-neutral-800" : ""}
            `}
            ref={drop}>
            {promotion ? <Promote promotion={promotion} /> : piece ? <Piece piece={piece} position={position} /> : null}
        </div>
    );
};

export default BoardSquare;
