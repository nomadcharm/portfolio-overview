import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const binanceApi = createApi({
  reducerPath: "binanceApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://api.binance.com/api/v3/" }),
  endpoints: (builder) => ({
    getExchangeInfo: builder.query({
      query: () => "exchangeInfo",
    }),
    getCurrentPrices: builder.query({
      query: () => "ticker/price",
    }),
    get24hrTicker: builder.query({
      query: () => "ticker/24hr",
    }),
  }),
});

export const { useGetExchangeInfoQuery, useGetCurrentPricesQuery, useGet24hrTickerQuery } = binanceApi;
