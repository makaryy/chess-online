import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TurnState {
    turn: "w" | "b";
}

const initialState: TurnState = {
    turn: "w"
};

const turnSlice = createSlice({
    name: "turn",
    initialState,
    reducers: {
        setTurn: (state, action: PayloadAction<"w" | "b">) => {
            state.turn = action.payload;
        }
    }
});

export const { setTurn } = turnSlice.actions;

export default turnSlice.reducer;
