import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Message {
    msg: string;
    img: string;
    user:
        | {
              uid: string | undefined;
              displayName: string | undefined | null;
          }
        | undefined
        | null;
    createdAt: string;
}

interface ChatState {
    gameId: string;
    id: string | undefined;
    messages: Message[];
}

const initialState: ChatState = {
    gameId: "",
    id: undefined,
    messages: []
};

const chatSlice = createSlice({
    name: "game",
    initialState,
    reducers: {
        setChat: (state, action: PayloadAction<ChatState>) => {
            state.gameId = action.payload.gameId;
            state.id = action.payload.id;
            state.messages = action.payload.messages;
        },
        updateMessages: (state, action: PayloadAction<Message[]>) => {
            state.messages = action.payload;
        }
    }
});

export const { setChat, updateMessages } = chatSlice.actions;

export default chatSlice.reducer;
