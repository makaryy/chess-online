import { configureStore } from "@reduxjs/toolkit";
import boardReducer from "./board";
import gameReducer from "./game";
import chatReducer from "./chat";
// ...

const store = configureStore({
    reducer: {
        board: boardReducer,
        game: gameReducer,
        chat: chatReducer
    }
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
