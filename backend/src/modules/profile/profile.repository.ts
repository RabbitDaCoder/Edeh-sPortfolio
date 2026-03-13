import { db } from "../../config/db";
import { UpdateProfileInput } from "./profile.schema";

export class ProfileRepository {
  async find() {
    return db.siteProfile.findFirst();
  }

  async upsert(data: UpdateProfileInput) {
    const existing = await this.find();
    if (existing) {
      return db.siteProfile.update({ where: { id: existing.id }, data });
    }
    return db.siteProfile.create({
      data: {
        firstName: data.firstName ?? "Edeh",
        lastName: data.lastName ?? "Daniel",
        email: data.email ?? "edehchinedu59@gmail.com",
        ...data,
      },
    });
  }
}

export const profileRepository = new ProfileRepository();
