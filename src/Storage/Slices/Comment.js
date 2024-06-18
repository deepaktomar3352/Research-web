import { createSlice } from "@reduxjs/toolkit";

const commentSlice = createSlice({
  name: 'comments',
  initialState: {
    userComments: [],
    viewerComments: [],
    userCommentCount: 0,
    viewerCommentCount: 0,
  },
  reducers: {
    setComments: (state, action) => {
      state.userComments = action.payload.userComments;
      state.viewerComments = action.payload.viewerComments;
      state.userCommentCount = action.payload.userCommentCount;
      state.viewerCommentCount = action.payload.viewerCommentCount;
    },
    markCommentAsRead: (state, action) => {
      const { id, type } = action.payload;
      if (type === 'user') {
        state.userComments = state.userComments.map(comment =>
          comment.id === id ? { ...comment, read: true } : comment
        );
      } else if (type === 'viewer') {
        state.viewerComments = state.viewerComments.map(comment =>
          comment.id === id ? { ...comment, read: true } : comment
        );
      }
    },
  },
});

// Export actions and reducer
export const { setComments, markCommentAsRead } = commentSlice.actions;
export const commentReducer = commentSlice.reducer;
