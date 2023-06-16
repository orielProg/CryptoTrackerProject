import { createSlice } from "@reduxjs/toolkit";

const topCoinsSlice = createSlice({
  name: "topcoins",
  initialState: {
    tokens: [],
    loading: false,
    error: "",
    expirationDate: ''
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setTopCoins: (state, action) => {
      state.tokens = action.payload;
    },
    setExpirationDate: (state, action) => {
      state.expirationDate = action.payload;
    },
  },
});

export const topCoinsActions = topCoinsSlice.actions;

export default topCoinsSlice.reducer;
