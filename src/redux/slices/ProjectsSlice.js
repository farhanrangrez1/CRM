import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../utils/axiosInstance';
import { apiUrl } from '../../redux/utils/config';


export const fetchProject = createAsyncThunk(
  'project/fetchProject',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${apiUrl}/projects`);
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createProject = createAsyncThunk(
  'project/createProject',
  async (submissionData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `${apiUrl}/projects`,
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


export const deleteproject = createAsyncThunk(
  'project/deleteproject',
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`${apiUrl}/projects/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


export const fetchProjectById = createAsyncThunk('projects/fetchById', async (id) => {
  const response = await fetch(`/api/projects/${id}`);
  if (!response.ok) throw new Error("Failed to fetch project");
  return await response.json();
});

export const updateProject = createAsyncThunk(
  "projects/updateProject",
  async ({ id, payload }, thunkAPI) => {
    try {
      const response = await fetch(`${apiUrl}/projects/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update project");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);


const projectsSlice = createSlice({
  name: 'projects',
  initialState: {
    project: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    updateProposalStatusLocally: (state, action) => {
      const { id, status } = action.payload;
      const proposal = state.proposals.find(p => p.id == id || p._id == id);
      if (proposal) {
        proposal.status = status;
      }
    },
    updateProjectStatusLocally: (state, action) => {
      const { id, status } = action.payload;
      if (state.project && Array.isArray(state.project.data)) {
        const project = state.project.data.find(p => p.id == id || p._id == id);
        if (project) {
          project.status = status;
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder

      // Add
      //   .addCase(createProject.pending, (state) => {
      //     state.loading = true;
      //     state.error = null;
      //   })
      //   .addCase(createProject.fulfilled, (state, action) => {
      //     state.loading = false;
      //     state.project.push(action.payload);
      //   })
      //   .addCase(createProject.rejected, (state, action) => {
      //     state.loading = false;
      //     state.error = action.payload;
      //   })
      .addCase(fetchProject.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProject.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.project = action.payload;
      })
      .addCase(fetchProject.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })


      .addCase(updateProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // .addCase(updateProject.fulfilled, (state, action) => {
      //   const updated = action.payload;
      //   const index = state.proposals.findIndex(p => p.id === updated.id);
      //   if (index !== -1) {
      //     state.proposals[index] = updated;
      //   }
      //   state.loading = false;
      // })
      .addCase(updateProject.fulfilled, (state, action) => {
        const updated = action.payload;
        if (!Array.isArray(state.proposals)) {
          state.proposals = []; // fallback if ever undefined
        }

        const index = state.proposals.findIndex(p => p.id === updated.id || p._id === updated._id);
        if (index !== -1) {
          state.proposals[index] = updated;
        }

        state.loading = false;
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })


    //   .addCase(createproject.fulfilled, (state, action) => {
    //     state.project.push(action.payload);
    //   })
    //   .addCase(createproject.rejected, (state, action) => {
    //     state.status = 'failed';
    //     state.error = action.payload;
    //   })
    //   .addCase(deleteproject.fulfilled, (state, action) => {
    //     state.project = state.project.filter(
    //       (project) => project.id !== action.payload
    //     );
    //   })
    //   .addCase(deleteproject.rejected, (state, action) => {
    //     state.status = 'failed';
    //     state.error = action.payload;
    //   })

    //   .addCase(updateproject.fulfilled, (state, action) => {
    //     const index = state.project.findIndex(
    //       (project) => project.id === action.payload.id
    //     );
    //     if (index !== -1) {
    //       state.project[index] = action.payload; 
    //     }
    //   })
    //   .addCase(updateproject.rejected, (state, action) => {
    //     state.status = 'failed';
    //     state.error = action.payload;
    //   });
  },
});

export const { updateProjectStatusLocally, updateProposalStatusLocally } = projectsSlice.actions;
export default projectsSlice.reducer;
