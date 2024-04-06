'use client'

import React, { useState, useEffect } from 'react';
import NotificationForm from './NotificationForm';
import NotificationTable from './NotificationTable';

export default function Home() {
  const [scheduledNotifications, setScheduledNotifications] = useState([] as any[]);

  useEffect(() => {
    // Fetch notifications from the API
    const fetchNotifications = async () => {
      try {
        const response = await fetch('/api/notifications/');
        const data = await response.json();
        setScheduledNotifications(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <NotificationTable 
        scheduledNotifications={scheduledNotifications}
        setScheduledNotifications={setScheduledNotifications}
      />
      <NotificationForm
        setScheduledNotifications={setScheduledNotifications} 
      />
    </main>
  );
}
