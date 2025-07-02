import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../utils/axiosInstance';
import { apiUrl } from '../../redux/utils/config';


export const fetchClient = createAsyncThunk(
  'Clients/fetchClient',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${apiUrl}/Client`);
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createClients = createAsyncThunk(
  'Clients/createClients',
  async (submissionData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `${apiUrl}/Client`,
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

export const deleteClients = createAsyncThunk(
  'Clients/deleteClients',
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`${apiUrl}/Client/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchClientsById = createAsyncThunk('Client/fetchById', async (id) => {
    const response = await fetch(`/api/Client/${id}`);
    if (!response.ok) throw new Error("Failed to fetch Clients");
    return await response.json();
  });

export const UpdateClients = createAsyncThunk(
  'Client/updateClients',
  async ({ _id, data }) => {
    console.log("DJ", _id);

    const response = await fetch(`${apiUrl}/client/${_id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update Clients");
    return await response.json();
  }
);


export const UpdateClientsAssign = createAsyncThunk('Client/UpdateClientsAssign', async ({ id, assign }) => {
  const response = await fetch(`${apiUrl}/Client`, {
    method: "put",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id, assign }),  
  });
  if (!response.ok) throw new Error("Failed to update Client");
  return await response.json();
});

const ClientSlice = createSlice({
  name: 'client',
  initialState: {
    Clients: [],
    status: 'idle',
    error: null,
  },

  reducers: {},
  extraReducers: (builder) => {
    builder
          // Add
        //   .addCase(createClients.pending, (state) => {
        //     state.loading = true;
        //     state.error = null;
        //   })
        //   .addCase(createClients.fulfilled, (state, action) => {
        //     state.loading = false;
        //     state.Clients.push(action.payload);
        //   })
        //   .addCase(createClients.rejected, (state, action) => {
        //     state.loading = false;
        //     state.error = action.payload;
        //   })
      .addCase(fetchClient.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchClient.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.Clients = action.payload;
      })
      .addCase(fetchClient.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
    //   .addCase(createClients.fulfilled, (state, action) => {
    //     state.Clients.push(action.payload);
    //   })
    //   .addCase(createClients.rejected, (state, action) => {
    //     state.status = 'failed';
    //     state.error = action.payload;
    //   })
    //   .addCase(deleteClients.fulfilled, (state, action) => {
    //     state.Clients = state.Clients.filter(
    //       (Clients) => Clients.id !== action.payload
    //     );
    //   })
    //   .addCase(deleteClients.rejected, (state, action) => {
    //     state.status = 'failed';
    //     state.error = action.payload;
    //   })

    //   .addCase(updateClients.fulfilled, (state, action) => {
    //     const index = state.Clients.findIndex(
    //       (Clients) => Clients.id === action.payload.id
    //     );
    //     if (index !== -1) {
    //       state.Clients[index] = action.payload; 
    //     }
    //   })
    //   .addCase(updateClients.rejected, (state, action) => {
    //     state.status = 'failed';
    //     state.error = action.payload;
    //   });
  },
});

export default ClientSlice.reducer;
