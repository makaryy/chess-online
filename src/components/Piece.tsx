import { BoardPieceType } from "../Game";
import { useDrag, DragPreviewImage } from "react-dnd";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/firebase";

interface PieceProps {
    piece: BoardPieceType;
    position: string;
}

const Piece = ({ piece, position }: PieceProps) => {
    const game = useSelector((state: RootState) => state.game);
    const [user] = useAuthState(auth);
    const [{ isDragging }, drag, preview] = useDrag(() => ({
        type: "piece",
        item: {
            type: "piece",
            id: `${position}_${piece?.type}_${piece?.color}`,
            position,
            color: piece?.color
        },
        collect: (monitor) => {
            return {
                isDragging: monitor.isDragging()
            };
        }
    }));

    const correctPiece = () => {
        const player = game.members.find((m) => m.uid === user?.uid);
        if (player?.color === piece?.color) return true;
        return false;
    };

    const pieceImg = require(`../assets/${piece?.type}_${piece?.color}.svg`);
    const visibility = isDragging ? "hidden" : "visible";
    return (
        <>
            <DragPreviewImage connect={preview} src={pieceImg} />
            <div className={`p-2 cursor-grab w-full h-full ${visibility}`}>
                {correctPiece() ? (
                    <img className="w-full h-full" src={pieceImg} alt={`${piece?.type}-${piece?.color}`} ref={drag} />
                ) : (
                    <img className="w-full h-full" src={pieceImg} alt={`${piece?.type}-${piece?.color}`} />
                )}
            </div>
        </>
    );
};

export default Piece;
