import { Request, Response, NextFunction } from "express";
import { blogService } from "./blog.service";
import { success, error } from "../../utils/apiResponse";
import { ErrorCode } from "../../utils/errorCodes";
import { buildPaginatedResponse } from "../../utils/pagination";
import { GetBlogsQuery } from "./blog.schema";

export async function getBlogs(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { page, limit, published } = req.query as any as GetBlogsQuery;
    const { blogs, total } = await blogService.getBlogs(page, limit, published);

    const response = buildPaginatedResponse(blogs, total, page, limit);
    success(res, response);
  } catch (err) {
    next(err);
  }
}

export async function getBlogBySlug(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { slug } = req.params;
    const blog = await blogService.getBlogBySlug(slug);
    success(res, blog);
  } catch (err) {
    next(err);
  }
}

export async function createBlog(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const blog = await blogService.createBlog(req.body);
    success(res, blog, 201);
  } catch (err) {
    next(err);
  }
}

export async function updateBlog(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { id } = req.params;
    const blog = await blogService.updateBlog(id, req.body);
    success(res, blog);
  } catch (err) {
    next(err);
  }
}

export async function deleteBlog(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { id } = req.params;
    await blogService.deleteBlog(id);
    success(res, { id });
  } catch (err) {
    next(err);
  }
}
