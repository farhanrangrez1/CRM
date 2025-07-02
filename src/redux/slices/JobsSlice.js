import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../utils/axiosInstance';
import { apiUrl } from '../../redux/utils/config';


export const Project_job_Id = createAsyncThunk(
 'job/Project_job_Id',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${apiUrl}/jobs/${id}`);
      console.log("respos",response.data);
      
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const filterStatus = createAsyncThunk(
  'ProjectJob/fetchjobs',
  async (Status, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${apiUrl}/jobs/filter/${Status}`);
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchjobs = createAsyncThunk(
  'ProjectJob/fetchjobs',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${apiUrl}/jobs`);
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
export const createjob = createAsyncThunk(
  'job/createjob',
  async (submissionData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `${apiUrl}/jobs`,
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


export const deletejob = createAsyncThunk(
  'job/deletejob',
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`${apiUrl}/jobs/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


// Update Job
export const updatejob = createAsyncThunk('jobs/updatejob', async ({ id, data }, thunkAPI) => {
  try {
    const response = await fetch(`${apiUrl}/jobs/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text(); 
      throw new Error(`Failed to update job: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

  // Assign Job
export const UpdateJobAssign = createAsyncThunk('jobs/updatejob', async ({ id, assign }) => {
  const response = await fetch(`${apiUrl}/jobs/${id}`, {
    method: "put",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id, assign }),  
  });

  if (!response.ok) throw new Error("Failed to update jobs");

  return await response.json();
});


const jobsSlice = createSlice({
  name: 'jobs',
  initialState: {
    job: [],
    ProjectJob: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
    // Project_job_Id
      .addCase(Project_job_Id.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(Project_job_Id.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.ProjectJob = action.payload;
      })
      .addCase(Project_job_Id.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
          // Add
        //   .addCase(createjob.pending, (state) => {
        //     state.loading = true;
        //     state.error = null;
        //   })
        //   .addCase(createjob.fulfilled, (state, action) => {
        //     state.loading = false;
        //     state.job.push(action.payload);
        //   })
        //   .addCase(createjob.rejected, (state, action) => {
        //     state.loading = false;
        //     state.error = action.payload;
        //   })
      .addCase(fetchjobs.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchjobs.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.job = action.payload;
      })
      .addCase(fetchjobs.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
    //   .addCase(createjob.fulfilled, (state, action) => {
    //     state.job.push(action.payload);
    //   })
    //   .addCase(createjob.rejected, (state, action) => {
    //     state.status = 'failed';
    //     state.error = action.payload;
    //   })
    //   .addCase(deletejob.fulfilled, (state, action) => {
    //     state.job = state.job.filter(
    //       (job) => job.id !== action.payload
    //     );
    //   })
    //   .addCase(deletejob.rejected, (state, action) => {
    //     state.status = 'failed';
    //     state.error = action.payload;
    //   })

    //   .addCase(updatejob.fulfilled, (state, action) => {
    //     const index = state.job.findIndex(
    //       (job) => job.id === action.payload.id
    //     );
    //     if (index !== -1) {
    //       state.job[index] = action.payload; 
    //     }
    //   })
    //   .addCase(updatejob.rejected, (state, action) => {
    //     state.status = 'failed';
    //     state.error = action.payload;
    //   });
  },
});

export default jobsSlice.reducer;
