import { bookRepository } from "./books.repository";
import { cacheService } from "../../services/cache.service";
import { CreateBookInput, UpdateBookInput } from "./books.schema";
import { AppError } from "../../middleware/errorHandler";
import { ErrorCode } from "../../utils/errorCodes";
import { logger } from "../../utils/logger";

const CACHE_TTL = 120;

export class BookService {
  async getBooks(page: number, limit: number, published?: boolean) {
    const cacheKey = `books:page:${page}:limit:${limit}${published !== undefined ? `:published:${published}` : ""}`;
    const cached = await cacheService.get<any>(cacheKey);
    if (cached) return cached;

    const { books, total } = await bookRepository.findMany(
      page,
      limit,
      published,
    );
    const response = { books, total };
    await cacheService.set(cacheKey, response, CACHE_TTL);
    return response;
  }

  async getFeaturedBooks(limit: number = 3) {
    const cacheKey = `books:featured:limit:${limit}`;
    const cached = await cacheService.get<any>(cacheKey);
    if (cached) return cached;

    const books = await bookRepository.findFeatured(limit);
    await cacheService.set(cacheKey, books, CACHE_TTL);
    return books;
  }

  async getBookBySlug(slug: string) {
    const cacheKey = `book:slug:${slug}`;
    const cached = await cacheService.get<any>(cacheKey);
    if (cached) return cached;

    const book = await bookRepository.findBySlug(slug);
    if (!book) throw new AppError(ErrorCode.BOOK_NOT_FOUND);

    await cacheService.set(cacheKey, book, CACHE_TTL);
    return book;
  }

  async createBook(data: CreateBookInput) {
    const book = await bookRepository.create(data);
    await this.invalidateCache();
    return book;
  }

  async updateBook(id: string, data: UpdateBookInput) {
    const book = await bookRepository.findById(id);
    if (!book) throw new AppError(ErrorCode.BOOK_NOT_FOUND);

    const updated = await bookRepository.update(id, data);
    await this.invalidateCache(`book:slug:${book.slug}`);
    return updated;
  }

  async deleteBook(id: string) {
    const book = await bookRepository.findById(id);
    if (!book) throw new AppError(ErrorCode.BOOK_NOT_FOUND);

    await bookRepository.delete(id);
    await this.invalidateCache(`book:slug:${book.slug}`);
  }

  async toggleFeatured(id: string) {
    const book = await bookRepository.findById(id);
    if (!book) throw new AppError(ErrorCode.BOOK_NOT_FOUND);

    const updated = await bookRepository.update(id, {
      featured: !book.featured,
    });
    await this.invalidateCache(`book:slug:${book.slug}`);
    return updated;
  }

  private async invalidateCache(slugKey?: string) {
    try {
      if (slugKey) await cacheService.del(slugKey);
      await cacheService.invalidatePattern("books:*");
    } catch (err) {
      logger.error({ err }, "Failed to invalidate books cache");
    }
  }
}

export const bookService = new BookService();
