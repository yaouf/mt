import React from "react";

const NotificationTable = ({
  scheduledNotifications,
  setScheduledNotifications,
}) => {
  /**
   * Deletes a notification by sending a DELETE request to the server.
   *
   * @param {Object} notification - The notification object to be deleted.
   * @param {number|string} notification.id - The unique identifier of the notification.
   */
  const onDeleteNotification = async (notification) => {
    try {
      console.log("Deleting notification:", notification);
      const response = await fetch("/api/notifications/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ jobId: notification.id }),
      });

      if (response.ok) {
        console.log("Notification deleted successfully.");
        const data = (await response.json()) as any[];
        console.log("data", data);
        setScheduledNotifications(data);
      } else {
        console.error("There was an error deleting the notification.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  /**
   * Formats the tags for a notification into a comma-separated string.
   *
   * @param {Object} notification - The notification object containing tag information.
   * @returns {string} A comma-separated string of tags.
   */
  const formatTags = (notification) => {
    const tags: string[] = [];
    if (notification["breakingNews"]) tags.push("Breaking News");
    if (notification["weeklySummary"]) tags.push("Weekly Summary");
    if (notification["dailySummary"]) tags.push("Daily Summary");
    return tags.join(", ");
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
            <th className="py-2 px-4 border-b">Tags</th>
            <th className="py-2 px-4 border-b">Pathname</th>
            <th className="py-2 px-4 border-b">Status</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {scheduledNotifications.map((notification) => (
            <tr key={notification.id}>
              <td className="py-2 px-4 border-b">{notification.time}</td>
              <td className="py-2 px-4 border-b">{notification.title}</td>
              <td className="py-2 px-4 border-b">{notification.body}</td>
              <td className="py-2 px-4 border-b">{formatTags(notification)}</td>
              <td className="py-2 px-4 border-b">{notification.pathname}</td>
              <td className="py-2 px-4 border-b">{notification.status}</td>
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
