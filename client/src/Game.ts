import { BehaviorSubject } from "rxjs";
import Chess, { ChessInstance } from "chess.js";
type ChessType = (fen?: string) => ChessInstance;
const ChessImport = Chess as unknown;
const Chess2 = ChessImport as ChessType;

const chess = Chess2();

const board = chess.board();
export type BoardType = typeof board;
export type BoardRowType = typeof board[0];
export type BoardPieceType = typeof board[0][0];

export const gameSubject = new BehaviorSubject({
    board: chess.board()
});
