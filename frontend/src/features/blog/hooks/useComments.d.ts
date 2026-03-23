interface Comment {
    id: string;
    blogId: string;
    name: string;
    email: string;
    website?: string | null;
    body: string;
    parentId: string | null;
    approved: boolean;
    createdAt: string;
    replies?: Comment[];
}
interface CommentsResponse {
    data: Comment[];
    commentCount: number;
    commentsEnabled: boolean;
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}
export declare const commentKeys: {
    all: readonly ["comments"];
    list: (slug: string, page: number) => readonly ["comments", string, number];
};
export declare function useComments(slug: string, page?: number, limit?: number): import("@tanstack/react-query").UseQueryResult<CommentsResponse, Error>;
interface CreateCommentPayload {
    name: string;
    email: string;
    website?: string;
    body: string;
    parentId?: string;
}
export declare function useCreateComment(slug: string): import("@tanstack/react-query").UseMutationResult<any, Error, CreateCommentPayload, unknown>;
export {};
//# sourceMappingURL=useComments.d.ts.map