import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { useEffect } from "react";
import { IPriceInfo } from "../../types/types";

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

type SetPricesFunction = (prices: IPriceInfo[]) => void;

interface IncomingPriceData {
  s: string;
  c: string; 
}

export const useWebSocketPrices = (setPrices: SetPricesFunction) => {
  useEffect(() => {
    const socket = new WebSocket('wss://stream.binance.com:9443/ws/!ticker@arr');
    let lastUpdateTime = 0;

    socket.onmessage = (event) => {
      const prices = JSON.parse(event.data);

      const updatedPrices = prices.map((price: IncomingPriceData) => {
        const priceString = price.c;
        const currentPrice = parseFloat(priceString);

        return {
          symbol: price.s,
          price: isNaN(currentPrice) ? null : currentPrice
        };
      });

      const currentTime = Date.now();
      if (currentTime - lastUpdateTime >= 2000) {
        setPrices(updatedPrices);
        lastUpdateTime = currentTime;
      }
    };

    return () => {
      socket.close();
    };
  }, [setPrices]);
};

export const { useGetExchangeInfoQuery, useGetCurrentPricesQuery, useGet24hrTickerQuery } = binanceApi;
