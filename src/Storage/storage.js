import { configureStore } from '@reduxjs/toolkit';
import  paperSlice  from './Slices/Paper';
export const store = configureStore({
  reducer: {
    paper:paperSlice
  },
})