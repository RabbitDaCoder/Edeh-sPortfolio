import { db } from "../../config/db";
import { CreateArticleInput, UpdateArticleInput } from "./articles.schema";

export class ArticleRepository {
  async findById(id: string) {
    return db.article.findUnique({ where: { id } });
  }

  async findBySlug(slug: string) {
    return db.article.findUnique({ where: { slug } });
  }

  async findMany(page: number, limit: number, published?: boolean) {
    const where = published !== undefined ? { published } : {};
    const [articles, total] = await Promise.all([
      db.article.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      db.article.count({ where }),
    ]);
    return { articles, total };
  }

  async create(data: CreateArticleInput) {
    return db.article.create({ data });
  }

  async update(id: string, data: UpdateArticleInput) {
    return db.article.update({ where: { id }, data });
  }

  async delete(id: string) {
    return db.article.delete({ where: { id } });
  }
}

export const articleRepository = new ArticleRepository();
