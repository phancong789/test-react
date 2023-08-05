import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../app/store";

export interface UIState {
  switchTableType: "list" | "map" | string;
  status: "idle" | "loading" | "failed";
}

const initialState: UIState = {
  switchTableType: "list",
  status: "idle",
};

const uiSilce = createSlice({
  name: "uiSilce",
  initialState,
  reducers: {
    setSwitchTableType: (
      state,
      action: PayloadAction<"list" | "map" | string>
    ) => {
      state.switchTableType = action.payload;
      state.status = "idle";
    },
  },
});

export const { setSwitchTableType } = uiSilce.actions;

export const selectSwitchTableType = (state: RootState) =>
  state.uiSilce.switchTableType;

export default uiSilce.reducer;
