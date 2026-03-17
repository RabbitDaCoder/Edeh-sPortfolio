import { db } from "../../config/db";
import { CreateCommentInput } from "./comment.schema";

export class CommentRepository {
  async findByBlogId(
    blogId: string,
    page: number,
    limit: number,
    approvedOnly: boolean = true,
  ) {
    const where: Record<string, unknown> = { blogId, parentId: null };
    if (approvedOnly) where.approved = true;

    const [comments, total] = await Promise.all([
      db.comment.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          replies: {
            where: approvedOnly ? { approved: true } : {},
            orderBy: { createdAt: "asc" },
          },
        },
      }),
      db.comment.count({ where }),
    ]);

    return { comments, total };
  }

  async countByBlogId(blogId: string) {
    return db.comment.count({
      where: { blogId, approved: true },
    });
  }

  async findById(id: string) {
    return db.comment.findUnique({
      where: { id },
    });
  }

  async create(
    blogId: string,
    data: CreateCommentInput,
    ipAddress?: string,
    userAgent?: string,
  ) {
    return db.comment.create({
      data: {
        blogId,
        name: data.name,
        email: data.email,
        website: data.website || null,
        body: data.body,
        parentId: data.parentId || null,
        approved: true,
        ipAddress: ipAddress || null,
        userAgent: userAgent || null,
      },
    });
  }

  async findAll(
    page: number,
    limit: number,
    status: "pending" | "approved" | "spam" | "all",
  ) {
    const where: Record<string, unknown> = {};
    if (status === "pending") {
      where.approved = false;
      where.spam = false;
    } else if (status === "approved") {
      where.approved = true;
    } else if (status === "spam") {
      where.spam = true;
    }

    const [comments, total] = await Promise.all([
      db.comment.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          blog: {
            select: { title: true, slug: true },
          },
        },
      }),
      db.comment.count({ where }),
    ]);

    return { comments, total };
  }

  async approve(id: string) {
    return db.comment.update({
      where: { id },
      data: { approved: true, spam: false },
    });
  }

  async markSpam(id: string) {
    return db.comment.update({
      where: { id },
      data: { spam: true, approved: false },
    });
  }

  async delete(id: string) {
    return db.comment.delete({
      where: { id },
    });
  }
}

export const commentRepository = new CommentRepository();
