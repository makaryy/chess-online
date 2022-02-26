import Piece from "./Piece";
import { BoardPieceType, gameSubject, handleMove, Promotion } from "../Game";
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
}

const findSquareColor = (i: number) => {
    const x = i % 8;
    const y = Math.abs(Math.floor(i / 8) - 7);
    const color = (x + y) % 2 === 0 ? "bg-gray-600" : "bg-neutral-300";
    return color;
};

const BoardSquare = ({ piece, i, position }: SquareProps) => {
    const [promotion, setPromotion] = useState<Promotion | null>(null);
    const [, drop] = useDrop({
        accept: "piece",
        drop: (item: Item) => {
            const itemIdData = item.id.split("_");
            const fromPosition = itemIdData[0] as Square;
            handleMove(fromPosition, position);
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
        return () => subscribe.unsubscribe();
    }, [position]);

    const squareColor = findSquareColor(i);

    return (
        <div className={`w-full h-full justify-center items-center ${squareColor}`} ref={drop}>
            {promotion ? <Promote promotion={promotion} /> : piece ? <Piece piece={piece} position={position} /> : null}
        </div>
    );
};

export default BoardSquare;
