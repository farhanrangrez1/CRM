import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../utils/axiosInstance';
import { apiUrl } from '../../redux/utils/config';


export const fetchAssign = createAsyncThunk(
  'assigns/fetchAssign',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${apiUrl}/AssignmentJob`);
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createAssigns = createAsyncThunk(
  'Assigns/createAssigns',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `${apiUrl}/AssignmentJob`,
        payload,
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

export const deleteAssigns = createAsyncThunk(
  'Assigns/deleteAssigns',
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`${apiUrl}/Assign/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchAssignsById = createAsyncThunk('Assign/fetchById', async (id) => {
    const response = await fetch(`/api/Assign/${id}`);
    if (!response.ok) throw new Error("Failed to fetch Assigns");
    return await response.json();
  });

  export const updateAssigns = createAsyncThunk('Assign/updateAssigns', async ({ id, data }) => {
    const response = await fetch(`/api/Assign/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update Assigns");
    return await response.json();
  });
  

export const UpdateAssignsAssign = createAsyncThunk('Assign/updateAssigns', async ({ id, assign }) => {
  const response = await fetch(`${apiUrl}/Assign`, {
    method: "put",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id, assign }),  
  });
  if (!response.ok) throw new Error("Failed to update Assign");
  return await response.json();
});

const AssignSlice = createSlice({
  name: 'Assign',
  initialState: {
    assigns: [],
    status: 'idle',
    error: null,
  },

  reducers: {},
  extraReducers: (builder) => {
    builder
          // Add
        //   .addCase(createAssigns.pending, (state) => {
        //     state.loading = true;
        //     state.error = null;
        //   })
        //   .addCase(createAssigns.fulfilled, (state, action) => {
        //     state.loading = false;
        //     state.Assigns.push(action.payload);
        //   })
        //   .addCase(createAssigns.rejected, (state, action) => {
        //     state.loading = false;
        //     state.error = action.payload;
        //   })
      .addCase(fetchAssign.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAssign.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.assigns = action.payload;
      })
      .addCase(fetchAssign.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
    //   .addCase(createAssigns.fulfilled, (state, action) => {
    //     state.Assigns.push(action.payload);
    //   })
    //   .addCase(createAssigns.rejected, (state, action) => {
    //     state.status = 'failed';
    //     state.error = action.payload;
    //   })
    //   .addCase(deleteAssigns.fulfilled, (state, action) => {
    //     state.Assigns = state.Assigns.filter(
    //       (Assigns) => Assigns.id !== action.payload
    //     );
    //   })
    //   .addCase(deleteAssigns.rejected, (state, action) => {
    //     state.status = 'failed';
    //     state.error = action.payload;
    //   })

    //   .addCase(updateAssigns.fulfilled, (state, action) => {
    //     const index = state.Assigns.findIndex(
    //       (Assigns) => Assigns.id === action.payload.id
    //     );
    //     if (index !== -1) {
    //       state.Assigns[index] = action.payload; 
    //     }
    //   })
    //   .addCase(updateAssigns.rejected, (state, action) => {
    //     state.status = 'failed';
    //     state.error = action.payload;
    //   });
  },
});

export default AssignSlice.reducer;
