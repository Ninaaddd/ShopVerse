import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "@/api/axiosInstance";

const initialState = {
  isLoading: false,
  featureImageList: [],
};

export const getFeatureImages = createAsyncThunk(
  "common/getFeatureImages",
  async () => {
    const response = await axiosInstance.get(
      "/api/common/feature/get"
    );

    return response.data;
  }
);

export const addFeatureImage = createAsyncThunk(
  "common/addFeatureImage",
  async ({ image, categories, brand }) => {
    const response = await axiosInstance.post(
      "/api/common/feature/add",
      { image, categories, brand }
    );

    return response.data;
  }
);

export const updateFeatureImage = createAsyncThunk(
  "common/updateFeatureImage",
  async ({ id, image, categories, brand }) => {
    const response = await axiosInstance.put(
      `/api/common/feature/update/${id}`,
      { image, categories, brand }
    );

    return response.data;
  }
);

export const deleteFeatureImage = createAsyncThunk(
  "common/deleteFeatureImage",
  async (id) => {
    const response = await axiosInstance.delete(
      `/api/common/feature/delete/${id}`
    );

    return response.data;
  }
);

const commonSlice = createSlice({
  name: "common",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFeatureImages.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getFeatureImages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.featureImageList = action.payload.data;
      })
      .addCase(getFeatureImages.rejected, (state) => {
        state.isLoading = false;
        state.featureImageList = [];
      });
  },
});

export default commonSlice.reducer;