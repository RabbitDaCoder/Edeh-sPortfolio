import { Request, Response, NextFunction } from "express";
import { projectService } from "./projects.service";
import { success } from "../../utils/apiResponse";

export async function getProjects(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { published } = req.query;
    const pub =
      published === "true" ? true : published === "false" ? false : undefined;
    const projects = await projectService.getProjects(pub);
    success(res, projects);
  } catch (err) {
    next(err);
  }
}

export async function getProjectBySlug(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { slug } = req.params;
    const project = await projectService.getProjectBySlug(slug);
    success(res, project);
  } catch (err) {
    next(err);
  }
}

export async function createProject(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const project = await projectService.createProject(req.body);
    success(res, project, 201);
  } catch (err) {
    next(err);
  }
}

export async function updateProject(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { id } = req.params;
    const project = await projectService.updateProject(id, req.body);
    success(res, project);
  } catch (err) {
    next(err);
  }
}

export async function deleteProject(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { id } = req.params;
    await projectService.deleteProject(id);
    success(res, { id });
  } catch (err) {
    next(err);
  }
}
