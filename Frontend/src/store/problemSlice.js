import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from "../utils/axiosClient";

export const allProblems = createAsyncThunk("problem/allProblems", async (query = {}, { rejectWithValue }) => {
    try {
        const response = await axiosClient.get(`/problems/getAllProblem`, { params: query });
        return response.data;
    } catch (error) {
        return rejectWithValue({
            message: error.message,
            code: error.code,
            status: error.response?.status,
        });
    }
});



const problemSlice = createSlice({
    name: 'problems',
    initialState: {
        problems: null,
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // all Problems
            .addCase(allProblems.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(allProblems.fulfilled, (state, action) => {
                state.loading = false;
                state.problems = action.payload;
            })
            .addCase(allProblems.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Something went wrong';
            });
    }
});

export default problemSlice.reducer;
