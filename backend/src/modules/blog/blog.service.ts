import { blogRepository } from "./blog.repository";
import { cacheService } from "../../services/cache.service";
import { CreateBlogInput, UpdateBlogInput } from "./blog.schema";
import { AppError } from "../../middleware/errorHandler";
import { ErrorCode } from "../../utils/errorCodes";
import { logger } from "../../utils/logger";

const CACHE_TTL = 600;

export class BlogService {
  async getBlogs(
    page: number,
    limit: number,
    published?: boolean,
    category?: string,
    featured?: boolean,
  ) {
    const cacheKey = `blogs:page:${page}:limit:${limit}${published !== undefined ? `:published:${published}` : ""}${category ? `:cat:${category}` : ""}${featured !== undefined ? `:featured:${featured}` : ""}`;

    const cached = await cacheService.get<any>(cacheKey);
    if (cached) {
      logger.debug({ cacheKey }, "Cache hit for blogs list");
      return cached;
    }

    const { blogs, total } = await blogRepository.findMany(
      page,
      limit,
      published,
      category,
      featured,
    );

    const response = { blogs, total };
    await cacheService.set(cacheKey, response, CACHE_TTL);

    return response;
  }

  async getFeaturedBlogs(limit: number = 3) {
    const cacheKey = `blogs:featured:limit:${limit}`;

    const cached = await cacheService.get<any>(cacheKey);
    if (cached) {
      logger.debug({ cacheKey }, "Cache hit for featured blogs");
      return cached;
    }

    const blogs = await blogRepository.findFeatured(limit);
    await cacheService.set(cacheKey, blogs, CACHE_TTL);
    return blogs;
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

    await cacheService.set(cacheKey, blog, CACHE_TTL);

    cacheService.increment(`blog:views:${blog.id}`, 300).catch((err) => {
      logger.error({ err }, "Failed to increment blog views");
    });

    return blog;
  }

  async createBlog(data: CreateBlogInput) {
    const blog = await blogRepository.create(data);
    await this.invalidateCache();
    return blog;
  }

  async updateBlog(id: string, data: UpdateBlogInput) {
    const blog = await blogRepository.findById(id);
    if (!blog) {
      throw new AppError(ErrorCode.BLOG_NOT_FOUND);
    }

    const updated = await blogRepository.update(id, data);
    await this.invalidateCache(`blog:slug:${blog.slug}`);

    return updated;
  }

  async deleteBlog(id: string) {
    const blog = await blogRepository.findById(id);
    if (!blog) {
      throw new AppError(ErrorCode.BLOG_NOT_FOUND);
    }

    await blogRepository.delete(id);
    await this.invalidateCache(`blog:slug:${blog.slug}`);
  }

  async toggleFeatured(id: string) {
    const blog = await blogRepository.findById(id);
    if (!blog) {
      throw new AppError(ErrorCode.BLOG_NOT_FOUND);
    }

    const updated = await blogRepository.update(id, {
      featured: !blog.featured,
    });
    await this.invalidateCache(`blog:slug:${blog.slug}`);
    return updated;
  }

  async getNextPost(slug: string) {
    const current = await blogRepository.findBySlug(slug);
    if (!current) {
      throw new AppError(ErrorCode.BLOG_NOT_FOUND);
    }
    return blogRepository.findNextPost(slug, current.createdAt);
  }

  private async invalidateCache(slugKey?: string) {
    try {
      if (slugKey) await cacheService.del(slugKey);
      await cacheService.invalidatePattern("blogs:*");
    } catch (err) {
      logger.error({ err }, "Failed to invalidate blog cache");
    }
  }
}

export const blogService = new BlogService();
