// src/store/store.js
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { persistReducer, persistStore } from "redux-persist";
import { combineReducers } from "redux";
import storage from "redux-persist/lib/storage";
import userSlice from "./slices/userSlice";
import { authApi } from '../api/authApi';
import { 
  adminDashboardApi,
  teacherDashboardApi,
  studentDashboardApi,
  parentDashboardApi,
  initializeApis 
} from "../api/lazy";

let store;
let persistor;

export async function createReduxStore() {
  await initializeApis();

  const reducers = combineReducers({
    userSlice,
    [authApi.reducerPath]: authApi.reducer,
    [adminDashboardApi.reducerPath]: adminDashboardApi.reducer,
    [teacherDashboardApi.reducerPath]: teacherDashboardApi.reducer,
    [studentDashboardApi.reducerPath]: studentDashboardApi.reducer,
    [parentDashboardApi.reducerPath]: parentDashboardApi.reducer,
  });

  const persistConfig = {
    key: "root",
    storage,
    whitelist: ["userSlice"],
    blacklist: [
      authApi.reducerPath,
      adminDashboardApi.reducerPath,
      teacherDashboardApi.reducerPath,
      studentDashboardApi.reducerPath,
      parentDashboardApi.reducerPath
    ]
  };

  const persistedReducer = persistReducer(persistConfig, reducers);

  store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
        },
      }).concat(
        authApi.middleware,
        adminDashboardApi.middleware,
        teacherDashboardApi.middleware,
        studentDashboardApi.middleware,
        parentDashboardApi.middleware
      ),
  });

  setupListeners(store.dispatch);
  persistor = persistStore(store);

  return { store, persistor };
}

export { store, persistor };