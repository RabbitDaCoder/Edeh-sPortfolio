import { Request, Response, NextFunction } from "express";
import { bookService } from "./books.service";
import { success } from "../../utils/apiResponse";
import { buildPaginatedResponse } from "../../utils/pagination";
import { GetBooksQuery } from "./books.schema";

export async function getBooks(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { page, limit, published } = req.query as any as GetBooksQuery;
    const { books, total } = await bookService.getBooks(page, limit, published);
    const response = buildPaginatedResponse(books, total, page, limit);
    success(res, response);
  } catch (err) {
    next(err);
  }
}

export async function getBookBySlug(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { slug } = req.params;
    const book = await bookService.getBookBySlug(slug);
    success(res, book);
  } catch (err) {
    next(err);
  }
}

export async function createBook(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const book = await bookService.createBook(req.body);
    success(res, book, 201);
  } catch (err) {
    next(err);
  }
}

export async function updateBook(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { id } = req.params;
    const book = await bookService.updateBook(id, req.body);
    success(res, book);
  } catch (err) {
    next(err);
  }
}

export async function deleteBook(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { id } = req.params;
    await bookService.deleteBook(id);
    success(res, { id });
  } catch (err) {
    next(err);
  }
}
