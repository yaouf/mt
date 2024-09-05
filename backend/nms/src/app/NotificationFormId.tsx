"use client";

import { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { auth } from "./firebase";


const NotificationFormId = ({ setScheduledNotifications }) => {
  const [newFormData, setNewFormData] = useState({
    time: "",
    title: "",
    body: "",
    tags: [] as string[],
    uid: "",
    domain: "https://www.browndailyherald.com"
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setNewFormData((prevData) => ({
        ...prevData,
        tags: [...prevData.tags, value],
      }));
    } else {
      setNewFormData((prevData) => ({
        ...prevData,
        tags: prevData.tags.filter((tag) => tag !== value),
      }));
    }
  };

  const handleUidChange = (e) => {
    const { value } = e.target;
    setNewFormData((prevData) => ({
      ...prevData,
      uid: value,
    }));
  };


   const handleDomainChange = (e) => {
    const { value } = e.target;

   setNewFormData((prevData) => ({
    ...prevData,
    domain: value
   }));
  };

  const handleScheduleNotification = async () => {
    try {
      console.log("newNotification", newFormData);
      const user = auth.currentUser;
      const token = await user!.getIdToken();
      const response = await fetch("/api/notifications/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newFormData),
      });

      if (response.ok) {
        console.log("Scheduled Notification:", newFormData);
        const data = (await response.json()) as any[];
        setScheduledNotifications(data);

        // Reset the form after scheduling
        setNewFormData({
          time: "",
          title: "",
          body: "",
          tags: [],
          uid: "",
          domain: "https://www.browndailyherald.com"
        });
      } else {
        console.error("Error scheduling notification");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="container mx-auto px-8 py-2">
      <h2 className="text-2xl font-bold mb-4">Create a New Notification by UID</h2>
      <form>
        {/* Input for time */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="time-uid"
          >
            Time
          </label>
          <input
            type="datetime-local"
            id="time-uid"
            name="time"
            value={newFormData.time}
            onChange={handleInputChange}
            className="border rounded-md px-3 py-2 w-full"
          />
        </div>

        {/* Input for title */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="title-uid"
          >
            Title
          </label>
          <input
            type="text"
            id="title-uid"
            name="title"
            value={newFormData.title}
            onChange={handleInputChange}
            className="border rounded-md px-3 py-2 w-full"
            placeholder="Notification title"
          />
        </div>

        {/* Input for body */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="body-uid"
          >
            Body
          </label>
          <textarea
            id="body-uid"
            name="body"
            value={newFormData.body}
            onChange={handleInputChange}
            className="border rounded-md px-3 py-2 w-full"
            placeholder="Notification body"
          />
        </div>

        {/* Checkboxes for tags */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Tags
          </label>
          <div>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="tags"
                value="Breaking News"
                checked={newFormData.tags.includes("Breaking News")}
                onChange={handleCheckboxChange}
                className="form-checkbox"
              />
              <span className="ml-2">Breaking News</span>
            </label>
            <label className="inline-flex items-center ml-4">
              <input
                type="checkbox"
                name="tags"
                value="University News"
                checked={newFormData.tags.includes("University News")}
                onChange={handleCheckboxChange}
                className="form-checkbox"
              />
              <span className="ml-2">University News</span>
            </label>
            <label className="inline-flex items-center ml-4">
              <input
                type="checkbox"
                name="tags"
                value="Metro"
                checked={newFormData.tags.includes("Metro")}
                onChange={handleCheckboxChange}
                className="form-checkbox"
              />
              <span className="ml-2">Metro</span>
            </label>
          </div>
        </div>

        {/* Input for uid */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="uid"
          >
           UID
          </label>
          <input
            type="text"
            id="uid"
            name="uid"
            value={newFormData.uid}
            onChange={handleUidChange}
            className="border rounded-md px-3 py-2 w-full"
            placeholder="uid"
          />
        </div>

        {/* Radio buttons */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Domain
          </label>
          <div>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="options"
                value="https://www.browndailyherald.com"
                checked={newFormData.domain === "https://www.browndailyherald.com"}
                onChange={handleDomainChange}
                className="form-radio text-blue-500 border-gray-300 focus:ring-blue-500"
              />
              <span className="ml-2">Normal</span>
            </label>
            <label className="inline-flex items-center ml-4">
              <input
                type="radio"
                name="options"
                value="https://www.projects.browndailyherald.com"
                checked={newFormData.domain === "https://www.projects.browndailyherald.com"}
                onChange={handleDomainChange}
                className="form-radio text-blue-500 border-gray-300 focus:ring-blue-500"
              />
              <span className="ml-2">Projects</span>
            </label>
          </div>
        </div>

        {/* Button to schedule notification */}
        <button
          type="button"
          onClick={handleScheduleNotification}
          className="bg-blue-500 text-white px-4 py-2 rounded-md transition transform duration-200 hover:bg-blue-600 hover:scale-105"
        >
          Schedule UID Notification
        </button>
      </form>
    </div>
  );
};

export default NotificationFormId;
