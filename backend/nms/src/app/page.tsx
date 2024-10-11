"use client";

import { useEffect, useState } from "react";
import AuthWrapper from "./AuthWrapper";
import NotificationForm from "./NotificationForm";
import NotificationTable from "./NotificationTable";
import EditorsPicks from "./editorsPicks";

const isProduction = process.env.NODE_ENV === 'production';
export default function Home() {
  const [scheduledNotifications, setScheduledNotifications] = useState([] as any[]);
  const [editorsPicks, setEditorsPicks] = useState([] as any[]); // New state for editor's picks
  const [deviceCount, setDeviceCount] = useState(0); // New state for device count

// FOR FRIDAY :
// find the count of devices by making a new API call to /api/devices and display it in the UI. Then in the function
 // make a SQL query that counts the number of devices in the database and return it as a JSON response. use smth similar
 //to  const count = await db("devices").select("*").count_all();


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

  useEffect(() => {
    const fetchDeviceCount = async () => {
      try{
        const response = await fetch("/api/device/devices");        
        const data = await response.json();
        setDeviceCount(data.count);
      }
      catch(error){
        console.error("Error fetching device count:", error);
      }
    };
    fetchDeviceCount();
  },[]);

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

      <div className="flex justify-center py-3">
        <div className="flex flex-col items-start space-y-2 px-5 md:px-20 py-3 border border-gray-300 rounded-md bg-gray-50">
          <p className="text-gray-700 flex">
            <span className="font-bold mr-2">Total devices</span> 
            <span className={`${isProduction ? 'text-red-500' : 'text-gray-700'}`}>
              {deviceCount}
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