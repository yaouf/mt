export type ResponseData = {
  message: string;
};

export type RequestData = {
  jobId: number;
};

export type Notification = {
  id: number;
  time: string;
  title: string;
  body: string;
  url: string;
  status: string;
  isUid: boolean;
  tags?: string[];
  authors?: Author[]; // Optional array of author IDs
};

export type Device = {
  id: number;
  device_type: string;
  expo_push_token: string;
  date_created: Date | null;
  is_push_enabled: boolean;
  categories?: string[];
};

export type DeviceToken = {
  expo_push_token: string;
};

export type NotificationId = {
  id: number;
};

export interface EditorPick {
  url: string;
  rank: number;
}

export interface Author {
  id: number;
  name: string;
  slug: string;
  dateCreated?: string;
}

export interface DeviceAuthorSubscription {
  id: number;
  deviceId: string;
  authorId: number;
  dateCreated: string;
}

export interface NotificationAuthor {
  id: number;
  notificationId: number;
  authorId: number;
  dateCreated: string;
}
