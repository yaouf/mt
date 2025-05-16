/**
 * Represents the structure of a response data object.
 * Used for sending a message in the response.
 */
export type ResponseData = {
  /**
   * Message describing the result or error.
   */
  message: string;
};

/**
 * Represents the structure of the request data.
 * Specifically used for job-related requests, containing the job ID.
 */
export type RequestData = {
  /**
   * The unique identifier for the job in the system.
   */
  jobId: number;
};

/**
 * Represents a notification object.
 * Includes details about a notification, such as its content, status, and associated categories.
 */
export type Notification = {
  /**
   * Unique identifier for the notification.
   */
  id: number;

  /**
   * The time when the notification was created or triggered.
   */
  time: string;

  /**
   * The title of the notification.
   */
  title: string;

  /**
   * The body content of the notification.
   */
  body: string;

  /**
   * The URL associated with the notification.
   */
  url: string;

  /**
   * The current status of the notification (e.g., "sent", "pending").
   */
  status: string;

  /**
   * Indicates whether the notification is related to a unique user.
   */
  is_uid: boolean;

  /**
   * The list of categories associated with the notification (optional).
   * Each notification can belong to multiple categories.
   */
  categories?: string[];
};

/**
 * Represents a device object in the system.
 * Contains information about the device, including its type, push notification token, and categories.
 */
export type Device = {
  /**
   * Unique identifier for the device.
   */
  id: number;

  /**
   * The type of the device (e.g., 'mobile', 'tablet', etc.).
   */
  device_type: string;

  /**
   * The Expo push token for sending push notifications to the device.
   */
  expo_push_token: string;

  /**
   * The date when the device was created or registered in the system.
   */
  date_created: Date | null;

  /**
   * Indicates whether push notifications are enabled on the device.
   */
  is_push_enabled: boolean;

  /**
   * The list of categories that the device is subscribed to (optional).
   */
  categories?: string[];
};

/**
 * Represents the structure for a device token.
 * Contains only the Expo push token, used to send notifications to specific devices.
 */
export type DeviceToken = {
  /**
   * The Expo push token for a device.
   */
  expo_push_token: string;
};

/**
 * Represents a notification ID.
 * This is used for identifying a specific notification when performing operations like deletion or updates.
 */
export type NotificationId = {
  /**
   * Unique identifier for the notification.
   */
  id: number;
};

/**
 * Represents an editor's pick.
 * This type is used to highlight a specific URL with a ranking value, commonly used for featured content.
 */
export interface EditorPick {
  /**
   * The URL that is being highlighted as an editor's pick.
   */
  url: string;

  /**
   * The rank or priority of the editor's pick.
   * Lower values represent higher priority or rank.
   */
  rank: number;
}
