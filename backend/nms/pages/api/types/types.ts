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
  "Sports": boolean;
  "Arts and Culture": boolean;
  "Science and Research": boolean;
  "Opinion": boolean;
  expoPushToken: string;
};

export interface EditorPick {
  url: string;
}