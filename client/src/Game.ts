//TypeScript chess.js workaround to get Constructor
import Chess, { ChessInstance, PieceType, Square } from "chess.js";
import { map } from "rxjs/operators";
import { fromRef } from "rxfire/firestore";
import { doc, DocumentData, DocumentReference, Firestore, getDoc, updateDoc } from "firebase/firestore";
import { Member } from "./components/Home";
import { auth, db } from "./firebase/firebase";
import { Observable } from "rxjs";
import { doc as RxDoc } from "rxfire/firestore";
import { DocumentSnapshot } from "rxfire/firestore/interfaces";
import { User } from "firebase/auth";
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
    position: "b" | "w";
    result?: null | string;
}

//CHECK CORRECT TYPE FOR THAT
// export let gameSubject: Observable<DocumentSnapshot<DocumentData>>;
export let gameSubject: Observable<
    | {
          board: ({ type: PieceType; color: "b" | "w" } | null)[][];
          pendingPromotion: any;
          isGameOver: boolean;
          position: "b" | "w";
          member: Member;
          oponent: any;
          result: string | null | undefined;
      }
    | undefined
>;
export let gameRef: DocumentReference<DocumentData>;
export let member: Member;

const { currentUser } = auth;

export const initGame = async (db: Firestore, collection: "games", id: string, user: User | null | undefined) => {
    gameRef = doc(db, collection, id);
    const gameData = await getDoc(gameRef);
    const initialGame = gameData.data();
    if (!initialGame) {
        console.log(" Game doesn't exist");
        return "Game doesn't exist";
    } else {
        const creator = initialGame.members.find((m: Member) => m.creator === true);
        if (user) {
            if (initialGame.status === "waiting" && creator.uid !== user?.uid) {
                const currentMember = {
                    displayName: user.displayName,
                    uid: user.uid,
                    creator: false,
                    color: creator.color === "w" ? "b" : "w"
                };
                const updatedMembers = [...initialGame.members, currentMember];
                await updateDoc(gameRef, { members: updatedMembers, status: "in_progress" });
            }
        } else {
            console.log("Cannot find player");
        }
        // else if (initialGame?.status === "in_progress") {
        //     return "Game in progress";
        // }
    }

    chess.reset();

    gameSubject = fromRef(gameRef).pipe(
        map((gameDoc) => {
            const game = gameDoc.data();
            if (game) {
                const { pendingPromotion, gameData, ...restOfGame } = game;
                member = game.members.find((m: Member) => m.uid === user?.uid);
                const oponent = game.members.find((m: Member) => m.uid !== user?.uid);

                if (gameData) {
                    chess.load(gameData);
                }
                const isGameOver = chess.game_over();

                return {
                    board: chess.board(),
                    pendingPromotion,
                    isGameOver,
                    position: member.color,
                    member,
                    oponent,
                    result: isGameOver ? getGameResult() : null,
                    ...restOfGame
                };
            }
        })
    );
    // return gameSubject;
};

export const move = (from: Square, to: Square, promotion?: Exclude<PieceType, "p" | "k"> | undefined) => {
    if (gameRef) {
        if (member.color === chess.turn()) {
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
        }
    }
};

export const handleMove = (from: Square, to: Square) => {
    const promotions = chess.moves({ verbose: true }).filter((m) => m.promotion);
    let pendingPromotion: Promotion | null = null;
    if (promotions.some((p) => `${p.from}:${p.to}` === `${from}:${to}`)) {
        pendingPromotion = { from, to, color: promotions[0] };
        updateGame(pendingPromotion);
    }

    if (!pendingPromotion) {
        move(from, to);
    }
};

const updateGame = async (pendingPromotion?: Promotion) => {
    const updatedData = { gameData: chess.fen(), pendingPromotion: pendingPromotion || null };
    await updateDoc(gameRef, updatedData);
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
