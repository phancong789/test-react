import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../app/store";
import { MilitariesApi } from "../Services/MilitariesApi";
import IListData from "../Interface/IListData";
import IMilitariesData from "../Interface/IMilitariesData";

export interface StartState {
  Militaries: IListData<IMilitariesData[]> | null;
  SelectMilitaries: IMilitariesData | null;
  status: "idle" | "loading" | "failed";
}

const initialState: StartState = {
  Militaries: null,
  SelectMilitaries: null,
  status: "idle",
};

const MilitariesSlice = createSlice({
  name: "MilitariesSlice",
  initialState,
  reducers: {
    setSelectMilitaries: (state, action: PayloadAction<IMilitariesData>) => {
      state.SelectMilitaries = action.payload;
      state.status = "idle";
    },
    removeSelectMilitaries: (state) => {
      state.SelectMilitaries = null;
      state.status = "idle";
    },
  },
  extraReducers(builder) {
    builder.addMatcher(
      MilitariesApi.endpoints.getMilitaries.matchFulfilled,
      (state, { payload }) => {
        state.Militaries = payload;
        state.status = "idle";
      }
    );
  },
});

export const { setSelectMilitaries, removeSelectMilitaries } =
  MilitariesSlice.actions;

export const selectMilitaries = (state: RootState) =>
  state.MilitariesSlice.Militaries;

export const selectSelectedMilitaries = (state: RootState) =>
  state.MilitariesSlice.SelectMilitaries;

export default MilitariesSlice.reducer;
