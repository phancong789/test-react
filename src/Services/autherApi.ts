import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../app/store";
import * as env from "../env";
import IUserData from "../Interface/IUserData";

export const AuthApi = createApi({
  reducerPath: "AuthApi",
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
  tagTypes: ["AuthApi"],
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (formdata: FormData) => {
        return {
          url: env.apiRoute.login,
          method: "post",
          body: formdata,
        };
      },
      invalidatesTags: [{ type: "AuthApi" }],
    }),
    me: builder.query<IUserData, any>({
      query: () => ({
        url: env.apiRoute.me,
      }),
    }),
    logout: builder.mutation<any, { token: string }>({
      query: (token) => ({
        url: env.apiRoute.logout,
        method: "post",
        body: token,
      }),
    }),
  }),
});

export const { useMeQuery, useLoginMutation, useLogoutMutation } = AuthApi;
