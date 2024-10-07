"use client";

import { useEffect, useState } from "react";
import AuthWrapper from "./AuthWrapper";
import NotificationForm from "./NotificationForm";
import NotificationFormUID from "./NotificationFormUID";
import NotificationTable from "./NotificationTable";
import EditorsPicks from "./EditorsPicks";

export default function Home() {
  const [scheduledNotifications, setScheduledNotifications] = useState([] as any[]);
  const [editorsPicks, setEditorsPicks] = useState([] as any[]); // New state for editor's picks
  
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch("/api/notifications");
        const data = await response.json();
        console.log(data);
        setScheduledNotifications(data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };
    fetchNotifications();
  }, []);

  return (
    <AuthWrapper>
      <main className="flex min-h-screen flex-col items-center justify-between px-20 py-3">
        <NotificationTable
          scheduledNotifications={scheduledNotifications}
          setScheduledNotifications={setScheduledNotifications}
        />
              

        <NotificationFormUID setScheduledNotifications={setScheduledNotifications} />
        <NotificationForm setScheduledNotifications={setScheduledNotifications} />

          <EditorsPicks
          editorsPicks={editorsPicks} // Pass the editorsPicks state
          setEditorsPicks={setEditorsPicks} // Pass the state setter function
        />
          

      </main>
    </AuthWrapper>
  );
}