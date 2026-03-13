import { Request, Response, NextFunction } from "express";
import { contactService } from "./contact.service";
import { success } from "../../utils/apiResponse";

export async function submitContact(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const contact = await contactService.submitContact(req.body);
    success(res, contact, 201);
  } catch (err) {
    next(err);
  }
}

export async function getMessages(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const messages = await contactService.getMessages();
    success(res, messages);
  } catch (err) {
    next(err);
  }
}

export async function markAsRead(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { id } = req.params;
    const message = await contactService.markAsRead(id);
    success(res, message);
  } catch (err) {
    next(err);
  }
}

export async function deleteMessage(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { id } = req.params;
    await contactService.deleteMessage(id);
    success(res, { id });
  } catch (err) {
    next(err);
  }
}
