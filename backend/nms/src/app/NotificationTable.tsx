import moment from 'moment';
import { useState } from 'react';
import { Notification } from '../types';
import ConfirmationModal from './ConfirmationModal';
import SignOutButton from './SignOut';
import ToggleSentVisibleButton from './ToggleSentVisibleButton';
import { auth } from './firebase';

// TODO: factor out this var, since used in multiple places
const isProduction = process.env.NODE_ENV === 'production';
interface NotificationTableProps {
  scheduledNotifications: Notification[];
  setScheduledNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
}
const NotificationTable = ({
  scheduledNotifications,
  setScheduledNotifications,
}: NotificationTableProps) => {
  const [isSentVisible, setIsSentVisible] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [notificationToDelete, setNotificationToDelete] = useState<Notification | null>(null);

  const handleDeleteClick = (notification: Notification) => {
    setNotificationToDelete(notification);
    setIsConfirmationModalOpen(true);
  };

  const onConfirmDelete = async () => {
    if (!notificationToDelete) return;
    try {
      console.log('Deleting notification:', notificationToDelete);

      // Get the current Firebase auth token
      const user = auth.currentUser;
      if (!user) {
        console.error('User not authenticated');
        return;
      }

      const token = await user.getIdToken();

      const response = await fetch('/api/notifications/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ jobId: notificationToDelete.id }),
      });

      if (response.ok) {
        console.log('Notification deleted successfully.');
        const data = (await response.json()) as any[];
        console.log('data', data);
        setScheduledNotifications(data);
      } else {
        console.error('Error deleting notification');
        console.error(response.json);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const formatTags = (notification: Notification) => {
    if (!notification.categories || notification.categories.length === 0) {
      return null;
    }

    // Handle both string and array types for categories
    if (Array.isArray(notification.categories)) {
      return notification.categories.join(', ');
    } else {
      // If it's a string, it might be a comma-separated list already
      return notification.categories;
    }
  };

  const formatTime = (time: string) => {
    return moment(time).tz('America/New_York').format('YYYY-MM-DD hh:mm A z');
  };

  return (
    <div className="container mx-auto p-5 hidden md:block">
      <div className="flex items-center mb-8">
        <h1 className="text-3xl font-bold">Scheduled App Notifications</h1>
        <SignOutButton />
      </div>
      <ToggleSentVisibleButton isSentVisible={isSentVisible} setIsSentVisible={setIsSentVisible} />
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Time</th>
            <th className="py-2 px-4 border-b">Title</th>
            <th className="py-2 px-4 border-b">Body</th>
            <th className="py-2 px-4 border-b">Tags</th>
            <th className="py-2 px-4 border-b">URL</th>
            <th className="py-2 px-4 border-b">Status</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {scheduledNotifications
            .filter((notification) => (isSentVisible ? true : notification.status !== 'sent'))
            .map((notification) => (
              <tr key={notification.id}>
                <td className="py-2 px-4 border-b">{formatTime(notification.time)}</td>
                <td className="py-2 px-4 border-b">{notification.title}</td>
                <td className="py-2 px-4 border-b">{notification.body}</td>
                <td className="py-2 px-4 border-b">{formatTags(notification)}</td>
                <td className="py-2 px-4 border-b">
                  <a
                    href={notification.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-700 underline break-all"
                  >
                    {notification.url}
                  </a>
                </td>
                <td className="py-2 px-4 border-b">{notification.status}</td>
                <td className="py-2 px-4 border-b">
                  {(notification.status !== 'sent' || !isProduction) && (
                    <button
                      onClick={() => handleDeleteClick(notification)}
                      className="bg-red-500 text-white px-4 py-2 rounded-md"
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {/* Modal to confirm deletion */}
      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        onClose={() => setIsConfirmationModalOpen(false)}
        onConfirm={onConfirmDelete}
        message="You are in production. Are you sure you want to delete this notification?"
      />
    </div>
  );
};

export default NotificationTable;
