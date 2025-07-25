import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import api from "../utils/api";
import axios from "axios";
import { apiNetaUrl } from "../utils/config";
const BASE_URL = `${apiNetaUrl}/daily_logs`;
// ✅ Create Daily Log
export const createDailyLog = createAsyncThunk(
  "dailylog/create",
  async (logData, { rejectWithValue }) => {
    try {
      const res = await axios.post(BASE_URL, logData);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ✅ Fetch All Daily Logs
export const fetchAllDailyLogs = createAsyncThunk(
  "dailylog/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(BASE_URL);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ✅ Fetch Single Daily Log by ID
export const fetchDailyLogById = createAsyncThunk(
  "dailylog/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_URL}/${id}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ✅ Update Daily Log
export const updateDailyLog = createAsyncThunk(
  "dailylog/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await axios.patch(`${BASE_URL}/${id}`, data);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ✅ Delete Daily Log
export const deleteDailyLog = createAsyncThunk(
  "dailylog/delete",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${BASE_URL}/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const dailyLogSlice = createSlice({
  name: "dailylog",
  initialState: {
    logs: [],
    log: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Create
      .addCase(createDailyLog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDailyLog.fulfilled, (state, action) => {
        state.loading = false;
        state.logs.push(action.payload);
      })
      .addCase(createDailyLog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch All
      .addCase(fetchAllDailyLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllDailyLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.logs = action.payload;
      })
      .addCase(fetchAllDailyLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch by ID
      .addCase(fetchDailyLogById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDailyLogById.fulfilled, (state, action) => {
        state.loading = false;
        state.log = action.payload;
      })
      .addCase(fetchDailyLogById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update
      .addCase(updateDailyLog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDailyLog.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        const index = state.logs.findIndex((log) => log.id === updated.id);
        if (index !== -1) {
          state.logs[index] = updated;
        }
      })
      .addCase(updateDailyLog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete
      .addCase(deleteDailyLog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDailyLog.fulfilled, (state, action) => {
        state.loading = false;
        state.logs = state.logs.filter((log) => log._id !== action.payload);
      })
      .addCase(deleteDailyLog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default dailyLogSlice.reducer;
