import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "@/api/axiosInstance";

const initialState = {
  isAuthenticated: false,
  isLoading: true,        // auth loading
  isAdmin: false,
  isAdminLoading: true,   // ✅ ADD THIS
  user: null,
};


export const registerUser = createAsyncThunk(
  "auth/register",
  async (formData) => {
    const response = await axiosInstance.post(
      "/api/auth/register",
      formData
    );
    return response.data;
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (formData) => {
    const response = await axiosInstance.post(
      "/api/auth/login",
      formData
    );
    return response.data;
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async () => {
    const response = await axiosInstance.post(
      "/api/auth/logout"
    );
    return response.data;
  }
);

export const checkAuth = createAsyncThunk(
  "auth/checkAuth",
  async () => {
    const response = await axiosInstance.get(
      "/api/auth/check-auth",
      {
        headers: {
          "Cache-Control":
            "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );

    return response.data;
  }
);

export const checkAdminAccess = createAsyncThunk(
  "auth/checkAdminAccess",
  async (_, { rejectWithValue }) => {
    try {
      await axiosInstance.get("/api/admin/access-check");
      return true;
    } catch (err) {
      if (err.response?.status === 403) return false;
      return rejectWithValue(err);
    }
  }
);


const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
     adminAccessSkipped: (state) => {
      state.isAdmin = false;
      state.isAdminLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(registerUser.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;

        if (action.payload.success) {
          // Minimal optimistic state; real source of truth = checkAuth
          state.isAuthenticated = true;
          state.user = {
            email: action.payload.user.email,
            userName: action.payload.user.userName,
          };
        } else {
          state.isAuthenticated = false;
          state.user = null;
        }
      })
      .addCase(loginUser.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.success
          ? action.payload.user
          : null;
        state.isAuthenticated = action.payload.success;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(checkAdminAccess.pending, (state) => {
        state.isAdminLoading = true;
      })
      .addCase(checkAdminAccess.fulfilled, (state, action) => {
        state.isAdmin = action.payload;
        state.isAdminLoading = false;
      })
      .addCase(checkAdminAccess.rejected, (state) => {
        state.isAdmin = false;
        state.isAdminLoading = false;
});

  },
});

export const { setUser,adminAccessSkipped } = authSlice.actions;
export default authSlice.reducer;
