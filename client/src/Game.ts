import { BehaviorSubject } from "rxjs";
import Chess, { ChessInstance, Square } from "chess.js";
type ChessType = (fen?: string) => ChessInstance;
const ChessImport = Chess as unknown;
const Chess2 = ChessImport as ChessType;

export const chess = Chess2();

const board = chess.board();
export type BoardType = typeof board;
export type BoardRowType = typeof board[0];
export type BoardPieceType = typeof board[0][0];

export const gameSubject = new BehaviorSubject({
    board: chess.board()
});

export const move = (from: Square, to: Square) => {
    const validMove = chess.move({ from, to });
    if (validMove) {
        gameSubject.next({ board: chess.board() });
    }
};
