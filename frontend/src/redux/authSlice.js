// Import necessary modules and dependencies
import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    loading: false,
    user: null,
    searchedQuery: "", // Added searchedQuery field
  },
  reducers: {
    // Existing actions
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setRecruiterVerification: (state, action) => {
      if (state.user) {
        // Update `isVerify` based on action payload (-1 or 1)
        state.user.isVerify = action.payload;
      }
    },
    setRecruiterIsCompanyCreated: (state, action) => {
      if (state.user) {
        // Update `isVerify` based on action payload (-1 or 1)
        state.user.isCompanyCreated = action.payload;
      }
    },

    updateEmailVerification: (state, action) => {
      state.user.emailId.isVerified = action.payload;
    },
    updateNumberVerification: (state, action) => {
      state.user.phoneNumber.isVerified = action.payload;
    },

    logOut: (state) => {
      state.user = null;
    },
    // New action for searchedQuery
    setSearchedQuery: (state, action) => {
      state.searchedQuery = action.payload;
    },
  },
});

export const {
  setLoading,
  setUser,
  setRecruiterVerification,
  setRecruiterIsCompanyCreated,
  logOut,
  setSearchedQuery,
  updateEmailVerification,
  updateNumberVerification,
} = authSlice.actions;

export default authSlice.reducer;
