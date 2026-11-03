import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AuthUser } from "@/lib/api/auth";

type AuthState = {
  token: string | null;
  user: AuthUser | null;
  hydrated: boolean;
};

const initialState: AuthState = { token: null, user: null, hydrated: false };

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    hydrate(state) {
      try {
        state.token = localStorage.getItem("token");
        const u = localStorage.getItem("user");
        state.user = u ? JSON.parse(u) : null;
      } catch {
        state.token = null;
        state.user = null;
      }
      state.hydrated = true;
    },
    setCredentials(
      state,
      action: PayloadAction<{ token: string; user: AuthUser }>,
    ) {
      state.token = action.payload.token;
      state.user = action.payload.user;
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
    },
    logout(state) {
      state.token = null;
      state.user = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    updateUser(state, action: PayloadAction<Partial<AuthUser>>) {
    if (!state.user) return;
    state.user = { ...state.user, ...action.payload };
    localStorage.setItem("user", JSON.stringify(state.user));
  },
  },
});

export const { hydrate, setCredentials, logout, updateUser } = authSlice.actions;
export default authSlice.reducer;