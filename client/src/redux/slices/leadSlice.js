
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  leads: [],
};

const leadsSlice = createSlice({
  name: "leads",
  initialState,

  reducers: {
    // API se complete leads list load karna
    leadData: (state, action) => {
      state.leads = action.payload;
    },

    // Naya lead add karna
    addLead: (state, action) => {
      state.leads.push(action.payload);
    },

    // Existing lead update karna
    updateLead: (state, action) => {
      const updatedLead = action.payload;

      const index = state.leads.findIndex(
        (lead) => lead._id === updatedLead._id
      );

      if (index !== -1) {
        state.leads[index] = updatedLead;
      }
    },

    // Lead delete karna
    removeLead: (state, action) => {
      state.leads = state.leads.filter(
        (lead) => lead._id !== action.payload
      );
    },
  },
});

export const {
  leadData,
  addLead,
  updateLead,
  removeLead,
} = leadsSlice.actions;

export default leadsSlice.reducer;
