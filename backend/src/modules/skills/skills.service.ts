import { skillRepository } from "./skills.repository";
import { cacheService } from "../../services/cache.service";
import { CreateSkillInput, UpdateSkillInput } from "./skills.schema";
import { AppError } from "../../middleware/errorHandler";
import { ErrorCode } from "../../utils/errorCodes";
import { logger } from "../../utils/logger";

const CACHE_TTL = 600;

export class SkillService {
  async getSkills() {
    const cacheKey = "skills:all";
    const cached = await cacheService.get<any>(cacheKey);
    if (cached) return cached;

    const skills = await skillRepository.findAll();
    await cacheService.set(cacheKey, skills, CACHE_TTL);
    return skills;
  }

  async createSkill(data: CreateSkillInput) {
    const skill = await skillRepository.create(data);
    await this.refreshCache();
    return skill;
  }

  async updateSkill(id: string, data: UpdateSkillInput) {
    const skill = await skillRepository.findById(id);
    if (!skill) throw new AppError(ErrorCode.SKILL_NOT_FOUND);

    const updated = await skillRepository.update(id, data);
    await this.refreshCache();
    return updated;
  }

  async deleteSkill(id: string) {
    const skill = await skillRepository.findById(id);
    if (!skill) throw new AppError(ErrorCode.SKILL_NOT_FOUND);

    await skillRepository.delete(id);
    await this.refreshCache();
  }

  private async refreshCache() {
    try {
      await cacheService.del("skills:all");
      const skills = await skillRepository.findAll();
      await cacheService.set("skills:all", skills, CACHE_TTL);
    } catch (err) {
      logger.error({ err }, "Failed to refresh skills cache");
    }
  }
}

export const skillService = new SkillService();
