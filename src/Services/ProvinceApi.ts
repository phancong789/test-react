import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../../app/store";
import * as env from "../../env";
import IListData from "../../Interface/IListData";
import IMapInfo from "../../Interface/IMapInfo";

export const ProvinceApi = createApi({
  reducerPath: "ProvinceApi",
  baseQuery: fetchBaseQuery({
    baseUrl: env.hostName,
    prepareHeaders: (headers, { getState }) => {
      const RootState = getState() as RootState;
      const token = RootState.authorSlice.token;
      if (token)
        headers.set(
          "Authorization",
          token.token_type + " " + token.access_token
        );

      return headers;
    },
  }),
  tagTypes: ["ProvinceApi"],
  endpoints: (builder) => ({
    getProvince: builder.query<IListData<IMapInfo[]>, any>({
      query: () => ({
        url: env.apiRoute.provinces,
        params: env.getProvinParams,
      }),
    }),
  }),
});

export const { useLazyGetProvinceQuery } = ProvinceApi;
