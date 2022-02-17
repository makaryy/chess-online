import { Square } from "chess.js";
import { useSelector } from "react-redux";
import { BoardPieceType } from "../Game";
import { RootState } from "../redux/store";
import BoardSquare from "./BoardSquare";

function Board() {
    const board = useSelector((state: RootState) => state.board.board);
    const getXYPosition = (i: number) => {
        const x = i % 8;
        const y = Math.abs(Math.floor(i / 8) - 7);
        return { x, y };
    };

    const getPosition = (i: number) => {
        const { x, y } = getXYPosition(i);
        const letter = ["a", "b", "c", "d", "e", "f", "g", "h"][x];
        return `${letter}${y + 1}` as Square;
    };
    return (
        <div className="w-[800px] h-[800px] grid grid-cols-8 grid-rows-8 mx-auto">
            {board.flat().map((piece: BoardPieceType, i: number) => {
                return <BoardSquare piece={piece} key={i} i={i} position={getPosition(i)} />;
            })}
        </div>
    );
}

export default Board;
