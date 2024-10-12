// TODO: move this to a shared package between frontend and backend
// TODO: modify SQL query to not grab id because not needed
export interface Notification {
    id: string;
    time: string;
    title: string;
    body: string;
    status: string;
    url: string;
    isUid: boolean;
    "Breaking News": boolean;
    "University News": boolean;
    "Metro": boolean;
}