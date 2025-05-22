import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: JSON.parse(localStorage.getItem('loggedInUser')) || null,
  isAuthenticated: !!JSON.parse(localStorage.getItem('loggedInUser')),
};

export const userSlice = createSlice({
  name: 'loginSlice',
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem('loggedInUser', JSON.stringify(action.payload));
    },
    logout: (state) => {  
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('loggedInUser');
    },
    updateTokens: (state, action) => {
      if (state.user) {
        state.user.accessToken = action.payload.newAccessToken;
        state.user.refreshToken = action.payload.newRefreshToken;
        localStorage.setItem('loggedInUser', JSON.stringify(state.user));
      }
    }
  },
});

export const { login, logout, updateTokens } = userSlice.actions;
export default userSlice.reducer;