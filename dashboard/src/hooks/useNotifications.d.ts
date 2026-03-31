export type Notification = {
    id: string;
    type: string;
    title: string;
    message: string;
    link?: string;
    read: boolean;
    createdAt: string;
};
export declare function useUnreadCount(): import("@tanstack/react-query").UseQueryResult<{
    count: number;
}, Error>;
export declare function useNotifications(enabled: boolean): import("@tanstack/react-query").UseQueryResult<{
    notifications: Notification[];
    unreadCount: number;
    total: number;
}, Error>;
export declare function useMarkRead(): import("@tanstack/react-query").UseMutationResult<any, Error, string, unknown>;
export declare function useMarkAllRead(): import("@tanstack/react-query").UseMutationResult<any, Error, void, unknown>;
//# sourceMappingURL=useNotifications.d.ts.map