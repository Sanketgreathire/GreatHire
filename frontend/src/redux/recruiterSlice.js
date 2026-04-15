// Import necessary modules and dependencies
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RECRUITER_API_END_POINT } from "@/utils/ApiEndPoint";

// Async thunk to fetch recruiters
export const fetchRecruiters = createAsyncThunk(
  "recruiters/fetchRecruiters",
  async (companyId, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${RECRUITER_API_END_POINT}/recruiters`,
        { companyId },
        { withCredentials: true }
      );
      if (response.data.success) {
        return response.data.recruiters;
      }
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const recruiterSlice = createSlice({
  name: "recruiters",
  initialState: {
    recruiters: [],
    status: "idle", // idle | loading | succeeded | failed
    error: null,
  },
  reducers: {
    addRecruiter: (state, action) => {
      state.recruiters.push(action.payload);
    },
    getRecruiterDetailsById:(action, state) => {
      // complete this
    },
    toggleActiveStatus: (state, action) => {
      const { recruiterId, isActive } = action.payload;
      const recruiter = state.recruiters.find((r) => r._id === recruiterId);
      if (recruiter) {
        recruiter.isActive = isActive;
      }
    },
    //remove recruiter by recruiter id
    removeRecruiter: (state, action) => {
      state.recruiters = state.recruiters.filter(
        (recruiter) => recruiter._id !== action.payload
      );
    },
    cleanRecruiterRedux: (state, action) => {
      state.recruiters = [];
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchRecruiters.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchRecruiters.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.recruiters = action.payload;
      })
      .addCase(fetchRecruiters.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const {
  addRecruiter,
  toggleActiveStatus,
  removeRecruiter,
  cleanRecruiterRedux,
} = recruiterSlice.actions;

export default recruiterSlice.reducer;
