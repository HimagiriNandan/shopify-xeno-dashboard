import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isConnected: false,
  products: [],
  orders: [],
  customers: []
}

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    setData(state, action){
      state.isConnected = true;
      state.products = action.payload.products;
      state.orders = action.payload.orders;
      state.customers = action.payload.customers;
    },
    clearData(state, action) {
      state.products = [];
      state.orders = [];
      state.customers = [];
    }
  }
});

export const { setData, clearData } = dataSlice.actions;
export default dataSlice.reducer;