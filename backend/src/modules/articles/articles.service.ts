import { articleRepository } from "./articles.repository";
import { cacheService } from "../../services/cache.service";
import { CreateArticleInput, UpdateArticleInput } from "./articles.schema";
import { AppError } from "../../middleware/errorHandler";
import { ErrorCode } from "../../utils/errorCodes";
import { logger } from "../../utils/logger";

const CACHE_TTL = 600;

export class ArticleService {
  async getArticles(page: number, limit: number, published?: boolean) {
    const cacheKey = `articles:page:${page}:limit:${limit}${published !== undefined ? `:published:${published}` : ""}`;
    const cached = await cacheService.get<any>(cacheKey);
    if (cached) return cached;

    const { articles, total } = await articleRepository.findMany(
      page,
      limit,
      published,
    );
    const response = { articles, total };
    await cacheService.set(cacheKey, response, CACHE_TTL);
    return response;
  }

  async getArticleBySlug(slug: string) {
    const cacheKey = `article:slug:${slug}`;
    const cached = await cacheService.get<any>(cacheKey);
    if (cached) return cached;

    const article = await articleRepository.findBySlug(slug);
    if (!article) throw new AppError(ErrorCode.ARTICLE_NOT_FOUND);

    await cacheService.set(cacheKey, article, CACHE_TTL);
    return article;
  }

  async createArticle(data: CreateArticleInput) {
    const article = await articleRepository.create(data);
    await this.invalidateCache();
    return article;
  }

  async updateArticle(id: string, data: UpdateArticleInput) {
    const article = await articleRepository.findById(id);
    if (!article) throw new AppError(ErrorCode.ARTICLE_NOT_FOUND);

    const updated = await articleRepository.update(id, data);
    await this.invalidateCache(`article:slug:${article.slug}`);
    return updated;
  }

  async deleteArticle(id: string) {
    const article = await articleRepository.findById(id);
    if (!article) throw new AppError(ErrorCode.ARTICLE_NOT_FOUND);

    await articleRepository.delete(id);
    await this.invalidateCache(`article:slug:${article.slug}`);
  }

  private async invalidateCache(slugKey?: string) {
    try {
      if (slugKey) await cacheService.del(slugKey);
      await cacheService.invalidatePattern("articles:page:*");
    } catch (err) {
      logger.error({ err }, "Failed to invalidate articles cache");
    }
  }
}

export const articleService = new ArticleService();
