import { Request, Response, NextFunction } from "express";
import { commentService } from "./comment.service";
import { success } from "../../utils/apiResponse";
import { buildPaginatedResponse } from "../../utils/pagination";
import { GetCommentsQuery, AdminCommentsQuery } from "./comment.schema";

// Public
export async function getComments(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { slug } = req.params;
    const { page, limit } = req.query as any as GetCommentsQuery;
    const result = await commentService.getComments(slug, page, limit);

    const response = {
      ...buildPaginatedResponse(result.comments, result.total, page, limit),
      commentCount: result.commentCount,
      commentsEnabled: result.commentsEnabled,
    };
    success(res, response);
  } catch (err) {
    next(err);
  }
}

export async function createComment(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { slug } = req.params;
    const ipAddress = req.ip || req.socket.remoteAddress;
    const userAgent = req.get("user-agent");
    const comment = await commentService.createComment(
      slug,
      req.body,
      ipAddress,
      userAgent,
    );
    success(res, comment, 201);
  } catch (err) {
    next(err);
  }
}

// Admin
export async function getAdminComments(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { page, limit, status } = req.query as any as AdminCommentsQuery;
    const { comments, total } = await commentService.getAdminComments(
      page,
      limit,
      status,
    );
    const response = buildPaginatedResponse(comments, total, page, limit);
    success(res, response);
  } catch (err) {
    next(err);
  }
}

export async function approveComment(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { id } = req.params;
    const comment = await commentService.approveComment(id);
    success(res, comment);
  } catch (err) {
    next(err);
  }
}

export async function markCommentSpam(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { id } = req.params;
    const comment = await commentService.markSpam(id);
    success(res, comment);
  } catch (err) {
    next(err);
  }
}

export async function deleteComment(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { id } = req.params;
    await commentService.deleteComment(id);
    success(res, { id });
  } catch (err) {
    next(err);
  }
}

export async function toggleBlogComments(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { id } = req.params;
    const blog = await commentService.toggleComments(id);
    success(res, blog);
  } catch (err) {
    next(err);
  }
}
