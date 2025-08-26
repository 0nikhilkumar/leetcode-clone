import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from "../utils/axiosClient";

export const registerUser = createAsyncThunk("auth/register", async (userData, { rejectWithValue }) => {
    try {
        const response = await axiosClient.post("/users/register", userData);
        return response.data.user;
    } catch (error) {
        return rejectWithValue({
            message: error.message,
            code: error.code,
            status: error.response?.status,
        });
    }
});

export const loginUser = createAsyncThunk("auth/login", async (userData, { rejectWithValue }) => {
    try {
        const response = await axiosClient.post("/users/login", userData);
        return response.data.user;
    } catch (error) {
        return rejectWithValue({
            message: error.message,
            code: error.code,
            status: error.response?.status,
        });
    }
});

export const checkAuth = createAsyncThunk("auth/check", async (_, { rejectWithValue }) => {
    try {
        const response = await axiosClient.get("/users/check-auth");
        return response.data.user;
    } catch (error) {
        return rejectWithValue({
            message: error.message,
            code: error.code,
            status: error.response?.status,
        });
    }
});

export const logout = createAsyncThunk("auth/logout", async (_, { rejectWithValue }) => {
    try {
        await axiosClient.post("/users/logout");
        return null;
    } catch (error) {
        return rejectWithValue({
            message: error.message,
            code: error.code,
            status: error.response?.status,
        });
    }
});

export const userProfile = createAsyncThunk("auth/profile", async (_, { rejectWithValue }) => {
    try {
        const response = await axiosClient.get("/users/profile");
        return response.data.user;
    } catch (error) {
        return rejectWithValue({
            message: error.message,
            code: error.code,
            status: error.response?.status,
        });
    }
});

export const deleteProfile = createAsyncThunk("auth/deleteProfile", async (_, { rejectWithValue }) => {
    try {
        await axiosClient.delete("/users/deleteProfile");
        return null;
    } catch (error) {
        return rejectWithValue({
            message: error.message,
            code: error.code,
            status: error.response?.status,
        });
    }
});

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        profile: null,
        isAuthenticated: false,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // register
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.isAuthenticated = !!action.payload;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Something went wrong';
                state.isAuthenticated = false;
                state.user = null;
            })

            // login
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.isAuthenticated = !!action.payload;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Something went wrong';
                state.isAuthenticated = false;
                state.user = null;
            })

            // check auth
            .addCase(checkAuth.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(checkAuth.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.isAuthenticated = !!action.payload;
            })
            .addCase(checkAuth.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Something went wrong';
                state.isAuthenticated = false;
                state.user = null;
            })

            // logout user
            .addCase(logout.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(logout.fulfilled, (state) => {
                state.loading = false;
                state.user = null;
                state.isAuthenticated = false;
                state.error = null;
            })
            .addCase(logout.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Something went wrong';
                state.isAuthenticated = false;
                state.user = null;
            })

            // profile
            .addCase(userProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(userProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.profile = action.payload;
                state.isAuthenticated = !!action.payload;
            })
            .addCase(userProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Something went wrong';
                state.isAuthenticated = false;
                state.profile = null;
            })

            // delete profile
            .addCase(deleteProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteProfile.fulfilled, (state) => {
                state.loading = false;
                state.user = null;
                state.isAuthenticated = false;
                state.error = null;
            })
            .addCase(deleteProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Something went wrong';
                state.isAuthenticated = false;
                state.user = null;
            })
    }
});

export default authSlice.reducer;
