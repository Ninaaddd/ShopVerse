import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  approvalURL: null,
  isLoading: false,
  orderId: null,
  orderList: [],
  orderDetails: null,
};

export const createNewOrder = createAsyncThunk(
  "/order/createNewOrder",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "https://shopverse-server.onrender.com/api/shop/order/create",
        {}, // no need to send userId/orderData; server will use Cart + JWT user
        {
          withCredentials: true,
        }
      );

      return response.data; // { success, approvalURL, orderId }
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Order creation failed" });
    }
  }
);

export const capturePayment = createAsyncThunk(
  "/order/capturePayment",
  async ({ paymentId, payerId, orderId },{rejectWithValue}) => {
    try{

    
    const response = await axios.post(
      "https://shopverse-server.onrender.com/api/shop/order/capture",
      {
        paymentId,
        payerId,
        orderId,
      },
      {
        withCredentials: true,
      },
    );

    return response.data;
  }catch(err){
    return rejectWithValue(err.response?.data || {message: "Payment Capture Failed"});
  }
  }
);

export const getAllOrdersByUserId = createAsyncThunk(
  "/order/getAllOrdersByUserId",
  async (_,{rejectWithValue}) => {
    try{
    const response = await axios.get(
      `https://shopverse-server.onrender.com/api/shop/order/list`
    );

    return response.data;
  }catch(err){
    return rejectWithValue(err.response?.data || {message: "Failed to Fetch orders"});
  }
  }

);

export const getOrderDetails = createAsyncThunk(
  "/order/getOrderDetails",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `https://shopverse-server.onrender.com/api/shop/order/details/${id}`,
        { withCredentials: true }
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Failed to fetch order details" });
    }
  }
);

const shoppingOrderSlice = createSlice({
  name: "shoppingOrderSlice",
  initialState,
  reducers: {
    resetOrderDetails: (state) => {
      state.orderDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createNewOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createNewOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.approvalURL = action.payload.approvalURL;
        state.orderId = action.payload.orderId;
        sessionStorage.setItem(
          "currentOrderId",
          JSON.stringify(action.payload.orderId)
        );
      })
      .addCase(createNewOrder.rejected, (state) => {
        state.isLoading = false;
        state.approvalURL = null;
        state.orderId = null;
      })
      .addCase(getAllOrdersByUserId.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllOrdersByUserId.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderList = action.payload.data;
      })
      .addCase(getAllOrdersByUserId.rejected, (state) => {
        state.isLoading = false;
        state.orderList = [];
      })
      .addCase(getOrderDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrderDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderDetails = action.payload.data;
      })
      .addCase(getOrderDetails.rejected, (state) => {
        state.isLoading = false;
        state.orderDetails = null;
      });
  },
});

export const { resetOrderDetails } = shoppingOrderSlice.actions;

export default shoppingOrderSlice.reducer;
