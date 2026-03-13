import { skillRepository } from "./skills.repository";
import { cacheService } from "../../services/cache.service";
import { CreateSkillInput, UpdateSkillInput } from "./skills.schema";
import { AppError } from "../../middleware/errorHandler";
import { ErrorCode } from "../../utils/errorCodes";

export class SkillService {
  async getSkills() {
    const cacheKey = "skills:all";
    const cached = await cacheService.get<any>(cacheKey);
    if (cached) return cached;

    const skills = await skillRepository.findAll();
    await cacheService.set(cacheKey, skills, 600);
    return skills;
  }

  async createSkill(data: CreateSkillInput) {
    const skill = await skillRepository.create(data);
    await cacheService.del("skills:all");
    return skill;
  }

  async updateSkill(id: string, data: UpdateSkillInput) {
    const skill = await skillRepository.findById(id);
    if (!skill) throw new AppError(ErrorCode.SKILL_NOT_FOUND);

    const updated = await skillRepository.update(id, data);
    await cacheService.del("skills:all");
    return updated;
  }

  async deleteSkill(id: string) {
    const skill = await skillRepository.findById(id);
    if (!skill) throw new AppError(ErrorCode.SKILL_NOT_FOUND);

    await skillRepository.delete(id);
    await cacheService.del("skills:all");
  }
}

export const skillService = new SkillService();
