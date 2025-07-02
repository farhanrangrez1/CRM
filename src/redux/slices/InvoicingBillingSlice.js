import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../utils/axiosInstance';
import { apiUrl } from '../utils/config';


export const fetchInvoicingBilling = createAsyncThunk(
  'InvoicingBilling/fetchInvoicingBilling',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${apiUrl}/InvoicingBilling`);
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createInvoicingBilling = createAsyncThunk(
  'InvoicingBilling/createInvoicingBilling',
  async (submissionData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `${apiUrl}/InvoicingBilling`,
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

export const deleteInvoicingBilling = createAsyncThunk(
  'invocing/deleteInvoicingBilling',
  async (_id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`${apiUrl}/InvoicingBilling/${_id}`);
      return _id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchCostEstimateById = createAsyncThunk('InvoicingBilling/fetchById', async (id) => {
  const response = await fetch(`/api/jobs/${id}`);
  if (!response.ok) throw new Error("Failed to fetch job");
  return await response.json();
});


export const updateInvoicingBilling = createAsyncThunk(
  'invocing/updateInvoicingBilling',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${apiUrl}/InvoicingBilling/${id}`, {
        method: "PATCH", // PATCH should be uppercase
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return rejectWithValue(errorData.message || "Failed to update cost estimate");
      }
      const result = await response.json();
      return result;
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);

const InvoicingBillingSlice = createSlice({
  name: 'InvoicingBilling',
  initialState: {
    invocing: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInvoicingBilling.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchInvoicingBilling.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.invocing = action.payload;
      })
      .addCase(fetchInvoicingBilling.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
    //   .addCase(fetchjobs.pending, (state) => {
    //     state.status = 'loading';
    //   })
    //   .addCase(fetchjobs.fulfilled, (state, action) => {
    //     state.status = 'succeeded';
    //     state.estimates = action.payload;
    //   })
    //   .addCase(fetchjobs.rejected, (state, action) => {
    //     state.status = 'failed';
    //     state.error = action.payload;
    //   });
  },
});

export default InvoicingBillingSlice.reducer;
