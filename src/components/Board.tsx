import { Square } from "chess.js";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useSelector } from "react-redux";
import { auth } from "../firebase/firebase";
import { BoardPieceType } from "../Game";
import { RootState } from "../redux/store";
import BoardSquare from "./BoardSquare";

const Board = () => {
    const board = useSelector((state: RootState) => state.board.board);
    const game = useSelector((state: RootState) => state.game);

    const [user, loading, error] = useAuthState(auth);

    const [color, setColor] = useState<"w" | "b" | undefined>(undefined);
    useEffect(() => {
        if (user) {
            const member = game.members.find((m) => m.uid === user.uid);
            if (member) {
                setColor(member.color);
            }
        }
    }, []);

    const getXYPosition = (i: number) => {
        const x = i % 8;
        const y = Math.abs(Math.floor(i / 8) - 7);
        return { x, y };
    };

    const getPosition = (i: number) => {
        if (color === "w") {
            const { x, y } = getXYPosition(i);
            const letter = ["a", "b", "c", "d", "e", "f", "g", "h"][x];
            return `${letter}${y + 1}` as Square;
        } else {
            const { x, y } = getXYPosition(63 - i);
            const letter = ["a", "b", "c", "d", "e", "f", "g", "h"][x];
            return `${letter}${y + 1}` as Square;
        }
    };

    return (
        <div className="lg:w-[800px] lg:h-[800px] md:w-[740px] md:h-[740px] sm:w-[620px] sm:h-[620px] h-96 w-96 grid grid-cols-8 grid-rows-8 mx-auto my-1">
            {color === "w" &&
                board.flat().map((piece: BoardPieceType, i: number) => {
                    return <BoardSquare piece={piece} key={i} i={i} position={getPosition(i)} />;
                })}
            {color === "b" &&
                board
                    .flat()
                    .reverse()
                    .map((piece: BoardPieceType, i: number) => {
                        return <BoardSquare piece={piece} key={i} i={i} position={getPosition(i)} />;
                    })}
        </div>
    );
};

export default Board;
