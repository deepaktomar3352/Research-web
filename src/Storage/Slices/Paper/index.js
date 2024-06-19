import { createSlice } from "@reduxjs/toolkit";

// Paper slice
export const paperSlice = createSlice({
  name: 'paper',
  initialState: {
    id: null,
  },
  reducers: {
    setPaperId(state, action) {
      state.id = action.payload;  // setting the id to the payload of the action
    },
  },
});

// Export actions and reducer
export const { setPaperId } = paperSlice.actions;
export const paperReducer = paperSlice.reducer;
