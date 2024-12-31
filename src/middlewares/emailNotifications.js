import axios from 'axios';

export const emailNotificationsMiddleware = (store) => (next) => async (action) => {
  const result = next(action);

  if (action.type === 'communications/communicationAdded' || 
      action.type === 'communications/communicationUpdated') {
    const { dueDate, companyName, method } = action.payload;
    const today = new Date();
    const dueDateTime = new Date(dueDate);

    // Send notification for overdue or due today communications
    if (dueDateTime <= today) {
      try {
        await axios.post('/api/notifications/email', {
          companyName,
          method,
          dueDate,
          status: dueDateTime < today ? 'overdue' : 'due-today'
        });
      } catch (error) {
        console.error('Failed to send email notification:', error);
      }
    }
  }

  return result;
};
