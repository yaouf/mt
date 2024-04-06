'use client'

import React, { useState } from 'react';

const NotificationForm = ({ setScheduledNotifications }) => {
  const [newNotification, setNewNotification] = useState({
    time: '',
    title: '',
    body: '',
    tags: [] as string[],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewNotification((prevNotification) => ({
      ...prevNotification,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setNewNotification((prevNotification) => ({
        ...prevNotification,
        tags: [...prevNotification.tags, value],
      }));
    } else {
      setNewNotification((prevNotification) => ({
        ...prevNotification,
        tags: prevNotification.tags.filter((tag) => tag !== value),
      }));
    }
  };

  const handleScheduleNotification = async () => {
    try {
      const response = await fetch('/api/notifications/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newNotification),
      });

      if (response.ok) {
        console.log('Scheduled Notification:', newNotification);
        const data = await response.json() as any[];
        setScheduledNotifications(data);

        // Reset the form after scheduling
        setNewNotification({
          time: '',
          title: '',
          body: '',
          tags: [],
        });
      } else {
        console.error('Error scheduling notification');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h2 className="text-2xl font-bold mb-4">Schedule a Notification</h2>
      <form>
        {/* Input for time */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="time">
            Time
          </label>
          <input
            type="datetime-local"
            id="time"
            name="time"
            value={newNotification.time}
            onChange={handleInputChange}
            className="border rounded-md px-3 py-2 w-full"
          />
        </div>

        {/* Input for title */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={newNotification.title}
            onChange={handleInputChange}
            className="border rounded-md px-3 py-2 w-full"
            placeholder="Notification title"
          />
        </div>

        {/* Input for body */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="body">
            Body
          </label>
          <textarea
            id="body"
            name="body"
            value={newNotification.body}
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
                checked={newNotification.tags.includes('Breaking News')}
                onChange={handleCheckboxChange}
                className="form-checkbox"
              />
              <span className="ml-2">Breaking News</span>
            </label>
            <label className="inline-flex items-center ml-4">
              <input
                type="checkbox"
                name="tags"
                value="Weekly Summary"
                checked={newNotification.tags.includes('Weekly Summary')}
                onChange={handleCheckboxChange}
                className="form-checkbox"
              />
              <span className="ml-2">Weekly Summary</span>
            </label>
            <label className="inline-flex items-center ml-4">
              <input
                type="checkbox"
                name="tags"
                value="Daily Summary"
                checked={newNotification.tags.includes('Daily Summary')}
                onChange={handleCheckboxChange}
                className="form-checkbox"
              />
              <span className="ml-2">Daily Summary</span>
            </label>
          </div>
        </div>

        {/* Button to schedule notification */}
        <button
          type="button"
          onClick={handleScheduleNotification}
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Schedule Notification
        </button>
      </form>
    </div>
  );
};

export default NotificationForm;
