"use client";

import { useEffect, useState } from "react";
import AuthWrapper from "./AuthWrapper";
import NotificationForm from "./NotificationForm";
import NotificationFormId from "./NotificationFormId";
import NotificationTable from "./NotificationTable";
import { auth } from "./firebase";

export default function Home() {
  const [scheduledNotifications, setScheduledNotifications] = useState([] as any[]);    
    useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const user = auth.currentUser;
        const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
        wait(1000);
        console.log("user", auth, auth.currentUser);
        const token = await user!.getIdToken();
        const response = await fetch("/api/notifications", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        console.log(data);
        setScheduledNotifications(data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };
    fetchNotifications();
    }, [])
  return (
    <AuthWrapper>
    <main className="flex min-h-screen flex-col items-center justify-between px-20 py-3">
      <NotificationTable
        scheduledNotifications={scheduledNotifications}
        setScheduledNotifications={setScheduledNotifications}
      />
      <NotificationFormId setScheduledNotifications={setScheduledNotifications} />
      <NotificationForm setScheduledNotifications={setScheduledNotifications} />
    </main>
    </AuthWrapper>
  );
}
