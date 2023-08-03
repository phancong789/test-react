import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { ProvinceApi } from "./ProvinceApi";
import IListData from "../../Interface/IListData";
import IMapInfo from "../../Interface/IMapInfo";

export interface StartState {
  Province: IListData<IMapInfo[]> | null;
  mapinfo: IMapInfo[];
  status: "idle" | "loading" | "failed";
}

const initialState: StartState = {
  Province: null,
  mapinfo: [],
  status: "idle",
};

const ProvinceSlice = createSlice({
  name: "ProvinceSlice",
  initialState,
  reducers: {
    setMapinfo: (state, action: PayloadAction<IMapInfo>) => {
      state.mapinfo = [...state.mapinfo, action.payload];
    },
    deleteMapInfo: (state, action: PayloadAction<number>) => {
      state.mapinfo = state.mapinfo.filter(({ id }) => id !== action.payload);
      state.status = "idle";
    },
  },
  extraReducers(builder) {
    builder.addMatcher(
      ProvinceApi.endpoints.getProvince.matchFulfilled,
      (state, { payload }) => {
        if (state.Province) {
          state.Province.list = state.Province.list.concat(payload.list);
        } else {
          state.Province = payload;
        }

        state.status = "idle";
      }
    );
  },
});

export const { setMapinfo, deleteMapInfo } = ProvinceSlice.actions;

export const selectProvinces = (state: RootState) =>
  state.ProvinceSlice.Province;
export const selectMapinfo = (state: RootState) => state.ProvinceSlice.mapinfo;

export default ProvinceSlice.reducer;
