import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../app/store";

export interface UIState {
  toggleControlPanelSiderBar: boolean;
  switchSearchPageContent: "grid" | "table" | "map" | "statistical" | string;
  status: "idle" | "loading" | "failed";
}

const initialState: UIState = {
  toggleControlPanelSiderBar: true,
  switchSearchPageContent: "grid",
  status: "idle",
};

const uiSilce = createSlice({
  name: "uiSilce",
  initialState,
  reducers: {
    setToggleControlPanelSiderBar: (state) => {
      state.toggleControlPanelSiderBar = !state.toggleControlPanelSiderBar;
      state.status = "idle";
    },
    setSwitchSearchPageContent: (
      state,
      action: PayloadAction<"grid" | "table" | "map" | "statistical" | string>
    ) => {
      state.switchSearchPageContent = action.payload;
      state.status = "idle";
    },
  },
});

export const { setToggleControlPanelSiderBar, setSwitchSearchPageContent } =
  uiSilce.actions;

export const selectToggleControlPanelSiderBar = (state: RootState) =>
  state.uiSilce.toggleControlPanelSiderBar;
export const selectSwitchSearchPageContent = (state: RootState) =>
  state.uiSilce.switchSearchPageContent;

export default uiSilce.reducer;
