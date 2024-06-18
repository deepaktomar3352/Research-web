import { configureStore } from '@reduxjs/toolkit';
import { paperReducer } from './Slices/Paper';
import { commentReducer } from './Slices/Comment';

const store = configureStore({
  reducer: {
    paper: paperReducer,
    comments: commentReducer,
  },
});

export default store;
