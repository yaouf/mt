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
  is_uid: boolean;
  categories?: string[];
};

export type Device = {
  id: number;
  expo_push_token: string;
  device_type: string;
  date_created: string;
  is_push_enabled: boolean;
  categories: string[];
};

export interface EditorPick {
  url: string;
  rank: number;
}
