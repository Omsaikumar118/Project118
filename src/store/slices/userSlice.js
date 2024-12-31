/**
 * User Slice
 * 
 * Purpose: Manage user-related state including preferences
 * Features:
 * - User preferences management
 * - Notification settings
 * - User profile data
 * 
 * @module userSlice
 * @category Store
 * @requires @reduxjs/toolkit
 */

import { createSlice } from '@reduxjs/toolkit';

const DEFAULT_PREFERENCES = {
  emailNotifications: true,
  upcomingNotifications: true,
  overdueNotifications: true,
  reminderTimes: [15, 60, 1440], // 15 minutes, 1 hour, 1 day
  dailyDigest: true,
  digestTime: '09:00'
};

const initialState = {
  preferences: DEFAULT_PREFERENCES,
  profile: {
    name: '',
    email: '',
    role: '',
  },
  isLoading: false,
  error: null
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUserPreferences: (state, action) => {
      state.preferences = {
        ...state.preferences,
        ...action.payload
      };
    },
    setUserProfile: (state, action) => {
      state.profile = {
        ...state.profile,
        ...action.payload
      };
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    resetError: (state) => {
      state.error = null;
    }
  }
});

export const {
  updateUserPreferences,
  setUserProfile,
  setLoading,
  setError,
  resetError
} = userSlice.actions;

// Selectors
export const selectUserPreferences = (state) => state.user.preferences;
export const selectUserProfile = (state) => state.user.profile;
export const selectIsLoading = (state) => state.user.isLoading;
export const selectError = (state) => state.user.error;

export default userSlice.reducer;
