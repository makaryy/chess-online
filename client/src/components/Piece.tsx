import { BoardPieceType } from "../Game";
import { useDrag, DragPreviewImage } from "react-dnd";

interface PieceProps {
    piece: BoardPieceType;
    position: string;
}

const Piece = ({ piece, position }: PieceProps) => {
    const [{ isDragging }, drag, preview] = useDrag(() => ({
        type: "piece",
        item: {
            type: "piece",
            id: `${position}_${piece?.type}_${piece?.color}`
        },
        collect: (monitor) => {
            return {
                isDragging: monitor.isDragging()
            };
        }
    }));
    const pieceImg = require(`../assets/${piece?.type}_${piece?.color}.svg`);
    const visibility = isDragging ? "hidden" : "visible";
    return (
        <>
            <DragPreviewImage connect={preview} src={pieceImg} />
            <div className={`p-2 cursor-grab w-full h-full ${visibility}`}>
                <img className="w-full h-full" src={pieceImg} alt={`${piece?.type}-${piece?.color}`} ref={drag} />
            </div>
        </>
    );
};

export default Piece;
