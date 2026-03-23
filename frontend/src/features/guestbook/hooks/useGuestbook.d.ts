export interface GuestbookEntry {
    id: string;
    name: string;
    handle?: string | null;
    message: string;
    pinned: boolean;
    country?: string | null;
    createdAt: string;
    isFirstPost?: boolean;
}
interface GuestbookPage {
    data: GuestbookEntry[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}
interface CreateGuestbookPayload {
    name: string;
    email: string;
    message: string;
    handle?: string;
}
export declare const guestbookKeys: {
    all: readonly ["guestbook"];
    list: () => readonly ["guestbook", "list"];
};
export declare function useGuestbookEntries(): import("@tanstack/react-query").UseInfiniteQueryResult<import("@tanstack/react-query").InfiniteData<GuestbookPage, unknown>, Error>;
export declare function useCreateGuestbookEntry(): import("@tanstack/react-query").UseMutationResult<any, Error, CreateGuestbookPayload, unknown>;
export {};
//# sourceMappingURL=useGuestbook.d.ts.map