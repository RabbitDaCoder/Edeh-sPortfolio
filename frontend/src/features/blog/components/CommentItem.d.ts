import React from "react";
interface Comment {
    id: string;
    name: string;
    website?: string | null;
    body: string;
    createdAt: string;
    replies?: Comment[];
}
interface CommentItemProps {
    comment: Comment;
    onReply: (parentId: string) => void;
    depth?: number;
}
declare function CommentItemInner({ comment, onReply, depth }: CommentItemProps): import("react/jsx-runtime").JSX.Element;
declare const CommentItem: React.MemoExoticComponent<typeof CommentItemInner>;
export default CommentItem;
//# sourceMappingURL=CommentItem.d.ts.map