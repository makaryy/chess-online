import Piece from "./Piece";
import { BoardPieceType, gameSubject, handleMove, Promotion } from "../Game";
import { useDrop } from "react-dnd";
import { Square } from "chess.js";
import { useEffect, useState } from "react";
import Promote from "./Promote";

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
        const subscribe = gameSubject.subscribe(({ pendingPromotion }) =>
            pendingPromotion && pendingPromotion.to === position ? setPromotion(pendingPromotion) : setPromotion(null)
        );
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
