import { createSlice } from "@reduxjs/toolkit";

const tokensSlice = createSlice({
  name: "tokens",
  initialState: {
    tokens: [],
    loading: false,
    error: "",
    page: 0,
    rowCount: 0,
    fetchCounter : 0,
    sortingModel: [{ field: "total", sort: "desc" }],
    tokenInfo : null
  },
  reducers: {
    updateTokens: (state, action) => {
      state.tokens = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setRowCount: (state, action) => {
      state.rowCount = action.payload;
    },
    setSortingModel: (state, action) => {
      state.sortingModel = action.payload;
    },
    setFetchCounter : (state, action) =>{
      state.fetchCounter = action.payload;
    },
    setTokenInfo : (state,action) => {
      state.tokenInfo = action.payload;
    }
  },
});

export const tokensActions = tokensSlice.actions;

export default tokensSlice.reducer;
