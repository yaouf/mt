"use client";

import { useEffect, useState } from "react";
import { Notification } from "../types";
import AuthWrapper from "./AuthWrapper";
import EditorsPicks from "./EditorsPicks";
import NotificationForm from "./NotificationForm";
import NotificationTable from "./NotificationTable";

const isProduction = process.env.NODE_ENV === 'production';
export default function Home() {
  const [scheduledNotifications, setScheduledNotifications] = useState<Notification[]>([]);    
  const [editorsPicks, setEditorsPicks] = useState([] as any[]); // New state for editor's picks
  const [deviceCount, setDeviceCount] = useState<string>("Loading..."); // New state for device count
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
      try{
        const response = await fetch("/api/devices/count");        
        const data = await response.json();
        setDeviceCount(data.count.toString());
      }
      catch(error){
        console.error("Error fetching device count:", error);
      }
    };
    fetchDeviceCount();
  },[]);

  useEffect(() => {
    const fetchNotfEnabled = async () => {
      try{
        const response = await fetch("/api/devices/notificationEnabled");        
        const data = await response.json();
        setNtfEnabled(data.count.toString());
      }
      catch(error){
        console.error("Error fetching device count for notifications enabled:", error);
      }
    };
    fetchNotfEnabled();
  },[]);

  useEffect(() => {
    const fetchMetroDevices = async () => {
      try{
        const response = await fetch("/api/devices/metroNotifications");        
        const data = await response.json();
        setMetroCount(data.count.toString());
      }
      catch(error){
        console.error("Error fetching device count for notifications metro:", error);
      }
    };
    fetchMetroDevices();
  },[]);

  useEffect(() => {
    const fetchUniCount = async () => {
      try{
        const response = await fetch("/api/devices/universityNotifications");        
        const data = await response.json();
        setUniversityCount(data.count.toString());
      }
      catch(error){
        console.error("Error fetching device count for university news:", error);
      }
    };
    fetchUniCount();
  },[]);

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
      try{
        const response = await fetch("/api/devices/breakingNotifications");        
        const data = await response.json();
        setBreakingCount(data.count.toString());
      }
      catch(error){
        console.error("Error fetching device count for breaking notifications:", error);
      }
    };
    fetchBreakingCount();
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
          <div className="flex flex-col items-start space-y-2 px-5 md:px-20 py-3 border border-gray-300 rounded-md bg-gray-50">
            <span className="font-bold mr-2">Total devices</span> 
            <span className="text-gray-700" >
              {deviceCount}
            </span>
            </div>
            <div className="flex flex-col items-start space-y-2 px-5 md:px-20 py-3 border border-gray-300 rounded-md bg-gray-50">
            <span className="font-bold mr-2">Devices notifications</span> 
            <span className="text-gray-700">
              {ntfEnabled}
            </span>
            </div>
            <div className="flex flex-col items-start space-y-2 px-5 md:px-20 py-3 border border-gray-300 rounded-md bg-gray-50">

            <span className="font-bold mr-2">Devices metro</span> 
            <span className="text-gray-700">
              {metroCount}
            </span>
            </div>
            <div className="flex flex-col items-start space-y-2 px-5 md:px-20 py-3 border border-gray-300 rounded-md bg-gray-50">
            <span className="font-bold mr-2">Devices Breaking</span> 
            <span className="text-gray-700">
              {breakingCount}
            </span>
            </div>
            <div className="flex flex-col items-start space-y-2 px-5 md:px-20 py-3 border border-gray-300 rounded-md bg-gray-50">
            <span className="font-bold mr-2">Devices University</span> 
            <span className="text-gray-700">
              {universityCount}
            </span>
          </div>
          </p>
        </div>
      </div>
      
      <main className="flex min-h-screen flex-col items-center justify-between md:px-20 py-3">
        <NotificationTable
          scheduledNotifications={scheduledNotifications}
          setScheduledNotifications={setScheduledNotifications}
        />
              

        <NotificationForm setScheduledNotifications={setScheduledNotifications} />
        <div className="flex justify-center py-10"></div>
          <EditorsPicks
          editorsPicks={editorsPicks} // Pass the editorsPicks state
          setEditorsPicks={setEditorsPicks} // Pass the state setter function
        />
          
      </main>
    </AuthWrapper>
  );
}