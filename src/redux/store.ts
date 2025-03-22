import { configureStore } from "@reduxjs/toolkit";
import { binanceApi } from "./features/binanceSlice";

export const store = configureStore({
  reducer: {
    [binanceApi.reducerPath]: binanceApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(binanceApi.middleware),
});
