import { createSlice } from "@reduxjs/toolkit";

const leadsSlice = createSlice({
  name: "leads",

  initialState: {
    leads: [],
  },

  reducers: {
    leadData: (state, action) => {

      state.leads = action.payload;
      console.log("reduxdata", action.payload);
    },
  },
});

export const { leadData } = leadsSlice.actions;

export default leadsSlice.reducer;
