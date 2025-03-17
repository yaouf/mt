"use client";

import moment from "moment-timezone";
import { useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { validate as isValidUUID } from "uuid";
import ConfirmationModal from "./ConfirmationModal";
import { Author, Notification } from "../types";

interface NotificationFormProps {
  setScheduledNotifications: (notifications: Notification[]) => void;
  token: string;
}

const TITLE_CHAR_LIM = 43; // max notif title length for normal text size (I think).
const BODY_CHAR_LIM = 165; // max notif body length for normal text size.
const BANNER_DURATION = 5000; // how long the dashboard banner stays up after a notification is sent.

const isProduction = process.env.NODE_ENV === "production";

const NotificationForm = ({ setScheduledNotifications, token }: NotificationFormProps) => {
  const [newFormData, setNewFormData] = useState({
    time: "",
    title: "",
    body: "",
    tags: [] as string[],
    url: "",
    authorIds: [] as number[],
  });

  const [authors, setAuthors] = useState<Author[]>([]);
  const [isLoadingAuthors, setIsLoadingAuthors] = useState(false);
  const [authorSearchTerm, setAuthorSearchTerm] = useState("");

  // Fetch authors when component mounts
  useEffect(() => {
    if (!token) return;

    const fetchAuthors = async () => {
      try {
        setIsLoadingAuthors(true);
        const response = await fetch("/api/authors", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setAuthors(data.authors || []);
        } else {
          console.error("Failed to fetch authors");
        }
      } catch (error) {
        console.error("Error fetching authors:", error);
      } finally {
        setIsLoadingAuthors(false);
      }
    };

    fetchAuthors();
  }, [token]);

  // Handle author selection
  const handleAuthorChange = (e) => {
    const { value, checked } = e.target;
    const authorId = parseInt(value, 10);

    if (checked) {
      setNewFormData((prevData) => ({
        ...prevData,
        authorIds: [...prevData.authorIds, authorId],
      }));
    } else {
      setNewFormData((prevData) => ({
        ...prevData,
        authorIds: prevData.authorIds.filter((id) => id !== authorId),
      }));
    }
  };

  const [bannerMessage, setBannerMessage] = useState("");
  const [bannerVisible, setBannerVisible] = useState(false);
  const [bannerTimeout, setBannerTimeout] =
    useState<ReturnType<typeof setTimeout>>();
  const [isFailed, setIsFailed] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleScheduleNotification = () => {
    if (isProduction) {
      setIsConfirmModalOpen(true);
    } else {
      confirmScheduleNotification();
    }
  };

  const confirmScheduleNotification = async () => {
    try {
      const userTimeZone = moment.tz.guess();
      const localTime = newFormData.time;
      const utcTime = moment.tz(localTime, userTimeZone).utc().format();

      const lastSegment = newFormData.url.split("/").pop();
      const isUid = isValidUUID(lastSegment);

      // Update the form data with UTC time before sending it to the server
      const updatedFormData = {
        ...newFormData,
        time: utcTime,
        isUid: isUid,
      };

      console.log("newNotification", updatedFormData);
      const response = await fetch("/api/notifications/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedFormData),
      });

      if (response.ok) {
        const data = (await response.json()) as any[];
        setScheduledNotifications(data);

        // Reset the form after scheduling
        setNewFormData({
          time: "",
          title: "",
          body: "",
          tags: [],
          url: "",
          authorIds: [],
        });

        setIsFailed(false);
        showBanner("Scheduled successfully!");
      } else {
        console.error("Error scheduling notification");
        setIsFailed(true);
        showBanner("Send failed");
      }
    } catch (error) {
      console.error("Error:", error);
      setIsFailed(true);
      showBanner("Send failed");
    }
  };

  const showBanner = (message) => {
    setBannerMessage(message);
    setBannerVisible(true);
    clearTimeout(bannerTimeout);
    document.documentElement.style.setProperty(
      "--banner-duration",
      `${BANNER_DURATION / 1000}s`
    );
    const timeout = setTimeout(() => {
      setBannerVisible(false);
    }, BANNER_DURATION); // Hide banner after X seconds
    setBannerTimeout(timeout);
  };

  return (
    <div className="container mx-auto px-8 py-2">
      {bannerVisible && (
        <div
          className={`fixed top-4 left-1/2 transform -translate-x-1/2 text-center py-2 px-4 rounded-lg shadow-lg ${
            isFailed ? "bg-red-500 text-white" : "bg-blue-500 text-white"
          }`}
        >
          <span className="font-bold">{bannerMessage}</span>
          <div
            className={`h-1 mt-2 rounded-full ${
              isFailed ? "bg-red-700" : "bg-blue-700"
            } animate-progress`}
          ></div>
        </div>
      )}
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
        <div className="mb-4 relative">
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
            className={`border rounded-md px-3 py-2 w-full ${
              newFormData.title.length > TITLE_CHAR_LIM
                ? "border-red-500 focus:outline-red-500"
                : ""
            }`}
            placeholder="Notification title"
          />
          <span
            className={`absolute bottom-1 right-2 text-sm ${
              newFormData.title.length > TITLE_CHAR_LIM
                ? "text-red-500"
                : "text-gray-500"
            }`}
          >
            {newFormData.title.length}/{TITLE_CHAR_LIM}
          </span>
        </div>

        {/* Input for body */}
        <div className="mb-4 relative">
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
            className={`border rounded-md px-3 py-2 w-full ${
              newFormData.body.length > BODY_CHAR_LIM
                ? "border-red-500 focus:outline-red-500"
                : ""
            }`}
            placeholder="Notification body"
          />
          <span
            className={`absolute bottom-1 right-2 text-sm ${
              newFormData.body.length > BODY_CHAR_LIM
                ? "text-red-500"
                : "text-gray-500"
            }`}
          >
            {newFormData.body.length}/{BODY_CHAR_LIM}
          </span>
        </div>

        {/* Checkboxes for tags */}
        <div className="mb-4">
          {/* TODO: add htmlFor=tags to label and id=tags for label */}
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Tags
          </label>
          <div>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="tags"
                data-testid="breaking-news-uid"
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
                data-testid="university-news-uid"
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
                data-testid="metro-uid"
                checked={newFormData.tags.includes("Metro")}
                onChange={handleCheckboxChange}
                className="form-checkbox"
              />
              <span className="ml-2">Metro</span>
            </label>
            <label className="inline-flex items-center ml-4">
              <input
                type="checkbox"
                name="tags"
                value="Sports"
                data-testid="sports-uid"
                checked={newFormData.tags.includes("Sports")}
                onChange={handleCheckboxChange}
                className="form-checkbox"
              />
              <span className="ml-2">Sports</span>
            </label>
            <label className="inline-flex items-center ml-4">
              <input
                type="checkbox"
                name="tags"
                value="Arts and Culture"
                data-testid="arts-and-culture-uid"
                checked={newFormData.tags.includes("Arts and Culture")}
                onChange={handleCheckboxChange}
                className="form-checkbox"
              />
              <span className="ml-2">Arts and Culture</span>
            </label>
            <label className="inline-flex items-center ml-4">
              <input
                type="checkbox"
                name="tags"
                value="Science and Research"
                data-testid="science-and-research-uid"
                checked={newFormData.tags.includes("Science and Research")}
                onChange={handleCheckboxChange}
                className="form-checkbox"
              />
              <span className="ml-2">Science and Research</span>
            </label>
            <label className="inline-flex items-center ml-4">
              <input
                type="checkbox"
                name="tags"
                value="Opinions"
                data-testid="opinions-uid"
                checked={newFormData.tags.includes("Opinions")}
                onChange={handleCheckboxChange}
                className="form-checkbox"
              />
              <span className="ml-2">Opinions</span>
            </label>
          </div>
        </div>

        {/* Input for URL */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="url"
          >
            Article URL
          </label>
          <input
            type="text"
            id="url"
            name="url"
            value={newFormData.url}
            onChange={handleInputChange}
            className="border rounded-md px-3 py-2 w-full"
            placeholder="https://www.browndailyherald.com/article/2024/09/sydney-skybetter-named-new-faculty-director-of-brown-arts-institute"
          />
        </div>

        {/* Author selection */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Authors
          </label>

          {/* Author search */}
          <div className="mb-2">
            <input
              type="text"
              placeholder="Search authors..."
              value={authorSearchTerm}
              onChange={(e) => setAuthorSearchTerm(e.target.value)}
              className="border rounded-md px-3 py-2 w-full mb-2"
            />
          </div>

          {/* Display authors */}
          <div className="max-h-40 overflow-y-auto border rounded-md p-2">
            {isLoadingAuthors ? (
              <p className="text-gray-500">Loading authors...</p>
            ) : authors.length === 0 ? (
              <p className="text-gray-500">No authors found</p>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {authors
                  .filter(
                    (author) =>
                      authorSearchTerm === "" ||
                      author.name
                        .toLowerCase()
                        .includes(authorSearchTerm.toLowerCase()) ||
                      author.slug
                        .toLowerCase()
                        .includes(authorSearchTerm.toLowerCase())
                  )
                  .map((author) => (
                    <label
                      key={author.id}
                      className="flex items-center p-1 hover:bg-gray-100 rounded"
                    >
                      <input
                        type="checkbox"
                        value={author.id}
                        checked={newFormData.authorIds.includes(author.id)}
                        onChange={handleAuthorChange}
                        className="form-checkbox mr-2"
                      />
                      <span>{author.name}</span>
                    </label>
                  ))}
              </div>
            )}
          </div>

          {/* Selected authors summary */}
          {newFormData.authorIds.length > 0 && (
            <div className="mt-2">
              <p className="text-sm font-medium">Selected authors:</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {newFormData.authorIds.map((authorId) => {
                  const author = authors.find((a) => a.id === authorId);
                  return author ? (
                    <span
                      key={author.id}
                      className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                    >
                      {author.name}
                    </span>
                  ) : null;
                })}
              </div>
            </div>
          )}
        </div>

        {/* Button to schedule notification */}
        <button
          type="button"
          onClick={handleScheduleNotification}
          className="bg-blue-500 text-white px-4 py-2 rounded-md transition transform duration-200 hover:bg-blue-600 hover:scale-105"
        >
          Schedule Notification
        </button>

        {/* Modal to confirm scheduling */}
        {isProduction && (
          <ConfirmationModal
            isOpen={isConfirmModalOpen}
            onClose={() => setIsConfirmModalOpen(false)}
            onConfirm={confirmScheduleNotification}
            message="Are you sure you want to schedule this notification to production?"
          />
        )}
      </form>
    </div>
  );
};

export default NotificationForm;
