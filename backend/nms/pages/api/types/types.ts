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
  device_type: string;
  "Breaking News": boolean;
  "University News": boolean;
  Metro: boolean;
  Sports: boolean;
  "Arts and Culture": boolean;
  "Science and Research": boolean;
  Opinions: boolean;
  expo_push_token: string;
  date_created: string;
};

export interface EditorPick {
  url: string;
  rank: number;
}
