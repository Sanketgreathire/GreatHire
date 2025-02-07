// src/store/statsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { ADMIN_STAT_API_END_POINT } from "@/utils/ApiEndPoint";

// Async thunk to fetch stats
export const fetchStats = createAsyncThunk("stats/fetchStats", async () => {
  const response = await axios.get(`${ADMIN_STAT_API_END_POINT}/get-stats`);
  // Assuming your API returns an object with a success property and a stats property:
  if (response.data.success) {
    return response.data.stats;
  } else {
    throw new Error("Failed to fetch stats");
  }
});

const statsSlice = createSlice({
  name: "stats",
  initialState: {
    statsData: {},
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStats.fulfilled, (state, action) => {
        state.statsData = action.payload;
        state.loading = false;
      })
      .addCase(fetchStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default statsSlice.reducer;
