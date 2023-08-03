import { configureStore } from "@reduxjs/toolkit";
import { AuthApi } from "../service/autherApi";
import { HomeAndSearchApi } from "../service/HomeAndSearchApi";
import { UserApi } from "../service/UserApi";
import usersReducer from "../features/UserSlice";
import authorReducer from "../features/authorSlice";
import HomeAndSearchReducer from "../features/HomeAndSearchSlice";
import { setupListeners } from "@reduxjs/toolkit/dist/query/react";
import UiReducer from "../features/UiSlice";
import { ProvinceApi } from "../features/TamThoi/ProvinceApi";
import ProvinceReducer from "../features/TamThoi/ProvinceSlice";

export const store = configureStore({
  reducer: {
    [AuthApi.reducerPath]: AuthApi.reducer,
    [HomeAndSearchApi.reducerPath]: HomeAndSearchApi.reducer,
    [UserApi.reducerPath]: UserApi.reducer,
    [ProvinceApi.reducerPath]: ProvinceApi.reducer,
    usersSilce: usersReducer,
    HomeAndSearchSlice: HomeAndSearchReducer,
    authorSlice: authorReducer,
    uiSilce: UiReducer,
    ProvinceSlice: ProvinceReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(UserApi.middleware)
      .concat(AuthApi.middleware)
      .concat(HomeAndSearchApi.middleware)
      .concat(ProvinceApi.middleware),
  devTools: true,
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
setupListeners(store.dispatch);
