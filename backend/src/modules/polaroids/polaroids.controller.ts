import { Request, Response, NextFunction } from "express";
import { polaroidService } from "./polaroids.service";
import { success } from "../../utils/apiResponse";

export async function getPolaroids(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { published } = req.query;
    const pub =
      published === "true" ? true : published === "false" ? false : undefined;
    const polaroids = await polaroidService.getPolaroids(pub);
    success(res, polaroids);
  } catch (err) {
    next(err);
  }
}

export async function getPolaroidById(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { id } = req.params;
    const polaroid = await polaroidService.getPolaroidById(id);
    success(res, polaroid);
  } catch (err) {
    next(err);
  }
}

export async function createPolaroid(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const polaroid = await polaroidService.createPolaroid(req.body);
    success(res, polaroid, 201);
  } catch (err) {
    next(err);
  }
}

export async function updatePolaroid(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { id } = req.params;
    const polaroid = await polaroidService.updatePolaroid(id, req.body);
    success(res, polaroid);
  } catch (err) {
    next(err);
  }
}

export async function deletePolaroid(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { id } = req.params;
    await polaroidService.deletePolaroid(id);
    success(res, { id });
  } catch (err) {
    next(err);
  }
}
