/**
 * Company Slice
 * 
 * Purpose: Manages company data and operations
 * Features:
 * - Company CRUD operations
 * - Communication periodicity management
 * - Contact information management
 */

import { createSlice } from '@reduxjs/toolkit';

const defaultCompanies = [
  {
    id: 'tech-corp',
    name: 'Tech Corp',
    industry: 'Technology',
    contactPerson: 'John Smith',
    email: 'john@techcorp.com',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'global-inc',
    name: 'Global Inc',
    industry: 'Manufacturing',
    contactPerson: 'Sarah Johnson',
    email: 'sarah@globalinc.com',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'startup-ltd',
    name: 'Startup Ltd',
    industry: 'Software',
    contactPerson: 'Mike Wilson',
    email: 'mike@startupltd.com',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'enterprise-co',
    name: 'Enterprise Co',
    industry: 'Consulting',
    contactPerson: 'Lisa Brown',
    email: 'lisa@enterpriseco.com',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'digital-solutions',
    name: 'Digital Solutions',
    industry: 'IT Services',
    contactPerson: 'David Lee',
    email: 'david@digitalsolutions.com',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const initialState = {
  companies: defaultCompanies,
  loading: false,
  error: null,
  selectedCompany: null
};

const companySlice = createSlice({
  name: 'companies',
  initialState,
  reducers: {
    // Initialize companies
    initializeCompanies: (state) => {
      if (!state.companies) {
        state.companies = [];
      }
    },

    // Add a new company
    addCompany: (state, action) => {
      if (!state.companies) {
        state.companies = [];
      }
      state.companies.push({
        id: Date.now().toString(),
        ...action.payload,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    },

    // Update existing company
    updateCompany: (state, action) => {
      if (!state.companies) {
        state.companies = [];
        return;
      }
      const { id, ...updates } = action.payload;
      const companyIndex = state.companies.findIndex(company => company.id === id);
      if (companyIndex !== -1) {
        state.companies[companyIndex] = {
          ...state.companies[companyIndex],
          ...updates,
          updatedAt: new Date().toISOString()
        };
      }
    },

    // Delete company
    deleteCompany: (state, action) => {
      if (!state.companies) {
        state.companies = [];
        return;
      }
      state.companies = state.companies.filter(
        company => company.id !== action.payload
      );
    },

    // Select company for editing
    selectCompany: (state, action) => {
      state.selectedCompany = action.payload;
    },

    // Clear selected company
    clearSelectedCompany: (state) => {
      state.selectedCompany = null;
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
  initializeCompanies,
  addCompany,
  updateCompany,
  deleteCompany,
  selectCompany,
  clearSelectedCompany,
  setLoading,
  setError
} = companySlice.actions;

// Selectors
export const selectCompanies = (state) => {
  // Ensure we have a valid state and companies array
  if (!state?.companies?.companies) {
    return [];
  }
  return state.companies.companies;
};

export const selectSelectedCompany = (state) => state?.companies?.selectedCompany || null;
export const selectLoading = (state) => state?.companies?.loading || false;
export const selectError = (state) => state?.companies?.error || null;

// Export reducer
export default companySlice.reducer;
