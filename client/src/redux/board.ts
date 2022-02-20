import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BoardType } from "../Game";

interface BoardState {
    board: BoardType;
}

const initialState: BoardState = {
    board: [[null]]
};

const boardSlice = createSlice({
    name: "board",
    initialState,
    reducers: {
        setBoard: (state, action: PayloadAction<BoardType>) => {
            state.board = action.payload;
        },
        flipBoard: (state, action: PayloadAction<"w" | "b">) => {
            const flippedBoard = [...state.board].reverse();
            state.board = flippedBoard;
        }
    }
});

export const { setBoard, flipBoard } = boardSlice.actions;

export default boardSlice.reducer;
