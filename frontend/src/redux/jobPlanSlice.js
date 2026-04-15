// Import necessary modules and dependencies
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { COMPANY_API_END_POINT } from "@/utils/ApiEndPoint";

// Async thunk to fetch the current plan
export const fetchCurrentPlan = createAsyncThunk(
  "jobPlan/fetchCurrentPlan",
  async (companyId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${COMPANY_API_END_POINT}/current-plan/${companyId}`,
        { withCredentials: true } // Include cookies for authentication
      );

      if (response.data.success) {
        return response.data.plan;
      } else {
        return rejectWithValue(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching current plan:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch current plan"
      );
    }
  }
);

// Slice definition
const jobPlanSlice = createSlice({
  name: "jobPlan",
  initialState: {
    jobPlan: null, // Initial state is null
    loading: false,
    error: null,
  },
  reducers: {
    addJobPlan: (state, action) => {
      state.jobPlan = action.payload;
    },
    removeJobPlan: (state) => {
      state.jobPlan = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentPlan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentPlan.fulfilled, (state, action) => {
        state.loading = false;
        state.jobPlan = action.payload; // Set the fetched plan in the state
      })
      .addCase(fetchCurrentPlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Set the error message
      });
  },
});

export const { addJobPlan, removeJobPlan } = jobPlanSlice.actions;

export default jobPlanSlice.reducer;
