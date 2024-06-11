import { createSlice } from "@reduxjs/toolkit";

export const paperSlice = createSlice({
    name: 'paper', 
    initialState: {
        id:null
    },
    reducers: {
        setPaperId(state, action) {
            state.id = action.payload;  // setting the id to the payload of the action
        }
    }
});

export const { setPaperId } = paperSlice.actions;

export default paperSlice.reducer;
