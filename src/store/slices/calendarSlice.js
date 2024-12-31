/**
 * Calendar Slice
 * 
 * Purpose: Manages calendar events and communication schedules
 * Features:
 * - Track communication events
 * - Generate events based on company periodicity
 * - Recurring events with custom patterns
 * - Event reminders and notifications
 * - Event categories and tags
 * - Event priorities
 */

import { createSlice } from '@reduxjs/toolkit';

// Recurrence patterns
export const RECURRENCE_PATTERNS = {
  NONE: 'none',
  DAILY: 'daily',
  WEEKLY: 'weekly',
  BIWEEKLY: 'biweekly',
  MONTHLY: 'monthly',
  YEARLY: 'yearly',
  WEEKDAY: 'weekday',
  WEEKEND: 'weekend',
  CUSTOM: 'custom',
  NTH_DAY_OF_MONTH: 'nthDayOfMonth',
  NTH_DAY_OF_WEEK: 'nthDayOfWeek',
  LAST_DAY_OF_MONTH: 'lastDayOfMonth'
};

// Reminder types
export const REMINDER_TYPES = {
  NONE: 'none',
  EMAIL: 'email',
  NOTIFICATION: 'notification',
  BOTH: 'both'
};

// Priority levels
export const PRIORITY_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent'
};

const initialState = {
  events: [
    {
      id: '1',
      companyId: 'tech-corp',
      methodId: 'email',
      title: 'Quarterly Review',
      date: '2024-12-20T10:00:00.000Z',  // Overdue
      completed: false,
      notes: 'Discuss Q4 performance and future plans',
      priority: 'high',
      createdAt: '2024-12-15T08:00:00.000Z'
    },
    {
      id: '2',
      companyId: 'global-inc',
      methodId: 'phone',
      title: 'Follow-up Call',
      date: '2024-12-22T14:30:00.000Z',  // Overdue
      completed: false,
      notes: 'Review project milestones',
      priority: 'medium',
      createdAt: '2024-12-15T09:00:00.000Z'
    },
    {
      id: '3',
      companyId: 'startup-ltd',
      methodId: 'meeting',
      title: 'Product Demo',
      date: '2024-12-30T11:00:00.000Z',  // Upcoming
      completed: false,
      notes: 'Present new features',
      priority: 'high',
      createdAt: '2024-12-15T10:00:00.000Z'
    },
    {
      id: '4',
      companyId: 'enterprise-co',
      methodId: 'video',
      title: 'Strategy Meeting',
      date: '2024-12-31T15:00:00.000Z',  // Upcoming
      completed: false,
      notes: 'Annual strategy planning',
      priority: 'urgent',
      createdAt: '2024-12-15T11:00:00.000Z'
    },
    {
      id: '5',
      companyId: 'digital-solutions',
      methodId: 'chat',
      title: 'Quick Sync',
      date: '2025-01-02T13:00:00.000Z',  // Upcoming
      completed: false,
      notes: 'Project status update',
      priority: 'low',
      createdAt: '2024-12-15T12:00:00.000Z'
    },
    // Completed communications
    {
      id: '6',
      companyId: 'tech-corp',
      methodId: 'email',
      title: 'Initial Contact',
      date: '2024-12-15T09:00:00.000Z',
      completed: true,
      completedAt: '2024-12-15T09:30:00.000Z',
      notes: 'Introduction and project scope discussion',
      priority: 'medium',
      createdAt: '2024-12-10T08:00:00.000Z'
    },
    {
      id: '7',
      companyId: 'global-inc',
      methodId: 'meeting',
      title: 'Project Kickoff',
      date: '2024-12-18T10:00:00.000Z',
      completed: true,
      completedAt: '2024-12-18T11:00:00.000Z',
      notes: 'Initial project planning and team introduction',
      priority: 'high',
      createdAt: '2024-12-10T09:00:00.000Z'
    },
    {
      id: '8',
      companyId: 'startup-ltd',
      methodId: 'phone',
      title: 'Requirements Discussion',
      date: '2024-12-20T14:00:00.000Z',
      completed: true,
      completedAt: '2024-12-20T14:45:00.000Z',
      notes: 'Detailed requirements gathering',
      priority: 'medium',
      createdAt: '2024-12-10T10:00:00.000Z'
    },
    {
      id: '9',
      companyId: 'enterprise-co',
      methodId: 'video',
      title: 'Technical Review',
      date: '2024-12-22T11:00:00.000Z',
      completed: true,
      completedAt: '2024-12-22T12:00:00.000Z',
      notes: 'Architecture and technology stack discussion',
      priority: 'high',
      createdAt: '2024-12-10T11:00:00.000Z'
    },
    {
      id: '10',
      companyId: 'digital-solutions',
      methodId: 'chat',
      title: 'Quick Question',
      date: '2024-12-24T13:00:00.000Z',
      completed: true,
      completedAt: '2024-12-24T13:15:00.000Z',
      notes: 'Clarification on project timeline',
      priority: 'low',
      createdAt: '2024-12-10T12:00:00.000Z'
    }
  ],
  reminders: [],
  loading: false,
  error: null,
  notification: null,
  filters: {
    company: null,
    method: null,
    startDate: null,
    endDate: null,
    status: null
  },
  upcomingReminders: []
};

const calendarSlice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    // Add new event with recurrence and reminders
    addEvent: (state, action) => {
      const event = {
        id: Date.now().toString(),
        ...action.payload,
        completed: false,
        createdAt: new Date().toISOString()
      };
      
      state.events.push(event);
      
      // Generate recurring events if needed
      if (event.recurrence.pattern !== RECURRENCE_PATTERNS.NONE) {
        // Instead of generating all at once, just create the next occurrence
        const nextEvent = generateNextRecurringEvent(event);
        if (nextEvent) {
          state.events.push(nextEvent);
        }
      }
      
      state.notification = { type: 'success', message: 'Event added successfully' };
    },

    // Update event and its recurrences
    updateEvent: (state, action) => {
      const { id, event: updates, updateRecurrences } = action.payload;
      const eventIndex = state.events.findIndex(event => event.id === id);
      
      if (eventIndex !== -1) {
        // Update the specific event
        state.events[eventIndex] = {
          ...state.events[eventIndex],
          ...updates,
          updatedAt: new Date().toISOString()
        };
        
        // Update all recurring events if requested
        if (updateRecurrences && state.events[eventIndex].recurringGroupId) {
          state.events = state.events.map(event => {
            if (event.recurringGroupId === state.events[eventIndex].recurringGroupId) {
              return {
                ...event,
                ...updates,
                date: event.date, // Keep original dates for recurring events
                updatedAt: new Date().toISOString()
              };
            }
            return event;
          });
        }

        state.notification = { 
          type: 'success', 
          message: updateRecurrences 
            ? 'All recurring events updated successfully' 
            : 'Event updated successfully'
        };
      }
    },

    // Delete event and its recurrences
    deleteEvent: (state, action) => {
      const { id, deleteRecurrences } = action.payload;
      
      if (deleteRecurrences) {
        const event = state.events.find(e => e.id === id);
        if (event?.recurringGroupId) {
          state.events = state.events.filter(
            e => e.recurringGroupId !== event.recurringGroupId
          );
          state.notification = { type: 'success', message: 'All recurring events deleted successfully' };
        }
      } else {
        state.events = state.events.filter(event => event.id !== id);
        state.notification = { type: 'success', message: 'Event deleted successfully' };
      }
    },

    // Mark event as completed
    markEventCompleted: (state, action) => {
      const { id } = action.payload;
      const eventIndex = state.events.findIndex(event => event.id === id);
      if (eventIndex !== -1) {
        state.events[eventIndex].completed = true;
        state.events[eventIndex].completedAt = new Date().toISOString();
      }
    },

    // Add reminder
    addReminder: (state, action) => {
      const { eventId, reminder } = action.payload;
      const event = state.events.find(e => e.id === eventId);
      if (event) {
        if (!event.reminders) {
          event.reminders = [];
        }
        event.reminders.push({
          id: Date.now().toString(),
          ...reminder
        });
        state.notification = { type: 'success', message: 'Reminder added successfully' };
      }
    },

    // Remove reminder
    removeReminder: (state, action) => {
      const { eventId, reminderId } = action.payload;
      const event = state.events.find(e => e.id === eventId);
      if (event && event.reminders) {
        event.reminders = event.reminders.filter(r => r.id !== reminderId);
        state.notification = { type: 'success', message: 'Reminder removed successfully' };
      }
    },

    // Set filters
    setFilters: (state, action) => {
      state.filters = {
        ...state.filters,
        ...action.payload
      };
    },

    // Clear all filters
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },

    // Set notification
    setNotification: (state, action) => {
      state.notification = action.payload;
    },

    // Clear notification
    clearNotification: (state) => {
      state.notification = null;
    },

    // Update upcoming reminders
    updateUpcomingReminders: (state, action) => {
      state.upcomingReminders = action.payload;
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

// Helper function to generate just the next recurring event
const generateNextRecurringEvent = (baseEvent) => {
  const currentDate = new Date(baseEvent.date);
  const pattern = baseEvent.recurrence.pattern;
  const endDate = baseEvent.recurrence.endDate ? new Date(baseEvent.recurrence.endDate) : null;

  let nextDate = new Date(currentDate);

  switch (pattern) {
    case RECURRENCE_PATTERNS.DAILY:
      nextDate.setDate(currentDate.getDate() + 1);
      break;
    case RECURRENCE_PATTERNS.WEEKLY:
      nextDate.setDate(currentDate.getDate() + 7);
      break;
    case RECURRENCE_PATTERNS.MONTHLY:
      nextDate.setMonth(currentDate.getMonth() + 1);
      break;
    case RECURRENCE_PATTERNS.YEARLY:
      nextDate.setFullYear(currentDate.getFullYear() + 1);
      break;
    default:
      return null;
  }

  if (endDate && nextDate > endDate) {
    return null;
  }

  return createRecurringEvent(baseEvent, nextDate, baseEvent.id);
};

// Helper function to create a recurring event instance
const createRecurringEvent = (baseEvent, date, groupId) => ({
  ...baseEvent,
  id: Date.now() + Math.random(),
  date: new Date(date).toISOString(),
  isRecurring: true,
  recurringGroupId: groupId,
  status: 'pending',
  completedAt: null,
  notes: ''
});

// Export actions
export const {
  addEvent,
  updateEvent,
  deleteEvent,
  markEventCompleted,
  addReminder,
  removeReminder,
  setFilters,
  clearFilters,
  setNotification,
  clearNotification,
  updateUpcomingReminders,
  setLoading,
  setError
} = calendarSlice.actions;

// Selectors
export const selectEvents = state => state.calendar.events;
export const selectFilters = state => state.calendar.filters;
export const selectNotification = state => state.calendar.notification;
export const selectUpcomingReminders = state => state.calendar.upcomingReminders;

export const selectFilteredEvents = (state) => {
  return state.calendar.events.filter(event => !event.completed);
};

export const selectCompletedEvents = (state) => {
  return state.calendar.events.filter(event => event.completed);
};

export default calendarSlice.reducer;
