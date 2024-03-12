import React from 'react';

const NotificationTable = ({ scheduledNotifications }) => {
  const onDeleteNotification = async (notification) => {
    try {
      // Implement the logic to call the deleteNotification API
      const response = await fetch('/api/notifications//deleteNotification', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notification),
      });

      if (response.ok) {
        console.log('Notification deleted successfully.');
        // Update the UI or refetch the notifications as needed
      } else {
        console.error('Error deleting notification');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Scheduled Notifications</h1>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Time</th>
            <th className="py-2 px-4 border-b">Title</th>
            <th className="py-2 px-4 border-b">Body</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {scheduledNotifications.map((notification) => (
            <tr key={notification.time}>
              <td className="py-2 px-4 border-b">{notification.time}</td>
              <td className="py-2 px-4 border-b">{notification.title}</td>
              <td className="py-2 px-4 border-b">{notification.body}</td>
              <td className="py-2 px-4 border-b">
                <button
                  onClick={() => onDeleteNotification(notification)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default NotificationTable;
