import { Request, Response, NextFunction } from "express";
import { articleService } from "./articles.service";
import { success } from "../../utils/apiResponse";
import { buildPaginatedResponse } from "../../utils/pagination";
import { GetArticlesQuery } from "./articles.schema";

export async function getArticles(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { page, limit, published } = req.query as any as GetArticlesQuery;
    const { articles, total } = await articleService.getArticles(
      page,
      limit,
      published,
    );
    const response = buildPaginatedResponse(articles, total, page, limit);
    success(res, response);
  } catch (err) {
    next(err);
  }
}

export async function getArticleBySlug(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { slug } = req.params;
    const article = await articleService.getArticleBySlug(slug);
    success(res, article);
  } catch (err) {
    next(err);
  }
}

export async function createArticle(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const article = await articleService.createArticle(req.body);
    success(res, article, 201);
  } catch (err) {
    next(err);
  }
}

export async function updateArticle(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { id } = req.params;
    const article = await articleService.updateArticle(id, req.body);
    success(res, article);
  } catch (err) {
    next(err);
  }
}

export async function deleteArticle(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { id } = req.params;
    await articleService.deleteArticle(id);
    success(res, { id });
  } catch (err) {
    next(err);
  }
}
