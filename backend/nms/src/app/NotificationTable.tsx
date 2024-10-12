import moment from "moment";
import { useState } from "react";
import { Notification } from "../types";
import ConfirmationModal from "./ConfirmationModal";
import SignOutButton from "./SignOut";
import ToggleSentVisibleButton from "./ToggleSentVisibleButton";

// TODO: factor out this var, since used in multiple places
const isProduction = process.env.NODE_ENV === "production";
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
  const [notificationToDelete, setNotificationToDelete] = useState<Notification | null>(
    null
  );

  const handleDeleteClick = (notification: Notification) => {
    setNotificationToDelete(notification);
    setIsConfirmationModalOpen(true);
  };

  const onConfirmDelete = async () => {
    if (!notificationToDelete) return;
    try {
      console.log("Deleting notification:", notificationToDelete);
      const response = await fetch("/api/notifications/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ jobId: notificationToDelete.id }),
      });

      if (response.ok) {
        console.log("Notification deleted successfully.");
        const data = (await response.json()) as any[];
        console.log("data", data);
        setScheduledNotifications(data);
      } else {
        console.error("Error deleting notification");
        console.error(response.json);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const formatTags = (notification: Notification) => {
    const tags: string[] = [];
    if (notification["Breaking News"]) tags.push("Breaking News");
    if (notification["University News"]) tags.push("University News");
    if (notification["Metro"]) tags.push("Metro");
    return tags.join(", ");
  };

  const formatTime = (time: string) => {
    return moment(time).tz("America/New_York").format("YYYY-MM-DD hh:mm A z");
  };

  return (
    <div className="container mx-auto p-5 hidden md:block">
      <div className="flex items-center mb-8">
        <h1 className="text-3xl font-bold">Scheduled Notifications</h1>
        <SignOutButton />
      </div>
      <ToggleSentVisibleButton
        isSentVisible={isSentVisible}
        setIsSentVisible={setIsSentVisible}
      />
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
            .filter((notification) =>
              isSentVisible ? true : notification.status !== "sent"
            )
            .map((notification) => (
              <tr key={notification.id}>
                <td className="py-2 px-4 border-b">
                  {formatTime(notification.time)}
                </td>
                <td className="py-2 px-4 border-b">{notification.title}</td>
                <td className="py-2 px-4 border-b">{notification.body}</td>
                <td className="py-2 px-4 border-b">
                  {formatTags(notification)}
                </td>
                <td className="py-2 px-4 border-b">
                  <a
                    href={notification.url}
                    className="text-blue-500 hover:text-blue-700 underline break-all"
                  >
                    {notification.url}
                  </a>
                </td>
                <td className="py-2 px-4 border-b">{notification.status}</td>
                <td className="py-2 px-4 border-b">
                  {(notification.status !== "sent" || !isProduction) && (
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
        message="Are you sure you want to delete this notification?"
      />
    </div>
  );
};

export default NotificationTable;
