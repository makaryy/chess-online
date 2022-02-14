import { BoardPieceType } from "../Game";

interface PieceProps {
    piece: BoardPieceType;
}

function Piece({ piece }: PieceProps) {
    const pieceImg = require(`../assets/${piece?.type}_${piece?.color}.svg`);
    return (
        <div className="p-2">
            <img className="w-full h-full" src={pieceImg} alt={`${piece?.type}-${piece?.color}`} />
        </div>
    );
}

export default Piece;
