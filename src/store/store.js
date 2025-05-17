import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { persistReducer, persistStore } from "redux-persist";
import { combineReducers } from "redux";
import storage from "redux-persist/lib/storage";
import userSlice from "./slices/userSlice";
import { adminDashboardApi } from "./slices/adminDashboardApi";
import { teacherDashboardApi } from "./slices/teacherDashboardApi";
import { studentDashboardApi } from "./slices/studentDashboardApi";
import { parentDashboardApi } from "./slices/parentDashboardApi";

const rootReducer = combineReducers({
  userSlice: userSlice,
  [adminDashboardApi.reducerPath]: adminDashboardApi.reducer,
  [teacherDashboardApi.reducerPath]: teacherDashboardApi.reducer,
  [studentDashboardApi.reducerPath]: studentDashboardApi.reducer,
  [parentDashboardApi.reducerPath]: parentDashboardApi.reducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: [
    adminDashboardApi.reducerPath,
    teacherDashboardApi.reducerPath,
    studentDashboardApi.reducerPath,
    parentDashboardApi.reducerPath
  ],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }).concat(
      adminDashboardApi.middleware,
      teacherDashboardApi.middleware,
      studentDashboardApi.middleware,
      parentDashboardApi.middleware
    ),
});

setupListeners(store.dispatch);

export const persistor = persistStore(store);