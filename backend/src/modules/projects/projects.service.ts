import { projectRepository } from "./projects.repository";
import { cacheService } from "../../services/cache.service";
import { CreateProjectInput, UpdateProjectInput } from "./projects.schema";
import { AppError } from "../../middleware/errorHandler";
import { ErrorCode } from "../../utils/errorCodes";

export class ProjectService {
  async getProjects(published?: boolean) {
    const cacheKey = `projects:${published ?? "all"}`;
    const cached = await cacheService.get<any>(cacheKey);
    if (cached) return cached;

    const projects = await projectRepository.findAll(published);
    await cacheService.set(cacheKey, projects, 600);
    return projects;
  }

  async getProjectBySlug(slug: string) {
    const project = await projectRepository.findBySlug(slug);
    if (!project) throw new AppError(ErrorCode.PROJECT_NOT_FOUND);
    return project;
  }

  async createProject(data: CreateProjectInput) {
    const project = await projectRepository.create(data);
    await cacheService.invalidatePattern("projects:*");
    return project;
  }

  async updateProject(id: string, data: UpdateProjectInput) {
    const project = await projectRepository.findById(id);
    if (!project) throw new AppError(ErrorCode.PROJECT_NOT_FOUND);

    const updated = await projectRepository.update(id, data);
    await cacheService.invalidatePattern("projects:*");
    return updated;
  }

  async deleteProject(id: string) {
    const project = await projectRepository.findById(id);
    if (!project) throw new AppError(ErrorCode.PROJECT_NOT_FOUND);

    await projectRepository.delete(id);
    await cacheService.invalidatePattern("projects:*");
  }
}

export const projectService = new ProjectService();
