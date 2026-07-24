import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../hooks/api";

// API Call
export const uploadResume = createAsyncThunk(
  "resume/uploadResume",
  async (formData, thunkAPI) => {
    try {
      const response = await api.post("/v1/resume/ats", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Something went wrong",
      );
    }
  },
);

const resumeSlice = createSlice({
  name: "resume",

  initialState: {
    result: null,
    loading: false,
    error: null,
  },

  reducers: {
    resetResult: (state) => {
      state.result = null;
      state.error = null;
      state.loading = false;
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(uploadResume.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(uploadResume.fulfilled, (state, action) => {
        state.loading = false;
        state.result = action.payload;
      })

      .addCase(uploadResume.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
export const { resetResult } = resumeSlice.actions;

export default resumeSlice.reducer;
