import { Request, Response, NextFunction } from "express";
import { authService } from "./auth.service";
import { success, error } from "../../utils/apiResponse";
import { ErrorCode } from "../../utils/errorCodes";

export async function register(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const result = await authService.register(req.body);
    success(res, result, 201);
  } catch (err) {
    next(err);
  }
}

export async function login(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const result = await authService.login(req.body);
    success(res, result);
  } catch (err) {
    next(err);
  }
}

export async function refreshToken(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const result = await authService.refreshToken(req.body);
    success(res, result);
  } catch (err) {
    next(err);
  }
}

export async function logout(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    await authService.logout(req.user!.id);
    success(res, { message: "Logged out successfully" });
  } catch (err) {
    next(err);
  }
}
