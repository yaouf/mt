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
  breakingNewsAlerts: boolean;
  weeklySummaryAlerts: boolean;
  expoPushToken: string;
};
