/**
 * Communication Method Slice
 * 
 * Purpose: Manages the state for communication methods
 * Features:
 * - Add, edit, delete communication methods
 * - Manage method sequence
 * - Track mandatory flags
 * - Handle loading and error states
 */

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  methods: [
    {
      id: 'email',
      name: 'Email',
      icon: 'far fa-envelope',
      color: '#3B82F6'
    },
    {
      id: 'phone',
      name: 'Phone',
      icon: 'fas fa-phone',
      color: '#10B981'
    },
    {
      id: 'meeting',
      name: 'Meeting',
      icon: 'fas fa-users',
      color: '#F59E0B'
    },
    {
      id: 'video',
      name: 'Video Call',
      icon: 'fas fa-video',
      color: '#EF4444'
    },
    {
      id: 'chat',
      name: 'Chat',
      icon: 'far fa-comment-dots',
      color: '#6366F1'
    }
  ],
  loading: false,
  error: null,
  notification: null,
  searchTerm: '',
  editingMethod: null
};

const communicationMethodSlice = createSlice({
  name: 'communicationMethods',
  initialState,
  reducers: {
    // Add new communication method
    addMethod: (state, action) => {
      state.methods.push(action.payload);
      state.notification = { type: 'success', message: 'Method added successfully' };
    },
    
    // Update existing method
    updateMethod: (state, action) => {
      const index = state.methods.findIndex(method => method.id === action.payload.id);
      if (index !== -1) {
        state.methods[index] = action.payload;
        state.notification = { type: 'success', message: 'Method updated successfully' };
      }
    },
    
    // Delete a method
    deleteMethod: (state, action) => {
      state.methods = state.methods.filter(method => method.id !== action.payload);
      state.notification = { type: 'success', message: 'Method deleted successfully' };
    },
    
    // Update method sequence
    updateSequence: (state, action) => {
      const { id, sequence } = action.payload;
      const method = state.methods.find(m => m.id === id);
      if (method) {
        method.sequence = sequence;
      }
    },
    
    // Toggle mandatory flag
    toggleMandatory: (state, action) => {
      const method = state.methods.find(m => m.id === action.payload);
      if (method) {
        method.mandatory = !method.mandatory;
        state.notification = { 
          type: 'success', 
          message: `Method set to ${method.mandatory ? 'mandatory' : 'optional'}`
        };
      }
    },

    // Set method for editing
    setEditingMethod: (state, action) => {
      state.editingMethod = action.payload;
    },

    // Clear editing method
    clearEditingMethod: (state) => {
      state.editingMethod = null;
    },

    // Set search term
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
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
      state.notification = { type: 'error', message: action.payload };
    }
  }
});

// Export actions
export const {
  addMethod,
  updateMethod,
  deleteMethod,
  updateSequence,
  toggleMandatory,
  setEditingMethod,
  clearEditingMethod,
  setSearchTerm,
  clearNotification,
  setLoading,
  setError
} = communicationMethodSlice.actions;

// Export selectors
export const selectMethods = (state) => state.communicationMethods.methods;
export const selectLoading = (state) => state.communicationMethods.loading;
export const selectError = (state) => state.communicationMethods.error;
export const selectNotification = (state) => state.communicationMethods.notification;
export const selectEditingMethod = (state) => state.communicationMethods.editingMethod;
export const selectSearchTerm = (state) => state.communicationMethods.searchTerm;

// Selector for filtered methods
export const selectFilteredMethods = (state) => {
  const searchTerm = state.communicationMethods.searchTerm.toLowerCase();
  return state.communicationMethods.methods.filter(method => 
    method.name.toLowerCase().includes(searchTerm) ||
    method.description.toLowerCase().includes(searchTerm)
  );
};

export default communicationMethodSlice.reducer;
