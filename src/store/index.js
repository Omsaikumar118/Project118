/**
 * Redux Store Configuration
 * 
 * Purpose: Configure and combine reducers for global state management
 * Features:
 * - Company management state
 * - Communication methods state
 * - Calendar events state
 * - Redux DevTools integration
 */

import { configureStore } from '@reduxjs/toolkit';
import companyReducer from './slices/companySlice';
import communicationMethodReducer from './slices/communicationMethodSlice';
import calendarReducer from './slices/calendarSlice';
import communicationsReducer from './communicationsSlice';
import { emailNotificationsMiddleware } from '../middlewares/emailNotifications';

export const store = configureStore({
  reducer: {
    companies: companyReducer,
    communicationMethods: communicationMethodReducer,
    calendar: calendarReducer,
    communications: communicationsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(emailNotificationsMiddleware)
});

export default store;
