import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from '../utils/axiosInstance.jsx';


const BASE_URL = "https://netaai-crm-backend-production-c306.up.railway.app/api/proposals";

// ✅ Create Proposal
export const createProposal = createAsyncThunk(
  "proposal/create",
  async (proposalData, { rejectWithValue }) => {
    try {
      const res = await api.post(BASE_URL, proposalData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ✅ Get All Proposals
export const fetchAllProposals = createAsyncThunk(
  "proposal/fetchAll",

  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get(BASE_URL);
      // console.log("API response", res.data);
      // Try to always return an array
      if (Array.isArray(res.data.data)) {
        return res.data.data;
      } else if (res.data.data && Array.isArray(res.data.data.proposals)) {
        return res.data.data.proposals;
      } else {
        return [];
      }
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);


// ✅ Get All Proposals
// src/redux/thunks/proposals.js

export const updateProposalStatus = createAsyncThunk(
  "proposal/updateStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await api.put(`${"https://netaai-crm-backend-production-c306.up.railway.app/api"}/status/${id}`, { status });
      return response.data;
    } catch (err) {
      console.error("Failed to update proposal status:", err.response?.data || err.message);
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ✅ Get Proposal by ID
export const fetchProposalById = createAsyncThunk(
  "proposal/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`${"https://netaai-crm-backend-production-c306.up.railway.app/api"}/${id}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ✅ Update Proposal
export const updateProposal = createAsyncThunk(
  "proposal/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await api.patch(`${"https://netaai-crm-backend-production-c306.up.railway.app/api"}/${id}`, data);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ✅ Delete Proposal
export const deleteProposal = createAsyncThunk(
  "proposal/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`${"https://netaai-crm-backend-production-c306.up.railway.app/api"}/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 🔽 Slice Definition
const proposalSlice = createSlice({
  name: "proposal",
  initialState: {
    proposals: [],
    proposal: null,
    loading: false,
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
  },

  extraReducers: (builder) => {
    builder

      // Create
      .addCase(createProposal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProposal.fulfilled, (state, action) => {
        state.loading = false;
        state.proposals.push(action.payload);
      })
      .addCase(createProposal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get All
      .addCase(fetchAllProposals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllProposals.fulfilled, (state, action) => {
        // console.log("Payload in reducer", action.payload);
        state.loading = false;
        state.proposals = action.payload;
      })
      .addCase(fetchAllProposals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get by ID
      .addCase(fetchProposalById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProposalById.fulfilled, (state, action) => {
        state.loading = false;
        state.proposal = action.payload;
      })
      .addCase(fetchProposalById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update
      .addCase(updateProposal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProposal.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.proposals.findIndex(p => p.id === updated.id);
        if (index !== -1) {
          state.proposals[index] = updated;
        }
        state.loading = false;
      })
      .addCase(updateProposal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete
      .addCase(deleteProposal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProposal.fulfilled, (state, action) => {
        state.loading = false;
        state.proposals = state.proposals.filter(p => p._id !== action.payload);
      })
      .addCase(deleteProposal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { updateProposalStatusLocally } = proposalSlice.actions;

export default proposalSlice.reducer;
