import { Router, Request, Response, NextFunction } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import { upload } from "../../middleware/upload";
import { cloudinaryService } from "../../services/cloudinary.service";
import { success } from "../../utils/apiResponse";
import { AppError } from "../../middleware/errorHandler";
import { ErrorCode } from "../../utils/errorCodes";

const router = Router();

router.post(
  "/image",
  authMiddleware,
  upload.single("image"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        throw new AppError(
          ErrorCode.VALIDATION_ERROR,
          "No image file provided",
        );
      }

      const result = await cloudinaryService.upload(req.file.buffer, {
        folder: "portfolio/images",
        resourceType: "image",
      });

      success(res, { url: result.url, publicId: result.publicId }, 201);
    } catch (err) {
      next(err);
    }
  },
);

export default router;
