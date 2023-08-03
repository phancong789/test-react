import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthApi } from "../Services/autherApi";
import { RootState } from "../app/store";
import IToken from "../Interface/IToken";
import IUserData from "../Interface/IUserData";

export interface tokenState {
  currentUser: IUserData | null;
  token: IToken | null;
  status: "idle" | "loading" | "failed";
}

const initialState: tokenState = {
  token: null,
  currentUser: null,
  status: "idle",
};

const authorSilce = createSlice({
  name: "authorSilce",
  initialState,
  reducers: {
    setTokenFormStogare: (state, action: PayloadAction<IToken>) => {
      state.token = action.payload;
    },
  },
  extraReducers(builder) {
    builder.addMatcher(
      AuthApi.endpoints.login.matchFulfilled,
      (state, { payload }) => {
        state.token = payload;
        state.status = "idle";
        localStorage.setItem("token", JSON.stringify(state.token));
      }
    );
    builder.addMatcher(AuthApi.endpoints.logout.matchPending, (state) => {
      state.currentUser = null;
      state.token = null;
      state.status = "loading";
      localStorage.removeItem("token");
    });
    builder.addMatcher(AuthApi.endpoints.logout.matchFulfilled, (state) => {
      state.status = "idle";
      localStorage.removeItem("token");
    });
    builder.addMatcher(
      AuthApi.endpoints.me.matchFulfilled,
      (state, { payload }) => {
        state.currentUser = payload;
        state.status = "idle";
      }
    );
  },
});

export const { setTokenFormStogare } = authorSilce.actions;

export const selectToken = (state: RootState) => state.authorSlice.token;
export const selectCurrentUser = (state: RootState) =>
  state.authorSlice.currentUser;

export default authorSilce.reducer;
