import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../utils/axiosInstance';
import { apiUrl } from '../../redux/utils/config';


export const fetchTimesheetWorklogs = createAsyncThunk(
  'TimesheetWorklogs/fetchTimesheetWorklogs',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${apiUrl}/TimesheetWorklog`);
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createTimesheetWorklog = createAsyncThunk(
 'TimesheetWorklogs/createTimesheetWorklog',
  async (submissionData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `${apiUrl}/timesheetWorklog`,
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
export const deleteTimesheetWorklog = createAsyncThunk(
  'TimesheetWorklogs/deleteTimesheetWorklog',
  async (_id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`${apiUrl}/timesheetWorklog/${_id}`);
      return _id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


export const fetchTimesheetWorklogById = createAsyncThunk('TimesheetWorklogs/fetchById', async (id) => {
  const response = await fetch(`/api/jobs/${id}`);
  if (!response.ok) throw new Error("Failed to fetch job");
  return await response.json();
});


export const updateTimesheetWorklog = createAsyncThunk(
  'TimesheetWorklogs/updateTimesheetWorklog',
  async ({ _id, data }, { rejectWithValue }) => {
  try {
    const response = await fetch(`${apiUrl}/TimesheetWorklog/${_id}`, {
      method: "PATCH",
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
  'TimesheetWorklogs/updateTimesheetWorklog',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await fetch(`${apiUrl}/TimesheetWorklog`, {
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

const TimesheetWorklogSlice = createSlice({
  name: 'TimesheetWorklogs',
  initialState: {
    timesheetWorklog: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTimesheetWorklogs.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTimesheetWorklogs.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.timesheetWorklog = action.payload;
      })
      .addCase(fetchTimesheetWorklogs.rejected, (state, action) => {
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

export default TimesheetWorklogSlice.reducer;
