import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  username: '',
  email: '',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUserDetails: (state, action) => {
      state.isAuthenticated = true;
      state.username = action.payload.username;
      state.email = action.payload.email;
    },
    clearUserDetails: (state) => {
      state.isAuthenticated = false;
      state.username = '';
      state.email = '';
    }
  }
});

export const { setUserDetails, clearUserDetails } = authSlice.actions;
export default authSlice.reducer;