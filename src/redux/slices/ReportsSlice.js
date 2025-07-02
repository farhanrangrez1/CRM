import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../utils/axiosInstance';
import { apiUrl } from '../../redux/utils/config';

export const fetchReports = createAsyncThunk(
  'Reports/fetchReports',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${apiUrl}/ReportsAnalytics`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const ReportsSlice = createSlice({
  name: 'reportss',
  initialState: {
    Reports: {},
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReports.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchReports.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.Reports = action.payload;
      })
      .addCase(fetchReports.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default ReportsSlice.reducer;
