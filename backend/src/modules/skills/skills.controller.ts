import { Request, Response, NextFunction } from "express";
import { skillService } from "./skills.service";
import { success } from "../../utils/apiResponse";

export async function getSkills(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const skills = await skillService.getSkills();
    success(res, skills);
  } catch (err) {
    next(err);
  }
}

export async function createSkill(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const skill = await skillService.createSkill(req.body);
    success(res, skill, 201);
  } catch (err) {
    next(err);
  }
}

export async function updateSkill(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { id } = req.params;
    const skill = await skillService.updateSkill(id, req.body);
    success(res, skill);
  } catch (err) {
    next(err);
  }
}

export async function deleteSkill(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { id } = req.params;
    await skillService.deleteSkill(id);
    success(res, { id });
  } catch (err) {
    next(err);
  }
}
