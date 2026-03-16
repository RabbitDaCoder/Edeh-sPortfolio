import { bookRepository } from "./books.repository";
import { cacheService } from "../../services/cache.service";
import { CreateBookInput, UpdateBookInput } from "./books.schema";
import { AppError } from "../../middleware/errorHandler";
import { ErrorCode } from "../../utils/errorCodes";

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
    await cacheService.set(cacheKey, response, 300);
    return response;
  }

  async getFeaturedBooks(limit: number = 3) {
    const cacheKey = `books:featured:limit:${limit}`;
    const cached = await cacheService.get<any>(cacheKey);
    if (cached) return cached;

    const books = await bookRepository.findFeatured(limit);
    await cacheService.set(cacheKey, books, 300);
    return books;
  }

  async getBookBySlug(slug: string) {
    const cacheKey = `book:slug:${slug}`;
    const cached = await cacheService.get<any>(cacheKey);
    if (cached) return cached;

    const book = await bookRepository.findBySlug(slug);
    if (!book) throw new AppError(ErrorCode.BOOK_NOT_FOUND);

    await cacheService.set(cacheKey, book, 600);
    return book;
  }

  async createBook(data: CreateBookInput) {
    const book = await bookRepository.create(data);
    await cacheService.invalidatePattern("books:*");
    return book;
  }

  async updateBook(id: string, data: UpdateBookInput) {
    const book = await bookRepository.findById(id);
    if (!book) throw new AppError(ErrorCode.BOOK_NOT_FOUND);

    const updated = await bookRepository.update(id, data);
    await cacheService.del(`book:slug:${book.slug}`);
    await cacheService.invalidatePattern("books:*");
    return updated;
  }

  async deleteBook(id: string) {
    const book = await bookRepository.findById(id);
    if (!book) throw new AppError(ErrorCode.BOOK_NOT_FOUND);

    await bookRepository.delete(id);
    await cacheService.del(`book:slug:${book.slug}`);
    await cacheService.invalidatePattern("books:*");
  }

  async toggleFeatured(id: string) {
    const book = await bookRepository.findById(id);
    if (!book) throw new AppError(ErrorCode.BOOK_NOT_FOUND);

    const updated = await bookRepository.update(id, {
      featured: !book.featured,
    });
    await cacheService.del(`book:slug:${book.slug}`);
    await cacheService.invalidatePattern("books:*");
    return updated;
  }
}

export const bookService = new BookService();
