"use client";
import { getIdToken, User, getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { Notification } from "../types";
import DeviceCounts from "./DeviceCounts";
import DeviceTable from "./DeviceTable";
import EditorsPicks from "./EditorsPicks";
import EnvVars from "./EnvVars";
import NotificationForm from "./NotificationForm";
import NotificationTable from "./NotificationTable";
import AuthWrapper from "./AuthWrapper";

const isProduction = process.env.NODE_ENV === "production";

const isAdmin = (user: User) => {
  // More granular role check if applicable, for now using email check
  return isProduction ? user.email === "techadmin@browndailyherald.com" : user.email === "admin@example.com";
};

export default function Home() {
  const [scheduledNotifications, setScheduledNotifications] = useState<Notification[]>([]);
  const [editorsPicks, setEditorsPicks] = useState<any[]>([]); 
  const [deviceCount, setDeviceCount] = useState<number>(0);
  const [counts, setCounts] = useState({
    metroCount: "Loading...",
    breakingCount: "Loading...",
    universityCount: "Loading...",
    sportsCount: "Loading...",
    artsAndCultureCount: "Loading...",
    scienceAndResearchCount: "Loading...",
    opinionsCount: "Loading...",
    ntfEnabled: "Loading..."
  });

  // Fetch notifications and scheduled notifications
  useEffect(() => {

    const fetchNotifications = async () => {
      try {
        const response = await fetch("/api/notifications",);
        const data = await response.json();
        setScheduledNotifications(data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  // Fetch device counts
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

  // Fetch count data for different sections
  useEffect(() => {

    const fetchCounts = async () => {
      const endpoints = [
        { url: "devices/count?search=isPushEnabled", key: "ntfEnabled" },
        { url: "devices/count?search=Metro", key: "metroCount" },
        { url: "devices/count?search=University News", key: "universityCount" },
        { url: "devices/count?search=Breaking News", key: "breakingCount" },
        { url: "devices/count?search=Sports", key: "sportsCount" },
        { url: "devices/count?search=Arts and Culture", key: "artsAndCultureCount" },
        { url: "devices/count?search=Science and Research", key: "scienceAndResearchCount" },
        { url: "devices/count?search=Opinions", key: "opinionsCount" },
      ];

      try {
        const countData = await Promise.all(
          endpoints.map(async ({ url, key }) => {
            const response = await fetch(`/api/${url}`);
            const data = await response.json();
            return { key, value: data.count.toString() };
          })
        );

        const updatedCounts = countData.reduce((acc, { key, value }) => {
          acc[key] = value;
          return acc;
        }, {});

        setCounts((prevState) => ({ ...prevState, ...updatedCounts }));
      } catch (error) {
        console.error("Error fetching counts:", error);
        setCounts((prevState) => ({
          ...prevState,
          ntfEnabled: "Error",
        }));
      }
    };

    fetchCounts();
  }, []);

  // Fetch editor's picks data
  useEffect(() => {

    const fetchEditorsPicks = async () => {
      try {
        const response = await fetch("/api/editors-picks");
        const data = await response.json();
        setEditorsPicks(data);
      } catch (error) {
        console.error("Error fetching editor's picks:", error);
      }
    };

    fetchEditorsPicks();
  }, []);

  return (
    <AuthWrapper>
      {(user) => (
        <>
          <EnvVars isProduction={isProduction} />
          <DeviceCounts
            deviceCount={deviceCount}
            ntfEnabled={counts.ntfEnabled}
            metroCount={counts.metroCount}
            breakingCount={counts.breakingCount}
            universityCount={counts.universityCount}
            sportsCount={counts.sportsCount}
            artsAndCultureCount={counts.artsAndCultureCount}
            scienceAndResearchCount={counts.scienceAndResearchCount}
            opinionsCount={counts.opinionsCount}
          />

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
                  editorsPicks={editorsPicks}
                  setEditorsPicks={setEditorsPicks}
                />
              </>
            )}

            <DeviceTable/>
          </main>
        </>
      )}
    </AuthWrapper>
  );
}