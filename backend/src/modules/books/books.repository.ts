import { db } from "../../config/db";
import { CreateBookInput, UpdateBookInput } from "./books.schema";

export class BookRepository {
  async findById(id: string) {
    return db.book.findUnique({ where: { id } });
  }

  async findBySlug(slug: string) {
    return db.book.findUnique({ where: { slug } });
  }

  async findMany(page: number, limit: number, published?: boolean) {
    const where = published !== undefined ? { published } : {};
    const [books, total] = await Promise.all([
      db.book.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      db.book.count({ where }),
    ]);
    return { books, total };
  }

  async create(data: CreateBookInput) {
    return db.book.create({ data });
  }

  async update(id: string, data: UpdateBookInput) {
    return db.book.update({ where: { id }, data });
  }

  async delete(id: string) {
    return db.book.delete({ where: { id } });
  }
}

export const bookRepository = new BookRepository();
