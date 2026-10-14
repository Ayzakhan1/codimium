import { configureStore } from "@reduxjs/toolkit";
import leadsSlice from "./slices/leadSlice";

export const store = configureStore({
  reducer: {
    leads: leadsSlice,
  },
});