import { Request, Response, NextFunction } from "express";
import { profileService } from "./profile.service";
import { success } from "../../utils/apiResponse";

export async function getProfile(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const profile = await profileService.getProfile();
    success(res, profile);
  } catch (err) {
    next(err);
  }
}

export async function updateProfile(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const profile = await profileService.updateProfile(req.body);
    success(res, profile);
  } catch (err) {
    next(err);
  }
}
