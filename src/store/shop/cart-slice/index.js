//src/store/shop/cart-slice/index.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/api/axiosInstance";

const initialState = {
  cartItems: [],
  isLoading: false,
};

// ✅ Removed userId from parameters - backend gets it from auth token
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ productId, quantity }) => {
    const response = await axiosInstance.post(
      "/api/shop/cart/add",
      {
        productId,
        quantity,
      }
    );

    return response.data;
  }
);

// ✅ No parameters needed - backend gets userId from auth token
export const fetchCartItems = createAsyncThunk(
  "cart/fetchCartItems",
  async () => {
    const response = await axiosInstance.get(
      "/api/shop/cart/get"
    );

    return response.data;
  }
);

// ✅ Only productId needed - backend gets userId from auth token
export const deleteCartItem = createAsyncThunk(
  "cart/deleteCartItem",
  async ({ productId }) => {
    const response = await axiosInstance.delete(
      `/api/shop/cart/${productId}`
    );

    return response.data;
  }
);

// ✅ Removed userId from parameters - backend gets it from auth token
export const updateCartQuantity = createAsyncThunk(
  "cart/updateCartQuantity",
  async ({ productId, quantity }) => {
    const response = await axiosInstance.put(
      "/api/shop/cart/update-cart",
      {
        productId,
        quantity,
      }
    );

    return response.data;
  }
);

const shoppingCartSlice = createSlice({
  name: "shoppingCart",
  initialState,
  reducers: {
    clearCart: (state) => {
      state.cartItems = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data;
      })
      .addCase(addToCart.rejected, (state) => {
        state.isLoading = false;
        state.cartItems = [];
      })
      .addCase(fetchCartItems.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data;
      })
      .addCase(fetchCartItems.rejected, (state) => {
        state.isLoading = false;
        state.cartItems = [];
      })
      .addCase(updateCartQuantity.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data;
      })
      .addCase(updateCartQuantity.rejected, (state) => {
        state.isLoading = false;
        state.cartItems = [];
      })
      .addCase(deleteCartItem.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data;
      })
      .addCase(deleteCartItem.rejected, (state) => {
        state.isLoading = false;
        state.cartItems = [];
      });
  },
});

export const { clearCart } = shoppingCartSlice.actions;
export default shoppingCartSlice.reducer;