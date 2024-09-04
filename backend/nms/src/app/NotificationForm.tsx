"use client";

import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const NotificationForm = ({ setScheduledNotifications }) => {
  const [newFormData, setNewFormData] = useState({
    time: "",
    title: "",
    body: "",
    tags: [] as string[],
    slug: "",
    mediaType: "",
    publicationDate: "",
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

  const handleSlugChange = (e) => {
    const { value } = e.target;
    setNewFormData((prevData) => ({
      ...prevData,
      slug: value,
    }));
  };

  const handleMediaTypeChange = (e) => {
    const { value } = e.target;
    setNewFormData((prevData) => ({
      ...prevData,
      mediaType: value,
    }));
  };

  const handlePublicationDateChange = (date) => {
    // Format the date as "YYYY/MM"
    const formattedDate = `${date.getFullYear()}/${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}`;

    setNewFormData((prevData) => ({
      ...prevData,
      publicationDate: formattedDate,
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
      const response = await fetch("/api/notifications/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
          slug: "",
          mediaType: "",
          publicationDate: "",
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
      <h2 className="text-2xl font-bold mb-4">Create a New Notification</h2>
      <form>
        {/* Input for time */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="time"
          >
            Time
          </label>
          <input
            type="datetime-local"
            id="time"
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
            htmlFor="title"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
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
            htmlFor="body"
          >
            Body
          </label>
          <textarea
            id="body"
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

        {/* Input for slug */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="slug"
          >
            URL
          </label>
          <input
            type="text"
            id="slug"
            name="slug"
            value={newFormData.slug}
            onChange={handleSlugChange}
            className="border rounded-md px-3 py-2 w-full"
            placeholder="URL"
          />
        </div>

        {/* Datepicker for article publication date */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="articlePublicationDate"
          >
            Article Publication Date
          </label>
          <DatePicker
            id="articlePublicationDate"
            selected={newFormData.publicationDate}
            onChange={handlePublicationDateChange}
            dateFormat="yyyy/MM"
            className="border rounded-md px-3 py-2 w-full"
          />
        </div>

        {/* Dropdown for media type */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="mediaType"
          >
            Media Type
          </label>
          <select
            id="mediaType"
            name="mediaType"
            value={newFormData.mediaType}
            onChange={handleMediaTypeChange}
            className="border rounded-md px-3 py-2 w-full"
          >
            <option value="">Select Media Type</option>
            <option value="article">Article</option>
            <option value="page">Page</option>
            <option value="gallery">Gallery</option>
            <option value="multimedia">Multimedia</option>
          </select>
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
          Schedule Notification
        </button>
      </form>
    </div>
  );
};

export default NotificationForm;
