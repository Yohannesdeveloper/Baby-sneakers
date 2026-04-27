import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface User {
  email: string;
}

interface AuthState {
  isAdmin: boolean;
  isAuthenticated: boolean;
  user: User | null;
  error: string;
}

const loadAuthFromStorage = (): AuthState => {
  if (typeof window === "undefined") {
    return { isAdmin: false, isAuthenticated: false, user: null, error: "" };
  }
  try {
    const storedAuth = localStorage.getItem("auth");
    if (storedAuth) {
      const parsed = JSON.parse(storedAuth);
      return {
        isAdmin: parsed.isAdmin || false,
        isAuthenticated: parsed.isAuthenticated || false,
        user: parsed.user || null,
        error: parsed.error || "",
      };
    }
  } catch (e) {
    console.warn("Failed to load auth from localStorage:", e);
  }
  return { isAdmin: false, isAuthenticated: false, user: null, error: "" };
};

const saveAuthToStorage = (state: AuthState) => {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("auth", JSON.stringify(state));
    } catch (e) {
      console.warn("Failed to save auth to localStorage:", e);
    }
  }
};

const initialState: AuthState = loadAuthFromStorage();

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    toggleAdmin: (state) => {
      state.isAdmin = !state.isAdmin;
      saveAuthToStorage(state);
    },
    setAdmin: (state, action: PayloadAction<boolean>) => {
      state.isAdmin = action.payload;
      saveAuthToStorage(state);
    },
    loginAdmin: (state, action: PayloadAction<string>) => {
      if (action.payload === "Pesko123") {
        state.isAdmin = true;
        state.isAuthenticated = true; // Admin should also be authenticated
        state.error = "";
        saveAuthToStorage(state);
      } else {
        state.error = "Incorrect password";
      }
    },
    login: (
      state,
      action: PayloadAction<{ email: string; password: string }>
    ) => {
      // Simple mock validation; in real app, validate against backend
      try {
        if (typeof window === "undefined") {
          state.error = "Authentication not available";
          return;
        }
        const users = JSON.parse(localStorage.getItem("users") || "[]");
        const user = users.find(
          (u: any) =>
            u.email === action.payload.email &&
            u.password === action.payload.password
        );
        if (user) {
          console.log("Login successful for:", user.email);
          state.isAuthenticated = true;
          state.isAdmin = false; // Regular users are not admin
          state.user = { email: user.email };
          state.error = "";
          saveAuthToStorage(state);
        } else {
          console.log("Login failed - user not found or password incorrect");
          state.error = "Invalid email or password";
          saveAuthToStorage(state);
        }
      } catch (e) {
        console.error("Login error:", e);
        state.error = "An error occurred during login";
        saveAuthToStorage(state);
      }
    },
    signup: (
      state,
      action: PayloadAction<{ email: string; password: string }>
    ) => {
      try {
        if (typeof window === "undefined") {
          state.error = "Authentication not available";
          return;
        }
        const users = JSON.parse(localStorage.getItem("users") || "[]");
        const existingUser = users.find(
          (u: any) => u.email === action.payload.email
        );
        if (!existingUser) {
          users.push({
            email: action.payload.email,
            password: action.payload.password,
          });
          localStorage.setItem("users", JSON.stringify(users));
          console.log("Signup successful for:", action.payload.email);
          state.isAuthenticated = true;
          state.isAdmin = false; // Regular users are not admin
          state.user = { email: action.payload.email };
          state.error = "";
          saveAuthToStorage(state);
        } else {
          console.log("Signup failed - user already exists");
          state.error = "User already exists";
          saveAuthToStorage(state);
        }
      } catch (e) {
        console.error("Signup error:", e);
        state.error = "An error occurred during signup";
        saveAuthToStorage(state);
      }
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.isAdmin = false;
      state.user = null;
      state.error = "";
      saveAuthToStorage(state);
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      saveAuthToStorage(state);
    },
    clearError: (state) => {
      state.error = "";
      saveAuthToStorage(state);
    },
  },
});

export const {
  toggleAdmin,
  setAdmin,
  loginAdmin,
  login,
  signup,
  logout,
  setError,
  clearError,
} = authSlice.actions;
export default authSlice.reducer;
