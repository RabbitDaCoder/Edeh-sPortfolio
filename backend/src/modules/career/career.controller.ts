import { Request, Response, NextFunction } from "express";
import { careerService } from "./career.service";
import { success } from "../../utils/apiResponse";

export async function getCareer(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { type } = req.query;
    const career = await careerService.getCareer(type as string | undefined);
    success(res, career);
  } catch (err) {
    next(err);
  }
}

export async function createCareer(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const career = await careerService.createCareer(req.body);
    success(res, career, 201);
  } catch (err) {
    next(err);
  }
}

export async function updateCareer(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { id } = req.params;
    const career = await careerService.updateCareer(id, req.body);
    success(res, career);
  } catch (err) {
    next(err);
  }
}

export async function deleteCareer(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { id } = req.params;
    await careerService.deleteCareer(id);
    success(res, { id });
  } catch (err) {
    next(err);
  }
}
