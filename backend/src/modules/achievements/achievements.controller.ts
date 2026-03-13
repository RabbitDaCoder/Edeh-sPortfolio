import { Request, Response, NextFunction } from "express";
import { achievementService } from "./achievements.service";
import { success } from "../../utils/apiResponse";

export async function getAchievements(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const achievements = await achievementService.getAchievements();
    success(res, achievements);
  } catch (err) {
    next(err);
  }
}

export async function createAchievement(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const achievement = await achievementService.createAchievement(req.body);
    success(res, achievement, 201);
  } catch (err) {
    next(err);
  }
}

export async function updateAchievement(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { id } = req.params;
    const achievement = await achievementService.updateAchievement(
      id,
      req.body,
    );
    success(res, achievement);
  } catch (err) {
    next(err);
  }
}

export async function deleteAchievement(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { id } = req.params;
    await achievementService.deleteAchievement(id);
    success(res, { id });
  } catch (err) {
    next(err);
  }
}
