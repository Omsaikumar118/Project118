import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { isToday, isPast } from 'date-fns';
import axios from 'axios';

// Create async thunk for fetching communications
export const fetchCommunications = createAsyncThunk(
  'communications/fetchCommunications',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/communications');
      return response.data;
    } catch (error) {
      // Check if error response exists
      if (error.response) {
        return rejectWithValue(error.response.data);
      }
      // Network or other errors
      return rejectWithValue('Failed to fetch communications');
    }
  }
);

const communicationsSlice = createSlice({
  name: 'communications',
  initialState: {
    overdueCommunications: [],
    todayCommunications: [],
    allCommunications: [],
    loading: false,
    error: null
  },
  reducers: {
    setCommunications(state, action) {
      state.allCommunications = action.payload;
      state.overdueCommunications = action.payload.filter(
        comm => isPast(new Date(comm.dueDate)) && !isToday(new Date(comm.dueDate))
      );
      state.todayCommunications = action.payload.filter(
        comm => isToday(new Date(comm.dueDate))
      );
    },
    communicationAdded(state, action) {
      state.allCommunications.push(action.payload);
      const comm = action.payload;
      const commDate = new Date(comm.dueDate);
      if (isPast(commDate) && !isToday(commDate)) {
        state.overdueCommunications.push(comm);
      } else if (isToday(commDate)) {
        state.todayCommunications.push(comm);
      }
    },
    communicationUpdated(state, action) {
      const index = state.allCommunications.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.allCommunications[index] = action.payload;
        state.overdueCommunications = state.allCommunications.filter(
          comm => isPast(new Date(comm.dueDate)) && !isToday(new Date(comm.dueDate))
        );
        state.todayCommunications = state.allCommunications.filter(
          comm => isToday(new Date(comm.dueDate))
        );
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCommunications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCommunications.fulfilled, (state, action) => {
        state.loading = false;
        state.allCommunications = action.payload;
        state.overdueCommunications = action.payload.filter(
          comm => isPast(new Date(comm.dueDate)) && !isToday(new Date(comm.dueDate))
        );
        state.todayCommunications = action.payload.filter(
          comm => isToday(new Date(comm.dueDate))
        );
      })
      .addCase(fetchCommunications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch communications';
      });
  }
});

export const { setCommunications, communicationAdded, communicationUpdated } = communicationsSlice.actions;
export default communicationsSlice.reducer; 