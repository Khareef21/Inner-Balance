// Daily Reminder System
class ReminderSystem {
  constructor() {
    this.reminders = this.loadReminders();
    this.notificationPermission = null;
  }

  // Request notification permission
  async requestPermission() {
    if ('Notification' in window) {
      this.notificationPermission = await Notification.requestPermission();
      return this.notificationPermission === 'granted';
    }
    return false;
  }

  // Load reminders from localStorage
  loadReminders() {
    const stored = localStorage.getItem('innerBalance_reminders');
    return stored ? JSON.parse(stored) : {
      moodLogging: { enabled: true, time: '09:00', message: 'Time to log your mood! How are you feeling today?' },
      meditation: { enabled: true, time: '12:00', message: 'Take a 5-minute meditation break. Your mind will thank you!' },
      wellness: { enabled: true, time: '18:00', message: 'End your day with a wellness activity. You deserve it!' },
      gratitude: { enabled: false, time: '20:00', message: 'What are you grateful for today?' },
      custom: [],
    };
  }

  // Save reminders to localStorage
  saveReminders() {
    localStorage.setItem('innerBalance_reminders', JSON.stringify(this.reminders));
  }

  // Update reminder settings
  updateReminder(type, settings) {
    this.reminders[type] = { ...this.reminders[type], ...settings };
    this.saveReminders();
    this.scheduleReminder(type);
  }

  // Schedule a reminder
  scheduleReminder(type) {
    const reminder = this.reminders[type];
    if (!reminder.enabled) return;

    // Clear existing timeout if any
    if (reminder.timeoutId) {
      clearTimeout(reminder.timeoutId);
    }

    const now = new Date();
    const [hours, minutes] = reminder.time.split(':').map(Number);
    const reminderTime = new Date();
    reminderTime.setHours(hours, minutes, 0, 0);

    // If time has passed today, schedule for tomorrow
    if (reminderTime <= now) {
      reminderTime.setDate(reminderTime.getDate() + 1);
    }

    const delay = reminderTime - now;
    reminder.timeoutId = setTimeout(() => {
      this.showNotification(reminder.message, type);
      // Reschedule for next day
      this.scheduleReminder(type);
    }, delay);
  }

  // Show notification
  showNotification(message, type) {
    if (this.notificationPermission !== 'granted') return;

    const notification = new Notification('Inner Balance', {
      body: message,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: `inner-balance-${type}`,
      requireInteraction: false,
      silent: false,
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };

    // Auto-close after 10 seconds
    setTimeout(() => notification.close(), 10000);
  }

  // Initialize all reminders
  initializeReminders() {
    Object.keys(this.reminders).forEach((type) => {
      if (type !== 'custom') {
        this.scheduleReminder(type);
      }
    });

    // Schedule custom reminders
    this.reminders.custom.forEach((reminder, index) => {
      if (reminder.enabled) {
        this.scheduleCustomReminder(reminder, index);
      }
    });
  }

  // Schedule custom reminder
  scheduleCustomReminder(reminder, index) {
    const now = new Date();
    const [hours, minutes] = reminder.time.split(':').map(Number);
    const reminderTime = new Date();
    reminderTime.setHours(hours, minutes, 0, 0);

    if (reminderTime <= now) {
      reminderTime.setDate(reminderTime.getDate() + 1);
    }

    const delay = reminderTime - now;
    reminder.timeoutId = setTimeout(() => {
      this.showNotification(reminder.message, `custom-${index}`);
      this.scheduleCustomReminder(reminder, index);
    }, delay);
  }

  // Add custom reminder
  addCustomReminder(reminder) {
    this.reminders.custom.push({
      ...reminder,
      enabled: true,
      id: Date.now(),
    });
    this.saveReminders();
    const index = this.reminders.custom.length - 1;
    this.scheduleCustomReminder(this.reminders.custom[index], index);
  }

  // Remove custom reminder
  removeCustomReminder(id) {
    const index = this.reminders.custom.findIndex(r => r.id === id);
    if (index > -1) {
      if (this.reminders.custom[index].timeoutId) {
        clearTimeout(this.reminders.custom[index].timeoutId);
      }
      this.reminders.custom.splice(index, 1);
      this.saveReminders();
    }
  }

  // Get all active reminders
  getActiveReminders() {
    const active = [];
    Object.entries(this.reminders).forEach(([type, reminder]) => {
      if (type === 'custom') {
        reminder.forEach(r => {
          if (r.enabled) active.push({ type: 'custom', ...r });
        });
      } else if (reminder.enabled) {
        active.push({ type, ...reminder });
      }
    });
    return active;
  }

  // Test notification (for debugging)
  testNotification() {
    this.showNotification('This is a test notification from Inner Balance!', 'test');
  }

  // Cleanup all timeouts
  cleanup() {
    Object.values(this.reminders).forEach((reminder) => {
      if (typeof reminder === 'object' && reminder.timeoutId) {
        clearTimeout(reminder.timeoutId);
      } else if (Array.isArray(reminder)) {
        reminder.forEach(r => {
          if (r.timeoutId) clearTimeout(r.timeoutId);
        });
      }
    });
  }
}

export default ReminderSystem;