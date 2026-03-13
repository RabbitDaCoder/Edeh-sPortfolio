import jwt from "jsonwebtoken";
import { authRepository } from "./auth.repository";
import { cacheService } from "../../services/cache.service";
import { RegisterInput, LoginInput, RefreshTokenInput } from "./auth.schema";
import { AppError } from "../../middleware/errorHandler";
import { ErrorCode } from "../../utils/errorCodes";
import { env } from "../../config/env";

export class AuthService {
  async register(input: RegisterInput) {
    const existing = await authRepository.findUserByEmail(input.email);
    if (existing) {
      throw new AppError(ErrorCode.EMAIL_ALREADY_EXISTS);
    }

    const user = await authRepository.createUser(input.email, input.password);
    const tokens = this.generateTokens(user.id, user.email, user.role);

    await authRepository.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      user: { id: user.id, email: user.email, role: user.role },
      ...tokens,
    };
  }

  async login(input: LoginInput) {
    const user = await authRepository.findUserByEmail(input.email);
    if (!user) {
      throw new AppError(ErrorCode.INVALID_CREDENTIALS);
    }

    const valid = await authRepository.verifyPassword(
      input.password,
      user.password,
    );
    if (!valid) {
      throw new AppError(ErrorCode.INVALID_CREDENTIALS);
    }

    const tokens = this.generateTokens(user.id, user.email, user.role);
    await authRepository.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      user: { id: user.id, email: user.email, role: user.role },
      ...tokens,
    };
  }

  async refreshToken(input: RefreshTokenInput) {
    try {
      const payload = jwt.verify(
        input.refreshToken,
        env.JWT_REFRESH_SECRET,
      ) as any;
      const user = await authRepository.findUserByEmail(payload.email);

      if (!user || user.refreshToken !== input.refreshToken) {
        throw new AppError(ErrorCode.INVALID_TOKEN);
      }

      const tokens = this.generateTokens(user.id, user.email, user.role);
      await authRepository.updateRefreshToken(user.id, tokens.refreshToken);

      return tokens;
    } catch {
      throw new AppError(ErrorCode.INVALID_TOKEN);
    }
  }

  async logout(userId: string) {
    await authRepository.clearRefreshToken(userId);
  }

  private generateTokens(userId: string, email: string, role: string) {
    const accessToken = jwt.sign({ id: userId, email, role }, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN,
    });

    const refreshToken = jwt.sign(
      { id: userId, email },
      env.JWT_REFRESH_SECRET,
      { expiresIn: env.JWT_REFRESH_EXPIRES_IN },
    );

    return { accessToken, refreshToken };
  }
}

export const authService = new AuthService();
