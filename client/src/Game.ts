import { BehaviorSubject } from "rxjs";

//TypeScript chess.js workaround to get Constructor
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
    pendingPromotion?: Promotion | null;
    isGameOver?: boolean;
    turn: "b" | "w";
    result?: null | string;
}

export const gameSubject = new BehaviorSubject<Game>({
    board: chess.board(),
    turn: "w"
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
    const isGameOver = chess.game_over();
    const game: Game = {
        board: chess.board(),
        pendingPromotion,
        isGameOver,
        turn: chess.turn(),
        result: isGameOver ? getGameResult() : null
    };
    if (game.result) console.log(game.result);
    gameSubject.next(game);
};

const getGameResult = () => {
    if (chess.in_checkmate()) {
        const winner = chess.turn() === "w" ? "BLACK" : "WHITE";
        return `${winner} WON!`;
    } else if (chess.in_draw()) {
        let reason = "FIFTY-MOVE RULE";
        if (chess.in_stalemate()) {
            reason = "STALEMATE";
        } else if (chess.in_threefold_repetition()) {
            reason = "THREEFOLD_REPETITION";
        } else if (chess.insufficient_material()) {
            reason = "INSUFFICIENT MATERIAL";
        }
        return `IT'S A DRAW! REASON: ${reason}`;
    }
};

export const resetGame = () => {
    chess.reset();
    updateGame();
};
