/**
 * Notification Service
 * 
 * Purpose: Handle browser notifications and reminder alerts
 * Features:
 * - Browser notifications
 * - Sound alerts
 * - Notification queue management
 * - Permission handling
 */

class NotificationService {
  constructor() {
    this.hasPermission = false;
    this.notificationQueue = [];
    this.checkPermission();
    this.notificationSound = new Audio('/notification.mp3'); // You'll need to add this audio file
  }

  async checkPermission() {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return;
    }

    if (Notification.permission === 'granted') {
      this.hasPermission = true;
    } else if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      this.hasPermission = permission === 'granted';
    }
  }

  async requestPermission() {
    const permission = await Notification.requestPermission();
    this.hasPermission = permission === 'granted';
    return this.hasPermission;
  }

  scheduleNotification(event, reminder) {
    const eventTime = new Date(event.date).getTime();
    const reminderTime = eventTime - (reminder.minutesBefore * 60000);
    const now = Date.now();

    if (reminderTime > now) {
      const timeout = reminderTime - now;
      setTimeout(() => {
        this.showNotification(event, reminder);
      }, timeout);

      this.notificationQueue.push({
        id: `${event.id}-${reminder.id}`,
        eventId: event.id,
        reminderId: reminder.id,
        scheduledTime: reminderTime
      });
    }
  }

  showNotification(event, reminder) {
    if (!this.hasPermission) {
      console.warn('Notification permission not granted');
      return;
    }

    // Play sound for notification type
    if (reminder.type === 'notification' || reminder.type === 'both') {
      this.notificationSound.play().catch(console.error);
    }

    // Show browser notification
    const notification = new Notification('Communication Event Reminder', {
      body: `${event.companyName} - ${event.methodName}\nIn ${reminder.minutesBefore} minutes`,
      icon: '/favicon.ico', // Add your app icon
      tag: `${event.id}-${reminder.id}`,
      requireInteraction: true
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
      // You can add navigation to the event here
      window.location.href = `/calendar/event/${event.id}`;
    };
  }

  cancelNotification(eventId, reminderId) {
    const queueIndex = this.notificationQueue.findIndex(
      n => n.eventId === eventId && n.reminderId === reminderId
    );

    if (queueIndex !== -1) {
      this.notificationQueue.splice(queueIndex, 1);
    }
  }

  // Schedule all reminders for an event
  scheduleEventReminders(event) {
    if (!event.reminders) return;

    event.reminders.forEach(reminder => {
      this.scheduleNotification(event, reminder);
    });
  }

  // Cancel all reminders for an event
  cancelEventReminders(eventId) {
    this.notificationQueue = this.notificationQueue.filter(
      n => n.eventId !== eventId
    );
  }

  // Reschedule reminders after event update
  rescheduleEventReminders(event) {
    this.cancelEventReminders(event.id);
    this.scheduleEventReminders(event);
  }
}

export default new NotificationService();
