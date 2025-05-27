import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: JSON.parse(localStorage.getItem('loggedInUser')) || null,
  tokens: JSON.parse(localStorage.getItem('authTokens')) || null,
  isAuthenticated: !!JSON.parse(localStorage.getItem('loggedInUser')),
  isManualLogout: false,
};

export const userSlice = createSlice({
  name: 'userSlice',
  initialState,
  reducers: {
    login: (state, action) => {
      const { user, tokens } = action.payload;
      state.user = user;
      state.tokens = tokens;
      state.isAuthenticated = true;
      state.isManualLogout = false;
      localStorage.setItem('loggedInUser', JSON.stringify(user));
      localStorage.setItem('authTokens', JSON.stringify(tokens));
    },
    logout: (state, action) => {
      const { manual = false } = action.payload || {};
      state.user = null;
      state.tokens = null;
      state.isAuthenticated = false;
      state.isManualLogout = manual; // This is crucial
      localStorage.removeItem('loggedInUser');
      localStorage.removeItem('authTokens');
    },
    updateTokens: (state, action) => {
      state.tokens = action.payload;
      localStorage.setItem('authTokens', JSON.stringify(action.payload));
    },
    // Add this to handle page refreshes
    initializeAuth: (state) => {
      const user = JSON.parse(localStorage.getItem('loggedInUser'));
      const tokens = JSON.parse(localStorage.getItem('authTokens'));
      if (user && tokens) {
        state.user = user;
        state.tokens = tokens;
        state.isAuthenticated = true;
        state.isManualLogout = false;
      }
    }
  },
});
export const { login, logout, updateTokens, initializeAuth } = userSlice.actions;
export default userSlice.reducer;