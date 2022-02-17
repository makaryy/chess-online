import { BehaviorSubject } from "rxjs";
import Chess, { ChessInstance, PieceType, Square } from "chess.js";
type ChessType = (fen?: string) => ChessInstance;
const ChessImport = Chess as unknown;
const Chess2 = ChessImport as ChessType;

export const chess = Chess2();

const board = chess.board();
export type BoardType = typeof board;
export type BoardRowType = typeof board[0];
export type BoardPieceType = typeof board[0][0];

export interface Promotion {
    from: Chess.Square;
    to: Chess.Square;
    color: Chess.Move;
}

export interface Game {
    board: BoardType;
    pendingPromotion?: Promotion | undefined | null;
}

export const gameSubject = new BehaviorSubject<Game>({
    board: chess.board(),
    pendingPromotion: undefined
});

export const move = (from: Square, to: Square, promotion?: Exclude<PieceType, "p" | "k"> | undefined) => {
    if (promotion) {
        const validPromotionMove = chess.move({ from, to, promotion });
        if (validPromotionMove) {
            updateGame();
        }
    } else {
        const validMove = chess.move({ from, to });
        if (validMove) {
            updateGame();
        }
    }
};

export const handleMove = (from: Square, to: Square) => {
    const promotions = chess.moves({ verbose: true }).filter((m) => m.promotion);
    if (promotions.some((p) => `${p.from}:${p.to}` === `${from}:${to}`)) {
        const pendingPromotion = { from, to, color: promotions[0] };
        updateGame(pendingPromotion);
    }
    const { pendingPromotion } = gameSubject.getValue();
    if (!pendingPromotion) {
        move(from, to);
    }
};

const updateGame = (pendingPromotion?: Promotion) => {
    const game: Game = {
        board: chess.board(),
        pendingPromotion
    };
    gameSubject.next(game);
};
