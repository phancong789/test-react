import { configureStore } from "@reduxjs/toolkit";
import authorReducer from "../Features/authorSlice";
import MilitariesReducer from "../Features/MilitariesSlice";
import uiReducer from "../Features/UiSlice";
import { AuthApi } from "../Services/autherApi";
import { MilitariesApi } from "../Services/MilitariesApi";
import { setupListeners } from "@reduxjs/toolkit/dist/query/react";

export const store = configureStore({
  reducer: {
    [AuthApi.reducerPath]: AuthApi.reducer,
    [MilitariesApi.reducerPath]: MilitariesApi.reducer,

    uiSilce: uiReducer,
    authorSlice: authorReducer,
    MilitariesSlice: MilitariesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: { warnAfter: 2000 },
      serializableCheck: { warnAfter: 2000 },
    })
      .concat(MilitariesApi.middleware)
      .concat(AuthApi.middleware),
  devTools: true,
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
setupListeners(store.dispatch);
