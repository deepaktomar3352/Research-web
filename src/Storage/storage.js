import { configureStore } from '@reduxjs/toolkit';
import { paperReducer } from './Slices/Paper';
import { viewerReducer } from './Slices/viewer';
import { commentReducer } from './Slices/Comment';

const store = configureStore({
  reducer: {
    paper: paperReducer,
    comments: commentReducer,
    viewer: viewerReducer,
  },
});

export default store;
