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

export const createProblem = createAsyncThunk("problem/createProblem", async (problemData, { rejectWithValue }) => {
    try {
        await axiosClient.post(`/problems/create`, problemData);
        return null;
    } catch (error) {
        return rejectWithValue({
            message: error.message,
            code: error.code,
            status: error.response?.status,
        });
    }
});

export const deleteProblem = createAsyncThunk("problem/deleteProblem", async (problemId, { rejectWithValue }) => {
    try {
        await axiosClient.delete(`/problems/delete/${problemId}`);
        return problemId;
    } catch (error) {
        return rejectWithValue({
            message: error.message,
            code: error.code,
            status: error.response?.status,
        });
    }
});

export const updateProblem = createAsyncThunk("problem/updateProblem", async ({ id, data }, { rejectWithValue }) => {
    try {
        const response = await axiosClient.put(`/problems/update/${id}`, data);
        return response.data;
    } catch (error) {
        return rejectWithValue({
            message: error.message,
            code: error.code,
            status: error.response?.status,
        });
    }
});

export const getProblemById = createAsyncThunk("problem/getProblemById", async (problemId, { rejectWithValue }) => {
    try {
        const response = await axiosClient.get(`/problems/problemById/${problemId}`);
        return response.data;
    } catch (error) {
        return rejectWithValue({
            message: error.message,
            code: error.code,
            status: error.response?.status,
        });
    }
});

export const getUserProblemById = createAsyncThunk("problem/getUserProblemById", async (problemId, { rejectWithValue }) => {
    try {
        const response = await axiosClient.get(`/problems/problemById/${problemId}`);
        return response.data;
    } catch (error) {
        return rejectWithValue({
            message: error.message,
            code: error.code,
            status: error.response?.status,
        });
    }
});

export const runCode = createAsyncThunk("problem/runCode", async ({ problemId, code, language }, { rejectWithValue }) => {
    try {
        const response = await axiosClient.post(`/submissions/run/${problemId}`, { code, language });
        return response.data;
    } catch (error) {
        return rejectWithValue({
            message: error.message,
            code: error.code,
            status: error.response?.status,
        });
    }
});

export const submitCode = createAsyncThunk("problem/submitCode", async ({ problemId, code, language }, { rejectWithValue }) => {
    try {
        const response = await axiosClient.post(`/submissions/submit/${problemId}`, { code, language });
        return response.data;
    } catch (error) {
        return rejectWithValue({
            message: error.message,
            code: error.code,
            status: error.response?.status,
        });
    }
});

export const allSubmissionOfProblem = createAsyncThunk("problem/allSubmissionOfProblem", async (problemId, { rejectWithValue }) => {
    try {
        const response = await axiosClient.get(`/problems/submittedProblem/${problemId}`);
        return response.data;
    } catch (error) {
        return rejectWithValue({
            message: error.message,
            code: error.code,
            status: error.response?.status,
        });
    }
});

export const getAllProblemSolvedByUser = createAsyncThunk("problem/getAllProblemSolvedByUser", async (userId, { rejectWithValue }) => {
    try {
        const response = await axiosClient.get(`/problems/problemSolvedByUser`);
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
        problemById: null,
        editorCode: null,
        allSubmissions: null,
        problemsSolvedByUser: null,
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
            })

            // create problems
            .addCase(createProblem.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createProblem.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(createProblem.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Something went wrong';
            })

            // delete problem
            .addCase(deleteProblem.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteProblem.fulfilled, (state, action) => {
                state.loading = false;
                state.problems = state.problems.filter(problem => problem.id !== action.payload);
            })
            .addCase(deleteProblem.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Something went wrong';
            })

            // get problem by Id
            .addCase(getProblemById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getProblemById.fulfilled, (state, action) => {
                state.loading = false;
                state.problemById = action.payload;
            })
            .addCase(getProblemById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Something went wrong';
            })

            // update problem by Id
            .addCase(updateProblem.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProblem.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(updateProblem.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Something went wrong';
            })

            // get user problem by Id
            .addCase(getUserProblemById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getUserProblemById.fulfilled, (state, action) => {
                state.loading = false;
                state.problemById = action.payload;
            })
            .addCase(getUserProblemById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Something went wrong';
            })

            // run code
            .addCase(runCode.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(runCode.fulfilled, (state, action) => {
                state.loading = false;
                state.editorCode = action.payload;
            })
            .addCase(runCode.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Something went wrong';
            })

            // get all submissions of a problem
            .addCase(allSubmissionOfProblem.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(allSubmissionOfProblem.fulfilled, (state, action) => {
                state.loading = false;
                state.allSubmissions = action.payload;
            })
            .addCase(allSubmissionOfProblem.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Something went wrong';
            })

            // get all problems solved by user
            .addCase(getAllProblemSolvedByUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllProblemSolvedByUser.fulfilled, (state, action) => {
                state.loading = false;
                state.problemsSolvedByUser = action.payload;
            })
            .addCase(getAllProblemSolvedByUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Something went wrong';
            });
    }
});

export default problemSlice.reducer;
