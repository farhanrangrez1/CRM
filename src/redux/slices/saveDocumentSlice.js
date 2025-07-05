import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import api from "../utils/api";
import axios from "axios";

const BASE_URL = "https://netaai-crm-backend-production-c306.up.railway.app/api/projects_document";

// ✅ Create Document
export const createDocument = createAsyncThunk(
    "document/create",
    async (documentData, { rejectWithValue }) => {
        try {
            const res = await axios.post(BASE_URL, documentData);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

// ✅ Get All Documents
export const fetchAllDocuments = createAsyncThunk(
    "document/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            const res = await axios.get(BASE_URL);
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

// ✅ Get Document by ID
export const fetchDocumentById = createAsyncThunk(
    "document/fetchById",
    async (id, { rejectWithValue }) => {
        try {
            const res = await axios.get(`${BASE_URL}/getDocumentsByProposalId/${id}`);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

// ✅ Update Document
export const updateDocument = createAsyncThunk(
    "document/update",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const res = await axios.patch(`${BASE_URL}/${id}`, data);
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

// ✅ Delete Document
export const deleteDocument = createAsyncThunk(
    "document/delete",
    async (id, { rejectWithValue }) => {
        try {
            await axios.delete(`${BASE_URL}/${id}`);
            return id;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

// 🔽 Slice Definition
const saveDocumentSlice = createSlice({
    name: "document",
    initialState: {
        documents: [],
        document: null,
        loading: false,
        error: null,
    },

    reducers: {},

    extraReducers: (builder) => {
        builder

            // Create
            .addCase(createDocument.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createDocument.fulfilled, (state, action) => {
                state.loading = false;
                state.documents.push(action.payload);
            })
            .addCase(createDocument.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Get All
            .addCase(fetchAllDocuments.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllDocuments.fulfilled, (state, action) => {
                state.loading = false;
                state.documents = action.payload;
            })
            .addCase(fetchAllDocuments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Get by ID
            .addCase(fetchDocumentById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDocumentById.fulfilled, (state, action) => {
                state.loading = false;
                state.document = action.payload;
            })
            .addCase(fetchDocumentById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Update
            .addCase(updateDocument.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateDocument.fulfilled, (state, action) => {
                state.loading = false;
                const updatedDocument = action.payload;
                const index = state.documents.findIndex(doc => doc._id === updatedDocument._id);
                if (index !== -1) {
                    state.documents[index] = updatedDocument;
                }
            })
            .addCase(updateDocument.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Delete
            .addCase(deleteDocument.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteDocument.fulfilled, (state, action) => {
                state.loading = false;
                state.documents = state.documents.filter((d) => d._id !== action.payload);
            })
            .addCase(deleteDocument.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default saveDocumentSlice.reducer;
