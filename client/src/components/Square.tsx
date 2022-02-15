import Piece from "./Piece";
import { BoardPieceType, move } from "../Game";
import { useDrop } from "react-dnd";
import { Square } from "chess.js";

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

function BoardSquare({ piece, i, position }: SquareProps) {
    const [, drop] = useDrop({
        accept: "piece",
        drop: (item: Item) => {
            const itemIdData = item.id.split("_");
            const fromPosition = itemIdData[0] as Square;
            move(fromPosition, position);
        }
    });
    const squareColor = findSquareColor(i);
    return (
        <div className={`w-full h-full justify-center items-center ${squareColor}`} ref={drop}>
            {piece && <Piece piece={piece} position={position} />}
        </div>
    );
}

export default BoardSquare;
