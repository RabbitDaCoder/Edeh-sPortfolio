import { projectRepository } from "./projects.repository";
import { cacheService } from "../../services/cache.service";
import { CreateProjectInput, UpdateProjectInput } from "./projects.schema";
import { AppError } from "../../middleware/errorHandler";
import { ErrorCode } from "../../utils/errorCodes";
import { logger } from "../../utils/logger";

const CACHE_TTL = 120;

export class ProjectService {
  async getProjects(published?: boolean) {
    const cacheKey = `projects:${published ?? "all"}`;
    const cached = await cacheService.get<any>(cacheKey);
    if (cached) return cached;

    const projects = await projectRepository.findAll(published);
    await cacheService.set(cacheKey, projects, CACHE_TTL);
    return projects;
  }

  async getProjectBySlug(slug: string) {
    const project = await projectRepository.findBySlug(slug);
    if (!project) throw new AppError(ErrorCode.PROJECT_NOT_FOUND);
    return project;
  }

  async createProject(data: CreateProjectInput) {
    const project = await projectRepository.create(data);
    await this.refreshCache();
    return project;
  }

  async updateProject(id: string, data: UpdateProjectInput) {
    const project = await projectRepository.findById(id);
    if (!project) throw new AppError(ErrorCode.PROJECT_NOT_FOUND);

    const updated = await projectRepository.update(id, data);
    await this.refreshCache();
    return updated;
  }

  async deleteProject(id: string) {
    const project = await projectRepository.findById(id);
    if (!project) throw new AppError(ErrorCode.PROJECT_NOT_FOUND);

    await projectRepository.delete(id);
    await this.refreshCache();
  }

  /** Invalidate all project cache keys and re-populate with fresh data */
  private async refreshCache() {
    try {
      await cacheService.invalidatePattern("projects:*");
      const projects = await projectRepository.findAll();
      await cacheService.set("projects:all", projects, CACHE_TTL);
    } catch (err) {
      logger.error({ err }, "Failed to refresh projects cache");
    }
  }
}

export const projectService = new ProjectService();
