export type ResponseData = {
  message: string;
};

export type Notification = {
  jobId: number;
  time: string;
  title: string;
  body: string;
  tags: string[];
};

export type Device = {
  deviceType: string;
  "Breaking News": boolean;
  "University News": boolean;
  "Metro": boolean;
  expoPushToken: string;
  dateCreated: string;
};

export interface EditorPick {
  url: string;
}