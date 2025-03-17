// TODO: move this to a shared package between frontend and backend
export interface Notification {
    id: string;
    time: string;
    title: string;
    body: string;
    status: string;
    url: string;
    isUid: boolean;
    categories: string[];
}

export interface Author {
    id: number;
    name: string;
    slug: string;
}