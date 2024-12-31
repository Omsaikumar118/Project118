/**
 * Redux Store Configuration
 * 
 * Purpose: Configure and combine all reducers
 * Features:
 * - Combined reducers
 * - Redux middleware
 * - Store configuration
 * 
 * @module store
 * @category Store
 * @requires @reduxjs/toolkit
 */

import { configureStore } from '@reduxjs/toolkit';
import calendarReducer from './slices/calendarSlice';
import companyReducer from './slices/companySlice';
import userReducer from './slices/userSlice';
import authReducer from './slices/authSlice';
import communicationMethodsReducer from './slices/communicationMethodsSlice';

// Create store with combined reducers
const store = configureStore({
  reducer: {
    calendar: calendarReducer,
    companies: companyReducer,
    user: userReducer,
    auth: authReducer,
    communicationMethods: communicationMethodsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['auth/loginSuccess', 'auth/loginFailure'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['payload.user', 'payload.token'],
        // Ignore these paths in the state
        ignoredPaths: ['auth.user', 'auth.token'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
  preloadedState: {
    // Add initial state for companies
    companies: {
      companies: [
        {
          id: '1',
          name: 'Tech Solutions Inc.',
          industry: 'Technology',
          contactPerson: 'John Smith',
          email: 'john@techsolutions.com',
          phone: '+1-555-0123',
          active: true
        },
        {
          id: '2',
          name: 'Global Marketing Group',
          industry: 'Marketing',
          contactPerson: 'Sarah Johnson',
          email: 'sarah@gmg.com',
          phone: '+1-555-0124',
          active: true
        },
        {
          id: '3',
          name: 'Healthcare Plus',
          industry: 'Healthcare',
          contactPerson: 'Michael Brown',
          email: 'michael@healthcareplus.com',
          phone: '+1-555-0125',
          active: true
        }
      ],
      loading: false,
      error: null,
      selectedCompany: null
    },
    // Add initial state for communication methods
    communicationMethods: {
      methods: [
        {
          id: '1',
          name: 'Email',
          icon: 'mail',
          active: true,
          sequence: 1,
          description: 'Professional email communication for formal correspondence',
          lastUsed: '2023-12-28',
          usageCount: 150
        },
        {
          id: '2',
          name: 'Phone Call',
          icon: 'phone',
          active: true,
          sequence: 2,
          description: 'Direct voice communication for immediate response',
          lastUsed: '2023-12-27',
          usageCount: 89
        },
        {
          id: '3',
          name: 'In-Person Meeting',
          icon: 'calendar',
          active: true,
          sequence: 3,
          description: 'Face-to-face meetings for important discussions',
          lastUsed: '2023-12-26',
          usageCount: 45
        },
        {
          id: '4',
          name: 'Video Conference',
          icon: 'video',
          active: true,
          sequence: 4,
          description: 'Virtual face-to-face meetings via video platforms',
          lastUsed: '2023-12-28',
          usageCount: 120
        },
        {
          id: '5',
          name: 'Chat/Instant Message',
          icon: 'message',
          active: true,
          sequence: 5,
          description: 'Quick informal communication for rapid updates',
          lastUsed: '2023-12-28',
          usageCount: 200
        },
        {
          id: '6',
          name: 'Project Management Tool',
          icon: 'project',
          active: true,
          sequence: 6,
          description: 'Task and project-related communications',
          lastUsed: '2023-12-27',
          usageCount: 180
        },
        {
          id: '7',
          name: 'Social Media',
          icon: 'social',
          active: false,
          sequence: 7,
          description: 'Professional social network communications',
          lastUsed: '2023-12-25',
          usageCount: 30
        },
        {
          id: '8',
          name: 'Document Sharing',
          icon: 'document',
          active: true,
          sequence: 8,
          description: 'Sharing and collaborating on documents',
          lastUsed: '2023-12-28',
          usageCount: 95
        }
      ],
      loading: false,
      error: null,
      selectedMethod: null,
      searchTerm: '',
      notification: null,
      editingMethod: null
    },
    // Add initial state for user
    user: {
      currentUser: {
        id: '1',
        name: 'Admin User',
        email: 'admin@example.com',
        role: 'admin',
        preferences: {
          theme: 'light',
          notifications: true
        }
      },
      loading: false,
      error: null
    },
    // Add initial state for auth
    auth: {
      isAuthenticated: true,
      token: null,
      loading: false,
      error: null
    }
  }
});

export default store;
