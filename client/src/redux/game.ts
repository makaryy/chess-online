import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Member } from "../components/Home";

interface GameState {
    status: string;
    members: Member[];
    id: string;
}

const initialState: GameState = {
    status: "waiting",
    members: [],
    id: ""
};

const gameSlice = createSlice({
    name: "game",
    initialState,
    reducers: {
        setGame: (state, action: PayloadAction<GameState>) => {
            state.status = action.payload.status;
            state.members = action.payload.members;
            state.id = action.payload.id;
        }
    }
});

export const { setGame } = gameSlice.actions;

export default gameSlice.reducer;
