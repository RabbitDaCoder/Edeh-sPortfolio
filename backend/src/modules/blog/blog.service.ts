import { blogRepository } from "./blog.repository";
import { cacheService } from "../../services/cache.service";
import { CreateBlogInput, UpdateBlogInput } from "./blog.schema";
import { AppError } from "../../middleware/errorHandler";
import { ErrorCode } from "../../utils/errorCodes";
import { logger } from "../../utils/logger";

export class BlogService {
  async getBlogs(page: number, limit: number, published?: boolean) {
    const cacheKey = `blogs:page:${page}:limit:${limit}${published !== undefined ? `:published:${published}` : ""}`;

    const cached = await cacheService.get<any>(cacheKey);
    if (cached) {
      logger.debug({ cacheKey }, "Cache hit for blogs list");
      return cached;
    }

    const { blogs, total } = await blogRepository.findMany(
      page,
      limit,
      published,
    );

    const response = { blogs, total };
    await cacheService.set(cacheKey, response, 300);

    return response;
  }

  async getBlogBySlug(slug: string) {
    const cacheKey = `blog:slug:${slug}`;

    const cached = await cacheService.get<any>(cacheKey);
    if (cached) {
      logger.debug({ cacheKey }, "Cache hit for blog");
      return cached;
    }

    const blog = await blogRepository.findBySlug(slug);
    if (!blog) {
      throw new AppError(ErrorCode.BLOG_NOT_FOUND);
    }

    await cacheService.set(cacheKey, blog, 600);

    cacheService.increment(`blog:views:${blog.id}`, 300).catch((err) => {
      logger.error({ err }, "Failed to increment blog views");
    });

    return blog;
  }

  async createBlog(data: CreateBlogInput) {
    const blog = await blogRepository.create(data);
    await cacheService.invalidatePattern("blogs:page:*");
    return blog;
  }

  async updateBlog(id: string, data: UpdateBlogInput) {
    const blog = await blogRepository.findById(id);
    if (!blog) {
      throw new AppError(ErrorCode.BLOG_NOT_FOUND);
    }

    const updated = await blogRepository.update(id, data);
    await cacheService.del(`blog:slug:${blog.slug}`);
    await cacheService.invalidatePattern("blogs:page:*");

    return updated;
  }

  async deleteBlog(id: string) {
    const blog = await blogRepository.findById(id);
    if (!blog) {
      throw new AppError(ErrorCode.BLOG_NOT_FOUND);
    }

    await blogRepository.delete(id);
    await cacheService.del(`blog:slug:${blog.slug}`);
    await cacheService.invalidatePattern("blogs:page:*");
  }
}

export const blogService = new BlogService();
