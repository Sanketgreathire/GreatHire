import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {
  ADMIN_COMPANY_DATA_API_END_POINT,
  ADMIN_RECRUITER_DATA_API_END_POINT,
  ADMIN_JOB_DATA_API_END_POINT,
  ADMIN_APPLICATION_DATA_API_END_POINT,
  ADMIN_USER_DATA_API_END_POINT,
} from "@/utils/ApiEndPoint";

// 🟢 Async thunk for fetching company stats
export const fetchCompanyStats = createAsyncThunk(
  "stats/fetchCompanyStats",
  async () => {
    const response = await axios.get(
      `${ADMIN_COMPANY_DATA_API_END_POINT}/get-stats`,
      { withCredentials: true }
    );
    return response.data.stats; // Return only relevant data
  }
);

// 🟢 Async thunk for fetching recruiter stats
export const fetchRecruiterStats = createAsyncThunk(
  "stats/fetchRecruiterStats",
  async () => {
    const response = await axios.get(
      `${ADMIN_RECRUITER_DATA_API_END_POINT}/get-stats`,
      {
        withCredentials: true,
      }
    );
    return response.data.stats;
  }
);

// 🟢 Async thunk for fetching job stats
export const fetchJobStats = createAsyncThunk(
  "stats/fetchJobStats",
  async () => {
    const response = await axios.get(
      `${ADMIN_JOB_DATA_API_END_POINT}/get-stats`,
      { withCredentials: true }
    );
    return response.data.stats;
  }
);

// 🟢 Async thunk for fetching job stats
export const fetchApplicationStats = createAsyncThunk(
  "stats/fetchApplicationStats",
  async () => {
    const response = await axios.get(
      `${ADMIN_APPLICATION_DATA_API_END_POINT}/get-stats`,
      { withCredentials: true }
    );
    return response.data.stats;
  }
);

// 🟢 Async thunk for fetching user stats
export const fetchUserStats = createAsyncThunk(
  "stats/fetchUserStats",
  async () => {
    const response = await axios.get(
      `${ADMIN_USER_DATA_API_END_POINT}/get-stats`,
      { withCredentials: true }
    );
    return response.data.stats;
  }
);

const statsSlice = createSlice({
  name: "stats",
  initialState: {
    companyStatsData: {},
    recruiterStatsData: {},
    jobStatsData: {},
    applicationStatsData: {},
    userStatsData: {},
    loading: false,
    error: null,
  },
  reducers: {}, // No synchronous reducers needed here

  extraReducers: (builder) => {
    builder
      // 🔵 Handling Company Stats
      .addCase(fetchCompanyStats.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCompanyStats.fulfilled, (state, action) => {
        state.companyStatsData = action.payload;
        state.loading = false;
      })
      .addCase(fetchCompanyStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // 🔵 Handling Recruiter Stats
      .addCase(fetchRecruiterStats.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRecruiterStats.fulfilled, (state, action) => {
        state.recruiterStatsData = action.payload;
        state.loading = false;
      })
      .addCase(fetchRecruiterStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // 🔵 Handling Job Stats
      .addCase(fetchJobStats.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchJobStats.fulfilled, (state, action) => {
        state.jobStatsData = action.payload;
        state.loading = false;
      })
      .addCase(fetchJobStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // 🔵 Handling Application Stats
      .addCase(fetchApplicationStats.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchApplicationStats.fulfilled, (state, action) => {
        state.applicationStatsData = action.payload;
        state.loading = false;
      })
      .addCase(fetchApplicationStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // 🔵 Handling User Stats
      .addCase(fetchUserStats.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserStats.fulfilled, (state, action) => {
        state.userStatsData = action.payload;
        state.loading = false;
      })
      .addCase(fetchUserStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default statsSlice.reducer;
