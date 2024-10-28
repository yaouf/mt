"use client";

import { useEffect, useState } from "react";
import { Notification } from "../types";
import AuthWrapper from "./AuthWrapper";
import EditorsPicks from "./EditorsPicks";
import NotificationForm from "./NotificationForm";
import NotificationTable from "./NotificationTable";

const isProduction = process.env.NODE_ENV === "production";
export default function Home() {
  const [scheduledNotifications, setScheduledNotifications] = useState<
    Notification[]
  >([]);
  const [editorsPicks, setEditorsPicks] = useState([] as any[]); // New state for editor's picks
  const [deviceCount, setDeviceCount] = useState<string>("Loading..."); // New state for device count

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch("/api/notifications");
        const data = await response.json();
        // TODO: add runtime type checking using zod or io-ts
        const notifications = data as Notification[];
        console.log(notifications);
        setScheduledNotifications(notifications);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };
    fetchNotifications();
  }, []);

  useEffect(() => {
    const fetchDeviceCount = async () => {
      try {
        const response = await fetch("/api/devices/count");
        const data = await response.json();
        setDeviceCount(data.count.toString());
      } catch (error) {
        console.error("Error fetching device count:", error);
      }
    };
    fetchDeviceCount();
  }, []);

  useEffect(() => {
    const fetchEditorsPicks = async () => {
      const response = await fetch("/api/editors-picks");
      const data = await response.json();
      setEditorsPicks(data);
    };
    fetchEditorsPicks();
  }, []);

  return (
    <AuthWrapper>
      {(user) => (
        <>
          {/* Display environment variables */}
          <div className="flex justify-center py-3">
            <div className="flex flex-col items-start space-y-2 px-5 md:px-20 py-3 border border-gray-300 rounded-md bg-gray-50">
              <h2 className="text-lg font-semibold text-black mb-2">
                Environment Variables
              </h2>
              <p className="text-gray-700 flex">
                <span className="font-bold mr-2">NODE_ENV</span>
                <span
                  className={`${
                    isProduction ? "text-red-500" : "text-gray-700"
                  }`}
                >
                  {process.env.NODE_ENV}
                </span>
              </p>
              <p className="text-gray-700 flex">
                <span className="font-bold mr-2">NEXT_PUBLIC_ENV</span>
                <span
                  className={`${
                    isProduction ? "text-red-500" : "text-gray-700"
                  }`}
                >
                  {process.env.NEXT_PUBLIC_ENV}
                </span>
              </p>
            </div>
          </div>

          <div className="flex justify-center py-3">
            <div className="flex flex-col items-start space-y-2 px-5 md:px-20 py-3 border border-gray-300 rounded-md bg-gray-50">
              <p className="text-gray-700 flex">
                <span className="font-bold mr-2">Total devices</span>
                <span className="text-gray-700">{deviceCount}</span>
              </p>
            </div>
          </div>

          <main className="flex min-h-screen flex-col items-center justify-between md:px-20 py-3">
            <NotificationTable
              scheduledNotifications={scheduledNotifications}
              setScheduledNotifications={setScheduledNotifications}
            />

            {user.email === "admin@example.com" && (
              <>
                <NotificationForm
                  setScheduledNotifications={setScheduledNotifications}
                />
                <div className="flex justify-center py-10"></div>
                <EditorsPicks
                  editorsPicks={editorsPicks} // Pass the editorsPicks state
                  setEditorsPicks={setEditorsPicks} // Pass the state setter function
                />
              </>
            )}
          </main>
        </>
      )}
    </AuthWrapper>
  );
}
