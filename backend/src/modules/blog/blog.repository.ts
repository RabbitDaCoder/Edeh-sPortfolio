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

  async findMany(page: number, limit: number, published?: boolean) {
    const where = published !== undefined ? { published } : {};

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
}

export const blogRepository = new BlogRepository();
