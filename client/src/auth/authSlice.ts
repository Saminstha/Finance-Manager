import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { User } from "@/api/authApi";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
}

const initialAccessToken = localStorage.getItem("accessToken");

const initialRefreshToken = localStorage.getItem("refreshToken");

const initialState: AuthState = {
  user: null,
  accessToken: initialAccessToken,
  refreshToken: initialRefreshToken,
  isAuthenticated: !!initialAccessToken,
  isInitializing: true,
};

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    login: (
      state,
      action: PayloadAction<{
        user: User;
        accessToken: string;
        refreshToken: string;
      }>,
    ) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;

      state.isAuthenticated = true;
      state.isInitializing = false;

      localStorage.setItem("accessToken", action.payload.accessToken);

      localStorage.setItem("refreshToken", action.payload.refreshToken);
    },

    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isInitializing = false;
    },

    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;

      localStorage.setItem("accessToken", action.payload);
    },

    finishInitialization: (state) => {
      state.isInitializing = false;
    },

    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.isInitializing = false;

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    },
  },
});

export const { login, setUser, setAccessToken, finishInitialization, logout } =
  authSlice.actions;

export default authSlice.reducer;
