import { db } from "../../config/db";
import { CreateBlogInput, UpdateBlogInput } from "./blog.schema";

export class BlogRepository {
  async findById(id: string) {
    return db.blog.findUnique({
      where: { id },
    });
  }

  async findBySlug(slug: string) {
    return db.blog.findUnique({
      where: { slug },
    });
  }

  async findMany(
    page: number,
    limit: number,
    published?: boolean,
    category?: string,
    featured?: boolean,
  ) {
    const where: Record<string, unknown> = {};
    if (published !== undefined) where.published = published;
    if (category) where.category = category;
    if (featured !== undefined) where.featured = featured;

    const [blogs, total] = await Promise.all([
      db.blog.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      db.blog.count({ where }),
    ]);

    return { blogs, total };
  }

  async findFeatured(limit: number = 3) {
    return db.blog.findMany({
      where: { published: true, featured: true },
      take: limit,
      orderBy: { createdAt: "desc" },
    });
  }

  async create(data: CreateBlogInput) {
    return db.blog.create({
      data,
    });
  }

  async update(id: string, data: UpdateBlogInput) {
    return db.blog.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return db.blog.delete({
      where: { id },
    });
  }

  async incrementViews(id: string) {
    return db.blog.update({
      where: { id },
      data: { views: { increment: 1 } },
    });
  }

  async findNextPost(currentSlug: string, currentCreatedAt: Date) {
    const next = await db.blog.findFirst({
      where: {
        published: true,
        slug: { not: currentSlug },
        createdAt: { gt: currentCreatedAt },
      },
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        slug: true,
        title: true,
        excerpt: true,
        coverImage: true,
        readTime: true,
        createdAt: true,
        tags: true,
      },
    });

    if (next) return next;

    return db.blog.findFirst({
      where: {
        published: true,
        slug: { not: currentSlug },
      },
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        slug: true,
        title: true,
        excerpt: true,
        coverImage: true,
        readTime: true,
        createdAt: true,
        tags: true,
      },
    });
  }
}

export const blogRepository = new BlogRepository();
