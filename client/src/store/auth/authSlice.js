import ENDPOINTS from "../../network/endPoints";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import request from "../../network/request";

// Sign Up Thunk
export const signUp = createAsyncThunk(
  "user/signUp",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await request({
        method: "POST",
        url: ENDPOINTS.SIGNUP,
        data: userData,
      });
      if (response.success) {
        return response.data;
      }
      return rejectWithValue(response.data.message);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Login Thunk
export const login = createAsyncThunk(
  "user/login",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await request({
        method: "POST",
        url: ENDPOINTS.SIGNIN,
        data: userData,
      });
      if (response.success) {
        Cookies.set("token", response.data.token); // Set the token in cookies
        return response.data;
      }
      return rejectWithValue(response.data.message);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Get All Employees Thunk
export const getAllEmployees = createAsyncThunk(
  "user/getAllEmployees",
  async (_, { rejectWithValue }) => {
    try {
      const response = await request({
        method: "GET",
        url: ENDPOINTS.GET_ALL_EMPLOYEE,
      });
      if (response.success) {
        return response.data.employees;
      }
      return rejectWithValue(response.data.message);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Initial State
const initialState = {
  user: null,
  employees: [],
  loading: false,
  error: null,
};

// User Slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.error = null;
      Cookies.remove("token");
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle Sign Up
      .addCase(signUp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle Get All Employees
      .addCase(getAllEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = action.payload;
      })
      .addCase(getAllEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export Logout Action
export const { logout } = userSlice.actions;

// Export Reducer
export default userSlice.reducer;
