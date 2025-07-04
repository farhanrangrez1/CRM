import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../utils/axiosInstance";

const BASE_URL = "https://netaai-crm-backend-production-c306.up.railway.app/api/documentsRecord";

// ✅ Create Document Record
export const createDocumentRecord = createAsyncThunk(
    "documentRecord/create",
    async (data, { rejectWithValue }) => {
        try {
            const res = await api.post(BASE_URL, data);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

// ✅ Get All Document Records
export const getAllDocumentsRecord = createAsyncThunk(
    "documentRecord/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get(BASE_URL);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

// ✅ Get Document Record by ID
export const getDocumentByIdRecord = createAsyncThunk(
    "documentRecord/fetchById",
    async (id, { rejectWithValue }) => {
        try {
            const res = await api.get(`${BASE_URL}/${id}`);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

// ✅ Update Document Record
export const updateDocumentRecord = createAsyncThunk(
    "documentRecord/update",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const res = await api.put(`${BASE_URL}/${id}`, data);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

// ✅ Delete Document Record
export const deleteDocumentRecord = createAsyncThunk(
    "documentRecord/delete",
    async (id, { rejectWithValue }) => {
        try {
            await api.delete(`${BASE_URL}/${id}`);
            return id;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

// ✅ Get Documents by Proposal ID
export const getDocumentsByProposalId = createAsyncThunk(
    "documentRecord/fetchByProposalId",
    async (proposalId, { rejectWithValue }) => {
        try {
            const res = await api.get(`${BASE_URL}/getDocumentsByProposalId/${proposalId}`);
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

const documentSlice = createSlice({
    name: "documentRecord",
    initialState: {
        records: [],
        record: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Create
            .addCase(createDocumentRecord.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createDocumentRecord.fulfilled, (state, action) => {
                state.loading = false;
                state.records.push(action.payload);
            })
            .addCase(createDocumentRecord.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Get All
            .addCase(getAllDocumentsRecord.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllDocumentsRecord.fulfilled, (state, action) => {
                state.loading = false;
                state.records = action.payload;
            })
            .addCase(getAllDocumentsRecord.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Get by ID
            .addCase(getDocumentByIdRecord.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getDocumentByIdRecord.fulfilled, (state, action) => {
                state.loading = false;
                state.record = action.payload;
            })
            .addCase(getDocumentByIdRecord.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Update
            .addCase(updateDocumentRecord.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateDocumentRecord.fulfilled, (state, action) => {
                state.loading = false;
                const updated = action.payload;
                const index = state.records.findIndex((r) => r.id === updated.id || r._id === updated._id);
                if (index !== -1) {
                    state.records[index] = updated;
                }
            })
            .addCase(updateDocumentRecord.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Delete
            .addCase(deleteDocumentRecord.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteDocumentRecord.fulfilled, (state, action) => {
                state.loading = false;
                state.records = state.records.filter((r) => r._id !== action.payload);
            })
            .addCase(deleteDocumentRecord.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Get by Proposal ID
            .addCase(getDocumentsByProposalId.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getDocumentsByProposalId.fulfilled, (state, action) => {
                state.loading = false;
                state.records = action.payload;
            })
            .addCase(getDocumentsByProposalId.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});


export default documentSlice.reducer;
