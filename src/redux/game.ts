import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Member } from "../components/Home";

interface GameState {
    status: string;
    members: Member[];
    id: string;
    chatId: string;
}

const initialState: GameState = {
    status: "waiting",
    members: [],
    id: "",
    chatId: ""
};

const gameSlice = createSlice({
    name: "game",
    initialState,
    reducers: {
        setGame: (state, action: PayloadAction<GameState>) => {
            state.status = action.payload.status;
            state.members = action.payload.members;
            state.id = action.payload.id;
            state.chatId = action.payload.chatId;
        },
        updateMembers: (state, action: PayloadAction<Member[]>) => {
            state.members = action.payload;
        }
    }
});

export const { setGame, updateMembers } = gameSlice.actions;

export default gameSlice.reducer;
