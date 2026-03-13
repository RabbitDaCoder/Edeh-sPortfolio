import { Request, Response, NextFunction } from "express";
import { newsletterService } from "./newsletter.service";
import { success } from "../../utils/apiResponse";

export async function subscribe(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const subscriber = await newsletterService.subscribe(req.body);
    success(res, subscriber, 201);
  } catch (err) {
    next(err);
  }
}

export async function unsubscribe(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { email } = req.params;
    const subscriber = await newsletterService.unsubscribe(email);
    success(res, subscriber);
  } catch (err) {
    next(err);
  }
}

export async function getSubscribers(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const subscribers = await newsletterService.getSubscribers();
    success(res, subscribers);
  } catch (err) {
    next(err);
  }
}
