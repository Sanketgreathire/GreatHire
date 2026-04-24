import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

import authSlice from "./authSlice";
import companySlice from "./companySlice";
import recruiterSlice from "./recruiterSlice.js";
import jobPlanSlice from "./jobPlanSlice.js";
import statsSlice from "./admin/statsSlice.js";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  // Only persist auth — company/recruiters/jobPlan are re-fetched on dashboard mount
  // Persisting large slices slows down rehydration on every page load
  whitelist: ["auth"],
};

const rootReducer = combineReducers({
  auth: authSlice,
  company: companySlice,
  recruiters: recruiterSlice,
  jobPlan: jobPlanSlice,
  stats: statsSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
export default store;
