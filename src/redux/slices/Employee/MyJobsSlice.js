import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';
import { apiUrl } from '../../../redux/utils/config';
import { decryptToken } from '../../../Protecuted/decode';  // Adjust the path accordingly


export const Project_job_Id = createAsyncThunk(
  'job/Project_job_Id',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${apiUrl}/MyJobs/${id}`);
      console.log("respos", response.data);

      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchMyJobs = createAsyncThunk(
  'ProjectJob/fetchMyJobs',
  async (Status, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('encode');

      if (!token) {
        return rejectWithValue("Token or IV is missing in localStorage");
      }
      const decryptedToken = decryptToken(token);  
      //  console.log("Decrypted Token:", decryptedToken);

      const tokenParts = decryptedToken.split('.');
      if (tokenParts.length !== 3) {
        return rejectWithValue("Invalid token format");
      }
      const decodedPayload = JSON.parse(atob(tokenParts[1]));
       const userId = decodedPayload.id;
      // console.log("Decoded Payload:", decodedPayload);
    
      // Construct the URL with the user ID and Status
      const response = await axiosInstance.get(
        `${apiUrl}/AssignmentJob/getbyid/${userId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error occurred while fetching jobs:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const ReturnJob = createAsyncThunk(
  'DasbordAll/ReturnJob',
  async ({ jobId }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('encode');

      if (!token) {
        return rejectWithValue("Token or IV is missing in localStorage");
      }

      const decryptedToken = decryptToken(token);  
      const tokenParts = decryptedToken.split('.');
      if (tokenParts.length !== 3) {
        return rejectWithValue("Invalid token format");
      }

      const decodedPayload = JSON.parse(atob(tokenParts[1]));
      const userId = decodedPayload.id;

      const payload = {
        employeeId: userId,
        jobId: jobId
      };

      const response = await axiosInstance.delete(`${apiUrl}/Remove`, { data: payload });
      return response.data;
    } catch (error) {
      console.error("Error occurred while rejecting jobs:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


export const EmployeeDashboardData = createAsyncThunk(
  'DasbordAll/EmployeeDashboardData',
  async (Status, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('encode');

      if (!token) {
        return rejectWithValue("Token or IV is missing in localStorage");
      }
      const decryptedToken = decryptToken(token);  
      //  console.log("Decrypted Token:", decryptedToken);

      const tokenParts = decryptedToken.split('.');
      if (tokenParts.length !== 3) {
        return rejectWithValue("Invalid token format");
      }
      const decodedPayload = JSON.parse(atob(tokenParts[1]));
       const userId = decodedPayload.id;
      // console.log("Decoded Payload:", decodedPayload);
    
      // Construct the URL with the user ID and Status
      const response = await axiosInstance.get(
        `${apiUrl}/employee/dashboard/${userId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error occurred while fetching jobs:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createjob = createAsyncThunk(
  'job/createjob',
  async (submissionData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `${apiUrl}/MyJobs`,
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
      await axiosInstance.delete(`${apiUrl}/MyJobs/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


// Update Job
export const updatejob = createAsyncThunk('MyJobs/updatejob', async ({ id, data }, thunkAPI) => {
  try {
    const response = await fetch(`${apiUrl}/MyJobs/${id}`, {
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
export const UpdateJobAssign = createAsyncThunk('MyJobs/updatejob', async ({ id, assign }) => {
  const response = await fetch(`${apiUrl}/MyJobs/${id}`, {
    method: "put",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id, assign }),
  });
  if (!response.ok) throw new Error("Failed to update MyJobs");
  return await response.json();
});


const MyJobsSlice = createSlice({
  name: 'MyJobs',
  initialState: {
    myjobs: [],
    ProjectJob: [],
    DasbordAll:[],
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
      .addCase(fetchMyJobs.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMyJobs.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.myjobs = action.payload;
      })
      .addCase(fetchMyJobs.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
  

    // Dasbord case
          .addCase(EmployeeDashboardData.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(EmployeeDashboardData.fulfilled, (state, action) => {
          state.loading = false;
          state.DasbordAll.push(action.payload);
        })
        .addCase(EmployeeDashboardData.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
  },
});

export default MyJobsSlice.reducer;
