import { createSlice } from "@reduxjs/toolkit";

// Paper slice
export const viewerSlice = createSlice({
  name: 'viewer',
  initialState: {
    id: null,
  },
  reducers: {
    setViewerId(state, action) {
      state.id = action.payload;  // setting the id to the payload of the action
    },
  },
});

// Export actions and reducer
export const { setViewerId } = viewerSlice.actions;
export const viewerReducer = viewerSlice.reducer;
