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
    const { page, limit, published, category, featured } =
      req.query as any as GetBlogsQuery;
    const { blogs, total } = await blogService.getBlogs(
      page,
      limit,
      published,
      category,
      featured,
    );

    const response = buildPaginatedResponse(blogs, total, page, limit);
    success(res, response);
  } catch (err) {
    next(err);
  }
}

export async function getFeaturedBlogs(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const limit = req.query.limit ? Number(req.query.limit) : 3;
    const blogs = await blogService.getFeaturedBlogs(limit);
    success(res, blogs);
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

export async function getBlogById(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { id } = req.params;
    const blog = await blogService.getBlogById(id);
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

export async function toggleBlogFeatured(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { id } = req.params;
    const blog = await blogService.toggleFeatured(id);
    success(res, blog);
  } catch (err) {
    next(err);
  }
}

export async function getNextPost(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { slug } = req.params;
    const next_post = await blogService.getNextPost(slug);
    success(res, next_post);
  } catch (err) {
    next(err);
  }
}
