import { profileRepository } from "./profile.repository";
import { cacheService } from "../../services/cache.service";
import { UpdateProfileInput } from "./profile.schema";
import { AppError } from "../../middleware/errorHandler";
import { ErrorCode } from "../../utils/errorCodes";

export class ProfileService {
  async getProfile() {
    const cacheKey = "profile:site";
    const cached = await cacheService.get<any>(cacheKey);
    if (cached) return cached;

    const profile = await profileRepository.find();
    if (!profile) throw new AppError(ErrorCode.PROFILE_NOT_FOUND);

    await cacheService.set(cacheKey, profile, 600);
    return profile;
  }

  async updateProfile(data: UpdateProfileInput) {
    const profile = await profileRepository.upsert(data);
    await cacheService.del("profile:site");
    return profile;
  }
}

export const profileService = new ProfileService();
