// Import necessary modules and dependencies
import { createSlice } from "@reduxjs/toolkit";

const companySlice = createSlice({
  name: "company",
  initialState: {
    loading: false,
    company: null, // Initial state is null
    searchedQuery: "", // Added searchedQuery field
  },
  reducers: {
    // Existing actions
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    addCompany: (state, action) => {
      state.company = action.payload;
    },
    removeCompany: (state) => {
      state.company = null;
    },
    // Remove user from company by user ID
    removeUserFromCompany: (state, action) => {
      if (state.company) {
        state.company.userId = state.company.userId.filter(
          (user) => user.user.toString() !== action.payload
        );
      }
    },
    // change company admin
    changeAdminUser: (state, action) => {
      state.company.adminEmail = action.payload;
    },

    // reducer function to update maxJobpost data
    updateMaxPostJobs: (state, action) => {
      state.company.maxJobPosts = state.company.maxJobPosts + action.payload;
    },

    // reducer function to update maxJobpost data
    updateCandidateCredits: (state, action) => {
      state.company.creditedForCandidates =
        state.company.creditedForCandidates + action.payload;
    },
    decreaseMaxPostJobs: (state, action) => {
      state.company.maxJobPosts = state.company.maxJobPosts - action.payload;
    },
    decreaseCandidateCredits: (state, action) => {
      state.company.creditedForCandidates =
        state.company.creditedForCandidates - action.payload;
    },
  },
});

export const {
  setLoading,
  addCompany,
  removeCompany,
  removeUserFromCompany,
  changeAdminUser,
  updateMaxPostJobs,
  decreaseMaxPostJobs,
  updateCandidateCredits,
  decreaseCandidateCredits,
} = companySlice.actions;

export default companySlice.reducer;
