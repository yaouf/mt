"use client";

import { User } from "firebase/auth";
import { useEffect, useState } from "react";
import { Notification } from "../types";
import AuthWrapper from "./AuthWrapper";
import DeviceTable from "./DeviceTable";
import EditorsPicks from "./EditorsPicks";
import NotificationForm from "./NotificationForm";
import NotificationTable from "./NotificationTable";

const isProduction = process.env.NODE_ENV === "production";
const isAdmin = (user: User) => {
  if (isProduction) {
    return user.email === "techadmin@browndailyherald.com";
  }
  return user.email === "admin@example.com";
};

export default function Home() {
  const [scheduledNotifications, setScheduledNotifications] = useState<
    Notification[]
  >([]);
  const [editorsPicks, setEditorsPicks] = useState([] as any[]); // New state for editor's picks
  const [deviceCount, setDeviceCount] = useState<number>(0); // New state for device count
  const [metroCount, setMetroCount] = useState<string>("Loading...");
  const [breakingCount, setBreakingCount] = useState<string>("Loading...");
  const [universityCount, setUniversityCount] = useState<string>("Loading...");
  const [ntfEnabled, setNtfEnabled] = useState<string>("Loading...");

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
        setDeviceCount(data.count);
      } catch (error) {
        console.error("Error fetching device count:", error);
      }
    };
    fetchDeviceCount();
  }, []);

  useEffect(() => {
    const fetchNotfEnabled = async () => {
      try {
        const response = await fetch("/api/devices/notificationEnabledCount");
        const data = await response.json();
        setNtfEnabled(data.count.toString());
      } catch (error) {
        console.error(
          "Error fetching device count for notifications enabled:",
          error
        );
      }
    };
    fetchNotfEnabled();
  }, []);

  useEffect(() => {
    const fetchMetroDevices = async () => {
      try {
        const response = await fetch("/api/devices/metroCount");
        const data = await response.json();
        setMetroCount(data.count.toString());
      } catch (error) {
        console.error(
          "Error fetching device count for notifications metro:",
          error
        );
      }
    };
    fetchMetroDevices();
  }, []);

  useEffect(() => {
    const fetchUniCount = async () => {
      try {
        const response = await fetch("/api/devices/universityNewsCount");
        const data = await response.json();
        setUniversityCount(data.count.toString());
      } catch (error) {
        console.error(
          "Error fetching device count for university news:",
          error
        );
      }
    };
    fetchUniCount();
  }, []);

  useEffect(() => {
    const fetchEditorsPicks = async () => {
      const response = await fetch("/api/editors-picks");
      const data = await response.json();
      setEditorsPicks(data);
    };
    fetchEditorsPicks();
  }, []);

  useEffect(() => {
    const fetchBreakingCount = async () => {
      try {
        const response = await fetch("/api/devices/breakingNewsCount");
        const data = await response.json();
        setBreakingCount(data.count.toString());
      } catch (error) {
        console.error(
          "Error fetching device count for breaking notifications:",
          error
        );
      }
    };
    fetchBreakingCount();
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

          {/* <div className="flex justify-center py-3">
            <div className="flex flex-col items-start space-y-2 px-5 md:px-20 py-3 border border-gray-300 rounded-md bg-gray-50">
              <p className="text-gray-700 flex">
                <span className="font-bold mr-2">Total devices</span>
                <span className="text-gray-700">{deviceCount}</span>
              </p>
            </div>
          </div> */}

          <div className="flex justify-center py-3">
            <div className="w-full max-w-3xl p-6 bg-white border border-gray-300 rounded-lg shadow-sm">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">
                Notifications by Type
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-6 py-3 text-left text-md font-semibold text-gray-700">
                        Type
                      </th>
                      <th className="px-6 py-3 text-right text-md font-semibold text-gray-700">
                        Count
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-md font-medium text-gray-800">
                        Total Devices
                      </td>
                      <td className="px-6 py-4 text-md text-gray-700 text-right">
                        {deviceCount}
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-md font-medium text-gray-800">
                        Notifications Enabled
                      </td>
                      <td className="px-6 py-4 text-md text-gray-700 text-right">
                        {ntfEnabled}
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-md font-medium text-gray-800">
                        Metro
                      </td>
                      <td className="px-6 py-4 text-md text-gray-700 text-right">
                        {metroCount}
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-md font-medium text-gray-800">
                        Breaking News
                      </td>
                      <td className="px-6 py-4 text-md text-gray-700 text-right">
                        {breakingCount}
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-md font-medium text-gray-800">
                        University News
                      </td>
                      <td className="px-6 py-4 text-md text-gray-700 text-right">
                        {universityCount}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <main className="flex min-h-screen flex-col items-center justify-between md:px-20 py-3">
            <NotificationTable
              scheduledNotifications={scheduledNotifications}
              setScheduledNotifications={setScheduledNotifications}
            />

            {isAdmin(user) && (
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
            {/* <div className="flex justify-center py-10"></div>
            <EditorsPicks
              editorsPicks={editorsPicks} // Pass the editorsPicks state
              setEditorsPicks={setEditorsPicks} // Pass the state setter function
            /> */}

            <DeviceTable deviceCount={deviceCount} />
          </main>
        </>
      )}
    </AuthWrapper>
  );
}
