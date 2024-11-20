"use client";

import { User } from "firebase/auth";
import { useEffect, useState } from "react";
import { Notification } from "../types";
import AuthWrapper from "./AuthWrapper";
import DeviceCounts from "./DeviceCounts";
import DeviceTable from "./DeviceTable";
import EditorsPicks from "./EditorsPicks";
import EnvVars from "./EnvVars";
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
  const [sportsCount, setSportsCount] = useState<string>("Loading...");
  const [artsAndCultureCount, setArtsAndCultureCount] =
    useState<string>("Loading...");
  const [scienceAndResearchCount, setScienceAndResearchCount] =
    useState<string>("Loading...");
  const [opinionsCount, setOpinionsCount] = useState<string>("Loading...");

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

  useEffect(() => {
    const fetchSportsCount = async () => {
      try {
        const response = await fetch("/api/devices/sportsCount");
        const data = await response.json();
        setSportsCount(data.count.toString());
      } catch (error) {
        console.error(
          "Error fetching device count for sports notifications:",
          error
        );
      }
    };
    fetchSportsCount();
  }, []);

  useEffect(() => {
    const fetchArtsAndCultureCount = async () => {
      const response = await fetch("/api/devices/artsAndCultureCount");
      const data = await response.json();
      setArtsAndCultureCount(data.count.toString());
    };
    fetchArtsAndCultureCount();
  }, []);

  useEffect(() => {
    const fetchScienceAndResearchCount = async () => {
      const response = await fetch("/api/devices/scienceAndResearchCount");
      const data = await response.json();
      setScienceAndResearchCount(data.count.toString());
    };
    fetchScienceAndResearchCount();
  }, []);

  useEffect(() => {
    const fetchOpinionsCount = async () => {
      const response = await fetch("/api/devices/opinionsCount");
      const data = await response.json();
      setOpinionsCount(data.count.toString());
    };
    fetchOpinionsCount();
  }, []);

  return (
    <AuthWrapper>
      {(user) => (
        <>
          <EnvVars isProduction={isProduction} />

          <DeviceCounts
            deviceCount={deviceCount}
            ntfEnabled={ntfEnabled}
            metroCount={metroCount}
            breakingCount={breakingCount}
            universityCount={universityCount}
            sportsCount={sportsCount}
            artsAndCultureCount={artsAndCultureCount}
            scienceAndResearchCount={scienceAndResearchCount}
            opinionsCount={opinionsCount}
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
                  editorsPicks={editorsPicks} // Pass the editorsPicks state
                  setEditorsPicks={setEditorsPicks} // Pass the state setter function
                />
              </>
            )}

            <DeviceTable />
          </main>
        </>
      )}
    </AuthWrapper>
  );
}
