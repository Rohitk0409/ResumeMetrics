import { configureStore } from "@reduxjs/toolkit";
import resumeReducer from "../features/resume/resumeSlice";

export const store = configureStore({
  reducer: {
    resume: resumeReducer,
  },
});
