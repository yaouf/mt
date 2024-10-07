"use client";

import { useEffect, useState } from "react";
import AuthWrapper from "./AuthWrapper";
import NotificationForm from "./NotificationForm";
import NotificationTable from "./NotificationTable";
import EditorsPicks from "./EditorsPicks";

const isProduction = process.env.NODE_ENV === 'production';
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
      {/* Display environment variables */}
      <div className="flex justify-center py-3">
        <div className="flex flex-col items-start space-y-2 px-5 md:px-20 py-3 border border-gray-300 rounded-md bg-gray-50">
          <h2 className="text-lg font-semibold text-black mb-2">Environment Variables</h2>
          <p className="text-gray-700 flex">
            <span className="font-bold mr-2">NODE_ENV</span> 
            <span className={`${isProduction ? 'text-red-500' : 'text-gray-700'}`}>
              {process.env.NODE_ENV}
            </span>
          </p>
          <p className="text-gray-700 flex">
            <span className="font-bold mr-2">NEXT_PUBLIC_ENV</span> 
            <span className={`${isProduction ? 'text-red-500' : 'text-gray-700'}`}>
              {process.env.NEXT_PUBLIC_ENV}
            </span>
          </p>
        </div>
      </div>
      
      <main className="flex min-h-screen flex-col items-center justify-between md:px-20 py-3">
        <NotificationTable
          scheduledNotifications={scheduledNotifications}
          setScheduledNotifications={setScheduledNotifications}
        />
              

        <NotificationForm setScheduledNotifications={setScheduledNotifications} />

          <EditorsPicks
          editorsPicks={editorsPicks} // Pass the editorsPicks state
          setEditorsPicks={setEditorsPicks} // Pass the state setter function
        />
          
      </main>
    </AuthWrapper>
  );
}