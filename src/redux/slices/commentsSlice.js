import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import api from "../utils/api";
import axios from "axios";
import { apiUrl } from "../utils/config";
const BASE_URL = "https://netaai-crm-backend-production-c306.up.railway.app/api/comments"; // adjust this according to your backend route
const NETA_BASE_URL = "https://netaai-crm-backend-production-c306.up.railway.app/api"; // adjust this according to your backend route

// ✅ Create Comment
export const createComment = createAsyncThunk(
  "comments/create",
  async (commentData, { rejectWithValue }) => {
    try {
      const res = await axios.post(BASE_URL, commentData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ✅ Get All Comments
export const fetchAllComments = createAsyncThunk(
  "comments/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(BASE_URL);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ✅ Get All comments by logId
export const fetchCommentById = createAsyncThunk(
  "comments/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${NETA_BASE_URL}/getCommentsByDailyLog/${id}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ✅ Update Comment
export const updateComment = createAsyncThunk(
  "comments/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await axios.patch(`${BASE_URL}/${id}`, data);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ✅ Delete Comment
export const deleteComment = createAsyncThunk(
  "comments/delete",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${BASE_URL}/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 🔽 Slice Definition
const commentsSlice = createSlice({
  name: "comments",
  initialState: {
    comments: [],
    comment: null,
    loading: false,
    error: null,
  },
  reducers: {},

  extraReducers: (builder) => {
    builder
      // Create
      .addCase(createComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.loading = false;
        state.comments.push(action.payload);
      })
      .addCase(createComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get All
      .addCase(fetchAllComments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllComments.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = action.payload;
      })
      .addCase(fetchAllComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get by ID
      .addCase(fetchCommentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCommentById.fulfilled, (state, action) => {
        state.loading = false;
        state.comment = action.payload;
      })
      .addCase(fetchCommentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update
      .addCase(updateComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateComment.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.comments.findIndex(c => c.id === updated.id);
        if (index !== -1) {
          state.comments[index] = updated;
        }
        state.loading = false;
      })
      .addCase(updateComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete
      .addCase(deleteComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = state.comments.filter(c => c._id !== action.payload);
      })
      .addCase(deleteComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default commentsSlice.reducer;
