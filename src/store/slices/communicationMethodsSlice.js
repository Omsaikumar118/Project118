/**
 * Communication Methods Slice
 * 
 * Purpose: Manages communication methods data and operations
 * Features:
 * - Communication methods CRUD operations
 * - Method status management
 * - Method preferences
 */

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  methods: [
    { id: '1', name: 'Email', icon: 'mail', active: true, sequence: 1, description: 'Email communication' },
    { id: '2', name: 'Phone', icon: 'phone', active: true, sequence: 2, description: 'Phone calls' },
    { id: '3', name: 'Meeting', icon: 'calendar', active: true, sequence: 3, description: 'In-person meetings' },
    { id: '4', name: 'Video Call', icon: 'video', active: true, sequence: 4, description: 'Video conferences' },
    { id: '5', name: 'Chat', icon: 'message', active: true, sequence: 5, description: 'Instant messaging' }
  ],
  loading: false,
  error: null,
  selectedMethod: null,
  searchTerm: '',
  notification: null,
  editingMethod: null
};

const communicationMethodsSlice = createSlice({
  name: 'communicationMethods',
  initialState,
  reducers: {
    // Initialize methods
    initializeMethods: (state) => {
      if (!state.methods) {
        state.methods = initialState.methods;
      }
    },

    // Add a new method
    addMethod: (state, action) => {
      if (!state.methods) {
        state.methods = [];
      }
      state.methods.push({
        id: Date.now().toString(),
        ...action.payload,
        active: true,
        sequence: state.methods.length + 1
      });
    },

    // Update existing method
    updateMethod: (state, action) => {
      if (!state.methods) {
        state.methods = [];
        return;
      }
      const { id, ...updates } = action.payload;
      const methodIndex = state.methods.findIndex(method => method.id === id);
      if (methodIndex !== -1) {
        state.methods[methodIndex] = {
          ...state.methods[methodIndex],
          ...updates
        };
      }
    },

    // Delete method
    deleteMethod: (state, action) => {
      if (!state.methods) {
        state.methods = [];
        return;
      }
      state.methods = state.methods.filter(
        method => method.id !== action.payload
      );
      // Update sequences
      state.methods.forEach((method, index) => {
        method.sequence = index + 1;
      });
    },

    // Toggle method active status
    toggleMethodStatus: (state, action) => {
      if (!state.methods) {
        state.methods = [];
        return;
      }
      const methodIndex = state.methods.findIndex(method => method.id === action.payload);
      if (methodIndex !== -1) {
        state.methods[methodIndex].active = !state.methods[methodIndex].active;
      }
    },

    // Update method sequence
    updateSequence: (state, action) => {
      const { id, newSequence } = action.payload;
      if (!state.methods) return;

      const methods = [...state.methods];
      const oldIndex = methods.findIndex(m => m.id === id);
      if (oldIndex === -1) return;

      const method = methods[oldIndex];
      methods.splice(oldIndex, 1);
      methods.splice(newSequence - 1, 0, method);

      // Update all sequences
      methods.forEach((m, index) => {
        m.sequence = index + 1;
      });

      state.methods = methods;
    },

    // Set search term
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload || '';
    },

    // Clear search term
    clearSearchTerm: (state) => {
      state.searchTerm = '';
    },

    // Set editing method
    setEditingMethod: (state, action) => {
      state.editingMethod = action.payload;
    },

    // Clear editing method
    clearEditingMethod: (state) => {
      state.editingMethod = null;
    },

    // Set notification
    setNotification: (state, action) => {
      state.notification = action.payload;
    },

    // Clear notification
    clearNotification: (state) => {
      state.notification = null;
    },

    // Set loading state
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    // Set error state
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    }
  }
});

// Export actions
export const {
  initializeMethods,
  addMethod,
  updateMethod,
  deleteMethod,
  toggleMethodStatus,
  updateSequence,
  setSearchTerm,
  clearSearchTerm,
  setEditingMethod,
  clearEditingMethod,
  setNotification,
  clearNotification,
  setLoading,
  setError
} = communicationMethodsSlice.actions;

// Selectors with null checks
export const selectMethods = (state) => {
  if (!state?.communicationMethods?.methods) {
    return initialState.methods;
  }
  return state.communicationMethods.methods;
};

export const selectActiveMethods = (state) => {
  const methods = selectMethods(state);
  return methods.filter(method => method.active);
};

export const selectSearchTerm = (state) => 
  state?.communicationMethods?.searchTerm || '';

export const selectEditingMethod = (state) => 
  state?.communicationMethods?.editingMethod || null;

export const selectNotification = (state) => 
  state?.communicationMethods?.notification || null;

export const selectFilteredMethods = (state) => {
  const methods = selectMethods(state);
  const searchTerm = selectSearchTerm(state);

  if (!searchTerm) {
    return methods;
  }

  return methods.filter(method => {
    const searchLower = searchTerm.toLowerCase();
    const nameLower = (method.name || '').toLowerCase();
    const descriptionLower = (method.description || '').toLowerCase();

    return nameLower.includes(searchLower) || 
           descriptionLower.includes(searchLower);
  });
};

export const selectLoading = (state) => 
  state?.communicationMethods?.loading || false;

export const selectError = (state) => 
  state?.communicationMethods?.error || null;

// Export reducer
export default communicationMethodsSlice.reducer;
