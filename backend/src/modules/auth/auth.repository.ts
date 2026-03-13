import { db } from "../../config/db";
import bcryptjs from "bcryptjs";
import { env } from "../../config/env";

export class AuthRepository {
  async findUserByEmail(email: string) {
    return db.user.findUnique({
      where: { email: email.toLowerCase() },
    });
  }

  async createUser(email: string, password: string) {
    const hashedPassword = await bcryptjs.hash(
      password,
      env.BCRYPT_SALT_ROUNDS,
    );
    return db.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
      },
    });
  }

  async updateRefreshToken(userId: string, token: string) {
    return db.user.update({
      where: { id: userId },
      data: { refreshToken: token },
    });
  }

  async clearRefreshToken(userId: string) {
    return db.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
  }

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcryptjs.compare(password, hash);
  }
}

export const authRepository = new AuthRepository();
