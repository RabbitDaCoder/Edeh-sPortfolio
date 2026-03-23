import { commentRepository } from "./comment.repository";
import { blogRepository } from "../blog/blog.repository";
import { CreateCommentInput } from "./comment.schema";
import { AppError } from "../../middleware/errorHandler";
import { ErrorCode } from "../../utils/errorCodes";
import { logger } from "../../utils/logger";
import { notificationService } from "../../services/notification.service";

export class CommentService {
  async getComments(slug: string, page: number, limit: number) {
    const blog = await blogRepository.findBySlug(slug);
    if (!blog) {
      throw new AppError(ErrorCode.BLOG_NOT_FOUND);
    }

    const { comments, total } = await commentRepository.findByBlogId(
      blog.id,
      page,
      limit,
    );
    const commentCount = await commentRepository.countByBlogId(blog.id);

    return {
      comments,
      total,
      commentCount,
      commentsEnabled: blog.commentsEnabled,
    };
  }

  async createComment(
    slug: string,
    data: CreateCommentInput,
    ipAddress?: string,
    userAgent?: string,
  ) {
    const blog = await blogRepository.findBySlug(slug);
    if (!blog) {
      throw new AppError(ErrorCode.BLOG_NOT_FOUND);
    }

    if (!blog.commentsEnabled) {
      throw new AppError(ErrorCode.COMMENTS_DISABLED);
    }

    if (data.parentId) {
      const parent = await commentRepository.findById(data.parentId);
      if (!parent || parent.blogId !== blog.id) {
        throw new AppError(ErrorCode.COMMENT_NOT_FOUND);
      }
    }

    const comment = await commentRepository.create(
      blog.id,
      data,
      ipAddress,
      userAgent,
    );

    logger.info(
      { commentId: comment.id, blogSlug: slug },
      "New comment submitted for moderation",
    );

    // Fire notification — non-blocking
    const isReply = !!data.parentId;
    notificationService
      .create({
        type: isReply ? "blog_reply" : "blog_comment",
        title: isReply ? "New Reply on a Blog Post" : "New Blog Comment",
        message: `${data.name} ${isReply ? "replied to a comment" : "commented"} on "${blog.title}": "${data.body.slice(0, 100)}${data.body.length > 100 ? "..." : ""}"`,
        link: "/comments",
        commentId: comment.id,
      })
      .catch((err) =>
        logger.error({ err }, "Failed to create comment notification"),
      );

    return comment;
  }

  // Admin methods
  async getAdminComments(
    page: number,
    limit: number,
    status: "pending" | "approved" | "spam" | "all",
  ) {
    return commentRepository.findAll(page, limit, status);
  }

  async approveComment(id: string) {
    const comment = await commentRepository.findById(id);
    if (!comment) {
      throw new AppError(ErrorCode.COMMENT_NOT_FOUND);
    }

    const approved = await commentRepository.approve(id);
    logger.info({ commentId: id }, "Comment approved");
    return approved;
  }

  async markSpam(id: string) {
    const comment = await commentRepository.findById(id);
    if (!comment) {
      throw new AppError(ErrorCode.COMMENT_NOT_FOUND);
    }

    const spammed = await commentRepository.markSpam(id);
    logger.info({ commentId: id }, "Comment marked as spam");
    return spammed;
  }

  async deleteComment(id: string) {
    const comment = await commentRepository.findById(id);
    if (!comment) {
      throw new AppError(ErrorCode.COMMENT_NOT_FOUND);
    }

    await commentRepository.delete(id);
    logger.info({ commentId: id }, "Comment deleted");
  }

  async toggleComments(blogId: string) {
    const blog = await blogRepository.findById(blogId);
    if (!blog) {
      throw new AppError(ErrorCode.BLOG_NOT_FOUND);
    }

    const { db } = await import("../../config/db");
    const updated = await db.blog.update({
      where: { id: blogId },
      data: { commentsEnabled: !blog.commentsEnabled },
    });

    logger.info(
      { blogId, commentsEnabled: updated.commentsEnabled },
      "Blog comments toggled",
    );
    return updated;
  }
}

export const commentService = new CommentService();
