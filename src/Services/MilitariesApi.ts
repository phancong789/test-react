import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../app/store";
import * as env from "../env";
import IListData from "../Interface/IListData";
import IMilitariesData from "../Interface/IMilitariesData";

export const MilitariesApi = createApi({
  reducerPath: "MilitariesApi",
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
  tagTypes: ["MilitariesApi"],
  endpoints: (builder) => ({
    getMilitaries: builder.query<IListData<IMilitariesData[]>, any>({
      query: () => ({
        url: env.apiRoute.militaries,
        params: env.getMilitariesParams,
      }),
      providesTags: ["MilitariesApi"],
    }),
    addNewMilitaries: builder.mutation({
      query: (data) => ({
        url: env.apiRoute.addNew,
        method: "POST",
        body: data,
      }),
    }),
    updateMilitaries: builder.mutation({
      query: (data) => ({
        url: env.apiRoute.update + data.id,
        method: "PUT",
        body: data,
      }),
    }),
    deleteMilitaries: builder.mutation({
      query: (id) => ({
        url: env.apiRoute.delete + id,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetMilitariesQuery,
  useLazyGetMilitariesQuery,
  useAddNewMilitariesMutation,
  useDeleteMilitariesMutation,
  useUpdateMilitariesMutation,
} = MilitariesApi;
