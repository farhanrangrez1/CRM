import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../utils/axiosInstance';
import { apiUrl } from '../../redux/utils/config';


export const fetchTimeLogss = createAsyncThunk(
  'TimeLogss/fetchTimeLogss',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${apiUrl}/timeLogs`);
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createTimeLogs = createAsyncThunk(
 'TimeLogss/createTimeLogs',
  async (submissionData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `${apiUrl}/timeLogs`,
        submissionData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
export const deleteTimeLogs = createAsyncThunk(
  'TimeLogss/deleteTimeLogs',
  async (_id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`${apiUrl}/timeLogs/${_id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchTimeLogsById = createAsyncThunk('TimeLogss/fetchById', async (id) => {
  const response = await fetch(`/api/jobs/${id}`);
  if (!response.ok) throw new Error("Failed to fetch job");
  return await response.json();
});


export const updateTimeLogs = createAsyncThunk(
  'TimeLogss/updateTimeLogs',
  async ({ _id, data }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${apiUrl}/timeLogs/${_id}`, {
        method: "PATCH", // PATCH should be uppercase
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return rejectWithValue(errorData.message || "Failed to update time logs");
      }
      const result = await response.json();
      return result;
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);


export const updateExtraHours = createAsyncThunk(
  'TimeLogss/updateTimeLogs',
  async (payload, { rejectWithValue }) => {
    try {
      // Make PATCH request using fetch (or your 'put' helper if it matches this signature)
      const response = await fetch(`${apiUrl}/timeLogs`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return rejectWithValue(errorData.message || "Failed to update time logs");
      }

      const result = await response.json();
      return result;

    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);

const TimeLogsSlice = createSlice({
  name: 'TimeLogss',
  initialState: {
    timelogs: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTimeLogss.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTimeLogss.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.timelogs = action.payload;
      })
      .addCase(fetchTimeLogss.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
    //   .addCase(fetchjobs.pending, (state) => {
    //     state.status = 'loading';
    //   })
    //   .addCase(fetchjobs.fulfilled, (state, action) => {
    //     state.status = 'succeeded';
    //     state.purchases = action.payload;
    //   })
    //   .addCase(fetchjobs.rejected, (state, action) => {
    //     state.status = 'failed';
    //     state.error = action.payload;
    //   });
  },
});

export default TimeLogsSlice.reducer;
