import { profileRepository } from "./profile.repository";
import { cacheService } from "../../services/cache.service";
import { UpdateProfileInput } from "./profile.schema";
import { AppError } from "../../middleware/errorHandler";
import { ErrorCode } from "../../utils/errorCodes";
import { logger } from "../../utils/logger";

const CACHE_TTL = 120;

export class ProfileService {
  async getProfile() {
    const cacheKey = "profile:site";
    const cached = await cacheService.get<any>(cacheKey);
    if (cached) return cached;

    const profile = await profileRepository.find();
    if (!profile) throw new AppError(ErrorCode.PROFILE_NOT_FOUND);

    await cacheService.set(cacheKey, profile, CACHE_TTL);
    return profile;
  }

  async updateProfile(data: UpdateProfileInput) {
    const profile = await profileRepository.upsert(data);
    try {
      await cacheService.del("profile:site");
      await cacheService.set("profile:site", profile, CACHE_TTL);
    } catch (err) {
      logger.error({ err }, "Failed to refresh profile cache");
    }
    return profile;
  }
}

export const profileService = new ProfileService();
